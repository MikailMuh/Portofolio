"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { PROJECTS, type Project } from "@/lib/portfolio-data";

const bin = (n: number, w = 3) => n.toString(2).padStart(w, "0");

const linkKind = (url: string) => {
  if (url.includes("github.com")) return "view source";
  if (url.includes("figma.com")) return "open design";
  return "visit live";
};

const address = (url?: string) =>
  url ? url.replace(/^https?:\/\/(www\.)?/, "").replace(/\?.*$/, "") : "localhost";

const SIZES = "(max-width: 860px) 100vw, 720px";

/** Mouse-driven 3D tilt + glare for the preview frame. */
function useTilt() {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const rotateX = useSpring(rx, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 180, damping: 18 });
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx}% ${gy}%, rgba(27,99,214,.10), transparent 45%)`;

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 9);
    rx.set((0.5 - py) * 7);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onPointerLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return { rotateX, rotateY, glare, onPointerMove, onPointerLeave };
}

function Chrome({ project, index }: { project: Project; index: number }) {
  return (
    <div className="xp-chrome">
      <span className="xp-dots">
        <i />
        <i />
        <i />
      </span>
      <span className="xp-addr">{address(project.link)}</span>
      <span className="xp-fig">fig.{bin(index + 1)}</span>
    </div>
  );
}

export default function Experiments() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);
  const tilt = useTilt();

  // The project whose text block crosses the middle of the viewport drives the preview.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (i: number) =>
    items.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  const current = PROJECTS[active];

  return (
    <div className="xp">
      {/* ---------- scrolling text column */}
      <div className="xp-list">
        {PROJECTS.map((p, i) => {
          const verb = p.link ? linkKind(p.link) : null;
          return (
            <article
              key={p.title}
              ref={(el) => {
                items.current[i] = el;
              }}
              data-i={i}
              className={`xp-item${active === i ? " on" : ""}`}
            >
              {/* mobile-only inline preview */}
              <div className="xp-frame xp-mshot">
                <Chrome project={p} index={i} />
                <div className="xp-screen">
                  <Image src={p.image} alt={`${p.title} screenshot`} fill sizes={SIZES} className="xp-shot on" />
                </div>
              </div>

              <div className="xp-idx">
                <span className="bin">{bin(i + 1)}</span>
                <span>{p.tag}</span>
              </div>
              <h3 className="xp-title">{p.title}</h3>
              <p className="xp-desc">{p.descB}</p>
              <dl className="xp-meta">
                <div>
                  <dt>role</dt>
                  <dd>{p.role}</dd>
                </div>
                <div>
                  <dt>year</dt>
                  <dd>{p.year}</dd>
                </div>
              </dl>
              <ul className="xp-stack">
                {p.techs.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {p.link && verb && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-solid"
                >
                  <span className="op">run</span> {verb} <span className="arw">↗</span>
                </a>
              )}
            </article>
          );
        })}
      </div>

      {/* ---------- sticky preview (desktop) */}
      <div className="xp-stage">
        <motion.a
          href={current.link}
          target="_blank"
          rel="noopener noreferrer"
          className="xp-frame"
          tabIndex={-1}
          aria-hidden
          style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1400 }}
          onPointerMove={tilt.onPointerMove}
          onPointerLeave={tilt.onPointerLeave}
        >
          <Chrome project={current} index={active} />
          <div className="xp-screen">
            {PROJECTS.map((p, j) => (
              <Image
                key={p.title}
                src={p.image}
                alt=""
                fill
                sizes={SIZES}
                className={`xp-shot${j === active ? " on" : ""}`}
              />
            ))}
            <motion.div
              key={active}
              className="xp-scan"
              initial={{ top: "0%", opacity: 1 }}
              animate={{ top: "100%", opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1] }}
            />
            <motion.div className="xp-glare" style={{ background: tilt.glare }} />
          </div>
        </motion.a>

        <div className="xp-nav">
          {PROJECTS.map((p, j) => (
            <button
              key={p.title}
              type="button"
              onClick={() => go(j)}
              className={j === active ? "on" : ""}
              aria-label={`Show ${p.title}`}
            >
              {bin(j + 1)}
            </button>
          ))}
          <span className="xp-count">{current.title.split(" (")[0]}</span>
        </div>
      </div>
    </div>
  );
}
