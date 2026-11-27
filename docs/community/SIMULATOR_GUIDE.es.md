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
- **`packages/core`** contiene reglas de dominio y servicios independientes del transporte y del
  juego. Sus adaptadores en memoria son referencias de desarrollo, no almacenamiento duradero.
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

- **F1:** personajes, sesiones autenticadas y ledger de doble entrada persistidos en PostgreSQL,
  con transacciones idempotentes y controles de integridad.
- **F2:** el inventario disponible es una referencia en memoria. Inventarios duraderos,
  contenedores y transferencias persistentes siguen pendientes; consulta
  [`INVENTORY_REFERENCE.md`](../server/INVENTORY_REFERENCE.md) y
  [`PROJECT_SCOPE.md`](../PROJECT_SCOPE.md).
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
