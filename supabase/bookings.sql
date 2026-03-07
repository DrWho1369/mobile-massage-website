-- Booking requests from the website. Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id text,
  service_name text,
  duration smallint,
  location_type text,
  neighborhood text,
  preferred_date text,
  client_name text not null,
  client_email text not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

-- No policies for anon/authenticated; only service role can insert/select (used in Server Action).
