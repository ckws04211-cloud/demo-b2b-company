import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/repo";
import { validateInquiry, type InquiryForm } from "@/lib/inquiry-validate";

const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const recent = (hits.get(ip) ?? []).filter((t) => Date.now() - t < 60_000);
  recent.push(Date.now());
  hits.set(ip, recent);
  if (recent.length > 5) return NextResponse.json({ ok: false }, { status: 429 });

  let body: Partial<InquiryForm> & { locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true });

  const errors = validateInquiry(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const clip = (s: string | undefined, n: number) => (s ?? "").trim().slice(0, n);
  await createInquiry({
    company: clip(body.company, 100),
    name: clip(body.name, 50),
    email: clip(body.email, 120),
    phone: clip(body.phone, 30),
    product: clip(body.product, 100),
    quantity: clip(body.quantity, 50),
    message: clip(body.message, 3000),
    locale: body.locale === "en" ? "en" : "ko",
  });
  return NextResponse.json({ ok: true });
}
