import type { Inquiry, Notice, Product } from "./types";

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`;

export const productImages = [
  img("photo-1625464733746-f884014c73bc"), // 샤프트·소형 부품
  img("photo-1570224282208-8319d7252a99"), // 기어
  img("photo-1624841970647-87dce8628d72"), // 알루미늄 가공품
  img("photo-1713371398485-7bde1bde9def"), // 밀링 가공
  img("photo-1740209475472-aa7d280f7452"), // CNC 머시닝
  img("photo-1666634157070-6fd830fb5672"), // 선반 가공
];

export const businessImages = [
  img("photo-1532186773960-85649e5cb70b"), // 반도체 장비
  img("photo-1567789884554-0b844b597180"), // 로봇·자동화
  img("photo-1666634157070-6fd830fb5672"), // 자동차
  img("photo-1625464733746-f884014c73bc"), // 의료기기
];

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

export const seedProducts = (): Product[] => [
  {
    id: "p1",
    slug: "precision-shaft-ps200",
    category: "shaft",
    name: { ko: "정밀 샤프트 PS-200", en: "Precision Shaft PS-200" },
    summary: { ko: "±0.005mm 공차의 고정밀 연삭 샤프트", en: "High-precision ground shaft with ±0.005mm tolerance" },
    description: {
      ko: "CNC 선반 가공 후 원통 연삭으로 마감한 고정밀 샤프트입니다. 반도체 장비, 로봇 관절부 등 높은 회전 정밀도가 필요한 곳에 사용됩니다.",
      en: "Turned on CNC lathes and finished by cylindrical grinding. Used in semiconductor equipment and robot joints that require high rotational accuracy.",
    },
    specs: [
      { label: { ko: "소재", en: "Material" }, value: "SUJ2 / SUS440C" },
      { label: { ko: "직경", en: "Diameter" }, value: "Ø6 – Ø50 mm" },
      { label: { ko: "공차", en: "Tolerance" }, value: "±0.005 mm" },
      { label: { ko: "표면 경도", en: "Hardness" }, value: "HRC 58–62" },
    ],
    image: productImages[0],
    published: true,
    createdAt: daysAgo(40),
  },
  {
    id: "p2",
    slug: "spur-gear-sg-series",
    category: "gear",
    name: { ko: "평기어 SG 시리즈", en: "Spur Gear SG Series" },
    summary: { ko: "모듈 0.5~3, 열처리 평기어 맞춤 제작", en: "Custom heat-treated spur gears, module 0.5–3" },
    description: {
      ko: "호빙 가공과 고주파 열처리로 내마모성을 높인 평기어입니다. 소량 시제품부터 월 1만 개 양산까지 대응합니다.",
      en: "Hobbed and induction-hardened spur gears with high wear resistance. From small prototype lots to 10,000 units per month.",
    },
    specs: [
      { label: { ko: "모듈", en: "Module" }, value: "0.5 – 3" },
      { label: { ko: "잇수", en: "Teeth" }, value: "12 – 120" },
      { label: { ko: "정밀도", en: "Accuracy" }, value: "KS 4급" },
      { label: { ko: "열처리", en: "Heat treatment" }, value: "고주파 / 침탄" },
    ],
    image: productImages[1],
    published: true,
    createdAt: daysAgo(32),
  },
  {
    id: "p3",
    slug: "aluminum-bracket-ab",
    category: "bracket",
    name: { ko: "알루미늄 브라켓 AB", en: "Aluminum Bracket AB" },
    summary: { ko: "5축 가공 경량 구조 브라켓", en: "Lightweight structural bracket, 5-axis machined" },
    description: {
      ko: "A6061 / A7075 소재를 5축 머시닝센터로 일체 가공합니다. 아노다이징 등 표면처리까지 원스톱으로 제공합니다.",
      en: "Machined in one piece from A6061 / A7075 on 5-axis machining centers, with anodizing and other finishes in one stop.",
    },
    specs: [
      { label: { ko: "소재", en: "Material" }, value: "A6061 / A7075" },
      { label: { ko: "최대 크기", en: "Max size" }, value: "600 × 400 × 300 mm" },
      { label: { ko: "공차", en: "Tolerance" }, value: "±0.01 mm" },
      { label: { ko: "표면처리", en: "Finish" }, value: "아노다이징 / 무전해 니켈" },
    ],
    image: productImages[2],
    published: true,
    createdAt: daysAgo(20),
  },
  {
    id: "p4",
    slug: "custom-machining",
    category: "custom",
    name: { ko: "도면 맞춤 가공", en: "Build-to-Print Machining" },
    summary: { ko: "도면 한 장으로 시제품부터 양산까지", en: "From prototype to production with a single drawing" },
    description: {
      ko: "고객 도면을 기반으로 소재 선정, 가공, 열처리, 검사 성적서까지 제공합니다. 2D/3D 도면 모두 접수 가능합니다.",
      en: "Material selection, machining, heat treatment and inspection reports, all based on your drawing. 2D and 3D files accepted.",
    },
    specs: [
      { label: { ko: "최소 수량", en: "MOQ" }, value: "1 EA" },
      { label: { ko: "납기", en: "Lead time" }, value: "7 – 21일" },
      { label: { ko: "도면 형식", en: "File types" }, value: "DWG, STEP, PDF" },
      { label: { ko: "검사", en: "Inspection" }, value: "3차원 측정 성적서" },
    ],
    image: productImages[3],
    published: true,
    createdAt: daysAgo(10),
  },
];

export const seedNotices = (): Notice[] => [
  {
    id: "n1",
    title: { ko: "2026 SIMTOS 공작기계전 참가 안내", en: "Hanbit at SIMTOS 2026" },
    body: {
      ko: "한빛정밀이 2026 SIMTOS 공작기계전에 참가합니다. 부스에서 신규 5축 가공 샘플을 확인하실 수 있습니다.\n\n일시: 2026년 4월 6일 – 10일\n장소: 킨텍스 제1전시장",
      en: "Hanbit Precision will exhibit at SIMTOS 2026. Visit our booth to see new 5-axis machining samples.\n\nDate: April 6–10, 2026\nVenue: KINTEX Hall 1",
    },
    pinned: true,
    createdAt: daysAgo(14),
  },
  {
    id: "n2",
    title: { ko: "ISO 9001 인증 갱신 완료", en: "ISO 9001 certification renewed" },
    body: { ko: "품질경영시스템 ISO 9001:2015 인증을 갱신했습니다.", en: "We have renewed our ISO 9001:2015 quality management certification." },
    pinned: false,
    createdAt: daysAgo(30),
  },
  {
    id: "n3",
    title: { ko: "설 연휴 휴무 안내", en: "Lunar New Year holiday notice" },
    body: { ko: "설 연휴 기간 동안 휴무합니다. 견적 문의는 연휴 이후 순차적으로 회신드립니다.", en: "We are closed during the Lunar New Year holiday. Quote requests will be answered after the holiday." },
    pinned: false,
    createdAt: daysAgo(60),
  },
];

export const seedInquiries = (): Inquiry[] => [
  {
    id: "q1",
    company: "(주)데모로보틱스",
    name: "김대리",
    email: "demo1@example.com",
    phone: "010-0000-0001",
    product: "정밀 샤프트 PS-200",
    quantity: "500 EA",
    message: "Ø12 샤프트 500개 견적 요청드립니다. 도면은 회신 주시면 전달하겠습니다.",
    locale: "ko",
    status: "new",
    memo: "",
    createdAt: daysAgo(1),
  },
  {
    id: "q2",
    company: "Demo Automation GmbH",
    name: "Anna Schmidt",
    email: "demo2@example.com",
    phone: "+49-000-0000",
    product: "Spur Gear SG Series",
    quantity: "2,000 EA / month",
    message: "We are looking for a long-term supplier of module 1.5 spur gears.",
    locale: "en",
    status: "progress",
    memo: "샘플 3종 발송 예정",
    createdAt: daysAgo(3),
  },
  {
    id: "q3",
    company: "데모전자",
    name: "박과장",
    email: "demo3@example.com",
    phone: "010-0000-0003",
    product: "도면 맞춤 가공",
    quantity: "20 EA",
    message: "시제품 20개 제작 가능 여부 문의드립니다.",
    locale: "ko",
    status: "done",
    memo: "견적서 발송 완료",
    createdAt: daysAgo(7),
  },
];
