-- KelolaKos — PostgreSQL schema (Supabase)
-- Jalankan seluruh file ini di SQL Editor Supabase

create extension if not exists "pgcrypto";

-- ─── Auth ─────────────────────────────────────────────────────
create table if not exists users (
  id text primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  phone text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists user_settings (
  user_id text primary key references users(id) on delete cascade,
  settings jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists password_reset_tokens (
  email text not null,
  token text primary key,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_password_reset_email on password_reset_tokens(email);

-- ─── Core data ──────────────────────────────────────────────────
create table if not exists properties (
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
create index if not exists idx_properties_user on properties(user_id);

create table if not exists rooms (
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
create index if not exists idx_rooms_property on rooms(property_id);

create table if not exists tenants (
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
create index if not exists idx_tenants_room on tenants(room_id);

create table if not exists payments (
  id text primary key,
  tenant_id text not null references tenants(id) on delete cascade,
  room_id text not null references rooms(id) on delete cascade,
  period_month int not null,
  period_year int not null,
  amount numeric not null,
  status text not null default 'belum',
  due_date date not null,
  data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_payments_period on payments(period_year, period_month);
create index if not exists idx_payments_room on payments(room_id);

create table if not exists utility_bills (
  id text primary key,
  room_id text not null references rooms(id) on delete cascade,
  tenant_id text references tenants(id) on delete set null,
  type text not null,
  period_month int not null,
  period_year int not null,
  meter_start numeric not null default 0,
  meter_end numeric not null default 0,
  rate_per_unit numeric not null default 0,
  amount numeric not null default 0,
  status text not null default 'belum',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists maintenance_tickets (
  id text primary key,
  property_id text not null references properties(id) on delete cascade,
  room_id text references rooms(id) on delete set null,
  title text not null,
  description text not null default '',
  priority text not null default 'sedang',
  status text not null default 'open',
  reported_by text not null default '',
  assigned_to text,
  cost numeric,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists expenses (
  id text primary key,
  property_id text not null references properties(id) on delete cascade,
  category text not null,
  description text not null,
  amount numeric not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists inventory_items (
  id text primary key,
  room_id text not null references rooms(id) on delete cascade,
  name text not null,
  condition text not null default 'baik',
  quantity int not null default 1,
  value numeric not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists waitlist_entries (
  id text primary key,
  property_id text not null references properties(id) on delete cascade,
  name text not null,
  phone text not null,
  budget numeric,
  preferred_room text,
  move_in_date date,
  status text not null default 'menunggu',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activities (
  id text primary key,
  type text not null,
  message text not null,
  entity_type text not null,
  entity_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_activities_created on activities(created_at desc);

create table if not exists whatsapp_logs (
  id text primary key,
  phone text not null,
  message text not null,
  status text not null,
  tenant_id text references tenants(id) on delete set null,
  created_at timestamptz not null default now()
);