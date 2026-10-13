import { InboxMessage } from "@/lib/portfolio-data";

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
  toggleRead: (id: number) => void | Promise<void>;
  delMsg: (id: number) => void | Promise<void>;
};

export default function Dashboard({
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
    <div className="dash" style={{ display: open ? "flex" : "none" }}>
      <div className="dash-bar">
        <span>
          <span className="acc">▪</span> mikail.asm <span className="dim">/ ring 0 · owner</span>
        </span>
        <button type="button" onClick={closeDash} className="btn-sm">
          ← back to site
        </button>
      </div>

      {/* LOGIN */}
      <div style={{ display: !authed ? "flex" : "none", flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
        <form onSubmit={tryAuth} className="term" style={{ width: "100%", maxWidth: 380 }}>
          <div className="term-bar">
            <span>auth — privileged access</span>
          </div>
          <div className="term-body">
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 34, lineHeight: 1.1, color: "var(--ink)", margin: "0 0 6px" }}>
              Enter password
            </h2>
            <p style={{ fontSize: 14, margin: "0 0 20px" }}>Only the owner can read incoming messages.</p>
            <div className="field">
              <label htmlFor="d-pw">key &gt;</label>
              <input id="d-pw" value={pw} onChange={(e) => setPw(e.target.value)} type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>
            {pwErr && (
              <div className="mono" style={{ color: "#c62828", fontSize: 12.5, marginTop: 14 }}>
                ; SEGFAULT — wrong password, try again.
              </div>
            )}
            <button type="submit" className="btn btn-solid" style={{ width: "100%", justifyContent: "center", marginTop: 22 }}>
              unlock ⏎
            </button>
          </div>
        </form>
      </div>

      {/* PANEL */}
      <div style={{ display: authed ? "block" : "none", flex: 1, overflow: "auto", padding: "40px 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
            <h2 className="serif" style={{ fontWeight: 400, fontSize: 44, color: "var(--ink)", margin: 0 }}>
              Inbox
            </h2>
            <span className="mono dim" style={{ fontSize: 13 }}>
              {messages.length} total · <span className="acc">{unread} new</span>
            </span>
          </div>
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px", border: "1px dashed var(--line-2)" }}>
              <div className="serif" style={{ fontSize: 24, color: "var(--ink)", marginBottom: 6 }}>
                No messages yet
              </div>
              <div className="mono dim" style={{ fontSize: 13 }}>
                ; buffer empty — messages from the contact form appear here.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.map((m) => (
                <div key={m.id} className={`dash-msg${m.read ? "" : " unread"}`}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontWeight: 600, fontSize: 16, color: "var(--ink)" }}>{m.name}</span>
                      <span className={`tag${m.read ? "" : " new"}`}>{m.read ? "READ" : "NEW"}</span>
                    </div>
                    <span className="mono dim" style={{ fontSize: 12 }}>
                      {new Date(m.ts).toLocaleString()}
                    </span>
                  </div>
                  <a href={`mailto:${m.email}`} className="mono" style={{ fontSize: 13, color: "var(--accent-ink)" }}>
                    {m.email}
                  </a>
                  <p style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.65, margin: "12px 0 16px", whiteSpace: "pre-wrap" }}>{m.message}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => toggleRead(m.id)} className="btn-sm">
                      {m.read ? "mark unread" : "mark read"}
                    </button>
                    <button type="button" onClick={() => delMsg(m.id)} className="btn-sm danger">
                      delete
                    </button>
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
