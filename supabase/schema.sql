create table if not exists public.customers (
  id text primary key,
  name text not null,
  email text unique not null,
  phone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id text primary key,
  customer_id text not null references public.customers(id) on delete restrict,
  drop_off_date date not null,
  drop_off_time text not null,
  pickup_date text,
  knife_quantity text not null default 'Not provided',
  notes text,
  status text not null default 'booked',
  source text not null default 'ckw-website',
  check_in_time timestamptz,
  actual_quantity integer,
  photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservations_drop_off_date_idx on public.reservations(drop_off_date);
create index if not exists reservations_status_idx on public.reservations(status);
create index if not exists reservations_customer_id_idx on public.reservations(customer_id);

alter table public.customers enable row level security;
alter table public.reservations enable row level security;

-- No anonymous/client policies are intentionally created.
-- The website writes through a Vercel serverless function using the Supabase service role key.
