import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryUpdateForm from "@/components/admin/InquiryUpdateForm";
import { card, fmt, StatusBadge } from "@/components/admin/ui";
import { getInquiry } from "@/lib/repo";

export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = await getInquiry(id);
  if (!q) notFound();

  const rows = [
    ["회사명", q.company], ["담당자", q.name], ["이메일", q.email], ["연락처", q.phone || "-"],
    ["관심 제품", q.product || "-"], ["예상 수량", q.quantity || "-"], ["접수 언어", q.locale === "en" ? "영문" : "국문"], ["접수일", fmt(q.createdAt)],
  ];

  return (
    <>
      <Link href="/admin/inquiries" className="text-sm font-semibold text-ink-500 hover:text-ink-900">← 목록</Link>
      <div className="mb-6 mt-3 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-ink-900">{q.company}</h1>
        <StatusBadge s={q.status} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className={`${card} p-6`}>
          <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-bold text-ink-300">{k}</dt>
                <dd className="mt-0.5 font-medium text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 border-t border-ink-100 pt-5">
            <p className="text-xs font-bold text-ink-300">문의 내용</p>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-700">{q.message}</p>
          </div>
          <a href={`mailto:${q.email}?subject=${encodeURIComponent(`[한빛정밀] 견적 문의 회신`)}`} className="btn-dark mt-6">이메일로 회신</a>
        </section>
        <section className={`${card} p-6`}>
          <h2 className="mb-4 font-bold text-ink-900">처리</h2>
          <InquiryUpdateForm q={q} />
        </section>
      </div>
    </>
  );
}
