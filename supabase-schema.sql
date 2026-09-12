create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  username text not null unique,
  phone text not null default '',
  country text not null default 'tz',
  has_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  phone text not null,
  payment_phone text,
  amount numeric not null default 14500,
  currency text not null default 'TZS',
  order_id text,
  reference text,
  status text not null default 'PENDING_MANUAL',
  transid text,
  verified_at timestamptz,
  verified_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null default 'MANUAL_PAYMENT',
  message text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.payments add column if not exists payment_phone text;
alter table public.payments add column if not exists verified_at timestamptz;
alter table public.payments add column if not exists verified_by uuid references auth.users(id);

alter table public.profiles enable row level security;
alter table public.payments enable row level security;
alter table public.admin_notifications enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using (id = auth.uid());

drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own" on public.payments for select to authenticated using (user_id = auth.uid());

drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own" on public.payments for insert to authenticated with check (user_id = auth.uid());

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at before update on public.payments for each row execute function public.set_updated_at();

create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_status_idx on public.payments(status);
create index if not exists admin_notifications_read_idx on public.admin_notifications(read_at);
