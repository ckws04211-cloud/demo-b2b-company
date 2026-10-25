"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { validateInquiry, type InquiryErrors, type InquiryForm as F } from "@/lib/inquiry-validate";

export default function InquiryForm({ products, initialProduct }: { products: string[]; initialProduct?: string }) {
  const t = useTranslations("inquiry");
  const locale = useLocale();
  const empty: F = { company: "", name: "", email: "", phone: "", product: initialProduct ?? "", quantity: "", message: "", agree: false, website: "" };
  const [f, setF] = useState<F>(empty);
  const [err, setErr] = useState<InquiryErrors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = <K extends keyof F>(k: K, v: F[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setErr((e) => ({ ...e, [k]: undefined }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = validateInquiry(f);
    setErr(v);
    if (Object.keys(v).length) return;
    setState("sending");
    try {
      const r = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, locale }) });
      const d = await r.json();
      if (d.ok) {
        setState("done");
        setF(empty);
      } else {
        if (d.errors) setErr(d.errors);
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-lg border border-ink-100 bg-ink-50 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-signal-500 text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
        </div>
        <p className="mt-6 text-2xl font-bold text-ink-900">{t("done")}</p>
        <p className="mt-2 text-ink-500">{t("doneDesc")}</p>
        <button type="button" onClick={() => setState("idle")} className="btn-dark mt-8">{t("again")}</button>
      </div>
    );
  }

  const E = ({ k }: { k: keyof InquiryErrors }) => (err[k] ? <p className="mt-1 text-xs text-red-600">{t(`errors.${k}`)}</p> : null);
  const req = <span className="text-red-500"> *</span>;

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 rounded-lg border border-ink-100 p-6 md:grid-cols-2 md:p-10">
      <input className="hidden" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} aria-hidden />
      <label><span className="label">{t("company")}{req}</span><input className="input" value={f.company} onChange={(e) => set("company", e.target.value)} /><E k="company" /></label>
      <label><span className="label">{t("name")}{req}</span><input className="input" value={f.name} onChange={(e) => set("name", e.target.value)} /><E k="name" /></label>
      <label><span className="label">{t("email")}{req}</span><input className="input" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /><E k="email" /></label>
      <label><span className="label">{t("phone")}</span><input className="input" inputMode="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></label>
      <label>
        <span className="label">{t("product")}</span>
        <select className="input" value={f.product} onChange={(e) => set("product", e.target.value)}>
          <option value="">{t("productPlaceholder")}</option>
          {products.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>
      <label><span className="label">{t("quantity")}</span><input className="input" value={f.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="e.g. 500 EA" /></label>
      <label className="md:col-span-2">
        <span className="label">{t("message")}{req}</span>
        <textarea className="input min-h-[160px]" value={f.message} onChange={(e) => set("message", e.target.value)} placeholder={t("messagePlaceholder")} />
        <E k="message" />
      </label>
      <label className="flex items-start gap-2.5 text-sm text-ink-500 md:col-span-2">
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-signal-500" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} />
        <span>{t("agree")}<E k="agree" /></span>
      </label>
      {state === "error" && !Object.keys(err).length && <p className="rounded bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{t("errors.server")}</p>}
      <button type="submit" disabled={state === "sending"} className="btn-primary py-4 text-base md:col-span-2">
        {state === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
