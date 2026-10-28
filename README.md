# Prueba 1

Aplicación web local, móvil primero, para encontrar guías sencillas de tareas digitales cotidianas. El nombre **Prueba 1** es provisional y puede cambiarse en `src/main.jsx` y `index.html`.

## Abrir la aplicación local

En Windows, haz doble clic en **Iniciar-Prueba1.bat**. El lanzador prepara el catálogo y la compilación, inicia el servidor local y abre automáticamente:

**http://localhost:3001**

El servidor se ejecuta en tu computador. Para cerrarlo, haz doble clic en **Detener-Prueba1.bat**. Si algo falla, el registro se guarda en `logs/prueba1-local.log`.

El lanzador de Windows escucha solo en `127.0.0.1`, para que otros dispositivos de la red no puedan conectarse. El puerto se puede configurar con `PORT` en `.env`. Al ejecutar el servidor manualmente, también se leen `HOST` y `PORT` desde ese archivo; conserva `HOST=127.0.0.1` si quieres mantenerlo solo en este computador.

Para desarrollo, abre PowerShell en la carpeta del proyecto:

```powershell
npm install
Copy-Item .env.example .env
npm run seed
npm run dev
```

Para ejecutar el servidor API y el build compilado sin Vite, genera primero `dist/` con `npm run build` y luego usa `npm start`. El servidor sirve la interfaz compilada si encuentra `dist/index.html`; sin ese build, sigue ofreciendo la API para el modo de desarrollo.

Vite abre `http://localhost:5173` y envía las peticiones de `/api` al puerto `PORT` configurado (3001 por defecto). La API permite los orígenes de Vite (`localhost` o `127.0.0.1`) y el origen configurado explícitamente en `WEB_ORIGIN`. En el modo local compilado, Express sirve la interfaz y la API desde `http://localhost:3001` (o el puerto `PORT` que se configure).

`index.html` es solo el documento técnico que Vite necesita para montar React; no es una página que debas abrir manualmente. La pantalla de inicio de la aplicación está en la ruta `/` de localhost.

## Tecnologías

- React y Vite para la interfaz, con CSS adaptable y componentes pequeños.
- Node.js y Express para una API de solo lectura del catálogo.
- SQLite mediante `better-sqlite3`; la serialización común del catálogo está aislada en `server/catalog.js`.
- Variables locales en `.env`; `.env.example` muestra los nombres de configuración. Nunca agregar secretos reales al repositorio.
- Sin cuenta, analítica, pagos ni automatización de transacciones. Las capturas opcionales seleccionadas por la persona se guardan solo en el almacenamiento local del navegador; evita incluir datos personales o financieros.

## Catálogo y fuentes

El catálogo inicial está en `server/seed.js` y su estructura en `server/schema.sql`. Ejecuta `npm run seed` para instalar o refrescar el catálogo. Las tablas relacionan entidades, guías, pasos, ilustraciones, enlaces y fuentes con fecha y resultado de revisión. La interfaz actual dibuja esquemas demostrativos por paso en `GuideArtwork` dentro de `src/main.jsx`; los SVG heredados de `public/illustrations/` son recursos de referencia y no se presentan como capturas oficiales. Cuando se entreguen capturas autorizadas, se podrán guardar ordenadamente en `public/guides/<id-de-guia>/` y relacionar mediante `steps.image_path` y `steps.image_alt`.

El **28 de octubre de 2026** se revisaron las guías de Nequi y Bancolombia, la consulta del RUNT y los canales oficiales de Afinia, BBVA, Banco de Bogotá, Davivienda, MOVii, dale!, Movistar y Tiendas ara. Cada fuente guarda título, URL, fecha y alcance. Tener un enlace oficial no significa que el paso a paso esté verificado.

Solo hay pasos revisados para cuatro tareas: enviar a otro Nequi, pagar servicios públicos desde Nequi (si la empresa aparece en el catálogo actual), transferir entre cuentas Bancolombia y consultar el SOAT en el RUNT. Comprar el SOAT, el flujo de Afinia y las tareas de BBVA, Banco de Bogotá, Davivienda, MOVii, dale!, Movistar/Tigo y Tiendas ara siguen pendientes; todavía no muestran instrucciones de operación. La tarea de compra del SOAT enlaza recomendaciones de la Superintendencia Financiera y consultas oficiales para revisar aseguradoras e intermediarios autorizados, pero no propone un vendedor. El sitio de Movistar informa que sus servicios continúan en transición a Tigo; su portal permite consultar facturas, pero la app no guía la transacción. El enlace de Banco de Bogotá fue publicado en su propio portal de transparencia, aunque el destino devolvió 403 a la consulta automatizada. Los materiales oficiales de Tiendas ara no permitieron confirmar los medios de pago de una tienda.

Los pasos del RUNT son una orientación de entrada al servicio; la consulta oficial vigente solicita placa, tipo de documento y número de documento de la persona propietaria. Esos datos se ingresan directamente en el dominio oficial, nunca en esta aplicación. La revisión es puntual y no implica monitoreo automático futuro. Antes de actualizar una guía se debe volver a abrir su fuente y registrar el resultado.

## Identidad visual y narración

La interfaz combina azul pastel con fondos marfil y acentos amarillos suaves. El color ayuda a ordenar controles y estados sin depender solo de la percepción cromática; el estado y las acciones también se expresan con palabras e iconos. La animación es breve y acompaña la entrada de las tarjetas y el uso de controles. Se respeta la preferencia del dispositivo por movimiento reducido.

El botón **Leer al pasar** activa de forma voluntaria la narración en español de Colombia. Con mouse, lee el bloque de texto donde está el puntero; en teléfono o tableta, se puede tocar un párrafo, encabezado o elemento de lista. La voz se apaga por defecto, puede desactivarse desde el mismo botón y usa las voces del navegador. Si el dispositivo no ofrece síntesis de voz, la interfaz lo indica. Consulta [la procedencia y las limitaciones de los logotipos](public/brands/README.md).

## Mejora continua

El objetivo del proyecto es seguir mejorando de forma iterativa la claridad, la seguridad y la experiencia de principio a fin. Cada revisión debe recorrer la ruta principal desde “¿Qué quieres hacer hoy?” hasta los pasos y el regreso, además de revisar búsqueda, filtros, estados pendientes, accesibilidad, narración, navegación táctil y escritorio. Se deben corregir fricciones observables, mantener el texto corto, reducir errores y hacer que las acciones importantes sean fáciles de encontrar para personas adultas con distintos niveles de experiencia digital.

Antes de ampliar el catálogo, revisar las fuentes oficiales actuales y dejar visibles la fecha, el alcance y las limitaciones; una fuente enlazada no equivale a pasos comprobados. Incorporar mejoras visuales con animaciones moderadas y funcionales, marcas reconocibles con procedencia clara, y estados vacíos, de carga, de recuperación y de error que orienten sin saturar. Mantener los datos personales y el progreso en el dispositivo, no introducir acciones financieras ni formularios de credenciales, y no presentar ilustraciones de muestra como capturas reales.

El ciclo de trabajo es deliberadamente continuo: observar la experiencia completa, identificar una mejora comprobable, implementarla, revisar escritorio y tamaños de teléfono, verificar build/API y comportamiento con movimiento reducido, documentar cualquier límite y volver a recorrer el flujo en busca de la siguiente fricción. El objetivo no se cumple al cerrar una lista de cambios: cada actualización del catálogo o de la interfaz debe poder dejar el producto más sencillo, comprensible, inclusivo y confiable.

## Preparación de Vercel

La configuración base está lista en `vercel.json` y [docs/deployment/VERCEL.md](docs/deployment/VERCEL.md). El build de Vercel vuelve a crear el catálogo desde SQLite y lo exporta como instantánea JSON para la función de lectura `/api/catalog`; esto evita depender de SQLite nativo en las funciones de producción. Los cambios de contenido se revisan en el catálogo y se publican con un nuevo despliegue. La aplicación local mantiene su servidor SQLite. La carpeta queda lista para conectar el repositorio cuando se configure Vercel; este proyecto aún no se ha conectado ni desplegado allí.

## Accesibilidad y seguridad

- Controles A−/A+ y tamaño de texto guardado localmente en el dispositivo. El texto se adapta al espacio disponible para evitar ampliar el lienzo y provocar desplazamiento horizontal; los botones conservan áreas táctiles amplias.
- Lectura en voz alta a demanda con el sintetizador del navegador, controles Escuchar/Pausar/Continuar/Detener y texto visible. Al terminar, Escuchar vuelve a estar disponible.
- Teclado, enlace para saltar al contenido, estados accesibles, áreas táctiles amplias, adaptación a pantallas angostas y respeto por movimiento reducido.
- Los esquemas originales de cada paso son demostrativos; no representan pantallas oficiales. Las imágenes futuras requieren procedencia, permiso de uso y guía/paso identificables.
- Los enlaces a sitios externos abren en otra pestaña con `noopener noreferrer`. La aplicación no procesa transacciones.

## Archivos principales

```text
api/catalog.js               Función de lectura para el catálogo en Vercel
api/catalog-data.json        Instantánea generada durante el build de Vercel
docs/deployment/VERCEL.md    Guía de conexión y despliegue pendiente
public/brands/               Logotipos y notas de procedencia
scripts/export-vercel-catalog.js Exportación del catálogo de producción
src/main.jsx                 Interfaz, búsqueda, accesibilidad y pasos
src/styles.css               Diseño adaptable y esquemas orientativos
server/index.js              API local y servidor Express
server/catalog.js            Serialización común del catálogo SQLite
server/schema.sql            Esquema relacional
server/seed.js                Catálogo, fuentes y enlaces revisados
vercel.json                  Build de producción y rutas SPA
public/illustrations/        Recursos SVG de referencia (no son capturas reales)
```

## Comprobación local

```powershell
npm install
npm run seed
npm run build
npm run build:vercel
npm start
```

`npm run build:vercel` es el mismo flujo declarado en Vercel; al ejecutarlo genera `api/catalog-data.json`, archivo derivado del catálogo y versionado para que la función serverless pueda importarlo. Si cambia una guía, vuelve a ejecutar el build para actualizarlo. `npm start` sirve `dist/` y el catálogo local por Express. En Vercel, la función responde a `/api/catalog` y las rutas de la interfaz se reescriben a la SPA.

Las guías marcadas como **Pendiente** aún no muestran pasos de operación. La guía genérica de facturas públicas de Nequi solo aplica si el proveedor aparece en el catálogo dentro de la aplicación; no confirma que Afinia esté disponible. Esta primera versión no afirma incluir todos los bancos o servicios. No se han incorporado capturas reales porque todavía no fueron entregadas.

El catálogo se muestra en dos estados visuales: tareas con pasos revisados y tareas que todavía no tienen instrucciones publicadas. La sección **Transparencia y confianza** da acceso a los canales y fuentes que respaldan el catálogo, con el alcance y las limitaciones de cada consulta. La búsqueda acepta expresiones completas y términos de contexto; `Ctrl+K` o `⌘K` enfoca el campo de búsqueda desde el inicio. Los filtros por categoría trabajan junto con los resultados de búsqueda.

El tamaño de texto se ajusta entre 90 % y 130 % y se puede restablecer pulsando su indicador. La interfaz conserva un ancho legible al aumentar la escala. El progreso de una guía revisada solo se guarda al avanzar un paso y se conserva localmente en el dispositivo; abrir una tarea pendiente no altera ese progreso.

Las guías revisadas se pueden guardar como favoritas desde la tarjeta; la selección y el avance se almacenan únicamente en el navegador actual y no se envían a la API local. El modo **Ver solo favoritas** filtra el catálogo y funciona junto con la búsqueda y las categorías; al quitar la última guía guardada, se vuelve a la lista general. En cada paso aparece primero la instrucción. El esquema original que la acompaña se puede mostrar u ocultar con un botón; en teléfono empieza oculto para dar prioridad al texto y en escritorio empieza visible. Es una ilustración orientativa, no una pantalla real del proveedor. De manera opcional, el usuario puede asociar una imagen PNG/JPG/WebP propia (hasta 5 MB); el navegador la reduce para previsualizarla y la guarda localmente en ese dispositivo. Antes de cargarla, la interfaz recomienda cubrir datos personales o bancarios. No se sube a SQLite ni al servidor.
