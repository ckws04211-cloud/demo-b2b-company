"use client";

import { useActionState } from "react";
import { updateInquiryAction } from "@/app/admin/actions";
import type { Inquiry } from "@/lib/types";

const opts = [
  { v: "new", l: "접수" },
  { v: "progress", l: "처리중" },
  { v: "done", l: "완료" },
] as const;

export default function InquiryUpdateForm({ q }: { q: Inquiry }) {
  const [state, action, pending] = useActionState(updateInquiryAction, {});
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={q.id} />
      <fieldset>
        <legend className="label">처리 상태</legend>
        <div className="grid grid-cols-3 gap-2">
          {opts.map((o) => (
            <label key={o.v} className="cursor-pointer">
              <input type="radio" name="status" value={o.v} defaultChecked={q.status === o.v} className="peer sr-only" />
              <span className="block rounded-md border border-ink-100 py-2.5 text-center text-sm font-semibold text-ink-500 peer-checked:border-signal-500 peer-checked:bg-signal-50 peer-checked:text-signal-600">{o.l}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="label">내부 메모</span>
        <textarea name="memo" defaultValue={q.memo} className="input min-h-[140px]" placeholder="견적 금액, 회신 내용 등 (고객에게 보이지 않음)" />
      </label>
      {state.error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      {state.ok && <p className="rounded bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">저장되었습니다.</p>}
      <button disabled={pending} className="btn-primary w-full">{pending ? "저장 중..." : "저장"}</button>
    </form>
  );
}
