# Base jurídica del proyecto — artículos aplicables y por qué este proyecto es legal

**Fecha de revisión:** 24 de noviembre de 2026
**Ámbito:** España / Unión Europea
**Estado:** revisión técnica de cumplimiento, **no dictamen jurídico ni autorización**

> Este documento explica, artículo por artículo, en qué normas se apoya la legalidad de un proyecto
> independiente de roleplay y dónde están sus límites. No sustituye el asesoramiento de un abogado
> colegiado antes de un lanzamiento comercial o de una integración real con GTA VI.

---

## 0. Resumen en una frase

Desarrollar, publicar y distribuir **software propio** que modela sistemas de rol —personajes,
economía, inventario, permisos— es legal porque **no copia obra ajena**: la ley protege la
_expresión_ de un programa, no las _ideas_, las reglas de juego ni las interfaces abstractas.
Lo que **no** es legal, y este proyecto no hace, es distribuir archivos del juego, eludir protecciones
técnicas o alojar un servicio multijugador no autorizado.

---

## 1. Por qué las ideas y los sistemas no son propiedad de nadie

### Artículo 1.2 de la Directiva 2009/24/CE (software)

> «La protección concedida [...] se aplicará a la expresión de un programa de ordenador en cualquier
> forma. **Las ideas y los principios en los que se base cualquiera de los elementos de un programa,
> incluidos los que sirvan de base a sus interfaces**, no estarán protegidos por derechos de autor.»

### Artículo 96.4 del Texto Refundido de la Ley de Propiedad Intelectual (TRLPI, RDL 1/1996)

Recoge literalmente la misma regla en el Derecho español.

**Qué significa para CALM:** que exista un inventario con peso, pilas y transferencias, o una
economía con libro de movimientos, **no es una idea registrable**. Cualquier persona puede escribir
un sistema de inventario. La ley protege el _código concreto_ que alguien escribió, no el concepto.

**Aplicación al proyecto:** `packages/core` implementa personajes, economía e inventario con código
original. No deriva de código de terceros. Por eso la regla del art. 1.2 / 96.4 es exactamente el
fundamento de su legalidad.

---

## 2. Copiar código sí está prohibido — y el proyecto no lo hace

### Artículos 17 y 18 TRLPI — derecho exclusivo de reproducción y distribución

La reproducción total o parcial de una obra y su distribución pública requieren **autorización del
titular**.

### Artículo 100 TRLPI / art. 4 de la Directiva 2009/24/CE

Los actos de reproducción, traducción, adaptación y transformación de un programa quedan sujetos a
autorización del titular.

**Aplicación al proyecto:** el repositorio no contiene código de Rockstar, de Cfx.re, de QBCore, de
Qbox ni de ox_inventory. Cuando se cita una función de Qbox (por ejemplo
`exports.qbx_core:AddMoney(identifier, moneyType, amount, reason)`), se cita como **interfaz
documentada públicamente del producto de terceros**, no se copia su implementación. Esas
implementaciones son GPL-3.0; la política del proyecto prohíbe incorporar código GPL-3.0 al árbol
MIT sin una decisión de cumplimiento específica (véase `docs/legal/INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md`).

---

## 3. La licencia MIT y qué cubre realmente

`LICENSE` aplica **solo** al código y a la documentación originales del proyecto.

- **Cubre:** el código TypeScript, la web, los documentos, los tests.
- **No cubre:** GTA VI, sus archivos, sus marcas, ni ninguna obra de terceros.

MIT es una licencia permisiva reconocida por la OSI. Permitir la reutilización del código propio es
precisamente lo que **reduce** el riesgo: el titular (SMOUJ) autoriza expresamente lo que de otro
modo sería reproducción prohibida.

---

## 4. Archivos del juego: la línea roja

Este es el punto que de verdad genera problemas legales en proyectos de fan — y el proyecto lo
evita del todo.

### Artículo 18 TRLPI — distribución

Poner a disposición del público copias de una obra exige autorización.

### Artículo 270.1 del Código Penal español

Tipifica la reproducción, distribución o comunicación pública de obras protegidas **sin autorización
de los titulares**, con ánimo de lucro directo o indirecto, en perjuicio de terceros.

### Artículo 286 del Código Penal — elusión de medidas tecnológicas

Castiga la fabricación, importación, puesta a disposición o posesión de dispositivos diseñados para
**eludir medidas tecnológicas** de protección de programas.

### Artículos 6 y 7 de la Directiva 2009/24/CE

Prohíben los actos de descompilación fuera de los supuestos estrictamente tasados y la elusión de
protecciones técnicas.

**Aplicación al proyecto — hechos verificables:**

1. El repositorio **no contiene** ejecutables, paquetes `.rpf`/`.rpf9`, modelos, texturas, audio,
   mapas ni claves. La comprobación es automática y bloqueante: `scripts/check-no-proprietary-artifacts.sh`
   falla si aparece un archivo de esas extensiones o un enlace a una descarga filtrada.
2. El repositorio **no distribuye ni enlaza** la filtración de ~209 GB descrita en la documentación de
   investigación; solo registra su existencia, su falta de verificación y la prohibición de usarla.
3. La web es **estática e informativa**: no permite jugar, no descarga contenido, no ejecuta nada del juego.

---

## 5. Multijugador: lo que exige Rockstar

### Directrices de modificaciones de Rockstar (10 de septiembre de 2026)

Limitan las modificaciones multijugador a plataformas autorizadas o con licencia específica.

### Política oficial de servidores RP de Rockstar

Los servicios RP autorizados están vinculados al framework Cfx.re/FXServer; otros servicios de GTA
Online se describen como no autorizados.

### Acuerdo de licencia de la plataforma Cfx (12 de enero de 2026)

Rige el uso del runtime de Cfx.re.

**Aplicación al proyecto:** el proyecto **no** ha desplegado ningún servidor de GTA VI, no arranca
GTA VI y no afirma que Rockstar lo haya autorizado. La autorización de GTA V/FiveM **no se extiende
automáticamente** a GTA VI. Por eso el adaptador de GTA VI está explícitamente marcado como
**bloqueado** hasta que exista una vía técnica y contractual autorizada. Ver `docs/server/RUNTIME_REQUIREMENTS.md`.

---

## 6. Observación y estudio del programa: los límites legales

### Artículo 100.3 TRLPI

Permite al **usuario legítimo** observar, estudiar o verificar el funcionamiento del programa para
determinar sus ideas y principios, **siempre que lo haga durante operaciones que esté autorizado a
realizar**.

### Artículo 100.5 y 100.6 TRLPI

Permiten reproducir o traducir código **solo en la medida indispensable para la interoperabilidad**
de un programa creado de forma independiente, y excluyen usar así obtenida información para crear un
programa sustancialmente similar o para fines distintos.

**Aplicación al proyecto:** la documentación de investigación cita **descripciones públicas** de
formatos y estructuras, con atribución y fecha, y las clasifica como «declaración de terceros»,
no como contrato autorizado. El proyecto no publica offsets, firmas internas ni protocolos privados
presuntamente obtenidos de una filtración.

> **Advertencia honesta:** estas excepciones **no** legalizan acceder a datos filtrados, eludir
> protecciones, redistribuir código descompilado ni alojar un servicio multijugador. Un repositorio
> público en GitHub **no** equivale a una licencia.

---

## 7. Protección de datos (RGPD)

### Reglamento (UE) 2016/679 — RGPD

### Ley Orgánica 3/2018 (LOPDGDD)

**Aplicación al proyecto:** la web **no** recoge datos personales.

- No hay formularios que envíen datos.
- No hay cuentas de usuario.
- No hay analítica propia ni cookies de seguimiento.
- La preferencia de tema se guarda **en el navegador** (`localStorage`), es decir, en el dispositivo
  del visitante, no en un servidor.
- La demostración usa datos ficticios en memoria que se pierden al cerrar la pestaña.
- El alojamiento por GitHub Pages trata datos técnicos de acceso bajo la política de privacidad de
  GitHub, ajena al proyecto.

Resultado: **no existe tratamiento de datos personales por parte del proyecto**, por lo que no hay
base jurídica que declarar, ni registro de actividades, ni responsable del tratamiento propio.

### Artículo 22 de la LSSI-CE (Ley 34/2002)

Se refiere al envío de comunicaciones comerciales no solicitadas. El proyecto no envía comunicaciones
comerciales, no usa cookies publicitarias y no requiere por ahora consentimiento de cookies.

---

## 8. Marca y nombre «CALM»

- «CALM» se usa como **nombre de trabajo**, no como marca registrada exclusiva.
- Ya existen usos previos en software (entre ellos _Common Architecture Language Model_ de FINOS) y
  marcas de terceros.
- Por tanto el proyecto **no** reclama exclusividad y lo declara expresamente en `TRADEMARKS.md` y en
  la página legal del sitio.
- Antes de registrar una marca europea (EUIPO) o comercializar, procede una **búsqueda de anterioridades**
  por clases relevantes (9 y 42, principalmente).

**Aplicación al proyecto:** usar un nombre que ya existe no es ilegal por sí mismo; lo que sí puede
generarse es un conflicto de marca si se usa comercialmente de forma que confunda. El proyecto lo
mitiga declarando el carácter no exclusivo.

---

## 9. Identidad gráfica: inspiración vs. copia

Referencia cromática documentada (muestreo independiente del logotipo y la web oficial) frente a la
propuesta propia del proyecto.

- **Inspirarse** en una paleta de colores es legal: los colores aislados y las combinaciones simples
  no son objeto de derecho de autor.
- **Reproducir** el logotipo, el numeral VI, la composición tipográfica o el arte oficial sí lo sería.
- El proyecto usa paleta propia (`#111222`, `#E9639B`, `#40DAE6`, `#FFF1DC`), marcado propio y
  tipografía propia. **No** incorpora logotipos ni elementos gráficos de Rockstar.

Ver `docs/branding/PROJECT_IDENTITY.md` para las reglas internas.

---

## 10. Tabla de trazabilidad: afirmaciones y su base

| Afirmación                        | Base jurídica                                   | Prueba en el repositorio                                 |
| --------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| El código es original y MIT       | Art. 1.2 Dir. 2009/24; Art. 96.4 TRLPI; LICENSE | `LICENSE`, historial de commits                          |
| No hay código de terceros copiado | Arts. 17, 18 y 100 TRLPI                        | `INTEROPERABILITY_AND_IP_REVIEW_2026-11-24.md` §4        |
| No hay archivos del juego         | Arts. 18 TRLPI, 270.1 CP, 286 CP                | `scripts/check-no-proprietary-artifacts.sh` (bloqueante) |
| No hay servidor GTA VI            | Directrices Rockstar; Acuerdo Cfx               | `docs/server/RUNTIME_REQUIREMENTS.md`                    |
| No hay tratamiento de datos       | RGPD; LOPDGDD; Art. 22 LSSI                     | `site/legal.html` §5                                     |
| El nombre no reclama exclusividad | Ley 17/2001 de Marcas; `TRADEMARKS.md`          | `TRADEMARKS.md`, `site/legal.html` §6                    |
| La web no reproduce arte oficial  | Arts. 17 y 18 TRLPI                             | `docs/branding/PROJECT_IDENTITY.md`                      |

---

## 11. Qué haría falta antes de un lanzamiento real con GTA VI

1. Evidencia de primera mano (Rockstar/Cfx) de que existe un runtime autorizado para GTA VI.
2. Términos de licencia que permitan expresamente operar un servidor.
3. Revisión por un abogado de propiedad intelectual en España.
4. Auditoría del historial completo de Git para descartar contenido propietario previo.
5. Adaptador implementado contra una interfaz documentada, no contra volcados de memoria.

Hasta entonces, el adaptador de GTA VI permanece **bloqueado por diseño**. Eso no es una carencia:
es la prueba de que el proyecto cumple.

---

## 12. Aviso

Este documento describe la posición del proyecto basándose en los textos legales citados y en el
estado verificable del repositorio en la fecha indicada. **No es asesoramiento jurídico
individual** y no acredita por sí mismo la conformidad de una publicación o integración futura.
Ante cualquier duda, consulta a un profesional de la abogacía.

### Textos citados

- TRLPI (consolidado): https://www.boe.es/buscar/act.php?id=BOE-A-1996-8930
- Directiva 2009/24/CE: https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32009L0024
- Código Penal (arts. 270, 286): https://www.boe.es/buscar/act.php?id=BOE-A-1995-25444
- RGPD: https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32016R0679
- LOPDGDD: https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673
- LSSI-CE: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758
- Ley 17/2001 de Marcas: https://www.boe.es/buscar/act.php?id=BOE-A-2001-23093
- Directrices de mods de Rockstar: https://www.rockstargames.com/es/community-resources/mod-guidelines
- Política de servidores RP de Rockstar: https://support.rockstargames.com/articles/5I66kExWgligszgMCU3XC1/roleplay-rp-servers
- Acuerdo de licencia de la plataforma Cfx: https://static.cfx.re/platform-license-agreement-12-jan-2026.pdf
