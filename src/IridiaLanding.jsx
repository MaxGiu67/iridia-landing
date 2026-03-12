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

// ─── HERO ───────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: C.dark }}>
      <GradientBlob className="absolute w-[900px] h-[900px] -top-48 -right-48 opacity-60 pointer-events-none" />
      <GradientBlob className="absolute w-[600px] h-[600px] -bottom-32 -left-32 opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo */}
        <FadeSection>
          <img
            src="/logo-iridia.jpeg"
            alt="Iridia"
            className="h-16 sm:h-20 mx-auto mb-8 object-contain"
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
    <section className="py-24 px-6" style={{ background: C.dark }}>
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
    <section className="py-24 px-6" style={{ background: C.navy }}>
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
    <section className="py-24 px-6" style={{ background: C.dark }}>
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
    <section className="py-24 px-6" style={{ background: C.navy }}>
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
function Team() {
  return (
    <section className="py-24 px-6" style={{ background: C.dark }}>
      <div className="max-w-4xl mx-auto text-center">
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

        <FadeSection delay={0.15}>
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
            style={{ borderColor: C.darkBorder, background: C.darkCard }}
          >
            <div className="flex -space-x-3">
              {[C.indigo, C.blue, C.lightBlue, C.accent].map((c, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold"
                  style={{ background: c, borderColor: C.darkCard, color: "#fff" }}
                >
                  {["M", "A", "L", "S"][i]}
                </div>
              ))}
            </div>
            <span style={{ color: C.gray }}>Team Iridia</span>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

// ─── CTA FINALE ─────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="py-24 px-6" style={{ background: `linear-gradient(180deg, ${C.navy}, ${C.dark})` }}>
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

// ─── FOOTER ─────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 px-6 text-center" style={{ background: C.dark, borderTop: `1px solid ${C.darkBorder}` }}>
      <p className="text-sm leading-relaxed" style={{ color: C.gray + "88" }}>
        Iridia S.R.L. — P.IVA 10604401215 — Via M. Cervantes de Saavedra 55/27, 80133 Napoli (NA)
        <br />
        PEC: iridiasrl@pec.it — info@iridia.tech
      </p>
    </footer>
  );
}

// ─── APP ────────────────────────────────────────────────────
export default function IridiaLanding() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif", background: C.dark }}>
      <Hero />
      <WhatWeDo />
      <Problems />
      <Process />
      <Approach />
      <Market />
      <Team />
      <FAQ />
      <CTAFinal />
      <Footer />
    </div>
  );
}
