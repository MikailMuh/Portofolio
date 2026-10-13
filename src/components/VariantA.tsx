"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  MotionConfig,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { CONTACT_EMAIL, PROJECTS } from "@/lib/portfolio-data";
import type { SiteProps } from "@/app/page";
import {
  Prompt,
  PromptPrefix,
  ShellContext,
  ShellToggle,
  WinControls,
  type Cmd,
  type ShellKind,
} from "@/components/lab/Shell";
import Board from "@/components/lab/Board";
import Experiments from "@/components/lab/Experiments";

/* ------------------------------------------------------------------ data */

const sections = [
  { id: "about", label: "about" },
  { id: "stack", label: "isa" },
  { id: "trace", label: "trace" },
  { id: "work", label: "experiments" },
  { id: "contact", label: "syscall" },
];

const CMDS: Record<string, Cmd> = {
  whoami: { ps: "whoami /all", cmd: "whoami /all" },
  about: { ps: "Get-Content .\about.md", cmd: "type about.md" },
  stack: { ps: "Get-Command -Module mikail", cmd: "help | more" },
  trace: { ps: "Get-History -Count 7", cmd: "doskey /history" },
  work: { ps: "Get-ChildItem .\experiments | Sort-Object Year -Descending", cmd: "dir experiments /o-d" },
  contact: { ps: "Send-Message -To mikail", cmd: "start mailto:mikail" },
};

const isa: { mn: string; desc: string; items: string[] }[] = [
  { mn: "SRV", desc: "backend", items: ["Node.js", "NestJS", "Express.js", "Prisma", "REST APIs", "Microservices"] },
  { mn: "ML", desc: "AI / ML", items: ["scikit-learn", "XGBoost", "Random Forest", "PaddleOCR", "Groq", "Gemini", "Streamlit", "N8N"] },
  { mn: "STOR", desc: "data & cloud", items: ["PostgreSQL", "Supabase", "MySQL", "Railway", "Hugging Face", "Docker"] },
  { mn: "LANG", desc: "languages", items: ["TypeScript", "JavaScript", "Python", "Java", "C++", "Dart", "SQL"] },
  { mn: "PRAC", desc: "practices", items: ["Design Patterns", "SOLID", "Refactoring", "Clean Architecture", "SDLC"] },
  { mn: "UI", desc: "frontend", items: ["React", "Flutter", "HTML / CSS"] },
];

const TICKER_TEXT = "BACKEND · AI · SYSTEMS THAT ACTUALLY WORK · ";

/* --------------------------------------------------------------- helpers */

const hex = (n: number, w = 4) => "0x" + n.toString(16).toUpperCase().padStart(w, "0");
const bin = (n: number, w = 3) => n.toString(2).padStart(w, "0");
const opcode = (s: string) =>
  Array.from(s.slice(0, 2))
    .map((c) => c.charCodeAt(0).toString(16).toUpperCase())
    .join(" ");

/** Name that boots up from bits: each glyph flickers 0/1 before locking in. */
function useDecode(text: string, startDelay = 250) {
  const reduce = useReducedMotion();
  // Deterministic first frame so server and client markup match.
  const [out, setOut] = useState(() =>
    Array.from(text).map((c, i) => (c === " " ? " " : i % 3 === 0 ? "1" : "0")).join("")
  );

  useEffect(() => {
    if (reduce) return;
    let frame = 0;
    let id: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      id = setInterval(() => {
        frame++;
        const locked = Math.floor(frame / 2);
        setOut(
          Array.from(text)
            .map((c, i) => (c === " " || i < locked ? c : Math.random() > 0.5 ? "1" : "0"))
            .join("")
        );
        if (locked >= text.length && id) clearInterval(id);
      }, 38);
    }, startDelay);
    return () => {
      clearTimeout(t);
      if (id) clearInterval(id);
    };
  }, [text, startDelay, reduce]);

  return reduce ? text : out;
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ cmd, children }: { cmd: Cmd; children: ReactNode }) {
  return (
    <Reveal>
      <Prompt cmd={cmd} className="sh-head" />
      <h2 className="sh-title">{children}</h2>
    </Reveal>
  );
}

/* ------------------------------------------------------------- component */

export default function VariantA(props: SiteProps) {
  const { form, setField, submitForm, sent, resetSent, openDash } = props;

  const [shell, setShell] = useState<ShellKind>("ps");
  const first = useDecode("Muhammad");
  const last = useDecode("Mikail", 520);

  // Program counter: scroll progress rendered as an address.
  const { scrollYProgress } = useScroll();
  const [pc, setPc] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setPc(Math.round(v * 0x05ff)));

  // Which section is currently executing.
  const [active, setActive] = useState<string>("_start");
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Live clock register (client only, to keep hydration stable).
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  const clock = now
    ? now.toLocaleTimeString("en-GB", { timeZone: "Asia/Jakarta", hour12: false })
    : "--:--:--";

  const [sending, setSending] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    setSending(true);
    try {
      await submitForm(e);
    } finally {
      setSending(false);
    }
  };

  const activeLabel = sections.find((s) => s.id === active)?.label;
  const bytes = Array.from(TICKER_TEXT);

  return (
    <MotionConfig reducedMotion="user">
    <ShellContext.Provider value={shell}>

      {/* ============================== NAV */}
      <nav className="nav" style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div className="wrap nav-in">
          <a href="#top" className="brand">
            <span className="brand-ico" aria-hidden>
              {shell === "ps" ? ">_" : "C:\\"}
            </span>
            <span>
              mikail<span className="dim">.asm</span>
              <span className="hide-sm dim"> — {shell === "ps" ? "PowerShell" : "Command Prompt"}</span>
            </span>
          </a>
          <div className="nav-links">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={active === s.id ? "on" : ""}>
                {s.id}
              </a>
            ))}
          </div>
          <div className="nav-right">
            <ShellToggle shell={shell} setShell={setShell} />
            <div className="pc hide-md" aria-hidden>
              PC <b>{hex(pc)}</b> · {activeLabel ? "." + activeLabel : "_start"}
            </div>
            <WinControls />
          </div>
        </div>
        <motion.div className="pc-bar" style={{ scaleX: scrollYProgress }} />
      </nav>

      {/* ============================== HERO */}
      <header id="top" className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="src-head" aria-hidden>
                {shell === "ps" ? (
                  <>
                    <div>PowerShell 7.5.0</div>
                    <div>Loading personal profile mikail.asm took 420ms.</div>
                  </>
                ) : (
                  <>
                    <div>mikail-os [Version 2026.10.09]</div>
                    <div>(c) Muhammad Mikail. All rights reserved.</div>
                  </>
                )}
                <Prompt cmd={CMDS.whoami} className="lbl" />
              </div>

              <h1 className="hero-name">
                <span className="sr-only">Muhammad Mikail</span>
                <span className="ln" aria-hidden>
                  {first}
                </span>
                <span className="ln" aria-hidden>
                  {last}
                  <span className="caret" />
                </span>
              </h1>

              <motion.p
                className="hero-lede"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                I build the <em>backend side of software</em> — with a steady pull toward AI.
              </motion.p>

              <motion.div
                className="hero-cta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.6 }}
              >
                <a href="#work" className="btn btn-solid">
                  <span className="op">jmp</span> view experiments <span className="arw">→</span>
                </a>
                <a href="#contact" className="btn">
                  <span className="op">call</span> get in touch
                </a>
              </motion.div>
            </div>

            <motion.figure
              style={{ margin: 0 }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className="specimen">
                <i className="c3" />
                <i className="c4" />
                <div className="specimen-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/foto.jpeg" alt="Portrait of Muhammad Mikail" />
                  <div className="crosshair" />
                </div>
                <figcaption className="specimen-cap">
                  <span>SPECIMEN 0x01</span>
                  <span>CS · BINUS · JKT</span>
                </figcaption>
              </div>
            </motion.figure>
          </div>

          <div className="regs" role="list" aria-label="Quick facts">
            {[
              { k: "R0 · GPA", v: "3.31", h: hex(321) },
              { k: "R1 · IOFEST '26", v: "5th place", h: "0b" + bin(5) },
              { k: "R2 · SHIPPED", v: `${PROJECTS.length} projects`, h: hex(PROJECTS.length, 2) },
              { k: "CLK · JAKARTA", v: clock, h: "live" },
            ].map((r) => (
              <div key={r.k} className="reg" role="listitem">
                <div className="reg-k">{r.k}</div>
                <div className="reg-v">{r.v}</div>
                <div className="reg-hex">{r.h}</div>
              </div>
            ))}
          </div>
        </div>

        {/* byte ticker — binary over its decoded glyph */}
        <div className="ticker" aria-hidden>
          <div className="ticker-track">
            {[...bytes, ...bytes].map((c, i) => (
              <div key={i} className={`byte${c === " " ? " sp" : ""}`}>
                <span className="byte-b">{c.charCodeAt(0).toString(2).padStart(8, "0")}</span>
                <span className="byte-c">{c === " " ? "␣" : c}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ============================== ABOUT */}
      <section id="about" className="wrap sect">
        <SectionHead cmd={CMDS.about}>
          A backend engineer <em>in the making</em>.
        </SectionHead>
        <div className="about-grid">
          <Reveal>
            <p className="about-pull">
              I like solving real problems with systems that <em>actually work</em> — and pairing
              them with AI.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="about-text">
              <p>
                Software Engineering student at BINUS University. I own backend architecture, API
                design and microservices across course and competition projects.
              </p>
              <p>
                I also co-founded <span className="hl">NATY</span>, a small software studio.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================== STACK / ISA */}
      <section id="stack" className="wrap sect">
        <SectionHead cmd={CMDS.stack}>
          My <em>instruction set</em>.
        </SectionHead>
        <div className="isa">
          {isa.map((r, i) => (
            <Reveal key={r.mn} delay={i * 0.04}>
              <div className="isa-row">
                <div className="isa-op">{opcode(r.mn)}</div>
                <div className="isa-mn">
                  {r.mn}
                  <small>{r.desc}</small>
                </div>
                <div className="isa-args">
                  {r.items.map((it) => (
                    <span key={it}>{it}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================== TRACE / MOTHERBOARD */}
      <section id="trace" className="wrap sect">
        <SectionHead cmd={CMDS.trace}>
          Experience, <em>etched in copper</em>.
        </SectionHead>
        <Board />
      </section>

      {/* ============================== EXPERIMENTS */}
      <section id="work" className="wrap sect sect-work">
        <SectionHead cmd={CMDS.work}>
          Selected <em>experiments</em>.
        </SectionHead>
        <Experiments />
      </section>

      {/* ============================== SYSCALL / CONTACT */}
      <section id="contact" className="wrap sect">
        <div className="contact-grid">
          <Reveal>
            <Prompt cmd={CMDS.contact} className="sh-head" />
            <h2 className="contact-big">
              Let&apos;s build something <em>solid.</em>
            </h2>
            <p className="contact-lede">
              Backend, AI, internship or collab — send a message, it lands straight in my inbox.
            </p>
            <div className="links">
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <span className="k">mail</span>
                <span>{CONTACT_EMAIL}</span>
                <span className="arr">↗</span>
              </a>
              <a href="https://github.com/MikailMuh" target="_blank" rel="noopener noreferrer">
                <span className="k">git</span>
                <span>github.com/MikailMuh</span>
                <span className="arr">↗</span>
              </a>
              <a
                href="https://linkedin.com/in/muhammad-mikail-281780317"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="k">in</span>
                <span>linkedin.com/in/muhammad-mikail</span>
                <span className="arr">↗</span>
              </a>
              <a href="tel:+629592182677">
                <span className="k">tel</span>
                <span>+62 959-2182-677</span>
                <span className="arr">↗</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="term">
              <div className="term-bar">
                <span>
                  <span className="brand-ico sm" aria-hidden>
                    {shell === "ps" ? ">_" : "C:\\"}
                  </span>{" "}
                  inbox — {shell === "ps" ? "Send-Message" : "mail.exe"}
                </span>
                <WinControls />
              </div>
              <div className="term-body">
                {!sent ? (
                  <form onSubmit={onSubmit}>
                    <div className="field">
                      <label htmlFor="f-name">name &gt;</label>
                      <input
                        id="f-name"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="Jane Doe"
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="f-email">email &gt;</label>
                      <input
                        id="f-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        placeholder="jane@company.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="f-msg">message &gt;</label>
                      <textarea
                        id="f-msg"
                        rows={5}
                        value={form.message}
                        onChange={(e) => setField("message", e.target.value)}
                        placeholder="Tell me about your project…"
                        required
                      />
                    </div>
                    <div className="term-foot">
                      <span className="cm">{shell === "ps" ? "#" : "REM"} goes to my private inbox</span>
                      <button type="submit" className="btn btn-solid" disabled={sending}>
                        {sending ? "executing…" : "execute ⏎"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="term-ok" role="status">
                    <div>
                      <PromptPrefix shell={shell} /> {CMDS.contact[shell]}
                    </div>
                    <div>
                      Stored in inbox ......... <span className="g">ok</span>
                    </div>
                    <div>
                      {shell === "ps" ? "$LASTEXITCODE" : "%ERRORLEVEL%"} <span className="g">0</span>
                    </div>
                    <p className="term-thanks">Thanks for reaching out — I&apos;ll get back to you soon.</p>
                    <button type="button" onClick={resetSent} className="btn">
                      <span className="op">jmp</span> send another
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================== FOOTER */}
      <footer className="foot">
        <div className="wrap">
          <p className="foot-hlt" aria-hidden>
            exit<span>[process exited with code 0 (0x00000000)]</span>
          </p>
          <div className="foot-row">
            <span>© 2026 Muhammad Mikail — assembled in Jakarta</span>
            <button type="button" onClick={openDash}>
              owner dashboard →
            </button>
          </div>
        </div>
      </footer>
    </ShellContext.Provider>
    </MotionConfig>
  );
}
