# Sitio informativo de CALM Essentials — Roleplay para GTA VI

Este directorio contiene un sitio estático con HTML, CSS y JavaScript nativos. No requiere NPM ni un backend para visualizarlo.

## Funcionalidad

- Identidad visual propia: el banner social oficial de CALM (navy + rosa Miami) en la portada de los README, con la variante blanca del wordmark para el tema oscuro y navy para el claro.
- Conjunto de iconos derivado del banner oficial: `favicon.svg`, `favicon.ico` (16/32/48), `favicon-32.png` y `apple-touch-icon.png` usan la estrella del banner trazada desde los píxeles fuente sobre el navy `#101020` del propio banner; `og-image.png` es el banner social completo (1280×640) para vistas previas sociales.
- Secciones de arquitectura, sistemas, ingeniería, investigación, hoja de ruta y contribuciones. La página presenta el objetivo GTA VI-first, los dominios propios de CALM, la simulación con datos sintéticos y el runtime autorizado como bloqueado.
- Sección de evidencia centrada en mecánicas públicas de GTA VI y en los requisitos propios de CALM; los estudios de compatibilidad de PC se mantienen fuera del framework.
- Diseño adaptable, navegación móvil, salto al contenido, enfoque visible y reducción de movimiento.
- Ambientación visual original de costa nocturna para Leonida, en SVG vectorial propio: horizonte, skyline, palmeras, luces de ciudad y reflejos lentos. Mantiene el navy y rosa de CALM con acentos aqua/sunset; no usa arte ni recursos gráficos del juego.
- Efectos y animaciones: fondo global con brillos y retícula, orbes de portada, reflejos SVG animados, entradas, aparición progresiva al hacer scroll, navegación activa y estados interactivos. Se respetan `prefers-reduced-motion` y el contenido sigue visible sin JavaScript.
- La portada refleja los cierres F1 y F2: API HTTP de operador solo en loopback, grants auditados y servicios persistentes de identidad, economía e inventario. No ofrece login público ni integración de juego; el runtime permanece bloqueado. Un diagrama diferencia el núcleo CALM de los IDs ilustrativos `smj_*`.
- Tema oscuro/claro con preferencia local cuando el navegador permite almacenamiento.
- Filtro interactivo de módulos.
- Sección de ingeniería con la estructura real del monorepo, las puertas de calidad y las verificaciones de higiene que revisan cada cambio.
- Enlaces directos a código, documentación y fuentes públicas.

**La web es estática e informativa: NO ejecuta el núcleo TypeScript, no identifica jugadores, no persiste datos y no es un juego ni un servidor RP funcional.** Las reglas de CALM y sus pruebas viven en el repositorio; la página no es una interfaz con GTA VI.

## Publicación en GitHub Pages

1. Primero revisar y fusionar esta PR después de pasar pruebas, revisión de seguridad y derechos.
2. Comprobar condiciones del plan GitHub: con GitHub Free, Pages requiere repositorio público; con GitHub Pro puede usarse uno privado, pero el sitio publicado sigue siendo público.
3. En `Settings > Pages > Build and deployment`, seleccionar **GitHub Actions**.
4. Ejecutar manualmente `Deploy community site` o realizar un cambio en `site/**` sobre `main`.
5. Comprobar la dirección que muestre GitHub; para el repositorio público debería ser `https://smouj.github.io/calm-rp-framework/`.
6. Comprobar contraste, responsive, teclado, navegación, CSP, y que no se publican archivos o datos de terceros.

El flujo usa acciones fijadas a SHA, solo lectura de contenidos y permisos mínimos de `pages` e `id-token` en el trabajo de despliegue.

**No habilitar visibilidad pública de forma automática:** completar la auditoría histórica de `docs/community/PUBLIC_LAUNCH_CHECKLIST.md` y verificar las restricciones de distribución. El código del sitio no modifica la visibilidad del repositorio ni crea por sí solo una página publicada.

## Desarrollo

Abrir `site/index.html` localmente. Para probar con servidor estático:

```bash
python -m http.server 8080 --directory site
```

Visitar `http://localhost:8080`. Revisar manualmente los enlaces y acciones en el navegador.

## Aviso legal autónomo

[site/legal.html](./legal.html) se publica como parte de la web. Permite consultar no afiliación, marcas, política de GTA VI, límites de interoperabilidad y funcionamiento básico de la web, incluso si el repositorio de código permanece privado.

**Estado de publicación:** los cambios de contenido de este candidato requieren un despliegue de GitHub Pages y una comprobación posterior de la portada, el aviso legal y los recursos. El historial de despliegues y sus fallos se registra en la documentación de operaciones.

## Identidad

CALM y CALM Essentials son nombres de trabajo, no marcas cuya exclusividad o disponibilidad comercial esté acreditada. El contraste conceptual con RAGE no implica vinculación con Rockstar. La web mantiene sus avisos de no afiliación y ausencia de integración GTA VI. Los paquetes técnicos y la URL del repositorio conservan sus identificadores actuales por compatibilidad.
