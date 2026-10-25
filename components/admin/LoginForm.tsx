"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/auth-actions";

export default function LoginForm({ demo }: { demo?: { id: string; password: string } }) {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="space-y-4">
      <label className="block"><span className="label">아이디</span><input name="id" className="input" autoComplete="username" defaultValue={demo?.id} required /></label>
      <label className="block"><span className="label">비밀번호</span><input name="password" type="password" className="input" autoComplete="current-password" defaultValue={demo?.password} required /></label>
      {state.error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="btn-primary w-full py-3">{pending ? "확인 중..." : "다음"}</button>
      {demo && (
        <div className="rounded-lg border border-dashed border-signal-500/40 bg-signal-50 p-4 text-sm text-ink-700">
          <p className="font-bold text-signal-600">데모 계정</p>
          <p className="mt-1">아이디 <b>{demo.id}</b> / 비밀번호 <b>{demo.password}</b></p>
        </div>
      )}
    </form>
  );
}
