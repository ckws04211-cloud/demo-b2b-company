export type Locale = "ko" | "en";
export type L10n = { ko: string; en: string };

export type ProductCategory = "shaft" | "gear" | "bracket" | "custom";

export type Product = {
  id: string;
  slug: string;
  category: ProductCategory;
  name: L10n;
  summary: L10n;
  description: L10n;
  specs: { label: L10n; value: string }[];
  image: string;
  published: boolean;
  createdAt: string;
};

export type Notice = {
  id: string;
  title: L10n;
  body: L10n;
  pinned: boolean;
  createdAt: string;
};

export type InquiryStatus = "new" | "progress" | "done";

export type Inquiry = {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  message: string;
  locale: Locale;
  status: InquiryStatus;
  memo: string;
  createdAt: string;
};
