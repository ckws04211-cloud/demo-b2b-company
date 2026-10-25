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
