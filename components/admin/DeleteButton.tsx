"use client";

import { useFormStatus } from "react-dom";

function Btn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="btn border border-red-200 bg-white text-red-600 hover:bg-red-50">{pending ? "삭제 중..." : label}</button>;
}

/** 브라우저 confirm 대창 대신 2단계 버튼으로 삭제 확인 */
export default function DeleteButton({ id, action, label = "삭제" }: { id: string; action: (fd: FormData) => Promise<void>; label?: string }) {
  return (
    <details className="group relative">
      <summary className="btn cursor-pointer list-none border border-ink-100 bg-white text-ink-500 hover:text-red-600">{label}</summary>
      <form action={action} className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-ink-100 bg-white p-4 shadow-xl">
        <input type="hidden" name="id" value={id} />
        <p className="mb-3 text-sm text-ink-700">정말 삭제할까요? 되돌릴 수 없습니다.</p>
        <Btn label="삭제 확인" />
      </form>
    </details>
  );
}
