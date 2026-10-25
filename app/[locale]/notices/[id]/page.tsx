import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getNotice } from "@/lib/repo";
import { fmtDate, t10n } from "@/lib/l10n";

export const dynamic = "force-dynamic";

export default async function NoticeDetail({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const n = await getNotice(id);
  if (!n) notFound();
  const t = await getTranslations("notices");

  return (
    <section className="pb-20 pt-28 md:pt-36">
      <div className="container-x max-w-3xl">
        <Link href="/notices" className="text-sm font-semibold text-ink-500 hover:text-ink-900">← {t("back")}</Link>
        <article className="mt-6 border-t-2 border-ink-900">
          <header className="border-b border-ink-100 py-6">
            <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">{t10n(n.title, locale)}</h1>
            <p className="mt-2 text-sm text-ink-300">{fmtDate(n.createdAt, locale)}</p>
          </header>
          <div className="whitespace-pre-line py-8 leading-relaxed text-ink-700">{t10n(n.body, locale)}</div>
        </article>
      </div>
    </section>
  );
}
