# Publicación: visibilidad pública y política del proyecto

**Actualizado:** 24 de noviembre de 2026

## Decisión del propietario

El repositorio es **público** desde el 24 de noviembre de 2026. La decisión se tomó porque:

- el proyecto **no es comercial**: no vende nada, no cobra por servicio ni por acceso;
- el código es MIT y el objetivo es que sea una base abierta a contribuciones;
- el propietario revisó y autorizó expresamente la publicación.

Antes de cambiar la visibilidad se auditó el **historial completo** de Git, no solo el árbol actual:

| Comprobación                                                               | Resultado                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Ejecutables o paquetes del juego (`.exe`, `.rpf`, `.rpf9`, `.pkg`, `.dll`) | Ninguno, en ningún commit                                    |
| Claves privadas, tokens de nube o de GitHub                                | Ninguno                                                      |
| Archivos `.env` versionados                                                | Ninguno (solo `.env.example` con valores locales de ejemplo) |
| Correos personales o rutas locales del equipo                              | Ninguno                                                      |
| Blobs mayores de 2 MB                                                      | Ninguno                                                      |

## Reglas que siguen vigentes aunque el repo sea público

Publicar no cambia la posición jurídica. Siguen siendo ciertas:

1. **La licencia MIT cubre solo el código propio.** No licencia GTA VI, sus marcas ni contenido de
   terceros.
2. **No se distribuyen archivos del juego.** `scripts/check-no-proprietary-artifacts.sh` bloquea
   tipos y nombres conocidos cuando corre dentro de `verify-local`; no sustituye una revisión de
   contenido ni del historial.
3. **No existe integración con GTA VI.** El adaptador está bloqueado por diseño; no hay servidor
   multijugador ni cliente.
4. **No hay afiliación con Rockstar Games, Take-Two Interactive ni Cfx.re.** El aviso legal debe
   permanecer visible; `scripts/check-site-integrity.sh` falla si se elimina.
5. **No es asesoramiento jurídico.** `docs/legal/LEGAL_BASIS_ARTICLES_2026-11-24.md` explica la base
   jurídica artículo por artículo, y es una revisión técnica.

## Consecuencia técnica: `main` está protegida

Al hacerse público, GitHub aplica protección de rama en `main`:

- no se puede empujar directamente (`protected branch hook declined`);
- se exige historial lineal y resolución de conversaciones;
- los administradores también están sujetos (`enforce_admins: true`).

Esto **no es un obstáculo, es el flujo correcto**. Todo cambio entra por rama y pull request:

```bash
git checkout -b tipo/cambio-breve
# ...editar, y verificar en local...
bash scripts/verify-local.sh
git commit -am "tipo: descripción"
git push -u origin tipo/cambio-breve
gh pr create --base main
```

Nunca se declara una fusión por el código de salida: se consulta el estado del PR
(`state: MERGED`), porque un merge correcto puede devolver error y un error de proxy puede
parecer un merge.

## Qué no debe publicarse nunca

- El bundle de respaldo de ramas antiguas (`backups/*.bundle`): contiene historia privada. Está
  excluido del repositorio.
- Credenciales, secretos o volcados de memoria.
- Cualquier contenido propietario de un juego, incluso en ejemplos o tests.

## Si en el futuro el proyecto se comercializa

Antes de vender, cobrar por acceso o presentar una marca, conviene:

1. Revisión por abogacía especializada en propiedad intelectual (España/UE).
2. Búsqueda de anterioridades de la marca en EUIPO (clases 9 y 42).
3. Revisar de nuevo los términos de Rockstar y Cfx aplicables al producto concreto.

Hasta entonces, CALM es un **nombre de trabajo** sin exclusividad reclamada.
