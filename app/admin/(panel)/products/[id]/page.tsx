import { notFound } from "next/navigation";
import { deleteProductAction } from "@/app/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";
import ProductForm from "@/components/admin/ProductForm";
import { PageHead } from "@/components/admin/ui";
import { getProduct } from "@/lib/repo";
import { productImages } from "@/lib/seed";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();
  return (
    <>
      <div className="flex items-start justify-between">
        <PageHead title="제품 수정" desc={p.name.ko} />
        <DeleteButton id={p.id} action={deleteProductAction} />
      </div>
      <ProductForm product={p} images={productImages} />
    </>
  );
}
