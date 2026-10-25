import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: (await getTranslations({ locale, namespace: "facilities" }))("title") };
}

export default async function Facilities({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("facilities");
  const list = t.raw("list") as { name: string; model: string; qty: string; spec: string }[];
  const total = list.reduce((s, x) => s + Number(x.qty), 0);

  return (
    <>
      <PageHero eyebrow="FACILITIES" title={t("title")} desc={t("desc")} />
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="overflow-x-auto rounded-lg border border-ink-100">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-ink-900 text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold">{t("cols.name")}</th>
                  <th className="px-5 py-4 font-semibold">{t("cols.model")}</th>
                  <th className="px-5 py-4 text-right font-semibold">{t("cols.qty")}</th>
                  <th className="px-5 py-4 font-semibold">{t("cols.spec")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {list.map((r) => (
                  <tr key={r.name} className="hover:bg-ink-50">
                    <td className="px-5 py-4 font-semibold text-ink-900">{r.name}</td>
                    <td className="px-5 py-4 text-ink-500">{r.model}</td>
                    <td className="px-5 py-4 text-right font-bold text-signal-500">{r.qty}</td>
                    <td className="px-5 py-4 text-ink-500">{r.spec}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-ink-50 font-bold">
                <tr>
                  <td className="px-5 py-4" colSpan={2}>Total</td>
                  <td className="px-5 py-4 text-right text-signal-500">{total}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
