# API HTTP de CALM F1 — operación local

**Estado:** transporte HTTP local para los servicios persistentes F1. No ofrece inicio de sesión
público de jugadores ni integración con un runtime de GTA VI.

La API expone los servicios propios de CALM para sesiones, personajes y economía. Toda identidad se
resuelve desde una sesión guardada en PostgreSQL. El cliente no puede elegir el propietario de un
personaje, declarar permisos ni indicar quién ejecuta una acción administrativa.
La descripción equivalente en inglés está en [`apps/api/README.md`](../../apps/api/README.md).

## Requisitos y arranque

- Node.js 22 o posterior y pnpm 10.
- PostgreSQL accesible mediante `DATABASE_URL`.
- Una cuenta de operador elegida por el servidor y un secreto de bootstrap aleatorio de al menos 32
  bytes. El proceso conserva solo el SHA-256 del secreto en `CALM_BOOTSTRAP_TOKEN_SHA256`; el secreto
  original se mantiene en el gestor de secretos del operador.
- El listener solo admite `127.0.0.1` o `::1`. No se puede enlazar a `0.0.0.0`, a una interfaz LAN ni
  a una dirección pública.

`CALM_API_HOST` es opcional y por defecto vale `127.0.0.1`. `CALM_API_PORT` también es opcional y
por defecto vale `8080`. La API aplica las migraciones pendientes al arrancar y crea de forma
idempotente la cuenta de operador configurada.

Después de preparar las dependencias, compilar y proporcionar las variables al proceso:

```powershell
pnpm install --frozen-lockfile
pnpm build
$env:DATABASE_URL = 'postgresql://calm_local:...@127.0.0.1:5432/calm_local'
$env:CALM_BOOTSTRAP_ACCOUNT_ID = 'UUID-de-la-cuenta-de-operador'
$env:CALM_BOOTSTRAP_TOKEN_SHA256 = '64-caracteres-hexadecimales'
pnpm --filter @gta6-rp/api start
```

El repositorio no carga `.env` en el proceso. No guardes el secreto original, credenciales de base
de datos ni tokens emitidos en Git, capturas, ejemplos o registros.

## Autenticación de bootstrap

`POST /v1/auth/bootstrap` comprueba el secreto enviado contra el hash de configuración con una
comparación de tiempo constante. La cuenta y la capacidad son valores fijados por el servidor; la
petición solo acepta `bootstrapToken`.

```http
POST /v1/auth/bootstrap
Content-Type: application/json

{"bootstrapToken":"<secreto-guardado-fuera-del-repositorio>"}
```

La respuesta `201` entrega un bearer token de sesión una sola vez y su vencimiento. Las capacidades
no se devuelven al cliente; la sesión inicial del operador recibe únicamente `economy.grant` y dura
15 minutos. PostgreSQL conserva el hash del bearer token, no el token. `POST /v1/auth/revoke` revoca
la sesión asociada al bearer presentado y no acepta un identificador de sesión del cliente.

El secreto de bootstrap sigue siendo válido hasta que se cambie su hash de configuración y se
reinicie el proceso. Rótalo si puede haberse expuesto. Este flujo es una entrada operativa de un
solo operador: no sustituye un proveedor de identidad, no crea una ruta de registro de jugadores y
no está diseñado para exponerse en Internet.

## Rutas F1

`GET /health` es pública. El bootstrap se protege con su secreto de operador; las demás rutas
`/v1` requieren `Authorization: Bearer <session-token>`.

| Método y ruta                              | Uso                          | Reglas principales                                                               |
| ------------------------------------------ | ---------------------------- | -------------------------------------------------------------------------------- |
| `GET /health`                              | Estado del proceso           | Indica `pre-platform` y `gta6Adapter: reserved`.                                 |
| `POST /v1/auth/bootstrap`                  | Emitir sesión del operador   | Secreto configurado por el servidor; límite de intentos.                         |
| `POST /v1/auth/revoke`                     | Revocar la sesión actual     | Sin cuerpo ni ID de sesión suministrado por el cliente.                          |
| `GET /v1/characters`                       | Listar personajes propios    | La cuenta procede de la sesión.                                                  |
| `POST /v1/characters`                      | Crear personaje propio       | Solo acepta `firstName` y `lastName`.                                            |
| `GET /v1/characters/{characterId}/balance` | Consultar saldo              | Comprueba primero la propiedad del personaje.                                    |
| `POST /v1/economy/transfers`               | Transferir entre personajes  | Comprueba propiedad del origen, saldo e idempotencia.                            |
| `POST /v1/admin/economy/grants`            | Conceder saldo como operador | Exige capacidad, motivo y clave de idempotencia; audita en la misma transacción. |

Los importes se envían como cadenas de unidades menores (`"2500"`), nunca como números de punto
flotante. Las operaciones de transferencia y concesión exigen `Idempotency-Key`, de 1 a 64
caracteres ASCII alfanuméricos, `:`, `_` o `-`. La concesión admite también `X-Correlation-ID`; si
no se envía uno válido, la API crea un identificador.

Ejemplo de transferencia:

```http
POST /v1/economy/transfers
Authorization: Bearer <session-token>
Content-Type: application/json
Idempotency-Key: transfer-2026-001

{"fromCharacterId":"<uuid-propio>","toCharacterId":"<uuid-destino>","amountMinor":"2500"}
```

Ejemplo de concesión administrativa:

```http
POST /v1/admin/economy/grants
Authorization: Bearer <session-token-con-capacidad>
Content-Type: application/json
Idempotency-Key: grant-case-2026-001
X-Correlation-ID: moderation-case-2026-001

{"toCharacterId":"<uuid>","amountMinor":"2500","reason":"Corrección aprobada por staff"}
```

Una clave repetida con el mismo comando devuelve la transacción original sin duplicar saldo ni
auditoría. Una clave reutilizada con distintos argumentos se rechaza como conflicto. La auditoría
persistente identifica la cuenta del actor resuelta por la sesión, acción, motivo, correlación y
transacción; se escribe dentro de la misma transacción PostgreSQL que los asientos y su finalización.
La base de datos impide actualizar o borrar esas filas.
Una restricción diferida de PostgreSQL también impide confirmar movimientos que toquen la tesorería
sin una auditoría correspondiente, incluso si un escritor SQL evita los repositorios de aplicación.

Todas las respuestas de error usan `{ "error": "CODIGO", "requestId": "uuid" }`, sin mensajes
internos ni trazas. Los códigos del transporte incluyen `INVALID_BODY`, `INVALID_JSON`,
`INVALID_IDENTIFIER`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `IDEMPOTENCY_CONFLICT`,
`BODY_TOO_LARGE`, `UNSUPPORTED_MEDIA_TYPE`, `RATE_LIMITED` y `INTERNAL_ERROR`. Las respuestas llevan
el mismo identificador en la cabecera `x-request-id`.

## Límites y superficie de confianza

- Los cuerpos JSON se limitan a 16 KiB, los objetos rechazan claves desconocidas y los importes,
  UUID, motivos y cabeceras se validan antes de llegar a los servicios.
- Límites por proceso: 5 intentos de bootstrap por IP cada 10 minutos; 300 peticiones autenticadas
  por IP y minuto; 120 por sesión y minuto; 30 concesiones por cuenta de operador y minuto.
- Los límites viven en memoria del proceso y se reinician al reiniciar. No sirven como coordinador
  entre réplicas. Antes de una topología multiinstancia deben moverse a un limitador compartido y
  configurarse proxies de confianza de forma explícita.
- La API no acepta cookies, no habilita CORS y no confía en `X-Forwarded-For`. El listener de
  loopback no incluye TLS porque no debe cruzar una red.
- Los errores HTTP no incluyen mensajes SQL, cuerpos internos ni trazas. Cada respuesta incluye un
  `x-request-id` generado por el servidor.
- Usa una cuenta PostgreSQL de mínimo privilegio. La instalación local aplica migraciones en el
  arranque; separa la identidad de migración de la credencial de servicio antes de operar una
  instalación compartida.

## Verificación

```bash
pnpm vitest run tests/api-http.test.ts tests/ledger-double-entry.test.ts tests/persistence-migrations.test.ts
pnpm typecheck
pnpm build
```

La cobertura HTTP comprueba que no se falsifiquen identidad ni permisos, la propiedad de personajes,
el límite de cuerpo, los límites de bootstrap, la revocación, la atomicidad del registro de auditoría
y el reintento idempotente tras una respuesta perdida.
