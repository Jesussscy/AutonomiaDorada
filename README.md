# Autonomía Dorada

![Logotipo de Autonomía Dorada](public/brands/autonomia-dorada-logo.jpg)

Aplicación web móvil primero para que las personas adultas encuentren orientación clara y accesible, conserven el control de sus decisiones y realicen tareas cotidianas con mayor autonomía. Su lema es: **Más que asistencia, es tu autonomía.** Reúne guías de salud, apoyo emocional, gestiones digitales y trámites en Colombia.

## Abrir la aplicación local

En Windows, haz doble clic en **Iniciar-Autonomia-Dorada.bat**. El lanzador prepara el catálogo y la compilación, inicia el servidor local y abre automáticamente:

**http://localhost:3001**

El servidor se ejecuta en tu computador. Para cerrarlo, haz doble clic en **Detener-Autonomia-Dorada.bat**. Si algo falla, el registro se guarda en `logs/autonomia-dorada-local.log`.

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
- Sin cuenta, analítica, pagos ni automatización de transacciones. El progreso y las favoritas se guardan solo en el navegador.

## Catálogo y fuentes

El catálogo inicial está en `server/seed.js` y su estructura en `server/schema.sql`. Ejecuta `npm run seed` para instalar o refrescar el catálogo. Las tablas relacionan entidades, guías, pasos, ilustraciones, enlaces y fuentes con fecha y resultado de revisión. La interfaz actual dibuja esquemas demostrativos por paso en `GuideArtwork` dentro de `src/main.jsx`; los SVG heredados de `public/illustrations/` son recursos de referencia y no se presentan como capturas oficiales. Cuando se entreguen capturas autorizadas, se podrán guardar ordenadamente en `public/guides/<id-de-guia>/` y relacionar mediante `steps.image_path` y `steps.image_alt`.

El catálogo incluye **400 temas**, con **50 guías por cada una de las ocho categorías**. La portada presenta cuatro opciones por área y “Ver todas” abre su catálogo completo. Hay 34 guías con pasos revisados y 366 temas en revisión. Los temas nuevos conservan imágenes temáticas y acceso al canal oficial; no publican instrucciones operativas hasta revisar su procedimiento concreto.

Las rutas explican cómo consultar afiliación, pedir citas médicas y de psicología, preguntar por cobertura, hacer seguimiento y presentar una queja. Cada EPS define sus canales y confirma disponibilidad; el catálogo no recomienda una IPS ni una clínica. ADRES muestra los datos reportados a la BDUA, pero los certificados los expide la EPS. La Línea 106 ofrece orientación inicial y no reemplaza la atención de urgencia ni una consulta clínica.

Las guías de bienestar físico incluyen vacunación, prevención, salud bucal, actividad física para personas mayores y orientación sobre urgencias. Los pasos no diagnostican ni individualizan tratamientos. La guía de novedades de afiliación permanece en revisión porque Mi Seguridad Social puede requerir autenticación y los trámites disponibles dependen de cada caso. Las tareas digitales anteriores sobre pagos y SOAT siguen en el catálogo y conservan su estado.

Los pasos del RUNT son una orientación de entrada al servicio; la consulta oficial vigente solicita placa, tipo de documento y número de documento de la persona propietaria. Esos datos se ingresan directamente en el dominio oficial, nunca en esta aplicación. La revisión es puntual y no implica monitoreo automático futuro. Antes de actualizar una guía se debe volver a abrir su fuente y registrar el resultado.

## Identidad visual y narración

La identidad aplica el logotipo entregado para el proyecto en la cabecera, bienvenida, pie de página y favicon. La paleta recoge su verde profundo, oro y marfil; las superficies son claras y las acciones mantienen contraste. El catálogo muestra iconos, marcas y textos breves; las guías conservan el progreso visible. Atkinson Hyperlegible Next para lectura y Newsreader para encabezados se sirven localmente desde `public/fonts/`; cada familia incluye su licencia OFL. El movimiento de entrada es breve y se desactiva cuando el dispositivo solicita movimiento reducido.

El botón **Escuchar** activa voluntariamente la lectura al pasar el cursor o tocar texto; también se puede narrar un paso desde su propio control. La voz se elige en español, con preferencia automática por español de Colombia cuando está disponible. El selector usa nombres de idioma y voz, sin clasificarla por género. En **Configuración**, A− disminuye el tamaño de la letra, A+ lo aumenta y **Normal** restablece el tamaño. La preferencia se guarda en el dispositivo. La disponibilidad depende del navegador; el texto permanece visible.

## Mejora continua

El objetivo del proyecto es seguir mejorando de forma iterativa la claridad, la seguridad y la experiencia de principio a fin. Cada revisión debe recorrer la ruta principal desde “¿Qué quieres hacer hoy?” hasta los pasos y el regreso, además de revisar búsqueda, filtros, estados pendientes, accesibilidad, narración, navegación táctil y escritorio. Se deben corregir fricciones observables, mantener el texto corto, reducir errores y hacer que las acciones importantes sean fáciles de encontrar para personas mayores con distintos niveles de experiencia digital.

Antes de ampliar el catálogo, revisar las fuentes oficiales actuales y dejar visibles la fecha, el alcance y las limitaciones; una fuente enlazada no equivale a pasos comprobados. Incorporar mejoras visuales con animaciones moderadas y funcionales, marcas reconocibles con procedencia clara, y estados vacíos, de carga, de recuperación y de error que orienten sin saturar. Mantener los datos personales y el progreso en el dispositivo, no introducir acciones financieras ni formularios de credenciales, y no presentar ilustraciones de muestra como capturas reales.

El ciclo de trabajo es deliberadamente continuo: observar la experiencia completa, identificar una mejora comprobable, implementarla, revisar escritorio y tamaños de teléfono, verificar build/API y comportamiento con movimiento reducido, documentar cualquier límite y volver a recorrer el flujo en busca de la siguiente fricción. El objetivo no se cumple al cerrar una lista de cambios: cada actualización del catálogo o de la interfaz debe poder dejar el producto más sencillo, comprensible, inclusivo y confiable.

## Web publicada en Vercel

La aplicación está publicada en **https://trabajo-social-omega.vercel.app/** desde la rama `main` del repositorio. La configuración está en `vercel.json` y [docs/deployment/VERCEL.md](docs/deployment/VERCEL.md). El build de Vercel vuelve a crear el catálogo desde SQLite y lo exporta como instantánea JSON para la función de lectura `/api/catalog`; esto evita depender de SQLite nativo en las funciones de producción. Los cambios de contenido se revisan en el catálogo y se publican con un nuevo despliegue. La aplicación local mantiene su servidor SQLite.

## Accesibilidad y seguridad

- Controles A−/A+ y tamaño de texto guardado localmente en el dispositivo. El texto se adapta al espacio disponible para evitar ampliar el lienzo y provocar desplazamiento horizontal; los botones conservan áreas táctiles amplias.
- Lectura en voz alta a demanda con el sintetizador del navegador, controles Escuchar/Pausar/Continuar/Detener y texto visible. Al terminar, Escuchar vuelve a estar disponible.
- Teclado, enlace para saltar al contenido, estados accesibles, áreas táctiles amplias, adaptación a pantallas angostas y respeto por movimiento reducido.
- Los ejemplos recreados de cada paso son demostrativos; no representan pantallas oficiales. Las imágenes futuras requieren procedencia, permiso de uso y guía/paso identificables.
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

La bienvenida inicial conserva la orientación y se puede omitir; en teléfonos se compacta para dejar la búsqueda a la vista antes.

Las guías marcadas como **Pendiente** aún no muestran pasos de operación. La guía genérica de facturas públicas de Nequi solo aplica si el proveedor aparece en el catálogo dentro de la aplicación; no confirma que Afinia esté disponible. Esta primera versión no afirma incluir todos los bancos o servicios. No se han incorporado capturas reales porque todavía no fueron entregadas.
En las guías pendientes, una frase breve deja claro que los pasos siguen en revisión y el acceso al canal oficial aparece antes de la explicación detallada, también en teléfonos pequeños.
El dominio de destino se muestra bajo ese acceso para que la persona pueda reconocerlo antes de abrir el sitio externo.

El catálogo se muestra en dos estados visuales: tareas con pasos revisados y tareas que todavía no tienen instrucciones publicadas. Las guías revisadas aparecen primero; en una búsqueda se conserva la relevancia y solo se da prioridad a las revisadas cuando hay un empate. La sección **Transparencia y confianza** da acceso a los canales y fuentes que respaldan el catálogo, con el alcance y las limitaciones de cada consulta. La búsqueda acepta expresiones completas y términos de contexto; `Ctrl+K` o `⌘K` enfoca el campo de búsqueda desde el inicio. Los filtros por categoría trabajan junto con los resultados de búsqueda.

Al abrir una guía desde el catálogo, el botón **Atrás** del navegador o el gesto equivalente en teléfono recupera la búsqueda anterior. **Volver a las guías** hace lo mismo; **Volver al inicio** limpia la búsqueda. Un enlace directo a una guía también permite volver al catálogo.

La búsqueda reconoce nombres de entidades y evita ofrecer guías de otros proveedores cuando se escribe uno concreto. Una tarea sin coincidencia muestra un resultado vacío y permite volver a intentar; en móvil el encabezado de resultados deja espacio para leer el texto ampliado.
Cuando una búsqueda tiene una sola coincidencia y no hay otras ocultas, se presenta la tarjeta sin categorías ni controles innecesarios delante. Los filtros vuelven al limpiar la búsqueda o cuando hay varias opciones.

Si una coincidencia está oculta porque se desactivaron las guías en revisión, el estado vacío lo explica y permite mostrarlas sin perder la búsqueda ni la categoría seleccionada.

El tamaño de texto se ajusta entre 90 % y 130 % y se puede restablecer pulsando su indicador. La interfaz conserva un ancho legible al aumentar la escala. El progreso de una guía revisada solo se guarda al avanzar un paso y se conserva localmente en el dispositivo; abrir una tarea pendiente no altera ese progreso.
En teléfono, la preparación, una advertencia breve de seguridad cuando no está incluida en la preparación, y la fuente aparecen antes del paso; se evita una tarjeta de progreso redundante para llegar antes a la instrucción.

Las guías revisadas se pueden guardar como favoritas desde la tarjeta; la selección y el avance se almacenan únicamente en el navegador actual y no se envían a la API local. El modo **Ver solo favoritas** filtra el catálogo y funciona junto con la búsqueda y las categorías; al quitar la última guía guardada, se vuelve a la lista general. En cada paso aparece primero la instrucción y un ejemplo recreado con aspecto de teléfono, visible también en móvil; se puede ocultar con un botón. Es una orientación visual, no una pantalla real del proveedor. No hay control para subir capturas; cuando se entreguen imágenes autorizadas, se incorporarán tras revisar su procedencia.
En el inicio, las favoritas se muestran como accesos compactos con apertura y opción para quitarlas. La tarjeta completa sigue disponible en el catálogo y en el filtro de favoritas.
Al activar **Ver solo favoritas**, se limpian la búsqueda y la categoría anterior para mostrar todas las guías guardadas; después se pueden aplicar filtros nuevos.
La sugerencia **Puedes continuar** se puede cerrar. Si la persona avanza a otro paso después, vuelve a aparecer con el progreso nuevo; cerrarla no la desactiva para siempre.
La sugerencia no ocupa espacio durante una búsqueda ni al ver solo favoritas. El avance permanece guardado y la tarjeta vuelve al inicio cuando se despeja la búsqueda.
Al buscar entre todas las guías, la sección de favoritas también se aparta para dejar los resultados a la vista; las guías guardadas regresan al limpiar la búsqueda.

El botón **Ayuda** abre un panel con instrucciones breves, acceso al catálogo y el enlace telefónico a la Línea Nacional de Salud Mental 106, publicado por el Ministerio de Salud. La cabecera y el pie incluyen accesos a las guías, inicio y ayuda. Las tarjetas usan marcas obtenidas de los sitios de las entidades cuando se pudo confirmar el recurso; SOAT lleva un distintivo propio porque no es una entidad.

En teléfono, **Ayuda** mantiene su nombre visible junto al icono. La narración opcional se aplica al contenido y evita leer los propios controles de cabecera o pie cuando se pasa el cursor por ellos.

En teléfonos, las tarjetas muestran un resumen de hasta tres líneas y una acción explícita: **Abrir guía** o **Ver información**. El detalle conserva el texto completo y las advertencias de cada tarea.

El catálogo visual presenta cuatro guías por área y una ilustración temática local en cada tarjeta. Los resúmenes se limitan a dos líneas; las advertencias y las instrucciones completas permanecen al abrir la guía. Las ilustraciones identifican el tema y no son capturas de proveedores.
