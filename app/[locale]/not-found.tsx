import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export default async function NotFound() {
  const t = await getTranslations("products");
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-20 text-center">
      <p className="text-6xl font-black text-signal-500">404</p>
      <Link href="/" className="btn-dark mt-8">← {t("back").replace(/목록으로|Back to list/, "Home")}</Link>
    </section>
  );
}
