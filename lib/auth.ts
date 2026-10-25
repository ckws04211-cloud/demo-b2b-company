import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PENDING_COOKIE, SESSION_COOKIE, signSession, verifySession } from "./session";

const secure = process.env.NODE_ENV === "production";

export async function setSession(stage: "pending" | "full", sub: string) {
  const ttl = stage === "pending" ? 5 * 60_000 : 8 * 3600_000;
  const token = await signSession({ sub, stage, exp: Date.now() + ttl });
  const jar = await cookies();
  jar.set(stage === "pending" ? PENDING_COOKIE : SESSION_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure, path: "/admin", maxAge: ttl / 1000,
  });
  if (stage === "full") jar.delete({ name: PENDING_COOKIE, path: "/admin" });
}

export async function getPending() {
  return verifySession((await cookies()).get(PENDING_COOKIE)?.value, "pending");
}

/** 서버 액션/페이지에서 재검증 (미들웨어에만 의존하지 않음) */
export async function requireAdmin() {
  const s = await verifySession((await cookies()).get(SESSION_COOKIE)?.value, "full");
  if (!s) redirect("/admin/login");
  return s;
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete({ name: SESSION_COOKIE, path: "/admin" });
  jar.delete({ name: PENDING_COOKIE, path: "/admin" });
}

// 로그인 시도 제한 (IP 기준 10분에 10회)
const attempts = new Map<string, number[]>();
export function tooManyAttempts(key: string) {
  const list = (attempts.get(key) ?? []).filter((t) => Date.now() - t < 10 * 60_000);
  list.push(Date.now());
  attempts.set(key, list);
  return list.length > 10;
}
