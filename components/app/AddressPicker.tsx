'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { X, LocateFixed, Loader2, Home, Briefcase, MapPin } from 'lucide-react';
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

/** Modal: drop a pin on the map (or use current location), then add flat/building details. */
export default function AddressPicker({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: (address: Address) => void;
}) {
  const [point, setPoint] = useState<LatLng>(DEFAULT_CENTER);
  const [label, setLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [locating, setLocating] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const watchRef = useRef<number | null>(null);
  const line2Touched = useRef(false);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fill "area / landmark" from the pin using OpenStreetMap's free geocoder (best effort).
  const reverseGeocode = useCallback((p: LatLng) => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=17&accept-language=en&lat=${p.lat}&lon=${p.lng}`
        );
        if (!res.ok) return;
        const data = (await res.json()) as { address?: Record<string, string> };
        const a = data.address ?? {};
        const parts = [a.road, a.neighbourhood || a.suburb, a.city || a.town || a.village, a.postcode].filter(Boolean);
        if (parts.length && !line2Touched.current) setLine2(parts.join(', '));
      } catch {
        /* ignore: the customer can type the area themselves */
      }
    }, 600);
  }, []);

  // Tapping or dragging the pin: the customer chose the spot, so hide the GPS accuracy ring.
  const pick = useCallback(
    (p: LatLng) => {
      setPoint(p);
      setAccuracy(null);
      reverseGeocode(p);
    },
    [reverseGeocode]
  );

  // GPS often starts rough (cell towers / Wi-Fi) and sharpens over a few seconds.
  // Keep listening for up to 8 s and keep the most accurate fix; stop early once within 20 m.
  const locate = useCallback(
    (showErrors: boolean) => {
      if (!navigator.geolocation) {
        setLocating(false);
        if (showErrors) setError('Your browser cannot share location. Please drop the pin on the map.');
        return;
      }
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
      setLocating(true);
      setError('');
      let best = Infinity;
      const stop = () => {
        if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
        setLocating(false);
      };
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const acc = pos.coords.accuracy;
          if (acc < best) {
            best = acc;
            const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setPoint(p);
            setAccuracy(Math.round(acc));
            reverseGeocode(p);
          }
          if (acc <= 20) stop();
        },
        () => {
          stop();
          if (showErrors) setError('Location permission was denied. Drag the pin to your home instead.');
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
      );
      setTimeout(() => watchRef.current !== null && stop(), 8000);
    },
    [reverseGeocode]
  );

  useEffect(() => {
    // Try the device location once when the picker opens (deferred so state isn't set during the effect).
    const start = setTimeout(() => locate(false), 0);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(start);
      window.removeEventListener('keydown', onKey);
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const res = await saveAddress({ label, line1, line2, lat: point.lat, lng: point.lng });
    setSaving(false);
    if (res.ok) onSaved(res.address);
    else setError(res.error);
  }

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
          <h2 id="address-picker-title" className="font-display text-lg font-extrabold text-neutral-900">Add a new address</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100">
            <X size={20} />
          </button>
        </div>

        <div className="relative">
          <AppMap
            center={point}
            zoom={17}
            markers={[{ id: 'pin', kind: 'pin', ...point }]}
            accuracyM={accuracy}
            onPick={pick}
            className="h-64 w-full"
          />
          {accuracy !== null && !locating && (
            <p className="pointer-events-none absolute left-3 top-12 z-[500] max-w-[calc(100%-1.5rem)] rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-neutral-800 shadow ring-1 ring-neutral-200">
              {accuracy <= 30 ? `Accurate to ~${accuracy} m` : `Rough location (±${accuracy} m), drag the pin to your door`}
            </p>
          )}
          <button
            type="button"
            onClick={() => locate(true)}
            className="absolute bottom-3 right-3 z-[500] inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-neutral-900 shadow-lg ring-1 ring-neutral-200 hover:bg-neutral-50"
          >
            {locating ? <Loader2 size={15} className="animate-spin" /> : <LocateFixed size={15} />} Use current location
          </button>
          <p className="pointer-events-none absolute left-3 top-3 z-[500] rounded-full bg-neutral-900/85 px-3 py-1.5 text-[11px] font-semibold text-white">
            Tap the map or drag the pin to your door
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 overflow-y-auto px-5 py-5">
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
      </div>
    </div>
  );
}
