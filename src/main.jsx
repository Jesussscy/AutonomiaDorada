import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  ExternalLink,
  Headphones,
  Home,
  Info,
  Search,
  ShieldCheck,
  Square,
  Volume2,
  BookOpenCheck,
  RotateCcw,
  ListFilter,
  Landmark,
  WalletCards,
  Zap,
  CarFront,
  ShoppingBasket,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  RefreshCw,
  Bookmark,
  X,
  BadgeCheck,
  Phone,
  HeartPulse,
  Brain,
  Settings2,
  Accessibility,
  Stethoscope,
} from "lucide-react";
import "./styles.css";
import "./brand-theme.css";

const aliasesById = {
  "nequi-send": [
    "mandar plata",
    "pasar dinero",
    "transferir a nequi",
    "enviar a nequi",
    "plata a otra persona",
  ],
  "bancolombia-own-transfer": [
    "banco colombia",
    "transferir bancolombia",
    "transferencia entre cuentas",
  ],
  "afinia-bill-pending": [
    "luz",
    "pagar la luz",
    "factura afinia",
    "energía",
    "energia",
    "pagar recibo",
  ],
  "runt-soat-consult": [
    "soat",
    "consultar mi soat",
    "vencimiento soat",
    "vigencia seguro",
    "seguro del carro",
    "moto",
  ],
  "movistar-pending": ["movistar", "factura de teléfono", "pagar movistar"],
};
const initialParams = new URLSearchParams(window.location.search);
const initialSearch = initialParams.get("q") || "";
const categoryNames = [
  "Todas",
  "Salud mental",
  "Bienestar físico",
  "Salud",
  "Bancos",
  "Billeteras",
  "Servicios",
  "Trámites",
  "Comercios",
];
const categoryIcon = {
  Todas: BookOpenCheck,
  "Salud mental": Brain,
  "Bienestar físico": Accessibility,
  Salud: Stethoscope,
  Bancos: Landmark,
  Billeteras: WalletCards,
  Servicios: Zap,
  Trámites: CarFront,
  Comercios: ShoppingBasket,
};
const categoryFor = (guide) =>
  ({
    "Salud mental": "Salud mental",
    "Bienestar físico": "Bienestar físico",
    Salud: "Salud",
    "Rutas de salud": "Salud",
    Bancos: "Bancos",
    Billeteras: "Billeteras",
    "Servicios públicos": "Servicios",
    "Trámites y seguros": "Trámites",
    Comercios: "Comercios",
  })[guide.entity_category] || "Bancos";
const categoryForGuide = (guide) => guide.category_group || categoryFor(guide);
const categorySlug = (value) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const readLocalNumber = (key, fallback, min, max) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null || stored.trim() === "") return fallback;
    const value = Number(stored);
    return Number.isFinite(value)
      ? Math.min(max, Math.max(min, value))
      : fallback;
  } catch {
    return fallback;
  }
};
const readLocalText = (key) => {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
};
const readLocalBool = (key, fallback = false) => {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : stored === "true";
  } catch {
    return fallback;
  }
};
const writeLocal = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* The guide remains usable when storage is unavailable. */
  }
};
const removeLocal = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* The guide remains usable when storage is unavailable. */
  }
};
const readProgress = (id) =>
  Math.floor(readLocalNumber(`autonomia-dorada-progress-${id}`, 0, 0, 9999));
const safeStep = (value, total) => {
  const parsed = Number(value);
  const lastStep = Math.max(0, total - 1);
  return Number.isFinite(parsed)
    ? Math.min(lastStep, Math.max(0, Math.trunc(parsed)))
    : 0;
};
const searchStopWords = new Set([
  "como",
  "quiero",
  "necesito",
  "por",
  "favor",
  "hacer",
  "hoy",
  "mi",
  "mis",
  "el",
  "la",
  "las",
  "los",
  "de",
  "del",
  "un",
  "una",
  "unos",
  "unas",
  "me",
  "para",
  "puedo",
  "a",
  "en",
  "con",
  "que",
  "qué",
  "donde",
  "dónde",
  "desde",
  "otra",
  "otro",
  "guia",
  "guias",
  "pasos",
  "paso",
  "cuenta",
  "cuentas",
  "app",
  "aplicacion",
  "aplicación",
  "celular",
  "telefono",
  "teléfono",
]);
const searchWords = (value) =>
  value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !searchStopWords.has(word))
    .map((word) =>
      word.length > 5 && word.endsWith("s") ? word.slice(0, -1) : word,
    );
const searchSynonyms = {
  psicologo: "psicologia",
  psicologa: "psicologia",
  psicologos: "psicologia",
  psicologas: "psicologia",
  psicologico: "psicologia",
  psicologica: "psicologia",
  eps: "cita",
  doctor: "cita",
  doctora: "cita",
  mando: "enviar",
  manda: "enviar",
  mandar: "enviar",
  envio: "enviar",
  enviar: "enviar",
  transferencia: "transferir",
  transferir: "transferir",
  plata: "dinero",
  dinero: "dinero",
  luz: "energia",
  electricidad: "energia",
  recibo: "factura",
  pagar: "pagar",
  pago: "pagar",
};
function chooseNarrationVoice(voices, preference) {
  const spanish = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("es"));
  if (!spanish.length) return null;
  if (preference.startsWith("voice:")) return spanish.find((voice) => voice.voiceURI === preference.slice(6)) || null;
  return spanish.find((voice) => voice.lang?.toLowerCase() === "es-co") || spanish[0];
}
const entityColors = {
  nequi: { accent: "#de3f83", soft: "#fae7f0", word: "NEQUI" },
  bancolombia: { accent: "#df9d13", soft: "#fbf1d9", word: "BANCOLOMBIA" },
  afinia: { accent: "#3277ad", soft: "#e7f0f7", word: "AFINIA" },
  runt: { accent: "#6d58a6", soft: "#eeeafa", word: "RUNT" },
  soat: { accent: "#52788f", soft: "#e8f0f5", word: "SOAT" },
  bbva: { accent: "#1678ce", soft: "#e6f0fa", word: "BBVA" },
  davivienda: { accent: "#ca493f", soft: "#f8eae8", word: "DAVIVIENDA" },
  "banco-bogota": {
    accent: "#b43942",
    soft: "#f7e8e9",
    word: "BANCO DE BOGOTÁ",
  },
  movii: { accent: "#823fe1", soft: "#f0e9fa", word: "MOVii" },
  dale: { accent: "#eb632e", soft: "#fbebe4", word: "dale!" },
  movistar: { accent: "#285bb1", soft: "#e8eef9", word: "MOVISTAR" },
  ara: { accent: "#d44738", soft: "#f8eae7", word: "TIENDAS ara" },
};
const entityIcons = {
  "bienestar-fisico": Accessibility,
  salud: HeartPulse,
  "salud-mental": Brain,
  nequi: WalletCards,
  bancolombia: Landmark,
  afinia: Zap,
  runt: CarFront,
  soat: ShieldCheck,
  bbva: Landmark,
  davivienda: Landmark,
  "banco-bogota": Landmark,
  movii: WalletCards,
  dale: WalletCards,
  movistar: Zap,
  ara: ShoppingBasket,
};
const brandLogoPaths = {
  nequi: "/brands/nequi.svg",
  bancolombia: "/brands/bancolombia.svg",
  bbva: "/brands/bbva-logo.png",
  davivienda: "/brands/davivienda.png",
  "banco-bogota": "/brands/banco-bogota.png",
  afinia: "/brands/afinia.svg",
  ara: "/brands/ara.svg",
  movii: "/brands/movii.webp",
  dale: "/brands/dale-dark.svg",
  movistar: "/brands/movistar.webp",
  runt: "/brands/runt.png",
  acuacar: "/brands/acuacar-mark.png",
  surtigas: "/brands/surtigas.svg",
  govco: "/brands/govco.svg",
  sic: "/brands/sic.png",
};
const searchTokens = (value) =>
  searchWords(value).map((word) => searchSynonyms[word] || word);
const genericEntityWords = new Set(["banco", "tiendas", "soat"]);
const matchesQuery = (query, ...fields) => {
  const terms = searchTokens(query);
  if (!terms.length) return false;
  const indexed = new Set(fields.flatMap(searchTokens));
  return terms.every((term) => indexed.has(term));
};
const formatCheckedDate = (value) => {
  if (!value) return "Fecha no registrada";
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? "Fecha no registrada"
    : new Intl.DateTimeFormat("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
};

function EntityMark({ entityId, className, size = 18 }) {
  const Icon = entityIcons[entityId] || BookOpenCheck;
  const logoPath = className.split(/\s+/).includes("card-icon")
    ? brandLogoPaths[entityId]
    : null;
  return (
    <span
      className={`${className}${logoPath || (entityId === "soat" && className.includes("card-icon")) ? ` card-icon--brand card-icon--${entityId}` : ""}`}
      aria-hidden="true"
    >
      {entityId === "soat" && className.includes("card-icon") ? (
        <span className="soat-emblem"><ShieldCheck size={19} /> SOAT</span>
      ) : entityId === "banco-bogota" && logoPath ? (
        <span className="brand-crop brand-crop--bogota" />
      ) : logoPath ? (
        <img className="brand-logo-image" src={logoPath} alt="" loading="lazy" decoding="async" />
      ) : (
        <Icon size={size} />
      )}
    </span>
  );
}

const institutionMarks = [
  { match: /adres\.gov\.co/i, name: "ADRES", src: "/brands/adres.png" },
  { match: /ins\.gov\.co/i, name: "Instituto Nacional de Salud", src: "/brands/ins.png" },
  { match: /supersalud\.gov\.co/i, name: "Supersalud", src: "/brands/supersalud.svg" },
  { match: /minsalud\.gov\.co/i, name: "Ministerio de Salud", src: "/brands/minsalud.png" },
];
function InstitutionMark({ url }) {
  let host = "";
  try { host = new URL(url).hostname; } catch { return null; }
  const institution = institutionMarks.find(({ match }) => match.test(host));
  if (!institution) return null;
  return <span className="institution-mark"><img src={institution.src} alt="" loading="lazy" decoding="async" /><small>{institution.name}</small></span>;
}

function HealthGuideImage({ guide }) {
  const url = guide.source_url || guide.source?.url;
  const mark = institutionMarks.find(({ match }) => {
    try { return match.test(new URL(url).hostname); } catch { return false; }
  });
  return <span className="health-guide-image" aria-hidden="true">
    {mark ? <img className="health-guide-logo" src={mark.src} alt="" loading="lazy" decoding="async" /> : <HeartPulse size={30} />}
  </span>;
}

function SiteFooter({ onHome, onHelp, compact = false }) {
  return (
    <footer className={`site-footer${compact ? " site-footer--compact" : ""}`}>
      <div className="site-footer-main">
        <div className="site-footer-identity">
          <span className="brand-mark" aria-hidden="true"><img src="/brands/autonomia-dorada-logo.jpg" alt="" /></span>
          <div>
            <strong>Autonomía Dorada</strong>
            <span>Tu autonomía, a tu ritmo.</span>
          </div>
        </div>
        <div className="site-footer-actions">
          <button type="button" onClick={onHome}><Home size={17} /> Inicio</button>
          <button type="button" onClick={onHelp}><CircleHelp size={17} /> Ayuda</button>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span><ShieldCheck size={15} /> Nunca pedimos claves ni códigos.</span>
        <span>Proyecto orientativo · Cartagena, Colombia</span>
      </div>
    </footer>
  );
}

function GuideArtwork({ guide, stepIndex, instruction }) {
  const entity = entityColors[guide?.entity_id] || {
    accent: "#4f7690",
    soft: "#e5eff5",
    word: guide?.entity_name || "GUÍA",
  };
  const Icon = entityIcons[guide?.entity_id] || BookOpenCheck;
  const action = [
    "Inicio",
    "Buscar",
    "Elegir",
    "Completar",
    "Revisar",
    "Confirmar",
    "Resultado",
  ][Math.min(stepIndex, 6)];
  return (
    <div
      className="guide-artwork"
      style={{ "--entity-accent": entity.accent, "--entity-soft": entity.soft }}
      role="img"
      aria-label={`Ilustración demostrativa de ${entity.word}: paso ${stepIndex + 1}. No es una pantalla real de ${guide.entity_name}.`}
    >
      <div className="artwork-window">
        <div className="artwork-window-head">
          <small>VISTA RECREADA</small>
        </div>
        <div className="artwork-layout">
          <div className="artwork-content">
            <div className="artwork-identity">
              <span className="artwork-avatar">
                <Icon size={19} />
              </span>
              <span>
                <strong>{entity.word}</strong>
                <small>Recorrido orientativo</small>
              </span>
              <span className="artwork-step-tag">PASO {stepIndex + 1}</span>
            </div>
            <div className="artwork-highlight">
              <div>
                <small>{action.toUpperCase()} · ILUSTRACIÓN</small>
                <strong>
                  {action === "Revisar"
                    ? "Antes de continuar"
                    : action === "Confirmar"
                      ? "Tú tienes el control"
                      : action === "Resultado"
                        ? "Comprueba la información"
                        : "Sigue la indicación"}
                </strong>
                <p>{instruction}</p>
              </div>
              <span className="artwork-illustration">
                <Icon size={27} />
              </span>
            </div>
            <div className="artwork-progress">
              <span
                style={{
                  width: `${((stepIndex + 1) / (guide?.steps?.length || 1)) * 100}%`,
                }}
              />
            </div>
            <div className="artwork-footer">
              <span>Orientación paso a paso</span>
              <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </div>
      <div className="artwork-caption">
        <Info size={13} />
        <span>
          Ejemplo orientativo · no es una pantalla oficial
        </span>
      </div>
    </div>
  );
}

function App() {
  const [catalog, setCatalog] = useState({
    entities: [],
    guides: [],
    links: [],
  });
  const [catalogState, setCatalogState] = useState("loading");
  const [catalogRetry, setCatalogRetry] = useState(0);
  const [showResume, setShowResume] = useState(() =>
    readLocalBool("autonomia-dorada-show-resume", true),
  );
  const [query, setQuery] = useState(initialSearch);
  const [selected, setSelected] = useState(initialParams.get("guia") || null);
  const [stepIndex, setStepIndex] = useState(() =>
    safeStep(Number(initialParams.get("paso") || 1) - 1, 9999),
  );
  const [font, setFont] = useState(() =>
    readLocalNumber("autonomia-dorada-font", 1, 0.9, 1.3),
  );
  const [voice, setVoice] = useState("idle");
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [voicePreference, setVoicePreference] = useState(() => {
    const saved = readLocalText("autonomia-dorada-voice-preference");
    return saved === "female" || saved === "male" ? "auto" : saved || "auto";
  });
  const [showSettings, setShowSettings] = useState(false);
  const [narrativeMode, setNarrativeMode] = useState(() => readLocalBool(
    "autonomia-dorada-narrative-mode",
    typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches === true,
  ));
  const [narration, setNarration] = useState("idle");
  const [showArtwork, setShowArtwork] = useState(true);
  const [toast, setToast] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [favoritePulseId, setFavoritePulseId] = useState(null);
  const [favoritePulseAction, setFavoritePulseAction] = useState("saved");
  const [favoriteRemovingId, setFavoriteRemovingId] = useState(null);
  const favoritePulseTimerRef = useRef(null);
  const [category, setCategory] = useState("Todas");
  const [showPending, setShowPending] = useState(true);
  const [showAllGuides, setShowAllGuides] = useState(false);
  const [allGuidesManuallyOpened, setAllGuidesManuallyOpened] = useState(false);
  const [showOfficialLinks, setShowOfficialLinks] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return !initialParams.has("guia") && !sessionStorage.getItem("autonomia-dorada-welcome-seen");
    } catch {
      return false;
    }
  });
  const [welcomeLeaving, setWelcomeLeaving] = useState(false);
  const [resumeGuideId, setResumeGuideId] = useState(() =>
    readLocalText("autonomia-dorada-last-guide"),
  );
  const [favorites, setFavorites] = useState(() => {
    try {
      const parsed = JSON.parse(readLocalText("autonomia-dorada-favorites") || "[]");
      return Array.isArray(parsed)
        ? parsed.filter((id) => typeof id === "string").slice(0, 30)
        : [];
    } catch {
      return [];
    }
  });
  const [showFavorites, setShowFavorites] = useState(() =>
    readLocalBool("autonomia-dorada-show-favorites"),
  );
  const lastNarrationTarget = React.useRef(null);
  const lastNarrationAt = React.useRef(0);
  const speechGeneration = React.useRef(0);
  const categoryTabsRef = useRef(null);

  const cancelSpeech = () => {
    speechGeneration.current += 1;
    window.speechSynthesis?.cancel();
    setVoice("idle");
    setNarration("idle");
  };

  const guide = selected ? catalog.guides.find((g) => g.id === selected) : null;
  const activeStep = guide?.steps?.[stepIndex];
  useEffect(() => {
    let alive = true;
    let timer;
    let attempt = 0;
    const load = async () => {
      attempt++;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/catalog`,
          { signal: controller.signal },
        );
        clearTimeout(timeout);
        if (!response.ok) throw new Error("api");
        const data = await response.json();
        if (alive) {
          setCatalog(data);
          setCatalogState("ready");
        }
      } catch {
        if (alive && attempt < 7) {
          timer = setTimeout(load, Math.min(600 * 2 ** (attempt - 1), 5000));
        }
        else if (alive) setCatalogState("error");
      }
    };
    load();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [catalogRetry]);
  useEffect(() => {
    document.title = guide
      ? `${guide.title} · Autonomía Dorada`
      : query
        ? `${query} · Autonomía Dorada`
        : "Autonomía Dorada — ¿Qué quieres hacer hoy?";
  }, [guide?.title, query]);
  useEffect(() => {
    writeLocal("autonomia-dorada-font", String(font));
    document.documentElement.style.setProperty("--text-scale", String(font));
    document.documentElement.dataset.textScale =
      font >= 1.2 ? "large" : "normal";
  }, [font]);
  useEffect(() => {
    if (guide?.status === "verified" && guide.steps.length)
      setStepIndex((current) => safeStep(current, guide.steps.length));
  }, [guide?.id, guide?.steps?.length, guide?.status]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (query && !guide) params.set("q", query);
    if (guide) {
      params.set("guia", guide.id);
      params.set("paso", String(stepIndex + 1));
    }
    const next = params.toString();
    history.replaceState(
      history.state,
      "",
      `${location.pathname}${next ? `?${next}` : ""}`,
    );
  }, [query, guide?.id, stepIndex]);
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(location.search);
      cancelSpeech();
      setSelected(params.get("guia"));
      setStepIndex(safeStep(Number(params.get("paso") || 1) - 1, 9999));
      setQuery(params.get("q") || "");
      setShowHelp(false);
      if (params.has("guia")) {
        window.scrollTo(0, 0);
      } else {
        focusCatalog();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    setVoiceAvailable(
      Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance),
    );
    const updateVoices = () => {
      const voices = window.speechSynthesis?.getVoices?.() || [];
      setAvailableVoices(voices);
    };
    updateVoices();
    window.speechSynthesis?.addEventListener?.("voiceschanged", updateVoices);
    return () => {
      window.speechSynthesis?.removeEventListener?.("voiceschanged", updateVoices);
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => writeLocal("autonomia-dorada-voice-preference", voicePreference), [voicePreference]);
  useEffect(() => writeLocal("autonomia-dorada-narrative-mode", String(narrativeMode)), [narrativeMode]);
  useEffect(() => {
    const onKey = (event) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k" &&
        !guide
      ) {
        event.preventDefault();
        document.getElementById("task-search")?.focus();
      }
      if (event.key === "Escape") {
        if (document.querySelector("dialog[open]")) return;
        if (showHelp) setShowHelp(false);
        else if (guide) backToGuides();
      }
      if (guide && event.altKey && event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
      if (guide && event.altKey && event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [guide?.id, stepIndex, showHelp]);
  const setNotice = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };
  const openHelp = () => {
    setShowHelp(true);
    requestAnimationFrame(() => document.getElementById("help-title")?.focus());
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };
  const showSearchResults = (term = query) => {
    setQuery(term);
    setCategory("Todas");
    focusCatalog();
  };
  const focusCatalog = () => {
    requestAnimationFrame(() => {
      document.getElementById("catalog-heading")?.focus({ preventScroll: true });
      document.getElementById("guide-list")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  };
  const backToGuides = () => {
    cancelSpeech();
    if (history.state?.autonomiaDoradaGuide) {
      history.back();
      return;
    }
    setSelected(null);
    setStepIndex(0);
    setShowHelp(false);
    focusCatalog();
  };
  const goHome = () => {
    cancelSpeech();
    setSelected(null);
    setStepIndex(0);
    setQuery("");
    setShowHelp(false);
    const homeParams = new URLSearchParams(location.search);
    homeParams.delete("guia");
    homeParams.delete("paso");
    const suffix = homeParams.toString();
    history.replaceState(history.state, "", `${location.pathname}${suffix ? `?${suffix}` : ""}`);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const dismissWelcome = () => {
    try { sessionStorage.setItem("autonomia-dorada-welcome-seen", "true"); } catch { /* Welcome remains optional if storage is unavailable. */ }
    setWelcomeLeaving(true);
    window.setTimeout(() => setShowWelcome(false), 220);
    requestAnimationFrame(() => document.getElementById("task-search")?.focus({ preventScroll: true }));
  };
  const [stepTransition, setStepTransition] = useState(false);
  const openGuide = (g) => {
    const params = new URLSearchParams({ guia: g.id, paso: "1" });
    history.pushState(
      { autonomiaDoradaGuide: true },
      "",
      `${location.pathname}?${params.toString()}`,
    );
    setSelected(g.id);
    setShowArtwork(true);
    setStepIndex(
      g.status === "verified"
        ? safeStep(readProgress(g.id), g.steps?.length || 0)
        : 0,
    );
    cancelSpeech();
    window.scrollTo(0, 0);
  };
  const matches = useMemo(() => {
    const terms = searchTokens(query);
    if (!terms.length)
      return [...catalog.guides].sort(
        (a, b) =>
          Number(b.status === "verified") - Number(a.status === "verified") ||
          a.title.localeCompare(b.title, "es"),
      );
    const namedEntities = new Set(
      catalog.guides
        .filter((g) =>
          searchTokens(g.entity_name).some(
            (word) => !genericEntityWords.has(word) && terms.includes(word),
          ),
        )
        .map((g) => g.entity_id),
    );
    return catalog.guides
      .filter((g) => !namedEntities.size || namedEntities.has(g.entity_id))
      .map((g) => {
        const aliases = [...(g.aliases || []), ...(aliasesById[g.id] || [])];
        const title = `${g.title} ${g.task} ${g.entity_name}`;
        const category = g.entity_category || "";
        const description = g.description || "";
        const titleMatch = matchesQuery(query, title);
        const aliasMatch = aliases.some((alias) => matchesQuery(query, alias));
        const contextMatch = matchesQuery(
          query,
          title,
          category,
          description,
          ...aliases,
        );
        const indexed = new Set(
          searchTokens(
            `${title} ${category} ${description} ${aliases.join(" ")}`,
          ),
        );
        const matched = terms.filter((term) => indexed.has(term)).length;
        const score = aliasMatch
          ? 120
          : titleMatch
            ? 100
            : contextMatch
              ? 80
              : matched * 5;
        return { g, score, matched };
      })
      .filter((x) => x.score > 0 && x.matched >= Math.min(2, terms.length))
      .sort(
        (a, b) =>
          b.score - a.score ||
          Number(b.g.status === "verified") -
            Number(a.g.status === "verified") ||
          a.g.title.localeCompare(b.g.title, "es"),
      )
      .map((x) => x.g);
  }, [catalog, query]);
  const categoryMatches = useMemo(
    () =>
      category === "Todas"
        ? matches
        : matches.filter((g) => categoryForGuide(g) === category),
    [matches, category],
  );
  const filteredMatches = useMemo(
    () =>
      categoryMatches.filter(
        (g) =>
          (showPending || g.status === "verified") &&
          (!showFavorites || favorites.includes(g.id)),
      ),
    [categoryMatches, showPending, showFavorites, favorites],
  );
  const homeFeatured = !query.trim() && !showFavorites && category === "Todas" && !showAllGuides;
  const featuredGuideGroups = ["Salud mental", "Bienestar físico", "Salud", "Bancos", "Billeteras", "Servicios", "Trámites", "Comercios"];
  const visibleGuides = useMemo(() => {
    if (!homeFeatured) return filteredMatches;
    const preferredTitles = {
      "Salud mental": ["Pedir orientación emocional o psicológica", "Ansiedad y manejo del estrés"],
      "Bienestar físico": ["Consultar el programa nacional de vacunación PAI", "Consultar orientación de salud bucal"],
      Salud: ["Solicitar una cita médica en mi EPS", "Consultar a qué EPS estoy afiliado"],
      Bancos: ["Transferir entre cuentas Bancolombia", "Consultar movimientos y extractos en Bancolombia"],
      Billeteras: ["Enviar plata a otro Nequi", "Pagar una factura de servicios públicos con Nequi"],
      Servicios: ["Pagar o consultar la factura de energía", "Consultar un duplicado de la factura de Aguas de Cartagena"],
      Trámites: ["Consultar la vigencia del SOAT", "Buscar un trámite en GOV.CO"],
      Comercios: ["Consultar medios de pago en Tiendas Ara", "Consultar cómo pedir garantía por un producto defectuoso"],
    };
    return featuredGuideGroups.flatMap((group) => {
      const groupGuides = filteredMatches.filter((g) => categoryForGuide(g) === group);
      const ranked = [...groupGuides].sort((a, b) => {
        const aIndex = preferredTitles[group].indexOf(a.title);
        const bIndex = preferredTitles[group].indexOf(b.title);
        return (aIndex < 0 ? 99 : aIndex) - (bIndex < 0 ? 99 : bIndex);
      });
      return ranked.slice(0, 4);
    });
  }, [filteredMatches, homeFeatured]);
  const pendingMatchesHidden =
    !showFavorites &&
    !showPending &&
    categoryMatches.length > 0 &&
    categoryMatches.every((g) => g.status === "pending");
  const singleSearchResult =
    Boolean(query.trim()) &&
    category === "Todas" &&
    !showFavorites &&
    matches.length === 1 &&
    filteredMatches.length === 1;
  const sourceCounts = useMemo(
    () => ({
      reviewed: catalog.guides.filter((g) => g.status === "verified").length,
      pending: catalog.guides.filter((g) => g.status === "pending").length,
      visible: filteredMatches.length,
    }),
    [catalog, filteredMatches],
  );
  const resumeGuide = resumeGuideId
    ? catalog.guides.find(
        (g) =>
          g.id === resumeGuideId &&
          g.status === "verified" &&
          readProgress(g.id) > 0,
      )
    : null;
  const favoriteGuides = useMemo(
    () =>
      favorites
        .map((id) =>
          catalog.guides.find((g) => g.id === id && g.status === "verified"),
        )
        .filter(Boolean),
    [catalog, favorites],
  );
  const favoriteIdSet = useMemo(
    () => new Set(favoriteGuides.map((g) => g.id)),
    [favoriteGuides],
  );
  useEffect(() => {
    if (catalogState === "ready" && showFavorites && !favoriteGuides.length) {
      setShowFavorites(false);
    }
  }, [catalogState, showFavorites, favoriteGuides.length]);
  useEffect(() => {
    writeLocal("autonomia-dorada-favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    writeLocal("autonomia-dorada-show-favorites", String(showFavorites));
  }, [showFavorites]);
  const toggleFavorite = (id) => {
    const wasSaved = favorites.includes(id);
    setFavoritePulseAction(wasSaved ? "removed" : "saved");
    setFavoritePulseId(id);
    window.clearTimeout(favoritePulseTimerRef.current);
    favoritePulseTimerRef.current = window.setTimeout(() => setFavoritePulseId((current) => current === id ? null : current), 700);
    setFavorites((items) =>
      items.includes(id)
        ? items.filter((item) => item !== id)
        : [...items, id].slice(-30),
    );
    setNotice(
      wasSaved
        ? "Quitamos la guía de tus favoritas."
        : "Guardamos la guía en este dispositivo.",
    );
  };
  const removeQuickFavorite = (id) => {
    if (favoriteRemovingId) return;
    setFavoritePulseAction("removed");
    setFavoritePulseId(id);
    setFavoriteRemovingId(id);
    setNotice("Quitamos la guía de tus favoritas.");
    window.clearTimeout(favoritePulseTimerRef.current);
    favoritePulseTimerRef.current = window.setTimeout(() => setFavoritePulseId((current) => current === id ? null : current), 700);
    window.setTimeout(() => {
      setFavorites((items) => items.filter((item) => item !== id));
      setFavoriteRemovingId((current) => current === id ? null : current);
    }, 360);
  };
  const scrollCategoryTabs = (direction) => categoryTabsRef.current?.scrollBy({
    left: direction * Math.max(180, Math.round(categoryTabsRef.current.clientWidth * 0.7)),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
  });
  const startSpeak = () => {
    if (!voiceAvailable) {
      setNotice(
        "Este navegador no ofrece lectura en voz alta. Las instrucciones siguen disponibles por escrito.",
      );
      return;
    }
    cancelSpeech();
    const generation = speechGeneration.current;
    const utterance = new SpeechSynthesisUtterance(
      activeStep?.instruction || guide?.description || "",
    );
    utterance.lang = "es-CO";
    utterance.rate = 0.9;
    const selectedVoice = chooseNarrationVoice(availableVoices, voicePreference);
    if (selectedVoice) utterance.voice = selectedVoice;
    setVoice("speaking");
    utterance.onstart = () => {
      if (generation === speechGeneration.current) setVoice("speaking");
    };
    utterance.onend = utterance.onerror = () => {
      if (generation === speechGeneration.current) setVoice("idle");
    };
    window.speechSynthesis.speak(utterance);
  };
  const narrateText = (text) => {
    if (!narrativeMode || !voiceAvailable || voice !== "idle" || !text?.trim()) return;
    cancelSpeech();
    const generation = speechGeneration.current;
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = "es-CO";
    utterance.rate = 0.9;
    const selectedVoice = chooseNarrationVoice(availableVoices, voicePreference);
    if (selectedVoice) utterance.voice = selectedVoice;
    setNarration("speaking");
    utterance.onstart = () => {
      if (generation === speechGeneration.current) setNarration("speaking");
    };
    utterance.onend = utterance.onerror = () => {
      if (generation === speechGeneration.current) setNarration("idle");
    };
    window.speechSynthesis.speak(utterance);
  };
  const narrateAtPoint = (event) => {
    if (!narrativeMode || !voiceAvailable || voice !== "idle") return;
    const now = performance.now();
    if (now - lastNarrationAt.current < 120) return;
    lastNarrationAt.current = now;
    const point = document.caretPositionFromPoint?.(event.clientX, event.clientY);
    let textNode = point?.offsetNode;
    let offset = point?.offset;
    if (!textNode) {
      const range = document.caretRangeFromPoint?.(event.clientX, event.clientY);
      textNode = range?.startContainer;
      offset = range?.startOffset;
    }
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
    const content = textNode.textContent || "";
    if (!Number.isFinite(offset)) return;
    const wordPattern = /[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu;
    let match;
    while ((match = wordPattern.exec(content))) {
      if (offset < match.index || offset > match.index + match[0].length) continue;
      const block = textNode.parentElement?.closest(
        "p, h1, h2, h3, button, a, label, li, small, summary, [role='button']",
      );
      if (!block || block.closest(".topbar, .site-footer, .voice-controls, .font-controls, input")) return;
      if (block === lastNarrationTarget.current) return;
      lastNarrationTarget.current = block;
      narrateText(block.innerText || block.textContent || match[0]);
      return;
    }
  };
  const narrateTouch = (event) => {
    if (!narrativeMode || !voiceAvailable || voice !== "idle" || event.detail === 0 || !window.matchMedia("(pointer: coarse)").matches) return;
    const block = event.target.closest(
      "p, h1, h2, h3, li, small, button, a, label, [role='button']",
    );
    if (!block || block.closest(".topbar, .site-footer, .voice-controls, .font-controls, input, .source-link, .official-link-list")) return;
    narrateText(block.innerText || block.textContent || "");
  };
  const setNarrativeEnabled = (enabled) => {
    if (enabled && !voiceAvailable) {
      setNotice("La lectura en voz alta no está disponible en este navegador.");
      return;
    }
    cancelSpeech();
    setNarrativeMode(enabled);
    lastNarrationTarget.current = null;
  };
  const pauseSpeak = () => {
    window.speechSynthesis.pause();
    setVoice("paused");
  };
  const resumeSpeak = () => {
    window.speechSynthesis.resume();
    setVoice("speaking");
  };
  const stopSpeak = () => cancelSpeech();
  useEffect(() => {
    if (voice !== "idle") stopSpeak();
  }, [selected, stepIndex]);
  const resetFont = () => setFont(1);
  const move = (delta) => {
    const next = stepIndex + delta;
    if (next >= 0 && next < (guide?.steps?.length || 0)) {
      stopSpeak();
      setStepIndex(next);
      setStepTransition(true);
      window.setTimeout(() => setStepTransition(false), 420);
      if (guide) {
        writeLocal(`autonomia-dorada-progress-${guide.id}`, String(next));
        writeLocal("autonomia-dorada-last-guide", guide.id);
        writeLocal("autonomia-dorada-show-resume", "true");
        setShowResume(true);
        setResumeGuideId(guide.id);
      }
      requestAnimationFrame(() => {
        document.getElementById("active-step-heading")?.focus({ preventScroll: true });
        document.querySelector(".step-card")?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      });
    }
  };
  const showResults = !guide;

  if (catalogState === "loading")
    return (
      <div className="boot-screen">
        <span className="boot-mark"><img src="/brands/autonomia-dorada-logo.jpg" alt="" /></span>
        <LoaderCircle size={24} className="spin" />
        <strong>Abriendo tus guías</strong>
        <p>Un momento, estamos preparando el catálogo.</p>
      </div>
    );
  if (catalogState === "error")
    return (
      <div className="boot-screen boot-screen--error">
        <span className="boot-mark"><img src="/brands/autonomia-dorada-logo.jpg" alt="" /></span>
        <span className="boot-error-icon">
          <Info size={24} />
        </span>
        <strong>No pudimos conectar con la aplicación.</strong>
        <p>
          El catálogo no respondió después de varios intentos. Si acabas de
          iniciar Autonomía Dorada, espera un momento y vuelve a probar.
        </p>
        <button
          className="button button--primary"
          onClick={() => {
            setCatalogState("loading");
            setCatalogRetry((value) => value + 1);
          }}
        >
          <RefreshCw size={17} /> Intentar de nuevo
        </button>
      </div>
    );

  return (
    <div
      className={`app-shell${narrativeMode ? " narrative-mode" : ""}`}
      onPointerMoveCapture={(event) => {
        if (event.pointerType === "mouse") narrateAtPoint(event);
      }}
      onClickCapture={narrateTouch}
    >
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <header className="topbar">
        <button
          className="brand"
          onClick={goHome}
          aria-label="Autonomía Dorada, volver al inicio"
        >
          <span className="brand-mark" aria-hidden="true"><img src="/brands/autonomia-dorada-logo.jpg" alt="" /></span>
          <span className="brand-name">Autonomía Dorada</span>
        </button>
        <nav className="top-nav" aria-label="Navegación principal">
          <button type="button" onClick={() => guide ? backToGuides() : focusCatalog()}>
            <BookOpenCheck size={17} /> Explorar guías
          </button>
        </nav>
        <div className="top-actions">
          <button
            className="narrative-toggle"
            type="button"
            aria-pressed={narrativeMode}
            aria-label={
              narrativeMode
                ? narration === "speaking"
                  ? "Desactivar lectura de texto; se está leyendo"
                  : "Desactivar lectura de texto"
                : "Activar lectura de texto al pasar el cursor o tocarlo"
            }
            onClick={() => setNarrativeEnabled(!narrativeMode)}
            title="Activa la lectura al pasar el cursor o tocar texto"
          >
            <Headphones size={17} />
            <span>
              {narrativeMode
                ? narration === "speaking"
                  ? "Leyendo…"
                  : "Lectura activa"
                : <><span className="narrative-label-desktop">Escuchar</span><span className="narrative-label-mobile">Escuchar</span></>}
            </span>
          </button>
          <div className="font-controls" aria-label="Tamaño del texto">
            <button
              aria-label="Reducir tamaño de letra"
              title="A−: disminuir el tamaño del texto"
              onClick={() =>
                setFont((f) => Math.max(0.9, +(f - 0.1).toFixed(1)))
              }
              disabled={font <= 0.9}
            >
              A−
            </button>
            <button
              className="font-status"
              aria-live="polite"
              aria-label={`Tamaño de letra: ${font === 1 ? "normal" : font < 1 ? "pequeño" : "grande"}. Restablecer a normal`}
              onClick={resetFont}
            >
              {font === 1 ? "Normal" : font < 1 ? "Pequeño" : "Grande"}
            </button>
            <button
              aria-label="Aumentar tamaño de letra"
              title="A+: aumentar el tamaño del texto"
              onClick={() =>
                setFont((f) => Math.min(1.3, +(f + 0.1).toFixed(1)))
              }
              disabled={font >= 1.3}
            >
              A+
            </button>
          </div>
          <button type="button" className="icon-action settings-toggle" aria-label="Configuración de lectura" title="Configuración de lectura" aria-expanded={showSettings} aria-controls="accessibility-settings" onClick={() => setShowSettings((value) => !value)}>
            <Settings2 size={19} /><span className="settings-label-desktop">Configuración</span><span className="settings-label-mobile">Ajustes</span>
          </button>
          <button
            id="help-toggle"
            className="icon-action"
            onClick={() => showHelp ? setShowHelp(false) : openHelp()}
            aria-expanded={showHelp}
            aria-controls="help-panel"
            aria-label="Ayuda"
          >
            <CircleHelp />
            <span>Ayuda</span>
          </button>
        </div>
      </header>
      <main id="main-content" className="main-content" tabIndex={-1}>
        {showSettings && <section id="accessibility-settings" className="settings-panel" aria-labelledby="settings-title">
              <div><h2 id="settings-title">Configuración de lectura</h2><p><strong>A−</strong> reduce el tamaño de las letras. <strong>A+</strong> lo aumenta. Toca “Normal” para restablecer.</p></div>
          <div className="settings-font-preview"><span>Texto de ejemplo</span><div className="font-controls" aria-label="Tamaño del texto">
            <button type="button" aria-label="Reducir tamaño de letra" title="Disminuir tamaño" disabled={font <= 0.9} onClick={() => setFont((value) => Math.max(0.9, +(value - 0.1).toFixed(1)))}>A−</button><button type="button" className="font-status" onClick={resetFont}>{font === 1 ? "Normal" : font < 1 ? "Pequeño" : "Grande"}</button><button type="button" aria-label="Aumentar tamaño de letra" title="Aumentar tamaño" disabled={font >= 1.3} onClick={() => setFont((value) => Math.min(1.3, +(value + 0.1).toFixed(1)))}>A+</button>
          </div></div>
          <div className="settings-voice"><strong><Headphones size={17}/> Voz de lectura</strong>{voiceAvailable ? <><label htmlFor="settings-voice-select">Idioma y voz</label><select id="settings-voice-select" value={voicePreference} onChange={(event) => setVoicePreference(event.target.value)}><option value="auto">Automática · español de Colombia si está disponible</option>{availableVoices.filter((item) => item.lang?.toLowerCase().startsWith("es")).map((item) => <option key={item.voiceURI} value={`voice:${item.voiceURI}`}>{item.name} · {item.lang}</option>)}</select><small>Depende del teléfono y del navegador. Puedes elegir otra voz en español cuando esté disponible.</small></> : <small>Este navegador no ofrece lectura en voz alta; la guía sigue disponible por escrito.</small>}</div>
        </section>}
        {showHelp && (
          <section id="help-panel" className="help-panel" aria-labelledby="help-title">
            <div className="help-panel-heading">
              <div>
                <h2 id="help-title" tabIndex={-1}>Estamos aquí para orientarte</h2>
                <p>Elige una tarea, sigue los pasos y consulta la fuente oficial cuando la necesites.</p>
              </div>
              <button
                className="help-close"
                type="button"
                onClick={() => {
                  setShowHelp(false);
                  document.getElementById("help-toggle")?.focus();
                }}
                aria-label="Cerrar ayuda"
              ><X size={20} /></button>
            </div>
            <div className="help-panel-grid">
              <div className="help-contact">
                <div className="help-contact-art"><img src="/brands/minsalud.png" alt="Logo del Ministerio de Salud y Protección Social" /><span>ORIENTACIÓN OFICIAL EN SALUD MENTAL</span></div>
                <div className="help-contact-copy">
                  <span className="help-card-label">¿NECESITAS HABLAR CON ALGUIEN?</span>
                  <h3>Línea Nacional de Salud Mental</h3>
              <a className="help-number" href="tel:106" aria-label="Llamar a la Línea Nacional de Salud Mental 106"><span>106</span><span className="help-call-icon"><Phone size={20} /> Llamar ahora</span></a>
              <a className="help-number" href="tel:125" aria-label="En Cartagena, llamar al CRUED 125 para orientación en salud"><span>125</span><span className="help-call-icon"><Phone size={20} /> CRUED Cartagena · llamar</span></a>
                  <p>El Distrito publica también el CRUED 125 como línea local de atención. <a href="https://cartagena.gov.co/noticias/cartagena-el-primer-ente-territorial-pais-mesa-permanente-para-prevencion-conducta-suicida" target="_blank" rel="noopener noreferrer">Ver fuente de la Alcaldía</a>.</p>
                  <div className="help-service-points"><span><CheckCircle2 size={15}/> Gratuita</span><span><ShieldCheck size={15}/> Confidencial</span><span><Clock3 size={15}/> 24 horas</span></div>
                  <p>Recibe escucha, apoyo inicial y orientación. También puedes consultar las <a href="https://minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx" target="_blank" rel="noopener noreferrer">líneas de tu territorio</a>.</p>
                  <small>La orientación no sustituye una consulta. Si hay peligro inmediato, acude a urgencias o llama a emergencias en tu territorio.</small>
                </div>
              </div>
              <div className="help-steps">
                <strong>¿Cómo usar esta web?</strong>
                <ol>
                  <li>Busca lo que quieres hacer.</li>
                  <li>Abre una guía y avanza a tu ritmo.</li>
                  <li>Revisa el enlace oficial antes de actuar.</li>
                </ol>
                <button type="button" onClick={() => { setShowHelp(false); guide ? backToGuides() : focusCatalog(); }}>
                  Ver las guías <ArrowRight size={17} />
                </button>
              </div>
            </div>
            <p className="help-safety"><ShieldCheck size={17} /> Nunca solicitamos contraseñas, claves ni códigos de seguridad.</p>
          </section>
        )}
        {showResults ? (
          <>
            {showWelcome && <section className={`welcome-card${welcomeLeaving ? " is-leaving" : ""}`} aria-labelledby="welcome-title">
              <span className="welcome-mark"><img src="/brands/autonomia-dorada-logo.jpg" alt="" /></span>
              <div className="welcome-copy"><h2 id="welcome-title"><span className="welcome-title-full">Te damos la bienvenida</span><span className="welcome-title-short">¡Hola!</span></h2><p>Encuentra orientación clara y avanza a tu ritmo.</p></div>
              <button type="button" className="welcome-action" onClick={dismissWelcome}>Empezar <ArrowRight size={17}/></button>
              <button type="button" className="welcome-dismiss" aria-label="Omitir bienvenida" title="Omitir bienvenida" onClick={dismissWelcome}><X size={18}/></button>
            </section>}
            <section className="search-intro">
              <h1>
                ¿Qué quieres
                <br className="mobile-break" /> hacer hoy?
              </h1>
              <p>
                Trámites, salud y tareas digitales. Tú decides cada paso.
              </p>
              <form
                className="search-box"
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  showSearchResults();
                }}
              >
                <Search size={25} strokeWidth={2.4} />
                <label className="sr-only" htmlFor="task-search">
                  Busca una tarea
                </label>
                <input
                  id="task-search"
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCategory("Todas");
                  }}
                  placeholder="Ej.: cita médica o psicología"
                  autoComplete="off"
                />
                <button type="submit" aria-label="Buscar">
                  <span>Buscar</span>
                  <ArrowRight size={19} />
                </button>
              </form>
              <div className="popular-queries">
                <span>Atajos:</span>
                {["Pedir una cita médica", "Hablar con alguien", "Consultar mi EPS"].map(
                  (term) => (
                    <button key={term} onClick={() => showSearchResults(term)}>
                      {term}
                      <ArrowRight size={13} />
                    </button>
                  ),
                )}
              </div>
            </section>
            {resumeGuide && showResume && !query.trim() && !showFavorites && (
              <div className="resume-card">
                <button
                  className="resume-open"
                  onClick={() => openGuide(resumeGuide)}
                  aria-label={`Continuar ${resumeGuide.title}, paso ${readProgress(resumeGuide.id) + 1} de ${resumeGuide.steps.length}`}
                >
                  <span className="resume-icon">
                    <RotateCcw size={19} />
                  </span>
                  <span className="resume-copy">
                    <span>PUEDES CONTINUAR</span>
                    <strong>{resumeGuide.title}</strong>
                    <small>
                      Paso {readProgress(resumeGuide.id) + 1} de{" "}
                      {resumeGuide.steps.length} · Tu avance está guardado en
                      este dispositivo
                    </small>
                  </span>
                  <span className="resume-continue">
                    Continuar <ArrowRight size={16} />
                  </span>
                </button>
                <button
                  className="resume-dismiss"
                  type="button"
                  aria-label="Ocultar sugerencia de continuación"
                  title="Ocultar esta sugerencia"
                  onClick={() => {
                    writeLocal("autonomia-dorada-show-resume", "false");
                    setShowResume(false);
                  }}
                >
                  ×
                </button>
              </div>
            )}
            {favoriteGuides.length > 0 && (!query.trim() || showFavorites) && (
              <section
                className="favorites-section"
                aria-labelledby="favorites-title"
              >
                <div className="favorites-heading">
                  <div>
                    <h2 id="favorites-title">Tus guías favoritas</h2>
                    <p>Guardadas solo en este dispositivo.</p>
                  </div>
                  <button
                    className="favorite-filter"
                    aria-pressed={showFavorites}
                    onClick={() => {
                      if (!showFavorites) {
                        setQuery("");
                        setCategory("Todas");
                      }
                      setShowFavorites((value) => !value);
                      focusCatalog();
                    }}
                  >
                    <Bookmark
                      size={17}
                      fill={showFavorites ? "currentColor" : "none"}
                    />
                    {showFavorites
                      ? "Mostrar todas las guías"
                      : "Ver solo favoritas"}
                    <span>{favoriteGuides.length}</span>
                  </button>
                </div>
                {!showFavorites && (
                  <div className="favorite-quick-list">
                    {favoriteGuides.map((g) => (
                      <div className={`favorite-quick${favoriteRemovingId === g.id ? " is-removing" : ""}`} key={`favorite-${g.id}`}>
                        <button
                          type="button"
                          className="favorite-quick-open"
                          onClick={() => openGuide(g)}
                          aria-label={`Abrir ${g.title}`}
                        >
                          <EntityMark className="card-icon" entityId={g.entity_id} />
                          <span className="favorite-quick-copy"><small>{g.entity_name}</small><strong>{g.title}</strong></span>
                          <ArrowRight size={18} />
                        </button>
                        <button
                          type="button"
                          className={`favorite-quick-remove${favoritePulseId === g.id && favoritePulseAction === "removed" ? " just-removed" : ""}`}
                          onClick={() => removeQuickFavorite(g.id)}
                          disabled={favoriteRemovingId === g.id}
                          aria-label={`Quitar ${g.title} de favoritos`}
                          title="Quitar de favoritos"
                        ><Bookmark size={17} fill="currentColor" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
            <section className="catalog-section" id="guide-list">
              <div className="section-heading">
                <div>
                  <h2 id="catalog-heading" tabIndex={-1}>
                    {query
                      ? "Resultados"
                      : showFavorites
                        ? "Solo tus favoritas"
                        : "Guías para cada día"}
                  </h2>
                  <p aria-live="polite" aria-atomic="true">
                    {query
                      ? `${filteredMatches.length} ${filteredMatches.length === 1 ? "resultado" : "resultados"}${showFavorites ? " entre tus favoritas" : ""} para “${query}”.`
                      : showFavorites
                        ? "Las guías que guardaste en este dispositivo."
                        : "Elige una categoría o busca con tus propias palabras."}
                  </p>
                </div>
                {!singleSearchResult && <span className="catalog-count">
                  {showFavorites ? (
                    <>
                      <Bookmark size={14} /> {favoriteGuides.length}{" "}
                      {favoriteGuides.length === 1 ? "guía guardada" : "guías guardadas"}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={14} />
                      {catalog.guides.filter((g) => g.status === "verified").length}{" "}
                      guías revisadas <span>·</span>{" "}
                      {catalog.guides.filter((g) => g.status === "pending").length}{" "}
                      en revisión
                    </>
                  )}
                </span>}
              </div>
              {!singleSearchResult && <div className="category-filter-shell">
                <span className="category-label"><ListFilter size={15} /> VER POR:</span>
                <button type="button" className="category-scroll-button category-scroll-button--left" aria-label="Ver categorías anteriores" onClick={() => scrollCategoryTabs(-1)}><ChevronLeft size={17}/></button>
                <nav
                ref={categoryTabsRef}
                id="category-tabs"
                className="category-tabs"
                aria-label="Filtrar guías por tipo"
                tabIndex={0}
                aria-describedby="category-scroll-hint"
              >
                {categoryNames.map((name) => {
                  const Icon = categoryIcon[name];
                  return (
                    <button
                      key={name}
                      className={`category-tab ${category === name ? "is-active" : ""}`}
                      aria-pressed={category === name}
                      onClick={() => setCategory(name)}
                    >
                      <Icon size={16} />
                      <span>{name}</span>
                      {name !== "Todas" && <span className="category-count">{catalog.guides.filter((guide) => categoryForGuide(guide) === name).length}</span>}
                    </button>
                  );
                })}
                </nav>
                <button type="button" className="category-scroll-button category-scroll-button--right" aria-label="Ver más categorías" onClick={() => scrollCategoryTabs(1)}><ChevronRight size={17}/></button>
              </div>}
              {!query && !showFavorites && category === "Todas" && <p className="catalog-health-note">Las guías «En revisión» aún no tienen sus pasos verificados.</p>}
              {!singleSearchResult && <p id="category-scroll-hint" className="category-scroll-hint">En celular, desliza estas categorías hacia los lados para ver más.</p>}
              {!showFavorites && !singleSearchResult && !homeFeatured && <div className="catalog-options">
                <label className="pending-toggle">
                  <input
                    type="checkbox"
                    checked={showPending}
                    onChange={(e) => setShowPending(e.target.checked)}
                  />
                  <span className="toggle-check">
                    <Check size={13} />
                  </span>
                  <span>Mostrar guías en revisión</span>
                  <span className="pending-count">
                    {
                      catalog.guides.filter((g) => g.status === "pending")
                        .length
                    }
                  </span>
                </label>
                <p className="catalog-status-legend">
                  <CheckCircle2 size={14} /> Pasos revisados <span>·</span>
                  <Clock3 size={14} /> En revisión
                </p>
              </div>}
              {!showFavorites && !singleSearchResult && <div className="catalog-filter-note" aria-live="polite">{homeFeatured ? "Explora cuatro guías por categoría." : category !== "Todas" ? `Mostrando guías de ${category}.` : "Mostrando todas las guías disponibles."}</div>}
              {visibleGuides.length ? (
                homeFeatured ? (
                  <div className="featured-guide-groups">
                    {featuredGuideGroups.map((group) => {
                      const groupGuides = visibleGuides.filter((guide) => categoryForGuide(guide) === group);
                      return (
                        <section className="featured-guide-group" key={group} aria-labelledby={`featured-${categorySlug(group)}`}>
                          <div className="featured-guide-heading">
                            <div><span>{groupGuides.length} guías</span><h3 id={`featured-${categorySlug(group)}`}>{group}</h3></div>
                            <button type="button" onClick={() => { setCategory(group); requestAnimationFrame(() => categoryTabsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" })); }}>
                              Ver todas <ArrowRight size={16} />
                            </button>
                          </div>
                          <div className="guide-grid">
                            {groupGuides.map((g) => (
                              <GuideCard key={g.id} guide={g} onClick={() => openGuide(g)} favoritePulse={favoritePulseId === g.id ? favoritePulseAction : null} isFavorite={favoriteIdSet.has(g.id)} onToggleFavorite={() => toggleFavorite(g.id)} onNarrate={narrativeMode ? () => narrateText(`${g.entity_name}. ${g.title}. ${g.description}`) : null} />
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  <div className="guide-grid">
                    {visibleGuides.map((g) => (
                      <GuideCard key={g.id} guide={g} onClick={() => openGuide(g)} favoritePulse={favoritePulseId === g.id ? favoritePulseAction : null} isFavorite={favoriteIdSet.has(g.id)} onToggleFavorite={() => toggleFavorite(g.id)} onNarrate={narrativeMode ? () => narrateText(`${g.entity_name}. ${g.title}. ${g.description}`) : null} />
                    ))}
                  </div>
                )
              ) : (
                <div className="empty-state">
                  <span className="empty-illustration">
                    <Search size={30} />
                  </span>
                  <h3>
                    {showFavorites
                      ? "No hay favoritas con este filtro."
                      : pendingMatchesHidden
                        ? "Hay guías en revisión ocultas."
                        : matches.length
                          ? "No hay guías en esta categoría."
                          : "No encontramos esa guía todavía."}
                  </h3>
                  <p>
                    {showFavorites
                      ? "Prueba otra categoría o vuelve a ver todas las guías."
                      : pendingMatchesHidden
                        ? "Muéstralas para ver su estado y el canal oficial."
                        : matches.length
                          ? "Prueba con otra categoría."
                          : "Prueba con otras palabras o vuelve a ver las guías disponibles."}
                  </p>
                  <div>
                    <button
                      className="button button--primary"
                      onClick={() => {
                        if (pendingMatchesHidden) setShowPending(true);
                        else {
                          setQuery("");
                          setCategory("Todas");
                          setShowPending(true);
                          setShowFavorites(false);
                        }
                      }}
                    >
                      {pendingMatchesHidden
                        ? "Mostrar guías en revisión"
                        : "Ver las guías"}
                    </button>
                    <button
                      className="button button--secondary"
                      onClick={() =>
                        document.getElementById("task-search")?.focus()
                      }
                    >
                      Intentar otra búsqueda
                    </button>
                  </div>
                  <small>
                    Si la guía no está verificada, no mostramos pasos de pago o
                    transferencia.
                  </small>
                </div>
              )}
              {homeFeatured && filteredMatches.length > visibleGuides.length && <div className="catalog-more"><span>Más temas para tu día a día.</span><button type="button" onClick={() => {setShowAllGuides(true);setAllGuidesManuallyOpened(true);}}>Ver las {filteredMatches.length} guías <ArrowRight size={17}/></button></div>}
              {!homeFeatured && !query.trim() && !showFavorites && category === "Todas" && allGuidesManuallyOpened && <div className="catalog-more"><span>Estás viendo el catálogo completo.</span><button type="button" onClick={() => {setShowAllGuides(false);setAllGuidesManuallyOpened(false);focusCatalog();}}>Volver a las recomendaciones</button></div>}
              <section
                className="source-summary"
                aria-labelledby="source-summary-title"
              >
                <div className="source-summary-mark">
                  <ShieldCheck size={21} />
                </div>
                <div className="source-summary-copy">
                  <h2 id="source-summary-title">
                    Sabes quién respalda cada guía.
                  </h2>
                  <p>
                    Las instrucciones revisadas muestran su fuente. Si aún no
                    confirmamos los pasos, te lo decimos con claridad y te
                    dirigimos al canal oficial.
                  </p>
                  <button
                    className="links-toggle"
                    aria-expanded={showOfficialLinks}
                    aria-controls="official-links-panel"
                    onClick={() => setShowOfficialLinks((v) => !v)}
                  >
                    <span>
                      {showOfficialLinks
                        ? "Cerrar"
                        : "Consultar fuentes y canales"}
                    </span>
                    {showOfficialLinks ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ArrowRight size={16} />
                    )}
                  </button>
                </div>
                <dl className="source-stats">
                  <div>
                    <dt>{sourceCounts.reviewed}</dt>
                    <dd>guías con pasos revisados</dd>
                  </div>
                  <div>
                    <dt>{sourceCounts.pending}</dt>
                    <dd>guías en revisión</dd>
                  </div>
                </dl>
              </section>
              {showOfficialLinks && (
                <section
                  className="official-links"
                  id="official-links-panel"
                  aria-label="Fuentes y canales oficiales"
                >
                  <div className="official-links-heading">
                    <span className="official-links-icon">
                      <ShieldCheck size={19} />
                    </span>
                    <div>
                      <strong>Fuentes y canales oficiales</strong>
                      <p>
                        Una página oficial puede orientar, pero no significa que
                        hayamos confirmado el paso a paso. Revisión registrada:
                        26 de octubre de 2026.
                      </p>
                    </div>
                  </div>
                  <div className="official-link-list">
                    {catalog.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstitutionMark url={link.url} />
                        <span>
                          <strong>{link.purpose}</strong>
                          <small>{link.explanation}</small>
                          <small className="official-link-date">
                            Revisión: {formatCheckedDate(link.checked_at)}
                          </small>
                        </span>
                        <ExternalLink size={16} />
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </section>
            <SiteFooter onHome={goHome} onHelp={openHelp} />
          </>
        ) : (
          <section className="guide-page">
            <button className="back-link" onClick={backToGuides}>
              <ArrowLeft size={19} /> Volver a las guías
            </button>
            <div className="guide-heading">
              <div>
                <h1>{guide.title}</h1>
                <div className="guide-identity">
                  <EntityMark
                    entityId={guide.entity_id}
                    className="entity-initial"
                    size={14}
                  />
                  <span>{guide.entity_name}</span>
                  <span className="eyebrow-separator">·</span>
                  <span>{guide.task}</span>
                </div>
                {guide.status !== "pending" && <p>{guide.description}</p>}
              </div>
              <StatusBadge status={guide.status} />
            </div>
            {guide.status === "pending" ? (
              <PendingGuide
                guide={guide}
                relatedLinks={catalog.links.filter(
                  (link) =>
                    link.entity_id === guide.entity_id &&
                    link.url !== guide.source?.url,
                )}
              />
            ) : (
              <>
                <div className="guide-layout">
                  <aside className="guide-aside">
                    <div className="progress-card">
                      <span className="progress-label">TU AVANCE</span>
                      <strong>
                        Paso {stepIndex + 1}{" "}
                        <span>de {guide.steps.length}</span>
                      </strong>
                      <div
                        className="progress-track"
                        role="progressbar"
                        aria-label="Avance de la guía"
                        aria-valuemin="1"
                        aria-valuemax={guide.steps.length}
                        aria-valuenow={stepIndex + 1}
                      >
                        <span
                          style={{
                            width: `${((stepIndex + 1) / guide.steps.length) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="progress-dots" aria-hidden="true">
                        {guide.steps.map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < stepIndex
                                ? "complete"
                                : i === stepIndex
                                  ? "active"
                                  : ""
                            }
                          />
                        ))}
                      </div>
                      <span className="progress-caption">
                        {stepIndex === 0
                          ? "Vamos con calma"
                          : stepIndex === guide.steps.length - 1
                            ? "Último paso"
                            : "Vas avanzando muy bien"}
                      </span>
                    </div>
                    <div className="prep-card">
                      <span className="prep-icon">
                        <Info size={20} />
                      </span>
                      <h3>Antes de empezar</h3>
                      <p>{guide.preparation}</p>
                      {guide.id !== "runt-soat-consult" && !/clave|código|contraseña/i.test(guide.preparation) && (
                        <p className="prep-safety"><ShieldCheck size={17} />
                          <img className="guide-scene" src={`/guide-scenes/${categorySlug(categoryForGuide(guide))}.svg`} alt="" loading="lazy" decoding="async" />
        {guide.entity_id === "salud-mental" || guide.entity_id === "bienestar-fisico" || guide.entity_id === "rutas-salud" || ["Salud mental", "Bienestar físico", "Salud", "Rutas de salud"].includes(guide.category_group || guide.entity_category || guide.category)
                            ? "Confirma que consultes un sitio oficial."
                            : "Nunca compartas claves ni códigos."}
                        </p>
                      )}
                    </div>
                    {guide.source && (
                      <a
                        href={guide.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link"
                      >
                        <span>
                          <CheckCircle2 size={17} />
                          <span>
                            <span>Canal oficial · {guide.source.publisher}</span>
                            <small>{new URL(guide.source.url).hostname} · Revisado {formatCheckedDate(guide.source.checkedAt)}</small>
                          </span>
                        </span>
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </aside>
                  <article className={`step-card${stepTransition ? " is-transitioning" : ""}`} aria-live="polite">
                    <div className="step-card-top">
                      <span>
                        PASO {stepIndex + 1}{" "}
                        <span className="step-card-meta">
                          DE {guide.steps.length}
                        </span>
                      </span>
                      <span>{guide.entity_name}</span>
                    </div>
                    <div className="step-content">
                      <h2
                        id="active-step-heading"
                        tabIndex={-1}
                        className={voice === "speaking" ? "is-speaking" : ""}
                      >
                        {activeStep?.instruction}
                      </h2>
                      <button
                        type="button"
                        className="artwork-toggle"
                        aria-expanded={showArtwork}
                        aria-controls="step-artwork"
                        onClick={() => setShowArtwork((visible) => !visible)}
                      >
                        {showArtwork ? "Ocultar ejemplo" : "Ver ejemplo del paso"}
                        <ChevronUp size={17} className={showArtwork ? "" : "is-closed"} />
                      </button>
                      <div id="step-artwork" hidden={!showArtwork}>
                        <GuideArtwork
                          guide={guide}
                          stepIndex={stepIndex}
                          instruction={activeStep?.instruction || ""}
                        />
                      </div>
                      <div
                        className={`voice-controls ${voice === "speaking" ? "is-speaking" : ""}`}
                      >
                        <div className="voice-title">
                          <Headphones size={19} />
                          <span>Escuchar este paso</span>
                          <span className="voice-status">
                            {voice === "speaking"
                              ? "Leyendo en voz alta"
                              : voice === "paused"
                                ? "Lectura pausada"
                                : "La lectura empieza cuando tú quieras"}
                          </span>
                        </div>
                        <div className="voice-actions">
                          <div className="voice-buttons">
                            {voice === "paused" ? (
                              <button className="voice-button" onClick={resumeSpeak}><Volume2 size={17}/> Continuar</button>
                            ) : voice === "speaking" ? (
                              <button className="voice-button" onClick={pauseSpeak}><Square size={13}/> Pausar</button>
                            ) : (
                              <button className="voice-button" onClick={startSpeak}><Volume2 size={18}/> Escuchar</button>
                            )}
                            {voice !== "idle" && <button className="voice-button voice-button--quiet" onClick={stopSpeak}>Detener</button>}
                          </div>
                          <button type="button" className="voice-settings-link" onClick={() => {setShowSettings(true); requestAnimationFrame(() => document.getElementById("settings-voice-select")?.focus());}}><Settings2 size={16}/> Configurar voz</button>
                        </div>
                        {!voiceAvailable && (
                          <small>
                            La lectura en voz alta no está disponible en este
                            navegador. Puedes seguir leyendo aquí.
                          </small>
                        )}
                      </div>
                      <div className="step-nav">
                        <button
                          className="button button--secondary"
                          onClick={() => move(-1)}
                          disabled={stepIndex === 0}
                        >
                          <ArrowLeft size={18} /> Anterior
                        </button>
                        {stepIndex < guide.steps.length - 1 ? (
                          <button
                            className="button button--primary"
                            onClick={() => move(1)}
                          >
                            Siguiente <ArrowRight size={18} />
                          </button>
                        ) : (
                          <button
                            className="button button--finish"
                            onClick={() => {
                              removeLocal(`autonomia-dorada-progress-${guide.id}`);
                              removeLocal("autonomia-dorada-last-guide");
                              setResumeGuideId("");
                              setNotice("¡Bien! Terminaste esta guía.");
                              goHome();
                            }}
                          >
                            <Check size={18} /> Terminé
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
                {guide.commonErrors?.length > 0 && (
                  <div className="common-errors">
                    <Info size={19} />
                    <div>
                      <strong>Si algo no sale como esperabas</strong>
                      <ul>
                        {guide.commonErrors.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
            <SiteFooter onHome={goHome} onHelp={openHelp} compact />
          </section>
        )}
      </main>
      {toast && (
        <div className={`toast${toast.startsWith("Quitamos") ? " toast--removed" : ""}`} role="status">
          {toast.startsWith("Quitamos") ? <Bookmark size={20} /> : <CheckCircle2 size={20} />}
          {toast}
        </div>
      )}
    </div>
  );
}

function GuideCard({ guide, onClick, isFavorite = false, onToggleFavorite, onNarrate, favoritePulse = null }) {
  const isVerified = guide.status === "verified";
  return (
    <div
      className={`guide-card ${isVerified ? "guide-card--verified" : "guide-card--pending"}${onNarrate ? " guide-card--narrative" : ""}`}
    >
      <button
        className={`card-open${brandLogoPaths[guide.entity_id] || guide.entity_id === "soat" ? " card-open--with-brand" : ""} ${isVerified ? "card-open--verified" : "card-open--pending"}`}
        onClick={onClick}
        aria-label={`${guide.title}. ${isVerified ? `Guía con ${guide.steps?.length || 0} pasos revisados.` : "Pasos por verificar. Abrir información de estado y canal oficial."}`}
      >
        {guide.entity_id === "salud-mental" || guide.entity_id === "bienestar-fisico" || guide.entity_id === "rutas-salud" || ["Salud mental", "Bienestar físico", "Salud", "Rutas de salud"].includes(guide.category_group || guide.entity_category || guide.category)
          ? <HealthGuideImage guide={guide} />
          : <EntityMark
              className={`card-icon ${isVerified ? "card-icon--verified" : "card-icon--pending"}`}
              entityId={guide.entity_id}
              size={19}
            />}
        <span className="card-main">
          <span className="card-meta">
            {guide.entity_name}
            <span>·</span>
            {guide.task}
          </span>
          <strong>{guide.title}</strong>
          <span className="card-description">{guide.description}</span>
          <span className="card-bottom">
            <span
              className={`card-status ${isVerified ? "card-status--verified" : "card-status--pending"}`}
            >
              {isVerified ? (
                <>
                  <CheckCircle2 size={15} />
                  <span>Pasos revisados</span>
                  <span className="card-step-count">
                    {guide.steps?.length || 0} pasos
                  </span>
                </>
              ) : (
                <>
                  <Clock3 size={15} />
                  <span>En revisión</span>
                </>
              )}
            </span>
            <span className="card-open-cue">
              {isVerified ? "Abrir guía" : "Ver información"} <ArrowRight size={16} />
            </span>
          </span>
        </span>
        <span className="card-arrow">
          <ArrowRight size={20} />
        </span>
      </button>
      {isVerified && onToggleFavorite && (
        <button
          key={`${guide.id}-${favoritePulse || "idle"}`}
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}${favoritePulse === "saved" ? " just-saved" : favoritePulse === "removed" ? " just-removed" : ""}`}
          type="button"
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Quitar ${guide.title} de favoritos`
              : `Guardar ${guide.title} en favoritos`
          }
          title={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Bookmark size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      )}
      {onNarrate && (
        <button
          className="card-listen"
          type="button"
          aria-label={`Escuchar ${guide.title}`}
          onClick={onNarrate}
        >
          <Volume2 size={19} />
          <span>Escuchar</span>
        </button>
      )}
    </div>
  );
}
function StatusBadge({ status }) {
  return (
    <span
      className={`status-badge ${status === "verified" ? "status-badge--verified" : ""}`}
    >
      {status === "verified" ? (
        <>
          <CheckCircle2 size={17} /> Pasos revisados
        </>
      ) : (
        <>
          <Clock3 size={17} /> En revisión
        </>
      )}
    </span>
  );
}
function PendingGuide({ guide, relatedLinks = [] }) {
  return (
    <div className="pending-panel">
      <span className="pending-symbol">
        <Clock3 size={30} />
      </span>
      <div className="pending-copy">
                <h2>{guide.source?.url ? "Consulta el canal oficial" : "Guía en revisión"}</h2>
        <p>Aún no hemos revisado los pasos de esta tarea.</p>
        {guide.source?.url && (
          <>
            <a
              className="button button--primary"
              href={guide.source.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {guide.id === "soat-purchase-pending"
                ? "Leer recomendaciones oficiales sobre el SOAT"
                : `Consultar canal oficial de ${guide.entity_name}`}
              <ExternalLink size={17} />
            </a>
            <small className="pending-destination">Se abrirá: {new URL(guide.source.url).hostname}</small>
          </>
        )}
        <p>{guide.description}</p>
        {guide.source?.checkedAt && (
          <small className="pending-source-date">
            Fuente consultada: {formatCheckedDate(guide.source.checkedAt)}.
          </small>
        )}
        {relatedLinks.length > 0 && (
          <div className="pending-related">
            <h3>Enlaces oficiales útiles</h3>
            <div className="official-link-list pending-related-links">
              {relatedLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <strong>{link.purpose}</strong>
                    <small>{link.explanation}</small>
                    <small className="official-link-date">
                      Revisión: {formatCheckedDate(link.checked_at)}
                    </small>
                  </span>
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
          </div>
        )}
        <p className="pending-small">
          <ShieldCheck size={16} /> Comprueba la dirección oficial. Aquí nunca
          te pedimos claves ni datos de pago.
        </p>
      </div>
    </div>
  );
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error("Autonomía Dorada no pudo mostrar esta pantalla.", error);
  }
  render() {
    if (this.state.hasError)
      return (
        <main className="boot-screen boot-screen--error" role="alert">
          <span className="boot-mark"><img src="/brands/autonomia-dorada-logo.jpg" alt="" /></span>
          <span className="boot-error-icon">
            <Info size={24} />
          </span>
          <strong>No pudimos abrir esta pantalla.</strong>
          <p>
            Vuelve al inicio e intenta abrir la guía otra vez. También puedes
            recargar la página.
          </p>
          <button
            className="button button--primary"
            onClick={() => window.location.assign("/")}
          >
            Volver al inicio
          </button>
        </main>
      );
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>,
);
