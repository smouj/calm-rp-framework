<div align="center">

# GTA VI RP Platform

**Una base comunitaria de código abierto para el futuro roleplay de Grand Theft Auto VI.**

[![CI](https://github.com/smouj/gta6-rp-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/smouj/gta6-rp-platform/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-275D88.svg)](./LICENSE)
[![Fase del proyecto](https://img.shields.io/badge/fase-investigacion_y_prototipos-D98B5F.svg)](./docs/roadmap/ROADMAP.md)
[![Contribuciones abiertas](https://img.shields.io/badge/contribuciones-bienvenidas-326E74.svg)](./CONTRIBUTING.es.md)
[![Comunidad en Discord](https://img.shields.io/badge/Discord-comunidad-5865F2?logo=discord&logoColor=white)](https://discord.com/invite/BVWXWY5eUT)
[![Multijugador de GTA VI](https://img.shields.io/badge/multijugador%20GTA%20VI-no%20disponible-555555.svg)](./docs/server/RUNTIME_REQUIREMENTS.md)

**[English](./README.md) · [Español](./README.es.md) · [Contribuir](./CONTRIBUTING.es.md) · [Código de conducta](./CODE_OF_CONDUCT.es.md) · [Soporte](./SUPPORT.es.md) · [Hoja de ruta](./docs/roadmap/ROADMAP.md) · [Discord comunitario](https://discord.com/invite/BVWXWY5eUT)**

</div>

> [!IMPORTANT]
> **Todavía no es jugable.** Este repositorio no ofrece ningún cliente o servidor multijugador de GTA VI, instalador ni modificación funcional. Es un proyecto independiente de aficionados que desarrolla sistemas de roleplay y se prepara para una posible integración **futura, legítima y autorizada**. No es un FiveM para GTA VI funcional ni un producto oficial de Rockstar.

## Funciones públicas y revisión legal (24 de noviembre de 2026)

El proyecto distingue las funciones oficiales **FiveM/Qbox** de las interfaces aún desconocidas de **GTA VI**. El núcleo de rol incorpora contratos originales y capacidades explícitas del adaptador; las capacidades reales de GTA VI siguen sin verificar.

- [Matriz de funciones, eventos y conceptos técnicos](./docs/research/FUNCTIONS_AND_INTERFACES_MATRIX_2026-11-24.md)
- [Análisis preliminar de interoperabilidad, licencias y propiedad intelectual](./docs/legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md)
- [Referencias de investigación técnica de RAGE 9](./docs/research/GTA6_RESEARCH_2026-11-24.md)
- [Versiones comprobadas de herramientas de terceros](./docs/research/THIRD_PARTY_TOOLS_SNAPSHOT_2026-11-24.md)

**Importante:** estudiar documentación de ingeniería inversa no concede permiso para publicar archivos filtrados, reutilizar código protegido ni poner en marcha servidores GTA VI no autorizados. No hay integración jugable.

## Nuestro objetivo

Crear entre todos una **plataforma abierta de roleplay inspirada en las posibilidades de FiveM**, con GTA VI como aspiración a largo plazo.

Podemos construir ya lógica de personajes, economía, inventarios, propiedades, empleos, administración, simulación, herramientas y pruebas sin depender de archivos del juego. La integración real con GTA VI solo podrá abordarse si existe una vía técnica y jurídica verificable.

**Cualquier persona puede contribuir:** programación, pruebas, seguridad, documentación, diseño, accesibilidad e investigación con fuentes públicas. Las aportaciones se revisan mediante solicitudes de integración.

## Estado del proyecto

La rama de desarrollo incluye una **referencia de inventario en memoria** con comprobaciones de propiedad, capacidad, transferencias e idempotencia. No tiene persistencia ni conexión con GTA VI. Consulta la [referencia de inventario](./docs/server/INVENTORY_REFERENCE.md) y el [registro de fuentes oficiales](./docs/research/FIRST_PARTY_EVIDENCE_2026-11-24.md).

- **Implementado parcialmente:** monorrepositorio TypeScript, contratos, tipos de dominio y simulador básico.
- **Preparado como estructura:** API, PostgreSQL, infraestructura local y pruebas automatizadas.
- **Investigación:** arquitectura y conceptos públicos de FiveM/Cfx, sin asumir compatibilidad con GTA VI.
- **Bloqueado:** adaptador real de GTA VI, cliente multijugador y servidor jugable.

Rockstar anunció el lanzamiento del juego en consolas el **19 de noviembre de 2026**, pero eso **no confirma** soporte para servidores comunitarios. [Fuente oficial](https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available).

**Estado de CI alojado:** las ejecuciones recientes de `main` fallaron antes de que GitHub asignara un runner y no ejecutaron ningún paso. Las comprobaciones locales pasaron durante esta auditoría de lanzamiento; consulta las [ejecuciones del flujo de CI](https://github.com/smouj/gta6-rp-platform/actions/workflows/ci.yml) para ver el estado actual.

La estructura conocida de algunos archivos del juego puede inspirar decisiones de diseño, pero no confirma una interfaz de desarrollo ni autorización para distribuir modificaciones.

## Planificación espacial independiente

El simulador incluye un [catálogo espacial](./docs/server/WORLD_SPATIAL_READINESS.md) de prueba, en memoria y con escenarios ficticios. Define ubicaciones, espacios de coordenadas, jerarquías e interiores sin utilizar mapas, archivos, rutas ni funciones reales de GTA VI. Consulta la [propuesta ADR-0005](./docs/adr/0005-independent-world-planning.md).

## Desarrollo local

Necesitas Node.js 22+ y pnpm 10.34.5. No necesitas GTA VI.

```bash
git clone https://github.com/smouj/gta6-rp-platform.git
cd gta6-rp-platform
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install --frozen-lockfile
pnpm check
```

Para iniciar la infraestructura local (opcional):

```bash
docker compose -f infrastructure/docker/compose.yml up -d
```

`pnpm check` ejecuta análisis de código, comprobaciones de tipos, pruebas y verificación del formato. **No inicia un servidor de GTA VI.**

## Participar

1. Lee [la guía para contribuir en español](./CONTRIBUTING.es.md), el [código de conducta](./CODE_OF_CONDUCT.md) y la [gobernanza](./GOVERNANCE.md).
2. Consulta las [incidencias](https://github.com/smouj/gta6-rp-platform/issues) y las propuestas abiertas.
3. Crea una bifurcación del repositorio, implementa un cambio acotado con pruebas y envía una [solicitud de integración](https://github.com/smouj/gta6-rp-platform/pulls).
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
