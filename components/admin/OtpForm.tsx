"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { otpAction } from "@/app/admin/auth-actions";

export default function OtpForm({ demoCode, secondsLeft }: { demoCode?: string; secondsLeft: number }) {
  const [state, action, pending] = useActionState(otpAction, {});
  const router = useRouter();
  const [left, setLeft] = useState(secondsLeft);

  useEffect(() => {
    if (!demoCode) return;
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          router.refresh();
          return 30;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [demoCode, router]);

  useEffect(() => setLeft(secondsLeft), [secondsLeft, demoCode]);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="label">인증 코드 6자리</span>
        <input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="\d{6}"
          className="input text-center font-mono text-2xl tracking-[0.5em]"
          placeholder="000000"
          autoFocus
          required
        />
      </label>
      {state.error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="btn-primary w-full py-3">{pending ? "확인 중..." : "로그인"}</button>
      {demoCode && (
        <div className="rounded-lg border border-dashed border-signal-500/40 bg-signal-50 p-4 text-sm">
          <p className="font-bold text-signal-600">데모용 현재 코드</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-2xl font-bold tracking-[0.3em] text-ink-900">{demoCode}</span>
            <span className="text-xs text-ink-500">{left}초 후 갱신</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded bg-white">
            <div className="h-full bg-signal-500 transition-all duration-1000 ease-linear" style={{ width: `${(left / 30) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-500">실제 운영 환경에서는 표시되지 않으며, Google Authenticator 앱의 코드를 입력합니다.</p>
        </div>
      )}
    </form>
  );
}
