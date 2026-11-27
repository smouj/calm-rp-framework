# Verificación local y CI

**Revisado:** 27 de noviembre de 2026

GitHub Actions sufrió fallos de asignación de runner durante la revisión anterior. El workflow ya
ejecuta sus pasos: la ejecución más reciente de `main` comprobada fue
[#45724097467](https://github.com/smouj/calm-rp-framework/actions/runs/45724097467), con resultado
correcto sobre `be7b68db4a3421637620ec38b8be36d94beb1b53`. Cada pull request debe esperar el resultado
de su propio commit antes de fusionarse.

## Regla del proyecto

Para reproducir todos los controles localmente:

```bash
pnpm install --frozen-lockfile
bash scripts/verify-local.sh
```

Un código de salida 0 significa que lint, tipos, pruebas, formato, build y salvaguardas pasaron **en
esa máquina y revisión**. La verificación local ayuda durante el desarrollo; para fusionar, comprueba
también que CI haya terminado correctamente sobre el commit final del PR.

```bash
bash scripts/verify-local.sh --fast   # omite typecheck y build (iteración rápida)
```

## Qué comprueba

| Etapa                    | Comando                                     | Necesita red |
| ------------------------ | ------------------------------------------- | ------------ |
| toolchain                | `corepack prepare`                          | primera vez  |
| no proprietary artifacts | `scripts/check-no-proprietary-artifacts.sh` | no           |
| no secrets committed     | `scripts/check-no-secrets.sh`               | no           |
| site integrity           | `scripts/check-site-integrity.sh`           | no           |
| lint                     | `pnpm lint`                                 | no           |
| typecheck                | `pnpm typecheck`                            | no           |
| tests                    | `pnpm test`                                 | no           |
| format check             | `pnpm format:check`                         | no           |
| build                    | `pnpm build`                                | no           |

Las tres comprobaciones de higiene usan solo `bash`, `git` y `grep`, así que funcionan **aunque la
instalación de dependencias falle**. Son la red de seguridad de propiedad intelectual y secretos.

## Baseline de herramientas

- CI usa Node.js 22 y pnpm 10.34.5; `packageManager` fija la versión exacta de pnpm y el lockfile se
  instala con `--frozen-lockfile`.
- Se conserva Node.js 22 como baseline para que la versión de CI, `@types/node` y las herramientas
  evaluadas sigan alineadas. Node.js 22 continúa en LTS; las versiones LTS más recientes se revisarán
  en una actualización coordinada, no mediante un cambio aislado de CI. Consulta el
  [calendario oficial de versiones](https://nodejs.org/en/about/previous-releases).
- `pnpm audit` no encontró vulnerabilidades conocidas en la última revisión local. Ese resultado
  depende de la base de avisos disponible en el momento de la consulta.
- pnpm bloquea el script de instalación de `esbuild`. El binario de plataforma está en el lockfile;
  lint, tipos, pruebas y build se verifican sin ejecutar ese script. La política está descrita en
  [THIRD_PARTY_ARTIFACT_POLICY.md](./THIRD_PARTY_ARTIFACT_POLICY.md).

## Las pruebas de persistencia (desde F1)

- **Sin servidor ni Docker:** las suites de persistencia, personajes, sesiones, libro mayor y
  concurrencia ejecutan contra un motor **PostgreSQL embebido** (PostgreSQL real compilado a WASM,
  con clústeres temporales en disco). El gate local no necesita red, contenedores ni servicio
  externo. Los clústeres temporales se borran tras cada ejecución; si una corrida se interrumpe a
  la fuerza, conviene limpiar `/tmp/calm-*`.
- **Servidor real (opcional, multi-conexión):** con `DATABASE_URL` apuntando a una URL
  `postgres://`, la suite `tests/postgres-live.test.ts` ejecuta la misma aceptación contra un
  PostgreSQL real con conexiones concurrentes genuinas del pool `pg`:

  ```bash
  cp .env.example .env
  # Edita .env: configura POSTGRES_PASSWORD con 64 caracteres hexadecimales aleatorios.
  docker compose -f infrastructure/docker/compose.yml up -d
  DATABASE_URL=postgresql://gta6_rp:YOUR_LOCAL_HEX_PASSWORD@localhost:5432/gta6_rp pnpm vitest run tests/postgres-live.test.ts
  ```

  Sin esa variable (o si contiene otra cosa, p. ej. una ruta de archivo) la suite local se omite
  limpiamente. El workflow de CI provisiona PostgreSQL 17 y establece `DATABASE_URL`, por lo que la
  suite multi-conexión se ejecuta en cada validación alojada. La imagen está fijada por digest.

- La migración `0004_ledger_transaction_finalization.sql` aborta intencionadamente si encuentra
  transacciones previas vacías o descuadradas. Antes de aplicarla a una base existente, conserva
  una copia de seguridad y revisa cualquier fallo; no elimina ni corrige automáticamente el historial.

## Por qué esto protege el tema legal

- `check-no-proprietary-artifacts.sh` bloquea extensiones y nombres de artefactos conocidos en el
  índice de Git y entre los archivos no ignorados, y busca enlaces de descarga en documentación
  indexada. No inspecciona contenido de archivos ni cubre rutas ignoradas o el historial; es una
  barrera parcial, no una garantía legal ni un análisis antimalware.
- `check-site-integrity.sh` exige que la web siga mostrando los avisos de no afiliación, MIT y
  no autorización. Si alguien los borra, la verificación local falla.

## Antes de fusionar o publicar una versión

1. Ejecutar `pnpm check`, `pnpm build` y las salvaguardas sobre la revisión exacta.
2. Revisar que todos los checks de CI del commit final hayan pasado.
3. Para cambios de publicación, revisar también la procedencia de los archivos y el historial de Git;
   los escáneres de rutas no sustituyen una auditoría de contenido ni de adjuntos.
4. Mantener una revisión jurídica y de marcas independiente; este proyecto no presupone autorización
   para integrar con GTA VI.

La disponibilidad de CI y la publicación del sitio no cambian el estado de la integración con GTA VI,
que sigue bloqueada hasta que haya autorización y contratos de runtime verificables.
