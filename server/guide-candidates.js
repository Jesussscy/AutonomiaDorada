// Candidate topics for the Colombia-first guide catalog.
// These are intentionally pending: no procedural steps are published until
// the exact official channel and its current workflow have been reviewed.
export const candidateEntities = [
  { id: "acuacar", name: "Aguas de Cartagena", category: "Servicios públicos", icon: "A", note: "Prestador de acueducto y alcantarillado en Cartagena; confirma cobertura y canales en su sitio oficial." },
  { id: "surtigas", name: "Surtigas", category: "Servicios públicos", icon: "S", note: "Empresa de gas natural con presencia en la región Caribe; confirma cobertura y canales en su sitio oficial." },
  { id: "govco", name: "GOV.CO — Estado colombiano", category: "Trámites y seguros", icon: "G", note: "Portal Único del Estado Colombiano para encontrar trámites y servicios oficiales." },
  { id: "sic", name: "Superintendencia de Industria y Comercio", category: "Comercios", icon: "SIC", note: "Autoridad colombiana de protección al consumidor; consulta sus canales oficiales." },
];

export const candidateSources = [
  {
    id: "acuacar-official-channel",
    title: "Sitio oficial de Aguas de Cartagena",
    url: "https://www.acuacar.com/",
    publisher: "Aguas de Cartagena S.A. E.S.P.",
    checked_at: "2026-10-27",
    result: "La página oficial consultada ofrece accesos a pago y duplicado de factura, estado de deuda, factura digital, citas, PQR, nuevos servicios y reporte de daños. Cada paso de estas guías todavía debe revisarse por separado.",
  },
  {
    id: "surtigas-official-channel",
    title: "Oficina virtual de Surtigas",
    url: "https://www.surtigas.com.co/oficina-virtual",
    publisher: "Surtigas S.A. E.S.P.",
    checked_at: "2026-10-27",
    result: "La oficina virtual oficial publica opciones de pago, estado de cuenta, citas, actualización de datos y factura digital. Los pasos específicos de cada tarea siguen en revisión.",
  },
  {
    id: "superservicios-citizen-guide",
    title: "Trámites ciudadanos de Superservicios",
    url: "https://www.superservicios.gov.co/Atencion-y-servicios-a-la-ciudadania/tramites-y-servicios",
    publisher: "Superintendencia de Servicios Públicos Domiciliarios",
    checked_at: "2026-10-27",
    result: "La página oficial informa que la ciudadanía puede presentar peticiones, quejas, reclamos y recursos sin costo ni intermediarios por la Ventanilla Única o puntos de atención. Los pasos de cada caso están pendientes de revisión.",
  },
  {
    id: "govco-official-channel",
    title: "Portal Único del Estado Colombiano — GOV.CO",
    url: "https://www.gov.co/",
    publisher: "Gobierno de Colombia — GOV.CO",
    checked_at: "2026-10-27",
    result: "Portal oficial consultado para encontrar trámites, servicios y entidades del Estado colombiano. Cada trámite enlazado puede tener requisitos, costos y canales propios; las guías concretas siguen en revisión.",
  },
  {
    id: "sic-consumer-guide",
    title: "Orientación oficial de protección al consumidor",
    url: "https://sedeelectronica.sic.gov.co/temas/proteccion-al-consumidor/derechos-y-deberes/denuncias-y-demandas",
    publisher: "Superintendencia de Industria y Comercio",
    checked_at: "2026-10-27",
    result: "La SIC explica los canales y diferencias entre una reclamación directa, una denuncia y una acción de protección al consumidor. El paso a paso de cada tema sigue en revisión.",
  },
];

const titles = {
  Bancos: [
    ["bbva-statement", "Consultar movimientos y extractos en BBVA", "bbva", ["extracto", "movimientos", "saldo bbva"]],
    ["bbva-certificate", "Descargar un certificado bancario de BBVA", "bbva", ["certificado", "constancia bancaria bbva"]],
    ["bbva-card-lock", "Reportar o bloquear una tarjeta BBVA", "bbva", ["bloquear tarjeta bbva", "perdí tarjeta bbva"]],
    ["bbva-payment", "Consultar cómo pagar una obligación de BBVA", "bbva", ["pagar cuota bbva", "pago crédito bbva"]],
    ["bogota-statement", "Consultar movimientos y extractos del Banco de Bogotá", "banco-bogota", ["extracto banco bogota", "saldo banco bogota"]],
    ["bogota-certificate", "Solicitar un certificado bancario al Banco de Bogotá", "banco-bogota", ["certificado banco bogota"]],
    ["bogota-card-lock", "Buscar el canal oficial para bloquear una tarjeta del Banco de Bogotá", "banco-bogota", ["bloquear tarjeta banco bogota"]],
    ["bogota-payment", "Consultar cómo pagar una obligación del Banco de Bogotá", "banco-bogota", ["pagar crédito banco bogota"]],
    ["davivienda-statement", "Consultar movimientos y extractos en Davivienda", "davivienda", ["extracto davivienda", "saldo davivienda"]],
    ["davivienda-certificate", "Solicitar un certificado bancario de Davivienda", "davivienda", ["certificado davivienda"]],
    ["davivienda-card-lock", "Reportar o bloquear una tarjeta Davivienda", "davivienda", ["bloquear tarjeta davivienda"]],
    ["davivienda-payment", "Consultar cómo pagar una obligación de Davivienda", "davivienda", ["pagar crédito davivienda"]],
    ["bancolombia-statement", "Consultar movimientos y extractos en Bancolombia", "bancolombia", ["extracto bancolombia", "saldo bancolombia"]],
    ["bancolombia-certificate", "Descargar un certificado bancario de Bancolombia", "bancolombia", ["certificado bancolombia"]],
    ["bancolombia-card-lock", "Reportar o bloquear una tarjeta Bancolombia", "bancolombia", ["bloquear tarjeta bancolombia"]],
    ["bancolombia-payment", "Consultar cómo pagar una obligación de Bancolombia", "bancolombia", ["pagar crédito bancolombia"]],
  ],
  Billeteras: [
    ["nequi-qr", "Consultar pagos con QR en Nequi", "nequi", ["pagar con qr nequi"]],
    ["nequi-cash-in", "Consultar cómo ingresar dinero a Nequi", "nequi", ["recargar nequi", "meter plata nequi"]],
    ["nequi-cash-out", "Consultar cómo retirar dinero de Nequi", "nequi", ["sacar plata nequi", "retirar nequi"]],
    ["nequi-bank-transfer", "Consultar transferencias entre Nequi y un banco", "nequi", ["pasar plata nequi a banco"]],
    ["nequi-payment-status", "Revisar un pago o transferencia pendiente en Nequi", "nequi", ["pago pendiente nequi", "transferencia pendiente nequi"]],
    ["nequi-account-recovery", "Encontrar el canal oficial de ayuda de Nequi", "nequi", ["ayuda nequi", "contactar nequi"]],
    ["movii-cash-in", "Consultar cómo recargar MOVii", "movii", ["recargar movii"]],
    ["movii-cash-out", "Consultar cómo retirar dinero de MOVii", "movii", ["retirar movii"]],
    ["movii-bill", "Buscar el canal oficial para pagar una factura con MOVii", "movii", ["pagar factura movii"]],
    ["movii-payment-status", "Revisar una transacción pendiente en MOVii", "movii", ["transacción pendiente movii"]],
    ["movii-support", "Encontrar el canal oficial de ayuda de MOVii", "movii", ["contactar movii", "ayuda movii"]],
    ["dale-recharge", "Consultar cómo ingresar dinero a dale!", "dale", ["recargar dale"]],
    ["dale-withdraw", "Consultar cómo retirar dinero de dale!", "dale", ["retirar dale"]],
    ["dale-payment", "Consultar cómo pagar con dale!", "dale", ["pagar con dale"]],
    ["dale-transfer-status", "Revisar una transferencia pendiente en dale!", "dale", ["transferencia pendiente dale"]],
    ["dale-support", "Encontrar el canal oficial de ayuda de dale!", "dale", ["contactar dale", "ayuda dale"]],
  ],
  Servicios: [
    ["afinia-duplicate", "Consultar un duplicado de la factura de Afinia", "afinia", ["duplicado factura afinia"]],
    ["afinia-outage", "Reportar una interrupción del servicio de energía a Afinia", "afinia", ["se fue la luz afinia", "reporte daño afinia"]],
    ["afinia-payment-agreement", "Preguntar a Afinia por opciones de pago de una factura", "afinia", ["acuerdo pago afinia"]],
    ["afinia-pqr", "Presentar una petición o reclamo a Afinia", "afinia", ["pqr afinia", "reclamo factura afinia"]],
    ["afinia-meter", "Consultar una lectura o consumo de energía con Afinia", "afinia", ["consumo afinia", "lectura contador afinia"]],
    ["afinia-official-channel", "Encontrar los canales oficiales de Afinia", "afinia", ["contactar afinia"]],
    ["acuacar-duplicate", "Consultar un duplicado de la factura de Aguas de Cartagena", "acuacar", ["duplicado factura acuacar"]],
    ["acuacar-debt", "Consultar el estado de cuenta de Aguas de Cartagena", "acuacar", ["deuda acuacar", "saldo acuacar"]],
    ["acuacar-digital-bill", "Afiliarse a la factura digital de Aguas de Cartagena", "acuacar", ["factura digital acuacar"]],
    ["acuacar-pqr", "Radicar o consultar una PQR en Aguas de Cartagena", "acuacar", ["pqr acuacar", "reclamo acuacar"]],
    ["acuacar-leak", "Reportar un daño o fuga a Aguas de Cartagena", "acuacar", ["fuga de agua acuacar", "daño acueducto"]],
    ["acuacar-new-service", "Consultar cómo solicitar un nuevo servicio de agua en Cartagena", "acuacar", ["nuevo servicio agua cartagena"]],
    ["surtigas-duplicate", "Descargar un duplicado de la factura de Surtigas", "surtigas", ["duplicado factura surtigas"]],
    ["surtigas-account", "Consultar el estado de cuenta de Surtigas", "surtigas", ["saldo surtigas", "estado de cuenta surtigas"]],
    ["surtigas-digital-bill", "Solicitar la factura digital de Surtigas", "surtigas", ["factura digital surtigas"]],
    ["surtigas-update", "Actualizar datos de usuario en Surtigas", "surtigas", ["actualizar datos surtigas"]],
    ["surtigas-appointment", "Agendar una cita con Surtigas", "surtigas", ["cita surtigas"]],
    ["surtigas-pqr", "Presentar una petición o reclamo a Surtigas", "surtigas", ["pqr surtigas", "reclamo surtigas"]],
  ],
  Trámites: [
    ["find-gov-procedure", "Buscar un trámite en GOV.CO", "Encontrar el portal oficial de un trámite", ["buscar trámite Colombia", "gov co trámites"]],
    ["verify-gov-entity", "Confirmar qué entidad del Estado realiza un trámite", "Verificar una entidad pública", ["entidad oficial Colombia"]],
    ["gov-requirements", "Consultar requisitos y documentos de un trámite", "Revisar requisitos oficiales", ["requisitos trámite", "documentos trámite"]],
    ["gov-cost", "Consultar si un trámite tiene costo", "Revisar el costo oficial", ["costo trámite Colombia", "trámite gratis"]],
    ["gov-appointment", "Buscar cómo agendar una cita en una entidad pública", "Agendar una cita oficial", ["cita entidad pública"]],
    ["gov-follow-up", "Consultar el estado de una solicitud con su radicado", "Hacer seguimiento a una solicitud", ["seguimiento radicado trámite"]],
    ["gov-certificate", "Buscar un certificado disponible en GOV.CO", "Consultar certificados oficiales", ["descargar certificado Colombia"]],
    ["gov-carpet", "Consultar la Carpeta Ciudadana Digital", "Encontrar servicios digitales ciudadanos", ["carpeta ciudadana digital"]],
    ["gov-sisben", "Buscar información oficial para consultar el Sisbén", "Consultar el Sisbén", ["consultar puntaje sisben", "Sisbén Colombia"]],
    ["gov-rut", "Encontrar el canal oficial para consultar o actualizar el RUT", "Consultar el RUT en la DIAN", ["actualizar rut", "consultar rut"]],
    ["gov-passport", "Buscar requisitos oficiales para solicitar un pasaporte", "Consultar trámite de pasaporte", ["sacar pasaporte Colombia"]],
    ["gov-id", "Buscar cómo solicitar un duplicado de la cédula", "Consultar trámite de identificación", ["duplicado cédula"]],
    ["gov-criminal-record", "Encontrar el canal oficial para consultar antecedentes", "Consultar antecedentes oficiales", ["antecedentes Colombia"]],
    ["gov-property-certificate", "Buscar el canal oficial para un certificado de tradición", "Consultar un certificado de inmueble", ["certificado tradición libertad"]],
    ["gov-driver-license", "Consultar requisitos oficiales para una licencia de conducción", "Consultar un trámite de tránsito", ["licencia conducir Colombia"]],
    ["gov-vehicle", "Encontrar un trámite de vehículo en el RUNT", "Consultar trámites de vehículo", ["trámite vehículo RUNT"]],
    ["gov-dian-appointment", "Buscar cómo solicitar atención o una cita ante la DIAN", "Contactar a la DIAN", ["cita DIAN"]],
    ["gov-pqrs", "Encontrar el canal oficial para presentar una PQR a una entidad pública", "Presentar una petición ciudadana", ["PQR entidad pública"]],
  ],
  Comercios: [
    ["sic-warranty", "Consultar cómo pedir garantía por un producto defectuoso", "Reclamar por garantía", ["garantía producto Colombia"]],
    ["sic-delivery", "Consultar qué hacer si un pedido no llega", "Reclamar por una entrega", ["pedido no llegó", "no entregaron compra"]],
    ["sic-online-purchase", "Revisar derechos al comprar por internet", "Comprar por internet con confianza", ["compra online segura Colombia"]],
    ["sic-withdrawal", "Consultar si aplica el derecho de retracto en una compra", "Revisar el derecho de retracto", ["devolver compra por internet"]],
    ["sic-price", "Reclamar si el precio cobrado es distinto al anunciado", "Revisar el precio de una compra", ["precio diferente caja"]],
    ["sic-fake-ad", "Consultar cómo actuar ante información engañosa de un comercio", "Reportar información engañosa", ["publicidad engañosa Colombia"]],
    ["sic-invoice", "Solicitar una factura o soporte de una compra", "Buscar el soporte de una compra", ["factura de compra"]],
    ["sic-complaint", "Presentar primero una reclamación directa a un comercio", "Reclamar directamente al proveedor", ["reclamo comercio"]],
    ["sic-complaint-followup", "Consultar qué hacer si el comercio no responde", "Hacer seguimiento a un reclamo", ["comercio no responde"]],
    ["sic-commerce-demand", "Distinguir entre denuncia y demanda de protección al consumidor", "Elegir el canal de protección al consumidor", ["denuncia demanda SIC"]],
    ["sic-refund", "Consultar opciones si solicitas la devolución de dinero", "Preguntar por devolución de dinero", ["devolución dinero compra"]],
    ["sic-repair", "Consultar cómo pedir reparación por garantía", "Solicitar reparación por garantía", ["reparación producto garantía"]],
    ["sic-replacement", "Consultar cómo solicitar cambio de un producto en garantía", "Pedir cambio por garantía", ["cambiar producto dañado"]],
    ["sic-ecommerce-platform", "Consultar derechos al comprar en una plataforma digital", "Usar una plataforma de comercio electrónico", ["reclamar marketplace Colombia"]],
    ["sic-service", "Consultar cómo reclamar por un servicio comercial", "Reclamar por un servicio", ["reclamo servicio comercio"]],
    ["sic-terms", "Revisar información y condiciones antes de comprar", "Leer condiciones de compra", ["condiciones compra Colombia"]],
    ["sic-subscription", "Consultar cómo pedir ayuda con una compra recurrente", "Revisar una suscripción comercial", ["cancelar suscripción comercio"]],
    ["sic-fraud", "Encontrar orientación oficial ante una compra sospechosa", "Orientarse ante un posible fraude de compra", ["estafa compra SIC"]],
    ["sic-official-contact", "Encontrar los canales oficiales de protección al consumidor", "Contactar a la SIC", ["contacto SIC Colombia"]],
  ],
};

const sourceByEntity = {
  bbva: "bbva-official-channel",
  "banco-bogota": "banco-bogota-official-channel",
  davivienda: "davivienda-official-channel",
  bancolombia: "bancolombia-transfer-guide",
  nequi: "nequi-send-guide",
  movii: "movii-official-channel",
  dale: "dale-official-channel",
  afinia: "afinia-channels",
  acuacar: "acuacar-official-channel",
  surtigas: "surtigas-official-channel",
  govco: "govco-official-channel",
  sic: "sic-consumer-guide",
};

export function makeCandidateGuides() {
  return Object.entries(titles).flatMap(([category, entries]) =>
    entries.map(([slug, title, requestedEntity, aliases]) => {
      const entityId = category === "Trámites" ? "govco" : category === "Comercios" ? "sic" : requestedEntity;
      const sourceId = sourceByEntity[entityId];
      const draftDescription = category === "Servicios"
        ? `Tema propuesto para ${entityId === "acuacar" ? "Cartagena" : "el proveedor indicado"}. La cobertura y los canales cambian según la ciudad; confirma primero tu prestador en su portal oficial.`
        : category === "Trámites"
          ? "Tema propuesto para encontrar y seguir un trámite público en Colombia. Cada entidad define sus propios requisitos, costos y tiempos; consulta la ficha oficial antes de actuar."
          : category === "Comercios"
            ? "Tema propuesto sobre compras y derechos del consumidor en Colombia. Los pasos concretos dependen del caso y deben confirmarse en la orientación oficial de la SIC."
            : `Tema propuesto para ${entityId === "banco-bogota" ? "Banco de Bogotá" : entityId === "bbva" ? "BBVA Colombia" : entityId === "bancolombia" ? "Bancolombia" : entityId === "davivienda" ? "Davivienda" : entityId === "dale" ? "dale!" : entityId === "movii" ? "MOVii" : "Nequi"}. El flujo actual todavía debe revisarse en el canal oficial.`;
      return {
        id: `candidato-${slug}`,
        entity_id: entityId,
        title,
        task: category === "Bancos" ? "Consultar un servicio bancario" : category === "Billeteras" ? "Consultar una billetera digital" : category === "Servicios" ? "Consultar un servicio público" : category === "Trámites" ? "Encontrar un trámite en Colombia" : "Consultar derechos en una compra",
        description: draftDescription,
        preparation: "Propuesta de guía en revisión: aún no contiene un paso a paso comprobado. No compartas claves, códigos de seguridad ni datos de pago en Autonomía Dorada. Abre el enlace oficial para consultar el procedimiento vigente.",
        status: "pending",
        updated_at: null,
        source_id: sourceId,
        common_errors: ["No sigas enlaces de anuncios ni intermediarios que pidan pagos o claves.", "La guía continúa en revisión; confirma costos, requisitos y disponibilidad directamente con la entidad."],
        aliases: [...new Set([title.toLowerCase(), ...aliases])],
      };
    }),
  );
}
