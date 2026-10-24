create table if not exists leads (
  id bigserial primary key,
  type text not null check (type in ('investor','waitlist')),
  contact text not null,
  created_at timestamptz not null default now(),
  unique (type, contact)
);
