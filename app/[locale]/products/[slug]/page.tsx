import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { getProduct } from "@/lib/repo";
import { t10n } from "@/lib/l10n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const p = await getProduct(slug);
  return { title: p ? t10n(p.name, locale) : "404" };
}

export default async function ProductDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const p = await getProduct(slug);
  if (!p || !p.published) notFound();
  const t = await getTranslations("products");

  return (
    <section className="pb-20 pt-28 md:pb-28 md:pt-36">
      <div className="container-x">
        <Link href="/products" className="text-sm font-semibold text-ink-500 hover:text-ink-900">← {t("back")}</Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-ink-50">
            <Image src={p.image} alt={t10n(p.name, locale)} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-signal-500">{t(`categories.${p.category}`)}</p>
            <h1 className="mt-2 text-3xl font-bold text-ink-900 md:text-4xl">{t10n(p.name, locale)}</h1>
            <p className="mt-4 text-lg text-ink-500">{t10n(p.summary, locale)}</p>
            <p className="mt-6 leading-relaxed text-ink-700">{t10n(p.description, locale)}</p>
            <h2 className="mt-10 font-bold text-ink-900">{t("specs")}</h2>
            <dl className="mt-3 divide-y divide-ink-100 border-y border-ink-100">
              {p.specs.map((s) => (
                <div key={s.label.ko} className="grid grid-cols-[140px_1fr] gap-4 py-3.5 text-sm">
                  <dt className="font-semibold text-ink-500">{t10n(s.label, locale)}</dt>
                  <dd className="font-medium text-ink-900">{s.value}</dd>
                </div>
              ))}
            </dl>
            <Link href={`/inquiry?product=${encodeURIComponent(t10n(p.name, locale))}`} className="btn-primary mt-10 w-full py-4 text-base md:w-auto md:px-10">
              {t("inquire")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
