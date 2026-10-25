import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import PageHero from "@/components/PageHero";
import { listProducts } from "@/lib/repo";
import { t10n } from "@/lib/l10n";
import type { ProductCategory } from "@/lib/types";

export const dynamic = "force-dynamic";
const cats: ProductCategory[] = ["shaft", "gear", "bracket", "custom"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: (await getTranslations({ locale, namespace: "products" }))("title") };
}

export default async function Products({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ c?: string }> }) {
  const { locale } = await params;
  const { c } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const all = await listProducts();
  const active = cats.includes(c as ProductCategory) ? (c as ProductCategory) : null;
  const list = active ? all.filter((p) => p.category === active) : all;

  return (
    <>
      <PageHero eyebrow="PRODUCTS" title={t("title")} desc={t("desc")} />
      <section className="py-14 md:py-20">
        <div className="container-x">
          <div className="flex flex-wrap gap-2">
            {[null, ...cats].map((k) => (
              <Link
                key={k ?? "all"}
                href={k ? `/products?c=${k}` : "/products"}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${active === k ? "border-ink-900 bg-ink-900 text-white" : "border-ink-100 text-ink-500 hover:border-ink-300"}`}
              >
                {k ? t(`categories.${k}`) : t("all")}
              </Link>
            ))}
          </div>
          {list.length === 0 ? (
            <p className="py-20 text-center text-ink-500">{t("empty")}</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group overflow-hidden rounded-lg border border-ink-100 transition hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-50">
                    <Image src={p.image} alt={t10n(p.name, locale)} fill sizes="(min-width:1024px) 33vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold text-signal-500">{t(`categories.${p.category}`)}</p>
                    <h2 className="mt-1.5 text-lg font-bold text-ink-900">{t10n(p.name, locale)}</h2>
                    <p className="mt-2 text-sm text-ink-500">{t10n(p.summary, locale)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
