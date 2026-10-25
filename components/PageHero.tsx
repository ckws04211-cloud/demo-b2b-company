export default function PageHero({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink-900 pb-14 pt-32 text-white md:pb-20 md:pt-40">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="container-x relative">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold md:text-5xl">{title}</h1>
        {desc && <p className="mt-4 max-w-2xl text-ink-300 md:text-lg">{desc}</p>}
      </div>
    </section>
  );
}
