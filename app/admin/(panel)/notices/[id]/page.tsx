import { notFound } from "next/navigation";
import { deleteNoticeAction } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import NoticeForm from "@/components/admin/NoticeForm";
import { PageHead } from "@/components/admin/ui";
import { getNotice } from "@/lib/repo";

export default async function EditNotice({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const n = await getNotice(id);
  if (!n) notFound();
  return (
    <>
      <div className="flex items-start justify-between">
        <PageHead title="공지 수정" />
        <DeleteButton id={n.id} action={deleteNoticeAction} />
      </div>
      <NoticeForm notice={n} />
    </>
  );
}
