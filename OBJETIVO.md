# Objetivo continuo del proyecto

## Propósito

Mejorar Autonomía Dorada de manera continua hasta que la experiencia se sienta profesional, clara, confiable, accesible y sencilla en escritorio y teléfono. La entrada debe responder primero a “¿Qué quieres hacer hoy?” y acompañar la autonomía de las personas mayores con orientación accesible, inicialmente en salud y bienestar.

## Experiencia que queremos construir

- Mantener una interfaz amable, directa y breve, con jerarquía visual evidente, lenguaje cotidiano y acciones fáciles de reconocer.
- Diseñar para móvil desde el inicio: tipografía legible, controles táctiles amplios, contenido sin desbordamiento horizontal, lectura y navegación cómodas con una mano.
- Aplicar el logotipo propio entregado en cabecera, bienvenida, pie y favicon. Basar la identidad en su verde profundo, dorado y marfil, con contraste suficiente. Añadir movimiento donde aporte comprensión, respuesta o continuidad; evitar animación que distraiga y respetar `prefers-reduced-motion`.
- Mantener búsqueda, filtros, favoritos, progreso y estados de carga, vacío, pendiente, error y recuperación comprensibles y funcionales.
- Implementar narración voluntaria con el control breve “Escuchar”: lectura al pasar el puntero por texto con mouse y al tocar texto en pantallas táctiles. Usar español de Colombia cuando esté disponible, evitar clasificar las voces por género y mantener la lectura apagada por defecto.
- Identificar los servicios con sus logotipos oficiales cuando se pueda confirmar su procedencia y guardarlos como recursos locales; documentar sus fuentes y derechos. Mantener un símbolo neutral si el archivo oficial no puede verificarse.
- Usar ilustraciones propias únicamente como demostraciones, identificarlas con claridad y nunca hacerlas pasar por capturas oficiales.

## Confianza, fuentes y límites

- Revisar fuentes oficiales antes de añadir o actualizar pasos. Anotar entidad, enlace, fecha, alcance y resultado de la consulta.
- Separar con claridad los pasos comprobados de las tareas pendientes; una página enlazada por sí sola no demuestra que el flujo sea correcto o esté disponible.
- Mantener las interacciones en modo de orientación. No procesar pagos o transferencias, no solicitar claves o credenciales y no enviar datos personales o financieros a la aplicación.
- Escribir datos sensibles únicamente en la página oficial de la entidad cuando el procedimiento lo requiera. Preservar el progreso, favoritos e imágenes opcionales en el dispositivo del usuario.
- Usar medidas web prudentes, validar entradas, limitar contenido enviado al servidor y mantener secretos fuera del repositorio.

## Mejora continua y forma de cerrar cada iteración

No considerar terminado el proyecto por haber completado una lista inicial. Después de implementar una mejora, recorrer otra vez la experiencia completa desde el inicio hasta cada estado de guía y el regreso. Buscar fricciones en microcopy, jerarquía, búsqueda, navegación, respuesta visual, pantallas pequeñas, teclado, lector de voz y accesibilidad. Priorizar una mejora cuando elimine una duda, reduzca pasos, prevenga un error o haga más fácil completar la tarea.

Este chat tiene una revisión horaria activa para retomar el proyecto durante el día. Cada ejecución debe buscar una mejora nueva, aplicar las que tengan valor claro y registrar límites o hallazgos pendientes. Las ejecuciones requieren que el equipo y la aplicación local estén disponibles; el horario no significa trabajo ininterrumpido entre revisiones. El objetivo permanece activo hasta que el usuario decida pausarlo o cerrarlo.

Para cada iteración:

1. Observar un recorrido real de la interfaz en escritorio y teléfono.
2. Registrar la fricción concreta y el cambio que la resolverá.
3. Implementar el cambio con el sistema visual y los límites de seguridad establecidos.
4. Revisar composición, controles, contenido y movimiento reducido en tamaños representativos.
5. Ejecutar las comprobaciones de build y API adecuadas al cambio.
6. Revisar fuentes, documentación, cambios del repositorio y cualquier limitación restante.
7. Volver al paso 1 y buscar la siguiente oportunidad de mejora.

En las revisiones móviles, observar como mínimo anchos de 320 y 390 px, además del texto ampliado al 130 %. No debe haber desplazamiento horizontal accidental; los controles principales deben seguir visibles y cómodos de tocar. Comprobar también el flujo real de búsqueda, apertura de guía y regreso, no solo una captura de la portada.

El criterio de calidad es que una persona pueda encontrar una tarea, saber qué pasos son confiables, seguir la orientación con comodidad y volver atrás sin miedo; la interfaz debe ser agradable e interactiva, sin sacrificar sencillez ni transparencia.

## Entrega y publicación

Mantener la ejecución local disponible en `http://localhost:3001/`. Conservar una base clara para servir la interfaz y el catálogo de solo lectura en Vercel, documentar los requisitos para conectarlo y no desplegar hasta la sesión prevista con el usuario. Al publicar el código autorizado a GitHub, revisar los archivos sensibles, documentar el funcionamiento y las limitaciones en el README, y verificar que la rama remota coincida con el commit local.
