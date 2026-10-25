"use client";

import { useActionState, useState } from "react";
import { saveProductAction } from "@/app/admin/actions";
import type { Product } from "@/lib/types";
import SubmitBar, { LangTabs } from "./SubmitBar";

type Spec = { label: { ko: string; en: string }; value: string };
const catLabels = { shaft: "샤프트", gear: "기어", bracket: "브라켓", custom: "맞춤 가공" };

export default function ProductForm({ product, images }: { product?: Product; images: string[] }) {
  const [state, action, pending] = useActionState(saveProductAction, {});
  const [lang, setLang] = useState<"ko" | "en">("ko");
  const [image, setImage] = useState(product?.image ?? "");
  const [specs, setSpecs] = useState<Spec[]>(product?.specs ?? [{ label: { ko: "", en: "" }, value: "" }]);

  const setSpec = (i: number, fn: (s: Spec) => Spec) => setSpecs((arr) => arr.map((s, j) => (j === i ? fn(s) : s)));

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="specs" value={JSON.stringify(specs)} />

      <section className="rounded-lg border border-ink-100 bg-white p-6">
        <h2 className="mb-4 font-bold text-ink-900">기본 정보</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <label>
            <span className="label">카테고리 <span className="text-red-500">*</span></span>
            <select name="category" className="input" defaultValue={product?.category ?? ""}>
              <option value="" disabled>선택</option>
              {Object.entries(catLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>
            <span className="label">URL (slug) <span className="text-red-500">*</span></span>
            <input name="slug" className="input font-mono" defaultValue={product?.slug} placeholder="precision-shaft-ps200" />
          </label>
          <label className="flex items-end gap-2 pb-2.5 text-sm font-semibold text-ink-700">
            <input type="checkbox" name="published" defaultChecked={product?.published ?? true} className="h-4 w-4 accent-signal-500" /> 사이트에 공개
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-ink-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">제품 내용</h2>
          <LangTabs lang={lang} setLang={setLang} />
        </div>
        {(["ko", "en"] as const).map((l) => {
          const sfx = l === "ko" ? "Ko" : "En";
          return (
            <div key={l} className={lang === l ? "space-y-5" : "hidden"}>
              <label className="block">
                <span className="label">제품명 {l === "ko" ? <span className="text-red-500">*</span> : <span className="font-normal text-ink-300">(비우면 국문 사용)</span>}</span>
                <input name={`name${sfx}`} className="input" defaultValue={product?.name[l]} />
              </label>
              <label className="block"><span className="label">한 줄 요약</span><input name={`summary${sfx}`} className="input" defaultValue={product?.summary[l]} /></label>
              <label className="block"><span className="label">상세 설명</span><textarea name={`desc${sfx}`} className="input min-h-[120px]" defaultValue={product?.description[l]} /></label>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-ink-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">제품 사양</h2>
          <button type="button" className="btn-ghost py-2" onClick={() => setSpecs((a) => [...a, { label: { ko: "", en: "" }, value: "" }])}>+ 항목 추가</button>
        </div>
        <div className="space-y-2">
          <div className="hidden grid-cols-[1fr_1fr_1.4fr_40px] gap-2 text-xs font-bold text-ink-500 md:grid">
            <span>항목명(국문)</span><span>항목명(영문)</span><span>값</span><span />
          </div>
          {specs.map((sp, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 md:grid-cols-[1fr_1fr_1.4fr_40px]">
              <input className="input" placeholder="소재" value={sp.label.ko} onChange={(e) => setSpec(i, (s) => ({ ...s, label: { ...s.label, ko: e.target.value } }))} />
              <input className="input" placeholder="Material" value={sp.label.en} onChange={(e) => setSpec(i, (s) => ({ ...s, label: { ...s.label, en: e.target.value } }))} />
              <input className="input col-span-2 md:col-span-1" placeholder="SUS304" value={sp.value} onChange={(e) => setSpec(i, (s) => ({ ...s, value: e.target.value }))} />
              <button type="button" aria-label="삭제" onClick={() => setSpecs((a) => a.filter((_, j) => j !== i))} className="col-span-2 rounded-md border border-ink-100 text-ink-300 hover:text-red-600 md:col-span-1">×</button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-ink-100 bg-white p-6">
        <h2 className="mb-1 font-bold text-ink-900">대표 이미지 <span className="text-red-500">*</span></h2>
        <p className="mb-4 text-sm text-ink-500">데모에서는 준비된 이미지 중에서 선택합니다. (실 운영 시 파일 업로드로 교체)</p>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {images.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setImage(src)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition ${image === src ? "border-signal-500 ring-2 ring-signal-50" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src.replace("w=1200", "w=300")} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </section>

      <SubmitBar pending={pending} cancelHref="/admin/products" error={state.error} />
    </form>
  );
}
