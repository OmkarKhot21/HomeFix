import { getSql } from './db';
import { DISPATCH_RADIUS_KM } from './geo';
import type { ServiceCategory } from './services';

// Live dispatch data layer (db/migrations/003_live_dispatch.sql).

export type Trade = 'plumber' | 'electrician' | 'carpenter';
export type ProStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type JobStatus =
  | 'new'
  | 'searching'
  | 'accepted'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'expired';

export type PaymentMethodValue = 'cash' | 'upi' | 'card';

export const ACTIVE_JOB_STATUSES: JobStatus[] = ['accepted', 'arrived', 'in_progress'];
/** A booking nobody accepts within this time is marked expired. */
export const SEARCH_TIMEOUT_MINUTES = 30;

export function tradeForCategory(category: ServiceCategory): Trade {
  return category === 'Plumbing' ? 'plumber' : category === 'Electrical' ? 'electrician' : 'carpenter';
}

export function commissionPercent(): number {
  const n = Number(process.env.COMMISSION_PERCENT);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : 20;
}

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);
const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));

// ---------- Customers ----------

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  contactName: string | null; // saved default contact for bookings (someone else)
  contactPhone: string | null;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const sql = getSql();
  const rows = (await sql`
    select uid, name, email, phone, contact_name as "contactName", contact_phone as "contactPhone"
    from users where uid = ${uid}`) as UserProfile[];
  return rows[0] ?? null;
}

export async function updateUserProfile(uid: string, name: string, phone: string): Promise<void> {
  const sql = getSql();
  await sql`update users set name = ${name}, phone = ${phone} where uid = ${uid}`;
}

export async function setUserPhoneIfEmpty(uid: string, phone: string): Promise<void> {
  const sql = getSql();
  await sql`update users set phone = ${phone} where uid = ${uid} and (phone is null or phone = '')`;
}

/** Saves (or clears, with nulls) the default contact used for future bookings. */
export async function setDefaultContact(uid: string, name: string | null, phone: string | null): Promise<void> {
  const sql = getSql();
  await sql`update users set contact_name = ${name}, contact_phone = ${phone} where uid = ${uid}`;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  lat: number;
  lng: number;
}

function mapAddress(r: Record<string, unknown>): Address {
  return {
    id: String(r.id),
    label: String(r.label),
    line1: String(r.line1),
    line2: (r.line2 as string) ?? null,
    lat: Number(r.lat),
    lng: Number(r.lng),
  };
}

export async function listAddresses(uid: string): Promise<Address[]> {
  const sql = getSql();
  const rows = (await sql`
    select id, label, line1, line2, lat, lng from addresses where uid = ${uid} order by created_at desc limit 20`) as Record<string, unknown>[];
  return rows.map(mapAddress);
}

export async function getAddress(uid: string, id: string): Promise<Address | null> {
  const sql = getSql();
  const rows = (await sql`
    select id, label, line1, line2, lat, lng from addresses where uid = ${uid} and id = ${id}`) as Record<string, unknown>[];
  return rows[0] ? mapAddress(rows[0]) : null;
}

export async function addAddress(
  uid: string,
  a: { label: string; line1: string; line2: string | null; lat: number; lng: number }
): Promise<Address> {
  const sql = getSql();
  const rows = (await sql`
    insert into addresses (uid, label, line1, line2, lat, lng)
    values (${uid}, ${a.label}, ${a.line1}, ${a.line2}, ${a.lat}, ${a.lng})
    returning id, label, line1, line2, lat, lng`) as Record<string, unknown>[];
  return mapAddress(rows[0]);
}

export async function deleteAddress(uid: string, id: string): Promise<void> {
  const sql = getSql();
  await sql`delete from addresses where uid = ${uid} and id = ${id}`;
}

// ---------- Bookings (customer side) ----------

export interface CustomerBooking {
  id: string;
  service: string;
  status: JobStatus;
  address: string;
  lat: number | null;
  lng: number | null;
  preferredDate: string;
  preferredSlot: string;
  notes: string | null;
  priceEstimate: number | null;
  nightCharge: number;
  finalAmount: number | null;
  paymentMethod: PaymentMethodValue | null;
  createdAt: string;
  acceptedAt: string | null;
  arrivedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  pro: null | {
    name: string;
    phone: string;
    trade: Trade;
    experienceYears: number;
    lat: number | null;
    lng: number | null;
    locationAt: string | null;
  };
}

function mapCustomerBooking(r: Record<string, unknown>): CustomerBooking {
  return {
    id: String(r.id),
    service: String(r.service),
    status: r.status as JobStatus,
    address: String(r.address),
    lat: num(r.lat),
    lng: num(r.lng),
    preferredDate: String(r.preferred_date),
    preferredSlot: String(r.preferred_slot),
    notes: (r.notes as string) ?? null,
    priceEstimate: num(r.price_estimate),
    nightCharge: Number(r.night_charge ?? 0),
    finalAmount: num(r.final_amount),
    paymentMethod: (r.payment_method as PaymentMethodValue) ?? null,
    createdAt: iso(r.created_at)!,
    acceptedAt: iso(r.accepted_at),
    arrivedAt: iso(r.arrived_at),
    startedAt: iso(r.started_at),
    completedAt: iso(r.completed_at),
    pro: r.pro_name
      ? {
          name: String(r.pro_name),
          phone: String(r.pro_phone),
          trade: r.pro_trade as Trade,
          experienceYears: Number(r.pro_experience),
          lat: num(r.pro_lat),
          lng: num(r.pro_lng),
          locationAt: iso(r.pro_location_at),
        }
      : null,
  };
}

export async function createLiveBooking(b: {
  uid: string;
  service: string;
  trade: Trade;
  contactPhone: string;
  contactName: string | null;
  address: string;
  lat: number;
  lng: number;
  preferredDate: string;
  preferredSlot: string;
  notes: string | null;
  priceEstimate: number;
  nightCharge: number;
}): Promise<string> {
  const sql = getSql();
  const rows = (await sql`
    insert into bookings (uid, service, trade, contact_phone, contact_name, address, lat, lng, preferred_date, preferred_slot, notes, price_estimate, night_charge, status)
    values (${b.uid}, ${b.service}, ${b.trade}, ${b.contactPhone}, ${b.contactName}, ${b.address}, ${b.lat}, ${b.lng},
            ${b.preferredDate}, ${b.preferredSlot}, ${b.notes}, ${b.priceEstimate}, ${b.nightCharge}, 'searching')
    returning id`) as { id: string | number }[];
  return String(rows[0].id);
}

/** Marks bookings that nobody accepted in time as expired. Cheap; called from polling endpoints. */
// Polling endpoints call this every few seconds; run the update at most every 30 s per server
// instance. Bookings only expire after SEARCH_TIMEOUT_MINUTES, so the delay is unnoticeable.
const EXPIRE_EVERY_MS = 30_000;
let lastExpireRun = 0;

export async function expireStaleBookings(): Promise<void> {
  if (Date.now() - lastExpireRun < EXPIRE_EVERY_MS) return;
  lastExpireRun = Date.now();
  const sql = getSql();
  await sql`
    update bookings set status = 'expired'
    where status = 'searching' and created_at < now() - make_interval(mins => ${SEARCH_TIMEOUT_MINUTES})`;
}

export async function getBookingForCustomer(uid: string, id: string): Promise<CustomerBooking | null> {
  if (!/^\d{1,18}$/.test(id)) return null;
  const sql = getSql();
  const rows = (await sql`
    select b.*, b.preferred_date::text as preferred_date,
           p.name as pro_name, p.phone as pro_phone, p.trade as pro_trade, p.experience_years as pro_experience,
           p.last_lat as pro_lat, p.last_lng as pro_lng, p.last_location_at as pro_location_at
    from bookings b left join professionals p on p.uid = b.pro_uid
    where b.id = ${id} and b.uid = ${uid}`) as Record<string, unknown>[];
  return rows[0] ? mapCustomerBooking(rows[0]) : null;
}

export async function listCustomerBookings(uid: string, limit = 30): Promise<CustomerBooking[]> {
  const sql = getSql();
  const rows = (await sql`
    select b.*, b.preferred_date::text as preferred_date,
           p.name as pro_name, p.phone as pro_phone, p.trade as pro_trade, p.experience_years as pro_experience,
           null::double precision as pro_lat, null::double precision as pro_lng, null::timestamptz as pro_location_at
    from bookings b left join professionals p on p.uid = b.pro_uid
    where b.uid = ${uid}
    order by b.created_at desc limit ${limit}`) as Record<string, unknown>[];
  return rows.map(mapCustomerBooking);
}

export async function cancelBookingByCustomer(uid: string, id: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    update bookings set status = 'cancelled', cancelled_at = now()
    where id = ${id} and uid = ${uid} and status in ('searching', 'accepted')
    returning id`) as unknown[];
  return rows.length > 0;
}

// ---------- Professionals ----------

export interface Professional {
  uid: string;
  name: string;
  phone: string;
  trade: Trade;
  area: string;
  experienceYears: number;
  status: ProStatus;
  isOnline: boolean;
  lat: number | null;
  lng: number | null;
  locationAt: string | null;
  createdAt: string;
}

function mapPro(r: Record<string, unknown>): Professional {
  return {
    uid: String(r.uid),
    name: String(r.name),
    phone: String(r.phone),
    trade: r.trade as Trade,
    area: String(r.area),
    experienceYears: Number(r.experience_years),
    status: r.status as ProStatus,
    isOnline: Boolean(r.is_online),
    lat: num(r.last_lat),
    lng: num(r.last_lng),
    locationAt: iso(r.last_location_at),
    createdAt: iso(r.created_at)!,
  };
}

export async function getProfessional(uid: string): Promise<Professional | null> {
  const sql = getSql();
  const rows = (await sql`select * from professionals where uid = ${uid}`) as Record<string, unknown>[];
  return rows[0] ? mapPro(rows[0]) : null;
}

export async function upsertProfessional(
  uid: string,
  p: { name: string; phone: string; trade: Trade; area: string; experienceYears: number }
): Promise<void> {
  const sql = getSql();
  // A rejected applicant who re-applies goes back to "pending". Approved pros keep their status.
  await sql`
    insert into professionals (uid, name, phone, trade, area, experience_years)
    values (${uid}, ${p.name}, ${p.phone}, ${p.trade}, ${p.area}, ${p.experienceYears})
    on conflict (uid) do update set
      name = excluded.name, phone = excluded.phone, trade = excluded.trade,
      area = excluded.area, experience_years = excluded.experience_years,
      status = case when professionals.status = 'rejected' then 'pending' else professionals.status end`;
}

export async function setProfessionalOnline(uid: string, online: boolean): Promise<void> {
  const sql = getSql();
  await sql`update professionals set is_online = ${online} where uid = ${uid} and status = 'approved'`;
}

export async function updateProfessionalLocation(uid: string, lat: number, lng: number): Promise<void> {
  const sql = getSql();
  await sql`
    update professionals set last_lat = ${lat}, last_lng = ${lng}, last_location_at = now()
    where uid = ${uid} and status = 'approved'`;
}

export interface JobRequest {
  id: string;
  service: string;
  area: string; // second part of the address only; full address is shown after accepting
  lat: number;
  lng: number;
  distanceKm: number;
  preferredDate: string;
  preferredSlot: string;
  notes: string | null;
  priceEstimate: number | null;
  nightCharge: number;
  createdAt: string;
}

/** Open requests near the professional for their trade, newest first. */
export async function listOpenRequestsForPro(pro: Professional): Promise<JobRequest[]> {
  if (pro.lat === null || pro.lng === null) return [];
  const sql = getSql();
  const rows = (await sql`
    select * from (
      select b.id, b.service, b.address, b.lat, b.lng, b.preferred_date::text as preferred_date,
             b.preferred_slot, b.notes, b.price_estimate, b.night_charge, b.created_at,
             6371 * acos(least(1, greatest(-1,
               cos(radians(${pro.lat})) * cos(radians(b.lat)) * cos(radians(b.lng) - radians(${pro.lng}))
               + sin(radians(${pro.lat})) * sin(radians(b.lat))))) as distance_km
      from bookings b
      where b.status = 'searching'
        and b.trade = ${pro.trade}
        and b.lat is not null
        and b.created_at > now() - make_interval(mins => ${SEARCH_TIMEOUT_MINUTES})
        and not exists (select 1 from booking_declines d where d.booking_id = b.id and d.pro_uid = ${pro.uid})
    ) r
    where r.distance_km <= ${DISPATCH_RADIUS_KM}
    order by r.created_at desc
    limit 20`) as Record<string, unknown>[];

  return rows.map((r) => {
    const parts = String(r.address).split(',').map((s) => s.trim());
    return {
      id: String(r.id),
      service: String(r.service),
      area: parts.slice(-2).join(', ') || 'Nearby',
      lat: Number(r.lat),
      lng: Number(r.lng),
      distanceKm: Number(r.distance_km),
      preferredDate: String(r.preferred_date),
      preferredSlot: String(r.preferred_slot),
      notes: (r.notes as string) ?? null,
      priceEstimate: num(r.price_estimate),
      nightCharge: Number(r.night_charge ?? 0),
      createdAt: iso(r.created_at)!,
    };
  });
}

/** First professional to accept wins. Returns false if someone else got it first. */
export async function acceptBooking(pro: Professional, id: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    update bookings set status = 'accepted', pro_uid = ${pro.uid}, accepted_at = now()
    where id = ${id} and status = 'searching' and trade = ${pro.trade}
      and not exists (
        select 1 from bookings x where x.pro_uid = ${pro.uid} and x.status in ('accepted', 'arrived', 'in_progress')
      )
    returning id`) as unknown[];
  return rows.length > 0;
}

export async function declineBooking(proUid: string, id: string): Promise<void> {
  const sql = getSql();
  await sql`insert into booking_declines (booking_id, pro_uid) values (${id}, ${proUid}) on conflict do nothing`;
}

/** Professional can't make it: job goes back to other professionals. Only before arriving. */
export async function releaseBooking(proUid: string, id: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    update bookings set status = 'searching', pro_uid = null, accepted_at = null, created_at = now()
    where id = ${id} and pro_uid = ${proUid} and status = 'accepted'
    returning id`) as unknown[];
  if (rows.length > 0) await declineBooking(proUid, id);
  return rows.length > 0;
}

export interface ActiveJob {
  id: string;
  service: string;
  status: 'accepted' | 'arrived' | 'in_progress';
  customerName: string | null;
  contactName: string | null; // set when booked for someone else
  contactPhone: string;
  address: string;
  lat: number;
  lng: number;
  notes: string | null;
  preferredDate: string;
  preferredSlot: string;
  priceEstimate: number | null;
  nightCharge: number;
  acceptedAt: string;
}

export async function getActiveJobForPro(proUid: string): Promise<ActiveJob | null> {
  const sql = getSql();
  const rows = (await sql`
    select b.id, b.service, b.status, u.name as customer_name, b.contact_name, b.contact_phone, b.address, b.lat, b.lng,
           b.notes, b.preferred_date::text as preferred_date, b.preferred_slot, b.price_estimate, b.night_charge, b.accepted_at
    from bookings b join users u on u.uid = b.uid
    where b.pro_uid = ${proUid} and b.status in ('accepted', 'arrived', 'in_progress')
    order by b.accepted_at desc limit 1`) as Record<string, unknown>[];
  const r = rows[0];
  if (!r) return null;
  return {
    id: String(r.id),
    service: String(r.service),
    status: r.status as ActiveJob['status'],
    customerName: (r.customer_name as string) ?? null,
    contactName: (r.contact_name as string) ?? null,
    contactPhone: String(r.contact_phone),
    address: String(r.address),
    lat: Number(r.lat),
    lng: Number(r.lng),
    notes: (r.notes as string) ?? null,
    preferredDate: String(r.preferred_date),
    preferredSlot: String(r.preferred_slot),
    priceEstimate: num(r.price_estimate),
    nightCharge: Number(r.night_charge ?? 0),
    acceptedAt: iso(r.accepted_at)!,
  };
}

export async function markArrived(proUid: string, id: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    update bookings set status = 'arrived', arrived_at = now()
    where id = ${id} and pro_uid = ${proUid} and status = 'accepted' returning id`) as unknown[];
  return rows.length > 0;
}

export async function markStarted(proUid: string, id: string): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    update bookings set status = 'in_progress', started_at = now()
    where id = ${id} and pro_uid = ${proUid} and status = 'arrived' returning id`) as unknown[];
  return rows.length > 0;
}

export async function markCompleted(
  proUid: string,
  id: string,
  finalAmount: number,
  paymentMethod: 'cash' | 'upi' | 'card'
): Promise<boolean> {
  const commission = Math.round((finalAmount * commissionPercent()) / 100);
  const sql = getSql();
  try {
    const rows = (await sql`
      update bookings set status = 'completed', completed_at = now(), final_amount = ${finalAmount},
             commission_amount = ${commission}, pro_earning = ${finalAmount - commission},
             payment_method = ${paymentMethod}
      where id = ${id} and pro_uid = ${proUid} and status = 'in_progress' returning id`) as unknown[];
    return rows.length > 0;
  } catch (err) {
    // 42703 = column missing (005_payment_method.sql not run yet). Still complete the job.
    if ((err as { code?: string }).code !== '42703') throw err;
    console.error('[DB] payment_method column missing; run db/migrations/005_payment_method.sql');
    const rows = (await sql`
      update bookings set status = 'completed', completed_at = now(), final_amount = ${finalAmount},
             commission_amount = ${commission}, pro_earning = ${finalAmount - commission}
      where id = ${id} and pro_uid = ${proUid} and status = 'in_progress' returning id`) as unknown[];
    return rows.length > 0;
  }
}

export interface EarningsSummary {
  today: { amount: number; jobs: number };
  week: { amount: number; jobs: number };
  month: { amount: number; jobs: number };
  recent: { id: string; service: string; amount: number; completedAt: string }[];
}

/** Earnings in India time: today, this week (from Monday) and this calendar month. */
export async function getProEarnings(proUid: string): Promise<EarningsSummary> {
  const sql = getSql();
  const totals = (await sql`
    with t as (select (now() at time zone 'Asia/Kolkata') as local_now)
    select
      coalesce(sum(pro_earning) filter (where completed_at >= (date_trunc('day', t.local_now) at time zone 'Asia/Kolkata')), 0) as today_amount,
      count(*) filter (where completed_at >= (date_trunc('day', t.local_now) at time zone 'Asia/Kolkata')) as today_jobs,
      coalesce(sum(pro_earning) filter (where completed_at >= (date_trunc('week', t.local_now) at time zone 'Asia/Kolkata')), 0) as week_amount,
      count(*) filter (where completed_at >= (date_trunc('week', t.local_now) at time zone 'Asia/Kolkata')) as week_jobs,
      coalesce(sum(pro_earning) filter (where completed_at >= (date_trunc('month', t.local_now) at time zone 'Asia/Kolkata')), 0) as month_amount,
      count(*) filter (where completed_at >= (date_trunc('month', t.local_now) at time zone 'Asia/Kolkata')) as month_jobs
    from bookings, t
    where pro_uid = ${proUid} and status = 'completed'`) as Record<string, unknown>[];
  const recent = (await sql`
    select id, service, pro_earning, completed_at from bookings
    where pro_uid = ${proUid} and status = 'completed'
    order by completed_at desc limit 10`) as Record<string, unknown>[];
  const t = totals[0] ?? {};
  return {
    today: { amount: Number(t.today_amount ?? 0), jobs: Number(t.today_jobs ?? 0) },
    week: { amount: Number(t.week_amount ?? 0), jobs: Number(t.week_jobs ?? 0) },
    month: { amount: Number(t.month_amount ?? 0), jobs: Number(t.month_jobs ?? 0) },
    recent: recent.map((r) => ({
      id: String(r.id),
      service: String(r.service),
      amount: Number(r.pro_earning ?? 0),
      completedAt: iso(r.completed_at)!,
    })),
  };
}

// ---------- Admin ----------

export async function listProfessionalsForAdmin(): Promise<Professional[]> {
  const sql = getSql();
  const rows = (await sql`
    select * from professionals
    order by case status when 'pending' then 0 when 'approved' then 1 else 2 end, created_at desc
    limit 200`) as Record<string, unknown>[];
  return rows.map(mapPro);
}

export async function setProfessionalStatus(uid: string, status: ProStatus): Promise<void> {
  const sql = getSql();
  await sql`
    update professionals set status = ${status},
      approved_at = case when ${status} = 'approved' then coalesce(approved_at, now()) else approved_at end,
      is_online = case when ${status} = 'approved' then is_online else false end
    where uid = ${uid}`;
}

export interface AdminBooking {
  id: string;
  service: string;
  status: JobStatus;
  customerName: string | null;
  contactName: string | null;
  contactPhone: string;
  address: string;
  preferredDate: string;
  preferredSlot: string;
  notes: string | null;
  proName: string | null;
  proTrade: Trade | null;
  finalAmount: number | null;
  commission: number | null;
  paymentMethod: PaymentMethodValue | null;
  createdAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
}

export async function listBookingsForAdmin(limit = 100): Promise<AdminBooking[]> {
  const sql = getSql();
  const rows = (await sql`
    select b.id, b.service, b.status, u.name as customer_name, b.contact_name, b.contact_phone, b.address,
           b.preferred_date::text as preferred_date, b.preferred_slot, b.notes,
           p.name as pro_name, p.trade as pro_trade, b.final_amount, b.commission_amount,
           to_jsonb(b)->>'payment_method' as payment_method, -- works before 005_payment_method.sql is run
           b.created_at, b.accepted_at, b.completed_at, b.cancelled_at
    from bookings b join users u on u.uid = b.uid left join professionals p on p.uid = b.pro_uid
    order by b.created_at desc limit ${limit}`) as Record<string, unknown>[];
  return rows.map((r) => ({
    id: String(r.id),
    service: String(r.service),
    status: r.status as JobStatus,
    customerName: (r.customer_name as string) ?? null,
    contactName: (r.contact_name as string) ?? null,
    contactPhone: String(r.contact_phone),
    address: String(r.address),
    preferredDate: String(r.preferred_date),
    preferredSlot: String(r.preferred_slot),
    notes: (r.notes as string) ?? null,
    proName: (r.pro_name as string) ?? null,
    proTrade: (r.pro_trade as Trade) ?? null,
    finalAmount: num(r.final_amount),
    commission: num(r.commission_amount),
    paymentMethod: (r.payment_method as PaymentMethodValue) ?? null,
    createdAt: iso(r.created_at)!,
    acceptedAt: iso(r.accepted_at),
    completedAt: iso(r.completed_at),
    cancelledAt: iso(r.cancelled_at),
  }));
}

export async function getPlatformTotals(): Promise<{ completedJobs: number; gross: number; commission: number }> {
  const sql = getSql();
  const rows = (await sql`
    select count(*) as jobs, coalesce(sum(final_amount), 0) as gross, coalesce(sum(commission_amount), 0) as commission
    from bookings where status = 'completed'`) as Record<string, unknown>[];
  const r = rows[0] ?? {};
  return { completedJobs: Number(r.jobs ?? 0), gross: Number(r.gross ?? 0), commission: Number(r.commission ?? 0) };
}

export interface OrderStats {
  /** Last N days in India time, oldest first. */
  daily: { date: string; booked: number; completed: number }[];
  /** Completed jobs by how the customer paid. */
  payments: { method: PaymentMethodValue | 'unknown'; jobs: number; amount: number }[];
}

export async function getOrderStats(days = 14): Promise<OrderStats> {
  const sql = getSql();
  const daily = (await sql`
    with d as (
      select generate_series(
        (now() at time zone 'Asia/Kolkata')::date - (${days}::int - 1),
        (now() at time zone 'Asia/Kolkata')::date,
        interval '1 day'
      )::date as day
    )
    select d.day::text as date,
      (select count(*) from bookings b where (b.created_at at time zone 'Asia/Kolkata')::date = d.day) as booked,
      (select count(*) from bookings b where b.status = 'completed' and (b.completed_at at time zone 'Asia/Kolkata')::date = d.day) as completed
    from d order by d.day`) as Record<string, unknown>[];
  const payments = (await sql`
    select coalesce(to_jsonb(b)->>'payment_method', 'unknown') as method, count(*) as jobs, coalesce(sum(b.final_amount), 0) as amount
    from bookings b where b.status = 'completed'
    group by 1`) as Record<string, unknown>[];
  const order = ['upi', 'cash', 'card', 'unknown'];
  return {
    daily: daily.map((r) => ({ date: String(r.date), booked: Number(r.booked), completed: Number(r.completed) })),
    payments: payments
      .map((r) => ({ method: String(r.method) as PaymentMethodValue | 'unknown', jobs: Number(r.jobs), amount: Number(r.amount) }))
      .sort((a, b) => order.indexOf(a.method) - order.indexOf(b.method)),
  };
}
