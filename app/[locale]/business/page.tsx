import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import { businessImages } from "@/lib/seed";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: (await getTranslations({ locale, namespace: "business" }))("title") };
}

export default async function Business({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("business");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <>
      <PageHero eyebrow="INDUSTRIES" title={t("title")} desc={t("desc")} />
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <article key={it.title} className="group relative aspect-[16/10] overflow-hidden rounded-lg">
              <Image src={businessImages[i]} alt="" fill className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                <p className="text-sm font-bold text-signal-500">0{i + 1}</p>
                <h2 className="mt-1 text-2xl font-bold">{it.title}</h2>
                <p className="mt-2 text-ink-100">{it.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
