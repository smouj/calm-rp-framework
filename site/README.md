# Sitio informativo de CALM — Roleplay Framework

Este directorio contiene un sitio estático con HTML, CSS y JavaScript nativos. No requiere NPM ni un backend para visualizarlo.

## Funcionalidad

- Identidad visual propia: el banner social oficial de CALM (navy + rosa Miami) en la portada de los README, con la variante blanca del wordmark para el tema oscuro y navy para el claro.
- Conjunto de iconos derivado del banner oficial: `favicon.svg`, `favicon.ico` (16/32/48), `favicon-32.png` y `apple-touch-icon.png` usan la estrella del banner trazada desde los píxeles fuente sobre el navy `#101020` del propio banner; `og-image.png` es el banner social completo (1280×640) para vistas previas sociales.
- Secciones de arquitectura, módulos, ingeniería, investigación, hoja de ruta y contribuciones, con el enfoque CALM Essentials: mapa de sistemas de rol (personajes y economía con persistencia PostgreSQL entregada en F1), modelo de integración en tres niveles (motor / adaptador / framework), fases F0–F5 con F1 completada y tarjetas de investigación actualizadas (VIctory, XCL y síntesis de estrategia).
- Diseño adaptable, navegación móvil, salto al contenido, enfoque visible y reducción de movimiento.
- Efectos y animaciones sobre la paleta oficial (navy + rosa Miami): fondo global unificado con brillos fijos y retícula, orbes animados en la portada, animaciones de entrada, aparición progresiva al hacer scroll (IntersectionObserver con retardo escalonado), subrayado de navegación activa y cursores animados; todo se desactiva con `prefers-reduced-motion` y el contenido permanece visible sin JavaScript.
- Tema oscuro/claro con preferencia local cuando el navegador permite almacenamiento.
- Filtro interactivo de módulos.
- Sección de ingeniería con la estructura real del monorepo, las puertas de calidad y las verificaciones de higiene que revisan cada cambio.
- Enlaces directos a código, documentación y fuentes públicas.

**La web es estática e informativa: NO ejecuta el núcleo TypeScript, no identifica jugadores, no persiste datos y no es un juego ni un servidor RP funcional.** El paquete `packages/core` es la referencia de reglas en el servidor; deben probarse por separado.

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

**Estado verificado 25/11/2026:** el sitio está publicado en `https://smouj.github.io/calm-rp-framework/` (HTTP 200 comprobado en `/`, `/legal.html` y los recursos de `assets/`). El lote de marca oficial (banner, iconos, paleta) se fusionó en #45 y se desplegó con éxito. La actualización de contenido de CALM Essentials (mapa de módulos, hoja de ruta F0–F5, nuevas tarjetas de investigación) sufrió el modo de fallo transitorio documentado en `docs/operations/GITHUB_PAGES_DEPLOYMENT.md` (artefacto subido, paso de despliegue fallido) y se publica con el siguiente `site/**` sobre `main`.

## Identidad

CALM es el nombre de trabajo del framework, no una marca registrada o liberada para uso comercial. El contraste conceptual con RAGE no implica vinculación con Rockstar. La web mantiene sus avisos de no afiliación y ausencia de integración GTA VI. Los paquetes técnicos y la URL del repositorio conservan sus identificadores actuales para evitar cambios incompatibles.
