export type InquiryForm = {
  company: string; name: string; email: string; phone: string;
  product: string; quantity: string; message: string; agree: boolean; website?: string;
};
export type InquiryErrors = Partial<Record<"company" | "name" | "email" | "message" | "agree", true>>;

export function validateInquiry(f: Partial<InquiryForm>): InquiryErrors {
  const e: InquiryErrors = {};
  if (!f.company?.trim()) e.company = true;
  if (!f.name?.trim()) e.name = true;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email?.trim() ?? "")) e.email = true;
  const m = f.message?.trim() ?? "";
  if (m.length < 10 || m.length > 3000) e.message = true;
  if (!f.agree) e.agree = true;
  return e;
}
