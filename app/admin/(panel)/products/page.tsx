import Link from "next/link";
import { card, PageHead, Toast } from "@/components/admin/ui";
import { listProducts } from "@/lib/repo";

const cat = { shaft: "샤프트", gear: "기어", bracket: "브라켓", custom: "맞춤 가공" };

export default async function ProductsAdmin({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const list = await listProducts({ includeHidden: true });
  return (
    <>
      <PageHead title="제품 관리" desc={`총 ${list.length}개 · 공개 ${list.filter((p) => p.published).length}개`} action={{ href: "/admin/products/new", label: "제품 등록" }} />
      <Toast msg={sp.saved ? "저장되었습니다." : sp.deleted ? "삭제되었습니다." : undefined} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} href={`/admin/products/${p.id}`} className={`${card} group overflow-hidden transition hover:border-signal-500`}>
            <div className="relative aspect-[16/9] bg-ink-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image.replace("w=1200", "w=600")} alt="" className="h-full w-full object-cover" />
              {!p.published && <span className="absolute left-3 top-3 rounded bg-ink-900/80 px-2 py-1 text-xs font-bold text-white">비공개</span>}
            </div>
            <div className="p-4">
              <p className="text-xs font-bold text-signal-500">{cat[p.category]}</p>
              <p className="mt-1 font-bold text-ink-900">{p.name.ko}</p>
              <p className="mt-0.5 truncate text-sm text-ink-500">{p.name.en}</p>
              <p className="mt-2 font-mono text-xs text-ink-300">/{p.slug}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
