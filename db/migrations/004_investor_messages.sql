-- Messages sent through the "Investors" popup on the website.
-- Safe to run more than once. Run it in the Neon SQL editor.
create table if not exists investor_messages (
  id bigserial primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists investor_messages_created_at_idx on investor_messages (created_at desc);
