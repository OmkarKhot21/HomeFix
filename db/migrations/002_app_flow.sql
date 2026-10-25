-- HomeFix app flow: customer accounts, booking requests, partner sign-ups, callback requests.
-- Safe to run more than once. Run it in the Neon SQL editor for your database.

create table if not exists users (
  uid text primary key,               -- Firebase user id
  name text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  last_login_at timestamptz not null default now()
);

create table if not exists bookings (
  id bigserial primary key,
  uid text not null references users(uid),
  service text not null,
  contact_phone text not null,
  address text not null,
  preferred_date date not null,
  preferred_slot text not null,
  notes text,
  status text not null default 'new' check (status in ('new','confirmed','completed','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists bookings_created_at_idx on bookings (created_at desc);

create table if not exists partner_applications (
  id bigserial primary key,
  uid text not null unique references users(uid),
  name text not null,
  phone text not null,
  trade text not null check (trade in ('plumber','electrician','carpenter')),
  area text not null,
  experience_years int not null check (experience_years between 0 and 60),
  created_at timestamptz not null default now()
);

create table if not exists callback_requests (
  id bigserial primary key,
  phone text not null,
  created_at timestamptz not null default now()
);
create index if not exists callback_requests_created_at_idx on callback_requests (created_at desc);
