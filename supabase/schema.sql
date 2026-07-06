-- KelolaKos — PostgreSQL schema (Supabase)
-- Jalankan di SQL Editor Supabase saat migrasi dari JSON storage

create extension if not exists "pgcrypto";

create table users (
  id text primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  phone text not null default '',
  created_at timestamptz not null default now()
);

create table user_settings (
  user_id text primary key references users(id) on delete cascade,
  settings jsonb not null default '{}'
);

create table properties (
  id text primary key,
  user_id text not null references users(id) on delete cascade,
  name text not null,
  address text not null default '',
  city text not null default '',
  owner_name text not null default '',
  owner_phone text not null default '',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_properties_user on properties(user_id);

create table rooms (
  id text primary key,
  property_id text not null references properties(id) on delete cascade,
  number text not null,
  floor int not null default 1,
  monthly_rent numeric not null default 0,
  status text not null default 'kosong',
  electricity_type text not null default 'termasuk',
  facilities jsonb not null default '[]',
  photo_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_rooms_property on rooms(property_id);

create table tenants (
  id text primary key,
  room_id text not null references rooms(id) on delete cascade,
  name text not null,
  phone text not null,
  portal_token text unique not null,
  check_in date not null,
  is_active boolean not null default true,
  data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payments (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  room_id text not null references rooms(id) on delete cascade,
  period_month int not null,
  period_year int not null,
  amount numeric not null,
  status text not null default 'belum',
  due_date date not null,
  data jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_payments_period on payments(period_year, period_month);

-- Row Level Security (enable per table setelah adapter siap)
-- alter table properties enable row level security;
-- create policy "owner_only" on properties for all using (user_id = auth.uid()::text);