import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = { title: "관리자 | 한빛정밀", robots: { index: false, follow: false } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-ink-50">{children}</body>
    </html>
  );
}
