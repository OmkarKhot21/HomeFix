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
