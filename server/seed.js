import "dotenv/config";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath = path.resolve(
  process.env.DATABASE_PATH || "./data/prueba1.sqlite",
);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.exec(fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
db.pragma("foreign_keys = ON");

const entities = [
  {
    id: "nequi",
    name: "Nequi",
    category: "Billeteras",
    icon: "N",
    note: "Billetera digital",
  },
  {
    id: "bancolombia",
    name: "Bancolombia",
    category: "Bancos",
    icon: "B",
    note: "Incluye búsquedas como «Banco Colombia».",
  },
  {
    id: "afinia",
    name: "Afinia",
    category: "Servicios públicos",
    icon: "A",
    note: "Energía eléctrica en Cartagena y la región.",
  },
  {
    id: "runt",
    name: "RUNT",
    category: "Trámites y seguros",
    icon: "R",
    note: "Consulta ciudadana de vehículos.",
  },
  ...[
    ["davivienda", "Davivienda", "Bancos"],
    ["banco-bogota", "Banco de Bogotá", "Bancos"],
    ["bbva", "BBVA", "Bancos"],
    ["dale", "dale!", "Billeteras"],
    ["movii", "MOVii", "Billeteras"],
    ["movistar", "Movistar", "Servicios públicos"],
    ["ara", "Tiendas Ara", "Comercios"],
    ["soat", "SOAT", "Trámites y seguros"],
  ].map(([id, name, category]) => ({
    id,
    name,
    category,
    icon: "•",
    note: "El contenido de esta guía está pendiente de revisión con fuentes oficiales.",
  })),
];

const sources = [
  {
    id: "nequi-send-guide",
    title: "¿Cómo enviar plata a otro Nequi?",
    url: "https://ayuda.nequi.com.co/hc/es/articles/35293860820493--C%C3%B3mo-enviar-plata-a-otro-Nequi",
    publisher: "Centro de ayuda Nequi",
    checked_at: "2026-10-28",
    result:
      "Página oficial HTTPS. Instrucciones revisadas en la consulta de 2026-10-28.",
  },
  {
    id: "nequi-public-bill-guide",
    title: "¿Cómo pagar servicios públicos en línea con Nequi?",
    url: "https://ayuda.nequi.com.co/hc/es/articles/33955587381389--C%C3%B3mo-pagar-servicios-p%C3%BAblicos-en-l%C3%ADnea-con-Nequi",
    publisher: "Centro de ayuda Nequi",
    checked_at: "2026-10-28",
    result:
      "Página oficial HTTPS revisada. Guía genérica del catálogo de servicios en Nequi. No se confirma disponibilidad individual de Afinia ni de otra empresa; comprueba el catálogo actualizado antes de iniciar.",
  },
  {
    id: "bancolombia-transfer-guide",
    title: "¿Cómo hago transferencias a cuentas por la app Mi Bancolombia?",
    url: "https://www.bancolombia.com/centro-de-ayuda/preguntas-frecuentes/trasferencias-cuentas-inscritas-app-personas",
    publisher: "Bancolombia — Centro de ayuda",
    checked_at: "2026-10-28",
    result:
      "Página oficial HTTPS. Guía para transferir a cuenta Bancolombia revisada; no generalizar a otros bancos.",
  },
  {
    id: "afinia-channels",
    title: "Canales virtuales y de atención de Afinia",
    url: "https://www.afinia.com.co/",
    publisher: "Afinia",
    checked_at: "2026-10-28",
    result:
      "Dominio HTTPS oficial. Fuente confirma oficina virtual, aplicación y canales de atención, pero no se verificó un flujo de pago paso a paso.",
  },
  {
    id: "runt-soat-query",
    title: "Consulta de vehículos por placa",
    url: "https://www.runt.gov.co/actores/ciudadano/consulta-de-vehiculos-por-placa",
    publisher: "RUNT",
    checked_at: "2026-10-28",
    result:
      "Página oficial vigente del RUNT: Consulta de vehículos por placa. Enlaza a «Ingrese aquí al módulo», que lleva al portal público. El instructivo oficial RUNT2-IN-1010 versión 1 (03-10-2025) indica para la consulta por placa el número de placa y el tipo y número de documento del propietario. La dirección antigua del formulario redirige al portal público general. Consultado el 28 de octubre de 2026.",
  },
  {
    id: "movistar-payment-portal",
    title: "Portal de pagos Movistar",
    url: "https://payment.movistar.co/invoice-details",
    publisher: "Movistar Colombia",
    checked_at: "2026-10-28",
    result:
      "La página oficial de Movistar enlaza este portal para pagar la factura. El portal permite consultar saldo, agregar o editar facturas y pagar. Movistar informa que sus servicios continúan en transición a Tigo. No se documentan aquí los pasos de una transacción.",
  },
  {
    id: "sfc-soat",
    title: "Recomendaciones para comprar SOAT y evitar fraude",
    url: "https://www.superfinanciera.gov.co/publicaciones/10115953/superfinanciera-divulga-las-tarifas-maximas-del-soat-para-2026/",
    publisher: "Superintendencia Financiera de Colombia",
    checked_at: "2026-10-28",
    result:
      "Página oficial de la SFC, modificada el 2 de enero de 2026 y consultada de nuevo el 28 de octubre de 2026. Recomienda usar canales oficiales, comprobar que la aseguradora esté vigilada y verificar a los intermediarios en el sistema de consulta. No documenta una compra específica ni identifica un vendedor.",
  },
  {
    id: "bbva-official-channel",
    title: "Sitio oficial de BBVA Colombia",
    url: "https://www.bbva.com.co/",
    publisher: "BBVA Colombia",
    checked_at: "2026-10-28",
    result:
      "Portada HTTPS de BBVA Colombia consultada; muestra opciones de personas, app y atención. No se verificó un flujo de transferencias para esta guía, que continúa pendiente.",
  },
  {
    id: "banco-bogota-official-channel",
    title: "Portal de Personas del Banco de Bogotá",
    url: "https://www.bancodebogota.com/personas",
    publisher: "Banco de Bogotá",
    checked_at: "2026-10-28",
    result:
      "El enlace HTTPS a Personas está publicado por el propio Banco en su portal de transparencia. La consulta automatizada del destino devolvió 403; no se revisó el flujo de transferencias y la guía sigue pendiente.",
  },
  {
    id: "davivienda-official-channel",
    title: "Sitio oficial de Davivienda",
    url: "https://www.davivienda.com/",
    publisher: "Banco Davivienda / Davivienda Group",
    checked_at: "2026-10-28",
    result:
      "La página oficial de contacto de Davivienda Group dirige a clientes de Colombia a davivienda.com y a la app Davivienda. La portada no fue legible en esta consulta; no se verificó el flujo de transferencias y la guía sigue pendiente.",
  },
  {
    id: "movii-official-channel",
    title: "Canal oficial de MOVii",
    url: "https://www.movii.com.co/",
    publisher: "MOVii",
    checked_at: "2026-10-28",
    result:
      "Portada HTTPS de MOVii consultada; incluye acceso a Personas y presenta la app. No se verificó el flujo de envío de dinero para esta guía, que continúa pendiente.",
  },
  {
    id: "dale-official-channel",
    title: "Sitio oficial de dale!",
    url: "https://www.dale.com.co/nowrap/",
    publisher: "Aval Soluciones Digitales S.A. — dale!",
    checked_at: "2026-10-28",
    result:
      "Página indexada como sitio oficial de dale! con servicios para pasar, pagar y recibir plata. El destino bloqueó la lectura automatizada en esta consulta; no se verificó un flujo de transferencia y la guía sigue pendiente.",
  },
  {
    id: "ara-official-channel",
    title: "Sitio oficial de Tiendas ara",
    url: "https://aratiendas.com/home/centro/",
    publisher: "Tiendas ara — Jerónimo Martins Colombia S.A.S.",
    checked_at: "2026-10-28",
    result:
      "El dominio sirve materiales oficiales de Tiendas ara y la URL del centro fue publicada como sitio oficial. La página no permitió revisar su contenido en esta consulta; no se encontró un canal de pagos verificable. La guía sigue pendiente y no se muestra este enlace como canal de pago.",
  },
];

const guides = [
  {
    id: "nequi-send",
    entity_id: "nequi",
    title: "Enviar plata a otro Nequi",
    task: "Enviar dinero",
    description:
      "Envía plata a otro número Nequi. Revisa el nombre antes de confirmar: el envío no se puede cancelar.",
    preparation:
      "Ten listo el número de celular de la persona y revisa que tengas saldo. No compartas tu clave ni códigos de seguridad.",
    status: "verified",
    updated_at: "2026-10-28",
    source_id: "nequi-send-guide",
    common_errors: [
      "Si no tienes saldo, vuelve al inicio de Nequi y revisa tu Disponible.",
      "Si el nombre que aparece no corresponde a la persona, toca Corregir datos y no envíes.",
    ],
    aliases: [
      "mandar plata",
      "pasar dinero",
      "transferir a nequi",
      "enviar a nequi",
      "plata a otra persona",
    ],
  },
  {
    id: "nequi-public-bill",
    entity_id: "nequi",
    title: "Pagar una factura de servicios públicos con Nequi",
    task: "Pagar una factura",
    description:
      "La guía explica el recorrido general para encontrar servicios públicos en Nequi. No confirma que una empresa específica esté disponible; comprueba el catálogo que aparece hoy en la aplicación.",
    preparation:
      "Ten la factura a mano. El número de referencia depende del servicio. No compartas ese dato aquí.",
    status: "verified",
    updated_at: "2026-10-28",
    source_id: "nequi-public-bill-guide",
    common_errors: [
      "No confirmamos que Afinia u otro proveedor específico aparezca en el catálogo. Si tu empresa no aparece con su nombre exacto, no selecciones otra parecida y consulta a tu proveedor.",
      "Si la referencia o los datos de la factura no coinciden, detente y revísalos antes de continuar.",
    ],
    aliases: [
      "pagar la luz",
      "pagar factura de luz",
      "pagar energía",
      "pagar energia",
      "factura de servicios públicos",
      "pagar recibo",
      "pagar servicios públicos",
    ],
  },
  {
    id: "bancolombia-own-transfer",
    entity_id: "bancolombia",
    title: "Transferir entre cuentas Bancolombia",
    task: "Hacer una transferencia",
    description:
      "Envía plata desde la app Mi Bancolombia a una cuenta Bancolombia.",
    preparation:
      "Necesitas una cuenta activa con saldo disponible y la app Mi Bancolombia. Las cuentas destino no inscritas pueden requerir pasos diferentes.",
    status: "verified",
    updated_at: "2026-10-28",
    source_id: "bancolombia-transfer-guide",
    common_errors: [
      "Si no encuentras el botón, consulta la ayuda de Mi Bancolombia porque los nombres de la app pueden cambiar.",
      "Revisa el producto de destino y el valor antes de confirmar.",
    ],
    aliases: [
      "banco colombia",
      "bancolombia",
      "transferir",
      "enviar plata desde bancolombia",
      "cuenta bancolombia",
    ],
  },
  {
    id: "afinia-bill-pending",
    entity_id: "afinia",
    title: "Pagar o consultar la factura de energía",
    task: "Consultar o pagar un servicio",
    description:
      "Queremos guiarte con seguridad, pero aún no confirmamos el flujo actual de pago en la oficina virtual.",
    preparation:
      "No compartas aquí tu número de contrato, datos bancarios ni claves.",
    status: "pending",
    updated_at: null,
    source_id: "afinia-channels",
    common_errors: [],
    aliases: ["luz", "pagar la luz", "factura afinia", "energía", "energia"],
  },
  {
    id: "runt-soat-consult",
    entity_id: "runt",
    title: "Consultar la vigencia del SOAT",
    task: "Consultar un trámite o seguro",
    description:
      "El RUNT ofrece una consulta ciudadana de vehículos. Su instructivo oficial describe la búsqueda por placa con datos del propietario; el formulario puede cambiar y se abre directamente en el portal del RUNT.",
    preparation:
      "Ten a mano la placa y el tipo y número de documento del propietario del vehículo. Ingrésalos únicamente en el formulario oficial del RUNT. Esta aplicación no los solicita, almacena ni recibe.",
    status: "verified",
    updated_at: "2026-10-28",
    source_id: "runt-soat-query",
    common_errors: [
      "Si la página cambió, vuelve a la consulta ciudadana oficial del RUNT y usa el enlace «Ingrese aquí al módulo».",
      "Si los datos no coinciden, verifica la placa y consulta directamente con el RUNT o con la aseguradora.",
    ],
    aliases: [
      "soat",
      "consultar mi soat",
      "vencimiento soat",
      "vigencia seguro",
      "seguro del carro",
      "moto",
    ],
  },
  {
    id: "soat-purchase-pending",
    entity_id: "soat",
    title: "Comprar el SOAT de forma segura",
    task: "Comprar un seguro",
    description:
      "Aún no revisamos un proceso de compra ni un vendedor específico. Consulta las recomendaciones oficiales de la Superintendencia Financiera y confirma que el canal de venta esté autorizado.",
    preparation:
      "No compartas aquí datos del vehículo, documentos personales ni información de pago.",
    status: "pending",
    updated_at: null,
    source_id: "sfc-soat",
    common_errors: [],
    aliases: [
      "comprar soat",
      "renovar soat",
      "sacar soat",
      "seguro obligatorio",
      "comprar seguro del carro",
      "soat para moto",
    ],
  },
  ...[
    [
      "davivienda-pending",
      "davivienda",
      "Enviar plata o pagar desde Davivienda",
      "Enviar dinero",
      "davivienda enviar plata transferencia pagar",
      "davivienda-official-channel",
    ],
    [
      "bogota-pending",
      "banco-bogota",
      "Enviar plata o pagar desde Banco de Bogotá",
      "Enviar dinero",
      "banco de bogota transferir pagar",
      "banco-bogota-official-channel",
    ],
    [
      "bbva-pending",
      "bbva",
      "Enviar plata o pagar desde BBVA",
      "Enviar dinero",
      "bbva transferir pagar",
      "bbva-official-channel",
    ],
    [
      "dale-pending",
      "dale",
      "Enviar plata desde dale!",
      "Enviar dinero",
      "dale billetera transferir",
      "dale-official-channel",
    ],
    [
      "movii-pending",
      "movii",
      "Enviar plata desde MOVii",
      "Enviar dinero",
      "movii billetera transferir",
      "movii-official-channel",
    ],
    [
      "movistar-pending",
      "movistar",
      "Consultar o pagar una factura Movistar",
      "Consultar o pagar un servicio",
      "movistar tigo factura pagar celular",
      "movistar-payment-portal",
    ],
    [
      "ara-pending",
      "ara",
      "Consultar medios de pago en Tiendas Ara",
      "Pagar una compra",
      "ara tiendas pagar compra",
      "ara-official-channel",
    ],
  ].map(([id, entity_id, title, task, aliases, source_id]) => ({
    id,
    entity_id,
    title,
    task,
    description:
      id === "movistar-pending"
        ? "Movistar informa que sus servicios continúan en transición a Tigo. El portal oficial permite consultar facturas, pero aún no hemos revisado el paso a paso."
        : id === "ara-pending"
          ? "Encontramos materiales oficiales de Tiendas ara, pero no confirmamos los medios de pago ni un paso a paso para esta tarea."
          : "La guía está pendiente de revisión con la fuente oficial de la entidad. Por ahora, puedes abrir su canal oficial y consultar allí directamente.",
    preparation: "No compartas contraseñas, claves ni códigos de seguridad.",
    status: "pending",
    updated_at: null,
    source_id,
    common_errors: [],
    aliases: aliases.split(" "),
  })),
];

const steps = [
  [
    "nequi-send",
    1,
    "Abre la app Nequi en tu celular.",
    "phone",
    "Abre una aplicación en un celular",
  ],
  [
    "nequi-send",
    2,
    "Toca el signo pesos ($) y luego toca «Envía».",
    "money",
    "Busca el signo de pesos y la opción para enviar",
  ],
  [
    "nequi-send",
    3,
    "Elige «Nequi» como destino.",
    "destination",
    "Escoge una persona que usa Nequi",
  ],
  [
    "nequi-send",
    4,
    "Escribe el número de celular y el valor. Escoge de dónde sale la plata; luego toca «Sigue».",
    "details",
    "Escribe el celular y el valor que vas a enviar",
  ],
  [
    "nequi-send",
    5,
    "Revisa el nombre que aparece y el valor. Si todo coincide, toca «Enviar». No podrás cancelar este envío.",
    "check",
    "Revisa con cuidado el destino antes de enviar",
  ],
  [
    "nequi-send",
    6,
    "Mira el detalle del movimiento. Puedes compartir el comprobante con la otra persona.",
    "done",
    "Revisa el comprobante del movimiento",
  ],
  [
    "nequi-public-bill",
    1,
    "Abre Nequi y busca «Servicios».",
    "phone",
    "Abre Nequi y busca la sección Servicios",
  ],
  [
    "nequi-public-bill",
    2,
    "Toca «Servicios públicos».",
    "menu",
    "Busca Servicios públicos",
  ],
  [
    "nequi-public-bill",
    3,
    "En «Servicios básicos», toca «Otras empresas». Allí aparece el catálogo disponible.",
    "menu",
    "Consulta el catálogo actual de empresas disponibles",
  ],
  [
    "nequi-public-bill",
    4,
    "Busca el nombre exacto de tu empresa. Si no aparece, detente y consulta los canales oficiales de tu proveedor.",
    "destination",
    "Comprueba que aparezca el nombre exacto de tu empresa",
  ],
  [
    "nequi-public-bill",
    5,
    "Si aparece, selecciónala y escribe la referencia que indica tu factura. Luego toca «Consultar».",
    "details",
    "Escribe la referencia que aparece en tu factura",
  ],
  [
    "nequi-public-bill",
    6,
    "Revisa los datos consultados. Escribe el valor de la factura y toca «Continuar».",
    "check",
    "Revisa que los datos de la factura coincidan",
  ],
  [
    "nequi-public-bill",
    7,
    "Haz una última revisión y toca «Pagar» solo si la empresa, la referencia y el valor son correctos.",
    "check",
    "Confirma únicamente si todos los datos son correctos",
  ],
  [
    "nequi-public-bill",
    8,
    "Consulta el mensaje de confirmación y el movimiento en la app. Algunas empresas pueden tardar en confirmar el pago.",
    "done",
    "Revisa el movimiento y el mensaje de confirmación",
  ],
  [
    "bancolombia-own-transfer",
    1,
    "Abre la app Mi Bancolombia.",
    "phone",
    "Abre la aplicación de tu banco",
  ],
  [
    "bancolombia-own-transfer",
    2,
    "En el menú de abajo, toca «Transacciones» y luego «Transferir Plata».",
    "menu",
    "Busca las transacciones y la opción de transferir",
  ],
  [
    "bancolombia-own-transfer",
    3,
    "Ingresa con tu método habitual y elige «Transferir Plata» en la app.",
    "secure",
    "Entra a tu aplicación con tu método habitual",
  ],
  [
    "bancolombia-own-transfer",
    4,
    "Escoge la cuenta de donde saldrá la plata y escribe el valor. Toca «Continuar».",
    "details",
    "Escoge la cuenta y el valor",
  ],
  [
    "bancolombia-own-transfer",
    5,
    "Elige una cuenta Bancolombia inscrita o «De Bancolombia» si aún no está inscrita.",
    "destination",
    "Elige la cuenta Bancolombia de destino",
  ],
  [
    "bancolombia-own-transfer",
    6,
    "Revisa la información y el nombre de la persona. Si todo está correcto, confirma la transferencia en la app.",
    "check",
    "Verifica quién recibe y cuánto vas a enviar",
  ],
  [
    "bancolombia-own-transfer",
    7,
    "Mira el comprobante de la transferencia.",
    "done",
    "Revisa el comprobante",
  ],
  [
    "runt-soat-consult",
    1,
    "Abre el enlace oficial del RUNT. En esta guía no te pediremos ningún dato.",
    "link",
    "Entra a la página oficial del RUNT",
  ],
  [
    "runt-soat-consult",
    2,
    "En la página «Consulta de vehículos por placa», selecciona «Ingrese aquí al módulo» para abrir el portal público del RUNT.",
    "menu",
    "Busca la consulta de vehículos",
  ],
  [
    "runt-soat-consult",
    3,
    "Para la consulta por placa, el instructivo del RUNT indica que te pedirán la placa y el tipo y número de documento del propietario. Escríbelos solo en el portal oficial; nunca en esta aplicación.",
    "details",
    "Ten a la mano la placa y los datos solicitados",
  ],
  [
    "runt-soat-consult",
    4,
    "Sigue las indicaciones del formulario oficial y envía la consulta.",
    "check",
    "Completa la verificación y revisa el resultado",
  ],
  [
    "runt-soat-consult",
    5,
    "El resultado oficial muestra la información registrada. Si algo no coincide, consulta al RUNT o a tu aseguradora.",
    "done",
    "Revisa la información registrada",
  ],
];

const putEntity = db.prepare(
  "INSERT INTO entities(id,name,category,icon,note) VALUES(@id,@name,@category,@icon,@note) ON CONFLICT(id) DO UPDATE SET name=excluded.name,category=excluded.category,icon=excluded.icon,note=excluded.note",
);
const putSource = db.prepare(
  "INSERT INTO sources(id,title,url,publisher,checked_at,result) VALUES(@id,@title,@url,@publisher,@checked_at,@result) ON CONFLICT(id) DO UPDATE SET title=excluded.title,url=excluded.url,publisher=excluded.publisher,checked_at=excluded.checked_at,result=excluded.result",
);
const putGuide = db.prepare(
  "INSERT INTO guides(id,entity_id,title,task,description,preparation,status,updated_at,source_id,common_errors,aliases) VALUES(@id,@entity_id,@title,@task,@description,@preparation,@status,@updated_at,@source_id,@common_errors,@aliases) ON CONFLICT(id) DO UPDATE SET entity_id=excluded.entity_id,title=excluded.title,task=excluded.task,description=excluded.description,preparation=excluded.preparation,status=excluded.status,updated_at=excluded.updated_at,source_id=excluded.source_id,common_errors=excluded.common_errors,aliases=excluded.aliases",
);
const putStep = db.prepare(
  "INSERT INTO steps(id,guide_id,position,instruction,image_path,image_alt) VALUES(@id,@guide_id,@position,@instruction,@image_path,@image_alt) ON CONFLICT(id) DO UPDATE SET instruction=excluded.instruction,image_path=excluded.image_path,image_alt=excluded.image_alt",
);
const putLink = db.prepare(
  "INSERT INTO links(id,entity_id,purpose,url,checked_at,result,explanation) VALUES(@id,@entity_id,@purpose,@url,@checked_at,@result,@explanation) ON CONFLICT(id) DO UPDATE SET entity_id=excluded.entity_id,purpose=excluded.purpose,url=excluded.url,checked_at=excluded.checked_at,result=excluded.result,explanation=excluded.explanation",
);

db.transaction(() => {
  entities.forEach((e) => putEntity.run(e));
  sources.forEach((s) => putSource.run(s));
  guides.forEach((g) =>
    putGuide.run({
      ...g,
      common_errors: JSON.stringify(g.common_errors),
      aliases: JSON.stringify(g.aliases),
    }),
  );
  steps.forEach(([guide, position, instruction, illustration, alt]) =>
    putStep.run({
      id: `${guide}-${position}`,
      guide_id: guide,
      position,
      instruction,
      image_path: `/illustrations/${illustration}.svg`,
      image_alt: alt,
    }),
  );
  const links = [
    [
      "nequi",
      "Guía oficial para enviar a otro Nequi",
      "https://ayuda.nequi.com.co/hc/es/articles/35293860820493--C%C3%B3mo-enviar-plata-a-otro-Nequi",
      "Abre la ayuda oficial de Nequi con los pasos e imágenes de su aplicación.",
    ],
    [
      "nequi",
      "Página oficial de Nequi",
      "https://www.nequi.com.co/",
      "Abre el sitio oficial de Nequi.",
    ],
    [
      "nequi",
      "Guía oficial para pagar servicios públicos en Nequi",
      "https://ayuda.nequi.com.co/hc/es/articles/33955587381389--C%C3%B3mo-pagar-servicios-p%C3%BAblicos-en-l%C3%ADnea-con-Nequi",
      "Explica los pasos generales para pagar desde Nequi; confirma que tu empresa aparezca primero en el catálogo actual de la app.",
    ],
    [
      "bancolombia",
      "Guía oficial de transferencias en Mi Bancolombia",
      "https://www.bancolombia.com/centro-de-ayuda/preguntas-frecuentes/trasferencias-cuentas-inscritas-app-personas",
      "Abre el centro de ayuda oficial de Bancolombia.",
    ],
    [
      "afinia",
      "Sitio oficial de Afinia",
      "https://www.afinia.com.co/",
      "Abre el sitio de Afinia, donde se encuentran sus canales virtuales y de atención.",
    ],
    [
      "movistar",
      "Portal oficial de pagos Movistar",
      "https://payment.movistar.co/invoice-details",
      "Abre el portal oficial de pagos Movistar. Para una transacción, sigue las instrucciones de ese sitio y confirma los datos directamente allí.",
    ],
    [
      "runt",
      "Consulta oficial de automotores y SOAT",
      "https://www.runt.gov.co/actores/ciudadano/consulta-de-vehiculos-por-placa",
      "Abre la página oficial «Consulta de vehículos por placa». Desde allí, el enlace «Ingrese aquí al módulo» lleva al portal público del RUNT.",
      "Página oficial vigente y enlace al módulo público confirmados el 28 de octubre de 2026. El instructivo oficial RUNT2-IN-1010 (03-10-2025) documenta la consulta por placa con tipo y número de documento del propietario.",
    ],
    [
      "soat",
      "Recomendaciones oficiales de la Superintendencia Financiera",
      "https://www.superfinanciera.gov.co/publicaciones/10115953/superfinanciera-divulga-las-tarifas-maximas-del-soat-para-2026/",
      "Abre recomendaciones para comprar SOAT por canales autorizados y evitar fraudes.",
    ],
    [
      "soat",
      "Consulta de entidades vigiladas por la SFC",
      "https://www.superfinanciera.gov.co/publicaciones/61694",
      "Comprueba directamente en la lista oficial de la SFC si una aseguradora está vigilada. Esta consulta no reemplaza revisar el producto ni la oferta que te presenten.",
      "El artículo de recomendaciones SOAT de la SFC enlaza directamente esta lista; el destino oficial muestra el directorio general de entidades vigiladas. Consultado el 28 de octubre de 2026.",
    ],
    [
      "soat",
      "Consulta de intermediarios de seguros",
      "https://www.superfinanciera.gov.co/publicaciones/10089684",
      "Verifica en el sistema oficial de la SFC si un intermediario de seguros está autorizado para comercializarlos.",
      "El artículo de recomendaciones SOAT de la SFC enlaza directamente este sistema; el destino oficial se identifica como consulta de intermediarios de seguros. Consultado el 28 de octubre de 2026.",
    ],
    [
      "bbva",
      "Sitio oficial de BBVA Colombia",
      "https://www.bbva.com.co/",
      "Abre el canal oficial de BBVA Colombia. El paso a paso para transferir está pendiente de revisión.",
    ],
    [
      "banco-bogota",
      "Portal Personas del Banco de Bogotá",
      "https://www.bancodebogota.com/personas",
      "Abre el canal oficial de Personas del Banco de Bogotá. No hemos verificado aún el flujo de transferencias.",
    ],
    [
      "davivienda",
      "Sitio oficial de Davivienda",
      "https://www.davivienda.com/",
      "Abre el canal oficial de Davivienda. La guía de transferencias sigue pendiente de revisión.",
    ],
    [
      "movii",
      "Sitio oficial de MOVii",
      "https://www.movii.com.co/",
      "Abre la página oficial de MOVii; allí puedes encontrar sus servicios y canales de ayuda.",
    ],
    [
      "dale",
      "Sitio oficial de dale!",
      "https://www.dale.com.co/nowrap/",
      "Abre el sitio oficial de dale! El paso a paso de transferencias está pendiente de revisión.",
    ],
    [
      "ara",
      "Sitio oficial de Tiendas ara",
      "https://aratiendas.com/home/centro/",
      "Abre la página de Tiendas ara. Esta guía no confirma los medios de pago disponibles en una tienda.",
    ],
  ];
  links.forEach(([entity_id, purpose, url, explanation, result], i) =>
    putLink.run({
      id: `link-${i + 1}`,
      entity_id,
      purpose,
      url,
      checked_at: "2026-10-28",
      result:
        result ||
        "Dominio o centro de ayuda oficial HTTPS consultado el 28 de octubre de 2026. El alcance se registra en la fuente relacionada.",
      explanation,
    }),
  );
})();
db.close();
console.log(`Catálogo instalado en ${dbPath}`);
