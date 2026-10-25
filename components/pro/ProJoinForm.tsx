'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { applyAsProfessional } from '@/app/actions/proActions';

const inputClass =
  'mt-1.5 w-full rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-brand';

const TRADES = [
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'carpenter', label: 'Carpenter' },
];

export default function ProJoinForm({
  defaults,
}: {
  defaults: { name: string; phone: string; trade?: string; area?: string; experienceYears?: number };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const res = await applyAsProfessional(new FormData(e.currentTarget));
    if (res.ok) {
      router.push('/pro');
      router.refresh();
    } else {
      setSaving(false);
      setError(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-white/90">Full name (as on your ID)</label>
        <input id="name" name="name" required maxLength={80} defaultValue={defaults.name} autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-semibold text-white/90">Mobile number</label>
        <div className="mt-1.5 flex items-center rounded-2xl border-2 border-white/10 bg-white/5 px-3 focus-within:border-brand">
          <span className="border-r border-white/10 pr-3 text-sm font-bold text-white/50">+91</span>
          <input id="phone" name="phone" type="tel" inputMode="numeric" maxLength={10} required defaultValue={defaults.phone} placeholder="98765 43210" className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/30" />
        </div>
      </div>
      <fieldset>
        <legend className="text-sm font-semibold text-white/90">Your trade</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {TRADES.map((t, i) => (
            <label
              key={t.value}
              className="flex cursor-pointer items-center justify-center rounded-2xl border-2 border-white/10 px-3 py-3 text-sm font-semibold text-white/80 transition has-[:checked]:border-brand has-[:checked]:bg-brand has-[:checked]:text-ink"
            >
              <input type="radio" name="trade" value={t.value} required defaultChecked={defaults.trade ? defaults.trade === t.value : i === 0} className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="area" className="text-sm font-semibold text-white/90">Area you work in</label>
          <input id="area" name="area" required maxLength={80} defaultValue={defaults.area} placeholder="e.g. Thane West" className={inputClass} />
        </div>
        <div>
          <label htmlFor="experienceYears" className="text-sm font-semibold text-white/90">Years of experience</label>
          <input id="experienceYears" name="experienceYears" type="number" required min={0} max={60} defaultValue={defaults.experienceYears ?? 1} className={inputClass} />
        </div>
      </div>
      {error && <p role="alert" className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm font-medium text-red-200">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 text-sm font-extrabold text-ink transition hover:brightness-95 disabled:opacity-60"
      >
        {saving && <Loader2 size={18} className="animate-spin" />} Submit application
      </button>
      <p className="text-center text-xs leading-5 text-white/60">
        By applying, you agree to our{' '}
        <a href="/terms#professional" target="_blank" className="font-semibold text-white/85 underline hover:text-white">Terms of Service</a> and{' '}
        <a href="/privacy" target="_blank" className="font-semibold text-white/85 underline hover:text-white">Privacy Policy</a>, including sharing
        your live location while you are online.
      </p>
    </form>
  );
}
