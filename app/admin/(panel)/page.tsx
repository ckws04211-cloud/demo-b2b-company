import Link from "next/link";
import { card, fmt, PageHead, StatusBadge } from "@/components/admin/ui";
import { listInquiries, listNotices, listProducts } from "@/lib/repo";

export default async function Dashboard() {
  const [inq, products, notices] = await Promise.all([listInquiries(), listProducts({ includeHidden: true }), listNotices()]);
  const weekAgo = Date.now() - 7 * 86_400_000;
  const stats = [
    { label: "신규 문의", value: inq.filter((q) => q.status === "new").length, href: "/admin/inquiries?status=new", accent: true },
    { label: "처리중 문의", value: inq.filter((q) => q.status === "progress").length, href: "/admin/inquiries?status=progress" },
    { label: "최근 7일 문의", value: inq.filter((q) => new Date(q.createdAt).getTime() > weekAgo).length, href: "/admin/inquiries" },
    { label: "공개 제품", value: products.filter((p) => p.published).length, href: "/admin/products" },
  ];

  return (
    <>
      <PageHead title="대시보드" desc="견적 문의와 콘텐츠 현황을 한눈에 확인하세요." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`${card} p-5 transition hover:border-signal-500`}>
            <p className="text-sm font-semibold text-ink-500">{s.label}</p>
            <p className={`mt-2 text-3xl font-extrabold ${s.accent ? "text-signal-500" : "text-ink-900"}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className={card}>
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-bold text-ink-900">최근 견적 문의</h2>
            <Link href="/admin/inquiries" className="text-sm font-semibold text-signal-500">전체 보기</Link>
          </div>
          <ul className="divide-y divide-ink-100">
            {inq.slice(0, 5).map((q) => (
              <li key={q.id}>
                <Link href={`/admin/inquiries/${q.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50">
                  <StatusBadge s={q.status} />
                  <span className="flex-1 truncate text-sm font-semibold text-ink-900">{q.company} · {q.product || "제품 미지정"}</span>
                  <span className="shrink-0 text-xs text-ink-300">{fmt(q.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className={card}>
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-bold text-ink-900">최근 공지</h2>
            <Link href="/admin/notices/new" className="text-sm font-semibold text-signal-500">+ 작성</Link>
          </div>
          <ul className="divide-y divide-ink-100">
            {notices.slice(0, 5).map((n) => (
              <li key={n.id}>
                <Link href={`/admin/notices/${n.id}`} className="block truncate px-5 py-3.5 text-sm font-medium text-ink-700 hover:bg-ink-50">
                  {n.pinned && <span className="mr-1.5 text-signal-500">[공지]</span>}{n.title.ko}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
