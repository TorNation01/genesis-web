-- Run in Supabase SQL editor or via CLI migrations
create extension if not exists "pgcrypto";

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  primary_genre text not null,
  secondary_genre text,
  time_period text not null,
  mash_enabled boolean not null default false,
  content_rating text not null,
  preview_text text not null,
  room_code text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists campaigns_user_id_idx on public.campaigns (user_id);
create index if not exists campaigns_room_code_idx on public.campaigns (room_code);

alter table public.campaigns enable row level security;

create policy "Users can insert own campaigns"
  on public.campaigns for insert
  with check (auth.uid() = user_id);

create policy "Users can select own campaigns"
  on public.campaigns for select
  using (auth.uid() = user_id);

create policy "Users can update own campaigns"
  on public.campaigns for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own campaigns"
  on public.campaigns for delete
  using (auth.uid() = user_id);
