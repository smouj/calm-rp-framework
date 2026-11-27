# Guía de la infografía vectorial: ejecución Xbox → PC

**Artefacto:** [`site/assets/gta6-xbox-to-pc-architecture.svg`](../../site/assets/gta6-xbox-to-pc-architecture.svg) · **Revisado:** 27 de noviembre de 2026

**Estado:** resumen gráfico de investigación pública; no es documentación de Rockstar ni una guía de ejecución.

## Propósito

La pieza explica, a nivel de arquitectura, tres capas que describen públicamente proyectos distintos: ejecución de código x86-64, sustitución/implementación de servicios de consola y adaptación de GPU/shaders. Añade una ruta alternativa de recompilación estática y conserva las cifras de rendimiento del fork de VIctory como lo que son: un autoinforme en una sola máquina.

No distribuye ni transforma ejecutables, archivos, assets, volcados o datos de GTA VI. No explica cómo obtener o procesar esos materiales. Ninguna de las técnicas aquí resumidas constituye un runtime de roleplay, una interfaz oficial, un permiso de modding o una integración para CALM.

## Afirmaciones y fuentes

| Parte             | Afirmación mostrada                                                                                                                                | Fuente primaria y límite                                                                                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU               | Xbox Series y PC comparten x86-64; VIctory prepara y mapea el código de título para ejecución nativa.                                              | [VIctory architecture](https://github.com/Marvisak/VIctory/blob/main/docs/architecture.md). Esto no elimina la necesidad de servicios compatibles ni de traducir gráficos.                                                                                                   |
| Servicios         | Una capa HLE implementa algunos imports, puede pasar funciones de host según su política y deja otros sin implementar.                             | [VIctory architecture](https://github.com/Marvisak/VIctory/blob/main/docs/architecture.md), sección “Import resolution”. El diagrama resume categorías, no llama ni nombra interfaces del juego.                                                                             |
| GPU               | La documentación separa D3D12.X de host D3D12 y describe objetos/comandos GPU, traducción de shaders al host y formatos de texturas/memoria.       | [VIctory architecture](https://github.com/Marvisak/VIctory/blob/main/docs/architecture.md). El gráfico evita fijar un formato único de salida de shaders porque el proyecto los denomina “host shaders” y el backend evoluciona.                                             |
| Métricas del fork | ~11 FPS con 1.500–3.300 draws y ~8,5 FPS con 3.300 o más, en la primera misión del barco; ~0,2–3 FPS con el builder de estructuras de ray tracing. | [Estado del fork, publicado el 27-11-2026 a las 06:30 UTC](https://github.com/fxceless/victory-fork). El propio autor describe una sola PC (Windows 11, i7-14700KF, RTX 4070 de 12 GB, 32 GB RAM y perfil Series X); no es reproducción independiente ni referencia general. |
| Ruta alternativa  | Project ReCity describe recompilación estática, shaders RDNA2→SPIR-V y Vulkan; su README aún dice que el juego no arranca.                         | [Project ReCity README](https://github.com/pixl27/ProjectReCity), estado consultado el 27-11-2026. Es el estado declarado por el proyecto y puede cambiar.                                                                                                                   |

Las cifras pueden variar entre revisiones, máquinas, escenas, número de draws y opciones de ray tracing. Si se actualiza la pieza, se debe volver a consultar cada fuente y actualizar la fecha, el hardware y la nota de incertidumbre juntos.

## Diseño del SVG

- Un único archivo SVG autocontenido: no carga imágenes remotas, fuentes, scripts ni recursos del juego.
- Estructura por grupos con identificadores (`cpu-layer`, `service-layer`, `graphics-layer`, `performance`, `recity-route`, `calm-takeaway` y `sources`) para editar cada bloque sin perder el orden narrativo.
- Incluye `title`, `desc`, metadatos con idioma/fecha/fuentes y enlaces directos a documentación pública.
- Las líneas de señal y los indicadores tienen animación CSS sutil. La consulta `prefers-reduced-motion: reduce` elimina el movimiento y conserva el diagrama completo.
- El formato vertical y el `viewBox` mantienen el orden de lectura en móvil; se revisó a 390 px de ancho para evitar recortes o desbordamientos.
- No se usan logos, capturas, key art, texturas, siluetas ni elementos visuales de GTA VI/Xbox. La composición y los iconos son originales y esquemáticos.

## Uso y edición

El SVG es la fuente canónica del gráfico. Se muestra en el sitio mediante un contenedor externo y puede abrirse directamente para acceder a sus enlaces. Los servicios que no admitan SVG animado deben recibir un formato de publicación generado y revisado por separado; no se sustituye esta fuente editable por una conversión raster como versión principal.

Al cambiar la pieza:

1. actualiza este documento y la fecha de revisión;
2. verifica cada cifra en la fuente primaria y conserva sus condiciones de prueba;
3. valida el XML/SVG, enlaces, texto accesible y la regla de movimiento reducido;
4. comprueba la presentación estática y animada en al menos un navegador compatible;
5. no introduzcas archivos, identificadores, interfaces internas ni datos del juego.

## Relación con CALM

La investigación puede contextualizar problemas generales de compatibilidad, carga y sincronización. CALM no usa estos proyectos como blueprint ni reutiliza sus APIs o código: sus dominios de roleplay son propios, se prueban con datos sintéticos y el adaptador GTA VI permanece bloqueado hasta que exista una vía documentada y autorizada. Consulta [ADR-0009](../adr/0009-gta-vi-first-product-scope.md) y la [política de artefactos de terceros](../operations/THIRD_PARTY_ARTIFACT_POLICY.md).
