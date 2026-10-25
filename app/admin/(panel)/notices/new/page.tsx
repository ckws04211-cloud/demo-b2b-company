import NoticeForm from "@/components/admin/NoticeForm";
import { PageHead } from "@/components/admin/ui";

export default function NewNotice() {
  return (
    <>
      <PageHead title="공지 작성" desc="국문은 필수, 영문은 비워두면 국문으로 표시됩니다." />
      <NoticeForm />
    </>
  );
}
