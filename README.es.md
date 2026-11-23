<div align="center">

# GTA VI RP Platform

**Una base comunitaria de código abierto para el futuro roleplay de Grand Theft Auto VI.**

[![CI](https://github.com/smouj/gta6-rp-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/smouj/gta6-rp-platform/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-275D88.svg)](./LICENSE)
[![Fase del proyecto](https://img.shields.io/badge/fase-investigacion_y_prototipos-D98B5F.svg)](./docs/roadmap/ROADMAP.md)
[![Contribuciones abiertas](https://img.shields.io/badge/contribuciones-bienvenidas-326E74.svg)](./CONTRIBUTING.md)

**[English](./README.md) · [Español](./README.es.md) · [Contribuir](./CONTRIBUTING.md) · [Hoja de ruta](./docs/roadmap/ROADMAP.md)**

</div>

> [!IMPORTANT]
> **Todavía no es jugable.** Este repositorio no ofrece ningún cliente o servidor multijugador de GTA VI, instalador ni modificación funcional. Es un proyecto independiente de aficionados que desarrolla sistemas de roleplay y se prepara para una posible integración **futura, legítima y autorizada**. No es un FiveM para GTA VI funcional ni un producto oficial de Rockstar.

## Nuestro objetivo

Crear entre todos una **plataforma abierta de roleplay inspirada en las posibilidades de FiveM**, con GTA VI como aspiración a largo plazo.

Podemos construir ya lógica de personajes, economía, inventarios, propiedades, empleos, administración, simulación, herramientas y pruebas sin depender de archivos del juego. La integración real con GTA VI solo podrá abordarse si existe una vía técnica y jurídica verificable.

**Cualquier persona puede contribuir:** programación, pruebas, seguridad, documentación, diseño, accesibilidad e investigación con fuentes públicas. Las aportaciones se revisan mediante solicitudes de integración.

## Estado del proyecto

- **Implementado parcialmente:** monorrepositorio TypeScript, contratos, tipos de dominio y simulador básico.
- **Preparado como estructura:** API, PostgreSQL, infraestructura local y pruebas automatizadas.
- **Investigación:** arquitectura y conceptos públicos de FiveM/Cfx, sin asumir compatibilidad con GTA VI.
- **Bloqueado:** adaptador real de GTA VI, cliente multijugador y servidor jugable.

Rockstar anunció el lanzamiento del juego en consolas el **19 de noviembre de 2026**, pero eso **no confirma** soporte para servidores comunitarios. [Fuente oficial](https://www.rockstargames.com/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available).

La estructura conocida de algunos archivos del juego puede inspirar decisiones de diseño, pero no confirma una interfaz de desarrollo ni autorización para distribuir modificaciones.

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

Consulta [TRADEMARKS.md](./TRADEMARKS.md), las [directrices de Rockstar](https://www.rockstargames.com/es/community-resources/mod-guidelines) y su [política sobre RP](https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers). Esta declaración de atribución **no sustituye ningún permiso** del titular de los derechos.
