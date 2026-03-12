import { useState, useEffect, useRef } from "react";

// ─── Palette (estratta dal logo IRIDIA) ─────────────────────
// Navy scuro: #1a2040 (lettere I,R,I,A)
// Blu indaco: #4050f0 (gradiente D, lato scuro)
// Blu cielo: #50a0f0 / #50b0f0 (gradiente D, lato chiaro + pixel)
// Blu medio: #4090f0 (transizione gradiente)
const C = {
  dark: "#0a0e1a",
  darkCard: "#111627",
  darkBorder: "#1c2340",
  navy: "#141a30",
  blue: "#4090f0",       // blu medio dal gradiente D
  lightBlue: "#50b0f0",  // blu cielo dai pixel del logo
  indigo: "#4050f0",     // blu indaco dal gradiente D
  accent: "#4070f0",     // blend tra indaco e medio
  white: "#edf2f7",
  gray: "#8b9dc3",
  grayLight: "#c4d1e8",
};

// ─── Animated gradient blob (SVG, no deps) ──────────────────
function GradientBlob({ className }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.indigo} stopOpacity="0.20" />
          <stop offset="100%" stopColor={C.lightBlue} stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <circle cx="300" cy="300" r="260" fill="url(#blobGrad)" />
    </svg>
  );
}

// ─── Fade-in on scroll hook ─────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeSection({ children, className = "", delay = 0 }) {
  const [ref, vis] = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────
const navItems = [
  { label: "Home", href: "#hero" },
  { label: "Servizi", href: "#servizi" },
  { label: "Soluzioni", href: "#soluzioni" },
  { label: "Come lavoriamo", href: "#processo" },
  { label: "Chi siamo", href: "#team" },
  { label: "FAQ", href: "#faq" },
  { label: "Contatti", href: "#contatti" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const ids = navItems.map((n) => n.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: C.dark + "ee",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.darkBorder}`,
        transform: scrolled ? "translateY(0)" : "translateY(-100%)",
        opacity: scrolled ? 1 : 0,
        pointerEvents: scrolled ? "auto" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#hero" onClick={(e) => handleClick(e, "#hero")}>
          <img
            src="/logo-iridia.png"
            alt="Iridia"
            className="h-8 w-auto"
            style={{ filter: "brightness(1.6) contrast(1.1)" }}
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => handleClick(e, n.href)}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{
                color: activeSection === n.href.slice(1) ? C.lightBlue : C.gray,
                background: activeSection === n.href.slice(1) ? C.darkCard : "transparent",
              }}
            >
              {n.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          style={{ color: C.white }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? "400px" : "0",
          background: C.dark + "f5",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="px-6 py-4 space-y-1">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => handleClick(e, n.href)}
              className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{
                color: activeSection === n.href.slice(1) ? C.lightBlue : C.gray,
                background: activeSection === n.href.slice(1) ? C.darkCard : "transparent",
              }}
            >
              {n.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ───────────────────────────────────────────────────
function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: C.dark }}>
      <GradientBlob className="absolute w-[900px] h-[900px] -top-48 -right-48 opacity-60 pointer-events-none" />
      <GradientBlob className="absolute w-[600px] h-[600px] -bottom-32 -left-32 opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo */}
        <FadeSection>
          <img
            src="/logo-iridia.png"
            alt="Iridia"
            className="h-20 sm:h-24 md:h-28 w-auto mx-auto mb-8"
            style={{ filter: "brightness(1.6) contrast(1.1)" }}
          />
        </FadeSection>

        <FadeSection delay={0.15}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ color: C.white }}>
            I tuoi sistemi sanno già tutto.
            <br />
            <span style={{ color: C.lightBlue }}>Noi li aiutiamo a parlare.</span>
          </h1>
        </FadeSection>

        <FadeSection delay={0.3}>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: C.gray }}>
            Sviluppiamo app e intelligenza artificiale per le imprese italiane.
            Integriamo l'AI nei sistemi che già usi — senza sostituire niente, senza stravolgere i processi.
            Costruiamo soluzioni concrete. In mesi, non in anni.
          </p>
        </FadeSection>

        <FadeSection delay={0.45}>
          <a
            href="mailto:info@iridia.tech"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg font-semibold text-base transition-all duration-300 hover:scale-105"
            style={{ background: C.accent, color: "#fff" }}
          >
            Scrivici
          </a>
        </FadeSection>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" fill="none" stroke={C.gray} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}

// ─── COSA FACCIAMO ──────────────────────────────────────────
const pillars = [
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke={C.lightBlue} strokeWidth="1.5">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 9l2 2 4-4" />
        <path d="M4 14h16" />
      </svg>
    ),
    title: "App su misura",
    desc: "Progettiamo e sviluppiamo applicazioni web e mobile pensate per i tuoi processi. Niente soluzioni generiche: ogni app nasce dal tuo modo di lavorare.",
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke={C.lightBlue} strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: "Intelligenza artificiale",
    desc: "Costruiamo soluzioni AI che leggono documenti, rispondono a domande, automatizzano report, analizzano feedback e fanno previsioni — sui tuoi dati reali.",
  },
  {
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke={C.lightBlue} strokeWidth="1.5">
        <path d="M8 12h8M12 8v8" />
        <rect x="2" y="6" width="8" height="12" rx="2" />
        <rect x="14" y="6" width="8" height="12" rx="2" />
      </svg>
    ),
    title: "Integrazione con i tuoi sistemi",
    desc: "L'AI si collega al gestionale, all'ERP, al CRM che già usi. Non sostituiamo niente: aggiungiamo uno strato intelligente sopra ciò che funziona.",
  },
];

function WhatWeDo() {
  return (
    <section id="servizi" className="py-24 px-6" style={{ background: C.dark }}>
      <div className="max-w-6xl mx-auto">
        <FadeSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ color: C.white }}>
            Cosa facciamo
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: C.gray }}>
            Builder, non consulenti. Costruiamo software che funziona e intelligenza artificiale che risolve problemi veri.
          </p>
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((p, i) => (
            <FadeSection key={i} delay={i * 0.12}>
              <div
                className="p-8 rounded-2xl border h-full transition-all duration-300 hover:border-blue-500/30"
                style={{ background: C.darkCard, borderColor: C.darkBorder }}
              >
                <div className="mb-5">{p.icon}</div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: C.white }}>{p.title}</h3>
                <p className="leading-relaxed" style={{ color: C.gray }}>{p.desc}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEMI CHE RISOLVIAMO ────────────────────────────────
const problems = [
  {
    problem: "I tuoi tecnici passano mezz'ora a cercare un documento nel gestionale.",
    solution: "L'AI trova qualsiasi informazione in pochi secondi, interrogando tutti i tuoi sistemi in linguaggio naturale.",
  },
  {
    problem: "Ogni mese il report ti costa 3 giorni di lavoro manuale.",
    solution: "L'AI lo genera in automatico: dati aggiornati, formato pronto, zero errori di trascrizione.",
  },
  {
    problem: "I clienti chiamano per le stesse domande, ogni giorno.",
    solution: "Un assistente AI risponde 24/7 con informazioni reali dalla tua knowledge base. Il tuo team si concentra su quello che conta.",
  },
  {
    problem: "I dati passano da un sistema all'altro copiati a mano.",
    solution: "L'AI legge, classifica e trasferisce i dati tra i tuoi sistemi. Tu controlli, non compili.",
  },
];

function Problems() {
  const [flipped, setFlipped] = useState(Array(problems.length).fill(false));

  const toggle = (i) => {
    setFlipped((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <section id="soluzioni" className="py-24 px-6" style={{ background: C.navy }}>
      <div className="max-w-6xl mx-auto">
        <FadeSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ color: C.white }}>
            Problemi reali, soluzioni concrete
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: C.gray }}>
            Clicca su ogni card per vedere come l'AI risolve il problema.
          </p>
        </FadeSection>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((p, i) => (
            <FadeSection key={i} delay={i * 0.1}>
              <div
                className="cursor-pointer group"
                onClick={() => toggle(i)}
              >
                {!flipped[i] ? (
                  <div
                    className="rounded-2xl border p-8 flex flex-col justify-center transition-all duration-300 hover:border-blue-500/30"
                    style={{
                      background: C.darkCard,
                      borderColor: C.darkBorder,
                      minHeight: "180px",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
                      <span className="text-sm font-medium uppercase tracking-wider" style={{ color: "#ef4444" }}>Problema</span>
                    </div>
                    <p className="text-lg leading-relaxed" style={{ color: C.white }}>{p.problem}</p>
                    <p className="mt-4 text-sm" style={{ color: C.gray }}>Clicca per la soluzione →</p>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl border p-8 flex flex-col justify-center transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${C.darkCard}, #0f1f3a)`,
                      borderColor: C.accent,
                      minHeight: "180px",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.lightBlue }} />
                      <span className="text-sm font-medium uppercase tracking-wider" style={{ color: C.lightBlue }}>Soluzione Iridia</span>
                    </div>
                    <p className="text-lg leading-relaxed" style={{ color: C.white }}>{p.solution}</p>
                    <p className="mt-4 text-sm" style={{ color: C.gray }}>← Torna al problema</p>
                  </div>
                )}
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COME LAVORIAMO (PROCESSO) ──────────────────────────────
const steps = [
  { num: "01", title: "Analizziamo", desc: "Guardiamo i tuoi sistemi, capiamo dove l'AI ha impatto reale e ti presentiamo un piano con tempi e costi definiti." },
  { num: "02", title: "Progettiamo", desc: "Disegniamo l'architettura: come l'AI si collega ai tuoi sistemi senza toccare ciò che funziona." },
  { num: "03", title: "Costruiamo", desc: "Sviluppiamo, integriamo, testiamo. Le prime soluzioni sono attive in settimane, non in mesi." },
  { num: "04", title: "Ti rendiamo autonomo", desc: "Formazione, documentazione, handover. A fine progetto il tuo team sa gestire tutto in autonomia." },
];

function Process() {
  return (
    <section id="processo" className="py-24 px-6" style={{ background: C.dark }}>
      <div className="max-w-5xl mx-auto">
        <FadeSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ color: C.white }}>
            Come lavoriamo
          </h2>
          <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: C.gray }}>
            Un percorso chiaro, con tempi definiti e risultati misurabili.
          </p>
        </FadeSection>

        <div className="space-y-0">
          {steps.map((s, i) => (
            <FadeSection key={i} delay={i * 0.12}>
              <div className="flex gap-6 sm:gap-10 items-start py-8 group">
                {/* Timeline */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-colors duration-300 group-hover:border-blue-400"
                    style={{ borderColor: C.darkBorder, color: C.lightBlue, background: C.darkCard }}
                  >
                    {s.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 min-h-[40px]" style={{ background: C.darkBorder }} />
                  )}
                </div>

                {/* Content */}
                <div className="pt-2">
                  <h3 className="text-xl font-semibold mb-2" style={{ color: C.white }}>{s.title}</h3>
                  <p className="leading-relaxed" style={{ color: C.gray }}>{s.desc}</p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── APPROCCIO ──────────────────────────────────────────────
function Approach() {
  return (
    <section className="py-24 px-6" style={{ background: C.navy }}>
      <div className="max-w-4xl mx-auto text-center">
        <FadeSection>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: C.white }}>
            Il nostro approccio
          </h2>
        </FadeSection>

        <FadeSection delay={0.1}>
          <div
            className="rounded-2xl border p-10 sm:p-14 text-left space-y-6"
            style={{ background: C.darkCard, borderColor: C.darkBorder }}
          >
            {[
              "Non sostituiamo i tuoi sistemi. Li rendiamo più intelligenti.",
              "Non vendiamo tecnologia. Risolviamo problemi concreti con l'AI.",
              "Non facciamo progetti senza fine. Tempi definiti, risultati misurabili.",
              "Non creiamo dipendenza. A fine progetto il tuo team è autonomo.",
              "Non parliamo di futuro. Parliamo di quello che cambia lunedì mattina.",
            ].map((line, i) => (
              <p key={i} className="text-lg sm:text-xl leading-relaxed flex items-start gap-4">
                <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: C.lightBlue }} />
                <span style={{ color: C.white }}>{line}</span>
              </p>
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── MERCATO ────────────────────────────────────────────────
function Market() {
  return (
    <section className="py-24 px-6" style={{ background: C.dark }}>
      <div className="max-w-4xl mx-auto">
        <FadeSection>
          <div
            className="rounded-2xl border p-10 sm:p-14 text-center"
            style={{
              background: `linear-gradient(135deg, ${C.darkCard}, #0c1628)`,
              borderColor: C.accent + "33",
            }}
          >
            <p className="text-2xl sm:text-3xl font-semibold leading-snug mb-6" style={{ color: C.white }}>
              Il mercato AI italiano cresce del 50% l'anno.
              <br />
              <span style={{ color: C.lightBlue }}>Ma il 92% delle PMI non ha ancora iniziato.</span>
            </p>
            <p className="text-base max-w-xl mx-auto leading-relaxed mb-2" style={{ color: C.gray }}>
              Il freno non è la tecnologia. È trovare qualcuno che sappia come farlo concretamente,
              con i tuoi sistemi, nei tuoi tempi.
            </p>
            <p className="text-sm" style={{ color: C.gray + "99" }}>
              Fonte: Osservatorio AI, Politecnico di Milano, 2026
            </p>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────
const faqs = [
  {
    q: "Devo sostituire il mio gestionale, ERP o CRM?",
    a: "No. L'AI si integra ai tuoi sistemi tramite API. Non tocchiamo niente di quello che funziona già. Aggiungiamo uno strato intelligente sopra l'esistente.",
  },
  {
    q: "Quanto tempo serve per vedere i primi risultati?",
    a: "Le prime soluzioni sono attive in poche settimane. Non aspetti mesi per capire se funziona — lo vedi subito, sui tuoi dati reali.",
  },
  {
    q: "Il mio team deve avere competenze tecniche?",
    a: "No. La formazione è parte del progetto. L'AI automatizza le attività ripetitive — il tuo team si concentra su quelle a valore. A fine progetto siete autonomi.",
  },
  {
    q: "I nostri dati sono al sicuro?",
    a: "Assolutamente. Lavoriamo su infrastruttura cloud con standard di sicurezza enterprise. I tuoi dati restano nella tua infrastruttura.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faq" className="py-24 px-6" style={{ background: C.navy }}>
      <div className="max-w-3xl mx-auto">
        <FadeSection>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16" style={{ color: C.white }}>
            Domande frequenti
          </h2>
        </FadeSection>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <FadeSection key={i} delay={i * 0.08}>
              <div
                className="rounded-xl border overflow-hidden transition-colors duration-300"
                style={{ background: C.darkCard, borderColor: open === i ? C.accent + "55" : C.darkBorder }}
              >
                <button
                  className="w-full text-left p-6 flex items-center justify-between gap-4"
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  <span className="text-lg font-medium" style={{ color: C.white }}>{f.q}</span>
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke={C.gray}
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="flex-shrink-0 transition-transform duration-300"
                    style={{ transform: open === i ? "rotate(180deg)" : "rotate(0)" }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: open === i ? "200px" : "0", opacity: open === i ? 1 : 0 }}
                >
                  <p className="px-6 pb-6 leading-relaxed" style={{ color: C.gray }}>{f.a}</p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TEAM ───────────────────────────────────────────────────
const teamMembers = [
  {
    name: "Massimiliano Giurelli",
    role: "CTO",
    photo: "/Massimiliano.jpeg",
    linkedin: "https://www.linkedin.com/in/massimiliano-giurelli/",
  },
  {
    name: "Elena Giurelli",
    role: "Co-Founder",
    photo: "/Elena.jpeg",
    linkedin: "https://www.linkedin.com/in/elena-giurelli-322aa3151/",
  },
  {
    name: "Elisa Giurelli",
    role: "UX Designer & Co-Founder",
    photo: "/elisa.jpeg",
    linkedin: "https://www.linkedin.com/in/elisa-giurelli-30522931a/",
  },
];

function Team() {
  return (
    <section id="team" className="py-24 px-6" style={{ background: C.dark }}>
      <div className="max-w-5xl mx-auto text-center">
        <FadeSection>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: C.white }}>
            Chi siamo
          </h2>
          <p className="max-w-2xl mx-auto mb-16 leading-relaxed" style={{ color: C.gray }}>
            Un team giovane che ha fatto dell'intelligenza artificiale il proprio mestiere.
            Non ci siamo convertiti all'AI — ci siamo cresciuti dentro.
            Costruiamo soluzioni che funzionano, con la stessa passione con cui scriviamo la prima riga di codice.
          </p>
        </FadeSection>

        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {teamMembers.map((m, i) => (
            <FadeSection key={i} delay={i * 0.12}>
              <div
                className="rounded-2xl border p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-blue-500/30"
                style={{ background: C.darkCard, borderColor: C.darkBorder }}
              >
                <img
                  src={m.photo}
                  alt={m.name}
                  className="w-28 h-28 rounded-full object-cover mb-5 border-2"
                  style={{ borderColor: C.accent }}
                />
                <h3 className="text-lg font-semibold mb-1" style={{ color: C.white }}>
                  {m.name}
                </h3>
                <p className="text-sm mb-4" style={{ color: C.lightBlue }}>
                  {m.role}
                </p>
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                  style={{ color: C.gray }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={C.gray}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA FINALE ─────────────────────────────────────────────
function CTAFinal() {
  return (
    <section id="contatti" className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${C.navy}, ${C.dark})` }}>
      <div className="max-w-3xl mx-auto text-center">
        <FadeSection>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ color: C.white }}>
            Vuoi capire cosa può fare l'AI
            <br />
            per i tuoi sistemi?
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: C.gray }}>
            Scrivici. Ti rispondiamo in giornata, senza impegno e senza slide da 80 pagine.
          </p>
        </FadeSection>

        <FadeSection delay={0.15}>
          <a
            href="mailto:info@iridia.tech"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300 hover:scale-105"
            style={{ background: C.accent, color: "#fff" }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4L12 13 2 4" />
            </svg>
            info@iridia.tech
          </a>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── POLICY OVERLAY ─────────────────────────────────────────
function PolicyOverlay({ title, children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div
        className="relative w-full max-w-3xl mx-4 my-8 rounded-2xl border overflow-y-auto"
        style={{ background: C.darkCard, borderColor: C.darkBorder, maxHeight: "90vh" }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b" style={{ background: C.darkCard, borderColor: C.darkBorder }}>
          <h2 className="text-xl font-bold" style={{ color: C.white }}>{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:opacity-70 transition" style={{ color: C.gray }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <div className="p-6 sm:p-8 space-y-6 text-sm leading-relaxed" style={{ color: C.grayLight }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: C.white }}>{children}</h3>;
}

// ─── PRIVACY POLICY ─────────────────────────────────────────
function PrivacyPolicy({ onClose }) {
  return (
    <PolicyOverlay title="Privacy Policy" onClose={onClose}>
      <p>Ultimo aggiornamento: marzo 2026</p>
      <p>
        La presente informativa descrive le modalità di trattamento dei dati personali degli utenti che consultano
        il sito web <strong>www.iridia.tech</strong> (di seguito "Sito"), ai sensi dell'art. 13 del Regolamento (UE) 2016/679
        (GDPR) e del D.Lgs. 196/2003 (Codice Privacy).
      </p>

      <SectionTitle>1. Titolare del Trattamento</SectionTitle>
      <p>
        <strong>Iridia S.R.L.</strong><br />
        Sede legale: Via M. Cervantes de Saavedra 55/27, 80133 Napoli (NA)<br />
        P.IVA: 10604401215<br />
        PEC: iridiasrl@pec.it<br />
        Email: info@iridia.tech
      </p>

      <SectionTitle>2. Dati raccolti</SectionTitle>
      <p>Il Sito può raccogliere le seguenti categorie di dati:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Dati di navigazione:</strong> indirizzo IP, tipo di browser, sistema operativo, pagine visitate, orari di accesso, raccolti automaticamente dai sistemi informatici.</li>
        <li><strong>Dati forniti volontariamente:</strong> nome, cognome, indirizzo email e qualsiasi altra informazione trasmessa dall'utente tramite email o moduli di contatto.</li>
        <li><strong>Cookie:</strong> si rimanda alla Cookie Policy per i dettagli.</li>
      </ul>

      <SectionTitle>3. Finalità e base giuridica del trattamento</SectionTitle>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Funzionamento del sito</strong> (interesse legittimo, art. 6.1.f GDPR): garantire la corretta erogazione del servizio.</li>
        <li><strong>Riscontro a richieste</strong> (esecuzione di misure precontrattuali, art. 6.1.b GDPR): rispondere alle richieste inviate dall'utente.</li>
        <li><strong>Analisi statistiche anonime</strong> (interesse legittimo, art. 6.1.f GDPR): migliorare il Sito tramite dati aggregati e anonimi.</li>
        <li><strong>Obblighi di legge</strong> (art. 6.1.c GDPR): adempiere a obblighi normativi.</li>
      </ul>

      <SectionTitle>4. Destinatari dei dati</SectionTitle>
      <p>
        I dati possono essere comunicati a fornitori di servizi tecnici (hosting, manutenzione) che operano in qualità
        di responsabili del trattamento ai sensi dell'art. 28 GDPR. I dati non vengono venduti o ceduti a terzi per
        finalità di marketing.
      </p>

      <SectionTitle>5. Trasferimento dei dati</SectionTitle>
      <p>
        Alcuni fornitori di servizi potrebbero avere sede al di fuori dell'UE/SEE. In tal caso, il trasferimento avviene
        sulla base di garanzie adeguate (Clausole Contrattuali Standard della Commissione Europea, decisioni di adeguatezza
        o altri strumenti previsti dal GDPR).
      </p>

      <SectionTitle>6. Periodo di conservazione</SectionTitle>
      <p>
        I dati di navigazione vengono cancellati dopo la chiusura della sessione o al massimo entro 24 mesi.
        I dati forniti tramite email vengono conservati per il tempo necessario a gestire la richiesta e comunque
        non oltre 24 mesi dall'ultimo contatto, salvo obblighi di legge.
      </p>

      <SectionTitle>7. Diritti dell'interessato</SectionTitle>
      <p>L'utente ha il diritto di:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Accedere ai propri dati personali (art. 15 GDPR)</li>
        <li>Ottenere la rettifica dei dati inesatti (art. 16 GDPR)</li>
        <li>Ottenere la cancellazione dei dati (art. 17 GDPR)</li>
        <li>Limitare il trattamento (art. 18 GDPR)</li>
        <li>Opporsi al trattamento (art. 21 GDPR)</li>
        <li>Richiedere la portabilità dei dati (art. 20 GDPR)</li>
        <li>Revocare il consenso in qualsiasi momento</li>
        <li>Proporre reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it)</li>
      </ul>
      <p>Per esercitare i propri diritti, scrivere a: <strong>info@iridia.tech</strong></p>

      <SectionTitle>8. Modifiche alla presente informativa</SectionTitle>
      <p>
        Il Titolare si riserva di modificare la presente informativa. L'utente è invitato a consultare
        periodicamente questa pagina.
      </p>
    </PolicyOverlay>
  );
}

// ─── COOKIE POLICY ──────────────────────────────────────────
function CookiePolicy({ onClose }) {
  return (
    <PolicyOverlay title="Cookie Policy" onClose={onClose}>
      <p>Ultimo aggiornamento: marzo 2026</p>
      <p>
        Questa Cookie Policy descrive l'utilizzo dei cookie e tecnologie simili sul sito <strong>www.iridia.tech</strong>,
        in conformità con il Regolamento (UE) 2016/679 (GDPR), la Direttiva 2002/58/CE (ePrivacy) e le
        Linee Guida del Garante Privacy italiano sui cookie del 10 giugno 2021.
      </p>

      <SectionTitle>1. Cosa sono i cookie</SectionTitle>
      <p>
        I cookie sono piccoli file di testo che i siti web visitati inviano al browser dell'utente, dove vengono
        memorizzati per essere ritrasmessi agli stessi siti alla visita successiva.
      </p>

      <SectionTitle>2. Cookie utilizzati dal Sito</SectionTitle>

      <h4 className="font-semibold mt-4 mb-2" style={{ color: C.white }}>a) Cookie tecnici (necessari)</h4>
      <p>
        Questi cookie sono essenziali per il corretto funzionamento del Sito. Non richiedono il consenso dell'utente.
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>cookie_consent:</strong> memorizza la preferenza dell'utente sui cookie. Durata: 12 mesi.</li>
      </ul>

      <h4 className="font-semibold mt-4 mb-2" style={{ color: C.white }}>b) Cookie analitici</h4>
      <p>
        Attualmente il Sito non utilizza cookie analitici di terze parti. Qualora venissero introdotti in futuro
        (es. Google Analytics in forma anonimizzata), questa policy verrà aggiornata e sarà richiesto il consenso
        dell'utente ove necessario.
      </p>

      <h4 className="font-semibold mt-4 mb-2" style={{ color: C.white }}>c) Cookie di profilazione</h4>
      <p>Il Sito non utilizza cookie di profilazione.</p>

      <SectionTitle>3. Cookie di terze parti</SectionTitle>
      <p>
        Il Sito utilizza Google Fonts per il caricamento dei caratteri tipografici. Google potrebbe raccogliere
        dati relativi all'indirizzo IP dell'utente. Per maggiori informazioni, consultare la privacy policy di Google.
      </p>

      <SectionTitle>4. Come gestire i cookie</SectionTitle>
      <p>L'utente può gestire le preferenze sui cookie in diversi modi:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Banner cookie:</strong> al primo accesso al Sito è possibile accettare o rifiutare i cookie non necessari.</li>
        <li><strong>Impostazioni del browser:</strong> è possibile bloccare o eliminare i cookie dalle impostazioni del proprio browser (Chrome, Firefox, Safari, Edge).</li>
      </ul>
      <p className="mt-2">
        La disabilitazione dei cookie tecnici potrebbe compromettere il corretto funzionamento del Sito.
      </p>

      <SectionTitle>5. Diritti dell'utente</SectionTitle>
      <p>
        L'utente può esercitare i diritti previsti dagli artt. 15-22 del GDPR scrivendo a <strong>info@iridia.tech</strong>.
        Ha inoltre il diritto di proporre reclamo al Garante per la Protezione dei Dati Personali.
      </p>
    </PolicyOverlay>
  );
}

// ─── TERMINI E CONDIZIONI ───────────────────────────────────
function TermsConditions({ onClose }) {
  return (
    <PolicyOverlay title="Termini e Condizioni" onClose={onClose}>
      <p>Ultimo aggiornamento: marzo 2026</p>
      <p>
        I presenti Termini e Condizioni regolano l'utilizzo del sito web <strong>www.iridia.tech</strong> (di seguito "Sito"),
        di proprietà di Iridia S.R.L. L'accesso e l'utilizzo del Sito implicano l'accettazione dei presenti termini.
      </p>

      <SectionTitle>1. Titolare del Sito</SectionTitle>
      <p>
        <strong>Iridia S.R.L.</strong><br />
        Via M. Cervantes de Saavedra 55/27, 80133 Napoli (NA)<br />
        P.IVA: 10604401215<br />
        PEC: iridiasrl@pec.it — Email: info@iridia.tech
      </p>

      <SectionTitle>2. Oggetto</SectionTitle>
      <p>
        Il Sito ha carattere informativo e promozionale. Presenta i servizi offerti da Iridia S.R.L. nell'ambito
        dello sviluppo di applicazioni software e soluzioni di intelligenza artificiale per le imprese.
      </p>

      <SectionTitle>3. Proprietà intellettuale</SectionTitle>
      <p>
        Tutti i contenuti del Sito — inclusi testi, immagini, loghi, grafiche, icone, software e il marchio "Iridia" —
        sono di proprietà esclusiva di Iridia S.R.L. o dei rispettivi titolari e sono protetti dalla normativa
        italiana ed europea in materia di proprietà intellettuale e industriale.
      </p>
      <p>
        È vietata la riproduzione, distribuzione, modifica o utilizzo dei contenuti senza autorizzazione scritta
        del Titolare.
      </p>

      <SectionTitle>4. Limitazione di responsabilità</SectionTitle>
      <ul className="list-disc pl-6 space-y-1">
        <li>I contenuti del Sito sono forniti "così come sono" e a scopo puramente informativo.</li>
        <li>Iridia S.R.L. non garantisce la completezza, accuratezza o aggiornamento delle informazioni pubblicate.</li>
        <li>Iridia S.R.L. non è responsabile per eventuali danni diretti o indiretti derivanti dall'utilizzo del Sito o dall'impossibilità di accedervi.</li>
        <li>Il Sito può contenere link a siti di terze parti. Iridia S.R.L. non è responsabile dei contenuti o delle politiche di privacy di tali siti.</li>
      </ul>

      <SectionTitle>5. Utilizzo del Sito</SectionTitle>
      <p>L'utente si impegna a:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Utilizzare il Sito in conformità con la legge e i presenti Termini.</li>
        <li>Non tentare di accedere in modo non autorizzato ai sistemi informatici del Sito.</li>
        <li>Non utilizzare il Sito per scopi illeciti o per diffondere contenuti dannosi.</li>
      </ul>

      <SectionTitle>6. Servizi</SectionTitle>
      <p>
        Le informazioni relative ai servizi presentati sul Sito non costituiscono un'offerta al pubblico
        ai sensi dell'art. 1336 c.c. Eventuali rapporti contrattuali saranno regolati da accordi specifici
        sottoscritti tra le parti.
      </p>

      <SectionTitle>7. Modifiche</SectionTitle>
      <p>
        Iridia S.R.L. si riserva il diritto di modificare i presenti Termini in qualsiasi momento. Le modifiche
        saranno efficaci dalla data di pubblicazione sul Sito. L'utilizzo continuato del Sito dopo la pubblicazione
        delle modifiche costituisce accettazione dei nuovi termini.
      </p>

      <SectionTitle>8. Legge applicabile e foro competente</SectionTitle>
      <p>
        I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia derivante dall'utilizzo
        del Sito è competente in via esclusiva il Foro di Napoli, salvo diversa disposizione inderogabile di legge
        a favore del consumatore.
      </p>
    </PolicyOverlay>
  );
}

// ─── COOKIE BANNER ──────────────────────────────────────────
function CookieBanner({ onOpenPolicy }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("iridia_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("iridia_cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("iridia_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] p-4" style={{ background: C.navy + "f5", backdropFilter: "blur(12px)", borderTop: `1px solid ${C.darkBorder}` }}>
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm flex-1 leading-relaxed" style={{ color: C.grayLight }}>
          Questo sito utilizza cookie tecnici per garantire il corretto funzionamento.
          Consulta la nostra{" "}
          <button onClick={() => onOpenPolicy("cookie")} className="underline font-medium" style={{ color: C.lightBlue }}>
            Cookie Policy
          </button>{" "}
          per maggiori informazioni.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="px-5 py-2 rounded-lg text-sm font-medium border transition-colors duration-200 hover:opacity-80"
            style={{ borderColor: C.darkBorder, color: C.gray, background: "transparent" }}
          >
            Rifiuta
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-90"
            style={{ background: C.accent, color: "#fff" }}
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────
function Footer({ onOpenPolicy }) {
  return (
    <footer className="py-10 px-6" style={{ background: C.dark, borderTop: `1px solid ${C.darkBorder}` }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button onClick={() => onOpenPolicy("privacy")} className="text-sm font-medium transition hover:opacity-80" style={{ color: C.gray }}>
            Privacy Policy
          </button>
          <span className="hidden sm:inline" style={{ color: C.darkBorder }}>|</span>
          <button onClick={() => onOpenPolicy("cookie")} className="text-sm font-medium transition hover:opacity-80" style={{ color: C.gray }}>
            Cookie Policy
          </button>
          <span className="hidden sm:inline" style={{ color: C.darkBorder }}>|</span>
          <button onClick={() => onOpenPolicy("terms")} className="text-sm font-medium transition hover:opacity-80" style={{ color: C.gray }}>
            Termini e Condizioni
          </button>
        </div>
        <p className="text-sm leading-relaxed text-center" style={{ color: C.gray + "88" }}>
          Iridia S.R.L. — P.IVA 10604401215 — Via M. Cervantes de Saavedra 55/27, 80133 Napoli (NA)
          <br />
          PEC: iridiasrl@pec.it — info@iridia.tech
        </p>
        <p className="text-xs text-center mt-4" style={{ color: C.gray + "55" }}>
          © {new Date().getFullYear()} Iridia S.R.L. — Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}

// ─── APP ────────────────────────────────────────────────────
export default function IridiaLanding() {
  const [openPolicy, setOpenPolicy] = useState(null);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif", background: C.dark }}>
      <Navbar />
      <Hero />
      <WhatWeDo />
      <Problems />
      <Process />
      <Approach />
      <Market />
      <Team />
      <FAQ />
      <CTAFinal />
      <Footer onOpenPolicy={setOpenPolicy} />
      <CookieBanner onOpenPolicy={setOpenPolicy} />

      {openPolicy === "privacy" && <PrivacyPolicy onClose={() => setOpenPolicy(null)} />}
      {openPolicy === "cookie" && <CookiePolicy onClose={() => setOpenPolicy(null)} />}
      {openPolicy === "terms" && <TermsConditions onClose={() => setOpenPolicy(null)} />}
    </div>
  );
}
