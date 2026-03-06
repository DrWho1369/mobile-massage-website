-- Blog posts table for Maison Rituals journal. Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  content text not null,
  image_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint posts_slug_unique unique (slug)
);

create index if not exists posts_slug_idx on public.posts (slug);
create index if not exists posts_is_published_idx on public.posts (is_published);
create index if not exists posts_created_at_idx on public.posts (created_at desc);

alter table public.posts enable row level security;

-- Public can read published posts only.
drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts
for select
to public
using (is_published = true);

-- No insert/update/delete for anon; admin uses service role.
