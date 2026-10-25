"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

const items = ["about", "business", "products", "facilities", "notices", "location"] as const;

export default function SiteHeader() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const home = pathname === "/";

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const solid = !home || scrolled || open;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${solid ? "border-b border-ink-100 bg-white" : "bg-transparent"}`}>
      <div className="container-x flex h-16 items-center justify-between md:h-[72px]">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded bg-signal-500 text-sm font-black text-white">H</span>
          <span className={`text-lg font-extrabold tracking-tight ${solid ? "text-ink-900" : "text-white"}`}>{t("brand.name")}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {items.map((k) => (
            <Link
              key={k}
              href={`/${k}`}
              className={`text-[15px] font-semibold transition ${
                pathname.startsWith(`/${k}`) ? "text-signal-500" : solid ? "text-ink-700 hover:text-ink-900" : "text-white/85 hover:text-white"
              }`}
            >
              {t(`nav.${k}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className={`flex overflow-hidden rounded border text-xs font-bold ${solid ? "border-ink-100" : "border-white/30"}`}>
            {(["ko", "en"] as const).map((l) => (
              <Link
                key={l}
                href={pathname}
                locale={l}
                className={`px-2.5 py-1.5 uppercase ${locale === l ? "bg-signal-500 text-white" : solid ? "text-ink-500" : "text-white/80"}`}
              >
                {l}
              </Link>
            ))}
          </div>
          <Link href="/inquiry" className="btn-primary hidden py-2.5 md:inline-flex">{t("nav.inquiry")}</Link>
          <button type="button" aria-label="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={`p-1 lg:hidden ${solid ? "text-ink-900" : "text-white"}`}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-100 bg-white lg:hidden">
          {[...items, "inquiry" as const].map((k) => (
            <Link key={k} href={`/${k}`} className="block border-b border-ink-50 px-5 py-4 font-semibold text-ink-700">
              {t(`nav.${k}`)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
