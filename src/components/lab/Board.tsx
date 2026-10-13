"use client";

import { motion } from "framer-motion";

/**
 * Experience + education etched onto a circuit board: every entry is an IC
 * package hanging off a copper bus. Hovering a chip lights its trace and sends
 * a signal pulse down the wire.
 */

const cpu = [
  {
    period: "MAY—JUN 2026",
    status: "LATEST",
    title: "IOFest 2026 Finalist · 5th place",
    body: "Backend developer & proposal writer for a circular-economy marketplace. Final score 81.78.",
  },
  {
    period: "SEP—NOV 2024",
    status: "DONE",
    title: "Lab Assistant Trainee · SLC BINUS",
    body: "Pre-training for the 2024 assistant cohort — C++ DSA, Java OOP, SQL.",
  },
  {
    period: "JUL 2023",
    status: "WIN",
    title: "English Debate Competition · Winner",
    body: "Won the Kabupaten Pekalongan regional and Pre-Province rounds.",
  },
  {
    period: "2022—2023",
    status: "×2",
    title: "OSN Informatics",
    body: "Two-time National Science Olympiad competitor.",
  },
];

const rom = [
  {
    period: "2024 — NOW",
    title: "BINUS University",
    body: "Computer Science, Software Engineering. GPA 3.21 / 4.00.",
  },
  {
    period: "2021 — 2024",
    title: "SMA Negeri 1 Kajen",
    body: "Natural Science (IPA).",
  },
  {
    period: "ORG",
    title: "Yearbook Chair · MPK",
    body: "Led the yearbook committee; student representative council.",
  },
];

function Chip({
  id,
  period,
  status,
  title,
  body,
  delay,
}: {
  id: string;
  period: string;
  status?: string;
  title: string;
  body: string;
  delay: number;
}) {
  return (
    <motion.div
      className="chip-row"
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <span className="via" aria-hidden />
      <span className="wire" aria-hidden />
      <div className="chip">
        <span className="chip-notch" aria-hidden />
        <div className="chip-silk">
          <span>
            <b>{id}</b> · {period}
          </span>
          {status && <span className="chip-st">{status}</span>}
        </div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </motion.div>
  );
}

export default function Board() {
  return (
    <div className="pcb">
      <span className="hole" style={{ top: 14, left: 14 }} aria-hidden />
      <span className="hole" style={{ top: 14, right: 14 }} aria-hidden />
      <span className="hole" style={{ bottom: 14, left: 14 }} aria-hidden />
      <span className="hole" style={{ bottom: 14, right: 14 }} aria-hidden />

      <div className="pcb-silk pcb-top" aria-hidden>
        <span>MIKAIL-MB · REV 2026</span>
        <span className="hide-sm">4-LAYER · LEAD-FREE · ASSEMBLED IN JKT</span>
      </div>

      <div className="pcb-grid">
        <div>
          <div className="silk-h">CPU · EXPERIENCE</div>
          <div className="bus">
            {cpu.map((c, i) => (
              <Chip key={c.title} id={`U${i + 1}`} delay={i * 0.08} {...c} />
            ))}
          </div>
        </div>
        <div className="rom">
          <div className="silk-h">ROM · EDUCATION</div>
          <div className="bus">
            {rom.map((r, i) => (
              <Chip key={r.title} id={`R${i + 1}`} delay={0.15 + i * 0.08} {...r} />
            ))}
          </div>
        </div>
      </div>

      <div className="pcb-silk pcb-bottom" aria-hidden>
        <span>; newest frame on top</span>
        <span>© MM</span>
      </div>
    </div>
  );
}
