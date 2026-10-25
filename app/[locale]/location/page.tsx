import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: (await getTranslations({ locale, namespace: "location" }))("title") };
}

export default async function Location({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("location");
  const rows = (["address", "tel", "fax", "hours"] as const).map((k) => ({ label: t(k), value: t(`${k}Value`) }));

  return (
    <>
      <PageHero eyebrow="LOCATION" title={t("title")} desc={t("desc")} />
      <section className="py-16 md:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <iframe
            title="map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=126.7000%2C37.3950%2C126.7300%2C37.4100&layer=mapnik&marker=37.4025%2C126.7150"
            className="h-[360px] w-full rounded-lg border border-ink-100 md:h-[460px]"
            loading="lazy"
          />
          <dl className="divide-y divide-ink-100 rounded-lg border border-ink-100 px-6">
            {rows.map((r) => (
              <div key={r.label} className="py-5">
                <dt className="text-sm font-bold text-signal-500">{r.label}</dt>
                <dd className="mt-1 font-medium text-ink-900">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
