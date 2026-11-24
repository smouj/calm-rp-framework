param([switch]$Apply)
$ErrorActionPreference = 'Stop'
$repo = 'smouj/calm-rp-framework'

function GitHub([string[]]$Arguments) {
    $result = & gh @Arguments
    if ($LASTEXITCODE -ne 0) { throw "GitHub CLI failed: gh $($Arguments -join ' ')" }
    return $result
}

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI (gh) is required.' }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'Git is required.' }

$details = GitHub @('api', "repos/$repo", '--jq', '.full_name')
if ($details.Trim() -ne $repo) { throw 'Repository verification failed.' }
$open = GitHub @('api', "repos/$repo/pulls?state=open&per_page=100", '--jq', 'length')
if ([int]$open -gt 0) { throw 'Open pull requests exist; review and merge/close them first.' }
$branches = @(GitHub @('api', "repos/$repo/branches?per_page=100", '--paginate', '--jq', '.[].name') | Where-Object { $_ -and $_ -ne 'main' })
Write-Host "Historical branches in $repo ($($branches.Count)):"
$branches | ForEach-Object { Write-Host " - $_" }
if ($branches.Count -eq 0) { Write-Host 'Only main remains.'; exit 0 }
if (-not $Apply) {
    Write-Host 'Preview only. Run with -Apply to back up first and request explicit deletion approval.'
    exit 0
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $HOME "gta6-rp-branch-backup-$stamp"
$mirror = Join-Path $backup 'mirror.git'
$bundle = Join-Path $backup 'all-refs.bundle'
New-Item -ItemType Directory -Path $backup -Force | Out-Null
Write-Host "Backing up the private repository into $backup ..."
& git clone --mirror "https://github.com/$repo.git" $mirror
if ($LASTEXITCODE -ne 0) { throw 'Mirror clone failed. No remote branches were deleted.' }
& git -C $mirror bundle create $bundle --all
if ($LASTEXITCODE -ne 0 -or -not (Test-Path $bundle)) { throw 'Bundle failed. No remote branches were deleted.' }
& git -C $mirror bundle verify $bundle
if ($LASTEXITCODE -ne 0) { throw 'Bundle verification failed. No remote branches were deleted.' }
Write-Host "Private backup verified: $bundle"
Write-Host 'WARNING: this bundle may contain private history. Do not upload or publish it.'
$confirm = Read-Host 'Type exactly BORRAR RAMAS to delete ALL listed remote branches except main'
if ($confirm -cne 'BORRAR RAMAS') { Write-Host 'Cancelled. The private backup was kept.'; exit 0 }

$failed = @()
foreach ($branch in $branches) {
    if ($branch -eq 'main') { continue }
    & gh api -X DELETE "repos/$repo/git/refs/heads/$branch" | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Could not delete $branch"
        $failed += $branch
    } else { Write-Host "Deleted $branch" }
}
$remaining = @(GitHub @('api', "repos/$repo/branches?per_page=100", '--paginate', '--jq', '.[].name'))
Write-Host "Remaining remote branches: $($remaining -join ', ')"
if ($failed.Count -gt 0) { throw "Deletion failed for: $($failed -join ', ')" }
if ($remaining.Count -ne 1 -or $remaining[0] -ne 'main') { throw 'Not all historical branches are gone.' }
Write-Host 'Verified: only main remains on the remote.'
