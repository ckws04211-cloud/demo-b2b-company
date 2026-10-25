-- 한빛정밀 데모: Supabase SQL Editor에서 실행하세요.
create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null check (category in ('shaft','gear','bracket','custom')),
  name jsonb not null,
  summary jsonb not null,
  description jsonb not null,
  specs jsonb not null default '[]',
  image text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists notices (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  body jsonb not null,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  name text not null,
  email text not null,
  phone text not null default '',
  product text not null default '',
  quantity text not null default '',
  message text not null,
  locale text not null default 'ko',
  status text not null default 'new' check (status in ('new','progress','done')),
  memo text not null default '',
  created_at timestamptz not null default now()
);

-- 서버(service role)만 접근하도록 RLS 활성화 + 공개 정책 없음
alter table products enable row level security;
alter table notices enable row level security;
alter table inquiries enable row level security;

-- 데모 데이터 (여러 번 실행해도 중복되지 않음)
insert into products (slug, category, name, summary, description, specs, image, published, created_at) values ('precision-shaft-ps200', 'shaft', '{"ko":"정밀 샤프트 PS-200","en":"Precision Shaft PS-200"}'::jsonb, '{"ko":"±0.005mm 공차의 고정밀 연삭 샤프트","en":"High-precision ground shaft with ±0.005mm tolerance"}'::jsonb, '{"ko":"CNC 선반 가공 후 원통 연삭으로 마감한 고정밀 샤프트입니다. 반도체 장비, 로봇 관절부 등 높은 회전 정밀도가 필요한 곳에 사용됩니다.","en":"Turned on CNC lathes and finished by cylindrical grinding. Used in semiconductor equipment and robot joints that require high rotational accuracy."}'::jsonb, '[{"label":{"ko":"소재","en":"Material"},"value":"SUJ2 / SUS440C"},{"label":{"ko":"직경","en":"Diameter"},"value":"Ø6 – Ø50 mm"},{"label":{"ko":"공차","en":"Tolerance"},"value":"±0.005 mm"},{"label":{"ko":"표면 경도","en":"Hardness"},"value":"HRC 58–62"}]'::jsonb, 'https://images.unsplash.com/photo-1625464733746-f884014c73bc?auto=format&fit=crop&w=1200&q=70', true, '2026-09-15T01:53:18.297Z') on conflict (slug) do nothing;
insert into products (slug, category, name, summary, description, specs, image, published, created_at) values ('spur-gear-sg-series', 'gear', '{"ko":"평기어 SG 시리즈","en":"Spur Gear SG Series"}'::jsonb, '{"ko":"모듈 0.5~3, 열처리 평기어 맞춤 제작","en":"Custom heat-treated spur gears, module 0.5–3"}'::jsonb, '{"ko":"호빙 가공과 고주파 열처리로 내마모성을 높인 평기어입니다. 소량 시제품부터 월 1만 개 양산까지 대응합니다.","en":"Hobbed and induction-hardened spur gears with high wear resistance. From small prototype lots to 10,000 units per month."}'::jsonb, '[{"label":{"ko":"모듈","en":"Module"},"value":"0.5 – 3"},{"label":{"ko":"잇수","en":"Teeth"},"value":"12 – 120"},{"label":{"ko":"정밀도","en":"Accuracy"},"value":"KS 4급"},{"label":{"ko":"열처리","en":"Heat treatment"},"value":"고주파 / 침탄"}]'::jsonb, 'https://images.unsplash.com/photo-1570224282208-8319d7252a99?auto=format&fit=crop&w=1200&q=70', true, '2026-09-23T01:53:18.297Z') on conflict (slug) do nothing;
insert into products (slug, category, name, summary, description, specs, image, published, created_at) values ('aluminum-bracket-ab', 'bracket', '{"ko":"알루미늄 브라켓 AB","en":"Aluminum Bracket AB"}'::jsonb, '{"ko":"5축 가공 경량 구조 브라켓","en":"Lightweight structural bracket, 5-axis machined"}'::jsonb, '{"ko":"A6061 / A7075 소재를 5축 머시닝센터로 일체 가공합니다. 아노다이징 등 표면처리까지 원스톱으로 제공합니다.","en":"Machined in one piece from A6061 / A7075 on 5-axis machining centers, with anodizing and other finishes in one stop."}'::jsonb, '[{"label":{"ko":"소재","en":"Material"},"value":"A6061 / A7075"},{"label":{"ko":"최대 크기","en":"Max size"},"value":"600 × 400 × 300 mm"},{"label":{"ko":"공차","en":"Tolerance"},"value":"±0.01 mm"},{"label":{"ko":"표면처리","en":"Finish"},"value":"아노다이징 / 무전해 니켈"}]'::jsonb, 'https://images.unsplash.com/photo-1624841970647-87dce8628d72?auto=format&fit=crop&w=1200&q=70', true, '2026-10-05T01:53:18.297Z') on conflict (slug) do nothing;
insert into products (slug, category, name, summary, description, specs, image, published, created_at) values ('custom-machining', 'custom', '{"ko":"도면 맞춤 가공","en":"Build-to-Print Machining"}'::jsonb, '{"ko":"도면 한 장으로 시제품부터 양산까지","en":"From prototype to production with a single drawing"}'::jsonb, '{"ko":"고객 도면을 기반으로 소재 선정, 가공, 열처리, 검사 성적서까지 제공합니다. 2D/3D 도면 모두 접수 가능합니다.","en":"Material selection, machining, heat treatment and inspection reports, all based on your drawing. 2D and 3D files accepted."}'::jsonb, '[{"label":{"ko":"최소 수량","en":"MOQ"},"value":"1 EA"},{"label":{"ko":"납기","en":"Lead time"},"value":"7 – 21일"},{"label":{"ko":"도면 형식","en":"File types"},"value":"DWG, STEP, PDF"},{"label":{"ko":"검사","en":"Inspection"},"value":"3차원 측정 성적서"}]'::jsonb, 'https://images.unsplash.com/photo-1713371398485-7bde1bde9def?auto=format&fit=crop&w=1200&q=70', true, '2026-10-15T01:53:18.297Z') on conflict (slug) do nothing;
insert into notices (title, body, pinned, created_at)
select * from (values
  ('{"ko":"2026 SIMTOS 공작기계전 참가 안내","en":"Hanbit at SIMTOS 2026"}'::jsonb, '{"ko":"한빛정밀이 2026 SIMTOS 공작기계전에 참가합니다. 부스에서 신규 5축 가공 샘플을 확인하실 수 있습니다.\n\n일시: 2026년 4월 6일 – 10일\n장소: 킨텍스 제1전시장","en":"Hanbit Precision will exhibit at SIMTOS 2026. Visit our booth to see new 5-axis machining samples.\n\nDate: April 6–10, 2026\nVenue: KINTEX Hall 1"}'::jsonb, true, '2026-10-11T01:53:18.298Z'::timestamptz),
  ('{"ko":"ISO 9001 인증 갱신 완료","en":"ISO 9001 certification renewed"}'::jsonb, '{"ko":"품질경영시스템 ISO 9001:2015 인증을 갱신했습니다.","en":"We have renewed our ISO 9001:2015 quality management certification."}'::jsonb, false, '2026-09-25T01:53:18.298Z'::timestamptz),
  ('{"ko":"설 연휴 휴무 안내","en":"Lunar New Year holiday notice"}'::jsonb, '{"ko":"설 연휴 기간 동안 휴무합니다. 견적 문의는 연휴 이후 순차적으로 회신드립니다.","en":"We are closed during the Lunar New Year holiday. Quote requests will be answered after the holiday."}'::jsonb, false, '2026-08-26T01:53:18.298Z'::timestamptz)
) as v(title, body, pinned, created_at)
where not exists (select 1 from notices);
