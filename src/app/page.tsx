"use client";

import { useEffect, useState } from "react";
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
    <>
      {/* ============ OWNER LOCK BUTTON ============ */}
      <button type="button" onClick={openDash} title="Owner dashboard" aria-label="Owner dashboard" className="lock">
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="1" y="7" width="12" height="8" />
          <path d="M3.5 7V4.5a3.5 3.5 0 0 1 7 0V7" />
        </svg>
      </button>

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
    </>
  );
}
