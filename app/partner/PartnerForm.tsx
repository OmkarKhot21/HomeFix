'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { submitPartnerApplication } from '@/app/actions/userActions';

const inputClass =
  'mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900';

const TRADES = [
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'carpenter', label: 'Carpenter' },
];

export default function PartnerForm({ defaultName, defaultPhone }: { defaultName: string; defaultPhone: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setStatus('loading');
    try {
      const res = await submitPartnerApplication(new FormData(e.currentTarget));
      if (res.ok) {
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

  if (status === 'done') {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
        <CheckCircle2 size={48} className="mx-auto text-emerald-600" />
        <h2 className="mt-4 font-display text-2xl font-extrabold text-slate-900">Thanks for applying!</h2>
        <p className="mt-2 text-slate-600">
          Our partner team will call you within 2 working days to explain the next steps (ID and police verification, and a skill check).
        </p>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white hover:bg-black">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-slate-800">Full name</label>
        <input id="name" name="name" required maxLength={80} defaultValue={defaultName} autoComplete="name" className={inputClass} />
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

      <fieldset>
        <legend className="text-sm font-semibold text-slate-800">Your trade</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {TRADES.map((t, i) => (
            <label
              key={t.value}
              className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition has-[:checked]:border-slate-900 has-[:checked]:bg-slate-900 has-[:checked]:text-white"
            >
              <input type="radio" name="trade" value={t.value} required defaultChecked={i === 0} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="area" className="text-sm font-semibold text-slate-800">Area you work in</label>
          <input id="area" name="area" required maxLength={80} placeholder="e.g. Thane West" className={inputClass} />
        </div>
        <div>
          <label htmlFor="experienceYears" className="text-sm font-semibold text-slate-800">Years of experience</label>
          <input id="experienceYears" name="experienceYears" type="number" required min={0} max={60} defaultValue={1} className={inputClass} />
        </div>
      </div>

      {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
      >
        {status === 'loading' && <Loader2 size={18} className="animate-spin" />}
        Submit application
      </button>
    </form>
  );
}
