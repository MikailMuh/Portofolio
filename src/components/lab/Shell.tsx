"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * The page is "running" inside a Windows shell. Visitors can flip between
 * PowerShell and classic CMD; every prompt on the page re-renders in that dialect.
 */

export type ShellKind = "ps" | "cmd";

export type Cmd = { ps: string; cmd: string };

const CWD = "C:\\Users\\mikail";

export const ShellContext = createContext<ShellKind>("ps");
export const useShell = () => useContext(ShellContext);

/** Colour the command like Windows Terminal does: verb, -params / /switches, rest. */
function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((tok, i) => {
        if (/^\s+$/.test(tok)) return tok;
        const cls =
          i === 0
            ? "sh-verb"
            : /^[-/]/.test(tok)
              ? "sh-param"
              : tok === "|"
                ? "sh-pipe"
                : "sh-arg";
        return (
          <span key={i} className={cls}>
            {tok}
          </span>
        );
      })}
    </>
  );
}

export function PromptPrefix({ shell }: { shell: ShellKind }) {
  return shell === "ps" ? (
    <span className="sh-ps">
      <b>PS</b> {CWD}&gt;
    </span>
  ) : (
    <span className="sh-ps">{CWD}&gt;</span>
  );
}

/** A prompt line that types its command once it scrolls into view. */
export function Prompt({ cmd, className = "" }: { cmd: Cmd; className?: string }) {
  const shell = useShell();
  const text = cmd[shell];
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [inView, reduce, text]);

  const shown = reduce ? text : text.slice(0, n);
  const done = shown.length >= text.length;

  return (
    <div ref={ref} className={`sh-line ${className}`} aria-hidden>
      <PromptPrefix shell={shell} /> <Highlight text={shown} />
      <span className={`sh-caret${done ? " idle" : ""}`} />
    </div>
  );
}

export function ShellToggle({
  shell,
  setShell,
}: {
  shell: ShellKind;
  setShell: (s: ShellKind) => void;
}) {
  return (
    <div className="sh-toggle" role="group" aria-label="Shell style">
      {(["ps", "cmd"] as const).map((s) => (
        <button
          key={s}
          type="button"
          aria-pressed={shell === s}
          className={shell === s ? "on" : ""}
          onClick={() => setShell(s)}
        >
          {s === "ps" ? "pwsh" : "cmd"}
        </button>
      ))}
    </div>
  );
}

export function WinControls() {
  return (
    <span className="win-ctl" aria-hidden>
      <i className="min" />
      <i className="max" />
      <i className="cls" />
    </span>
  );
}
