import { getTranslations, setRequestLocale } from "next-intl/server";
import PageHero from "@/components/PageHero";
import InquiryForm from "@/components/InquiryForm";
import { listProducts } from "@/lib/repo";
import { t10n } from "@/lib/l10n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: (await getTranslations({ locale, namespace: "inquiry" }))("title") };
}

export default async function Inquiry({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ product?: string }> }) {
  const { locale } = await params;
  const { product } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("inquiry");
  const products = (await listProducts()).map((p) => t10n(p.name, locale));

  return (
    <>
      <PageHero eyebrow="REQUEST A QUOTE" title={t("title")} desc={t("desc")} />
      <section className="py-14 md:py-20">
        <div className="container-x max-w-4xl">
          <InquiryForm products={products} initialProduct={product && products.includes(product) ? product : undefined} />
        </div>
      </section>
    </>
  );
}
