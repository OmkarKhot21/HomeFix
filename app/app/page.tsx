import Link from 'next/link';
import { ArrowRight, MapPin, ShieldCheck, BadgeIndianRupee, Clock, RotateCcw, HardHat, ChevronRight } from 'lucide-react';
import { requireUser } from '@/lib/userAuth';
import { listAddresses, listCustomerBookings, type CustomerBooking, type Address } from '@/lib/liveDb';
import { BOOKABLE_SERVICES } from '@/lib/services';
import { REPAIR_ICONS } from '@/components/RepairIcons';
import { STATUS_META, TONE_CLASSES, LIVE_STATUSES, formatDateTimeIST } from '@/lib/bookingStatus';

export const dynamic = 'force-dynamic';

function greeting(): string {
  const hour = Number(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }));
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function CustomerHome() {
  const user = await requireUser('/app');
  let addresses: Address[] = [];
  let bookings: CustomerBooking[] = [];
  try {
    [addresses, bookings] = await Promise.all([listAddresses(user.uid), listCustomerBookings(user.uid, 5)]);
  } catch (err) {
    console.error('[APP HOME] could not load data:', err);
  }

  const active = bookings.find((b) => LIVE_STATUSES.includes(b.status));
  const recent = bookings.filter((b) => b !== active).slice(0, 3);
  const firstName = user.name?.split(' ')[0];
  const home = addresses[0];

  return (
    <div className="space-y-8">
      {/* Greeting + location */}
      <section>
        <Link
          href="/app/profile#addresses"
          className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 ring-1 ring-neutral-200 hover:ring-neutral-400"
        >
          <MapPin size={14} className="shrink-0 text-neutral-900" />
          <span className="truncate">{home ? `${home.label} · ${home.line2 || home.line1}` : 'Add your address'}</span>
          <ChevronRight size={14} className="shrink-0" />
        </Link>
        <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          {greeting()}
          {firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-1 text-neutral-600">What can we fix for you today?</p>
      </section>

      {/* Live booking */}
      {active && (
        <Link
          href={`/app/bookings/${active.id}`}
          className="group flex items-center gap-4 overflow-hidden rounded-3xl bg-ink p-5 text-white shadow-xl ring-1 ring-black/5"
        >
          <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-ink">
            <span className="absolute inset-0 animate-ping rounded-2xl bg-brand opacity-40" />
            <Clock size={22} className="relative" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-widest text-brand">Live · {active.service}</span>
            <span className="mt-0.5 block font-display text-lg font-bold">{STATUS_META[active.status].label}</span>
            <span className="block truncate text-sm text-white/60">{active.address}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-xs font-bold transition group-hover:bg-white/20">
            Track <ArrowRight size={14} />
          </span>
        </Link>
      )}

      {/* Services */}
      <section aria-labelledby="services-heading">
        <div className="flex items-end justify-between">
          <h2 id="services-heading" className="font-display text-xl font-extrabold text-neutral-900">Book a service</h2>
          <span className="text-xs font-semibold text-neutral-500">Verified pros · 15 min dispatch</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {BOOKABLE_SERVICES.map((s) => {
            const Animated = REPAIR_ICONS[s.name];
            return (
              <Link
                key={s.slug}
                href={`/app/book?service=${s.slug}`}
                className="group flex flex-col items-center rounded-2xl bg-white p-3 text-center ring-1 ring-neutral-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-neutral-300 sm:p-4"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-brand transition group-hover:scale-105">
                  {Animated ? <Animated /> : null}
                </span>
                <span className="mt-2.5 text-xs font-bold leading-tight text-neutral-900 sm:text-sm">{s.name}</span>
                <span className="mt-0.5 text-[11px] text-neutral-500">from ₹{s.price}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Promise strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: ShieldCheck, title: 'Police verified', text: 'Every pro is ID checked' },
          { icon: BadgeIndianRupee, title: 'Fixed prices', text: 'No hidden fees, no bargaining' },
          { icon: Clock, title: 'Live tracking', text: 'See your pro arrive' },
          { icon: RotateCcw, title: '7-day warranty', text: 'Free re-visit if needed' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-neutral-200">
            <Icon size={20} className="mt-0.5 shrink-0 text-neutral-900" />
            <span>
              <span className="block text-sm font-bold text-neutral-900">{title}</span>
              <span className="block text-xs text-neutral-500">{text}</span>
            </span>
          </div>
        ))}
      </section>

      {/* Recent bookings */}
      <section aria-labelledby="recent-heading">
        <div className="flex items-end justify-between">
          <h2 id="recent-heading" className="font-display text-xl font-extrabold text-neutral-900">Recent bookings</h2>
          {bookings.length > 0 && (
            <Link href="/app/bookings" className="text-sm font-bold text-neutral-900 hover:underline">View all</Link>
          )}
        </div>
        {recent.length === 0 && !active ? (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-8 text-center">
            <p className="font-semibold text-neutral-900">No bookings yet</p>
            <p className="mt-1 text-sm text-neutral-500">Pick a service above and a verified pro will be on the way.</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200">
            {recent.map((b) => {
              const meta = STATUS_META[b.status];
              return (
                <li key={b.id}>
                  <Link href={`/app/bookings/${b.id}`} className="flex items-center gap-4 px-4 py-4 hover:bg-neutral-50">
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-neutral-900">{b.service}</span>
                      <span className="block text-xs text-neutral-500">{formatDateTimeIST(b.createdAt)}{b.finalAmount !== null ? ` · ₹${b.finalAmount}` : ''}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${TONE_CLASSES[meta.tone]}`}>{meta.label}</span>
                    <ChevronRight size={16} className="shrink-0 text-neutral-400" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Partner invite */}
      <Link href="/pro" className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-neutral-200 hover:ring-neutral-400">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-neutral-900">
          <HardHat size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-neutral-900">Are you a plumber, electrician or carpenter?</span>
          <span className="block text-sm text-neutral-500">Earn with HomeFix — go online when you want and get jobs near you.</span>
        </span>
        <ArrowRight size={18} className="shrink-0 text-neutral-400" />
      </Link>
    </div>
  );
}
