'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { X, LocateFixed, Loader2, Home, Briefcase, MapPin, Navigation } from 'lucide-react';
import AppMap from '@/components/map/Map';
import { DEFAULT_CENTER, type LatLng } from '@/lib/geo';
import { saveAddress } from '@/app/actions/customerActions';
import type { Address } from '@/lib/liveDb';

const LABELS = [
  { value: 'Home', icon: Home },
  { value: 'Work', icon: Briefcase },
  { value: 'Other', icon: MapPin },
] as const;

const inputClass =
  'mt-1.5 w-full rounded-xl border-2 border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900';

type Step = 'checking' | 'ask' | 'map';

/**
 * Add an address, food-delivery style:
 * 1. ask for location (skipped if already allowed), 2. detect it and fill the nearby address,
 * 3. the customer slides the map under a fixed centre pin to their exact door, 4. adds flat details.
 */
export default function AddressPicker({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (address: Address) => void;
}) {
  const [step, setStep] = useState<Step>('checking');
  const [point, setPoint] = useState<LatLng>(DEFAULT_CENTER);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [area, setArea] = useState(''); // short detected place name shown under the map
  const [locating, setLocating] = useState(false);
  const [moving, setMoving] = useState(false);
  const [adjusted, setAdjusted] = useState(false); // customer moved the pin themselves
  const [located, setLocated] = useState(false); // we got a GPS fix
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const watchRef = useRef<number | null>(null);
  const line2Touched = useRef(false);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nearby address from the pin, using OpenStreetMap's free geocoder (best effort).
  const reverseGeocode = useCallback((p: LatLng) => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&accept-language=en&lat=${p.lat}&lon=${p.lng}`
        );
        if (!res.ok) return;
        const data = (await res.json()) as { address?: Record<string, string> };
        const a = data.address ?? {};
        const locality = a.neighbourhood || a.suburb || a.quarter;
        const city = a.city || a.town || a.village;
        const parts = [a.road, locality, city, a.postcode].filter(Boolean);
        setArea([a.building || a.amenity || a.road || locality, city].filter(Boolean).join(', '));
        if (parts.length && !line2Touched.current) setLine2(parts.join(', '));
      } catch {
        /* ignore: the customer can type the area themselves */
      }
    }, 500);
  }, []);

  const stopWatching = useCallback(() => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    setLocating(false);
  }, []);

  // GPS often starts rough (Wi-Fi / cell towers) and sharpens over a few seconds.
  // Keep listening for up to 8 s and keep the most accurate fix; stop early once within 20 m.
  const locate = useCallback(() => {
    setStep('map');
    setError('');
    if (!navigator.geolocation) {
      setError('This browser can’t share your location. Move the map so the pin is on your home.');
      return;
    }
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    setLocating(true);
    let best = Infinity;
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const acc = pos.coords.accuracy;
        if (acc < best) {
          best = acc;
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPoint(p);
          setAccuracy(Math.round(acc));
          setLocated(true);
          setAdjusted(false);
          reverseGeocode(p);
        }
        if (acc <= 20) stopWatching();
      },
      (err) => {
        stopWatching();
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location is blocked. Move the map so the pin is on your home, or allow location in your browser settings.'
            : 'Couldn’t find your location. Move the map so the pin is on your home.'
        );
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
    setTimeout(() => watchRef.current !== null && stopWatching(), 8000);
  }, [reverseGeocode, stopWatching]);

  useEffect(() => {
    // If location is already allowed, skip the ask screen and detect straight away.
    let cancelled = false;
    const perms = navigator.permissions?.query({ name: 'geolocation' as PermissionName });
    if (perms) {
      perms
        .then((s) => {
          if (cancelled) return;
          if (s.state === 'granted') locate();
          else setStep('ask');
        })
        .catch(() => !cancelled && setStep('ask'));
    } else {
      Promise.resolve().then(() => !cancelled && setStep('ask'));
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      cancelled = true;
      window.removeEventListener('keydown', onKey);
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
      if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The customer slid the map: the centre is their chosen spot.
  const onCenterChange = useCallback(
    (p: LatLng, byUser: boolean) => {
      setMoving(false);
      if (!byUser) return;
      stopWatching();
      setPoint(p);
      setAccuracy(null);
      setAdjusted(true);
      reverseGeocode(p);
    },
    [reverseGeocode, stopWatching]
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!located && !adjusted) {
      setError('Move the map so the pin is on your home first.');
      return;
    }
    setSaving(true);
    const res = await saveAddress({ label, line1, line2, lat: point.lat, lng: point.lng });
    setSaving(false);
    if (res.ok) onSaved(res.address);
    else setError(res.error);
  }

  const bubble = locating
    ? 'Finding your location…'
    : adjusted
      ? 'Your professional will come here'
      : 'Move the map to adjust the pin';

  return (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-picker-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-center justify-between px-5 py-4">
          <h2 id="address-picker-title" className="font-display text-lg font-extrabold text-neutral-900">
            {step === 'map' ? 'Set your exact location' : 'Add a new address'}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>

        {step === 'checking' && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 size={24} className="animate-spin text-neutral-400" />
          </div>
        )}

        {/* Step 1: ask for location, with the reason */}
        {step === 'ask' && (
          <div className="px-6 pb-7 pt-2 text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-ink">
                <Navigation size={26} />
              </span>
            </span>
            <h3 className="mt-5 font-display text-xl font-extrabold text-neutral-900">Where should the professional come?</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
              Allow location access so we can find your address, and your professional reaches your exact door.
            </p>
            <button
              type="button"
              onClick={locate}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-extrabold text-ink transition hover:brightness-95"
            >
              <LocateFixed size={18} /> Use my current location
            </button>
            <button
              type="button"
              onClick={() => setStep('map')}
              className="mt-3 w-full rounded-xl py-3 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            >
              Set it on the map instead
            </button>
          </div>
        )}

        {step === 'map' && (
          <>
            {/* Step 2–3: map with a fixed centre pin */}
            <div className="relative">
              <AppMap
                center={point}
                zoom={17}
                accuracyM={accuracy}
                accuracyAtCenter
                onCenterChange={onCenterChange}
                onMoveStart={() => setMoving(true)}
                className="h-72 w-full"
              />

              {/* Centre pin: lifts while the map moves */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-[500] -translate-x-1/2 -translate-y-full">
                <div className={`flex flex-col items-center transition-transform duration-200 ${moving ? '-translate-y-3' : ''}`}>
                  {!moving && (
                    <div className="relative mb-2.5 whitespace-nowrap rounded-xl bg-neutral-900 px-3 py-2 text-center text-xs font-bold text-white shadow-lg">
                      {bubble}
                      {!locating && !adjusted && <span className="block text-[10px] font-medium text-white/70">so your professional finds your door</span>}
                      <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-[7px] border-x-transparent border-t-neutral-900" aria-hidden="true" />
                    </div>
                  )}
                  <svg width="38" height="50" viewBox="0 0 34 46" className="drop-shadow-lg" aria-hidden="true">
                    <path d="M17 45s15-15.6 15-27A15 15 0 0 0 2 18c0 11.4 15 27 15 27z" fill="#0A0A0A" stroke="#fff" strokeWidth="2.5" />
                    <circle cx="17" cy="18" r="5.5" fill="#FFC800" />
                  </svg>
                </div>
              </div>
              {/* Shadow dot marking the exact spot */}
              <span
                className={`pointer-events-none absolute left-1/2 top-1/2 z-[499] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 transition-opacity ${moving ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden="true"
              />

              <button
                type="button"
                onClick={locate}
                className="absolute bottom-3 right-3 z-[500] inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-neutral-900 shadow-lg ring-1 ring-neutral-200 hover:bg-neutral-50"
              >
                {locating ? <Loader2 size={15} className="animate-spin" /> : <LocateFixed size={15} />} Use current location
              </button>
              {accuracy !== null && accuracy > 30 && !locating && !adjusted && (
                <p className="pointer-events-none absolute left-3 top-3 z-[500] max-w-[calc(100%-5rem)] rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-neutral-800 shadow ring-1 ring-neutral-200">
                  Location is approximate (±{accuracy} m). Please adjust the pin.
                </p>
              )}
            </div>

            {/* Step 4: details */}
            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto px-5 py-5">
              <div className="flex items-start gap-3 rounded-2xl bg-neutral-50 px-4 py-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-neutral-900" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-900">{area || (locating ? 'Detecting your address…' : 'Pin location')}</p>
                  <p className="text-xs text-neutral-500">Move the map if the pin isn’t exactly on your building.</p>
                </div>
              </div>
              <div className="flex gap-2">
                {LABELS.map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLabel(value)}
                    className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                      label === value ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <Icon size={15} /> {value}
                  </button>
                ))}
              </div>
              <div>
                <label htmlFor="addr-line1" className="text-sm font-semibold text-neutral-800">Flat / house no., building</label>
                <input id="addr-line1" value={line1} onChange={(e) => setLine1(e.target.value)} maxLength={150} placeholder="e.g. B-1204, Lodha Splendora" className={inputClass} />
              </div>
              <div>
                <label htmlFor="addr-line2" className="text-sm font-semibold text-neutral-800">Street, area, landmark</label>
                <input
                  id="addr-line2"
                  value={line2}
                  onChange={(e) => {
                    line2Touched.current = true;
                    setLine2(e.target.value);
                  }}
                  maxLength={200}
                  placeholder="e.g. Ghodbunder Road, near Hypercity, Thane West"
                  className={inputClass}
                />
              </div>
              {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
              >
                {saving && <Loader2 size={18} className="animate-spin" />} Save address
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
