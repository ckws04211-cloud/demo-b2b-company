import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/PageHero";
import { listNotices } from "@/lib/repo";
import { fmtDate, t10n } from "@/lib/l10n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: (await getTranslations({ locale, namespace: "notices" }))("title") };
}

export default async function Notices({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("notices");
  const list = await listNotices();

  return (
    <>
      <PageHero eyebrow="NEWS" title={t("title")} desc={t("desc")} />
      <section className="py-14 md:py-20">
        <div className="container-x">
          {list.length === 0 ? (
            <p className="py-20 text-center text-ink-500">{t("empty")}</p>
          ) : (
            <ul className="divide-y divide-ink-100 border-y-2 border-ink-900">
              {list.map((n) => (
                <li key={n.id}>
                  <Link href={`/notices/${n.id}`} className="flex items-center gap-4 px-2 py-5 hover:bg-ink-50">
                    {n.pinned && <span className="shrink-0 rounded bg-signal-500 px-2 py-0.5 text-xs font-bold text-white">{t("pinned")}</span>}
                    <span className="flex-1 truncate font-semibold text-ink-900">{t10n(n.title, locale)}</span>
                    <span className="shrink-0 text-sm text-ink-300">{fmtDate(n.createdAt, locale)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
