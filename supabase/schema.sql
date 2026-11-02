-- Run this once in the Supabase SQL editor. Tables mirror src/types/resume.ts.
-- Every table has row-level security: users only see and change their own rows.

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  type text not null check (type in ('project','experience','education','skills')),
  title text not null,
  subtitle text,
  location text,
  start_date text,
  end_date text,
  bullets text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.templates (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  header jsonb not null default '{"name":"","links":[]}',
  section_order text[] not null default '{education,experience,project,skills}',
  style jsonb not null default '{"fontFamily":"Times New Roman","fontSizePt":11,"marginIn":0.75}',
  page_size text not null default 'letter' check (page_size in ('letter','a4')),
  updated_at timestamptz not null default now()
);

-- Owned by Person B's feature, created here so the schema lives in one place.
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  sections jsonb not null default '{"project":[],"experience":[],"education":[],"skills":[]}',
  updated_at timestamptz not null default now()
);

alter table public.entries enable row level security;
alter table public.templates enable row level security;
alter table public.resumes enable row level security;

create policy "entries_own" on public.entries for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "templates_own" on public.templates for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "resumes_own" on public.resumes for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
