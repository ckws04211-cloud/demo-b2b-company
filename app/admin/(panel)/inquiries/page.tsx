import Link from "next/link";
import { card, fmt, PageHead, StatusBadge, statusLabel } from "@/components/admin/ui";
import { listInquiries } from "@/lib/repo";
import type { InquiryStatus } from "@/lib/types";

const tabs: (InquiryStatus | "all")[] = ["all", "new", "progress", "done"];

export default async function InquiriesAdmin({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const sp = await searchParams;
  const all = await listInquiries();
  const status = tabs.includes(sp.status as InquiryStatus) ? (sp.status as InquiryStatus | "all") : "all";
  const kw = (sp.q ?? "").trim().toLowerCase();
  const list = all
    .filter((q) => status === "all" || q.status === status)
    .filter((q) => !kw || [q.company, q.name, q.email, q.product, q.message].some((v) => v.toLowerCase().includes(kw)));

  const count = (s: InquiryStatus | "all") => (s === "all" ? all.length : all.filter((q) => q.status === s).length);

  return (
    <>
      <PageHead title="견적 문의" desc="사이트(국문·영문)에서 접수된 견적 요청을 관리합니다." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-md border border-ink-100 bg-white p-1">
          {tabs.map((t) => (
            <Link
              key={t}
              href={`/admin/inquiries${t === "all" ? "" : `?status=${t}`}`}
              className={`rounded px-3 py-1.5 text-sm font-semibold ${status === t ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-900"}`}
            >
              {t === "all" ? "전체" : statusLabel[t]} <span className="opacity-60">{count(t)}</span>
            </Link>
          ))}
        </div>
        <form className="flex gap-2">
          {status !== "all" && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={sp.q} placeholder="회사명, 담당자, 내용 검색" className="input w-60" />
          <button className="btn-dark">검색</button>
        </form>
      </div>

      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-ink-50 text-left text-xs font-bold text-ink-500">
            <tr>
              <th className="px-5 py-3">상태</th><th className="px-5 py-3">회사 / 담당자</th><th className="px-5 py-3">제품</th>
              <th className="px-5 py-3">언어</th><th className="px-5 py-3 text-right">접수일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {list.length === 0 && (
              <tr><td colSpan={5} className="py-16 text-center text-ink-300">해당하는 문의가 없습니다.</td></tr>
            )}
            {list.map((q) => (
              <tr key={q.id} className="hover:bg-ink-50">
                <td className="px-5 py-3.5"><StatusBadge s={q.status} /></td>
                <td className="px-5 py-3.5">
                  <Link href={`/admin/inquiries/${q.id}`} className="font-semibold text-ink-900 hover:text-signal-500">{q.company}</Link>
                  <p className="text-xs text-ink-500">{q.name}</p>
                </td>
                <td className="px-5 py-3.5 text-ink-700">{q.product || "-"}</td>
                <td className="px-5 py-3.5"><span className="rounded border border-ink-100 px-1.5 py-0.5 text-xs font-bold uppercase text-ink-500">{q.locale}</span></td>
                <td className="px-5 py-3.5 text-right text-xs text-ink-300">{fmt(q.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
