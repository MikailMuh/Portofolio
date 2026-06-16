"use client";

import { useRef, useState, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  CONTACT_EMAIL,
  FONT_MONO,
  FONT_SPACE,
  PROJECTS,
} from "@/lib/portfolio-data";
import type { SiteProps } from "@/app/page";

const chipStyle: CSSProperties = {
  fontFamily: FONT_MONO,
  fontSize: 13,
  color: "#41587a",
  background: "#f4f8fc",
  border: "1px solid #e3eaf3",
  borderRadius: 8,
  padding: "7px 13px",
};

const cardChipStyle: CSSProperties = { ...chipStyle, fontSize: 12, padding: "6px 12px" };

const placeholderLabel: CSSProperties = {
  fontFamily: FONT_MONO,
  fontSize: 12,
  color: "#7d93b0",
  background: "#ffffffd9",
  padding: "7px 13px",
  borderRadius: 99,
};

const stripe = "repeating-linear-gradient(45deg,#e6edf6 0 14px,#eef3f9 14px 28px)";

const eyebrow: CSSProperties = {
  fontFamily: FONT_MONO,
  fontSize: 12,
  letterSpacing: ".2em",
  color: "#1b63d6",
};

const h2: CSSProperties = {
  fontFamily: FONT_SPACE,
  fontWeight: 600,
  fontSize: 34,
  letterSpacing: "-.02em",
};

// Shared spring used for the button hover/tap micro-interactions.
const btnSpring = { type: "spring" as const, stiffness: 400, damping: 22 };

const skillGroups: { title: string; items: string[] }[] = [
  { title: "Programming Languages", items: ["C++", "Java", "Python", "JavaScript", "TypeScript", "Dart", "SQL", "HTML", "CSS"] },
  { title: "Backend & Frameworks", items: ["Node.js", "NestJS", "Express.js", "Prisma", "REST API design", "Microservices"] },
  { title: "AI / Machine Learning", items: ["Python (scikit-learn)", "Random Forest", "XGBoost", "Logistic Regression", "PaddleOCR", "Groq", "Google Gemini", "Streamlit", "N8N"] },
  { title: "Databases, Cloud & Tools", items: ["PostgreSQL", "Supabase", "MySQL", "Railway", "Hugging Face Spaces", "Git / GitHub", "Postman", "PlantUML"] },
  { title: "Practices & Soft Skills", items: ["Design Patterns (GoF)", "SOLID", "Refactoring", "SDLC", "Backend architecture", "API development", "Technical documentation"] },
  { title: "Frontend & Languages", items: ["Flutter", "React.js", "Indonesian (Native)", "English (Advanced)"] },
];

const timeline = [
  {
    dotActive: true,
    period: "MAY — JUN 2026",
    title: "IOFest 2026 Finalist · 5th place",
    body: "Final-round finalist (score 81.78). Backend developer and proposal writer for a circular-economy waste marketplace (UNTAR BEM FTI).",
  },
  {
    dotActive: false,
    period: "SEP — NOV 2024",
    title: "Laboratory Assistant Trainee · SLC BINUS",
    body: "Selected into the SLC pre-training track preparing the 2024 assistant cohort. Built C++ algorithms/data structures, Java OOP end-to-end, and practiced SQL/relational database fundamentals.",
  },
  {
    dotActive: false,
    period: "2022 — 2023",
    title: "National Science Olympiad (OSN) · Informatics",
    body: "Two-time competitor representing SMA Negeri 1 Kajen.",
  },
  {
    dotActive: false,
    period: "JUL 2023",
    title: "English Debate Competition · Winner",
    body: "Winner of English Debate Competition Region Kabupaten Pekalongan and Pre-Province round.",
  },
];

const education = [
  {
    period: "SEP 2024 — PRESENT",
    title: "BINUS University",
    body: "Computer Science — Software Engineering · GPA 3.21 / 4.00. Coursework: Software Architecture, Code Reengineering, Mobile/Hybrid Dev, Computational Biology, Research Methodology. Focus: backend engineering, software design patterns, and AI / ML integration.",
  },
  {
    period: "JUL 2021 — MAY 2024",
    title: "SMA Negeri 1 Kajen",
    body: "Natural Science (IPA)",
  },
  {
    period: "ORGANIZATION",
    title: "Yearbook Committee & MPK Student Council",
    body: "Chairman of the Yearbook Committee (led committee, coordinated team and timeline) and Member of the Student Representative Council (MPK) at SMA Negeri 1 Kajen.",
  },
];

export default function VariantA(props: SiteProps) {
  const { accent, form, setField, submitForm, sent, resetSent, openDash } = props;

  // ---- Works carousel: native horizontal scroll (touchpad / touch / wheel) ----
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [proj, setProj] = useState(0);
  // Mouse drag-to-scroll state (touchpad & touch use native scrolling).
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });

  const nearestIndex = (scroller: HTMLDivElement) => {
    let nearest = 0;
    let min = Infinity;
    Array.from(scroller.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).offsetLeft - scroller.scrollLeft);
      if (d < min) {
        min = d;
        nearest = i;
      }
    });
    return nearest;
  };

  const scrollToCard = (i: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const idx = Math.max(0, Math.min(PROJECTS.length - 1, i));
    const card = scroller.children[idx] as HTMLElement | undefined;
    if (card) scroller.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (scrollerRef.current) setProj(nearestIndex(scrollerRef.current));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // let touch/pen scroll natively
    const scroller = scrollerRef.current;
    if (!scroller) return;
    drag.current = { active: true, startX: e.clientX, startLeft: scroller.scrollLeft };
    scroller.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !scrollerRef.current) return;
    scrollerRef.current.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    scrollerRef.current?.releasePointerCapture?.(e.pointerId);
    if (scrollerRef.current) scrollToCard(nearestIndex(scrollerRef.current));
  };

  return (
    <div>
      {/* NAV */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(255,255,255,.82)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid #e8eef6",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "18px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#top-a" style={{ fontFamily: FONT_SPACE, fontWeight: 700, fontSize: 21, letterSpacing: "-.02em", color: "#0a2342" }}>
            Portofolio<span style={{ color: "#1b63d6" }}>.</span>
          </a>
          <div style={{ display: "flex", gap: 34, fontFamily: FONT_SPACE, fontSize: 15, fontWeight: 500 }}>
            {[
              { href: "#about-a", label: "About" },
              { href: "#stack-a", label: "Stack" },
              { href: "#timeline-a", label: "Timeline" },
              { href: "#work-a", label: "Works" },
              { href: "#contact-a", label: "Contact" },
            ].map((l) => (
              <motion.a key={l.href} href={l.href} whileHover={{ color: accent, y: -2 }} transition={btnSpring} style={{ color: "#34507a" }}>
                {l.label}
              </motion.a>
            ))}
          </div>
          <motion.a
            href="#contact-a"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={btnSpring}
            style={{ fontFamily: FONT_SPACE, fontSize: 14, fontWeight: 600, color: "#ffffff", background: accent, padding: "11px 22px", borderRadius: 99 }}
          >
            Get in touch
          </motion.a>
        </div>
      </nav>

      {/* HERO */}
      <header id="top-a" style={{ maxWidth: 1180, margin: "0 auto", padding: "92px 40px 72px", display: "grid", gridTemplateColumns: "1.12fr .88fr", gap: 64, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: 14, letterSpacing: ".08em", textTransform: "uppercase", color: "#1b63d6", marginBottom: 20 }}>
            Software Engineering Student · Backend &amp; AI
          </div>
          <h1 style={{ fontFamily: FONT_SPACE, fontWeight: 700, fontSize: "clamp(46px,5.8vw,76px)", lineHeight: 1.05, letterSpacing: "-.03em", margin: "0 0 24px", color: "#0a2342" }}>
            MUHAMMAD MIKAIL
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#5b7290", maxWidth: 540, margin: "0 0 34px" }}>
            I build the backend side of software, with a steady pull toward AI. Currently studying Software Engineering at BINUS University focused on backend architecture, API design, and microservices.
          </p>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <motion.a href="#work-a" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={btnSpring} style={{ fontFamily: FONT_SPACE, fontSize: 15, fontWeight: 600, color: "#ffffff", background: accent, padding: "15px 28px", borderRadius: 12 }}>View work →</motion.a>
            <motion.a href="#contact-a" whileHover={{ scale: 1.05, borderColor: accent }} whileTap={{ scale: 0.95 }} transition={btnSpring} style={{ fontFamily: FONT_SPACE, fontSize: 15, fontWeight: 600, color: "#0a2342", background: "#ffffff", border: "1px solid #dde6f1", padding: "15px 28px", borderRadius: 12 }}>Download CV</motion.a>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ aspectRatio: "4/5", borderRadius: 20, border: "1px solid #dde6f1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#f4f8fc" }}>
            <img src="/foto.jpeg" alt="Muhammad Mikail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <section id="about-a" style={{ borderTop: "1px solid #eef3f9", background: "#fbfcfe" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "96px 40px", display: "grid", gridTemplateColumns: ".9fr 1.1fr", gap: 64 }}>
          <div>
            <h2 style={{ ...h2, margin: "0", lineHeight: 1.15 }}>
              Software engineering student at BINUS University who builds the backend side of software, with a steady pull toward AI.
            </h2>
          </div>
          <div>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#46607f", margin: "0 0 22px" }}>
              I went into software engineering because I like solving real problems by building systems that actually work, and I kept studying AI and machine learning because pairing the two is where the more interesting solutions live.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#46607f", margin: "0 0 22px" }}>
              So far I have owned backend architecture, API design, and microservices across course and competition projects, and I am increasingly drawn to larger, more complex multi-service systems.
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#46607f", margin: "0 0 40px" }}>
              Recent highlight: backend developer and proposal writer for a circular-economy project that reached the IOFest 2026 final.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
              {[
                { stat: "3.21", label: "GPA / 4.00" },
                { stat: "Top 5", label: "IOFest 2026 finalist" },
              ].map((s) => (
                <div key={s.label} style={{ borderLeft: "2px solid #1b63d6", paddingLeft: 18 }}>
                  <div style={{ fontFamily: FONT_SPACE, fontSize: 32, fontWeight: 700, color: "#0a2342" }}>{s.stat}</div>
                  <div style={{ fontSize: 14, color: "#5b7290", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="stack-a" style={{ maxWidth: 1180, margin: "0 auto", padding: "96px 40px" }}>
        <h2 style={{ ...h2, margin: "0 0 44px" }}>Tools I reach for</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
          {skillGroups.map((g) => (
            <div key={g.title} style={{ border: "1px solid #e3eaf3", borderRadius: 16, padding: "28px 30px" }}>
              <div style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: 17, marginBottom: 18 }}>{g.title}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                {g.items.map((it) => (
                  <span key={it} style={chipStyle}>{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE + EDUCATION */}
      <section id="timeline-a" style={{ borderTop: "1px solid #eef3f9", background: "#fbfcfe" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "96px 40px", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 72 }}>
          <div>
            <h2 style={{ ...h2, margin: "0 0 40px" }}>Experience &amp; highlights</h2>
            <div style={{ borderLeft: "2px solid #e3eaf3", paddingLeft: 30, display: "flex", flexDirection: "column", gap: 34 }}>
              {timeline.map((t) => (
                <div key={t.title} style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: -37, top: 4, width: 12, height: 12, borderRadius: 99, background: t.dotActive ? "#1b63d6" : "#bcccdf", border: "3px solid #fbfcfe" }} />
                  <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#1b63d6", letterSpacing: ".05em" }}>{t.period}</div>
                  <div style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: 19, margin: "6px 0 2px" }}>{t.title}</div>
                  <p style={{ fontSize: 15, color: "#5b7290", margin: 0, lineHeight: 1.6 }}>{t.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div id="education-a">
            <h2 style={{ ...h2, margin: "0 0 40px" }}>Education</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {education.map((e) => (
                <div key={e.title} style={{ background: "#ffffff", border: "1px solid #e3eaf3", borderRadius: 16, padding: "26px 28px" }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#1b63d6", letterSpacing: ".05em" }}>{e.period}</div>
                  <div style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: 19, margin: "8px 0 4px" }}>{e.title}</div>
                  <div style={{ fontSize: 15, color: "#5b7290", lineHeight: 1.55 }}>{e.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WORKS CAROUSEL (drag to scroll) */}
      <section id="work-a" style={{ maxWidth: 1180, margin: "0 auto", padding: "96px 40px", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 44 }}>
          <div>
            <h2 style={{ ...h2, margin: "0" }}>Selected projects</h2>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#7d93b0", marginTop: 10 }}>← scroll / drag to browse →</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <motion.button onClick={() => scrollToCard(proj - 1)} whileHover={{ scale: 1.12, backgroundColor: "#f4f8fc" }} whileTap={{ scale: 0.9 }} transition={btnSpring} style={{ width: 46, height: 46, borderRadius: 99, border: "1px solid #dde6f1", background: "#ffffff", cursor: "pointer", fontSize: 18, color: "#0a2342" }}>←</motion.button>
            <motion.button onClick={() => scrollToCard(proj + 1)} whileHover={{ scale: 1.12, backgroundColor: "#f4f8fc" }} whileTap={{ scale: 0.9 }} transition={btnSpring} style={{ width: 46, height: 46, borderRadius: 99, border: "1px solid #dde6f1", background: "#ffffff", cursor: "pointer", fontSize: 18, color: "#0a2342" }}>→</motion.button>
          </div>
        </div>
        <div
          ref={scrollerRef}
          className="works-scroller"
          onScroll={handleScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{
            display: "flex",
            gap: 24,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            overscrollBehaviorX: "contain",
            padding: "12px 0 26px",
            cursor: "grab",
          }}
        >
          {PROJECTS.map((p) => (
            <motion.article
              key={p.title}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              style={{ flex: "0 0 78%", scrollSnapAlign: "start", background: "#ffffff", border: "1px solid #dde6f1", borderRadius: 18, overflow: "hidden", boxShadow: "0 24px 50px -34px rgba(10,35,66,.5)" }}
            >
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ display: "block", aspectRatio: "16/9", borderBottom: "1px solid #dde6f1", overflow: "hidden", position: "relative", background: "#f4f8fc" }}>
                    <motion.img
                      src={p.image}
                      alt={p.title}
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.3 }}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </a>
                ) : (
                  <div style={{ aspectRatio: "16/9", borderBottom: "1px solid #dde6f1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "#f4f8fc" }}>
                    <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ padding: "28px 32px 32px" }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: ".12em", color: "#1b63d6" }}>{p.tag}</div>
                  <h3 style={{ fontFamily: FONT_SPACE, fontWeight: 700, fontSize: 26, margin: "10px 0 12px", letterSpacing: "-.01em" }}>
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ color: "#0a2342", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                        {p.title} <span style={{ fontSize: 18, color: "#1b63d6" }}>↗</span>
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>
                  <p style={{ fontSize: 16, lineHeight: 1.65, color: "#5b7290", margin: "0 0 20px", maxWidth: 640 }}>{p.descA}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginTop: 12 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                      {p.techs.map((t) => (
                        <span key={t} style={cardChipStyle}>{t}</span>
                      ))}
                    </div>
                    {p.link && (
                      <motion.a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4, color: "#1b63d6" }}
                        transition={btnSpring}
                        style={{ fontFamily: FONT_SPACE, fontSize: 14, fontWeight: 600, color: "#0a2342", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}
                      >
                        Visit Project <span style={{ color: "#1b63d6" }}>↗</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.article>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 9, marginTop: 38 }}>
          {PROJECTS.map((_, k) => (
            <motion.button
              key={k}
              onClick={() => scrollToCard(k)}
              whileHover={{ scale: 1.35 }}
              whileTap={{ scale: 0.85 }}
              transition={btnSpring}
              animate={{ width: k === proj ? 30 : 9, backgroundColor: k === proj ? accent : "#c5d2e2" }}
              style={{ height: 9, borderRadius: 99, border: "none", cursor: "pointer", padding: 0 }}
            />
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact-a" style={{ background: "#0a2342", color: "#ffffff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "104px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72 }}>
          <div>
            <h2 style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: "clamp(34px,4.5vw,52px)", letterSpacing: "-.03em", margin: "0 0 18px", lineHeight: 1.05 }}>Let&apos;s build something solid.</h2>
            <p style={{ fontSize: 18, color: "#9fb4d2", maxWidth: 440, margin: "0 0 40px", lineHeight: 1.6 }}>
              Have a backend or AI project, internship, or collaboration in mind? Drop me a message — it lands straight in my dashboard.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, fontFamily: FONT_MONO, fontSize: 14 }}>
              <motion.a href="tel:+629592182677" whileHover={{ x: 4, color: "#ffffff" }} transition={btnSpring} style={{ color: "#dbe7fb", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: accent }} />+62 959-2182-677
              </motion.a>
              <motion.a href={`mailto:${CONTACT_EMAIL}`} whileHover={{ x: 4, color: "#ffffff" }} transition={btnSpring} style={{ color: "#dbe7fb", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: accent }} />{CONTACT_EMAIL}
              </motion.a>
              <motion.a href="https://github.com/MikailMuh" whileHover={{ x: 4, color: "#ffffff" }} transition={btnSpring} style={{ color: "#dbe7fb", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: accent }} />github.com/MikailMuh
              </motion.a>
              <motion.a href="https://linkedin.com/in/muhammad-mikail-281780317" whileHover={{ x: 4, color: "#ffffff" }} transition={btnSpring} style={{ color: "#dbe7fb", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: accent }} />linkedin.com/in/muhammad-mikail
              </motion.a>
              <div style={{ color: "#9fb4d2", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: 99, background: "#3f5d84" }} />Icon Residence, Palmerah, Jakarta Barat
              </div>
            </div>
          </div>
          <div>
            {!sent ? (
              <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: 16, background: "#0d2a4f", border: "1px solid #1c3b60", borderRadius: 18, padding: 32 }}>
                <div>
                  <label style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#9fb4d2", letterSpacing: ".05em" }}>YOUR NAME</label>
                  <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Jane Doe" style={{ width: "100%", marginTop: 8, background: "#081f3c", border: "1px solid #1c3b60", borderRadius: 10, padding: "13px 14px", color: "#ffffff", fontSize: 15, outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#9fb4d2", letterSpacing: ".05em" }}>EMAIL</label>
                  <input value={form.email} onChange={(e) => setField("email", e.target.value)} type="email" placeholder="jane@company.com" style={{ width: "100%", marginTop: 8, background: "#081f3c", border: "1px solid #1c3b60", borderRadius: 10, padding: "13px 14px", color: "#ffffff", fontSize: 15, outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#9fb4d2", letterSpacing: ".05em" }}>MESSAGE</label>
                  <textarea value={form.message} onChange={(e) => setField("message", e.target.value)} rows={4} placeholder="Tell me about your project..." style={{ width: "100%", marginTop: 8, background: "#081f3c", border: "1px solid #1c3b60", borderRadius: 10, padding: "13px 14px", color: "#ffffff", fontSize: 15, outline: "none", resize: "vertical" }} />
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={btnSpring} style={{ fontFamily: FONT_SPACE, fontSize: 15, fontWeight: 600, color: "#ffffff", background: accent, border: "none", padding: 15, borderRadius: 11, cursor: "pointer", marginTop: 4 }}>Send message →</motion.button>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#0d2a4f", border: "1px solid #1c3b60", borderRadius: 18, padding: "56px 32px", minHeight: 360 }}>
                <div style={{ width: 56, height: 56, borderRadius: 99, background: "#173f1f", border: "1px solid #2a7d3f", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22 }}>
                  <span style={{ color: "#4ade80", fontSize: 26 }}>✓</span>
                </div>
                <div style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: 22, marginBottom: 8 }}>Message sent!</div>
                <p style={{ fontSize: 15, color: "#9fb4d2", maxWidth: 300, margin: "0 0 26px", lineHeight: 1.55 }}>Thanks for reaching out — your message is saved in Mikail&apos;s dashboard.</p>
                <motion.button onClick={resetSent} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={btnSpring} style={{ fontFamily: FONT_SPACE, fontSize: 14, fontWeight: 600, color: "#0a2342", background: "#ffffff", border: "none", padding: "12px 24px", borderRadius: 10, cursor: "pointer" }}>Send another</motion.button>
              </div>
            )}
          </div>
        </div>
        <div style={{ maxWidth: 1180, margin: "8px auto 0", padding: "28px 40px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1c3b60", fontFamily: FONT_MONO, fontSize: 12, color: "#5f7ba3" }}>
          <span>© 2026 Muhammad Mikail — Backend &amp; AI</span>
          <motion.button onClick={openDash} whileHover={{ scale: 1.05, color: "#ffffff" }} whileTap={{ scale: 0.95 }} transition={btnSpring} style={{ background: "none", border: "none", color: "#7fa3da", fontFamily: FONT_MONO, fontSize: 12, cursor: "pointer" }}>Owner dashboard →</motion.button>
        </div>
      </section>
    </div>
  );
}
