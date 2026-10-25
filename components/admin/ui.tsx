import Link from "next/link";
import type { InquiryStatus } from "@/lib/types";

export function PageHead({ title, desc, action }: { title: string; desc?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{title}</h1>
        {desc && <p className="mt-1 text-sm text-ink-500">{desc}</p>}
      </div>
      {action && <Link href={action.href} className="btn-primary">+ {action.label}</Link>}
    </div>
  );
}

export const statusLabel: Record<InquiryStatus, string> = { new: "접수", progress: "처리중", done: "완료" };
const statusCls: Record<InquiryStatus, string> = {
  new: "bg-red-50 text-red-600",
  progress: "bg-amber-50 text-amber-700",
  done: "bg-emerald-50 text-emerald-700",
};

export function StatusBadge({ s }: { s: InquiryStatus }) {
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${statusCls[s]}`}>{statusLabel[s]}</span>;
}

export function Toast({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{msg}</div>;
}

export const card = "rounded-lg border border-ink-100 bg-white";

export const fmt = (iso: string) =>
  new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Seoul" }).format(new Date(iso));
