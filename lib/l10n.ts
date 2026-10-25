import type { L10n, Locale } from "./types";

export const t10n = (v: L10n, locale: string) => v[(locale as Locale)] || v.ko;

export const fmtDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === "en" ? "en-US" : "ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Seoul" }).format(new Date(iso));
