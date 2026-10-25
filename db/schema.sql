create table if not exists leads (
  id bigserial primary key,
  type text not null check (type in ('investor','waitlist')),
  contact text not null,
  created_at timestamptz not null default now(),
  unique (type, contact)
);


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

create table if not exists investor_messages (
  id bigserial primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists investor_messages_created_at_idx on investor_messages (created_at desc);

alter table bookings add column if not exists payment_method text;
alter table bookings drop constraint if exists bookings_payment_method_check;
alter table bookings add constraint bookings_payment_method_check
  check (payment_method is null or payment_method in ('cash', 'upi', 'card'));

-- Customer reviews: one per completed booking, shown on the home page.
-- Safe to run more than once. Run it in the Neon SQL editor.
create table if not exists reviews (
  id bigserial primary key,
  booking_id bigint not null unique references bookings(id) on delete cascade,
  uid text not null references users(uid),
  pro_uid text,
  service text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 400),
  display_name text not null,          -- e.g. "Mayank K." (first name + last initial)
  is_hidden boolean not null default false, -- admin can hide spam or abuse
  created_at timestamptz not null default now()
);
create index if not exists reviews_public_idx on reviews (created_at desc) where not is_hidden;
