# Despliegue en Vercel

El proyecto `trabajo-social` está conectado a `Jesussscy/TrabajoSocial` en la rama `main`. La web de producción está en **https://trabajo-social-omega.vercel.app/**. El primer despliegue se verificó con la página principal, `/api/catalog` (13 guías, 4 revisadas) y una URL interna de la aplicación. No se configuraron variables secretas ni dominio personalizado.

## Cómo se publica el catálogo

El servidor local continúa usando SQLite (`data/prueba1.sqlite`) y conserva el catálogo editable mediante `npm run seed`. Durante el build de producción, `npm run build:vercel` vuelve a sembrar la base de datos, exporta una instantánea de solo lectura a `api/catalog-data.json` y compila la interfaz de Vite. `api/catalog.js` expone esa instantánea como `/api/catalog`. El estado personal del navegador y las capturas opcionales no entran en esa exportación.

La función de Vercel no requiere un driver nativo de SQLite en producción. Para actualizar las guías del catálogo, primero se modifica y revisa la semilla local; el siguiente despliegue genera una nueva instantánea. No hay escritura pública a la base de datos ni endpoint de transacciones.

## Configuración usada

1. Repositorio: `Jesussscy/TrabajoSocial`, rama de producción `main`.
2. Preset: Vite; directorio raíz: `./`.
3. Comando de compilación: `npm run build:vercel`; directorio de salida: `dist` (declarados en `vercel.json`).
4. Los siguientes cambios publicados en `main` generan nuevos despliegues. Comprueba la página, `/api/catalog` y una guía después de cada cambio de contenido o infraestructura.

El frontend usa rutas internas servidas por el fallback de `vercel.json`. El rewrite deja `/api/*` disponible para la función serverless. La app local puede seguir arrancándose con `Iniciar-Autonomia-Dorada.bat`; la configuración y el enlace de Vercel no cambian con este ajuste local.
