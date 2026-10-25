-- HomeFix live dispatch: professionals, saved addresses, live job tracking, earnings.
-- Safe to run more than once. Run it in the Neon SQL editor (main branch).

-- Professionals (replaces partner_applications; existing applications are copied in as "pending")
create table if not exists professionals (
  uid text primary key references users(uid),
  name text not null,
  phone text not null,
  trade text not null check (trade in ('plumber','electrician','carpenter')),
  area text not null,
  experience_years int not null check (experience_years between 0 and 60),
  status text not null default 'pending' check (status in ('pending','approved','rejected','suspended')),
  is_online boolean not null default false,
  last_lat double precision,
  last_lng double precision,
  last_location_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

insert into professionals (uid, name, phone, trade, area, experience_years, created_at)
select uid, name, phone, trade, area, experience_years, created_at from partner_applications
on conflict (uid) do nothing;

-- Customer saved addresses
create table if not exists addresses (
  id bigserial primary key,
  uid text not null references users(uid),
  label text not null default 'Home',
  line1 text not null,              -- flat / house no., building
  line2 text,                       -- street, area, landmark
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz not null default now()
);
create index if not exists addresses_uid_idx on addresses (uid);

-- Bookings become live jobs
alter table bookings add column if not exists trade text;
alter table bookings add column if not exists lat double precision;
alter table bookings add column if not exists lng double precision;
alter table bookings add column if not exists price_estimate int;
alter table bookings add column if not exists pro_uid text references professionals(uid);
alter table bookings add column if not exists accepted_at timestamptz;
alter table bookings add column if not exists arrived_at timestamptz;
alter table bookings add column if not exists started_at timestamptz;
alter table bookings add column if not exists completed_at timestamptz;
alter table bookings add column if not exists cancelled_at timestamptz;
alter table bookings add column if not exists final_amount int;
alter table bookings add column if not exists commission_amount int;
alter table bookings add column if not exists pro_earning int;

alter table bookings drop constraint if exists bookings_status_check;
alter table bookings alter column status set default 'searching';
alter table bookings add constraint bookings_status_check check (
  status in ('new','searching','accepted','arrived','in_progress','completed','cancelled','expired')
);

create index if not exists bookings_searching_idx on bookings (trade, created_at) where status = 'searching';
create index if not exists bookings_pro_idx on bookings (pro_uid, completed_at);
create index if not exists bookings_uid_idx on bookings (uid, created_at desc);

-- Requests a professional declined, so they don't see them again
create table if not exists booking_declines (
  booking_id bigint not null references bookings(id) on delete cascade,
  pro_uid text not null references professionals(uid),
  created_at timestamptz not null default now(),
  primary key (booking_id, pro_uid)
);

-- Booking for someone else: who the professional should call
alter table bookings add column if not exists contact_name text;
alter table users add column if not exists contact_name text;    -- saved default contact for future bookings
alter table users add column if not exists contact_phone text;

-- Night charge (₹150 for plumbing/electrical after 8 PM), included in price_estimate
alter table bookings add column if not exists night_charge int not null default 0;
