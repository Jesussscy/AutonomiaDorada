import React, { useEffect, useMemo, useState } from "react";
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
  LoaderCircle,
  RefreshCw,
  Bookmark,
  X,
  BadgeCheck,
  Phone,
} from "lucide-react";
import "./styles.css";

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
  "Bancos",
  "Billeteras",
  "Servicios",
  "Trámites",
  "Comercios",
];
const categoryIcon = {
  Todas: BookOpenCheck,
  Bancos: Landmark,
  Billeteras: WalletCards,
  Servicios: Zap,
  Trámites: CarFront,
  Comercios: ShoppingBasket,
};
const categoryFor = (guide) =>
  ({
    Bancos: "Bancos",
    Billeteras: "Billeteras",
    "Servicios públicos": "Servicios",
    "Trámites y seguros": "Trámites",
    Comercios: "Comercios",
  })[guide.entity_category] || "Bancos";
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
  Math.floor(readLocalNumber(`p1-progress-${id}`, 0, 0, 9999));
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
      ) : entityId === "davivienda" && logoPath ? (
        <span className="brand-crop brand-crop--davivienda" />
      ) : logoPath ? (
        <img className="brand-logo-image" src={logoPath} alt="" loading="lazy" decoding="async" />
      ) : (
        <Icon size={size} />
      )}
    </span>
  );
}

function SiteFooter({ onHome, onHelp, compact = false }) {
  return (
    <footer className={`site-footer${compact ? " site-footer--compact" : ""}`}>
      <div className="site-footer-main">
        <div className="site-footer-identity">
          <span className="brand-mark" aria-hidden="true">P<span>1</span></span>
          <div>
            <strong>Prueba 1</strong>
            <span>Una guía a tu ritmo.</span>
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
    readLocalBool("p1-show-resume", true),
  );
  const [query, setQuery] = useState(initialSearch);
  const [selected, setSelected] = useState(initialParams.get("guia") || null);
  const [stepIndex, setStepIndex] = useState(() =>
    safeStep(Number(initialParams.get("paso") || 1) - 1, 9999),
  );
  const [font, setFont] = useState(() =>
    readLocalNumber("p1-font", 1, 0.9, 1.3),
  );
  const [voice, setVoice] = useState("idle");
  const [voiceAvailable, setVoiceAvailable] = useState(false);
  const [narrativeMode, setNarrativeMode] = useState(false);
  const [narration, setNarration] = useState("idle");
  const [showArtwork, setShowArtwork] = useState(true);
  const [toast, setToast] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [category, setCategory] = useState("Todas");
  const [showPending, setShowPending] = useState(true);
  const [showOfficialLinks, setShowOfficialLinks] = useState(false);
  const [resumeGuideId, setResumeGuideId] = useState(() =>
    readLocalText("p1-last-guide"),
  );
  const [favorites, setFavorites] = useState(() => {
    try {
      const parsed = JSON.parse(readLocalText("p1-favorites") || "[]");
      return Array.isArray(parsed)
        ? parsed.filter((id) => typeof id === "string").slice(0, 30)
        : [];
    } catch {
      return [];
    }
  });
  const [showFavorites, setShowFavorites] = useState(() =>
    readLocalBool("p1-show-favorites"),
  );
  const lastNarrationTarget = React.useRef(null);
  const lastNarrationAt = React.useRef(0);
  const speechGeneration = React.useRef(0);

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
      ? `${guide.title} · Prueba 1`
      : query
        ? `${query} · Prueba 1`
        : "Prueba 1 — ¿Qué quieres hacer hoy?";
  }, [guide?.title, query]);
  useEffect(() => {
    writeLocal("p1-font", String(font));
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
    return () => window.speechSynthesis?.cancel();
  }, []);
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
    if (history.state?.p1Guide) {
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
    window.scrollTo(0, 0);
  };
  const openGuide = (g) => {
    const params = new URLSearchParams({ guia: g.id, paso: "1" });
    history.pushState(
      { p1Guide: true },
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
        : matches.filter((g) => categoryFor(g) === category),
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
    writeLocal("p1-favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    writeLocal("p1-show-favorites", String(showFavorites));
  }, [showFavorites]);
  const toggleFavorite = (id) => {
    const wasSaved = favorites.includes(id);
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
    utterance.rate = 0.84;
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
    if (!narrativeMode || !voiceAvailable || voice !== "idle" || event.detail === 0) return;
    const block = event.target.closest(
      "p, h1, h2, h3, li, small",
    );
    if (!block || block.closest(".topbar, .site-footer, .voice-controls, .font-controls, input")) return;
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
      if (guide) {
        writeLocal(`p1-progress-${guide.id}`, String(next));
        writeLocal("p1-last-guide", guide.id);
        writeLocal("p1-show-resume", "true");
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
        <span className="boot-mark">
          P<span>1</span>
        </span>
        <LoaderCircle size={24} className="spin" />
        <strong>Abriendo tus guías</strong>
        <p>Un momento, estamos preparando el catálogo.</p>
      </div>
    );
  if (catalogState === "error")
    return (
      <div className="boot-screen boot-screen--error">
        <span className="boot-mark">
          P<span>1</span>
        </span>
        <span className="boot-error-icon">
          <Info size={24} />
        </span>
        <strong>No pudimos conectar con la aplicación.</strong>
        <p>
          El catálogo no respondió después de varios intentos. Si acabas de
          iniciar Prueba 1, espera un momento y vuelve a probar.
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
          aria-label="Prueba 1, volver al inicio"
        >
          <span className="brand-mark">
            P<span>1</span>
          </span>
          <span className="brand-name">Prueba 1</span>
          <span className="brand-pill">Guías a tu ritmo</span>
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
                : <><span className="narrative-label-desktop">Leer al pasar</span><span className="narrative-label-mobile">Leer al tocar</span></>}
            </span>
          </button>
          <div className="font-controls" aria-label="Tamaño del texto">
            <button
              aria-label="Reducir tamaño de letra"
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
              onClick={() =>
                setFont((f) => Math.min(1.3, +(f + 0.1).toFixed(1)))
              }
              disabled={font >= 1.3}
            >
              A+
            </button>
          </div>
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
        {showHelp && (
          <section id="help-panel" className="help-panel" aria-labelledby="help-title">
            <div className="help-panel-heading">
              <div>
                <span className="help-eyebrow"><CircleHelp size={15} /> CENTRO DE AYUDA</span>
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
                <span className="help-card-icon"><Phone size={20} /></span>
                <span className="help-card-label">ASÍ SE VERÍA UNA LÍNEA DE AYUDA</span>
                <strong className="help-number">1 2 3 4 5</strong>
                <p>Número ficticio de demostración. No atiende llamadas; no lo marques.</p>
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
            <section className="search-intro">
              <div className="welcome-kicker">
                <span className="welcome-dot" /> AQUÍ ESTAMOS PARA AYUDARTE
              </div>
              <h1>
                ¿Qué quieres
                <br className="mobile-break" /> hacer hoy?
              </h1>
              <p>
                Cuéntanos qué necesitas hacer. Buscamos una guía sencilla para
                ti.
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
                  placeholder="Ej.: enviar plata, pagar la luz…"
                  autoComplete="off"
                />
                <button type="submit" aria-label="Buscar">
                  <span>Buscar</span>
                  <ArrowRight size={19} />
                </button>
              </form>
              <div className="popular-queries">
                <span>Prueba con:</span>
                {["Enviar plata", "Pagar la luz", "Consultar el SOAT"].map(
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
                    writeLocal("p1-show-resume", "false");
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
                    <span className="section-eyebrow">
                      GUARDADAS EN ESTE DISPOSITIVO
                    </span>
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
                  <div className="guide-grid favorites-grid">
                    {favoriteGuides.map((g) => (
                      <GuideCard
                        key={`favorite-${g.id}`}
                        guide={g}
                        onClick={() => openGuide(g)}
                        isFavorite
                        onToggleFavorite={() => toggleFavorite(g.id)}
                        onNarrate={narrativeMode ? () => narrateText(`${g.entity_name}. ${g.title}. ${g.description}`) : null}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
            <section className="catalog-section" id="guide-list">
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">TU CENTRO DE GUÍAS</span>
                  <h2 id="catalog-heading" tabIndex={-1}>
                    {query
                      ? "Resultados"
                      : showFavorites
                        ? "Solo tus favoritas"
                        : "Encuentra una tarea"}
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
              {!singleSearchResult && <nav
                className="category-tabs"
                aria-label="Filtrar guías por tipo"
              >
                <span className="category-label">
                  <ListFilter size={15} /> VER POR:
                </span>
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
                    </button>
                  );
                })}
              </nav>}
              {!showFavorites && !singleSearchResult && <div className="catalog-options">
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
              {filteredMatches.length ? (
                <div className="guide-grid">
                  {filteredMatches.map((g) => (
                    <GuideCard
                      key={g.id}
                      guide={g}
                      onClick={() => openGuide(g)}
                      isFavorite={favoriteIdSet.has(g.id)}
                      onToggleFavorite={() => toggleFavorite(g.id)}
                      onNarrate={narrativeMode ? () => narrateText(`${g.entity_name}. ${g.title}. ${g.description}`) : null}
                    />
                  ))}
                </div>
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
              <section
                className="source-summary"
                aria-labelledby="source-summary-title"
              >
                <div className="source-summary-mark">
                  <ShieldCheck size={21} />
                </div>
                <div className="source-summary-copy">
                  <span className="section-eyebrow">
                    TRANSPARENCIA Y CONFIANZA
                  </span>
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
                        28 de octubre de 2026.
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
                <div className="guide-eyebrow">
                  <EntityMark
                    entityId={guide.entity_id}
                    className="entity-initial"
                    size={14}
                  />
                  <span>{guide.entity_name}</span>
                  <span className="eyebrow-separator">·</span>
                  <span>{guide.task}</span>
                </div>
                <h1>{guide.title}</h1>
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
                      {!/clave|código|contraseña/i.test(guide.preparation) && (
                        <p className="prep-safety"><ShieldCheck size={17} /> Nunca compartas claves ni códigos.</p>
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
                            <span>Fuente oficial revisada</span>
                            <small>
                              Revisión:{" "}
                              {formatCheckedDate(guide.source.checkedAt)}
                            </small>
                          </span>
                        </span>
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </aside>
                  <article className="step-card" aria-live="polite">
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
                          <span>Escucha este paso</span>
                          <span className="voice-status">
                            {voice === "speaking"
                              ? "Leyendo en voz alta"
                              : voice === "paused"
                                ? "Lectura pausada"
                                : "La lectura empieza cuando tú quieras"}
                          </span>
                        </div>
                        <div className="voice-buttons">
                          {voice === "paused" ? (
                            <button
                              className="voice-button"
                              onClick={resumeSpeak}
                            >
                              <Volume2 size={17} />
                              Continuar
                            </button>
                          ) : voice === "speaking" ? (
                            <button
                              className="voice-button"
                              onClick={pauseSpeak}
                            >
                              <Square size={13} />
                              Pausar
                            </button>
                          ) : (
                            <button
                              className="voice-button"
                              onClick={startSpeak}
                            >
                              <Volume2 size={18} />
                              Escuchar
                            </button>
                          )}
                          {voice !== "idle" && (
                            <button
                              className="voice-button voice-button--quiet"
                              onClick={stopSpeak}
                            >
                              Detener
                            </button>
                          )}
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
                              removeLocal(`p1-progress-${guide.id}`);
                              removeLocal("p1-last-guide");
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
        <div className="toast" role="status">
          <CheckCircle2 size={20} />
          {toast}
        </div>
      )}
    </div>
  );
}

function GuideCard({ guide, onClick, isFavorite = false, onToggleFavorite, onNarrate }) {
  const isVerified = guide.status === "verified";
  return (
    <div
      className={`guide-card ${isVerified ? "guide-card--verified" : "guide-card--pending"}${onNarrate ? " guide-card--narrative" : ""}`}
    >
      <button
        className={`card-open ${isVerified ? "card-open--verified" : "card-open--pending"}`}
        onClick={onClick}
        aria-label={`${guide.title}. ${isVerified ? `Guía con ${guide.steps?.length || 0} pasos revisados.` : "Pasos por verificar. Abrir información de estado y canal oficial."}`}
      >
        <EntityMark
          className={`card-icon ${isVerified ? "card-icon--verified" : "card-icon--pending"}`}
          entityId={guide.entity_id}
          size={19}
        />
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
          className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
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
    console.error("Prueba 1 no pudo mostrar esta pantalla.", error);
  }
  render() {
    if (this.state.hasError)
      return (
        <main className="boot-screen boot-screen--error" role="alert">
          <span className="boot-mark">
            P<span>1</span>
          </span>
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
