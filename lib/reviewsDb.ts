import { getSql } from './db';

// Customer reviews: one per completed booking. Shown on the home page under first name + last initial.

export interface PublicReview {
  id: string;
  name: string;
  service: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface ReviewSummary {
  /** Reviews with a written comment, newest first (what the home page shows). */
  reviews: PublicReview[];
  /** Average of all visible ratings, including ones without a comment. */
  average: number;
  count: number;
}

export interface BookingReview {
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface AdminReview extends PublicReview {
  bookingId: string;
  hidden: boolean;
  proName: string | null;
}

const iso = (v: unknown) => new Date(v as string).toISOString();

/** "Mayank Kumar" → "Mayank K."; one word stays as is. Keeps customers' full names private. */
export function displayName(full: string | null | undefined): string {
  const parts = (full ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'HomeFix customer';
  const first = parts[0][0].toUpperCase() + parts[0].slice(1);
  return parts.length === 1 ? first : `${first} ${parts[parts.length - 1][0].toUpperCase()}.`;
}

export type CreateReviewResult = 'ok' | 'not_allowed' | 'already_reviewed';

/** Saves a review if the booking belongs to this customer and is completed. */
export async function createReview(uid: string, bookingId: string, rating: number, comment: string | null): Promise<CreateReviewResult> {
  const sql = getSql();
  const rows = (await sql`
    select b.service, b.pro_uid, u.name
    from bookings b join users u on u.uid = b.uid
    where b.id = ${bookingId} and b.uid = ${uid} and b.status = 'completed'`) as Record<string, unknown>[];
  const b = rows[0];
  if (!b) return 'not_allowed';
  const inserted = (await sql`
    insert into reviews (booking_id, uid, pro_uid, service, rating, comment, display_name)
    values (${bookingId}, ${uid}, ${(b.pro_uid as string) ?? null}, ${String(b.service)}, ${rating}, ${comment}, ${displayName(b.name as string)})
    on conflict (booking_id) do nothing
    returning id`) as unknown[];
  return inserted.length > 0 ? 'ok' : 'already_reviewed';
}

export async function getReviewForBooking(uid: string, bookingId: string): Promise<BookingReview | null> {
  const sql = getSql();
  const rows = (await sql`
    select rating, comment, created_at from reviews where booking_id = ${bookingId} and uid = ${uid}`) as Record<string, unknown>[];
  const r = rows[0];
  return r ? { rating: Number(r.rating), comment: (r.comment as string) ?? null, createdAt: iso(r.created_at) } : null;
}

export async function getPublicReviews(limit = 30): Promise<ReviewSummary> {
  const sql = getSql();
  const [stats, rows] = await Promise.all([
    sql`select count(*) as n, coalesce(avg(rating), 0) as avg from reviews where not is_hidden` as Promise<Record<string, unknown>[]>,
    sql`
      select id, display_name, service, rating, comment, created_at from reviews
      where not is_hidden and comment is not null and char_length(comment) >= 3
      order by created_at desc limit ${limit}` as Promise<Record<string, unknown>[]>,
  ]);
  return {
    count: Number(stats[0]?.n ?? 0),
    average: Number(stats[0]?.avg ?? 0),
    reviews: rows.map((r) => ({
      id: String(r.id),
      name: String(r.display_name),
      service: String(r.service),
      rating: Number(r.rating),
      text: String(r.comment),
      createdAt: iso(r.created_at),
    })),
  };
}

export async function listReviewsForAdmin(limit = 100): Promise<AdminReview[]> {
  const sql = getSql();
  const rows = (await sql`
    select r.id, r.booking_id, r.display_name, r.service, r.rating, r.comment, r.is_hidden, r.created_at, p.name as pro_name
    from reviews r left join professionals p on p.uid = r.pro_uid
    order by r.created_at desc limit ${limit}`) as Record<string, unknown>[];
  return rows.map((r) => ({
    id: String(r.id),
    bookingId: String(r.booking_id),
    name: String(r.display_name),
    service: String(r.service),
    rating: Number(r.rating),
    text: (r.comment as string) ?? '',
    hidden: Boolean(r.is_hidden),
    proName: (r.pro_name as string) ?? null,
    createdAt: iso(r.created_at),
  }));
}

export async function setReviewHidden(id: string, hidden: boolean): Promise<void> {
  const sql = getSql();
  await sql`update reviews set is_hidden = ${hidden} where id = ${id}`;
}
