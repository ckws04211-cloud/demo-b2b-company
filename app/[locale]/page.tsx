import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { listNotices, listProducts } from "@/lib/repo";
import { fmtDate, t10n } from "@/lib/l10n";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tp = await getTranslations("products");
  const [products, notices] = await Promise.all([listProducts(), listNotices()]);
  const stats = t.raw("stats") as { value: string; label: string }[];
  const why = t.raw("why") as { title: string; desc: string }[];

  return (
    <>
      <section className="relative flex min-h-[620px] items-end overflow-hidden bg-ink-900 pb-20 md:min-h-[760px] md:pb-28">
        <Image src="https://images.unsplash.com/photo-1740209475472-aa7d280f7452?auto=format&fit=crop&w=2000&q=70" alt="" fill priority className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/20" />
        <div className="container-x relative text-white">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-tight md:text-[64px]">
            {t("title1")}
            <br />
            <span className="text-signal-500">{t("title2")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-ink-300 md:text-lg">{t("desc")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/inquiry" className="btn-primary px-7 py-3.5 text-base">{t("ctaQuote")}</Link>
            <Link href="/products" className="btn border border-white/30 px-7 py-3.5 text-base text-white hover:bg-white/10">{t("ctaProducts")}</Link>
          </div>
        </div>
      </section>

      <section className="bg-signal-500 text-white">
        <div className="container-x grid grid-cols-2 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-white/20 py-8 odd:border-r even:pl-5 md:border-r md:pl-6 md:first:pl-0 md:last:border-r-0 md:py-10">
              <p className="text-2xl font-extrabold md:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-white/80">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">PRODUCTS</p>
              <h2 className="h-section">{t("productsTitle")}</h2>
            </div>
            <Link href="/products" className="hidden text-sm font-semibold text-signal-500 hover:underline md:block">{t("productsMore")} →</Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/products/${p.slug}`} className="group overflow-hidden rounded-lg border border-ink-100 bg-white transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-50">
                  <Image src={p.image} alt={t10n(p.name, locale)} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-signal-500">{tp(`categories.${p.category}`)}</p>
                  <h3 className="mt-1.5 font-bold text-ink-900">{t10n(p.name, locale)}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">{t10n(p.summary, locale)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">WHY HANBIT</p>
            <h2 className="h-section">{t("whyTitle")}</h2>
          </div>
          <div className="grid gap-4">
            {why.map((w, i) => (
              <div key={w.title} className="flex gap-6 rounded-lg bg-white p-7">
                <span className="text-3xl font-black text-signal-500">0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-bold text-ink-900">{w.title}</h3>
                  <p className="mt-1.5 text-ink-500">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-x">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold text-ink-900 md:text-3xl">{t("noticeTitle")}</h2>
            <Link href="/notices" className="text-sm font-semibold text-signal-500 hover:underline">+ MORE</Link>
          </div>
          <ul className="mt-6 divide-y divide-ink-100 border-y border-ink-100">
            {notices.slice(0, 3).map((n) => (
              <li key={n.id}>
                <Link href={`/notices/${n.id}`} className="flex items-center justify-between gap-4 py-5 hover:text-signal-500">
                  <span className="truncate font-semibold">{t10n(n.title, locale)}</span>
                  <span className="shrink-0 text-sm text-ink-300">{fmtDate(n.createdAt, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink-900 py-16 text-white">
        <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">{t("ctaBand")}</h2>
            <p className="mt-2 text-ink-300">{t("ctaBandDesc")}</p>
          </div>
          <Link href="/inquiry" className="btn-primary px-7 py-3.5 text-base">{t("ctaQuote")}</Link>
        </div>
      </section>
    </>
  );
}
