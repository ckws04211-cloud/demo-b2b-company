import NextLink from "next/link";
import { getTranslations } from "next-intl/server";

export default async function SiteFooter() {
  const t = await getTranslations();
  return (
    <footer className="bg-ink-900 py-12 text-sm text-ink-300">
      <div className="container-x flex flex-col justify-between gap-8 md:flex-row">
        <div>
          <p className="text-lg font-extrabold text-white">{t("brand.name")}</p>
          <p className="mt-3">{t("location.addressValue")}</p>
          <p className="mt-1">
            {t("location.tel")} {t("location.telValue")} · {t("location.fax")} {t("location.faxValue")}
          </p>
        </div>
        <div className="md:text-right">
          <NextLink href="/admin" className="inline-block rounded border border-white/15 px-3 py-1.5 text-xs font-semibold text-ink-300 hover:text-white">
            {t("footer.admin")}
          </NextLink>
          <p className="mt-4 text-xs">{t("footer.demo")}</p>
          <p className="mt-1 text-xs">© {new Date().getFullYear()} HANBIT PRECISION</p>
        </div>
      </div>
    </footer>
  );
}
