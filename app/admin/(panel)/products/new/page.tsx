import ProductForm from "@/components/admin/ProductForm";
import { PageHead } from "@/components/admin/ui";
import { productImages } from "@/lib/seed";

export default function NewProduct() {
  return (
    <>
      <PageHead title="제품 등록" />
      <ProductForm images={productImages} />
    </>
  );
}
