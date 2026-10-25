-- How the customer paid for a completed job (entered by the professional on completion).
-- Safe to run more than once. Run it in the Neon SQL editor.
alter table bookings add column if not exists payment_method text;
alter table bookings drop constraint if exists bookings_payment_method_check;
alter table bookings add constraint bookings_payment_method_check
  check (payment_method is null or payment_method in ('cash', 'upi', 'card'));
