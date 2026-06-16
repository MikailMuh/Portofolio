"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ACCENT, DASHBOARD_PASSWORD, InboxMessage } from "@/lib/portfolio-data";
import { supabase } from "@/lib/supabase";
import VariantA from "@/components/VariantA";
import Dashboard from "@/components/Dashboard";

export type FormState = { name: string; email: string; message: string };

export type SiteProps = {
  accent: string;
  // contact form
  form: FormState;
  setField: (k: keyof FormState, v: string) => void;
  submitForm: (e: React.FormEvent) => void | Promise<void>;
  sent: boolean;
  resetSent: () => void;
  // dashboard
  openDash: () => void;
};

export default function Home() {
  const [view, setView] = useState<"site" | "dashboard">("site");
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [messages, setMessages] = useState<InboxMessage[]>([]);

  useEffect(() => {
    supabase
      .from("inbox_messages")
      .select("*")
      .order("ts", { ascending: false })
      .then(({ data }) => {
        if (data) setMessages(data as InboxMessage[]);
      });
  }, []);

  const setField = (k: keyof FormState, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    const { data, error } = await supabase
      .from("inbox_messages")
      .insert({
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        read: false,
      })
      .select()
      .single();
    if (error || !data) return;
    setMessages((prev) => [data as InboxMessage, ...prev]);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  const tryAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === DASHBOARD_PASSWORD) {
      setAuthed(true);
      setPwErr(false);
    } else {
      setPwErr(true);
    }
  };

  const delMsg = async (id: number) => {
    await supabase.from("inbox_messages").delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleRead = async (id: number) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    const newRead = !msg.read;
    await supabase.from("inbox_messages").update({ read: newRead }).eq("id", id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: newRead } : m))
    );
  };

  const openDash = () => setView("dashboard");
  const closeDash = () => {
    setView("site");
    setAuthed(false);
    setPw("");
    setPwErr(false);
  };

  const siteProps: SiteProps = {
    accent: ACCENT,
    form,
    setField,
    submitForm,
    sent,
    resetSent: () => setSent(false),
    openDash,
  };

  return (
    <div style={{ fontFamily: "var(--font-hanken), sans-serif", color: "#0a2342", background: "#ffffff" }}>
      {/* ============ OWNER LOCK BUTTON ============ */}
      <motion.button
        onClick={openDash}
        title="Owner dashboard"
        whileHover={{ scale: 1.08, boxShadow: "0 16px 36px -14px rgba(10,35,66,.6)" }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 300,
          width: 46,
          height: 46,
          borderRadius: 99,
          border: "1px solid #dde6f1",
          background: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 12px 30px -14px rgba(10,35,66,.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "block",
            width: 13,
            height: 11,
            border: "2px solid #0a2342",
            borderRadius: 3,
            position: "relative",
            marginTop: 5,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: -7,
              transform: "translateX(-50%)",
              width: 9,
              height: 9,
              border: "2px solid #0a2342",
              borderBottom: "none",
              borderRadius: "6px 6px 0 0",
            }}
          />
        </span>
      </motion.button>

      <VariantA {...siteProps} />

      <Dashboard
        accent={ACCENT}
        open={view === "dashboard"}
        authed={authed}
        pw={pw}
        setPw={setPw}
        pwErr={pwErr}
        tryAuth={tryAuth}
        closeDash={closeDash}
        messages={messages}
        toggleRead={toggleRead}
        delMsg={delMsg}
      />
    </div>
  );
}
