# Cómo contribuir a GTA VI RP Platform

Este proyecto es una iniciativa comunitaria de código abierto que busca construir sistemas de roleplay independientes del juego y prepararse para una posible integración legítima con GTA VI.

**Puede colaborar cualquier persona:** programadores, diseñadores, personas que realizan pruebas, investigadores, traductores y aficionados.

## Primeros pasos

1. Lee el [README en español](./README.es.md), el [código de conducta](./CODE_OF_CONDUCT.md) y el [alcance](./docs/PROJECT_SCOPE.md).
2. Busca una [incidencia](https://github.com/smouj/gta6-rp-platform/issues) pequeña que puedas solucionar o propón una tarea concreta.
3. Crea una bifurcación (fork) y una rama con un nombre como `docs/traduccion-readme` o `test/simulador-personajes`.
4. Añade pruebas si cambias el comportamiento del código, y explica lo que has comprobado.
5. Ejecuta `pnpm check`, abre una solicitud de integración y atiende la revisión.

## Preparar el proyecto

Se necesita Node.js 22+ y pnpm 10.34.5. **No necesitas comprar, instalar ni extraer GTA VI.**

```bash
git clone https://github.com/TU_USUARIO/gta6-rp-platform.git
cd gta6-rp-platform
corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm install --frozen-lockfile
pnpm check
```

La infraestructura con Docker es opcional. Las pruebas disponibles no demuestran compatibilidad multijugador con GTA VI.

## Qué aportaciones son especialmente útiles

- Pruebas deterministas del simulador y de las reglas de dominio.
- Mejoras de documentación, traducción, accesibilidad y ejemplos.
- Correcciones de seguridad o validación de entradas (notificadas de manera privada cuando proceda).
- Investigación contrastada con enlaces a las fuentes oficiales y fechas.
- Propuestas de arquitectura reducidas a casos de uso verificables.

## Qué no debes subir

- Archivos del juego, modelos, texturas, música, ejecutables, claves, shaders extraídos o material filtrado.
- Contraseñas, tokens, direcciones privadas, bases de datos personales o registros que los contengan.
- Interfaces o funciones atribuidas a GTA VI sin documentación pública que las confirme.
- Logotipos y gráficos oficiales de Rockstar utilizados como identidad propia.

Utiliza datos ficticios creados para las pruebas. Los colaboradores deben tener derecho a publicar su contribución bajo la [licencia MIT](./LICENSE) del proyecto. Esa licencia no incluye los derechos de Rockstar.

## Calidad, seguridad y revisión

El núcleo debe seguir siendo independiente del juego. El servidor valida los cambios de dinero, inventarios, propietarios y permisos; ninguna entrada de un cliente debe considerarse autoritativa.

Las aportaciones se revisan antes de integrarse. Un error de GitHub Actions antes del inicio de un trabajo **no significa que las pruebas hayan pasado**.

Para conocer todos los criterios, consulta la [guía completa en inglés](./CONTRIBUTING.md). Las vulnerabilidades deben notificarse según [SECURITY.md](./SECURITY.md), nunca en una incidencia pública.
