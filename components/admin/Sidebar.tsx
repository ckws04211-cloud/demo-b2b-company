"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/app/admin/auth-actions";

const menu = [
  { href: "/admin", label: "대시보드", icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { href: "/admin/inquiries", label: "견적 문의", icon: "M4 4h16v12H5.2L4 17.2V4z" },
  { href: "/admin/products", label: "제품 관리", icon: "M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7" },
  { href: "/admin/notices", label: "공지사항", icon: "M5 4h14v16H5zM9 8h6M9 12h6M9 16h4" },
];

export default function Sidebar({ newCount }: { newCount: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (h: string) => (h === "/admin" ? path === h : path.startsWith(h));

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-ink-100 bg-white px-4 lg:hidden">
        <span className="font-extrabold text-ink-900">한빛정밀 관리자</span>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-label="menu" className="p-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
      <aside className={`${open ? "block" : "hidden"} fixed inset-y-0 left-0 z-50 w-64 flex-col bg-ink-900 text-ink-300 lg:flex`}>
        <div className="flex h-16 items-center gap-2.5 px-6">
          <span className="grid h-8 w-8 place-items-center rounded bg-signal-500 text-sm font-black text-white">H</span>
          <span className="font-extrabold text-white">한빛정밀 Admin</span>
        </div>
        <nav className="mt-4 flex-1 space-y-1 px-3">
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${active(m.href) ? "bg-signal-500 text-white" : "hover:bg-white/5 hover:text-white"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d={m.icon} /></svg>
              <span className="flex-1">{m.label}</span>
              {m.href === "/admin/inquiries" && newCount > 0 && <span className="rounded-full bg-red-500 px-2 text-xs text-white">{newCount}</span>}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-white/10 p-4">
          <a href="/ko" target="_blank" className="block rounded-md px-3 py-2 text-sm hover:bg-white/5 hover:text-white">사이트 보기 ↗</a>
          <form action={logoutAction}><button className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-white/5 hover:text-white">로그아웃</button></form>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
    </>
  );
}
