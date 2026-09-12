-- Run this once in Supabase SQL Editor. Safe to re-run.
create extension if not exists pgcrypto;

alter table public.profiles add column if not exists has_paid boolean not null default false;
alter table public.payments add column if not exists payment_phone text;
alter table public.payments add column if not exists verified_at timestamptz;
alter table public.payments add column if not exists verified_by uuid;

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null default 'MANUAL_PAYMENT',
  message text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.admin_notifications enable row level security;
create index if not exists payments_status_created_idx on public.payments(status, created_at desc);
create index if not exists admin_notifications_read_idx on public.admin_notifications(read, created_at desc);
