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

## Evidencia del producto CALM y límites de integración

Este repositorio contiene los requisitos RP propios de CALM, su simulador y evidencia de producto basada en declaraciones oficiales y mecánicas públicas. Los contratos de preparación del runtime fallan de forma segura: no inventan comandos de GTA VI. La investigación de ports no oficiales para PC, herramientas de ingeniería inversa y detalles de frameworks externos se mantiene en documentación independiente; no define la arquitectura, dependencias ni APIs de CALM.

- [Mecánicas de GTA VI observadas por la prensa y consecuencias de diseño](./docs/research/GTA6_RP_MECHANICS_2026-11-25.md)
- [Sistemas de la campaña de GTA VI y observaciones públicas sobre su implementación](./docs/research/GTA6_INTERNAL_SYSTEMS_2026-11-27.md)
- [Estado actual de plataformas y runtime de GTA VI](./docs/research/PLATFORM_STATUS.md)
- [Registro de evidencia oficial para CALM](./docs/research/FIRST_PARTY_EVIDENCE_2026-11-24.md)
- [Análisis preliminar de interoperabilidad, licencias y propiedad intelectual](./docs/legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md)
- [Normativa europea y española relevante para interoperabilidad y copyright](./docs/legal/LEGAL_BASIS_ARTICLES_2026-11-24.md) — referencias de investigación, no un dictamen jurídico.
- [Verificación local: el gate autoritativo, sin depender del CI alojado](./docs/operations/LOCAL_VERIFICATION.md)

El alcance técnico de CALM es su framework RP. Los estudios externos de compatibilidad son contexto documental; no demuestran una interfaz de juego compatible ni autorización para operar un servidor multijugador.

## Nuestro objetivo

Construir **CALM Essentials** para una futura vía de roleplay en GTA VI: sistemas basados en las mecánicas observables del juego y en la comunidad de CALM, como identidad, economía, objetos transportados y almacenamiento en vehículos o propiedades. El simulador valida las reglas de CALM antes de que exista un runtime de juego. Los colaboradores mejoran estos sistemas específicos, la seguridad y la investigación; no crean una base genérica para otros juegos ni copian frameworks de GTA V.

CALM no usa ESX/QBCore/Qbox ni FiveM como modelo de producto, plano de arquitectura u objetivo de compatibilidad. La experiencia pública de GTA VI y las declaraciones de sus desarrolladores pueden orientar requisitos originales de CALM; no revelan APIs multijugador autorizadas ni las entrañas propietarias del juego. Damos la bienvenida a desarrolladores, artistas, testers, documentalistas, especialistas de seguridad y fans. No usamos archivos del juego, material filtrado, nombres de funciones nativas, direcciones ni firmas internas como contratos de CALM.

**Cualquier persona puede contribuir:** programación, pruebas, seguridad, documentación, diseño, accesibilidad e investigación con fuentes públicas. Las aportaciones se revisan mediante solicitudes de integración.

- [ADR-0009 — objetivo GTA VI y límites de evidencia](./docs/adr/0009-gta-vi-first-product-scope.md)
- [Auditoría verificada del código actual: existente y pendiente](./docs/PROJECT_SCOPE.md)
- [Propuesta original de contratos de CALM](./docs/architecture/CALM_ESSENTIALS_SERVICE_CONTRACTS_PROPOSAL.md)
- [Límite de diseño para la progresión de personajes](./docs/server/CHARACTER_PROGRESSION.md)
- [Guía en español de arquitectura y simulador](./docs/community/SIMULATOR_GUIDE.es.md)

## Estado del proyecto

F2 está implementada y aceptada: CALM tiene un servicio autenticado y un repositorio PostgreSQL para sus propias reglas RP de objetos transportados y almacenamiento. El simulador ejecuta un flujo sintético de transporte, almacenamiento en vehículos, recuperación e intercambio. El commit final del PR #59 pasó el [CI alojado #227](https://github.com/smouj/calm-rp-framework/actions/runs/46014326377) y `main`, tras la fusión, pasó el [#228](https://github.com/smouj/calm-rp-framework/actions/runs/46014689610), ambas con la suite de concurrencia de PostgreSQL 17 real; las modificaciones futuras siguen sujetas a ese gate. Nada de esto se conecta con GTA VI ni lee archivos del juego. Consulta la [referencia del prototipo en memoria](./docs/server/INVENTORY_REFERENCE.md), la [decisión de diseño F2](./docs/adr/0008-persistent-inventory-containers.md) y el [registro de fuentes oficiales](./docs/research/FIRST_PARTY_EVIDENCE_2026-11-24.md).

- **F1 completada:** personajes, sesiones y economía persistentes sobre PostgreSQL — UUID unificados, sesiones autenticadas, contabilidad de doble entrada atómica e idempotente y API local de operador con límites y auditoría. El PR #61 pasó CI exacto y `main` (#232/#233), y la incidencia [#32](https://github.com/smouj/calm-rp-framework/issues/32) está cerrada. No incluye inicio de sesión público de jugadores ni integración con GTA VI.
- **Implementado como referencia:** reglas de personajes, economía e inventario en memoria (con pruebas), contratos, tipos de dominio y simulador determinista básico.
- **F2 completada y aceptada:** servicio y repositorio transaccionales, autorización de personaje/contenedor, idempotencia, límites de capacidad, recibos inmutables, flujo sintético del simulador y recuperación tras reinicio. El PR #59 pasó el CI exacto (#227) y el CI de `main` (#228) con PostgreSQL 17; la incidencia [#54](https://github.com/smouj/calm-rp-framework/issues/54) está cerrada. No es una integración del inventario de GTA VI.
- **Infraestructura:** PostgreSQL (`packages/persistence`: runner de migraciones, pool `pg` y motor de verificación embebido), infraestructura local y pruebas automatizadas. La API de operador local de F1 está implementada; no existe transporte público de jugadores ni adaptador del juego.
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
