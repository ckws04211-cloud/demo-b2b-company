"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "node:crypto";
import { adminConfig } from "@/lib/admin-config";
import { clearSession, getPending, setSession, tooManyAttempts } from "@/lib/auth";
import { verifyTotp } from "@/lib/totp";

type State = { error?: string };

const safeEq = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

async function ip() {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export async function loginAction(_: State, fd: FormData): Promise<State> {
  if (tooManyAttempts(`login:${await ip()}`)) return { error: "로그인 시도가 너무 많습니다. 10분 후 다시 시도해 주세요." };
  const id = String(fd.get("id") ?? "");
  const pw = String(fd.get("password") ?? "");
  if (!safeEq(id, adminConfig.id) || !safeEq(pw, adminConfig.password)) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }
  await setSession("pending", id);
  redirect("/admin/otp");
}

export async function otpAction(_: State, fd: FormData): Promise<State> {
  const pending = await getPending();
  if (!pending) redirect("/admin/login");
  if (tooManyAttempts(`otp:${await ip()}`)) return { error: "인증 시도가 너무 많습니다. 10분 후 다시 시도해 주세요." };
  const code = String(fd.get("code") ?? "").replace(/\s/g, "");
  if (!verifyTotp(adminConfig.totpSecret, code)) return { error: "인증 코드가 올바르지 않습니다." };
  await setSession("full", pending.sub);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}
