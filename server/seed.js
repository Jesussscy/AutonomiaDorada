import { expandCatalog } from './catalog-expansion.js';
import "dotenv/config";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { candidateEntities, candidateSources, makeCandidateGuides } from "./guide-candidates.js";

const dbPath = path.resolve(
  process.env.DATABASE_PATH || "./data/prueba1.sqlite",
);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);
db.exec(fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
db.pragma("foreign_keys = ON");

const entities = [
  { id: "salud", name: "Salud y atención médica", category: "Salud", icon: "+", note: "Guías oficiales de afiliación, citas y orientación en salud." },
  { id: "salud-mental", name: "Salud mental", category: "Salud mental", icon: "♥", note: "Orientación oficial y rutas de apoyo psicológico." },
  { id: "bienestar-fisico", name: "Bienestar físico", category: "Bienestar físico", icon: "+", note: "Prevención, vacunación y autocuidado con orientación oficial." },
  { id: "rutas-salud", name: "Salud y atención médica", category: "Salud", icon: "+", note: "Afiliación, citas y canales oficiales de atención ciudadana." },
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
entities.push(...candidateEntities);

// These public-service entries are evidence-led guide topics under an authority,
// not claims that Minsalud, INS, ADRES or Supersalud provides clinical care.
const evidenceLedHealthTopics = [
  ["salud-mental", "Apoyo emocional por la Línea Nacional 106", "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx", "Orientación inicial; no es consulta clínica ni reemplaza urgencias."],
  ["salud-mental", "Encontrar una línea de salud mental en mi territorio", "https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/ET/directorio-salud-mental-prevencion-suicidio-minsalud.pdf", "Directorio territorial publicado por Minsalud; confirma vigencia y cobertura local."],
  ["salud-mental", "Pedir apoyo psicológico continuo por mi EPS", "https://www.adres.gov.co/tramites/ciudadania/consulta-afiliacion", "ADRES identifica la EPS reportada; pregunta a la EPS por el canal y opciones vigentes."],
  ["salud-mental", "Buscar orientación emocional en Cartagena", "https://cartagena.gov.co/noticias/cartagena-el-primer-ente-territorial-pais-mesa-permanente-para-prevencion-conducta-suicida", "Publicación distrital reporta línea local 125 y la nacional 106; comprueba disponibilidad al llamar."],
  ["salud-mental", "Acompañar a alguien que expresa desesperanza", "https://www.ins.gov.co/Noticias/Paginas/Prevenir-el-suicidio-es-posible%2C-reconoce-las-se%C3%B1ales%2C-pregunta-y-busca-ayuda-a-tiempo.aspx", "Orientación preventiva del INS; ante riesgo inmediato solicita ayuda urgente."],
  ["salud-mental", "Reconocer cuándo buscar apoyo en salud mental", "https://www.minsalud.gov.co/salud/publica/salud-mental", "Información pública de Minsalud; no permite autodiagnosticarse."],
  ["salud-mental", "Pedir atención de salud mental en una situación urgente", "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx", "La línea ofrece orientación inicial. Ante peligro inmediato ve a urgencias o llama al servicio local."],
  ["salud-mental", "Consultar información pública sobre conducta suicida", "https://www.ins.gov.co/Paginas/salud-mental.aspx", "El INS publica análisis y recursos poblacionales; no brinda tratamiento individual."],
  ["salud-mental", "Preguntar a mi EPS por psicología o psiquiatría", "https://www.minsalud.gov.co/salud/publica/salud-mental", "Consulta a la EPS por disponibilidad, remisión y requisitos según tu afiliación."],
  ["salud-mental", "Pedir orientación emocional para quien cuida", "https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx", "Canal de orientación inicial; pregunta a la EPS por apoyo continuado."],
  ["bienestar-fisico", "Consultar vacunas recomendadas para personas mayores", "https://vacunacion.minsalud.gov.co/EV/Paginas/adultos-mayores.aspx", "Revisa la orientación nacional y confirma pertinencia individual con personal de salud."],
  ["bienestar-fisico", "Consultar la información oficial del PAI", "https://vacunacion.minsalud.gov.co/", "Portal oficial de vacunación; punto, horario y disponibilidad se confirman localmente."],
  ["bienestar-fisico", "Pedir una cita odontológica por mi EPS", "https://www.minsalud.gov.co/Normatividad_Nuevo/Bolet%C3%ADn%20Jur%C3%ADdico%20No.%20005%20de%20Mayo%202025.pdf", "Solicítala a tu EPS por un canal oficial; la orientación ministerial señala plazo para odontología general."],
  ["bienestar-fisico", "Consultar cuidados de salud bucal en la edad adulta", "https://www2.minsalud.gov.co/salud/publica/HS/Paginas/salud-bucal.aspx", "Recomendaciones generales del Ministerio; consulta al odontólogo sobre tu caso."],
  ["bienestar-fisico", "Consultar cómo cuidar prótesis dentales", "https://www2.minsalud.gov.co/salud/publica/HS/Paginas/salud-bucal.aspx", "Guía pública general; pide a tu odontólogo instrucciones compatibles con tu prótesis."],
  ["bienestar-fisico", "Consultar actividad física recomendada para mayores de 60", "https://www2.minsalud.gov.co/salud/Paginas/Actividad-F%C3%ADsica.aspx", "Minsalud publica recomendaciones poblacionales; adapta actividad a capacidad y condición de salud."],
  ["bienestar-fisico", "Consultar orientación para envejecimiento y vejez", "https://www.minsalud.gov.co/Proteccion-Social/promocion-social/Paginas/envejecimiento-vejez.aspx", "Información pública sobre envejecimiento saludable y derechos."],
  ["bienestar-fisico", "Consultar hábitos de prevención en salud", "https://www.minsalud.gov.co/salud/publica/Paginas/salud-publica.aspx", "Información poblacional; no reemplaza recomendaciones profesionales individuales."],
  ["bienestar-fisico", "Consultar salud bucal, visual y auditiva", "https://www2.minsalud.gov.co/salud/publica/HS/Paginas/salud-bucal-visual-auditiva.aspx", "Orientación de salud pública y prevención; valoración individual por personal de salud."],
  ["bienestar-fisico", "Entender qué es el triage en urgencias", "https://www.minsalud.gov.co/salud/prestacion-servicios/Paginas/triage.aspx", "El triage lo realiza el equipo de salud; no retrases la atención si es una emergencia."],
  ["rutas-salud", "Consultar la EPS que reporta mi afiliación", "https://www.adres.gov.co/tramites/ciudadania/consulta-afiliacion", "Consulta gratuita BDUA; no equivale a certificado y puede reflejar cambios con demora."],
  ["rutas-salud", "Solicitar una cita de medicina general", "https://www.minsalud.gov.co/Normatividad_Nuevo/Bolet%C3%ADn%20Jur%C3%ADdico%20No.%20005%20de%20Mayo%202025.pdf", "Solicítala a la EPS; el canal y disponibilidad se confirman con la propia entidad."],
  ["rutas-salud", "Preguntar por una consulta de especialista", "https://www.minsalud.gov.co/Normatividad_Nuevo/Bolet%C3%ADn%20Jur%C3%ADdico%20No.%20005%20de%20Mayo%202025.pdf", "La EPS confirma remisión, autorización y asignación según el caso."],
  ["rutas-salud", "Solicitar atención psicológica por la EPS", "https://www.minsalud.gov.co/salud/publica/salud-mental", "Pregunta directamente a la EPS por la ruta, el prestador de la red y los requisitos."],
  ["rutas-salud", "Consultar cómo se asignan las citas médicas", "https://www.minsalud.gov.co/Normatividad_Nuevo/Bolet%C3%ADn%20Jur%C3%ADdico%20No.%20005%20de%20Mayo%202025.pdf", "Orientación normativa general; la gestión de citas es responsabilidad de la EPS."],
  ["rutas-salud", "Consultar las rutas integrales de atención", "https://www.minsalud.gov.co/salud/publica/ssr/paginas/rutas-integrales-de-atencion-en-salud-rias.aspx", "Información nacional de promoción, prevención y atención; consulta tu EPS para una ruta individual."],
  ["rutas-salud", "Pedir orientación sobre una autorización de salud", "https://www.minsalud.gov.co/salud/publica/salud-mental", "La EPS confirma si aplica autorización en tu caso y dónde tramitarla."],
  ["rutas-salud", "Consultar cómo presentar una PQRD en salud", "https://www.supersalud.gov.co/es-co/atencion-ciudadano/contactenos", "Presenta primero el reclamo a la EPS y conserva el radicado; después puedes acudir a Supersalud."],
  ["rutas-salud", "Consultar la red de atención de mi EPS", "https://www.adres.gov.co/tramites/ciudadania/consulta-afiliacion", "ADRES identifica tu EPS; la red, cobertura y disponibilidad las confirma tu EPS."],
  ["rutas-salud", "Consultar qué hacer ante una necesidad urgente", "https://www.minsalud.gov.co/salud/prestacion-servicios/Paginas/triage.aspx", "La clasificación la hace el personal de salud; ante una emergencia ve a urgencias."],
];

const evidenceLedHealthEntities = evidenceLedHealthTopics.map(([category, title, url, result], index) => {
  const id = `orientacion-${category}-${index + 1}`;
  return {
    guide: {
      id: `${id}-guide`, entity_id: category, title, task: category === "salud-mental" ? "Buscar orientación en salud mental" : category === "bienestar-fisico" ? "Consultar bienestar y prevención" : "Consultar una ruta de salud",
      description: result, preparation: "Abre el recurso institucional enlazado y confirma directamente con la entidad cualquier disponibilidad o paso que dependa de tu caso.",
      status: "pending", updated_at: "2026-10-26", source_id: id,
      common_errors: ["Esta orientación no es una valoración médica ni un diagnóstico.", "Ante una urgencia, no esperes una guía web: busca atención de urgencias."], aliases: [title.toLowerCase()],
    },
    source: { id, title, url, publisher: category === "salud-mental" && url.includes("cartagena.gov.co") ? "Alcaldía Mayor de Cartagena de Indias — DADIS" : url.includes("adres.gov.co") ? "ADRES" : url.includes("ins.gov.co") ? "Instituto Nacional de Salud" : "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result },
  };
});

const sources = [
  {
    id: "nequi-send-guide",
    title: "¿Cómo enviar plata a otro Nequi?",
    url: "https://ayuda.nequi.com.co/hc/es/articles/35293860820493--C%C3%B3mo-enviar-plata-a-otro-Nequi",
    publisher: "Centro de ayuda Nequi",
    checked_at: "2026-10-26",
    result:
      "Página oficial HTTPS. Instrucciones revisadas en la consulta de 2026-10-28.",
  },
  {
    id: "nequi-public-bill-guide",
    title: "¿Cómo pagar servicios públicos en línea con Nequi?",
    url: "https://ayuda.nequi.com.co/hc/es/articles/33955587381389--C%C3%B3mo-pagar-servicios-p%C3%BAblicos-en-l%C3%ADnea-con-Nequi",
    publisher: "Centro de ayuda Nequi",
    checked_at: "2026-10-26",
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
    id: "adres-eps-consult",
    title: "Consulte su EPS (Afiliación en la BDUA)",
    url: "https://www.adres.gov.co/tramites/ciudadania/consulta-afiliacion",
    publisher: "ADRES",
    checked_at: "2026-10-26",
    result: "Trámite oficial, gratuito y virtual. Muestra la información reportada a la BDUA; si hay diferencias, deben aclararse con la EPS. No funciona como certificado de afiliación.",
  },
  { id: "minsalud-adult-vaccines", title: "Vacunación para personas adultas mayores", url: "https://vacunacion.minsalud.gov.co/EV/Paginas/adultos-mayores.aspx", publisher: "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result: "Esquema y orientación oficial para adultos mayores; las decisiones particulares deben consultarse con personal de salud." },
  { id: "minsalud-general-health", title: "Información pública de salud", url: "https://www.minsalud.gov.co/salud/publica/Paginas/salud-publica.aspx", publisher: "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result: "Portal institucional de información y programas de salud pública; no ofrece diagnóstico individual." },
  { id: "minsalud-aging", title: "Envejecimiento y vejez", url: "https://www.minsalud.gov.co/Proteccion-Social/promocion-social/Paginas/envejecimiento-vejez.aspx", publisher: "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result: "Orientación y política pública de envejecimiento saludable y vejez digna; no sustituye atención médica." },
  { id: "minsalud-activity", title: "Actividad física para personas mayores", url: "https://www.minsalud.gov.co/salud/publica/HS/Paginas/actividad-fisica.aspx", publisher: "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result: "Recomendaciones públicas; adapta cualquier actividad a tus capacidades y consulta si tienes dudas de salud." },
  { id: "minsalud-oral-health", title: "Salud bucal en personas adultas y mayores", url: "https://minsalud.gov.co/salud/publica/HS/Paginas/salud-bucal.aspx", publisher: "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result: "Orientación general de autocuidado y consulta odontológica." },
  { id: "minsalud-triage", title: "Orientación oficial sobre triage en urgencias", url: "https://www.minsalud.gov.co/salud/prestacion-servicios/Paginas/triage.aspx", publisher: "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result: "Explica la clasificación clínica en urgencias. No uses esta información para retrasar la atención ante una emergencia." },
  { id: "ins-health", title: "Instituto Nacional de Salud — salud pública", url: "https://www.ins.gov.co/", publisher: "Instituto Nacional de Salud", checked_at: "2026-10-26", result: "Información de vigilancia y prevención en salud pública; no presta consultas ni agenda citas." },
  { id: "minsalud-pai", title: "Programa Ampliado de Inmunizaciones", url: "https://vacunacion.minsalud.gov.co/", publisher: "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result: "Portal oficial PAI para orientación sobre vacunación y lineamientos nacionales." },
  {
    id: "minsalud-appointments",
    title: "Información oficial sobre asignación de citas médicas",
    url: "https://www.minsalud.gov.co/Normatividad_Nuevo/Bolet%C3%ADn%20Jur%C3%ADdico%20No.%20005%20de%20Mayo%202025.pdf",
    publisher: "Ministerio de Salud y Protección Social",
    checked_at: "2026-10-26",
    result: "El Ministerio indica que la EPS debe recibir y asignar citas, con plazos normativos específicos. El canal y la documentación varían por EPS; usar sus canales oficiales actuales.",
  },
  {
    id: "minsalud-mental-106",
    title: "Línea Nacional de Salud Mental 106",
    url: "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx",
    publisher: "Ministerio de Salud y Protección Social",
    checked_at: "2026-10-26",
    result: "La página oficial describe la Línea 106 como orientación y apoyo inicial en salud mental, gratuita, confidencial y disponible 24/7, y ofrece directorio de líneas territoriales. Para Cartagena, la Alcaldía y DADIS reportan además la línea 125 del CRUED como canal de escucha y orientación 24/7; confirma alcance y disponibilidad al llamar.",
  },
  { id: "minsalud-mental-overview", title: "Información oficial de salud mental", url: "https://www.minsalud.gov.co/salud/publica/salud-mental", publisher: "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result: "Información pública de promoción y salud mental; no reemplaza una valoración profesional." },
  { id: "minsalud-mental-directory", title: "Directorio nacional de líneas territoriales de salud mental", url: "https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/ET/directorio-salud-mental-prevencion-suicidio-minsalud.pdf", publisher: "Ministerio de Salud y Protección Social", checked_at: "2026-10-26", result: "Consulta el territorio y verifica disponibilidad y vigencia del número antes de llamar." },
  { id: "ins-mental-health", title: "Orientación del Instituto Nacional de Salud sobre salud mental", url: "https://www.ins.gov.co/Paginas/Salud-Mental.aspx", publisher: "Instituto Nacional de Salud", checked_at: "2026-10-26", result: "Publica información de orientación y apoyo; la atención individual debe gestionarse con la EPS o la línea territorial." },
  { id: "ins-suicide-prevention", title: "Prevención del suicidio — Instituto Nacional de Salud", url: "https://www.ins.gov.co/Noticias/Paginas/Prevenir-el-suicidio-es-posible%2C-reconoce-las-se%C3%B1ales%2C-pregunta-y-busca-ayuda-a-tiempo.aspx", publisher: "Instituto Nacional de Salud", checked_at: "2026-10-26", result: "Información pública de prevención; en peligro inmediato busca urgencias o emergencias locales." },
  { id: "cartagena-mental-support", title: "Orientación de salud mental en Cartagena", url: "https://cartagena.gov.co/noticias/torre-reloj-cartagena-iluminara-purpura-dorado-este-9-10-septiembre", publisher: "Alcaldía Mayor de Cartagena de Indias — DADIS", checked_at: "2026-10-26", result: "La publicación distrital reporta líneas de atención locales; confirma vigencia y cobertura al abrir el canal." },
  {
    id: "cartagena-dadis-mental-lines",
    title: "Líneas distritales de atención en salud mental de Cartagena",
    url: "https://cartagena.gov.co/noticias/cartagena-el-primer-ente-territorial-pais-mesa-permanente-para-prevencion-conducta-suicida",
    publisher: "Alcaldía Mayor de Cartagena de Indias — DADIS",
    checked_at: "2026-10-26",
    result: "Publicación institucional del 20 de junio de 2025. Reporta las líneas 125 (CRUED Cartagena) y 106 (nacional), con atención 24/7. Verifica el canal al abrir la publicación; ante una emergencia acude directamente a urgencias.",
  },
  {
    id: "minsalud-oral-health-detail",
    title: "Cuidado de la salud bucal en personas adultas y mayores",
    url: "https://www2.minsalud.gov.co/salud/publica/HS/Paginas/salud-bucal.aspx",
    publisher: "Ministerio de Salud y Protección Social",
    checked_at: "2026-10-26",
    result: "Fuente oficial con recomendaciones para higiene oral, cuidado de prótesis y consulta odontológica; no ofrece valoración clínica personalizada.",
  },
  {
    id: "supersalud-pqrd",
    title: "Canales de atención y PQRD de la Supersalud",
    url: "https://www.supersalud.gov.co/es-co/atencion-ciudadano/contactenos",
    publisher: "Superintendencia Nacional de Salud",
    checked_at: "2026-10-26",
    result: "Página oficial de canales ciudadanos y seguimiento. La orientación institucional recomienda radicar primero la queja ante la EPS y acudir a Supersalud si persiste la falta de solución.",
  },
  {
    id: "adres-sat",
    title: "Sistema de Afiliación Transaccional — Mi Seguridad Social",
    url: "https://www.miseguridadsocial.gov.co/",
    publisher: "Ministerio de Salud y Protección Social",
    checked_at: "2026-10-26",
    result: "Portal oficial para trámites de afiliación. ADRES remite al SAT para novedades; verificar requisitos y disponibilidad directamente en el portal.",
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
sources.push(...evidenceLedHealthEntities.map(({ source }) => source));
sources.push(...candidateSources);

const guides = [
  {
    id: "adres-eps-consult-guide", entity_id: "rutas-salud", title: "Consultar a qué EPS estoy afiliado", task: "Consultar mi salud", description: "Consulta gratuitamente la EPS que figura en la BDUA de ADRES. Si necesitas un certificado formal o encuentras diferencias, comunícate con tu EPS.", preparation: "Ten a mano tu tipo y número de documento. Escríbelos únicamente en el portal oficial de ADRES, no en esta aplicación.", status: "verified", updated_at: "2026-10-26", source_id: "adres-eps-consult", common_errors: ["La consulta refleja lo reportado por las EPS y puede no coincidir con un cambio reciente. Confirma las diferencias con tu EPS.", "ADRES muestra un reporte, no expide el certificado de afiliación."], aliases: ["consultar eps", "qué eps tengo", "afiliación", "afiliacion", "mi eps", "eps activa"]
  },
  {
    id: "eps-appointment-guide", entity_id: "rutas-salud", title: "Solicitar una cita médica en mi EPS", task: "Solicitar una cita médica", description: "Cada EPS tiene sus propios canales y requisitos. Este recorrido te ayuda a encontrar el canal oficial, pedir la cita y guardar el soporte de la solicitud.", preparation: "Ten a mano tu documento y los datos que tu EPS solicite. No los compartas en esta aplicación. Si es una urgencia, busca atención de urgencias; no esperes una cita programada.", status: "verified", updated_at: "2026-10-26", source_id: "minsalud-appointments", common_errors: ["No encuentras el canal: confirma el nombre de tu EPS en ADRES y entra al sitio desde un resultado oficial.", "No te dan solución: conserva el número de radicado y presenta una PQR ante tu EPS; si persiste, contacta a Supersalud."], aliases: ["cita medica", "cita médica", "cita general", "cita especialista", "pedir cita", "agendar cita", "solicitar cita", "doctor", "doctora", "medico", "médico"]
  },
  {
    id: "eps-appointment-rights-guide", entity_id: "rutas-salud", title: "Conocer el plazo para que me asignen una cita", task: "Conocer mis derechos en salud", description: "El Ministerio de Salud informa que la EPS debe recibir la solicitud de cita de medicina general u odontología y comunicar una fecha. La agenda y los requisitos de cada servicio se confirman con la EPS.", preparation: "Ten presente la fecha en que pediste la cita y conserva el radicado o soporte que te entregue la EPS.", status: "verified", updated_at: "2026-10-26", source_id: "minsalud-appointments", common_errors: ["No es un sistema para consultar disponibilidad: tu EPS confirma la fecha y el canal.", "La orientación general no reemplaza una atención urgente."], aliases: ["demora cita eps", "cuanto se demora cita medica", "plazo cita general", "3 dias cita", "cita demora", "tiempo para cita"]
  },
  {
    id: "mental-health-line-guide", entity_id: "salud-mental", title: "Pedir orientación emocional o psicológica", task: "Buscar apoyo en salud mental", description: "La Línea Nacional 106 brinda orientación y apoyo inicial en salud mental. También puedes solicitar atención por tu EPS o buscar una línea territorial oficial.", preparation: "Puedes llamar desde un teléfono fijo o celular. No necesitas contar aquí lo que te sucede. Si hay peligro inmediato, ve a urgencias o llama al número de emergencias de tu territorio.", status: "verified", updated_at: "2026-10-26", source_id: "minsalud-mental-106", common_errors: ["Si la línea no conecta desde tu territorio, consulta el directorio de líneas territoriales del Ministerio.", "La orientación inicial no reemplaza una valoración clínica ni la atención de emergencia."], aliases: ["psicologia", "psicología", "psicologo", "psicóloga", "ayuda emocional", "salud mental", "crisis emocional", "ansiedad", "depresion", "depresión", "sentirme mal", "hablar con alguien", "orientacion psicologica"]
  },
  ...[
    ["depression", "Depresión y bienestar emocional", "https://www.minsalud.gov.co/salud/publica/SMental/Paginas/convivencia-desarrollo-humano-sustancias-psicoactivas.aspx", "Busca información pública y pide orientación profesional; no uses una guía web para autodiagnosticarte.", ["depresion", "depresión", "triste", "ánimo"]],
    ["anxiety", "Ansiedad y manejo del estrés", "https://www.minsalud.gov.co/salud/publica/SMental/Paginas/convivencia-desarrollo-humano-sustancias-psicoactivas.aspx", "Consulta recursos oficiales y solicita orientación en tu EPS o Línea 106.", ["ansiedad", "estres", "estrés", "preocupacion"]],
    ["grief", "Duelo y pérdida", "https://www.ins.gov.co/Paginas/Salud-Mental.aspx", "El INS ofrece orientación pública y remite a la Línea 106; para apoyo continuo consulta tu EPS.", ["duelo", "perdida", "pérdida", "fallecimiento"]],
    ["caregiver", "Apoyo emocional para quien cuida", "https://www.ins.gov.co/Paginas/Salud-Mental.aspx", "La Línea 106 ofrece orientación; consulta a tu EPS por opciones de acompañamiento continuado.", ["cuidador", "cuidadora", "cuidar a alguien", "agotamiento"]],
    ["family", "Orientación para relaciones familiares", "https://www.minsalud.gov.co/salud/publica/SMental/Paginas/convivencia-desarrollo-humano-sustancias-psicoactivas.aspx", "Para acompañamiento psicológico personal, consulta tu EPS; ante crisis está la Línea 106.", ["familia", "problemas familiares", "relaciones", "convivencia"]],
    ["crisis", "Qué hacer si alguien atraviesa una crisis emocional", "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx", "Llama al 106 para orientación. Si hay riesgo inmediato, acude a urgencias o al servicio de emergencia local.", ["crisis", "urgente", "en riesgo", "crisis emocional"]],
    ["suicide", "Prevención del suicidio y cómo pedir ayuda", "https://www.ins.gov.co/Noticias/Paginas/Prevenir-el-suicidio-es-posible%2C-reconoce-las-se%C3%B1ales%2C-pregunta-y-busca-ayuda-a-tiempo.aspx", "El INS informa la Línea 106. Si existe peligro inminente, busca urgencias de inmediato.", ["suicidio", "hacerme daño", "quitarme la vida", "no quiero vivir"]],
    ["territorial", "Encontrar una línea de atención en mi departamento", "https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/ET/directorio-salud-mental-prevencion-suicidio-minsalud.pdf", "Consulta el directorio nacional y confirma cobertura y horario territorial.", ["linea local", "línea local", "mi departamento", "linea regional"]],
  ].map(([slug, title, url, description, aliases]) => ({
    id: `mental-topic-${slug}`, entity_id: "salud-mental", title, task: "Orientación en salud mental", description,
    preparation: "Esta información orienta y no reemplaza evaluación, tratamiento ni atención de urgencia.", status: "verified", updated_at: "2026-10-26", source_id: slug === "grief" || slug === "caregiver" ? "ins-mental-health" : slug === "suicide" ? "ins-suicide-prevention" : slug === "territorial" ? "minsalud-mental-directory" : "minsalud-mental-overview",
    common_errors: ["Si necesitas atención individual, contacta tu EPS.", "Si existe riesgo inmediato, acude a urgencias o llama al servicio local de emergencias."], aliases,
  })),
  ...[
    ["vaccination", "Consultar vacunas recomendadas para personas mayores", "https://vacunacion.minsalud.gov.co/EV/Paginas/adultos-mayores.aspx", "Consulta el esquema oficial y confirma con vacunación o personal médico qué corresponde a tu caso.", ["vacunas adulto mayor", "vacuna", "vacunacion", "influenza", "covid"]],
    ["prevention", "Encontrar información oficial de prevención en salud", "https://www.minsalud.gov.co/salud/publica/Paginas/salud-publica.aspx", "El Ministerio publica programas y recomendaciones; consulta a profesionales para decisiones individuales.", ["prevencion", "prevenir enfermedades", "salud publica"]],
    ["ins", "Consultar información del Instituto Nacional de Salud", "https://www.ins.gov.co/", "El INS publica información de salud pública. No presta consultas clínicas ni asigna citas.", ["instituto nacional de salud", "ins colombia", "vigilancia salud"]],
    ["pai", "Consultar el programa nacional de vacunación PAI", "https://vacunacion.minsalud.gov.co/", "Revisa información oficial del PAI y consulta a tu punto de vacunación para confirmar horarios y disponibilidad.", ["pai", "programa vacunacion", "punto vacunacion"]],
    ["triage", "Entender cómo se prioriza la atención en urgencias", "https://www.minsalud.gov.co/salud/prestacion-servicios/Paginas/triage.aspx", "El triage lo realiza el personal de salud; si hay una emergencia, busca atención inmediata.", ["triage", "prioridad urgencias", "clasificacion urgencias"]],
    ["healthy-aging", "Consultar orientación para el envejecimiento saludable", "https://www.minsalud.gov.co/Proteccion-Social/promocion-social/Paginas/envejecimiento-vejez.aspx", "Información pública de derechos, envejecimiento saludable y vejez digna.", ["envejecimiento saludable", "adulto mayor salud", "vejez saludable"]],
    ["healthy-habits", "Consultar recomendaciones de actividad física", "https://www.minsalud.gov.co/salud/publica/HS/Paginas/actividad-fisica.aspx", "Adapta la actividad a tus capacidades y consulta a un profesional si tienes dudas.", ["autocuidado", "habitos saludables", "actividad fisica"]],
    ["oral-health", "Consultar orientación de salud bucal", "https://minsalud.gov.co/salud/publica/HS/Paginas/salud-bucal.aspx", "Información de autocuidado y cuándo consultar odontología.", ["salud bucal adulto mayor", "cuidado dental", "odontología"]],
    ["appointments-info", "Conocer orientación oficial sobre citas médicas", "https://www.minsalud.gov.co/Normatividad_Nuevo/Bolet%C3%ADn%20Jur%C3%ADdico%20No.%20005%20de%20Mayo%202025.pdf", "Consulta la orientación normativa y solicita la cita por los canales vigentes de tu EPS.", ["tiempo cita medica", "derecho a cita", "citas eps"]],
    ["find-eps", "Consultar cuál EPS reporta mi afiliación", "https://www.adres.gov.co/tramites/ciudadania/consulta-afiliacion", "ADRES muestra lo reportado por las EPS en la BDUA. No expide certificados de afiliación.", ["buscar eps", "eps afiliado", "ver eps"]],
  ].map(([slug, title, sourceUrl, description, aliases]) => ({
    id: `physical-topic-${slug}`, entity_id: "bienestar-fisico", title, task: "Salud y bienestar físico", description,
    preparation: "Los recursos enlazan información pública oficial. No constituyen diagnóstico ni recomendación médica personalizada.", status: "verified", updated_at: "2026-10-26", source_id: slug === "vaccination" ? "minsalud-adult-vaccines" : slug === "pai" ? "minsalud-pai" : slug === "ins" ? "ins-health" : slug === "triage" ? "minsalud-triage" : slug === "healthy-aging" ? "minsalud-aging" : slug === "healthy-habits" ? "minsalud-activity" : slug === "oral-health" ? "minsalud-oral-health" : slug === "appointments-info" ? "minsalud-appointments" : slug === "find-eps" ? "adres-eps-consult" : "minsalud-general-health",
    common_errors: ["La información general no reemplaza la valoración de tu profesional de salud.", "Verifica si necesitas atención de urgencia y consulta directamente a tu EPS o al prestador."], aliases,
  })),
  {
    id: "mental-health-eps-guide", entity_id: "salud-mental", title: "Buscar atención psicológica por mi EPS", task: "Solicitar atención psicológica", description: "Pide orientación a tu EPS para conocer la ruta y los profesionales disponibles dentro de tu red. Los pasos concretos dependen de cada EPS.", preparation: "Ten a mano tus datos de afiliación y pregunta por canales de salud mental o psicología. No compartas datos personales en esta guía.", status: "verified", updated_at: "2026-10-26", source_id: "minsalud-appointments", common_errors: ["Pregunta a la EPS si requiere remisión, autorización o una cita inicial; los requisitos dependen de tu caso y de la red disponible.", "Si necesitas hablar ahora o hay crisis, llama a la Línea 106; no esperes la asignación de una cita."], aliases: ["cita psicologia eps", "cita psicologo eps", "terapia eps", "psicologo por eps", "psicóloga por eps", "atencion psicologica", "atención psicológica", "psiquiatria"]
  },
  {
    id: "eps-specialist-route", entity_id: "rutas-salud", title: "Preguntar por una cita con especialista", task: "Pedir cita con especialista", description: "Consulta a tu EPS si necesitas remisión o autorización y cómo pedir una cita con la especialidad que te indicaron.", preparation: "Ten la orden médica, si ya te la entregaron. Confirma requisitos y opciones disponibles directamente con tu EPS.", status: "verified", updated_at: "2026-10-26", source_id: "minsalud-appointments", common_errors: ["La remisión y autorización dependen del servicio y tu caso; pregunta a la EPS.", "La cita, cobertura y disponibilidad las confirma tu EPS."], aliases: ["cita especialista", "cita con especialista", "remision especialista", "autorizacion eps"]
  },
  {
    id: "eps-network", entity_id: "rutas-salud", title: "Preguntar si un servicio está cubierto por mi EPS", task: "Consultar cobertura de salud", description: "Confirma directamente con tu EPS si el servicio o procedimiento está cubierto y cómo solicitarlo.", preparation: "Ten la orden médica, si ya la recibiste, y usa únicamente un canal oficial de tu EPS.", status: "verified", updated_at: "2026-10-26", source_id: "minsalud-appointments", common_errors: ["La cobertura y los requisitos dependen de tu caso y de tu EPS.", "Guarda la respuesta y el número de radicado."], aliases: ["cobertura eps", "servicio cubierto", "cobertura procedimiento", "qué cubre mi eps"]
  },
  {
    id: "eps-urgent-care", entity_id: "rutas-salud", title: "Saber dónde pedir atención prioritaria", task: "Buscar atención en salud", description: "Comunícate con tu EPS para que te oriente sobre la red disponible. Si consideras que es una emergencia, acude al servicio de urgencias más cercano.", preparation: "No esperes respuesta de una guía web ante síntomas graves o urgentes.", status: "verified", updated_at: "2026-10-26", source_id: "minsalud-appointments", common_errors: ["La guía no valora síntomas ni diagnostica.", "Si hay emergencia, ve a urgencias o llama a emergencias local."], aliases: ["atencion prioritaria", "donde ir urgente", "urgencias eps", "atención urgente"]
  },
  {
    id: "eps-find-contact", entity_id: "rutas-salud", title: "Encontrar los canales oficiales de mi EPS", task: "Contactar mi EPS", description: "Verifica el nombre de la EPS con ADRES y abre el dominio oficial para buscar sus canales de atención.", preparation: "Evita anuncios o intermediarios que pidan pagos o claves para darte una cita.", status: "verified", updated_at: "2026-10-26", source_id: "adres-eps-consult", common_errors: ["ADRES consulta afiliación, no agenda citas.", "No compartas contraseñas ni códigos de un solo uso."], aliases: ["telefono eps", "contactar eps", "pagina eps", "canales eps"]
  },
  {
    id: "eps-update-data", entity_id: "rutas-salud", title: "Solicitar corrección de mis datos de afiliación", task: "Actualizar datos EPS", description: "ADRES informa que las novedades de afiliación se gestionan ante la EPS o en Mi Seguridad Social, según el trámite.", preparation: "Usa solo portales oficiales y revisa los requisitos del trámite.", status: "pending", updated_at: "2026-10-26", source_id: "adres-sat", common_errors: ["ADRES no cambia los datos reportados por una EPS.", "Si el portal no permite el trámite, contacta a la EPS."], aliases: ["corregir afiliacion", "actualizar datos eps", "cambiar datos afiliacion"]
  },
  {
    id: "eps-authorization-route", entity_id: "rutas-salud", title: "Preguntar si mi atención requiere autorización", task: "Consultar autorización de salud", description: "La EPS confirma si el servicio o procedimiento requiere autorización y cómo solicitarla. Esta guía no decide si un servicio está cubierto ni reemplaza la respuesta de tu entidad.", preparation: "Ten la orden o solicitud profesional, si ya la recibiste. Usa únicamente el canal oficial de tu EPS.", status: "verified", updated_at: "2026-10-26", source_id: "minsalud-appointments", common_errors: ["Los requisitos dependen del servicio y de tu EPS.", "Guarda la respuesta y el número de radicado."], aliases: ["autorización eps", "autorizacion eps", "autorizar examen", "orden médica eps", "orden medica eps"]
  },
  {
    id: "eps-follow-up-route", entity_id: "rutas-salud", title: "Consultar el estado de una cita que ya solicité", task: "Hacer seguimiento a mi cita médica", description: "Consulta el estado usando el número de solicitud en el canal de tu EPS. Si no tienes radicado, comunícate con la entidad para confirmar que recibió la petición.", preparation: "Ten a mano la fecha en que solicitaste la cita y cualquier número de radicado.", status: "verified", updated_at: "2026-10-26", source_id: "minsalud-appointments", common_errors: ["La disponibilidad cambia y solo la confirma tu EPS.", "No envíes documentos personales por enlaces que no sean oficiales."], aliases: ["estado de mi cita", "seguimiento cita eps", "consultar solicitud cita", "cita pendiente eps"]
  },


  {
    id: "supersalud-pqrd-guide", entity_id: "rutas-salud", title: "Presentar una queja si mi EPS no me da respuesta", task: "Reclamar por atención en salud", description: "Presenta primero la solicitud o queja a tu EPS y guarda el radicado. Si no hay solución, puedes acudir a los canales ciudadanos de Supersalud.", preparation: "Ten el radicado de tu EPS, fechas y una descripción breve del problema. Comparte documentos solo en los portales oficiales; esta aplicación no recibe quejas.", status: "verified", updated_at: "2026-10-26", source_id: "supersalud-pqrd", common_errors: ["Si todavía no has radicado ante la EPS, comienza por sus canales oficiales.", "En una urgencia o riesgo inmediato, solicita atención urgente; el trámite de una queja no sustituye atención clínica."], aliases: ["queja eps", "reclamar eps", "pqr eps", "pqr salud", "supersalud", "no me dan cita", "no me atiende la eps", "barrera de salud"]
  },
  {
    id: "nequi-send",
    entity_id: "nequi",
    title: "Enviar a otro Nequi",
    task: "Enviar dinero",
    description:
      "Envía al número Nequi correcto. Revisa el nombre: el envío confirmado no se puede cancelar.",
    preparation:
      "Ten el número y saldo necesario. Revisa el nombre antes de confirmar. Nunca compartas tu clave ni códigos.",
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
    title: "Pagar servicios públicos con Nequi",
    task: "Pagar una factura",
    description:
      "Busca servicios públicos en Nequi y revisa su catálogo actual. No confirmamos que una empresa específica esté disponible.",
    preparation:
      "Ten la factura a mano. La referencia depende del servicio; no la compartas aquí.",
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
    title: "Transferir en Bancolombia",
    task: "Hacer una transferencia",
    description:
      "Envía desde la app Mi Bancolombia.",
    preparation:
      "Necesitas la app, una cuenta activa y saldo. Una cuenta destino no inscrita puede requerir otros pasos.",
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
      "Consulta el SOAT por placa en el portal del RUNT. El formulario puede cambiar.",
    preparation:
      "Ten la placa y el documento del propietario. Ingrésalos solo en el portal oficial del RUNT; esta aplicación no los pide ni guarda.",
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
guides.push(...evidenceLedHealthEntities.map(({ guide }) => guide));
guides.push(...makeCandidateGuides());

guides.push(...expandCatalog(guides, entities));

const steps = [
  ...["depression","anxiety","grief","caregiver","family","crisis","suicide","territorial"].flatMap((slug) => [
    [`mental-topic-${slug}`, 1, "Abre la fuente oficial que aparece en esta guía.", "link", "Abre el recurso oficial"],
    [`mental-topic-${slug}`, 2, "Lee la información general con calma; no es un diagnóstico personal.", "menu", "Lee la orientación general"],
    [`mental-topic-${slug}`, 3, "Si necesitas atención individual, comunícate con tu EPS o solicita orientación por la Línea 106.", "phone", "Pide atención profesional"],
    [`mental-topic-${slug}`, 4, "Guarda el canal oficial y pregunta por las opciones disponibles en tu territorio.", "check", "Confirma las opciones disponibles"],
    [`mental-topic-${slug}`, 5, "Si hay peligro inmediato, busca urgencias o llama al servicio local de emergencias.", "done", "Busca atención urgente si existe riesgo inmediato"],
  ]),
  ["mental-health-line-guide", 6, "Si estás en Cartagena, también puedes llamar al 125 del CRUED. La Alcaldía reporta esta línea local junto con la Línea 106.", "phone", "Llama al CRUED 125 en Cartagena"],
  ...["vaccination","prevention","ins","pai","triage","healthy-aging","healthy-habits","oral-health","appointments-info","find-eps"].flatMap((slug) => [
    [`physical-topic-${slug}`, 1, "Abre el portal oficial indicado en esta guía.", "link", "Abre la fuente oficial"],
    [`physical-topic-${slug}`, 2, "Busca la sección relacionada con la información que necesitas.", "menu", "Busca el tema de interés"],
    [`physical-topic-${slug}`, 3, "Lee el alcance y la fecha de la información publicada.", "details", "Revisa el alcance y vigencia"],
    [`physical-topic-${slug}`, 4, "Para una recomendación personal, consulta a tu EPS o a un profesional de salud.", "phone", "Confirma tu caso con un profesional"],
    [`physical-topic-${slug}`, 5, "Anota el canal o la pregunta que llevarás a la consulta.", "done", "Prepara tu siguiente paso"],
  ]),
  ...["eps-specialist-route","eps-network","eps-urgent-care","eps-find-contact","eps-update-data","eps-authorization-route","eps-follow-up-route"].flatMap((id) => [
    [id, 1, "Confirma tu EPS o abre el portal oficial de tu entidad.", "link", "Identifica el canal oficial"],
    [id, 2, "Busca la opción de atención, citas o trámites que necesitas.", "menu", "Busca la opción correspondiente"],
    [id, 3, "Lee los requisitos; estos pueden variar según la EPS y el servicio.", "details", "Confirma los requisitos con la EPS"],
    [id, 4, "Envía la solicitud solo por el canal oficial y guarda el radicado.", "check", "Guarda el soporte de tu solicitud"],
    [id, 5, "Si no hay solución, revisa los canales de Supersalud; en urgencia, acude a urgencias.", "done", "Da seguimiento o busca atención urgente"],
  ]),
  ["adres-eps-consult-guide", 1, "Abre el enlace oficial de ADRES: «Consulte su EPS (Afiliación en la BDUA)».", "link", "Abre la consulta de afiliación de ADRES"],
  ["adres-eps-consult-guide", 2, "Lee el aviso sobre el uso de los datos y abre el formulario de consulta ciudadana.", "menu", "Abre el formulario oficial de consulta"],
  ["adres-eps-consult-guide", 3, "Selecciona tu tipo de documento y escribe el número en el portal de ADRES.", "details", "Selecciona el tipo e ingresa tu documento en ADRES"],
  ["adres-eps-consult-guide", 4, "Completa la verificación que aparezca y toca «Consultar».", "check", "Completa la verificación y consulta"],
  ["adres-eps-consult-guide", 5, "Revisa la EPS, el régimen y el estado reportado. Si hay un error o necesitas certificado, comunícate con la EPS.", "done", "Revisa el resultado y confirma con tu EPS si hay diferencias"],
  ["eps-appointment-guide", 1, "Si no recuerdas tu EPS, abre la consulta oficial de ADRES y confirma cuál aparece en tu afiliación.", "link", "Identifica tu EPS con ADRES"],
  ["eps-appointment-guide", 2, "Entra al sitio, aplicación, teléfono o punto de atención oficial de esa EPS. ADRES identifica afiliación, pero no agenda citas.", "menu", "Abre un canal oficial de tu EPS"],
  ["eps-appointment-guide", 3, "Solicita la cita que necesitas. Si es con especialista, pregunta si hace falta remisión o autorización y cómo entregarla.", "details", "Solicita la cita y confirma los requisitos"],
  ["eps-appointment-guide", 4, "Pide que te informen la fecha asignada. Para medicina general y odontología, el Ministerio indica un máximo de tres días hábiles desde la solicitud, salvo que la persona pida otra fecha.", "check", "Confirma la fecha que te asignaron"],
  ["eps-appointment-guide", 5, "Anota la fecha, modalidad y el radicado o guarda la confirmación. Si la EPS no resuelve, presenta primero una solicitud o queja ante la EPS.", "done", "Guarda el soporte y da seguimiento"],
  ["eps-appointment-rights-guide", 1, "Lee la orientación oficial del Ministerio sobre asignación de citas médicas.", "link", "Abre la orientación del Ministerio"],
  ["eps-appointment-rights-guide", 2, "Confirma con tu EPS el canal y los requisitos de la cita que solicitaste.", "phone", "Confirma los detalles con tu EPS"],
  ["eps-appointment-rights-guide", 3, "Para medicina general y odontología, la orientación ministerial señala un plazo máximo de tres días hábiles desde la solicitud, salvo que pidas una fecha distinta.", "details", "Ten presente el plazo informado"],
  ["eps-appointment-rights-guide", 4, "Guarda la fecha de solicitud y el número de radicado o la confirmación de la EPS.", "check", "Conserva el soporte"],
  ["eps-appointment-rights-guide", 5, "Si no recibes respuesta o no se soluciona el problema, reclama primero ante la EPS; luego puedes acudir a Supersalud.", "done", "Escala la solicitud si sigue sin resolverse"],
  ["mental-health-line-guide", 1, "Si necesitas apoyo emocional, toma tu teléfono fijo o celular. La Línea Nacional de Salud Mental es la 106.", "phone", "Ten a mano un teléfono para llamar al 106"],
  ["mental-health-line-guide", 2, "Marca 106. La llamada es gratuita y confidencial, según la información oficial del Ministerio.", "phone", "Marca la Línea Nacional de Salud Mental 106"],
  ["mental-health-line-guide", 3, "Cuéntale al profesional qué tipo de orientación necesitas. Puedes pedir apoyo inicial o preguntar por atención local.", "secure", "Habla con el profesional según lo que necesites"],
  ["mental-health-line-guide", 4, "Si la línea no está disponible en tu zona, abre el directorio de líneas territoriales desde la página oficial.", "link", "Busca otra línea en el directorio territorial"],
  ["mental-health-line-guide", 5, "Para continuar atención clínica, contacta a tu EPS. Si existe peligro inmediato, acude a urgencias o llama a emergencias locales.", "done", "Elige el apoyo continuo o urgente que necesitas"],
  ["mental-health-eps-guide", 1, "Abre el sitio oficial de tu EPS o consulta primero tu afiliación con ADRES.", "link", "Identifica tu EPS por el portal oficial"],
  ["mental-health-eps-guide", 2, "Entra a un canal oficial de la EPS y solicita orientación sobre psicología o salud mental.", "menu", "Busca el canal oficial de salud mental"],
  ["mental-health-eps-guide", 3, "Pregunta si necesitas una cita inicial, remisión o autorización y qué opciones hay en tu municipio.", "details", "Confirma los pasos y profesionales disponibles"],
  ["mental-health-eps-guide", 4, "Elige una opción disponible y pide que te confirmen fecha, modalidad y lugar.", "check", "Confirma los detalles de la atención"],
  ["mental-health-eps-guide", 5, "Guarda el número de solicitud. Si necesitas apoyo inmediato, llama a la Línea 106.", "done", "Guarda la solicitud y usa la línea 106 si es urgente"],
  ["supersalud-pqrd-guide", 1, "Comunícate primero con tu EPS para explicar el problema y pedir una solución.", "phone", "Solicita primero la solución a tu EPS"],
  ["supersalud-pqrd-guide", 2, "Pide y guarda el número de radicado, la fecha y la respuesta que te den.", "details", "Guarda el radicado y la respuesta"],
  ["supersalud-pqrd-guide", 3, "Si no hay solución, abre el formulario oficial de PQRD de Supersalud o llama al 01 8000 513 700.", "link", "Abre los canales oficiales de Supersalud"],
  ["supersalud-pqrd-guide", 4, "Describe lo ocurrido con fechas y adjunta soportes solo en el canal oficial. Anota el nuevo radicado.", "check", "Describe el caso y conserva el radicado"],
  ["supersalud-pqrd-guide", 5, "Consulta el estado con el número de radicado. Si es una urgencia, solicita atención urgente en lugar de esperar el trámite.", "done", "Haz seguimiento y prioriza la atención urgente"],  [
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
    "Abre el enlace oficial del RUNT.",
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
const deleteUnseededGuides = db.prepare(
  `DELETE FROM guides WHERE id NOT IN (${guides.map(() => "?").join(",")})`,
);
const deleteUnseededEntities = db.prepare(
  `DELETE FROM entities WHERE id NOT IN (${entities.map(() => "?").join(",")})`,
);
const deleteUnseededSources = db.prepare(
  `DELETE FROM sources WHERE id NOT IN (${sources.map(() => "?").join(",")})`,
);

db.transaction(() => {
  deleteUnseededGuides.run(...guides.map((guide) => guide.id));
  db.prepare("DELETE FROM steps").run();
  db.prepare("DELETE FROM links").run();
  deleteUnseededEntities.run(...entities.map((entity) => entity.id));
  entities.forEach((e) => putEntity.run(e));
  sources.forEach((s) => putSource.run(s));
  guides.forEach((g) =>
    putGuide.run({
      ...g,
      common_errors: JSON.stringify(g.common_errors),
      aliases: JSON.stringify(g.aliases),
    }),
  );
  deleteUnseededSources.run(...sources.map((source) => source.id));
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
    ...[
      ["depression", "Depresión y bienestar emocional", "https://www.minsalud.gov.co/salud/publica/salud-mental", "Información general de Minsalud; solicita valoración si necesitas atención personal."],
      ["anxiety", "Ansiedad y estrés", "https://www.ins.gov.co/Paginas/Salud-Mental.aspx", "Recurso institucional y acceso a orientación por Línea 106."],
      ["grief", "Duelo y pérdida", "https://www.ins.gov.co/Paginas/Salud-Mental.aspx", "Información pública; pide apoyo continuado a tu EPS si lo necesitas."],
      ["caregiver", "Bienestar de quien cuida", "https://www.ins.gov.co/Paginas/Salud-Mental.aspx", "Orientación general y Línea 106; no reemplaza atención psicológica."],
      ["family", "Convivencia y relaciones familiares", "https://www.minsalud.gov.co/salud/publica/salud-mental", "Información pública de salud mental; consulta profesional para tu situación."],
      ["crisis", "Apoyo en crisis emocional — Línea 106", "https://minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx", "Orientación inicial; para peligro inmediato, urgencias o emergencias locales."],
      ["suicide", "Prevención del suicidio — INS", "https://www.ins.gov.co/Noticias/Paginas/Prevenir-el-suicidio-es-posible%2C-reconoce-las-se%C3%B1ales%2C-pregunta-y-busca-ayuda-a-tiempo.aspx", "Fuente institucional; indica la Línea 106 y orientación urgente."],
      ["territorial", "Directorio de líneas territoriales — Minsalud", "https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/ET/directorio-salud-mental-prevencion-suicidio-minsalud.pdf", "Comprueba allí los números y cobertura de tu territorio."],
      ["cartagena-support", "Orientación de salud mental en Cartagena — DADIS", "https://cartagena.gov.co/noticias/torre-reloj-cartagena-iluminara-purpura-dorado-este-9-10-septiembre", "La publicación distrital informa líneas locales. Confirma su disponibilidad al abrir la fuente."],
      ["eps-psychology", "Solicitar psicología en mi EPS", "https://www.adres.gov.co/tramites/ciudadania/consulta-afiliacion", "ADRES ayuda a identificar la EPS; la cita y red se gestionan con la EPS."],
    ].map(([slug, purpose, url, explanation]) => ["salud-mental", purpose, url, explanation]),
    ...[
      ["vaccination", "Vacunación de personas mayores — Minsalud", "https://vacunacion.minsalud.gov.co/EV/Paginas/adultos-mayores.aspx", "Revisa el esquema oficial y confirma individualmente con personal de salud."],
      ["prevention", "Prevención y salud pública — Minsalud", "https://www.minsalud.gov.co/salud/publica/Paginas/salud-publica.aspx", "Información pública de prevención, no diagnóstico individual."],
      ["ins", "Instituto Nacional de Salud", "https://www.ins.gov.co/", "Portal público del INS; no presta citas médicas."],
      ["pai", "Programa Ampliado de Inmunizaciones", "https://vacunacion.minsalud.gov.co/", "Consulta el esquema nacional de vacunación."],
      ["triage", "Orientación sobre triage en urgencias", "https://www.minsalud.gov.co/salud/prestacion-servicios/Paginas/triage.aspx", "Explica la clasificación clínica que realiza el personal de salud."],
      ["healthy-aging", "Envejecimiento y vejez — Minsalud", "https://www.minsalud.gov.co/Proteccion-Social/promocion-social/Paginas/envejecimiento-vejez.aspx", "Política y orientación pública sobre envejecimiento saludable."],
      ["healthy-habits", "Decálogo de actividad física — Minsalud", "https://www.minsalud.gov.co/salud/publica/HS/Paginas/actividad-fisica.aspx", "Adapta las recomendaciones a tus capacidades y consulta si tienes dudas."],
      ["oral-health", "Salud bucal en adultos y personas mayores — Minsalud", "https://minsalud.gov.co/salud/publica/HS/Paginas/salud-bucal.aspx", "Orientación pública de autocuidado y consulta odontológica."],
      ["appointments-info", "Orientación sobre asignación de citas", "https://www.minsalud.gov.co/Normatividad_Nuevo/Bolet%C3%ADn%20Jur%C3%ADdico%20No.%20005%20de%20Mayo%202025.pdf", "Información normativa; la agenda se solicita a tu EPS."],
      ["find-eps", "Consulta de EPS en ADRES", "https://www.adres.gov.co/tramites/ciudadania/consulta-afiliacion", "Reporte BDUA gratuito; no expide certificado."],
    ].map(([slug, purpose, url, explanation]) => ["bienestar-fisico", purpose, url, explanation]),
    ["rutas-salud", "Consultar mi afiliación a EPS en ADRES", "https://www.adres.gov.co/tramites/ciudadania/consulta-afiliacion", "Consulta gratuita de la EPS reportada en BDUA. ADRES no expide certificados."],
    ["rutas-salud", "Abrir la consulta ciudadana de ADRES", "https://aplicaciones.adres.gov.co/BDUA_Internet/Pages/ConsultarAfiliadoWeb_2.aspx", "Ingresa tipo y número de documento únicamente en el portal oficial."],
    ["rutas-salud", "Consultar cómo se asignan las citas", "https://www.minsalud.gov.co/Normatividad_Nuevo/Bolet%C3%ADn%20Jur%C3%ADdico%20No.%20005%20de%20Mayo%202025.pdf", "Orientación normativa; agenda la cita en el canal oficial de tu EPS."],
    ["rutas-salud", "Entrar a Mi Seguridad Social", "https://www.miseguridadsocial.gov.co/", "Portal oficial para consultar trámites del aseguramiento y afiliación."],
    ["rutas-salud", "Radicar una solicitud ante Supersalud", "https://www.supersalud.gov.co/es-co/atencion-ciudadano/contactenos", "Canales de la Superintendencia si tu EPS no resolvió la solicitud."],
    ["rutas-salud", "Consultar rutas integrales de atención en salud", "https://www.minsalud.gov.co/salud/publica/ssr/paginas/rutas-integrales-de-atencion-en-salud-rias.aspx", "Información del Ministerio sobre promoción, prevención y atención en el curso de vida."],
    ["rutas-salud", "Consultar prioridades de atención en urgencias", "https://www.minsalud.gov.co/salud/prestacion-servicios/Paginas/triage.aspx", "El triage lo realiza el personal de salud; ante una emergencia, busca atención inmediata."],
    ["rutas-salud", "Revisar preguntas frecuentes de ADRES", "https://portal.adres.gov.co/portal-del-ciudadano/preguntas-frecuentes", "Aclara el alcance de BDUA y qué novedades se gestionan ante la EPS."],
    ["rutas-salud", "Presentar una PQRD a Supersalud", "https://superargo.supersalud.gov.co/2/formularioWeb/delegatura.php", "Usa este canal oficial después de conservar el radicado de tu EPS."],
    ["rutas-salud", "Consultar las líneas de salud mental de tu territorio", "https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/VS/PP/ET/directorio-salud-mental-prevencion-suicidio-minsalud.pdf", "Confirma que el número y el horario sigan vigentes en tu municipio."],
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
    [
      "acuacar",
      "Oficina virtual de Aguas de Cartagena",
      "https://www.acuacar.com/",
      "Portal oficial con accesos a facturas, pagos, estado de cuenta y solicitudes. La cobertura depende de la zona atendida por la empresa.",
      "El sitio oficial ofrece accesos a pago y duplicado de factura, estado de deuda, factura digital, citas, PQR, nuevos servicios y reporte de daños. Cada procedimiento sigue en revisión.",
      "2026-10-27",
    ],
    [
      "surtigas",
      "Oficina virtual de Surtigas",
      "https://www.surtigas.com.co/oficina-virtual",
      "Portal oficial de servicios y atención de Surtigas. Confirma allí que el domicilio esté dentro de su cobertura.",
      "La oficina virtual oficial publica opciones de pago, estado de cuenta, citas, actualización de datos y factura digital. Los pasos específicos siguen en revisión.",
      "2026-10-27",
    ],
    [
      "afinia",
      "Quejas y trámites de servicios públicos — Superservicios",
      "https://www.superservicios.gov.co/Atencion-y-servicios-a-la-ciudadania/tramites-y-servicios",
      "Canal institucional para conocer trámites ciudadanos sobre servicios públicos. Verifica requisitos y radica únicamente en el portal oficial.",
      "La página oficial informa que las solicitudes ciudadanas son gratuitas y pueden presentarse sin intermediarios. El trámite concreto depende del caso.",
      "2026-10-27",
    ],
    [
      "govco",
      "Portal Único del Estado Colombiano — GOV.CO",
      "https://www.gov.co/",
      "Buscador oficial para encontrar entidades, servicios y trámites del Estado colombiano.",
      "Portal oficial consultado para ubicar trámites y servicios públicos. Cada entidad define sus propios requisitos, costos, tiempos y canales.",
      "2026-10-27",
    ],
    [
      "sic",
      "Orientación oficial de protección al consumidor — SIC",
      "https://sedeelectronica.sic.gov.co/temas/proteccion-al-consumidor/derechos-y-deberes/denuncias-y-demandas",
      "Información oficial para distinguir una reclamación directa, una denuncia y una acción de protección al consumidor.",
      "La SIC explica los canales de protección al consumidor. Los pasos dependen del caso y deben confirmarse en la sede electrónica oficial.",
      "2026-10-27",
    ],
    [
      "bancolombia",
      "Directorio oficial de entidades vigiladas — SFC",
      "https://www.superfinanciera.gov.co/publicaciones/61694/",
      "Comprueba en la Superintendencia Financiera qué entidades aparecen bajo su inspección y vigilancia; no uses publicidad como única verificación.",
      "Directorio institucional de entidades vigiladas por la Superintendencia Financiera de Colombia.",
      "2026-10-27",
    ],
  ];
  links.forEach(([entity_id, purpose, url, explanation, result, checked_at], i) =>
    putLink.run({
      id: `link-${i + 1}`,
      entity_id,
      purpose,
      url,
      checked_at: checked_at || "2026-10-26",
      result:
        result ||
      "Dominio o centro de ayuda oficial HTTPS consultado el 26 de octubre de 2026. El alcance se registra en la fuente relacionada.",
      explanation,
    }),
  );
})();
db.close();
console.log(`Catálogo instalado en ${dbPath}`);
