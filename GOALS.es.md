# Metas de mejora — Repositorio y sitio comunitario

**Estado:** registro de mejora ACTIVO
**Creado:** 2026-11-25
**Compañero de:** [ROADMAP.md](./docs/roadmap/ROADMAP.md) (dirección del producto). Este archivo fija metas de calidad del repositorio y del sitio de GitHub Pages, cada una con línea base verificada y criterio de éxito comprobable.

Toda afirmación de la línea base se comprobó el 25/11/2026 contra el sitio publicado y contra el propio repositorio; el método de verificación acompaña a cada afirmación.

## Línea base verificada (25/11/2026)

- **Pages está publicado y sirviendo**: `https://smouj.github.io/calm-rp-framework/`, `/legal.html` y los recursos referenciados respondieron HTTP 200 (comprobación directa en vivo).
- **El sitio en vivo sirve el contenido anterior**: aún muestra la demo «Laboratorio» retirada, porque el commit local que la sustituye por la panorámica de ingeniería verificada aún no se ha fusionado ni publicado.
- **La coherencia de paleta se mantiene**: cada token de color de `site/assets/styles.css` coincide con la paleta documentada en `docs/branding/PROJECT_IDENTITY.md`, y el fondo del banner índigo está verificado por píxel como `#1B1C3A`.
- **La estrella del banner es blanca, inclinada y de cinco puntas** (punta larga hacia la derecha): verificado por análisis de píxeles y por una descripción independiente con modelo de visión.
- **El set de iconos divergía del banner antes de este lote**: `favicon.svg` y `logo.svg` usaban una estrella salmón rellena y texto Georgia, no la estrella del banner.
- **Las afirmaciones del sitio son ciertas**: existen 11 suites Vitest y el árbol del monorepo mostrado coincide con los directorios reales `packages/`, `apps/`, `adapters/`, `infrastructure/` y `tests/`.
- **El flujo de despliegue es válido**: `.github/workflows/pages.yml` parsea correctamente y se dispara con cambios en `site/**` sobre `main`.

## Metas

### G1 — Publicar el trabajo pendiente del sitio

**Objetivo:** fusionar y desplegar la panorámica de ingeniería verificada y el lote de iconos derivado del banner oficial.
**Hecho cuando:** la portada publicada muestre la sección «Ingeniería», los recursos nuevos respondan HTTP 200 y el flujo `Deploy community site` haya terminado con éxito una vez tras la fusión.
**Responsable:** el propietario del repositorio (acceso de escritura); el lote está en la rama local `feat/site-engineering-section`, listo para revisión.

### G2 — Una sola marca en todas las superficies

**Objetivo:** que la misma estrella del banner de los README aparezca en todas las superficies: pestaña del navegador, marcadores, pantalla de inicio de iOS y vistas previas sociales.
**Aplicado en este lote:** set de favicon trazado desde los píxeles del banner (IoU 0,96 frente al núcleo real), `apple-touch-icon.png` y `og-image.png` compuesto con el banner completo; la política de identidad registra la derivación.
**Hecho cuando:** G1 esté publicado y el icono se vea en cada contexto; cualquier cambio futuro de marca actualiza banner, favicon y README en el mismo commit.

### G3 — Mantener la información publicada contrastada y verificada

**Objetivo:** que cada afirmación pública (sitio, README) siga siendo comprobable contra el repositorio.
**Método:** las barreras existentes ya lo imponen en parte (`tests/site-hygiene.test.ts`, `scripts/check-site-integrity.sh`, `bash scripts/verify-local.sh`); la nota de estado de `site/README.md` registra el estado de publicación con fecha y método.
**Hecho cuando:** las barreras pasen en cada cambio y las notas de estado lleven fecha de verificación y método.

### G4 — Higiene de ramas según BRANCH_RETIREMENT.md

**Objetivo:** volver al modelo de rama única `main` documentado en `docs/operations/BRANCH_RETIREMENT.md`.
**Bloqueado por:** acceso de escritura (las ramas rancias locales y sus remotas no se pueden borrar sin él).
**Hecho cuando:** `brand/palette-coherence`, `docs/*`, `feat/site-logo`, `test/simulator-player-directory` y `smouj-patch-1` se borren tras confirmar que su contenido está fusionado u obsoleto, y solo quede `main`.

### G5 — Triage de Issues y PRs abiertos

**Objetivo:** ninguna incidencia o PR rancio; cada elemento abierto con responsable y paso de verificación.
**Bloqueado por:** acceso a la API del repositorio para listar, comentar y cerrar.
**Hecho cuando:** se registre una nota de triage con fecha (el patrón del repositorio para esto es `docs/operations/PR24_CI_TRIAGE.md`).

### G6 — Reverificar tras la publicación

**Objetivo:** tras el despliegue de G1, actualizar `docs/operations/GITHUB_PAGES_DEPLOYMENT.md` con la lista nueva de recursos y las comprobaciones HTTP 200.
**Hecho cuando:** ese documento registre la fecha del despliegue y cada recurso nuevo respondiendo 200.

## Restricciones permanentes (sin cambios)

- Las afirmaciones publicadas se verifican antes de escribirse; la barrera local `bash scripts/verify-local.sh` es la comprobación autoritativa y el CI alojado es una comodidad.
- Sin activos de Rockstar/Take-Two/Cfx.re, sin material filtrado y sin afirmaciones de compatibilidad inventadas; la licencia MIT cubre solo el contenido original.
- El sitio permanece estático e informativo: no ejecuta el núcleo TypeScript ni persiste datos.
- Los niveles de evidencia (confirmación oficial / observación de terceros / reproducción independiente / inferencia) siguen acompañando a cualquier afirmación de investigación, como se practica en `docs/research/`.
