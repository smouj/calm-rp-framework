<div align="center">

<img
  width="860"
  alt="Banner social original de CALM para el proyecto de roleplay GTA VI: palabra CALM blanca sobre una escena retro en rosa y navy"
  src="./site/assets/banner-calm-social.png"
/>

# CALM — Proyecto de roleplay para GTA VI

**CALM Essentials** — un **proyecto original de roleplay centrado en GTA VI**, de código abierto.

CALM se diseña específicamente para el roleplay alrededor de las mecánicas observables de GTA VI. No es un framework genérico, un port de ESX/QBCore/Qbox ni una arquitectura de GTA V/FiveM. La versión publicada de GTA VI es actualmente una experiencia de un jugador para PlayStation 5 y Xbox Series X|S; este repositorio no implementa un runtime multijugador o una interfaz de PC autorizados para GTA VI. El simulador verifica reglas propias de CALM: no emula el juego ni demuestra compatibilidad. CALM no está afiliado a Rockstar Games; la revisión de marca sigue pendiente.

[![CI](https://github.com/smouj/calm-rp-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/smouj/calm-rp-framework/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-101020.svg)](./LICENSE)
[![Fase del proyecto](https://img.shields.io/badge/fase-investigacion_y_prototipos-D05070.svg)](./docs/roadmap/ROADMAP.md)
[![Contribuciones abiertas](https://img.shields.io/badge/contribuciones-bienvenidas-F06080.svg)](./CONTRIBUTING.es.md)
[![Comunidad en Discord](https://img.shields.io/badge/Discord-comunidad-5865F2?logo=discord&logoColor=white)](https://discord.com/invite/BVWXWY5eUT)
[![Multijugador de GTA VI](https://img.shields.io/badge/multijugador%20GTA%20VI-no%20disponible-555555.svg)](./docs/server/RUNTIME_REQUIREMENTS.md)

**[English](./README.md) · [Español](./README.es.md) · [Contribuir](./CONTRIBUTING.es.md) · [Código de conducta](./CODE_OF_CONDUCT.es.md) · [Soporte](./SUPPORT.es.md) · [Hoja de ruta](./docs/roadmap/ROADMAP.md) · [Metas](./GOALS.es.md) · [Discord comunitario](https://discord.com/invite/BVWXWY5eUT)**

</div>

> [!IMPORTANT]
> **No es jugable ni está conectado a GTA VI.** Este repositorio no ofrece un cliente o servidor multijugador, instalador ni modificación funcional. Desarrolla los sistemas de roleplay propios de CALM para GTA VI. La integración real queda bloqueada hasta que exista un runtime de GTA VI documentado y autorizado. No es FiveM para GTA VI ni un producto oficial de Rockstar.

## Interfaces públicas, evidencia e investigación externa (27 de noviembre de 2026)

El núcleo de CALM se define con dominios y contratos propios. La documentación de FiveM/Qbox solo sirve como referencia externa para comparar conceptos; no demuestra compatibilidad ni describe las interfaces desconocidas de GTA VI.

- [Matriz de funciones, eventos y conceptos técnicos](./docs/research/FUNCTIONS_AND_INTERFACES_MATRIX_2026-11-24.md)
- [Matriz de capacidades de GTA VI — catálogo verificado de investigación de RAGE 9](./docs/research/GTA6_CAPABILITY_MATRIX_2026-11-25.md)
- [Avances de ejecución de GTA VI en PC — VIctory, XCL, el DMCA de Leonida y por qué no son una interfaz](./docs/research/GTA6_EXECUTION_PROGRESS_2026-11-25.md)
- [Borrador de hilo sobre la ejecución de Xbox en PC](./docs/research/X_THREAD_GTA6_PORT_2026-11-27.md) — resume afirmaciones públicas y limita las conclusiones; no es una guía de integración de CALM.
- [Auditoría de código de VIctory — capa de compatibilidad, red sin conexión e implicaciones para CALM](./docs/research/VICTORY_SOURCE_AUDIT_2026-11-26.md)
- [Mecánicas de GTA VI observadas por la prensa y consecuencias de diseño](./docs/research/GTA6_RP_MECHANICS_2026-11-25.md)
- [Sistemas de la campaña de GTA VI y observaciones públicas sobre su implementación](./docs/research/GTA6_INTERNAL_SYSTEMS_2026-11-27.md)
- [Análisis preliminar de interoperabilidad, licencias y propiedad intelectual](./docs/legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md)
- [Normativa europea y española relevante para interoperabilidad y copyright](./docs/legal/LEGAL_BASIS_ARTICLES_2026-11-24.md) — referencias de investigación, no un dictamen jurídico.
- [Verificación local: el gate autoritativo, sin depender del CI alojado](./docs/operations/LOCAL_VERIFICATION.md)
- [Referencias de investigación técnica de RAGE 9](./docs/research/GTA6_RESEARCH_2026-11-24.md)
- [Versiones comprobadas de herramientas de terceros](./docs/research/THIRD_PARTY_TOOLS_SNAPSHOT_2026-11-24.md)

**Importante:** estudiar documentación de ingeniería inversa no concede permiso para publicar archivos filtrados, reutilizar código protegido ni poner en marcha servidores GTA VI no autorizados. No hay integración jugable.

## Nuestro objetivo

Construir **CALM Essentials** para una futura vía de roleplay en GTA VI: sistemas basados en las mecánicas observables del juego y en la comunidad de CALM, como identidad, economía, objetos transportados y almacenamiento en vehículos o propiedades. El simulador valida las reglas de CALM antes de que exista un runtime de juego. Los colaboradores mejoran estos sistemas específicos, la seguridad y la investigación; no crean una base genérica para otros juegos ni copian frameworks de GTA V.

CALM no usa ESX/QBCore/Qbox ni FiveM como modelo de producto, plano de arquitectura u objetivo de compatibilidad. La experiencia pública de GTA VI y las declaraciones de sus desarrolladores pueden orientar requisitos originales de CALM; no revelan APIs multijugador autorizadas ni las entrañas propietarias del juego. Damos la bienvenida a desarrolladores, artistas, testers, documentalistas, especialistas de seguridad y fans. No usamos archivos del juego, material filtrado, nombres de funciones nativas, direcciones ni firmas internas como contratos de CALM.

**Cualquier persona puede contribuir:** programación, pruebas, seguridad, documentación, diseño, accesibilidad e investigación con fuentes públicas. Las aportaciones se revisan mediante solicitudes de integración.

- [ADR-0009 — objetivo GTA VI y límites de evidencia](./docs/adr/0009-gta-vi-first-product-scope.md)
- [Auditoría verificada del código actual: existente y pendiente](./docs/PROJECT_SCOPE.md)
- [Propuesta de contratos de CALM y comparación con frameworks externos](./docs/architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md)
- [Límite de diseño para la progresión de personajes](./docs/server/CHARACTER_PROGRESSION.md)
- [Guía en español de arquitectura y simulador](./docs/community/SIMULATOR_GUIDE.es.md)

## Estado del proyecto

F2 ya incluye un servicio autenticado y un repositorio PostgreSQL para los objetos transportados y almacenados del modelo RP propio de CALM. El simulador ejecuta un flujo sintético de transportar, guardar en un vehículo, recuperar e intercambiar objetos. Las pruebas locales cubren reinicio embebido y rollback; la suite de concurrencia con PostgreSQL 17 real sigue siendo un gate obligatorio del CI alojado. Nada de esto se conecta con GTA VI ni lee archivos del juego. Consulta la [referencia de inventario](./docs/server/INVENTORY_REFERENCE.md), la [decisión de diseño F2](./docs/adr/0008-persistent-inventory-containers.md) y el [registro de fuentes oficiales](./docs/research/FIRST_PARTY_EVIDENCE_2026-11-24.md).

- **Base F1 entregada:** personajes, sesiones y economía persistentes sobre PostgreSQL — UUID unificados, sesiones autenticadas y contabilidad de doble entrada atómica e idempotente. El cierre más amplio de F1 sigue abierto en [#32](https://github.com/smouj/calm-rp-framework/issues/32): API/transporte, auditoría atribuible de operaciones privilegiadas, límites de solicitudes, pruebas de fallos y revisión del modelo de amenazas.
- **Implementado como referencia:** reglas de personajes, economía e inventario en memoria (con pruebas), contratos, tipos de dominio y simulador determinista básico.
- **En curso (F2 GTA VI RP):** servicio y repositorio transaccionales, autorización de personaje/contenedor, idempotencia, límites de capacidad, auditoría de movimientos, flujo sintético del simulador y prueba de reinicio embebido. La carrera multi-conexión con PostgreSQL 17 se exige en CI antes de fusionar. No es una integración del inventario de GTA VI.
- **Preparado como estructura:** API, PostgreSQL (`packages/persistence`: runner de migraciones, pool `pg`, motor de verificación embebido), infraestructura local y pruebas automatizadas.
- **Investigación:** arquitectura y conceptos públicos de FiveM/Cfx, sin asumir compatibilidad con GTA VI.
- **Bloqueado:** adaptador real de GTA VI, cliente multijugador y servidor jugable.

Rockstar describe el juego publicado como una experiencia de un jugador y anunció su lanzamiento en PS5 y Xbox Series X|S el **19 de noviembre de 2026**. Eso no confirma una versión de PC ni soporte para servidores comunitarios. [Anuncio oficial](https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available) · [Plataformas oficiales](https://support.rockstargames.com/articles/4QfG4FmZCf5W1gS8jy4UVT/grand-theft-auto-vi-platform-editions-and-versions).

**El CI alojado es el gate para fusionar.** Ejecuta las comprobaciones completas y la suite viva de PostgreSQL 17 en cada pull request. Si la suite viva se omite en local, eso no cuenta como verificación de PostgreSQL. Consulta las [ejecuciones actuales del CI](https://github.com/smouj/calm-rp-framework/actions/workflows/ci.yml) para el commit candidato.

Las mecánicas observadas en el juego publicado y las declaraciones públicas de sus desarrolladores pueden orientar el diseño de CALM. Analizar archivos filtrados no crea una interfaz autorizada ni permite distribuir modificaciones.

## Planificación espacial sintética para el diseño de GTA VI RP

El simulador incluye un [catálogo espacial](./docs/server/WORLD_SPATIAL_READINESS.md) de prueba, en memoria y con escenarios ficticios. Define ubicaciones, espacios de coordenadas, jerarquías e interiores sin utilizar mapas, archivos, rutas ni funciones reales de GTA VI. Consulta la [propuesta ADR-0005](./docs/adr/0005-independent-world-planning.md).

## Desarrollo local

Necesitas Node.js 22+ y pnpm 10.34.5. No necesitas GTA VI.

```bash
git clone https://github.com/smouj/calm-rp-framework.git
cd calm-rp-framework
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install --frozen-lockfile
pnpm check
```

Para iniciar la infraestructura local (opcional):

1. Copia `.env.example` a `.env` y establece una contraseña hexadecimal aleatoria de 64 caracteres para `POSTGRES_PASSWORD`.
   El archivo `.env` está excluido de Git. No reutilices esta clave en producción.
2. Inicia los servicios:

```bash
docker compose -f infrastructure/docker/compose.yml up -d
```

`pnpm check` ejecuta análisis de código, comprobaciones de tipos, pruebas y verificación del formato. **No inicia un servidor de GTA VI.**

## Sitio web y nombre del proyecto

El sitio informativo está en [`site/`](./site/README.md), con un [aviso legal autónomo](./site/legal.html). La publicación en GitHub Pages requiere ajustes y un despliegue exitoso. Los nombres de trabajo son **CALM** y **CALM Essentials**. **No está acreditado que sean marcas exclusivas o estén libres de conflictos**: FINOS emplea CALM para una especificación de software y Calm.com para servicios y productos informáticos. Consulta la [decisión y las comprobaciones pendientes](./docs/branding/FRAMEWORK_NAMING_OPTIONS.md). Los paquetes y APIs mantienen sus identificadores actuales por compatibilidad.

## Participar

1. Lee [la guía para contribuir en español](./CONTRIBUTING.es.md), el [código de conducta](./CODE_OF_CONDUCT.md) y la [gobernanza](./GOVERNANCE.md).
2. Consulta las [incidencias](https://github.com/smouj/calm-rp-framework/issues) y las propuestas abiertas.
3. Crea una bifurcación del repositorio, implementa un cambio acotado con pruebas y envía una [solicitud de integración](https://github.com/smouj/calm-rp-framework/pulls).
4. Nunca incluyas archivos propietarios del juego, filtraciones, contraseñas o datos personales.

## Documentación

- [Alcance y objetivos](./docs/PROJECT_SCOPE.md)
- [Arquitectura](./ARCHITECTURE.md)
- [Hoja de ruta](./docs/roadmap/ROADMAP.md)
- [Requisitos de GTA VI todavía sin confirmar](./docs/server/RUNTIME_REQUIREMENTS.md)
- [Investigación y fuentes](./docs/research/PLATFORM_STATUS.md)
- [Preguntas frecuentes](./docs/community/FAQ.md)
- [Guía de contribución en español](./CONTRIBUTING.es.md)
- [Licencia MIT](./LICENSE)
- [Seguridad](./SECURITY.md)
- [Lista de comprobación para publicación](./docs/community/PUBLIC_LAUNCH_CHECKLIST.md)

## Derechos de autor y ausencia de afiliación

**Proyecto no oficial creado por aficionados. No existe afiliación, patrocinio ni respaldo de Rockstar Games, Take-Two Interactive o Cfx.re.** Grand Theft Auto, GTA VI, sus nombres, marcas, logotipos, personajes, imágenes, sonidos y demás materiales protegidos pertenecen a sus respectivos titulares, incluidos Rockstar Games y Take-Two Interactive, que conservan sus derechos.

La [licencia MIT](./LICENSE) cubre únicamente el **código y la documentación originales** de este repositorio; no concede derechos sobre el videojuego ni sobre las marcas de Rockstar. No distribuimos ejecutables, claves ni contenido extraído de GTA VI, ni afirmamos disponer de autorización para alojar multijugador.

Consulta [TRADEMARKS.md](./TRADEMARKS.md), las [directrices de Rockstar](https://www.rockstargames.com/es/community-resources/mod-guidelines), su [política sobre RP](https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers) y las [condiciones de Creator Platform](https://fivem.net/terms/). Esta declaración de atribución **no sustituye ningún permiso** del titular de los derechos.
