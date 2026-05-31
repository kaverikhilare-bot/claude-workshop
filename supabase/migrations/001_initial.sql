-- Customers
create table if not exists customers (
  id           uuid primary key default gen_random_uuid(),
  email        text unique not null,
  full_name    text,
  phone        text,
  address      jsonb,
  created_at   timestamptz default now(),
  last_seen_at timestamptz,
  source       text default 'landing_page'
);

-- Products
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10,2) not null,
  stock       integer default 0,
  image_url   text,
  category    text
);

-- Orders
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid references customers(id),
  items            jsonb not null,
  shipping_address jsonb not null,
  total            numeric(10,2) not null,
  status           text default 'pending',
  created_at       timestamptz default now()
);
