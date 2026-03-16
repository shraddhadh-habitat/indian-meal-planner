-- Run this in Supabase Dashboard → SQL Editor

-- 1. Visit tracking
create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  user_id uuid references auth.users(id) on delete set null,
  ip text,
  created_at timestamptz default now()
);

-- 2. Groups
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  share_code text unique not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- 3. Group members
create table if not exists group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);

-- 4. Group plans (one plan per group)
create table if not exists group_plans (
  group_id uuid primary key references groups(id) on delete cascade,
  plan jsonb not null,
  updated_at timestamptz default now()
);

-- 5. Telegram subscribers
create table if not exists telegram_chats (
  chat_id bigint primary key,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- RLS: disable for now (service role key bypasses RLS anyway)
-- Enable and configure per-table policies when you want user-level security.
alter table visits enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table group_plans enable row level security;
alter table telegram_chats enable row level security;

-- Allow service role full access (used by server-side API routes)
-- No extra policy needed — service role bypasses RLS by default.

-- Allow authenticated users to read their own group memberships
create policy "Members can read their groups" on group_members
  for select using (auth.uid() = user_id);

create policy "Members can read group plans" on group_plans
  for select using (
    exists (
      select 1 from group_members
      where group_members.group_id = group_plans.group_id
        and group_members.user_id = auth.uid()
    )
  );
