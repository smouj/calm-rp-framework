# Nombre del repositorio y uso de marcas de terceros

**Actualizado:** 24 de noviembre de 2026

## Cambio aplicado

| Antes                    | Ahora                     |
| ------------------------ | ------------------------- |
| `smouj/gta6-rp-platform` | `smouj/calm-rp-framework` |

La referencia a GTA **sale del nombre del proyecto** y pasa a los **topics** del repositorio
(`gta6`, `gta-vi`), que son metadatos descriptivos de búsqueda, no identidad del producto.

## Por qué no era solo estético

Los artículos 34 y 37 de la **Ley 17/2001 de Marcas** permiten al titular de una marca oponerse a
un uso en el tráfico económico que pueda inducir a confusión o aprovecharse del renombre. En la
práctica, un proyecto de fans rara vez tiene problemas por _mencionar_ el juego del que habla — el
uso descriptivo está amparado —, pero **usarlo como nombre del proyecto** es lo que más se acerca
a una identidad de marca ajena.

Separar ambas cosas reduce la superficie de conflicto sin perder nada:

- **Nombre del proyecto:** `calm-rp-framework` — marca propia, sin elementos de terceros.
- **Topics:** `gta6`, `gta-vi` — descriptores de categoría, el uso más claramente informativo.
- **Cuerpo del texto:** se sigue mencionando GTA VI de forma descriptiva y con aviso de no
  afiliación, que es legítimo y necesario para explicar qué es el proyecto.

## Qué NO se ha hecho, y por qué

- **No se renombraron los paquetes internos** (`@gta6-rp/core`, `@gta6-rp/contracts`,
  `@gta6-rp/simulator`). Son identificadores técnicos, no marcas visibles, y cambiarlos obligaría a
  tocar imports, `tsconfig` y lockfile sin beneficio jurídico. Si en el futuro se publican en un
  registro público, es el momento de revisarlos.
- **No se eliminó la mención a GTA VI de README, web ni documentación.** Describir de qué trata un
  proyecto es uso descriptivo legítimo; suprimirlo haría el proyecto _menos_ transparente, no más
  seguro.
- **No se cambió CALM.** Sigue siendo nombre de trabajo sin exclusividad reclamada, pendiente de
  búsqueda de anterioridades antes de cualquier uso comercial.

## Efectos del renombrado que conviene conocer

- GitHub **redirige** automáticamente las URLs antiguas `smouj/gta6-rp-platform`, así que los
  enlaces ya compartidos siguen funcionando (clonado, issues y pull requests incluidos).
- Los **topics** sí se actualizaron: quedan `gta6` y `gta-vi`.
- La **página de GitHub Pages** cambia a `https://smouj.github.io/calm-rp-framework/`.
- Los **enlaces históricos** a runs de Actions y pull requests antiguos que aparecen en documentos
  de fecha pasada se dejaron como estaban, porque registran hechos con su URL de entonces.

## Límite honesto

Esto reduce el riesgo; no lo elimina. Ningún renombrado sustituye a:

1. Una búsqueda de anterioridades de **CALM** en el EUIPO (clases 9 y 42) antes de comercializar.
2. Una revisión de abogacía especializada si el proyecto pasa a ser comercial.
3. El mantenimiento de los avisos de no afiliación, que las comprobaciones automáticas ya protegen.
