-- UNSEEN shared public profile table
-- This version supports the current no-login form.
-- Public profiles can be read by visitors; anyone can submit a profile.
-- No public UPDATE or DELETE policy is created.
-- Add authentication, rate limits, reporting/moderation before a large public launch.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  age_group text not null,
  education text not null,
  category text not null,
  skills text not null default '',
  bio text not null check (char_length(bio) between 1 and 260),
  idea_title text not null check (char_length(idea_title) between 1 and 70),
  idea_description text not null check (char_length(idea_description) between 1 and 500),
  stage text not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select on public.profiles to anon, authenticated;
grant insert on public.profiles to anon, authenticated;

drop policy if exists "Anyone can read public UNSEEN profiles" on public.profiles;
create policy "Anyone can read public UNSEEN profiles"
on public.profiles for select
to anon, authenticated
using (is_public = true);

drop policy if exists "Anyone can submit a UNSEEN profile" on public.profiles;
create policy "Anyone can submit a UNSEEN profile"
on public.profiles for insert
to anon, authenticated
with check (
  is_public = true
  and char_length(name) between 1 and 40
  and char_length(bio) between 1 and 260
  and char_length(idea_title) between 1 and 70
  and char_length(idea_description) between 1 and 500
);
