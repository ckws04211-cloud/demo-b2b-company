export default function AuthCard({ step, title, desc, children }: { step: 1 | 2; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded bg-signal-500 font-black text-white">H</span>
          <span className="text-xl font-extrabold text-white">한빛정밀 관리자</span>
        </div>
        <div className="rounded-xl bg-white p-8 shadow-2xl">
          <div className="mb-6 flex gap-2">
            {[1, 2].map((n) => (
              <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-signal-500" : "bg-ink-100"}`} />
            ))}
          </div>
          <p className="text-xs font-bold text-signal-500">STEP {step} / 2</p>
          <h1 className="mt-1 text-2xl font-bold text-ink-900">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-500">{desc}</p>
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
