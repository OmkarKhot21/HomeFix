import Link from 'next/link';
import { ChevronRight, ClipboardList } from 'lucide-react';
import { requireUser } from '@/lib/userAuth';
import { listCustomerBookings, type CustomerBooking } from '@/lib/liveDb';
import { STATUS_META, TONE_CLASSES, LIVE_STATUSES, formatDateTimeIST } from '@/lib/bookingStatus';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const user = await requireUser('/app/bookings');
  let bookings: CustomerBooking[] = [];
  try {
    bookings = await listCustomerBookings(user.uid, 50);
  } catch (err) {
    console.error('[BOOKINGS] could not load:', err);
  }
  const live = bookings.filter((b) => LIVE_STATUSES.includes(b.status));
  const past = bookings.filter((b) => !LIVE_STATUSES.includes(b.status));

  const Row = ({ b }: { b: CustomerBooking }) => {
    const meta = STATUS_META[b.status];
    return (
      <li>
        <Link href={`/app/bookings/${b.id}`} className="flex items-center gap-4 px-4 py-4 hover:bg-neutral-50 sm:px-5">
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-neutral-900">{b.service}</span>
            <span className="block truncate text-xs text-neutral-500">
              {formatDateTimeIST(b.createdAt)} · {b.address}
            </span>
            {b.pro && <span className="mt-0.5 block text-xs text-neutral-600">by {b.pro.name}</span>}
          </span>
          <span className="flex shrink-0 flex-col items-end gap-1">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${TONE_CLASSES[meta.tone]}`}>{meta.label}</span>
            {b.finalAmount !== null && <span className="text-sm font-bold text-neutral-900">₹{b.finalAmount}</span>}
          </span>
          <ChevronRight size={16} className="shrink-0 text-neutral-400" />
        </Link>
      </li>
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-extrabold text-neutral-900 sm:text-3xl">Your bookings</h1>

      {bookings.length === 0 && (
        <div className="rounded-3xl border-2 border-dashed border-neutral-200 bg-white p-10 text-center">
          <ClipboardList className="mx-auto text-neutral-400" />
          <p className="mt-3 font-semibold text-neutral-900">No bookings yet</p>
          <p className="mt-1 text-sm text-neutral-500">Your live and past bookings will show up here.</p>
          <Link href="/app" className="mt-5 inline-block rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white hover:bg-black">
            Book a service
          </Link>
        </div>
      )}

      {live.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500">Live</h2>
          <ul className="divide-y divide-neutral-100 overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200">
            {live.map((b) => <Row key={b.id} b={b} />)}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-500">Past orders</h2>
          <ul className="divide-y divide-neutral-100 overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200">
            {past.map((b) => <Row key={b.id} b={b} />)}
          </ul>
        </section>
      )}
    </div>
  );
}
