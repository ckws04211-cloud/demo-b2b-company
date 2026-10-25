"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { deleteNotice, deleteProduct, saveNotice, saveProduct, updateInquiry } from "@/lib/repo";
import type { InquiryStatus, ProductCategory } from "@/lib/types";

export type FormState = { error?: string; ok?: boolean };

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

export async function saveNoticeAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const titleKo = s(fd, "titleKo");
  const bodyKo = s(fd, "bodyKo");
  if (!titleKo || !bodyKo) return { error: "국문 제목과 내용은 필수입니다." };
  await saveNotice({
    id: s(fd, "id") || undefined,
    title: { ko: titleKo, en: s(fd, "titleEn") || titleKo },
    body: { ko: bodyKo, en: s(fd, "bodyEn") || bodyKo },
    pinned: fd.get("pinned") === "on",
  });
  revalidatePath("/", "layout");
  redirect("/admin/notices?saved=1");
}

export async function deleteNoticeAction(fd: FormData) {
  await requireAdmin();
  await deleteNotice(s(fd, "id"));
  revalidatePath("/", "layout");
  redirect("/admin/notices?deleted=1");
}

const CATS: ProductCategory[] = ["shaft", "gear", "bracket", "custom"];

export async function saveProductAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const nameKo = s(fd, "nameKo");
  const slug = s(fd, "slug").toLowerCase();
  const category = s(fd, "category") as ProductCategory;
  const image = s(fd, "image");

  if (!nameKo) return { error: "국문 제품명은 필수입니다." };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return { error: "URL(slug)은 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다." };
  if (!CATS.includes(category)) return { error: "카테고리를 선택해 주세요." };
  if (!image.startsWith("https://images.unsplash.com/")) return { error: "이미지를 선택해 주세요." };

  let specs: { label: { ko: string; en: string }; value: string }[] = [];
  try {
    specs = (JSON.parse(s(fd, "specs") || "[]") as typeof specs).filter((x) => x.label.ko && x.value);
  } catch {
    return { error: "사양 정보 형식이 올바르지 않습니다." };
  }

  try {
    await saveProduct({
      id: s(fd, "id") || undefined,
      slug,
      category,
      name: { ko: nameKo, en: s(fd, "nameEn") || nameKo },
      summary: { ko: s(fd, "summaryKo"), en: s(fd, "summaryEn") || s(fd, "summaryKo") },
      description: { ko: s(fd, "descKo"), en: s(fd, "descEn") || s(fd, "descKo") },
      specs: specs.map((x) => ({ label: { ko: x.label.ko, en: x.label.en || x.label.ko }, value: x.value })),
      image,
      published: fd.get("published") === "on",
    });
  } catch (e) {
    return { error: e instanceof Error && e.message.includes("duplicate") ? "이미 사용 중인 URL(slug)입니다." : "저장에 실패했습니다." };
  }
  revalidatePath("/", "layout");
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(fd: FormData) {
  await requireAdmin();
  await deleteProduct(s(fd, "id"));
  revalidatePath("/", "layout");
  redirect("/admin/products?deleted=1");
}

export async function updateInquiryAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const status = s(fd, "status") as InquiryStatus;
  if (!["new", "progress", "done"].includes(status)) return { error: "상태 값이 올바르지 않습니다." };
  await updateInquiry(s(fd, "id"), { status, memo: s(fd, "memo").slice(0, 2000) });
  revalidatePath("/admin", "layout");
  return { ok: true };
}
