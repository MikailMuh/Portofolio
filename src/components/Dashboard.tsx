import { motion } from "framer-motion";
import { FONT_MONO, FONT_SPACE, InboxMessage } from "@/lib/portfolio-data";

const btnSpring = { type: "spring" as const, stiffness: 400, damping: 22 };

type DashboardProps = {
  accent: string;
  open: boolean;
  authed: boolean;
  pw: string;
  setPw: (v: string) => void;
  pwErr: boolean;
  tryAuth: (e: React.FormEvent) => void;
  closeDash: () => void;
  messages: InboxMessage[];
  toggleRead: (id: number) => void;
  delMsg: (id: number) => void;
};

export default function Dashboard({
  accent,
  open,
  authed,
  pw,
  setPw,
  pwErr,
  tryAuth,
  closeDash,
  messages,
  toggleRead,
  delMsg,
}: DashboardProps) {
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "#06182f",
        display: open ? "flex" : "none",
        flexDirection: "column",
        fontFamily: "var(--font-hanken), sans-serif",
        animation: "fadeIn .25s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px", borderBottom: "1px solid #16304f" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ display: "block", width: 13, height: 11, border: "2px solid #7fa3da", borderRadius: 3, position: "relative", marginTop: 5 }}>
            <span style={{ position: "absolute", left: "50%", top: -7, transform: "translateX(-50%)", width: 9, height: 9, border: "2px solid #7fa3da", borderBottom: "none", borderRadius: "6px 6px 0 0" }} />
          </span>
          <span style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: 17, color: "#ffffff" }}>Owner Dashboard</span>
        </div>
        <motion.button onClick={closeDash} whileHover={{ scale: 1.05, color: "#ffffff" }} whileTap={{ scale: 0.95 }} transition={btnSpring} style={{ background: "none", border: "1px solid #16304f", color: "#9fb4d2", fontFamily: FONT_MONO, fontSize: 13, padding: "9px 16px", borderRadius: 9, cursor: "pointer" }}>← Back to site</motion.button>
      </div>

      {/* LOGIN */}
      <div style={{ display: !authed ? "flex" : "none", flex: 1, alignItems: "center", justifyContent: "center" }}>
        <form onSubmit={tryAuth} style={{ width: 360, background: "#0b2440", border: "1px solid #16304f", borderRadius: 18, padding: "36px 34px", textAlign: "center" }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: ".2em", color: "#7fa3da", marginBottom: 10 }}>PRIVATE ACCESS</div>
          <div style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: 22, color: "#ffffff", marginBottom: 6 }}>Enter your password</div>
          <p style={{ fontSize: 14, color: "#7891b5", margin: "0 0 24px", lineHeight: 1.5 }}>Only the owner can read incoming messages.</p>
          <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="Password" style={{ width: "100%", background: "#081f3c", border: "1px solid #1c3b60", borderRadius: 10, padding: 14, color: "#ffffff", fontSize: 15, outline: "none", textAlign: "center" }} />
          <div style={{ display: pwErr ? "block" : "none", color: "#f87171", fontSize: 13, marginTop: 12 }}>Wrong password. Try again.</div>
          <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={btnSpring} style={{ width: "100%", marginTop: 20, fontFamily: FONT_SPACE, fontSize: 15, fontWeight: 600, color: "#ffffff", background: accent, border: "none", padding: 14, borderRadius: 11, cursor: "pointer" }}>Unlock dashboard</motion.button>
        </form>
      </div>

      {/* PANEL */}
      <div style={{ display: authed ? "block" : "none", flex: 1, overflow: "auto", padding: "36px 32px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 28 }}>
            <h2 style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: 26, color: "#ffffff", margin: 0 }}>Inbox</h2>
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: "#7891b5" }}>{messages.length} total · {unread} new</span>
          </div>
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "#5f7ba3", padding: "80px 20px", border: "1px dashed #16304f", borderRadius: 16 }}>
              <div style={{ fontFamily: FONT_SPACE, fontSize: 18, color: "#9fb4d2", marginBottom: 8 }}>No messages yet</div>
              <div style={{ fontSize: 14 }}>Messages from the contact form will appear here.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {messages.map((m) => (
                <div key={m.id} style={{ background: "#0b2440", border: "1px solid #16304f", borderLeft: `3px solid ${m.read ? "#16304f" : accent}`, borderRadius: 12, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: FONT_SPACE, fontWeight: 600, fontSize: 16, color: "#ffffff" }}>{m.name}</span>
                      <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: ".08em", color: "#ffffff", background: m.read ? "#3a5170" : accent, padding: "3px 8px", borderRadius: 5 }}>{m.read ? "READ" : "NEW"}</span>
                    </div>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#5f7ba3" }}>{new Date(m.ts).toLocaleString()}</span>
                  </div>
                  <a href={`mailto:${m.email}`} style={{ fontFamily: FONT_MONO, fontSize: 13, color: "#7fa3da" }}>{m.email}</a>
                  <p style={{ fontSize: 15, color: "#cdd9ea", lineHeight: 1.6, margin: "12px 0 16px" }}>{m.message}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <motion.button onClick={() => toggleRead(m.id)} whileHover={{ scale: 1.05, borderColor: accent, color: "#ffffff" }} whileTap={{ scale: 0.95 }} transition={btnSpring} style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#9fb4d2", background: "none", border: "1px solid #1c3b60", padding: "7px 14px", borderRadius: 8, cursor: "pointer" }}>{m.read ? "Mark unread" : "Mark read"}</motion.button>
                    <motion.button onClick={() => delMsg(m.id)} whileHover={{ scale: 1.05, borderColor: "#f87171" }} whileTap={{ scale: 0.95 }} transition={btnSpring} style={{ fontFamily: FONT_MONO, fontSize: 12, color: "#f87171", background: "none", border: "1px solid #3a2230", padding: "7px 14px", borderRadius: 8, cursor: "pointer" }}>Delete</motion.button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
