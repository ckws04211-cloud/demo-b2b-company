import Sidebar from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { isDemoStore, listInquiries } from "@/lib/repo";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const newCount = (await listInquiries()).filter((q) => q.status === "new").length;
  return (
    <div className="min-h-screen">
      <Sidebar newCount={newCount} />
      <div className="lg:pl-64">
        {isDemoStore() && (
          <div className="bg-signal-500 px-6 py-2 text-center text-xs font-semibold text-white">
            데모 환경입니다. 변경 사항은 서버 재시작 시 초기화됩니다.
          </div>
        )}
        <main className="mx-auto max-w-6xl p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
