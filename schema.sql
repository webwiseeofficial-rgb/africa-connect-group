-- Africa Connect Group — Supabase schema
-- Run once in: Supabase dashboard → SQL Editor → New query → paste → Run.

-- ============ 1. Contact settings (single row) ============
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  email text,
  whatsapp text,
  phone1 text,
  phone2 text,
  updated_at timestamptz not null default now()
);
insert into public.settings (id, email, whatsapp, phone1, phone2)
values (1, 'africaconnectgroup1@gmail.com', '+243 899 639 009', '+243 899 639 009', '+213 793 338 879')
on conflict (id) do nothing;

-- ============ 2. News & projects ============
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('news', 'project')),
  title jsonb not null default '{}'::jsonb,   -- {"fr": "...", "en": "...", "ar": "...", "es": "..."}
  body jsonb not null default '{}'::jsonb,
  image_url text,                              -- optional
  image_path text,                             -- optional (storage path, used for deletion)
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists entries_kind_created_idx on public.entries (kind, created_at desc);

-- ============ 3. Visits ============
create table if not exists public.visits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  path text not null check (char_length(path) <= 300),
  lang text check (char_length(lang) <= 5),
  visitor text check (char_length(visitor) <= 64),
  device text check (device in ('mobile', 'tablet', 'desktop')),
  referrer text check (char_length(referrer) <= 200)
);
create index if not exists visits_created_idx on public.visits (created_at desc);

-- ============ 4. Row Level Security ============
alter table public.settings enable row level security;
alter table public.entries  enable row level security;
alter table public.visits   enable row level security;

drop policy if exists settings_read   on public.settings;
drop policy if exists settings_update on public.settings;
create policy settings_read   on public.settings for select to anon, authenticated using (true);
create policy settings_update on public.settings for update to authenticated using (true) with check (id = 1);

drop policy if exists entries_read_public on public.entries;
drop policy if exists entries_admin_all   on public.entries;
create policy entries_read_public on public.entries for select to anon using (published = true);
create policy entries_admin_all   on public.entries for all to authenticated using (true) with check (true);

drop policy if exists visits_insert on public.visits;
create policy visits_insert on public.visits for insert to anon, authenticated with check (true);
-- no select policy on visits: statistics are read through visit_stats() below

-- ============ 5. Statistics function (admin only) ============
create or replace function public.visit_stats(days int default 30)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  d int := least(greatest(coalesce(days, 30), 1), 365);
  tz text := 'Africa/Kinshasa';
  today date := (now() at time zone tz)::date;
  since timestamptz := ((today - (d - 1))::timestamp) at time zone tz;
  result json;
begin
  if auth.uid() is null then
    raise exception 'not authorized';
  end if;

  select json_build_object(
    'views',    (select count(*) from visits where created_at >= since),
    'uniques',  (select count(distinct visitor) from visits where created_at >= since),
    'today_views',   (select count(*) from visits where (created_at at time zone tz)::date = today),
    'today_uniques', (select count(distinct visitor) from visits where (created_at at time zone tz)::date = today),
    'daily', (
      select coalesce(json_agg(x order by x.day), '[]'::json) from (
        select g.day::date as day, count(v.id) as views, count(distinct v.visitor) as uniques
        from generate_series(today - (d - 1), today, interval '1 day') as g(day)
        left join visits v on (v.created_at at time zone tz)::date = g.day::date and v.created_at >= since
        group by g.day
      ) x),
    'pages', (
      select coalesce(json_agg(x), '[]'::json) from (
        select path as label, count(*) as n from visits where created_at >= since
        group by path order by n desc limit 10) x),
    'langs', (
      select coalesce(json_agg(x), '[]'::json) from (
        select coalesce(lang, '?') as label, count(*) as n from visits where created_at >= since
        group by 1 order by n desc) x),
    'devices', (
      select coalesce(json_agg(x), '[]'::json) from (
        select coalesce(device, '?') as label, count(*) as n from visits where created_at >= since
        group by 1 order by n desc) x),
    'sources', (
      select coalesce(json_agg(x), '[]'::json) from (
        select coalesce(nullif(referrer, ''), 'direct') as label, count(*) as n from visits where created_at >= since
        group by 1 order by n desc limit 8) x)
  ) into result;

  return result;
end;
$$;
revoke all on function public.visit_stats(int) from public, anon;
grant execute on function public.visit_stats(int) to authenticated;

-- ============ 6. Image storage ============
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_insert on storage.objects;
drop policy if exists media_update on storage.objects;
drop policy if exists media_delete on storage.objects;
create policy media_insert on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy media_update on storage.objects for update to authenticated using (bucket_id = 'media');
create policy media_delete on storage.objects for delete to authenticated using (bucket_id = 'media');
