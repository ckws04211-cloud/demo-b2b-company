"use client";

import Link from "next/link";

export default function SubmitBar({ pending, cancelHref, error }: { pending: boolean; cancelHref: string; error?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 border-t border-ink-100 pt-5">
      {error && <p className="mr-auto rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <Link href={cancelHref} className="btn-ghost">취소</Link>
      <button disabled={pending} className="btn-primary min-w-[100px]">{pending ? "저장 중..." : "저장"}</button>
    </div>
  );
}

export function LangTabs({ lang, setLang }: { lang: "ko" | "en"; setLang: (l: "ko" | "en") => void }) {
  return (
    <div className="inline-flex rounded-md border border-ink-100 bg-ink-50 p-1 text-sm font-bold">
      {(["ko", "en"] as const).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} className={`rounded px-4 py-1.5 ${lang === l ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"}`}>
          {l === "ko" ? "국문" : "영문"}
        </button>
      ))}
    </div>
  );
}
