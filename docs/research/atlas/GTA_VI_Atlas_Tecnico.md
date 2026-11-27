# GRAND THEFT AUTO VI · ATLAS TÉCNICO

**Edición:** 1.0 · **Corte:** 27/11/2026

> Los esquemas son ilustraciones originales, no capturas. Fuentes F## al final.

## 01. Alcance, edición y método de verificación

Un libro técnico fiable distingue entre un hecho observable, una interpretación razonable y una hipótesis de implementación. GTA VI exige esta separación porque la campaña ya puede analizarse, pero el funcionamiento interno del motor y las posibilidades futuras de modificación no son públicos.

**Lámina 01:** [consultar esquema original en el PDF, pág. 3](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=3).

### Objeto de estudio

Este atlas estudia la versión comercial de Grand Theft Auto VI disponible a 27 de noviembre de 2026 y las fuentes públicas accesibles ese día. Incluye la experiencia jugable y los sistemas visibles: mapa, organizaciones, teléfono, misiones, economía, inventario, combate, conducción, robos, policía, NPC y actividades. No se ha realizado una inspección del código ejecutable, ingeniería inversa ni una auditoría directa de una instalación del juego.

### Cuatro categorías de conocimiento

A corresponde a documentación oficial; B a observaciones públicas de la versión comercial o demostraciones jugadas; C a guías o bases de datos especializadas pendientes de confirmación independiente; D a hipótesis no comprobadas. El grado identifica el tipo de evidencia, no una probabilidad numérica. Si una guía describe una mecánica con gran detalle, sigue siendo una fuente secundaria aunque el contenido parezca plausible.

### Regla editorial de precisión

Cada afirmación relevante incorpora referencias F## identificables en el catálogo final. Las cifras cuantitativas incluyen la denominación que utiliza la fuente: modelos base no son iguales a variantes de vehículos, ni categorías de robos equivalen a procedimientos diferentes. Cuando dos fuentes discrepan, se registran ambas lecturas y la contradicción permanece abierta.

### Unidades documentales

Cada mecánica posee un identificador estable (por ejemplo VEH-ROB-01), fuentes, condiciones conocidas, resultados, variantes, lagunas y una nota de interés para CALM. La matriz CSV es el registro maestro: permite corregir el libro sin perder el historial de evidencias. Las figuras de este volumen son diagramas originales, no imágenes capturadas del juego.

### Ficha sintetica

| Elemento | Descripción                                        | Estado                                             |
| -------- | -------------------------------------------------- | -------------------------------------------------- |
| A        | Rockstar, Take-Two, soporte y materiales oficiales | Confirma declaraciones, no revela motores internos |
| B        | Prueba visual o análisis de partida                | Describe comportamientos observables               |
| C        | Guía, base de datos, wiki                          | Requiere contraste adicional                       |
| D        | Rumor, filtración, proyección                      | Nunca se presenta como función existente           |

**Pendiente:** Pendiente: auditoría reproducible sobre PS5 y Xbox Series X|S con número de versión, fecha, idioma y capturas propias.

**Fuentes:** F01, F04, F05, F23, F26

## 02. Plataformas, versiones y límites técnicos

Rockstar y Take-Two confirman el lanzamiento mundial el 19 de noviembre de 2026 para PS5 y Xbox Series X|S. Eso valida la existencia de un producto comercial jugable, no la disponibilidad de un ejecutable oficial de PC ni de herramientas públicas para servidores RP.

**Lámina 02:** [consultar esquema original en el PDF, pág. 4](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=4).

### Hechos de lanzamiento

El material oficial presenta a Jason Duval y Lucia Caminos como protagonistas de una historia criminal situada en Leonida. Rockstar mantiene páginas de soporte para opciones de jugabilidad, gráficos, controles y presentación. La página pública de medios ofrece capturas y material promocional. Estos son puntos de partida de mayor autoridad que filtraciones o reconstrucciones comunitarias.

### Superficie observable frente a interior

Una rueda de armas visible permite deducir las restricciones de equipamiento en la experiencia de usuario, pero no el formato de guardado de las armas. Un vehículo con alarma demuestra una regla del juego, no que dicha alarma sea una entidad sincronizable en un futuro servidor. De manera similar, ver a un NPC llamando a la policía no prueba la arquitectura de la inteligencia artificial.

### Límites del multijugador

La campaña y un futuro entorno en línea deben tratarse como productos funcionalmente distintos. Ninguna de las referencias revisadas define una API pública para crear servidores de rol de GTA VI, protocolos de red, ganchos de eventos, distribución de scripts ni compatibilidad con FiveM o su equivalente futuro. Cualquier diseño de CALM sobre esa base debe usar adaptadores sustituibles.

### Actualización de versiones

Cada cambio publicado por Rockstar puede alterar controles, inventario, iconografía, economía, balance y disponibilidad de contenido. Se recomienda documentar cada observación con la plataforma, edición y versión, porque un atributo de un paquete especial o una modificación posterior puede no estar presente en la edición estándar.

### Ficha sintetica

| Elemento          | Descripción                                              | Estado         |
| ----------------- | -------------------------------------------------------- | -------------- |
| PS5               | Lanzamiento confirmado                                   | A              |
| Xbox Series X/S   | Lanzamiento confirmado                                   | A              |
| PC                | No confirmado por la documentación de lanzamiento citada | Sin afirmación |
| Servidor RP / API | Sin especificación oficial pública verificada            | No extrapolar  |

**Pendiente:** La ausencia de confirmación en las fuentes examinadas no demuestra que algo sea imposible: sólo impide tratarlo como capacidad disponible.

**Fuentes:** F01, F03, F04, F05, F26

## 03. Leonida: geografía, zonas y espacios jugables

El mundo de GTA VI gira alrededor de Vice City y el estado ficticio de Leonida. La presentación oficial identifica seis paisajes o regiones de referencia, pero esos nombres no constituyen por sí mismos un mapa administrativo completo.

**Lámina 03:** [consultar esquema original en el PDF, pág. 5](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=5).

### Los seis entornos principales

Rockstar destaca Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia y Mount Kalaga. Se distinguen por su paisaje urbano, litoral, pantanos, zonas industriales, corredores rurales y áreas naturales. Su importancia funcional reside en que condicionan transportes, vehículos, fauna, actividades y escenas narrativas, no sólo la apariencia.

### Cómo documentar cada región

El catálogo territorial debe registrar nombre oficial, variantes, límites confirmados, subzonas, edificios, servicios, cuerpos policiales presentes, grupos criminales y actividades. Una captura de un edificio basta para acreditar su presencia, pero no para asegurar que el interior sea accesible, que pueda comprarse o que tenga actividad económica.

### Biomas, movilidad y conectividad

Las Keys introducen una red de carreteras, puentes y rutas marítimas; Grassrivers favorece navegación de aguas poco profundas y fauna; las ciudades ofrecen redes de comercio y tráfico; las áreas rurales amplían la diversidad de vehículos y encuentros. Esta lectura de diseño está respaldada por el paisaje presentado, no por una simulación de movilidad interna revelada públicamente.

### Mapas disponibles

Rockstar distribuye un mapa oficial imprimible mediante la sección Media. Es preferible utilizarlo como referencia geográfica primaria; mapas comunitarios procedentes de reconstrucciones o filtraciones pueden estar incompletos o alterados. Los esquemas de esta obra son mapas conceptuales y no cartografía exacta de Leonida.

### Ficha sintetica

| Elemento      | Descripción               | Estado                                |
| ------------- | ------------------------- | ------------------------------------- |
| Vice City     | Urbano y litoral          | Comercio, transporte, barrios, bandas |
| Leonida Keys  | Archipiélago y puentes    | Embarcaciones y actividades costeras  |
| Grassrivers   | Humedales                 | Fauna, navegación y contrabando       |
| Port Gellhorn | Ciudad y costa occidental | Industria, servicios y grupos locales |
| Ambrosia      | Entorno rural-industrial  | Transporte y motoristas               |
| Mount Kalaga  | Zona natural de montaña   | Exploración, rutas y paisaje          |

**Pendiente:** No se incluyen coordenadas inventadas, polígonos de jurisdicción ni distancias sin verificación visual o cartográfica.

**Fuentes:** F02, F03, F06, F25

## 04. Personajes y vínculos narrativos

Los protagonistas son Jason Duval y Lucia Caminos. La campaña utiliza sus relaciones, contactos y objetivos como mecanismo de progresión, y algunas guías describen un indicador de relación entre ambos.

**Lámina 04:** [consultar esquema original en el PDF, pág. 6](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=6).

### Jason y Lucia

Rockstar presenta a Jason como un antiguo soldado relacionado con contrabandistas de las Keys y a Lucia como una mujer que ha pasado por el sistema penitenciario de Leonida. Su alianza es el eje de la campaña. El relato oficial no equivale a una ficha de atributos jugables, y los rasgos narrativos no deben traducirse automáticamente en modificadores de juego.

### Red de personajes

Entre los personajes presentados oficialmente se encuentran Cal Hampton, Boobie Ike, Dre’Quan Priest, Real Dimez, Brian Heder y Raul Bautista. Algunos son contactos o socios criminales; otros gestionan negocios o forman parte del sector musical. Para documentarlos correctamente conviene distinguir personaje, empresa, banda, equipo operativo y afiliación temporal.

### Relación entre protagonistas

Las guías posteriores al lanzamiento muestran niveles de relación y consecuencias vinculadas a encuentros y comunicaciones. Deben separarse las actividades narrativas en pareja de una mecánica genérica de reputación aplicable a todos los ciudadanos de Leonida. La existencia de un medidor romántico no prueba automáticamente un sistema social universal.

### Protagonistas en operaciones

La campaña ofrece situaciones donde ambos participan en atracos, con distribución de funciones y coordinación. El testimonio de El País sobre la demostración dirigida por Rockstar menciona que uno puede vigilar a rehenes mientras el otro actúa. Esta observación sirve para documentar reparto de tareas, pero no implica que los NPC acompañantes tengan una API pública.

### Ficha sintetica

| Elemento        | Descripción                  | Estado   |
| --------------- | ---------------------------- | -------- |
| Jason Duval     | Protagonista                 | Rockstar |
| Lucia Caminos   | Protagonista                 | Rockstar |
| Cal Hampton     | Contacto de Jason            | Rockstar |
| Boobie Ike      | Empresario y figura criminal | Rockstar |
| Dre’Quan Priest | Promotor musical             | Rockstar |
| Raul Bautista   | Atracador y líder de equipo  | Rockstar |

**Pendiente:** Registrar personajes secundarios con sus identidades oficiales y no asumir apariciones en misiones no consultadas.

**Fuentes:** F02, F07, F23, F24

## 05. Bandas, organizaciones y cuerpos públicos

Leonida incluye organizaciones criminales, negocios legítimos, redes personales y agencias policiales. Estos tipos no deben fusionarse: aparecer en el mundo no demuestra que cada grupo disponga de territorio conquistable, rangos administrables o un sistema de reputación abierto.

**Lámina 05:** [consultar esquema original en el PDF, pág. 7](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=7).

### Empresas y redes confirmadas oficialmente

La documentación narrativa de Rockstar vincula a Boobie Ike con inmuebles, el club Jack of Hearts y el ámbito discográfico; menciona Only Raw Records, la carrera del dúo Real Dimez, la red de contrabando de Brian Heder y el equipo de robos de Raul. Estas entidades son comprobables como parte del mundo narrativo, aunque no todas tengan comportamiento organizativo simulado.

### Bandas catalogadas tras el lanzamiento

GTABase recoge PTT Youngin$, San4San, The Guardia Brothers, M7, La Polilla Negra, Final Chapter MC, Kingfishers y Kolt & Associates. PowerPyx relaciona operaciones ilegales con bandas concretas; identifica 39 localizaciones en la categoría de operaciones de bandas. La cifra se refiere a puntos de actividad, no a integrantes, bases permanentes o territorios conquistables.

### Fuerzas de seguridad

Se identifican departamentos municipales, sheriffs de condado, patrullas de carreteras, servicios penitenciarios y organismos relacionados con la fauna. La presencia de un distintivo o vehículo oficial no acredita por sí misma límites jurisdiccionales mecánicos. La investigación futura debe comprobar quién responde a qué delito, qué vehículo aparece y cómo evoluciona la intervención.

### Taxonomía recomendada

La ficha de organización debe tener `tipo`, `nombre`, `zona`, `miembros_verificados`, `locales`, `actividades`, `evidencias`, `mecánicas_observadas` y `hipótesis`. Separar «banda criminal», «negocio», «equipo de atraco» y «agencia pública» evita construir conclusiones sobre funciones que no existen para todos los casos.

### Ficha sintetica

| Elemento             | Descripción                | Estado                |
| -------------------- | -------------------------- | --------------------- |
| PTT Youngin$         | Banda callejera            | Southside / Vice City |
| San4San              | Banda callejera            | La Perle              |
| The Guardia Brothers | Organización criminal      | Little Cuba           |
| M7                   | Banda callejera            | Hamlet                |
| Final Chapter MC     | Motoristas fuera de la ley | Ambrosia              |
| Kingfishers          | Contrabando                | Grassrivers           |
| La Polilla Negra     | Cártel                     | Watson Bay            |
| Kolt & Associates    | Criminales                 | Port Gellhorn         |

**Pendiente:** No hay evidencia suficiente para afirmar que el jugador pueda fundar bandas, conquistar barrios o gestionar rangos libremente.

**Fuentes:** F02, F13, F18

## 06. El teléfono: estructura, accesos y servicios

El teléfono ya no es sólo una agenda. Las fuentes posteriores al lanzamiento lo describen como el acceso principal a comunicaciones, banca, información sobre coches, viajes, medios y progreso físico.

**Lámina 06:** [consultar esquema original en el PDF, pág. 8](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=8).

### Apertura y contexto

GTABase describe el acceso mediante la cruceta superior y un acceso directo a WAiNK manteniendo esa dirección. Las aplicaciones pueden aparecer a medida que avanza la historia. El teléfono también puede abrirse durante viajes en ciertos vehículos; la disponibilidad exacta debe probarse por plataforma y situación de gameplay.

### Aplicaciones nucleares

Contacts gestiona llamadas y números de servicios; Reminders recuerda avisos; WhatUp se usa para comunicación; WAiNK examina las características de vehículos; BuckMe reúne funciones bancarias; RydeMe permite solicitar transporte con cargo a cuenta; Fitness muestra entrenamiento. Las redes y medios incluyen Snapmatic y News. No todo menú contextual es necesariamente una aplicación separada.

### Dependencias operativas

WAiNK se vincula con el reconocimiento del automóvil antes de su robo. BuckMe está relacionado con el depósito de efectivo y las consecuencias de ser detenido. RydeMe se integra con navegación y desplazamiento. Las comunicaciones de contactos pueden iniciar tareas y misiones. Por ello la aplicación visible y los sistemas de mundo detrás de ella deben documentarse por separado.

### Cuestiones no cerradas

Las fuentes no permiten certificar el número final de aplicaciones en cada punto de la historia, su almacenamiento interno, condiciones de ausencia de cobertura o posibles diferencias de interfaz por personaje. Tampoco debe confundirse un servicio accesible por llamada con una app instalada. Las capturas oficiales no sustituyen a una captura directa de cada pantalla.

### Ficha sintetica

| Elemento         | Descripción                     | Estado |
| ---------------- | ------------------------------- | ------ |
| Contacts         | Llamar a personajes y servicios | B/C    |
| Reminders        | Recordatorios y avisos          | C      |
| WAiNK            | Escanear vehículos y seguridad  | B/C    |
| BuckMe           | Cuentas y dinero                | B/C    |
| RydeMe           | Solicitud de transporte         | B/C    |
| Fitness          | Entrenamientos y atributos      | B/C    |
| WhatUp           | Mensajería                      | C      |
| Snapmatic / News | Red social e información        | C      |

**Pendiente:** Consultar las fichas ampliadas de aplicaciones en el anexo; no hay iconos oficiales recreados en este documento.

**Fuentes:** F07, F14, F16, F27

## 07. HUD, iconografía, mapa y navegación

La interfaz combina marcadores de navegación, información de estado, economía, vehículos, perfiles criminales y comunicaciones. El significado del icono debe documentarse junto con el contexto de aparición y los posibles cambios de color.

**Lámina 07:** [consultar esquema original en el PDF, pág. 9](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=9).

### HUD y estados

GTABase identifica iconos de salud, resistencia, concentración, mejoras temporales, adrenalina y dinero transportado. El sistema policial presenta estados especiales, y el jugador puede mostrar información relativa a vehículos. Las diferencias cromáticas deben validarse con una captura: una etiqueta descriptiva no demuestra el valor RGB exacto del icono.

### Mapa y objetivos

Las misiones principales y secundarias están diferenciadas mediante marcadores. PowerPyx describe marcadores rosas con letra negra para historia, negros con letra rosa para misiones opcionales y morados para tareas pequeñas. También señala un icono de reloj de arena para eventos temporales. El mapa incorpora menús de progreso, actividades, robos y coleccionables.

### Accesibilidad

Rockstar documenta ajustes oficiales de escalado, legibilidad, subtítulos, retícula, navegación, notificaciones, estado del vehículo y unidades de medida. También existen esquemas de control diferenciados según el modo de locomoción. El catálogo de iconos debería mantener el identificador y el estado semántico independientes del estilo gráfico.

### Cómo levantar un atlas visual real

Para cada recurso necesitamos captura con resolución, fecha y versión, recorte, ubicación del elemento, estado de interfaz, transcripción literal, descripción semántica, color estimado y fuente. No se deben incluir dibujos generados en una base de iconos atribuidos a Rockstar. Las láminas aquí son claves conceptuales de lectura.

### Ficha sintetica

| Elemento | Descripción                      | Estado          |
| -------- | -------------------------------- | --------------- |
| Jugador  | Vida, resistencia, Focus, dinero | Estado personal |
| Vehículo | Combustible, daño, rastreador    | Conducción      |
| Policía  | Respuesta, búsqueda, heat        | Reconocimiento  |
| Progreso | Marcadores y descubrimientos     | Navegación      |
| Teléfono | Apps, llamadas, avisos           | Servicios       |
| Relación | Estado de protagonistas          | Narrativa       |

**Pendiente:** Falta inventario de variantes visuales en las distintas plataformas; las imágenes de apoyo del libro no representan píxeles oficiales.

**Fuentes:** F04, F07, F16, F17, F20

## 08. Campaña, encargos y ciclo de misión

PowerPyx registra una campaña organizada en cinco capítulos y una estructura de tareas principales, opcionales y encuentros. La campaña está vinculada con la presentación progresiva de herramientas, propiedades y servicios.

**Lámina 08:** [consultar esquema original en el PDF, pág. 10](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=10).

### Capítulos y orden

El tutorial y las misiones iniciales presentan desplazamiento, manejo de vehículos, primeros encargos, mantenimiento del automóvil y banco. PowerPyx señala que algunas misiones cambian ligeramente de posición según el avance, y que mensajes telefónicos pueden anunciar contenidos nuevos. La existencia de cinco capítulos pertenece a la guía, no a una declaración técnica oficial del motor.

### Misiones principales

Se activan mediante marcadores específicos, producen objetivos de pantalla y permiten avanzar la historia. Para documentarlas hay que conservar desencadenante, personaje emisor, objetivo, duración, ubicación, requisitos de equipo y consecuencias. El nombre del marcador de inicio puede no coincidir con el título que aparece durante la misión.

### Misiones opcionales y temporales

Las tareas secundarias pueden introducir sistemas útiles para la exploración y la economía. Algunas aparecen con reloj de arena y pueden perderse temporalmente; según PowerPyx, esto no impide la lista de logro del 100 %. Debe diferenciarse una misión «perdible» en la historia de un contenido necesario para la completitud.

### Repetición y guardado

La guía dice que las misiones de historia no incluyen medallas de oro ni repetición directa, y recomienda utilizar guardados manuales antes de capítulos. Este comportamiento puede cambiar en parches, por lo que hay que registrar plataforma y build. No inferimos de ello el formato de estado interno de las misiones.

### Ficha sintetica

| Elemento     | Descripción                | Estado                        |
| ------------ | -------------------------- | ----------------------------- |
| Preparada    | Se cumplen requisitos      | Disponible en mapa / mensajes |
| Activada     | El jugador acepta o inicia | Objetivos visibles            |
| En curso     | Secuencia de objetivos     | Vehículos, NPC, interacción   |
| Completada   | Recompensas / desbloqueos  | Persistencia observable       |
| Interrumpida | Fallo o abandono           | Reintento según el caso       |

**Pendiente:** La ficha MIS-TPL-01 del anexo contiene todos los campos para catalogar cada misión de forma individual.

**Fuentes:** F07, F09, F15

## 09. Actividades, coleccionables y progreso global

El menú Progress constituye una segunda capa distinta de la campaña. Registra colecciones, vehículos, animales, armas, actividades, establecimientos y operaciones delictivas, aunque sólo una parte es necesaria para el 100 % formal.

**Lámina 09:** [consultar esquema original en el PDF, pág. 11](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=11).

### Base de datos de descubrimientos

PowerPyx contabiliza 557 entradas de vehículos, desglosadas en 277 modelos base y 280 variantes destacadas; también registra 196 entradas de armas incluyendo variantes y 255 animales. Estos números son un censo de la guía de progreso revisada, no una garantía de que todos los objetos existan en todas las ediciones sin variaciones.

### Actividades físicas y recreativas

Las categorías incluyen pesca, caza, golf, billar, tiro, carreras, drones, saltos y otros desafíos. Para cada una debe anotarse si es actividad repetible, misión con puntuación, reto de descubrimiento o interacción ambiental. El hecho de aparecer en un índice no implica que todas las actividades tengan un sistema de progresión complejo.

### Objetivo 100 %

La guía de PowerPyx indica que el 100 % oficial usa objetivos seleccionados y no exige descubrir el 100 % de todas las entradas posibles. Un ejemplo son las metas de escaneo de vehículos y estudio de fauna. El concepto de «completitud» debe asociarse a un menú específico del juego y no a una suma libre de todos los contenidos.

### Modelado de colecciones

Cada ficha de actividad puede registrar tipo, localización, desbloqueo, condición de finalización, puntuación, repetibilidad, recompensas, marcador de mapa y referencia. Mantener la dimensión «descubierto», «iniciado» y «completado» permite comparar fuentes sin duplicar cifras.

### Ficha sintetica

| Elemento             | Descripción | Estado                                                         |
| -------------------- | ----------- | -------------------------------------------------------------- |
| Vehículos            | 557 fichas  | 277 base + 280 variantes destacadas                            |
| Armas                | 196 fichas  | 53 de fuego + 9 cuerpo a cuerpo + 4 explosivos + 130 variantes |
| Fauna                | 255         | Categorías terrestres, marinas y aves                          |
| Equipo               | 12          | Desbloqueos narrativos                                         |
| Operaciones ilegales | 39          | Relacionadas con bandas                                        |
| Atracos bancarios    | 22          | 14 pequeños + 8 con bóveda grande                              |

**Pendiente:** Las cifras están fechadas y dependen de una guía externa; evitar mezclar entradas de base de datos con objetos físicos únicos.

**Fuentes:** F14, F15, F09, F13

## 10. Dinero, banca, compras, servicios y propiedades

El dinero del personaje se distribuye en efectivo transportado y banca. Comercios, transporte, armas, reparaciones, garajes y compraventa de bienes conectan la economía con las misiones y los robos.

**Lámina 10:** [consultar esquema original en el PDF, pág. 12](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=12).

### Efectivo frente a cuenta bancaria

BuckMe sirve como interfaz bancaria. Las guías señalan que portar efectivo tiene riesgo de pérdida al morir o ser detenido, mientras que la cuenta permite proteger fondos aunque se describen ciertas tasas. Conviene verificar por experimento la diferencia de pérdidas en cada supuesto; la existencia de ambos saldos no acredita un sistema bancario multijugador.

### Origen del valor

El jugador consigue dinero de misiones, actividades y robos. En determinados atracos el botín incluye objetos que deben transportarse y posteriormente venderse a compradores especializados. El ingreso final se diferencia del valor nominal del objeto, y puede estar condicionado por el tipo de mercancía y el comprador.

### Gastos y servicios

La documentación registra estaciones de servicio, talleres, tiendas de armas, ropa, garajes y transporte. Las cifras de establecimientos de la guía de progreso deben tratarse como recuentos de su base de datos, no como listas cerradas y oficiales del mundo. Algunas modalidades de servicio requieren desbloquear antes un contacto o una aplicación.

### Propiedad y estado

Los vehículos registrados y garajes introducen una diferencia entre posesión y mera utilización. Debe documentarse qué propiedad conserva un objeto tras morir, ser detenido, cambiar de protagonista o reiniciar la partida. No se ha probado mediante fuentes primarias que exista una API externa para manipular cuentas o titularidades.

### Ficha sintetica

| Elemento   | Descripción           | Estado                                     |
| ---------- | --------------------- | ------------------------------------------ |
| Efectivo   | Cartera               | Disponible inmediatamente; riesgo descrito |
| BuckMe     | Cuenta                | Depósito y operaciones de banco            |
| Botín      | Mercancía u objetos   | Necesita transporte y a veces venta        |
| Garaje     | Servicio de propiedad | Guarda vehículos según condiciones         |
| Taller     | Servicio de gasto     | Repara o modifica                          |
| Transporte | Gasto                 | RydeMe y taxis                             |

**Pendiente:** No extrapolar inflación, impuestos, empresas de jugadores ni balances persistentes entre usuarios: no están acreditados.

**Fuentes:** F07, F08, F14, F16, F19

## 11. Robos a tiendas, joyerías y casas de empeño

La categoría de robos contiene establecimientos con procedimientos diferentes: sustraer efectivo de caja no es lo mismo que desactivar vigilancia, acceder a una trastienda y extraer mercancía de vitrinas.

**Lámina 11:** [consultar esquema original en el PDF, pág. 13](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=13).

### Tiendas ordinarias

PowerPyx contabiliza 72 tiendas de conveniencia, 14 licorerías y 23 restaurantes en el menú de progreso, pero sólo encuentra 21 de comida rápida en el mapa. La mecánica descrita para esos establecimientos se centra en intimidar al dependiente y retirar efectivo de caja. La diferencia 23/21 permanece anotada como discrepancia, no corregida sin evidencia.

### Joyerías

La guía señala 20 joyerías y las vincula con un desbloqueo en el capítulo 3. En las operaciones relevantes pueden intervenir vitrinas, zonas traseras, caja fuerte, alarma y grabación de seguridad. La interacción en pareja permite repartir funciones y reducir en determinados supuestos la reacción de los guardias, según la guía y la demostración recogida por El País.

### Casas de empeño

La guía contabiliza 15 y sitúa su acceso progresivo durante el capítulo 2. Incluyen objetos de valor expuestos y, en algunos casos, trastienda y caja fuerte. El criterio de atraco completo puede exigir recuperar el contenido principal, no sólo provocar una respuesta policial.

### Préstamos y efectivo protegido

Siete locales de préstamos rápidos se describen con cajones de dinero y cajas fuertes. El inhibidor de tinta se desbloquea mediante misiones y afecta a determinados billetes de seguridad. Al tratarse de un comportamiento del juego, las instrucciones se documentan como reglas lúdicas observadas, no como instrucciones sobre seguridad del mundo real.

### Ficha sintetica

| Elemento      | Descripción       | Estado                         |
| ------------- | ----------------- | ------------------------------ |
| Conveniencia  | 72                | Caja y dependiente             |
| Licorerías    | 14                | Caja y dependiente             |
| Comida rápida | 23 menú / 21 mapa | Discrepancia abierta           |
| Joyerías      | 20                | Vitrinas / trastienda / alarma |
| Empeños       | 15                | Objetos / caja fuerte          |
| Préstamos     | 7                 | Dinero / protección            |

**Pendiente:** La categoría «11 tipos de robos» de PowerPyx agrupa también marcas bancarias, no representa 11 motores de atraco distintos.

**Fuentes:** F08, F09, F23

## 12. Bancos, cajeros, bandas y operaciones de alto valor

Los robos de mayor nivel introducen objetivos especializados: bancos con distintos tipos de cámara, extracción de cajeros y lugares de almacenamiento de mercancías ilegales.

**Lámina 12:** [consultar esquema original en el PDF, pág. 14](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=14).

### Instituciones bancarias

PowerPyx registra 22 bancos en total, 14 pequeños y 8 con cámaras de grandes dimensiones, distribuidos entre Fleeca, Shorefront, Lombank e independientes. Las marcas son una clasificación de lugares, y las reglas de seguridad pueden variar; no debe asumirse que cada marca constituye una mecánica completamente aislada.

### Cajeros

La guía vincula el desbloqueo de robos a cajeros con el personaje Yasmani y señala vehículos equipados para retirar los dispositivos de su lugar. Debe comprobarse qué herramientas son obligatorias, el tipo de botín, la respuesta policial y las limitaciones de cada vehículo. El ejemplo ilustra la dependencia entre misión, equipo y objetivo económico.

### Operaciones de bandas

PowerPyx cataloga 39 lugares de operaciones ilegales, cada uno vinculado a una banda. Estas ubicaciones pueden mostrar varios objetos de interés, como efectivo, objetos valiosos o mercancías. Se indica que pueden volver a estar disponibles pasado un tiempo, por lo que la persistencia del marcador y la repetibilidad no son necesariamente equivalentes.

### Preparación y ejecución

Las operaciones de campaña pueden incorporar reconocimiento, obtención de equipamiento, acceso, vigilancia, extracción y escape. El orden se reconstruye de las guías de misión y la presentación jugable; no se conoce una estructura universal de scripts. Para la base técnica es más útil registrar la secuencia de estados y condiciones que intentar copiar una misión narrativa literalmente.

### Ficha sintetica

| Elemento              | Descripción | Estado                                     |
| --------------------- | ----------- | ------------------------------------------ |
| Fleeca                | 8           | Marca bancaria                             |
| Shorefront            | 6           | Marca bancaria                             |
| Lombank               | 6           | Marca bancaria                             |
| Independientes        | 2           | Sin esas tres marcas                       |
| Operaciones de bandas | 39          | En nueve agrupaciones de guía              |
| Cajeros               | No cerrado  | Requiere herramienta / vehículo específico |

**Pendiente:** La ejecución de un atraco real no forma parte del objetivo de esta obra: se describen sistemas ficticios y sus consecuencias de juego.

**Fuentes:** F07, F08, F09, F13, F14

## 13. Armas y combate: equipamiento inmediato

La estructura de equipo visible difiere del inventario ilimitado de algunas entregas anteriores. Las guías describen un conjunto reducido de armas encima del personaje y un almacenamiento alternativo en vehículo o armero.

**Lámina 13:** [consultar esquema original en el PDF, pág. 15](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=15).

### Carga operativa

GTABase describe dos armas cortas, dos largas, explosivos y un arma cuerpo a cuerpo, además del equipamiento auxiliar. La rueda sirve para seleccionar lo disponible; el resto puede mantenerse en maleteros o taquillas de armas. La restricción visible debe separarse de la capacidad de propiedad de armas en toda la partida.

### Origen y titularidad

Las guías distinguen armas adquiridas, encontradas y variantes especiales. Cada procedencia puede condicionar recuperación, modificaciones y persistencia. Para una investigación rigurosa debe probarse pérdida por detención, muerte, abandono, cambio de equipamiento y utilización de distintos tipos de maletero.

### Accesorios y modificaciones

Se documentan compras y mejoras en Ammu-Nation; el sistema de personalización incluye accesorios, miras, iluminación y otros cambios dependientes del arma. El resultado sobre precisión, daño o retroceso no debe especificarse con porcentajes si no se ha medido. Las 196 entradas de PowerPyx incluyen 130 variantes, por tanto no son 196 tipos básicos de arma.

### Interacción policial

Portar un arma larga visible puede influir en el reconocimiento de sospechosos. El sistema de combate y el de policía se conectan por más vías que las estrellas: vestimenta, arma mostrada y perfil criminal. Esta relación puede estudiarse observando HUD y reacciones, sin atribuir control sobre esos estados a herramientas de servidor.

### Ficha sintetica

| Elemento          | Descripción         | Estado                                |
| ----------------- | ------------------- | ------------------------------------- |
| Cortas            | 2                   | Equipadas                             |
| Largas            | 2                   | Equipadas                             |
| Cuerpo a cuerpo   | 1                   | Equipada                              |
| Explosivos        | Categoría adicional | Según inventario                      |
| Maletero / armero | Almacenamiento      | Alternativa al equipamiento inmediato |
| Variantes         | 130 en guía         | No equivalen a tipos base             |

**Pendiente:** No se conoce una fórmula oficial pública de daño por distancia, balística, penetración o protección corporal.

**Fuentes:** F14, F17, F19, F20

## 14. Inventario, herramientas y almacenamiento

El sistema distingue el equipo que lleva el personaje, los objetos que están en el vehículo y los bienes que se transportan como botín. No existe documentación suficiente para afirmar que se implemente un inventario universal por kilogramos.

**Lámina 14:** [consultar esquema original en el PDF, pág. 16](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=16).

### Equipo de progreso

PowerPyx identifica doce piezas: prismáticos, linterna, bolsa, auriculares, palanca, máscaras, detector de metales, Slim Jim, Snap Gun, herramienta de corte, clonador de llaves e inhibidor de paquetes de tinta. Muchas aparecen mediante misiones y algunas se activan en una interacción en lugar de usarse como objeto manual.

### Almacenamiento en vehículos

GTABase distingue maletero de vehículo personal y de vehículo ajeno. Ambos pueden transportar ciertos objetos, pero el vehículo personal habilita prestaciones adicionales como cambio de armamento y atuendo. Las guías describen restricciones y diferencias si el jugador muere o es detenido. La presencia de maletero accesible no implica un sistema general de capacidad física medible.

### Bolsa de botín

Las bolsas de atraco permiten separar objetos adquiridos mediante delitos del dinero de la cartera y del equipamiento de combate. La cadena de botín incluye obtención, transporte, posible pérdida y conversión en dinero. Para construir una ficha exhaustiva habrá que comprobar límites por tipo, animaciones, compatibilidad con vehículos y respuesta de NPC.

### Modelo de estado recomendado

Documentar `ubicación` (personaje, maletero, armero, bolsa), `origen`, `titularidad`, `persistencia`, `consumo`, `método de uso`, `bloqueos de misión` y `efecto visible`. Es un esquema de investigación, no una representación afirmada de las estructuras internas del juego.

### Ficha sintetica

| Elemento          | Descripción                 | Estado                         |
| ----------------- | --------------------------- | ------------------------------ |
| Personaje         | Armas / ítems inmediatos    | Acceso rápido                  |
| Vehículo personal | Maletero, cambios de equipo | Propiedad condiciona funciones |
| Vehículo ajeno    | Almacenamiento limitado     | Riesgo de pérdida              |
| Armero            | Recuperación de armas       | Relacionado con compra         |
| Bolsa             | Objetos sustraídos          | Transporte y venta             |
| Peso exacto       | Desconocido                 | No documentado                 |

**Pendiente:** La presencia de cuatro contenedores visuales no demuestra un solo inventario global con el mismo límite para todos.

**Fuentes:** F09, F19, F14

## 15. Vehículos: conducción, combustible y mantenimiento

La navegación y los vehículos están integrados con el combustible, las reparaciones, la seguridad, el estacionamiento, el transporte contratado y los servicios del teléfono.

**Lámina 15:** [consultar esquema original en el PDF, pág. 17](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=17).

### Acciones de conducción

GTABase enumera aceleración, frenado, freno de mano, bocina, visión posterior, derrape y acciones adicionales como ocultarse en el habitáculo o disparar desde él. También describe interacción con puertas y uso de radio o funciones del vehículo. Estos comportamientos son elementos de control, no parámetros de simulación física documentados.

### Combustible y daños

Las guías señalan consumo de combustible, estaciones de servicio, reparación y modificaciones. PowerPyx advierte que el consumo continúa durante la conducción automática. La relación entre tipo de motor, capacidad de depósito, peso, conducción y consumo carece de una tabla oficial pública en las fuentes revisadas.

### Conducción automática

PowerPyx explica que se configura desde opciones de jugabilidad, utiliza el destino del mapa y la cámara cinematográfica. Se documenta para vehículos y embarcaciones, excluyendo aeronaves. Esto implica una función de desplazamiento automatizado para el jugador, no una prueba de un sistema abierto de navegación de NPC accesible desde plugins.

### Catálogo de medios

La base de progreso de PowerPyx separa vehículos base y variantes destacadas, e incluye coches, motos, embarcaciones, aeronaves, vehículos de servicios, industriales y militares. Las categorías son útiles para un inventario, pero no permiten conocer sin pruebas las reglas de propiedad o personalización de cada unidad.

### Ficha sintetica

| Elemento      | Descripción                        | Estado                |
| ------------- | ---------------------------------- | --------------------- |
| Terrestres    | Combustible, daños, radio          | Mecánica descrita     |
| Embarcaciones | Navegación y conducción automática | Mecánica descrita     |
| Aeronaves     | Controles diferenciados            | Sin Autodrive en guía |
| Garajes       | Persistencia y titularidad         | Condicionada          |
| Talleres      | Reparación y modificaciones        | Varía según vehículo  |

**Pendiente:** Registrar cualquier prueba de tracción, neumáticos, deformación, frenado o colisión por versión y vehículo, sin extrapolar a todas las clases.

**Fuentes:** F04, F12, F14, F21

## 16. Robo, seguridad y titularidad de vehículos

Sustraer un vehículo puede requerir acciones diferentes según sus cerraduras, seguridad y rastreo. WAiNK conecta la investigación de un automóvil con sus posibilidades de robo.

**Lámina 16:** [consultar esquema original en el PDF, pág. 18](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=18).

### Accesos observados en guías

Se describen sustracción al conductor, rotura de ventanilla, herramientas para cerraduras y clonación de llaves electrónicas en modelos compatibles. Las herramientas no están disponibles desde el principio, lo que vincula el robo con la progresión narrativa. Esta clasificación corresponde al funcionamiento del videojuego, no a técnicas del mundo real.

### Información previa

La aplicación WAiNK puede mostrar el modelo, condición, alarma y rastreador. No implica que todos los coches reaccionen igual a una técnica de acceso. Para cada tipo se deben conservar observaciones sobre posibilidad de entrada, duración de animación, aviso policial, rastreo, reparación y registro.

### Rastreo e identificación

GTABase y PC Gamer describen vehículos con rastreadores que pueden contribuir a alertas y búsqueda policial. Cambiar la apariencia del coche o acudir a determinados talleres podría interactuar con el estado de reconocimiento; las condiciones precisas deben probarse evitando dar por universal una regla de una guía.

### Vehículos personales

Los vehículos registrados ofrecen ventajas de persistencia y acceso al maletero. La pregunta clave no es sólo si el jugador conduce un coche, sino si puede reclamarlo, modificarlo, guardarlo, llamarlo, perderlo y recuperarlo. Cada transición debe registrarse en la matriz de pruebas.

### Ficha sintetica

| Elemento           | Descripción                 | Estado                               |
| ------------------ | --------------------------- | ------------------------------------ |
| Coche sin ocupante | Acceso condicionado         | Cerradura / herramienta              |
| Coche con ocupante | Sustracción al conductor    | Reacción y testigos                  |
| Sin llave          | Clonación compatible        | Depende de vehículo y progreso       |
| Alarma             | Aviso de seguridad          | Estado específico                    |
| Rastreador         | Identificación del vehículo | Puede alertar a policía              |
| Registrado         | Propiedad persistente       | Requiere verificación de condiciones |

**Pendiente:** No atribuir al futuro multijugador reglas sobre llaves, garajes o seguros por el mero hecho de existir en campaña.

**Fuentes:** F09, F16, F20, F21, F22

## 17. Policía, testigos, cámaras y reconocimiento

La policía no se describe únicamente mediante estrellas: las guías presentan estados de respuesta y una memoria contextual limitada de qué sabe el sistema sobre el sospechoso.

**Lámina 17:** [consultar esquema original en el PDF, pág. 19](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=19).

### Secuencia del incidente

GTABase separa aviso, sospechoso desconocido, persecución activa, pérdida de contacto visual y zona de calor residual («heat»). Las estrellas reflejan gravedad y contexto, mientras indicadores específicos comunican información adicional. Esto no significa que todos los delitos generen idéntica respuesta en todas las regiones.

### Vectores de reconocimiento

La guía enumera apariencia, atuendo, vehículo, arma visible, acompañante y pruebas de videovigilancia. Distingue cámaras con grabación local y cámaras con almacenamiento remoto, que no se comportan igual. La documentación de una mecánica de pruebas digitales no ofrece especificaciones sobre el motor de detección.

### Cambios de estado

Las acciones de ocultar armas, cambiar ropa, alterar apariencia, modificar coche o escapar de una zona pueden modificar la atención policial según las condiciones descritas. Es importante documentar cuáles de estos estados se limpian y cuáles persisten, sin inferir por ello antecedentes judiciales completos, memoria de NPC individuales o reconocimiento facial real.

### Intervenciones y consecuencias

La gravedad del delito y la exposición del sospechoso afectan las respuestas. Las guías describen consecuencias sobre efectivo, armas o botín en detenciones y muertes. Los cuerpos policiales locales se estudian en el capítulo de organizaciones; su aparición no demuestra un sistema formal de jurisdicciones con límites rígidos.

### Ficha sintetica

| Elemento            | Descripción     | Estado                           |
| ------------------- | --------------- | -------------------------------- |
| Denunciado          | Cops Responding | Aviso recibido                   |
| Sin identidad       | Suspect Unknown | Sospechoso no identificado       |
| Persecución         | In Pursuit      | Contacto o localización conocida |
| Sin contacto visual | Visual Lost     | Búsqueda activa                  |
| Calor residual      | Heat            | Persisten señales en la zona     |

**Pendiente:** La guía contiene seis estrellas de gravedad, no seis estados de investigación. El esquema de estados de esta obra no reproduce los iconos oficiales.

**Fuentes:** F17, F20, F10, F21

## 18. Perfil criminal, violencia y consecuencias

El juego categoriza la conducta criminal de Jason y Lucia. PowerPyx describe cinco perfiles, modificables por la forma de cometer delitos y afrontar combates.

**Lámina 18:** [consultar esquema original en el PDF, pág. 20](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=20).

### Cinco perfiles

Professional, Hardened, Violent, Psycho e Irredeemable forman los cinco niveles que enumera PowerPyx. La guía asocia acciones de sigilo y poco daño con Professional y las conductas violentas con perfiles de mayor agresividad. Son etiquetas de progreso y consecuencias del juego, no diagnósticos reales de personalidad.

### Separación por personaje

PowerPyx señala que cada protagonista mantiene su perfil criminal. Esto impide suponer un indicador único para toda la partida. La ficha del personaje puede vincularse al efecto de Focus, reconocimiento policial y estadísticas, pero debe comprobarse la persistencia tras el cambio de protagonista.

### Discrepancias de nomenclatura

Algunas guías describen estados adicionales de advertencia o representación visual, que no necesariamente son un sexto perfil. El método de este atlas exige que una categoría permanente tenga una fuente textual o imagen del menú de progreso que la respalde. Mientras tanto, se adopta la clasificación de cinco niveles y se conserva la discrepancia.

### Separación causal

Que un nivel esté asociado a respuestas policiales distintas no garantiza que modifique todas las misiones, recompensas o NPC. Hace falta distinguir correlación de efecto causal. Las pruebas deberán repetir un mismo delito con perfiles diferentes manteniendo constantes vehículo, ropa, zona y gravedad.

### Ficha sintetica

| Elemento     | Descripción                 | Estado      |
| ------------ | --------------------------- | ----------- |
| Professional | Sigilo y baja violencia     | Perfil guía |
| Hardened     | Incapacitación sin matar    | Perfil guía |
| Violent      | Violencia letal             | Perfil guía |
| Psycho       | Escalada violenta           | Perfil guía |
| Irredeemable | Extremo de la clasificación | Perfil guía |

**Pendiente:** No confundir la clasificación de conducta con estrellas de búsqueda o con reputación entre bandas.

**Fuentes:** F10, F17, F20

## 19. NPC, mundo dinámico, fauna y sucesos ambientales

La vida del mundo puede estudiarse mediante encuentros, reacciones y actividades repetibles. La variedad visual de NPC no es prueba de una biografía persistentemente simulada para cada habitante.

**Lámina 19:** [consultar esquema original en el PDF, pág. 21](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=21).

### Encuentros y actividades

Las guías enumeran actividades ambientales, fauna estudiable, sitios para descubrir y misiones de personajes secundarios. Los encuentros pueden depender de la hora, zona, progreso y condiciones de acceso. Para cada evento conviene registrar si es aleatorio, guiado, repetible, temporal o generado por la historia.

### Fauna

PowerPyx registra 255 entradas de animales, con especies y variantes, incluyendo aves, peces, mamíferos, reptiles y mascotas. El progreso de estudio requiere una acción de observación; ello permite distinguir interacción ambiental de mecánicas de caza. No se infieren rutinas ecológicas persistentes de cada ejemplar individual.

### Tráfico y peatones

Las fuentes muestran circulación, testigos, interacción policial y reacción ante delitos. La observación de estos sistemas ofrece un punto de partida para analizar simulación local, pero no describe frecuencias de actualización, redes de comportamiento, prioridades ni presupuesto de NPC del motor RAGE.

### Fichas de acontecimientos

Cada evento debería guardar posición, condiciones de aparición, duración, participantes, comportamiento del jugador, desencadenantes de policía, desenlace y repetibilidad. Si un encuentro reaparece tras un tiempo, es necesario verificar si conserva consecuencias o se reinicia sin memoria personal.

### Ficha sintetica

| Elemento  | Descripción          | Estado                  |
| --------- | -------------------- | ----------------------- |
| Ambiental | Escena del mundo     | Puede no ser misión     |
| Encuentro | Acción o interacción | Puede iniciar contenido |
| Fauna     | Observar / estudiar  | Progreso documentado    |
| Tráfico   | Circulación          | Reglas por comprobar    |
| Seguridad | Testigo o alarma     | Puede activar policía   |

**Pendiente:** No está acreditada una simulación persistente integral de vida diaria para todos los NPC.

**Fuentes:** F02, F07, F14, F15, F20, F24

## 20. Comercios, propiedades, servicios y vida cotidiana

Los establecimientos no son sólo decorado: pueden atender necesidades, suministrar equipamiento, gestionar vehículos o servir como objetivos criminales. El inventario requiere distinguir servicio del establecimiento y posibilidad de atracarlo.

**Lámina 20:** [consultar esquema original en el PDF, pág. 22](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=22).

### Tipos de negocio documentados

La base de progreso de PowerPyx enumera talleres, Pay ’n’ Spray, gasolineras, lavaderos, Ammu-Nation, garajes, estaciones ferroviarias, terminales de ferry, tiendas de ropa y calzado, salones y estudios de tatuajes, entre otros. Estos recuentos sirven como indicadores aproximados de cobertura de la guía; no describen horarios reales ni la integridad de todos los interiores.

### Servicios económicos

Una tienda puede interactuar con dinero transportado, banco o inventario; un taller con daños y propiedad del vehículo; un gimnasio con progresión física; un transporte con destino y cargo económico. Registrar las dependencias permite explicar por qué los servicios no son simples menús aislados.

### Propiedades

El material público identifica garajes y espacios asociados a personajes. Sin embargo, la disponibilidad de cada inmueble para compra, alquiler o modificación debe probarse individualmente. La presencia de un edificio con letrero de agencia inmobiliaria no acredita un mercado inmobiliario jugable completo.

### Variantes y estado del comercio

El catálogo debe indicar si un negocio abre libremente, requiere misión, permite interacción permanente, puede ser atracado, tiene cámaras, cuenta con empleados y modifica un saldo o inventario. Estas son propiedades observables; cualquier motor de negocio de jugadores queda fuera del alcance confirmado.

### Ficha sintetica

| Elemento                 | Descripción | Estado           |
| ------------------------ | ----------- | ---------------- |
| Gasolineras              | 57          | Guía de progreso |
| Ammu-Nation              | 24          | Guía de progreso |
| Talleres de modificación | 14          | Guía de progreso |
| Pay ’n’ Spray            | 19          | Guía de progreso |
| Garajes                  | 13          | Guía de progreso |
| Estaciones ferroviarias  | 25          | Guía de progreso |

**Pendiente:** El número de entradas de base de datos no debe convertirse automáticamente en número definitivo de puntos activos en todo el mapa.

**Fuentes:** F14, F08, F11, F16, F21

## 21. Matriz de dependencias entre sistemas

El valor de la investigación está en descubrir qué sistemas se conectan entre sí. Un teléfono con WAiNK, por ejemplo, importa por su relación con vehículos y seguridad; una bolsa de botín, por el nexo entre atracos e ingresos.

**Lámina 21:** [consultar esquema original en el PDF, pág. 23](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=23).

### Cadena de vehículo

Progreso de historia -> disponibilidad de herramienta -> consulta WAiNK -> estado de alarma/cerradura/rastreador -> interacción de robo -> aviso a testigos/policía -> posible registro o abandono del vehículo. No se presupone que todas las etapas sucedan en todos los automóviles; representa el conjunto de dependencias observadas.

### Cadena económica

Oportunidad delictiva -> extracción de botín -> bolsa o vehículo -> comprador especializado -> ingreso en efectivo -> depósito en BuckMe -> pagos y compras. El resultado permite diferenciar mercancía, efectivo y saldo bancario, sin necesitar una fórmula cuantitativa todavía desconocida.

### Cadena de progresión

Misión -> contacto -> desbloqueo de equipo/servicio -> nuevas actividades o objetivos -> entrada en Progress. Este encadenamiento explica por qué la lista de objetos y establecimientos no debe interpretarse como totalmente accesible desde el prólogo.

### Capa de observación

Para cada flecha se registra la evidencia específica y si la dependencia es obligatoria, opcional o condicional. Un diagrama editorial puede representar una conexión plausible, pero debe etiquetarse como inferencia si no hay una prueba directa que la confirme.

### Ficha sintetica

| Elemento   | Descripción                     | Estado                |
| ---------- | ------------------------------- | --------------------- |
| Teléfono   | Vehículos / banco / viajes      | App y estado de mundo |
| Atraco     | Inventario / policía / economía | Resultado del delito  |
| Misiones   | Equipo / desbloqueos            | Progresión            |
| Conducción | Combustible / talleres / mapa   | Movimiento            |
| Perfil     | Policía / Focus                 | Conducta              |
| Mundo      | NPC / comercios / encuentros    | Simulación            |

**Pendiente:** Dependencias de campaña ≠ contratos de interfaz del motor ni eventos de red documentados.

**Fuentes:** F07, F08, F09, F16, F19, F20, F21

## 22. Aplicabilidad futura a CALM: hechos, abstracciones y riesgos

CALM puede utilizar este libro como referencia de diseño sin afirmar que disponga hoy de integración real con GTA VI. La reutilización técnica debe hacerse mediante contratos abstractos y adaptadores futuros.

**Lámina 22:** [consultar esquema original en el PDF, pág. 24](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=24).

### Tres capas estrictamente separadas

Capa 1: conocimiento observado del juego; Capa 2: modelo conceptual de CALM, independiente del cliente; Capa 3: adaptador real que sólo podrá implementarse cuando existan interfaces permitidas y demostradas. No debe introducirse un evento de motor inventado sólo porque coincida con un comportamiento visible en la campaña.

### Contratos de dominio

Los candidatos más útiles son `Identity`, `Faction`, `PhoneService`, `BankAccount`, `VehicleState`, `InventoryContainer`, `CrimeIncident`, `WantedState`, `Business`, `MissionDefinition` y `WorldEvent`. Son nombres de arquitectura propuestos para CALM, no funciones ni clases de Rockstar. Cada contrato debe evitar depender de identificadores de GTA V.

### Pruebas antes de implementar

La matriz de evidencias permite marcar qué capa existe: observación visual, diseño deseado, prototipo independiente, integración de prueba o soporte de plataforma verificado. Si todavía no existe soporte real, el componente se puede probar contra simuladores o datos de muestra, pero no presentarse como una característica nativa de GTA VI.

### Límites legales y éticos

El documento no contiene binarios filtrados, claves, código propietario ni datos obtenidos mediante acceso no autorizado. No presume licencia de Rockstar para copiar imágenes o mecánicas. El material oficial se enlaza y las figuras de esta edición son ilustraciones explicativas originales.

### Ficha sintetica

| Elemento           | Descripción             | Estado           |
| ------------------ | ----------------------- | ---------------- |
| Observación GTA VI | Fuente + prueba         | Dato documental  |
| Modelo CALM        | Interfaz abstracta      | Propuesta propia |
| Adaptador futuro   | Interfaz autorizada     | Pendiente        |
| Validación         | Prueba repetible        | Condicional      |
| Publicación        | Trazabilidad / derechos | Obligatoria      |

**Pendiente:** No existe en las fuentes examinadas una especificación pública de servidores RP de GTA VI reutilizable de manera directa.

**Fuentes:** F01, F04, F19, F20, F26

## 23. Lagunas, contradicciones y lista de verificación

Un inventario útil no oculta lo desconocido. Identifica explícitamente los vacíos y ofrece una forma de resolverlos mediante observación, nuevas fuentes, capturas o cambios de versión.

**Lámina 23:** [consultar esquema original en el PDF, pág. 25](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=25).

### Discrepancias comprobadas

Una guía presenta 23 restaurantes de comida rápida en el menú de progreso y 21 localizados en mapa. Las categorías de bancos suman 22 establecimientos y se descomponen por marcas, no por mecánicas. La noción de perfil criminal se describe con cinco etiquetas fijas, mientras algunos indicadores visuales pueden confundirse con niveles adicionales.

### Variables sin fórmula

No se han verificado las ecuaciones de consumo de combustible, daño balístico, dificultad de robos, probabilidades de aparición de eventos, algoritmos de reconocimiento o límites exactos de objetos en cada contenedor. La existencia de un valor en HUD no basta para inferir el cálculo subyacente.

### Asuntos fuera de cobertura

No disponemos de un inventario auditado de cada aplicación, interior, vehículo, pista musical, icono, misión y diálogo. La obra proporciona una estructura para ampliarlos y cifras de bases de datos, no el contenido íntegro y cerrado de cada uno. Tampoco sustituye al manual o a una compilación autorizada de recursos del juego.

### Protocolos de corrección

Registrar el identificador, fragmento afectado, afirmación anterior, nueva evidencia, fuente, fecha y cambio de grado. Cuando una rectificación afecta a una tabla o figura, reconstruir los tres artefactos: capítulo, registro en CSV y figura. No eliminar una discrepancia histórica sin conservar la nota de cambio.

### Ficha sintetica

| Elemento      | Descripción           | Estado                      |
| ------------- | --------------------- | --------------------------- |
| Pendiente     | App e icono real      | Captura por versión         |
| Pendiente     | Fórmulas de combate   | Pruebas controladas         |
| Pendiente     | Rangos de peso        | Inventario por contenedor   |
| Pendiente     | Jurisdicción policial | Incidentes repetidos        |
| Pendiente     | API / multijugador    | Documento oficial           |
| Contradicción | Comida rápida 23/21   | Doble fuente de menú / mapa |

**Pendiente:** Una afirmación puede pasar de C a B o A al obtener una evidencia mejor; conservar fecha, fuente y edición.

**Fuentes:** F08, F10, F16, F19, F20

## 24. Protocolo editorial de ampliación del atlas

El libro se construye como un sistema versionable: capítulos con identificadores, fuentes F##, afirmaciones EV-###, láminas originales y una cronología de cambios. Esta separación evita rehacer desde cero toda la documentación ante cada parche.

**Lámina 24:** [consultar esquema original en el PDF, pág. 26](./GTA_VI_Atlas_Tecnico_Edicion_1.0.pdf#page=26).

### Alta de fuente

Crear una fila con URL completa, entidad autora, título, fecha del contenido, fecha de consulta, clase de documento y estado de verificación. No asignar categoría A a una página de fans aunque reproduzca un comunicado oficial. Si una fuente desaparece, conservar su URL y estado histórico, no inventar una copia.

### Alta de evidencia

Asignar ID inmutable y un sistema; escribir afirmación atómica, condiciones, nivel, fuente, nota de incertidumbre y elementos relacionados. En una evidencia atómica no mezclar «existe una alarma» con «la alarma responde de manera distinta por distrito» salvo prueba separada de ambas.

### Alta de figura

La figura tiene ID, tipo (conceptual/captura autorizada/fotograma), fuente de imagen, pie descriptivo, versión y licencia o restricciones de uso. En esta edición las láminas son esquemas conceptuales originales, y las capturas reales de Rockstar están enlazadas por su galería oficial.

### Revisión periódica

Comparar novedades oficiales, notas de actualización y guías posteriores; resolver inconsistencias; agregar pruebas reproducibles y aumentar el grado sólo cuando corresponda. En cada lanzamiento del atlas generar PDF de lectura, DOCX editable, Markdown y tablas CSV con un manifiesto de versión.

### Ficha sintetica

| Elemento | Descripción               | Estado                |
| -------- | ------------------------- | --------------------- |
| 01       | Recibir una fuente nueva  | Registrar origen      |
| 02       | Crear evidencia atómica   | Asignar nivel         |
| 03       | Contrastar                | Añadir segunda prueba |
| 04       | Actualizar ficha / figura | Mantener IDs          |
| 05       | Publicar nueva versión    | Guardar historial     |

**Pendiente:** No automatizar el grado «confirmado» por simple coincidencia textual entre dos webs que se copian mutuamente.

**Fuentes:** F03, F04, F06, F14

## Anexo A. Aplicaciones

| ID     | Nombre                | Función                                                   | Dependencias                    | Fuentes | Nivel                           |
| ------ | --------------------- | --------------------------------------------------------- | ------------------------------- | ------- | ------------------------------- |
| APP-01 | Contacts              | Llamadas a personajes y servicios                         | Contactos, servicios y relación | F16     | C                               |
| APP-02 | Reminders             | Avisos y notificaciones pendientes                        | Recordatorios narrativos        | F16     | C                               |
| APP-03 | WAiNK                 | Escaneo de vehículos: estado, alarmas y rastreadores      | Robo, progreso y vehículos      | F16;F15 | B/C                             |
| APP-04 | RydeMe                | Contratación de desplazamientos                           | Economía y navegación           | F16     | B/C                             |
| APP-05 | BuckMe                | Cuentas bancarias y depósito                              | Economía y consecuencias        | F07;F16 | B/C                             |
| APP-06 | Fitness               | Seguimiento de entrenamiento                              | Salud, resistencia              | F11;F16 | B/C                             |
| APP-07 | WhatUp                | Comunicación entre contactos                              | Misiones y avisos               | F16     | C                               |
| APP-08 | Snapmatic             | Contenido y redes sociales                                | Mundo narrativo                 | F16     | C                               |
| APP-09 | News                  | Noticias y actualidad del mundo                           | Medios                          | F16     | C                               |
| APP-10 | Camera                | Captura de imágenes desde el teléfono                     | Fotografía                      | F16     | C                               |
| APP-11 | Gallery               | Consulta de fotos                                         | Fotografía                      | F16     | C                               |
| APP-12 | Weather               | Consulta meteorológica descrita en compilaciones          | Clima                           | F16     | Pendiente de validación directa |
| APP-13 | Settings              | Configuración asociada al teléfono, según compilaciones   | Interfaz                        | F16     | Pendiente de validación directa |
| APP-14 | Scooter Bros          | Entrega de vehículo personal, servicio descrito por guías | Vehículos                       | F07     | Pendiente de pantalla           |
| APP-15 | Vice City Real Estate | Posible consulta de garajes; catálogo en revisión         | Propiedades                     | F16     | Pendiente de pantalla           |
| APP-16 | On Demand             | Posible apartado multimedia; condición de app en revisión | Medios                          | F16     | Pendiente de pantalla           |

## Anexo B. Organizaciones

| ID     | Nombre                      | Tipo                   | Zona                      | Fuente  |
| ------ | --------------------------- | ---------------------- | ------------------------- | ------- |
| FAC-01 | PTT Youngin$                | Banda callejera        | Southside, Vice City      | F13;F18 |
| FAC-02 | San4San                     | Banda callejera        | La Perle, Vice City       | F13;F18 |
| FAC-03 | The Guardia Brothers        | Organización criminal  | Little Cuba, Vice City    | F13;F18 |
| FAC-04 | M7                          | Banda callejera        | Hamlet                    | F13;F18 |
| FAC-05 | La Polilla Negra            | Cártel                 | Watson Bay                | F13;F18 |
| FAC-06 | Final Chapter MC            | Motoclub criminal      | Ambrosia                  | F13;F18 |
| FAC-07 | Kingfishers                 | Contrabandistas        | Grassrivers               | F13;F18 |
| FAC-08 | Kolt & Associates           | Grupo criminal         | Port Gellhorn             | F13;F18 |
| FAC-09 | Other Criminals             | Grupos dispersos       | Varios lugares de Leonida | F18     |
| ORG-01 | Only Raw Records            | Discográfica           | Vice City                 | F02     |
| ORG-02 | Real Dimez                  | Dúo musical            | Vice City                 | F02     |
| ORG-03 | Jack of Hearts              | Negocio nocturno       | Vice City                 | F02     |
| ORG-04 | Red de Brian Heder          | Contrabando            | Leonida Keys              | F02     |
| ORG-05 | Equipo de Raul Bautista     | Equipo de atracadores  | Leonida                   | F02     |
| PUB-01 | Vice City Police Department | Policía                | Vice City                 | F18     |
| PUB-02 | Leonida Highway Patrol      | Patrulla de carreteras | Leonida                   | F18     |
| PUB-03 | Sheriffs de condado         | Fuerzas públicas       | Diversos condados         | F18     |

## Anexo C. Cuestiones pendientes

| ID    | Sistema        | Cuestión                                                  | Prueba                             | Prioridad |
| ----- | -------------- | --------------------------------------------------------- | ---------------------------------- | --------- |
| Q-001 | Teléfono       | Inventario final de aplicaciones, pantallas y desbloqueos | Captura de cada pantalla / versión | Alto      |
| Q-002 | Iconografía    | Atlas real de iconos: estados, colores y contextos        | Captura PNG + etiquetas            | Alto      |
| Q-003 | Inventario     | Capacidad por contenedor y existencia de peso             | Prueba con diferentes objetos      | Alto      |
| Q-004 | Combate        | Tablas de daños, alcance, balística y accesorios          | Pruebas de combate comparables     | Medio     |
| Q-005 | Policía        | Reglas de testigos y reconocimiento por jurisdicción      | Ensayo repetible por lugar         | Alto      |
| Q-006 | Vehículos      | Propiedad, rastreadores, alarmas y combustible            | Pruebas por categoría de coche     | Alto      |
| Q-007 | Atracos        | Botín, requisitos de éxito, periodicidad y seguridad      | Matriz por establecimiento         | Alto      |
| Q-008 | Organizaciones | Jerarquías e interacciones efectivas                      | Misiones, NPC y menús              | Medio     |
| Q-009 | Mundo          | Mapa de interiores accesibles y negocios                  | Exploración guiada                 | Medio     |
| Q-010 | NPC            | Persistencia de eventos y conducta individual             | Series temporales de pruebas       | Medio     |
| Q-011 | CALM           | Interfaz externa real y autorizada para RP                | Documentación oficial futura       | Crítico   |
| Q-012 | Misiones       | Fichas de todos los encargos y misiones                   | Guía por capítulo + vídeo          | Medio     |
| Q-013 | Comercios      | Diferencias por edición y contenido añadido               | Comparativa de versiones           | Medio     |
| Q-014 | Multijugador   | Qué sistemas del modo historia están disponibles          | Comunicados y documentación        | Crítico   |

## Anexo D. Referencias y fuentes

- **F01** · Rockstar Games · GTA VI - Now Available (2026-11-19). [https://www.rockstargames.com/es/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available](https://www.rockstargames.com/es/newswire/article/39akk424a9oo53/grand-theft-auto-vi-now-available) · Oficial.
- **F02** · Rockstar Games · Only in Leonida - personajes y localizaciones (s.f.). [https://www.rockstargames.com/VI/only-in-leonida](https://www.rockstargames.com/VI/only-in-leonida) · Oficial.
- **F03** · Rockstar Games · Media & Artwork (s.f.). [https://www.rockstargames.com/VI/media](https://www.rockstargames.com/VI/media) · Oficial.
- **F04** · Rockstar Games Support · How to change Grand Theft Auto VI settings (2026-11-18). [https://support.rockstargames.com/articles/4jUHNdP22SmaKSF8DWqhXC/how-to-change-grand-theft-auto-vi-settings](https://support.rockstargames.com/articles/4jUHNdP22SmaKSF8DWqhXC/how-to-change-grand-theft-auto-vi-settings) · Oficial.
- **F05** · Take-Two Interactive · GTA VI Now Available (2026-11-19). [https://www.take2games.com/ir/news/grand-theft-auto-vi-now-available](https://www.take2games.com/ir/news/grand-theft-auto-vi-now-available) · Oficial.
- **F06** · Rockstar Games · GTA VI - Screenshot Gallery (138 imágenes) (s.f.). [https://www.rockstargames.com/VI/media/screenshots](https://www.rockstargames.com/VI/media/screenshots) · Oficial.
- **F07** · PowerPyx · GTA 6 Full Walkthrough - All Missions (2026-11-18). [https://www.powerpyx.com/gta-6-full-walkthrough-all-missions/](https://www.powerpyx.com/gta-6-full-walkthrough-all-missions/) · Guía de juego.
- **F08** · PowerPyx · GTA 6 All Robbery Types (2026-11-23). [https://www.powerpyx.com/gta-6-all-robbery-types/](https://www.powerpyx.com/gta-6-all-robbery-types/) · Guía de juego.
- **F09** · PowerPyx · GTA 6 All Equipment (2026-11-19). [https://www.powerpyx.com/gta-6-all-equipment/](https://www.powerpyx.com/gta-6-all-equipment/) · Guía de juego.
- **F10** · PowerPyx · GTA 6 Criminal Profile Explained (2026-11-18). [https://www.powerpyx.com/gta-6-criminal-profile-explained/](https://www.powerpyx.com/gta-6-criminal-profile-explained/) · Guía de juego.
- **F11** · PowerPyx · How to Increase Character Stats (2026-11-18). [https://www.powerpyx.com/gta-6-how-to-increase-character-stats-health-cardio-focus/](https://www.powerpyx.com/gta-6-how-to-increase-character-stats-health-cardio-focus/) · Guía de juego.
- **F12** · PowerPyx · How to Use Autodrive (2026-11-24). [https://www.powerpyx.com/gta-6-how-to-use-autodrive-automatically-drive-anywhere/](https://www.powerpyx.com/gta-6-how-to-use-autodrive-automatically-drive-anywhere/) · Guía de juego.
- **F13** · PowerPyx · All Illegal Gang Operation Locations (2026-11-18). [https://www.powerpyx.com/gta-6-all-illegal-gang-operations-locations/](https://www.powerpyx.com/gta-6-all-illegal-gang-operations-locations/) · Guía de juego.
- **F14** · PowerPyx · Collectible Guide - Progress Database (2026-11-18). [https://www.powerpyx.com/gta-6-collectible-guide-progress-database/](https://www.powerpyx.com/gta-6-collectible-guide-progress-database/) · Guía de juego.
- **F15** · PowerPyx · 100% Completion Checklist & Guide (2026-11-18). [https://www.powerpyx.com/gta-6-100-completion-checklist-guide/](https://www.powerpyx.com/gta-6-100-completion-checklist-guide/) · Guía de juego.
- **F16** · GTABase · GTA 6 Phone Guide: Every App Explained (2026-11-22). [https://www.gtabase.com/gta-6/articles/gta-6-phone-guide-every-app-explained](https://www.gtabase.com/gta-6/articles/gta-6-phone-guide-every-app-explained) · Guía independiente.
- **F17** · GTABase · GTA 6 Icons Explained (2026-11-20). [https://www.gtabase.com/gta-6/articles/gta-6-icons-explained](https://www.gtabase.com/gta-6/articles/gta-6-icons-explained) · Guía independiente.
- **F18** · GTABase · Gangs & Factions Guide (s.f.). [https://www.gtabase.com/gta-6/gangs/](https://www.gtabase.com/gta-6/gangs/) · Base de datos.
- **F19** · GTABase · Weapons & Loadout Guide (2026-11-20). [https://www.gtabase.com/gta-6/articles/gta-6-weapons-loadout-guide](https://www.gtabase.com/gta-6/articles/gta-6-weapons-loadout-guide) · Guía independiente.
- **F20** · GTABase · Wanted Level & Heat Guide (2026-11-21). [https://www.gtabase.com/articles/gta-6/gta-6-wanted-level-explained-police-system-guide](https://www.gtabase.com/articles/gta-6/gta-6-wanted-level-explained-police-system-guide) · Guía independiente.
- **F21** · GTABase · Driving Tips: Drifting, Ducking, Drive-Bys (2026-11-22). [https://www.gtabase.com/gta-6/articles/gta-6-driving-tips](https://www.gtabase.com/gta-6/articles/gta-6-driving-tips) · Guía independiente.
- **F22** · PC Gamer · How stealing cars has changed (2026-11). [https://www.pcgamer.com/games/grand-theft-auto/gta-6-how-to-steal-cars/](https://www.pcgamer.com/games/grand-theft-auto/gta-6-how-to-steal-cars/) · Prensa especializada.
- **F23** · El País · Primeras impresiones de GTA VI, demostración con desarrolladores (2026-08-27). [https://elpais.com/cultura/2026-08-27/el-pais-accede-en-exclusiva-a-gta-vi-de-la-mano-de-sus-creadores-primeras-impresiones-del-videojuego-mas-esperado-de-la-historia.html](https://elpais.com/cultura/2026-08-27/el-pais-accede-en-exclusiva-a-gta-vi-de-la-mano-de-sus-creadores-primeras-impresiones-del-videojuego-mas-esperado-de-la-historia.html) · Prensa con demostración.
- **F24** · Associated Press · Review GTA VI (2026-11). [https://apnews.com/article/82404adf585e7242e61fb42e8aa05481](https://apnews.com/article/82404adf585e7242e61fb42e8aa05481) · Reseña independiente.
- **F25** · Rockstar Games · GTA VI - Launch Gallery (2026-11). [https://www.rockstargames.com/VI/launch-gallery](https://www.rockstargames.com/VI/launch-gallery) · Galería oficial.
- **F26** · Rockstar Games · GTA VI - site principal (s.f.). [https://www.rockstargames.com/VI](https://www.rockstargames.com/VI) · Oficial.
- **F27** · PowerPyx · GTA 6 Tips & Tricks (2026-11-18). [https://www.powerpyx.com/gta-6-tips-tricks/](https://www.powerpyx.com/gta-6-tips-tricks/) · Guía de juego.
- **F28** · Rockstar Games · Extended Look (2026-08-06). [https://www.rockstargames.com/newswire/article/9k2kaa1o3297k9/grand-theft-auto-vi-an-extended-look](https://www.rockstargames.com/newswire/article/9k2kaa1o3297k9/grand-theft-auto-vi-an-extended-look) · Oficial.
