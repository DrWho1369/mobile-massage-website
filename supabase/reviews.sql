-- Reviews table + RLS policies for public submission + approved-only display.
-- Run this in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating smallint not null,
  text text not null,
  created_at timestamptz not null default now(),
  is_approved boolean not null default false,
  constraint reviews_rating_check check (rating between 1 and 5),
  constraint reviews_name_length_check check (char_length(name) between 1 and 80),
  constraint reviews_text_length_check check (char_length(text) between 10 and 1200)
);

create index if not exists reviews_is_approved_idx on public.reviews (is_approved);
create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

alter table public.reviews enable row level security;

-- Allow public read of approved reviews only.
drop policy if exists "Public can read approved reviews" on public.reviews;
create policy "Public can read approved reviews"
on public.reviews
for select
to public
using (is_approved = true);

-- Allow public submissions, but never allow self-approval.
drop policy if exists "Public can submit reviews (unapproved)" on public.reviews;
create policy "Public can submit reviews (unapproved)"
on public.reviews
for insert
to public
with check (is_approved = false);

