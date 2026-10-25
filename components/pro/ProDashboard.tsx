'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Navigation,
  Phone,
  Loader2,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Wallet,
  LocateFixed,
  LocateOff,
  Radio,
  CalendarClock,
  IndianRupee,
} from 'lucide-react';
import AppMap, { type MapMarker } from '@/components/map/Map';
import { setOnline, reportLocation, acceptJob, declineJob, releaseJob, advanceJob } from '@/app/actions/proActions';
import { distanceKm, etaMinutes, formatKm, googleMapsDirectionsUrl, type LatLng } from '@/lib/geo';
import type { ActiveJob, JobRequest, EarningsSummary } from '@/lib/liveDb';

export interface ProFeed {
  pro: { status: string; isOnline: boolean; hasLocation?: boolean; lat?: number | null; lng?: number | null };
  activeJob: ActiveJob | null;
  requests: JobRequest[];
  earnings: EarningsSummary;
}

type LocState = 'off' | 'locating' | 'on' | 'denied' | 'unsupported';
type Period = 'today' | 'week' | 'month';

const SEND_EVERY_MS = 8000;

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.18].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.16);
    });
    navigator.vibrate?.([200, 100, 200]);
  } catch {
    /* sound is a nice-to-have */
  }
}

function whenLabel(date: string, slot: string): string {
  if (slot === 'As soon as possible') return 'Now · ASAP';
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  return `${date === today ? 'Today' : date} · ${slot}`;
}

export default function ProDashboard({
  name,
  trade,
  commission,
  initial,
}: {
  name: string;
  trade: string;
  commission: number;
  initial: ProFeed;
}) {
  const [feed, setFeed] = useState<ProFeed>(initial);
  const [online, setOnlineState] = useState(initial.pro.isOnline);
  const [toggling, setToggling] = useState(false);
  const [loc, setLoc] = useState<LocState>('locating');
  const [me, setMe] = useState<LatLng | null>(
    initial.pro.lat != null && initial.pro.lng != null ? { lat: initial.pro.lat, lng: initial.pro.lng } : null
  );
  const [period, setPeriod] = useState<Period>('today');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'upi' | 'card' | null>(null);
  const [error, setError] = useState('');
  const lastSent = useRef(0);
  const seenRequests = useRef(new Set(initial.requests.map((r) => r.id)));

  const job = feed.activeJob;
  const needsLocation = online || Boolean(job);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/pro/feed', { cache: 'no-store' });
      if (!res.ok) return;
      const next = (await res.json()) as ProFeed;
      if (!next.earnings) return;
      // Alert on new requests
      const fresh = next.requests.filter((r) => !seenRequests.current.has(r.id));
      if (fresh.length > 0) beep();
      next.requests.forEach((r) => seenRequests.current.add(r.id));
      setFeed(next);
      setOnlineState(next.pro.isOnline);
    } catch {
      /* try again on next tick */
    }
  }, []);

  // Poll: fast while working, slow while offline.
  useEffect(() => {
    const ms = needsLocation ? 5000 : 30000;
    const id = setInterval(() => document.visibilityState === 'visible' && refresh(), ms);
    return () => clearInterval(id);
  }, [needsLocation, refresh]);

  // Share live location while online or on a job.
  useEffect(() => {
    if (!needsLocation) return;
    if (!('geolocation' in navigator)) {
      const t = setTimeout(() => setLoc('unsupported'), 0);
      return () => clearTimeout(t);
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMe(p);
        setLoc('on');
        const now = Date.now();
        if (now - lastSent.current >= SEND_EVERY_MS) {
          lastSent.current = now;
          reportLocation(p.lat, p.lng).then(() => {
            // First fix after going online: fetch requests right away.
            if (!feed.pro.hasLocation) refresh();
          });
        }
      },
      (err) => setLoc(err.code === err.PERMISSION_DENIED ? 'denied' : 'locating'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsLocation]);

  async function toggleOnline() {
    setError('');
    setToggling(true);
    const next = !online;
    if (next) setLoc('locating');
    const res = await setOnline(next);
    setToggling(false);
    if (res.ok) {
      setOnlineState(next);
      refresh();
    } else setError(res.error);
  }

  async function run(id: string, fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError('');
    setBusyId(id);
    const res = await fn();
    setBusyId(null);
    if (!res.ok && 'error' in res && res.error) setError(res.error);
    await refresh();
  }

  const e = feed.earnings[period];
  const locView: LocState = needsLocation ? loc : 'off';

  return (
    <div className="space-y-5">
      {/* Status + toggle */}
      <section className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white/60">Hi {name.split(' ')[0]} · <span className="capitalize">{trade}</span></p>
            <p className="mt-0.5 font-display text-2xl font-extrabold">
              {job ? 'On a job' : online ? 'You’re online' : 'You’re offline'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={online}
            aria-label={online ? 'Go offline' : 'Go online'}
            onClick={toggleOnline}
            disabled={toggling || Boolean(job)}
            className={`relative h-12 w-24 shrink-0 rounded-full transition-colors disabled:opacity-60 ${online ? 'bg-brand' : 'bg-white/15'}`}
          >
            <span
              className={`absolute top-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition-all ${online ? 'left-[3.25rem]' : 'left-1.5'}`}
            >
              {toggling ? <Loader2 size={16} className="animate-spin text-neutral-900" /> : <Radio size={16} className={online ? 'text-neutral-900' : 'text-neutral-400'} />}
            </span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
          {locView === 'on' && <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 px-3 py-1.5 text-brand"><LocateFixed size={13} /> Sharing live location</span>}
          {locView === 'locating' && <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-white/70"><Loader2 size={13} className="animate-spin" /> Getting your location…</span>}
          {locView === 'denied' && <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-red-200"><LocateOff size={13} /> Location blocked — allow location in your browser to get jobs</span>}
          {locView === 'unsupported' && <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-red-200"><LocateOff size={13} /> This browser can’t share location</span>}
          {locView === 'off' && <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-white/60">Go online to start receiving jobs</span>}
        </div>
      </section>

      {error && <p role="alert" className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200">{error}</p>}

      {/* Active job */}
      {job && (
        <section className="overflow-hidden rounded-3xl bg-white text-neutral-900 shadow-2xl">
          <AppMap
            center={{ lat: job.lat, lng: job.lng }}
            markers={[
              { id: 'home', kind: 'home', lat: job.lat, lng: job.lng },
              ...(me ? ([{ id: 'me', kind: 'pro', ...me }] as MapMarker[]) : []),
            ]}
            line={me && job.status === 'accepted' ? [me, { lat: job.lat, lng: job.lng }] : null}
            fitToMarkers
            className="h-56 w-full"
          />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Job #{job.id} · {job.service}</p>
                <p className="mt-1 font-display text-xl font-extrabold">{job.contactName || job.customerName || 'Customer'}</p>
                {job.contactName && job.customerName && (
                  <p className="text-xs font-semibold text-neutral-500">Booked by {job.customerName} · call {job.contactName.split(' ')[0]} on arrival</p>
                )}
              </div>
              {me && job.status === 'accepted' && (
                <span className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-xs font-extrabold text-ink">
                  {etaMinutes(me, job)} min · {formatKm(distanceKm(me, job))}
                </span>
              )}
            </div>
            <p className="mt-3 flex items-start gap-2 text-sm text-neutral-700">
              <MapPin size={16} className="mt-0.5 shrink-0" /> {job.address}
            </p>
            {job.notes && <p className="mt-2 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-600">“{job.notes}”</p>}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={googleMapsDirectionsUrl({ lat: job.lat, lng: job.lng })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3.5 text-sm font-bold text-white hover:bg-black"
              >
                <Navigation size={16} /> Navigate
              </a>
              <a href={`tel:+91${job.contactPhone}`} className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 py-3.5 text-sm font-bold hover:border-neutral-900">
                <Phone size={16} /> Call {job.contactName ? job.contactName.split(' ')[0] : 'customer'}
              </a>
            </div>

            <div className="mt-3">
              {job.status === 'accepted' && (
                <button
                  type="button"
                  onClick={() => run(job.id, () => advanceJob(job.id, 'arrived'))}
                  disabled={busyId === job.id}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-sm font-extrabold text-ink disabled:opacity-60"
                >
                  {busyId === job.id && <Loader2 size={16} className="animate-spin" />} I’ve arrived
                </button>
              )}
              {job.status === 'arrived' && (
                <button
                  type="button"
                  onClick={() => run(job.id, () => advanceJob(job.id, 'started'))}
                  disabled={busyId === job.id}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-sm font-extrabold text-ink disabled:opacity-60"
                >
                  {busyId === job.id && <Loader2 size={16} className="animate-spin" />} Start job
                </button>
              )}
              {job.status === 'in_progress' && (
                <form
                  onSubmit={(ev) => {
                    ev.preventDefault();
                    if (!payMethod) {
                      setError('Choose how the customer paid: cash, UPI or card.');
                      return;
                    }
                    run(job.id, () => advanceJob(job.id, 'completed', amount || String(job.priceEstimate ?? 0), payMethod));
                  }}
                  className="space-y-2"
                >
                  <label htmlFor="final-amount" className="text-sm font-semibold">Amount collected from customer</label>
                  <div className="flex items-center rounded-2xl border-2 border-neutral-200 px-3 focus-within:border-neutral-900">
                    <IndianRupee size={16} className="text-neutral-500" />
                    <input
                      id="final-amount"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={amount}
                      onChange={(ev) => setAmount(ev.target.value)}
                      placeholder={String(job.priceEstimate ?? '')}
                      className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                    />
                  </div>
                  <fieldset className="pt-1">
                    <legend className="text-sm font-semibold">How did the customer pay?</legend>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {([
                        ['cash', 'Cash'],
                        ['upi', 'UPI'],
                        ['card', 'Card'],
                      ] as const).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={payMethod === value}
                          onClick={() => {
                            setPayMethod(value);
                            setError('');
                          }}
                          className={`rounded-2xl border-2 py-3 text-sm font-bold transition ${
                            payMethod === value ? 'border-ink bg-ink text-white' : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <button
                    type="submit"
                    disabled={busyId === job.id}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-sm font-extrabold text-ink disabled:opacity-60"
                  >
                    {busyId === job.id && <Loader2 size={16} className="animate-spin" />} Complete job
                  </button>
                </form>
              )}
              {job.status === 'accepted' && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Cancel this job? It will go to another professional.')) run(job.id, () => releaseJob(job.id));
                  }}
                  className="mt-2 w-full py-2 text-sm font-semibold text-neutral-500 hover:text-red-600"
                >
                  I can’t make it
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Live requests */}
      {!job && online && (
        <section aria-labelledby="requests-heading">
          <h2 id="requests-heading" className="mb-3 flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
            </span>
            Live requests
          </h2>
          {feed.requests.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-white/10 p-8 text-center">
              <p className="font-semibold">Waiting for jobs near you…</p>
              <p className="mt-1 text-sm text-white/50">Keep this page open. You’ll hear a sound when a new request arrives.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {feed.requests.map((r) => (
                <li key={r.id} className="rounded-3xl bg-white p-5 text-neutral-900 shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-extrabold">{r.service}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-neutral-600"><MapPin size={14} /> {r.area}</p>
                    </div>
                    {r.priceEstimate !== null && (
                      <span className="shrink-0 rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-bold text-white">
                        From ₹{r.priceEstimate}
                        {r.nightCharge > 0 && <span className="ml-1 text-brand">· Night</span>}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1"><Navigation size={12} /> {formatKm(r.distanceKm)} away</span>
                    {me && <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1"><Clock size={12} /> ~{etaMinutes(me, r)} min</span>}
                    <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1"><CalendarClock size={12} /> {whenLabel(r.preferredDate, r.preferredSlot)}</span>
                  </div>
                  {r.notes && <p className="mt-3 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-600">“{r.notes}”</p>}
                  <div className="mt-4 grid grid-cols-[1fr_2fr] gap-2">
                    <button
                      type="button"
                      onClick={() => run(r.id, () => declineJob(r.id))}
                      disabled={busyId === r.id}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-neutral-200 py-3 text-sm font-bold text-neutral-600 hover:border-neutral-400 disabled:opacity-60"
                    >
                      <XCircle size={16} /> Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => run(r.id, () => acceptJob(r.id))}
                      disabled={busyId === r.id}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-brand py-3 text-sm font-extrabold text-ink hover:brightness-95 disabled:opacity-60"
                    >
                      {busyId === r.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Accept job
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Earnings */}
      <section aria-labelledby="earnings-heading" className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10">
        <div className="flex items-center justify-between gap-3">
          <h2 id="earnings-heading" className="flex items-center gap-2 font-display text-lg font-extrabold">
            <Wallet size={18} className="text-brand" /> Earnings
          </h2>
          <div role="tablist" aria-label="Earnings period" className="flex rounded-full bg-white/10 p-1 text-xs font-bold">
            {(['today', 'week', 'month'] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={period === p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1.5 transition ${period === p ? 'bg-brand text-ink' : 'text-white/70 hover:text-white'}`}
              >
                {p === 'today' ? 'Today' : p === 'week' ? 'This week' : 'This month'}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-4 font-display text-4xl font-extrabold tracking-tight">₹{e.amount.toLocaleString('en-IN')}</p>
        <p className="mt-1 text-sm text-white/50">
          {e.jobs} {e.jobs === 1 ? 'job' : 'jobs'} completed · your share after {commission}% HomeFix commission
        </p>

        {feed.earnings.recent.length > 0 && (
          <ul className="mt-5 divide-y divide-white/10">
            {feed.earnings.recent.slice(0, 5).map((j) => (
              <li key={j.id} className="flex items-center justify-between py-3 text-sm">
                <span>
                  <span className="block font-semibold">{j.service}</span>
                  <span className="text-xs text-white/40">
                    {new Date(j.completedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                  </span>
                </span>
                <span className="font-bold text-brand">+₹{j.amount.toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
