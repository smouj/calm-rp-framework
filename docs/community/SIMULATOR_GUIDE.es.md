# Guía en español: arquitectura y simulador de CALM

**Estado:** guía del código disponible; no describe un runtime de juego.

## Qué es el simulador

El simulador ejecuta escenarios deterministas con datos ficticios para comprobar reglas de
roleplay sin iniciar GTA VI, FiveM ni conexiones de jugadores. El escenario de economía de
[`adapters/simulator/src/roleplay-scenario.ts`](../../adapters/simulator/src/roleplay-scenario.ts)
registra dos personajes sintéticos, concede saldo, transfiere dinero y demuestra la idempotencia
de una repetición. No representa una sesión multijugador real ni una integración.

## Límites entre módulos

- **`packages/contracts`** declara las formas TypeScript de comandos, eventos y puertos. Una
  interfaz TypeScript se borra al compilar; por sí sola no valida JSON recibido por una red.
- **`packages/core`** contiene reglas y servicios propios de CALM para su objetivo GTA VI, aislados
  del transporte y del runtime. Sus adaptadores en memoria son referencias de desarrollo, no
  almacenamiento duradero.
- **`packages/persistence`** implementa repositorios PostgreSQL y migraciones para los dominios
  persistentes que ya existen.
- **`adapters/simulator`** ejecuta escenarios locales con identidades y datos sintéticos; no llama
  funciones del juego ni requiere archivos de GTA.
- **`apps/api`** expone actualmente un objeto de estado previo a la plataforma. No es un servidor
  HTTP desplegable ni acredita una API pública de juego.

La secuencia conceptual es: validar la estructura de la solicitud en el límite de entrada,
resolver la sesión en el servidor, comprobar la propiedad del personaje, aplicar la regla del
dominio y persistir los cambios con su idempotencia y auditoría. El ejemplo de
[`SIMULATOR_DOMAIN_EXAMPLES.md`](./SIMULATOR_DOMAIN_EXAMPLES.md) ilustra esa frontera; no afirma
que exista un servicio de progresión.

## Estado que sí está implementado

- **Base F1:** personajes, sesiones autenticadas y ledger de doble entrada persistidos en
  PostgreSQL, con transacciones idempotentes y controles de integridad. La API HTTP local exige
  sesiones emitidas por el servidor, limita entradas y frecuencia, y audita las concesiones de
  staff dentro de la transacción del ledger. Consulta la [guía operativa F1](../operations/API_F1_LOCAL.es.md).
  No hay login público de jugadores ni integración con un runtime de GTA VI.
- **F2:** el candidato local añade el servicio y repositorio transaccionales, contenedores, reglas
  de capacidad, recibos idempotentes, rollback, reinicio embebido y un flujo sintético del
  simulador. La concurrencia en PostgreSQL 17 real aún debe pasar en CI antes de cerrar la
  [incidencia #54](https://github.com/smouj/calm-rp-framework/issues/54); no hay conexión con GTA VI.
- **Integración con GTA VI:** bloqueada. No hay cliente, servidor multijugador ni contrato
  autorizado y verificado.

## Cómo ejecutar la verificación

Desde la raíz del repositorio, con Node y pnpm instalados:

```bash
pnpm install --frozen-lockfile
pnpm check
```

`pnpm check` ejecuta ESLint, comprobación de tipos, pruebas y formato. El gate local completo,
incluidos build y salvaguardas del repositorio, se ejecuta con `bash scripts/verify-local.sh`.
Las pruebas de PostgreSQL real requieren un servicio PostgreSQL y `DATABASE_URL`; sin esa
configuración se omiten con un aviso claro. Las pruebas del motor PostgreSQL embebido sí forman
parte del conjunto predeterminado.

## Lecturas relacionadas

- [Arquitectura](../../ARCHITECTURE.md)
- [Catálogo de dominios](../server/DOMAIN_CATALOG.md)
- [Requisitos de runtime e integración](../server/RUNTIME_REQUIREMENTS.md)
- [Hoja de ruta](../roadmap/ROADMAP.md)
