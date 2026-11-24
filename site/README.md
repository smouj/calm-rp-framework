# Sitio público de GTA VI RP Platform

Este directorio contiene un sitio estático con HTML, CSS y JavaScript nativos. No requiere NPM ni un backend para visualizarlo.

## Funcionalidad

- Secciones de arquitectura, módulos, investigación, hoja de ruta y contribuciones.
- Diseño adaptable, navegación móvil, salto al contenido, enfoque visible y reducción de movimiento.
- Tema oscuro/claro con preferencia local cuando el navegador permite almacenamiento.
- Filtro interactivo de módulos.
- Demostración de economía **exclusivamente en el navegador** con importes ficticios, saldo disponible, libro local de movimientos y reintento idempotente.
- Enlaces directos a código, documentación y fuentes públicas.

**La demostración web NO usa el núcleo TypeScript, no identifica jugadores, no persiste datos y no es un juego ni un servidor RP funcional.** El paquete `packages/core` es la referencia de reglas en el servidor; deben probarse por separado.

## Publicación en GitHub Pages

1. Primero revisar y fusionar esta PR después de pasar pruebas, revisión de seguridad y derechos.
2. Comprobar condiciones del plan GitHub: con GitHub Free, Pages requiere repositorio público; con GitHub Pro puede usarse uno privado, pero el sitio publicado sigue siendo público.
3. En `Settings > Pages > Build and deployment`, seleccionar **GitHub Actions**.
4. Ejecutar manualmente `Deploy community site` o realizar un cambio en `site/**` sobre `main`.
5. Comprobar la dirección que muestre GitHub; para el repositorio público debería ser `https://smouj.github.io/gta6-rp-platform/`.
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

**Estado verificado 24/11/2026:** los archivos de Pages están incorporados a `main`, pero la conexión actual de GitHub no permite activar Pages desde Settings, y Actions no llega a asignar un ejecutor. El sitio **no puede anunciarse como publicado** hasta activar Pages desde Settings y comprobar un despliegue exitoso.
