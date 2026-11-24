# Verificación local primero (sin dependencia de GitHub Actions)

**Fecha:** 24 de noviembre de 2026
**Motivo:** el plan gratuito de la cuenta agotó el saldo de Actions. Los jobs de CI fallan **antes de
asignar un runner** (0 pasos, ~2 s), así que no validan nada. La verificación no puede depender de
ese servicio.

## Regla del proyecto

El gate autoritativo es **local**:

```bash
pnpm install --frozen-lockfile
bash scripts/verify-local.sh
```

Exit 0 significa que lint, tipos, tests, formato, build y las comprobaciones de higiene han pasado
**en esa máquina y en esa revisión**. Un check verde de GitHub Actions no sustituye a esto; GitHub
Actions pasa a ser un extra cuando hay cuota, nunca el requisito.

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

## Por qué esto protege el tema legal

- `check-no-proprietary-artifacts.sh` **falla el build** si aparece un `.rpf`, `.rpf9`, `.exe`, un
  volcado del juego o un enlace a una descarga filtrada. Es la garantía ejecutable de lo que dice
  `docs/legal/LEGAL_BASIS_ARTICLES_2026-11-24.md` §4.
- `check-site-integrity.sh` exige que la web siga mostrando los avisos de no afiliación, MIT y
  no autorización. Si alguien los borra, el build falla.

## GitHub Actions: estado y papel actual

- `ci.yml` y `pages.yml` siguen en el repositorio, con permisos mínimos y acciones fijadas por SHA.
- **No ejecutan nada útil hoy** por falta de cuota del plan.
- No se deben relajar ni desactivar para "que salgan verdes": un check que no corre no prueba nada.
- Cuando vuelva la cuota (o el repositorio pase a un plan/público elegible), los workflows funcionarán
  sin cambios de código.

## Antes de hacer público el repositorio

1. `bash scripts/verify-local.sh` en verde sobre la revisión exacta.
2. Revisión del historial completo de Git (no solo del árbol actual) con
   `docs/operations/PR24_CI_TRIAGE.md` y `docs/legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md`.
3. Decisión explícita del propietario sobre visibilidad, plan y Pages.

La visibilidad **no** es un requisito técnico para nada de lo anterior, ni para el adaptador de GTA VI
que sigue bloqueado por diseño.
