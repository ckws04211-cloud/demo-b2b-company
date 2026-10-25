import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: (await getTranslations({ locale, namespace: "about" }))("title") };
}

export default async function About({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const history = t.raw("history") as { year: string; text: string }[];
  const certs = t.raw("certs") as string[];

  return (
    <>
      <PageHero eyebrow="COMPANY" title={t("title")} desc={t("desc")} />
      <section className="py-20 md:py-28">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src="https://images.unsplash.com/photo-1644522248824-ed975fd9ee81?auto=format&fit=crop&w=1200&q=70" alt="" fill className="object-cover" />
          </div>
          <div>
            <p className="eyebrow">CEO MESSAGE</p>
            <h2 className="h-section">{t("ceoTitle")}</h2>
            <p className="mt-6 leading-relaxed text-ink-500">{t("ceoBody")}</p>
            <p className="mt-6 font-bold text-ink-900">{t("ceoName")}</p>
          </div>
        </div>
      </section>
      <section className="bg-ink-50 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="eyebrow">HISTORY</p>
            <h2 className="h-section">{t("historyTitle")}</h2>
          </div>
          <ol className="divide-y divide-ink-100 rounded-lg bg-white">
            {history.map((h) => (
              <li key={h.year} className="grid grid-cols-[90px_1fr] gap-4 p-6 md:grid-cols-[120px_1fr]">
                <span className="text-xl font-black text-signal-500">{h.year}</span>
                <span className="font-medium text-ink-700">{h.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="py-20 md:py-24">
        <div className="container-x">
          <p className="eyebrow">CERTIFICATIONS</p>
          <h2 className="h-section">{t("certTitle")}</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {certs.map((c) => (
              <div key={c} className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border border-ink-100 p-4 text-center">
                <svg className="h-10 w-10 text-signal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="9" r="6" /><path d="M8.5 14 7 22l5-3 5 3-1.5-8" /></svg>
                <p className="mt-4 font-bold text-ink-900">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
