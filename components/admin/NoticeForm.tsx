"use client";

import { useActionState, useState } from "react";
import { saveNoticeAction } from "@/app/admin/actions";
import type { Notice } from "@/lib/types";
import SubmitBar, { LangTabs } from "./SubmitBar";

export default function NoticeForm({ notice }: { notice?: Notice }) {
  const [state, action, pending] = useActionState(saveNoticeAction, {});
  const [lang, setLang] = useState<"ko" | "en">("ko");

  return (
    <form action={action} className="space-y-5 rounded-lg border border-ink-100 bg-white p-6">
      <input type="hidden" name="id" value={notice?.id ?? ""} />
      <div className="flex items-center justify-between">
        <LangTabs lang={lang} setLang={setLang} />
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-700">
          <input type="checkbox" name="pinned" defaultChecked={notice?.pinned} className="h-4 w-4 accent-signal-500" /> 상단 고정
        </label>
      </div>
      {(["ko", "en"] as const).map((l) => (
        <div key={l} className={lang === l ? "space-y-5" : "hidden"}>
          <label className="block">
            <span className="label">제목 {l === "ko" ? <span className="text-red-500">*</span> : <span className="font-normal text-ink-300">(비우면 국문 사용)</span>}</span>
            <input name={l === "ko" ? "titleKo" : "titleEn"} className="input" defaultValue={notice?.title[l]} maxLength={150} />
          </label>
          <label className="block">
            <span className="label">내용 {l === "ko" && <span className="text-red-500">*</span>}</span>
            <textarea name={l === "ko" ? "bodyKo" : "bodyEn"} className="input min-h-[280px] leading-relaxed" defaultValue={notice?.body[l]} />
          </label>
        </div>
      ))}
      <SubmitBar pending={pending} cancelHref="/admin/notices" error={state.error} />
    </form>
  );
}
