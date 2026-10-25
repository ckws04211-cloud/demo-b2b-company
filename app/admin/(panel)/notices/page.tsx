import Link from "next/link";
import { card, fmt, PageHead, Toast } from "@/components/admin/ui";
import { listNotices } from "@/lib/repo";

export default async function NoticesAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const list = await listNotices();
  return (
    <>
      <PageHead title="공지사항" desc={`총 ${list.length}건`} action={{ href: "/admin/notices/new", label: "공지 작성" }} />
      <Toast msg={sp.saved ? "저장되었습니다." : sp.deleted ? "삭제되었습니다." : undefined} />
      <div className={`${card} overflow-hidden`}>
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-left text-xs font-bold text-ink-500">
            <tr><th className="px-5 py-3">제목</th><th className="hidden px-5 py-3 md:table-cell">영문</th><th className="px-5 py-3 text-right">작성일</th></tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {list.map((n) => (
              <tr key={n.id} className="hover:bg-ink-50">
                <td className="px-5 py-3.5">
                  <Link href={`/admin/notices/${n.id}`} className="font-semibold text-ink-900 hover:text-signal-500">
                    {n.pinned && <span className="mr-2 rounded bg-signal-500 px-1.5 py-0.5 text-[10px] text-white">고정</span>}{n.title.ko}
                  </Link>
                </td>
                <td className="hidden max-w-[260px] truncate px-5 py-3.5 text-ink-500 md:table-cell">{n.title.en}</td>
                <td className="px-5 py-3.5 text-right text-xs text-ink-300">{fmt(n.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
