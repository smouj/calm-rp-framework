# Hilo para X: cómo intentan ejecutar una build Xbox de GTA VI en PC

**Fecha de revisión:** 27 de noviembre de 2026 · **Estado:** borrador; no publicado.

**Límite:** borrador no publicado. La fuente visual es un SVG vectorial animado del proyecto; X puede no admitir SVG como adjunto, así que esta nota enlaza la fuente web y no promete una vista previa dentro de X.

[Abrir la infografía vectorial animada](../../site/assets/gta6-xbox-to-pc-architecture.svg) · [notas de fuentes y edición](./GTA6_PC_EXECUTION_GRAPHIC.md)

## Hilo

**1/10** Se oye «GTA VI ya corre en PC». ¿Qué significa de verdad? No es un port oficial: son capas de software que intentan ejecutar una build Xbox en Windows, sustituyendo servicios de consola y adaptando los gráficos. Hilo técnico, sin compartir archivos. 🧵

**2/10** Xbox Series y muchos PC usan x86-64. VIctory describe un loader que mapea código de título nativo y resuelve imports; compartir arquitectura simplifica CPU, pero no reemplaza los servicios Xbox. https://github.com/Marvisak/VIctory

**3/10** Otra capa adapta objetos y comandos D3D12.X al backend D3D12 de Windows y traduce los shaders Xbox a shaders del host. También pesan layouts de texturas, memoria y sincronización. https://github.com/Marvisak/VIctory/blob/main/docs/architecture.md

**4/10** Si una pieza se interpreta mal, aparecen shaders fallidos, objetos que no se dibujan, imagen negra, FPS muy bajos o GPU bloqueada. Es depuración de compatibilidad al nivel de API y GPU; no una versión optimizada por Rockstar.

**5/10** El fork autoinforma ~11 FPS con 1.500–3.300 draws y ~8,5 con 3.300+ en la primera misión del barco; con su builder de ray tracing, ~0,2–3. Un solo PC, no verificado independientemente. https://github.com/fxceless/victory-fork

**6/10** ReCity prueba otra ruta: recompilación estática y shaders RDNA2 a SPIR-V/Vulkan. En el README consultado el 27/11, el proyecto dice que el juego aún no arranca. https://github.com/pixl27/ProjectReCity

**7/10** “Código abierto” aquí no significa tener el código fuente legible de Rockstar. Se publica una capa propia de ejecución/traducción. Puede aportar detalles técnicos, pero no basta por sí sola para reconstruir stats, IA o la lógica de misiones.

**8/10** ¿Qué le sirve a CALM? Pistas sobre carga de recursos, estados, sincronización y límites de rendimiento; no un blueprint del juego ni una base de RP. Para stats y reglas toca separar observaciones confirmadas de hipótesis y diseñar el sistema propio.

**9/10** Take-Two presentó una reclamación DMCA contra Leonida. GitHub dice que procesó la retirada de la red asociada (3.007 repos). Es una acción de plataforma, no una sentencia judicial. https://github.com/github/dmca/blob/master/2026/11/2026-11-24-take-two.md

**10/10** Seguridad: cuidado con ejecutables de terceros que prometen “GTA 6 para PC”. No son el repositorio público ni una versión oficial; no hace falta descargar ni abrir archivos para explicar este trabajo.

## Fuentes y alcance

- [Infografía SVG y notas de fuentes](./GTA6_PC_EXECUTION_GRAPHIC.md)
- [VIctory: README y estado publicado](https://github.com/Marvisak/VIctory)
- [VIctory: arquitectura](https://github.com/Marvisak/VIctory/blob/main/docs/architecture.md)
- [Fork de VIctory: estado publicado el 27 de noviembre](https://github.com/fxceless/victory-fork)
- [Project ReCity: alcance y estado](https://github.com/pixl27/ProjectReCity)
- [Aviso DMCA publicado por GitHub](https://github.com/github/dmca/blob/master/2026/11/2026-11-24-take-two.md)
- [Ayuda oficial de X sobre el límite de 280 caracteres](https://help.x.com/en/using-x/how-to-post)

Las cifras de FPS y el avance de las misiones son afirmaciones de los autores del fork, en una sola configuración; no son una verificación independiente. El aviso DMCA recoge la reclamación de Take-Two y la respuesta de GitHub; no es una sentencia judicial. El hilo resume documentación pública y no distribuye builds, ejecutables ni archivos del juego.
