import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { seedInquiries, seedNotices, seedProducts } from "./seed";
import type { Inquiry, InquiryStatus, Notice, Product } from "./types";

/**
 * 저장소: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 가 있으면 Supabase,
 * 없으면 메모리 데모 저장소(서버 재시작 시 초기 데이터로 리셋)를 사용합니다.
 */

const uid = () => crypto.randomUUID();
const now = () => new Date().toISOString();

type Store = { products: Product[]; notices: Notice[]; inquiries: Inquiry[] };
const g = globalThis as unknown as { __hanbitStore?: Store; __hanbitSb?: SupabaseClient };

function mem(): Store {
  g.__hanbitStore ??= { products: seedProducts(), notices: seedNotices(), inquiries: seedInquiries() };
  return g.__hanbitStore;
}

const hasSupabase = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

/** Supabase 라이브러리는 키가 설정된 경우에만 불러옴 (데모 모드에서는 로드하지 않음) */
async function sb(): Promise<SupabaseClient | null> {
  if (!hasSupabase()) return null;
  if (!g.__hanbitSb) {
    const { createClient } = await import("@supabase/supabase-js");
    g.__hanbitSb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  }
  return g.__hanbitSb;
}

export const isDemoStore = () => !hasSupabase();

const byDateDesc = <T extends { createdAt: string }>(a: T, b: T) => b.createdAt.localeCompare(a.createdAt);

// Supabase 행(snake_case) <-> 앱 타입(camelCase)
const toProduct = (r: Record<string, unknown>): Product => ({
  id: r.id as string,
  slug: r.slug as string,
  category: r.category as Product["category"],
  name: r.name as Product["name"],
  summary: r.summary as Product["summary"],
  description: r.description as Product["description"],
  specs: r.specs as Product["specs"],
  image: r.image as string,
  published: r.published as boolean,
  createdAt: r.created_at as string,
});
const toNotice = (r: Record<string, unknown>): Notice => ({
  id: r.id as string,
  title: r.title as Notice["title"],
  body: r.body as Notice["body"],
  pinned: r.pinned as boolean,
  createdAt: r.created_at as string,
});
const toInquiry = (r: Record<string, unknown>): Inquiry => ({
  id: r.id as string,
  company: r.company as string,
  name: r.name as string,
  email: r.email as string,
  phone: r.phone as string,
  product: r.product as string,
  quantity: r.quantity as string,
  message: r.message as string,
  locale: r.locale as Inquiry["locale"],
  status: r.status as InquiryStatus,
  memo: r.memo as string,
  createdAt: r.created_at as string,
});

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/* ---------- Products ---------- */
export async function listProducts(opts: { includeHidden?: boolean } = {}): Promise<Product[]> {
  const c = await sb();
  if (c) {
    let q = c.from("products").select("*").order("created_at", { ascending: false });
    if (!opts.includeHidden) q = q.eq("published", true);
    return must(await q).map(toProduct);
  }
  return mem().products.filter((p) => opts.includeHidden || p.published).sort(byDateDesc);
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  const c = await sb();
  if (c) {
    // id 컬럼은 uuid라 UUID 형식일 때만 id로, 아니면 slug로 조회
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const { data } = await c.from("products").select("*").eq(isUuid ? "id" : "slug", idOrSlug).maybeSingle();
    return data ? toProduct(data) : null;
  }
  return mem().products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
}

export async function saveProduct(input: Omit<Product, "id" | "createdAt"> & { id?: string }): Promise<void> {
  const c = await sb();
  if (c) {
    const row = { slug: input.slug, category: input.category, name: input.name, summary: input.summary, description: input.description, specs: input.specs, image: input.image, published: input.published };
    if (input.id) must(await c.from("products").update(row).eq("id", input.id));
    else must(await c.from("products").insert(row));
    return;
  }
  const s = mem();
  if (input.id) {
    const i = s.products.findIndex((p) => p.id === input.id);
    if (i >= 0) s.products[i] = { ...s.products[i], ...input, id: input.id };
  } else {
    s.products.push({ ...input, id: uid(), createdAt: now() });
  }
}

export async function deleteProduct(id: string) {
  const c = await sb();
  if (c) return void must(await c.from("products").delete().eq("id", id));
  const s = mem();
  s.products = s.products.filter((p) => p.id !== id);
}

/* ---------- Notices ---------- */
export async function listNotices(): Promise<Notice[]> {
  const c = await sb();
  const rows = c ? must(await c.from("notices").select("*").order("created_at", { ascending: false })).map(toNotice) : [...mem().notices].sort(byDateDesc);
  return rows.sort((a, b) => Number(b.pinned) - Number(a.pinned));
}

export async function getNotice(id: string): Promise<Notice | null> {
  const c = await sb();
  if (c) {
    const { data } = await c.from("notices").select("*").eq("id", id).maybeSingle();
    return data ? toNotice(data) : null;
  }
  return mem().notices.find((n) => n.id === id) ?? null;
}

export async function saveNotice(input: Omit<Notice, "id" | "createdAt"> & { id?: string }) {
  const c = await sb();
  if (c) {
    const row = { title: input.title, body: input.body, pinned: input.pinned };
    if (input.id) must(await c.from("notices").update(row).eq("id", input.id));
    else must(await c.from("notices").insert(row));
    return;
  }
  const s = mem();
  if (input.id) {
    const i = s.notices.findIndex((n) => n.id === input.id);
    if (i >= 0) s.notices[i] = { ...s.notices[i], ...input, id: input.id };
  } else {
    s.notices.push({ ...input, id: uid(), createdAt: now() });
  }
}

export async function deleteNotice(id: string) {
  const c = await sb();
  if (c) return void must(await c.from("notices").delete().eq("id", id));
  const s = mem();
  s.notices = s.notices.filter((n) => n.id !== id);
}

/* ---------- Inquiries ---------- */
export async function listInquiries(): Promise<Inquiry[]> {
  const c = await sb();
  if (c) return must(await c.from("inquiries").select("*").order("created_at", { ascending: false })).map(toInquiry);
  return [...mem().inquiries].sort(byDateDesc);
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  const c = await sb();
  if (c) {
    const { data } = await c.from("inquiries").select("*").eq("id", id).maybeSingle();
    return data ? toInquiry(data) : null;
  }
  return mem().inquiries.find((q) => q.id === id) ?? null;
}

export async function createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status" | "memo">) {
  const c = await sb();
  if (c) return void must(await c.from("inquiries").insert({ ...input, status: "new", memo: "" }));
  mem().inquiries.push({ ...input, id: uid(), status: "new", memo: "", createdAt: now() });
}

export async function updateInquiry(id: string, patch: { status?: InquiryStatus; memo?: string }) {
  const c = await sb();
  if (c) return void must(await c.from("inquiries").update(patch).eq("id", id));
  const q = mem().inquiries.find((x) => x.id === id);
  if (q) Object.assign(q, patch);
}
