# Preparación para Vercel

El repositorio queda preparado para una conexión posterior desde el panel de Vercel. No se ha creado un proyecto remoto, no se configuraron credenciales y no se desplegó el sitio.

## Cómo se publica el catálogo

El servidor local continúa usando SQLite (`data/prueba1.sqlite`) y conserva el catálogo editable mediante `npm run seed`. Durante el build de producción, `npm run build:vercel` vuelve a sembrar la base de datos, exporta una instantánea de solo lectura a `api/catalog-data.json` y compila la interfaz de Vite. `api/catalog.js` expone esa instantánea como `/api/catalog`. El estado personal del navegador y las capturas opcionales no entran en esa exportación.

La función de Vercel no requiere un driver nativo de SQLite en producción. Para actualizar las guías del catálogo, primero se modifica y revisa la semilla local; el siguiente despliegue genera una nueva instantánea. No hay escritura pública a la base de datos ni endpoint de transacciones.

## Configuración pendiente para la sesión de despliegue

1. Importar `Jesussscy/TrabajoSocial` en Vercel, usando la rama `main`.
2. Confirmar el comando `npm run build:vercel` y el directorio de salida `dist` (ya declarados en `vercel.json`).
3. Desplegar y revisar `/`, `/api/catalog` y una ruta interna de la aplicación.
4. Añadir un dominio personalizado solo si se decide más adelante.

El frontend usa rutas internas servidas por el fallback de `vercel.json`. El rewrite deja `/api/*` disponible para la función serverless. La app local puede seguir arrancándose con `Iniciar-Prueba1.bat`; la configuración de Vercel no cambia su ejecución local.
