'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Phone, Check, X, Loader2, ShieldCheck, Star, MapPin, ArrowLeft, RefreshCw } from 'lucide-react';
import AppMap, { type MapMarker } from '@/components/map/Map';
import { cancelBooking } from '@/app/actions/customerActions';
import { STATUS_META, formatDateTimeIST } from '@/lib/bookingStatus';
import { formatKm } from '@/lib/geo';
import type { CustomerBooking, JobStatus } from '@/lib/liveDb';

type TrackingBooking = Omit<CustomerBooking, 'pro'> & {
  pro: null | { name: string; phone: string; trade: string; experienceYears: number };
};

interface TrackingData {
  booking: TrackingBooking;
  proLocation: { lat: number; lng: number; updatedAt: string | null } | null;
  eta: { minutes: number; km: number } | null;
}

const STEPS: { key: JobStatus; label: string }[] = [
  { key: 'searching', label: 'Booking placed' },
  { key: 'accepted', label: 'Pro on the way' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'in_progress', label: 'Work in progress' },
  { key: 'completed', label: 'Completed' },
];
const ORDER: Record<string, number> = { new: 0, searching: 0, accepted: 1, arrived: 2, in_progress: 3, completed: 4 };
const POLL_MS = 4000;

const TRADE_LABEL: Record<string, string> = { plumber: 'Plumber', electrician: 'Electrician', carpenter: 'Carpenter' };

export default function LiveTracking({ initial }: { initial: TrackingData }) {
  const [data, setData] = useState<TrackingData>(initial);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [stale, setStale] = useState(false);
  const failures = useRef(0);

  const b = data.booking;
  const isLive = ['searching', 'accepted', 'arrived', 'in_progress'].includes(b.status);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/${b.id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setData(await res.json());
      failures.current = 0;
      setStale(false);
    } catch {
      failures.current += 1;
      if (failures.current >= 3) setStale(true);
    }
  }, [b.id]);

  useEffect(() => {
    if (!isLive) return;
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, POLL_MS);
    const onVisible = () => document.visibilityState === 'visible' && refresh();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [isLive, refresh]);

  async function handleCancel() {
    if (!window.confirm('Cancel this booking?')) return;
    setCancelling(true);
    setError('');
    const res = await cancelBooking(b.id);
    setCancelling(false);
    if (res.ok) refresh();
    else setError(res.error);
  }

  const home = b.lat !== null && b.lng !== null ? { lat: b.lat, lng: b.lng } : null;
  const markers: MapMarker[] = [];
  if (home) markers.push({ id: 'home', kind: 'home', ...home });
  if (data.proLocation) markers.push({ id: 'pro', kind: 'pro', lat: data.proLocation.lat, lng: data.proLocation.lng });

  const step = ORDER[b.status] ?? -1;
  const headline =
    b.status === 'searching'
      ? 'Finding a professional near you'
      : b.status === 'accepted'
        ? data.eta
          ? `Arriving in ${data.eta.minutes} min`
          : 'Professional is on the way'
        : STATUS_META[b.status].label;

  return (
    <div className="mx-auto max-w-2xl pb-6">
      <Link href="/app/bookings" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900">
        <ArrowLeft size={16} /> All bookings
      </Link>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200">
        {/* Map */}
        {home && isLive && b.status !== 'in_progress' && (
          <div className="relative">
            <AppMap
              center={home}
              zoom={15}
              markers={markers}
              radar={b.status === 'searching' ? home : null}
              line={data.proLocation ? [data.proLocation, home] : null}
              fitToMarkers={Boolean(data.proLocation)}
              interactive
              className="h-72 w-full sm:h-80"
            />
            {stale && (
              <span className="absolute left-3 top-3 z-[500] inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-ink">
                <RefreshCw size={12} /> Reconnecting…
              </span>
            )}
          </div>
        )}

        {/* Headline */}
        <div className="border-b border-neutral-100 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">{b.service} · #{b.id}</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">{headline}</h1>
          {b.status === 'accepted' && data.eta && (
            <p className="mt-1 text-sm text-neutral-600">{formatKm(data.eta.km)} away · estimated from live location</p>
          )}
          {b.status === 'searching' && (
            <p className="mt-1 text-sm text-neutral-600">
              {b.preferredSlot === 'As soon as possible'
                ? 'We’re alerting verified professionals nearby. This usually takes a minute or two.'
                : `Scheduled for ${b.preferredDate}, ${b.preferredSlot}. We’ll confirm a professional shortly.`}
            </p>
          )}
          {b.status === 'expired' && (
            <p className="mt-1 text-sm text-neutral-600">All our nearby professionals are busy right now. Please try booking again in a few minutes, or request a callback and our team will arrange a visit.</p>
          )}
          {b.status === 'completed' && b.finalAmount !== null && (
            <p className="mt-1 text-sm text-neutral-600">
              Paid ₹{b.finalAmount}
              {b.paymentMethod ? ` by ${b.paymentMethod === 'upi' ? 'UPI' : b.paymentMethod === 'cash' ? 'cash' : 'card'}` : ''} · Covered by
              our 7-day warranty
            </p>
          )}
        </div>

        {/* Professional card */}
        {b.pro && (
          <div className="flex items-center gap-4 border-b border-neutral-100 p-5 sm:p-6">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-xl font-extrabold text-brand">
              {b.pro.name.trim()[0]?.toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-neutral-900">{b.pro.name}</p>
              <p className="text-sm text-neutral-500">
                {TRADE_LABEL[b.pro.trade] ?? b.pro.trade} · {b.pro.experienceYears} yrs experience
              </p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-neutral-900">
                <ShieldCheck size={13} /> ID & police verified
              </p>
            </div>
            {isLive && (
              <a
                href={`tel:+91${b.pro.phone}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-extrabold text-ink transition hover:brightness-95"
              >
                <Phone size={16} /> Call
              </a>
            )}
          </div>
        )}

        {/* Timeline */}
        {b.status !== 'cancelled' && b.status !== 'expired' && (
          <ol className="space-y-0 p-5 sm:p-6">
            {STEPS.map((s, i) => {
              const done = step > i || b.status === 'completed';
              const current = step === i && b.status !== 'completed';
              const time =
                s.key === 'searching' ? b.createdAt : s.key === 'accepted' ? b.acceptedAt : s.key === 'arrived' ? b.arrivedAt : s.key === 'in_progress' ? b.startedAt : b.completedAt;
              return (
                <li key={s.key} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span className={`absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 ${done ? 'bg-neutral-900' : 'bg-neutral-200'}`} aria-hidden="true" />
                  )}
                  <span
                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      done ? 'bg-neutral-900 text-white' : current ? 'bg-brand ring-4 ring-brand/30' : 'bg-neutral-200'
                    }`}
                  >
                    {done ? <Check size={13} strokeWidth={3} /> : current ? <span className="h-2 w-2 rounded-full bg-neutral-900" /> : null}
                  </span>
                  <span className="flex flex-1 items-baseline justify-between gap-3">
                    <span className={`text-sm font-semibold ${done || current ? 'text-neutral-900' : 'text-neutral-400'}`}>{s.label}</span>
                    {time && (done || current) && <span className="text-xs text-neutral-500">{formatDateTimeIST(time)}</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {/* Address */}
        <div className="flex items-start gap-3 border-t border-neutral-100 p-5 text-sm sm:px-6">
          <MapPin size={17} className="mt-0.5 shrink-0 text-neutral-500" />
          <span className="text-neutral-700">{b.address}</span>
        </div>
        {b.notes && <p className="border-t border-neutral-100 px-5 py-4 text-sm text-neutral-600 sm:px-6">“{b.notes}”</p>}
      </div>

      {error && <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-3">
        {(b.status === 'searching' || b.status === 'accepted') && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={cancelling}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 hover:border-red-300 hover:text-red-700 disabled:opacity-60"
          >
            {cancelling ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />} Cancel booking
          </button>
        )}
        {(b.status === 'expired' || b.status === 'cancelled' || b.status === 'completed') && (
          <Link href="/app" className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white hover:bg-black">
            Book again
          </Link>
        )}
        {b.status === 'completed' && (
          <span className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-neutral-600 ring-1 ring-neutral-200">
            <Star size={15} className="text-brand-600" /> Thanks for choosing HomeFix
          </span>
        )}
      </div>
    </div>
  );
}
