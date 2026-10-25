'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { submitBooking } from '@/app/actions/userActions';
import { SERVICES, getService } from '@/lib/services';
import { BOOKING_SLOTS } from '@/lib/validations';

const inputClass =
  'mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900';

function todayInIndia(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export default function BookingForm({ defaultService, defaultPhone }: { defaultService: string; defaultPhone: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<{ id?: string; service: string; date: string; slot: string } | null>(null);
  const today = todayInIndia();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setStatus('loading');
    const formData = new FormData(e.currentTarget);
    try {
      const res = await submitBooking(formData);
      if (res.ok) {
        setSummary({
          id: res.bookingId,
          service: getService(String(formData.get('service')))?.name ?? '',
          date: String(formData.get('preferredDate')),
          slot: String(formData.get('preferredSlot')),
        });
        setStatus('done');
      } else {
        setError(res.error);
        setStatus('idle');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('idle');
    }
  }

  if (status === 'done' && summary) {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
        <h2 className="mt-4 font-display text-2xl font-extrabold text-slate-900">Request received!</h2>
        <p className="mt-2 text-slate-600">
          Our team will call you shortly to confirm your <strong>{summary.service}</strong> visit.
        </p>
        <dl className="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl bg-slate-50 p-4 text-left text-sm">
          {summary.id && (
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Request no.</dt><dd className="font-semibold">#{summary.id}</dd></div>
          )}
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Date</dt><dd className="font-semibold">{summary.date}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Time</dt><dd className="font-semibold">{summary.slot}</dd></div>
        </dl>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-black">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <label htmlFor="service" className="text-sm font-semibold text-slate-800">Service</label>
        <select id="service" name="service" required defaultValue={defaultService} className={inputClass}>
          <option value="" disabled>Choose a service</option>
          {(['Plumbing', 'Electrical', 'Carpentry'] as const).map((group) => (
            <optgroup key={group} label={group}>
              {SERVICES.filter((s) => s.category === group).map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.isCategory ? `Other ${group.toLowerCase()} work` : `${s.name} — from ₹${s.price}`}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-semibold text-slate-800">Mobile number</label>
        <div className="mt-2 flex items-center rounded-xl border-2 border-slate-200 bg-white px-3 focus-within:border-slate-900">
          <span className="border-r border-slate-200 pr-3 text-sm font-bold text-slate-500">+91</span>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            required
            defaultValue={defaultPhone}
            placeholder="98765 43210"
            className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="text-sm font-semibold text-slate-800">Full address</label>
        <textarea
          id="address"
          name="address"
          required
          rows={3}
          maxLength={400}
          placeholder="Flat no., building, street, area, city, PIN code"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredDate" className="text-sm font-semibold text-slate-800">Preferred date</label>
          <input id="preferredDate" name="preferredDate" type="date" required min={today} defaultValue={today} className={inputClass} />
        </div>
        <div>
          <label htmlFor="preferredSlot" className="text-sm font-semibold text-slate-800">Preferred time</label>
          <select id="preferredSlot" name="preferredSlot" required defaultValue={BOOKING_SLOTS[0]} className={inputClass}>
            {BOOKING_SLOTS.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="text-sm font-semibold text-slate-800">
          Describe the problem <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={500}
          placeholder="e.g. Kitchen tap leaking from the base since yesterday"
          className={inputClass}
        />
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
      >
        {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
        Request booking
      </button>
      <p className="text-center text-xs text-slate-500">No payment now. You pay after the job is done.</p>
    </form>
  );
}
