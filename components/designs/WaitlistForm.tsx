'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { captureWaitlist } from '@/app/actions/captureLead';
import { CITIES } from './data';

export interface WaitlistTheme {
  wrapper: string; // outer box around the inputs
  field: string; // phone + city field boxes
  input: string; // text colour / placeholder for inputs
  prefix: string; // "+91" label
  button: string; // submit button
  error: string; // error text
  success: string; // success box
}

// Shared waitlist form for the design concepts.
// Uses the existing captureWaitlist server action and honeypot field.
export default function WaitlistForm({
  theme,
  buttonLabel = 'Join Waitlist',
  showCity = true,
}: {
  theme: WaitlistTheme;
  buttonLabel?: string;
  showCity?: boolean;
}) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 10) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    formData.set('phone', phone);

    try {
      const res = await captureWaitlist(formData);
      if ('success' in res && res.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('error' in res && res.error ? res.error : 'Please enter a valid 10-digit mobile number.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold ${theme.success}`}>
        <CheckCircle2 size={20} className="shrink-0" />
        <span>You&apos;re on the list! We&apos;ll text you the app link at launch.</span>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={`relative flex flex-col gap-2 sm:flex-row ${theme.wrapper}`}>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] opacity-0"
        />

        {showCity && (
          <label className={`flex items-center gap-2 rounded-xl px-3 py-3 sm:w-40 ${theme.field}`}>
            <MapPin size={16} className="shrink-0 opacity-70" />
            <span className="sr-only">City</span>
            <select name="area" defaultValue="Thane" className={`w-full bg-transparent text-sm font-semibold focus:outline-none ${theme.input}`}>
              {CITIES.map((c) => (
                <option key={c} value={c} className="text-black">
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className={`flex flex-1 items-center rounded-xl px-3 py-3 ${theme.field}`}>
          <span className={`mr-2 border-r pr-2 text-sm font-bold ${theme.prefix}`}>+91</span>
          <span className="sr-only">Mobile number</span>
          <input
            type="tel"
            name="phone"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (status === 'error') {
                setStatus('idle');
                setErrorMessage('');
              }
            }}
            placeholder="Mobile number"
            className={`w-full min-w-0 bg-transparent text-sm font-medium focus:outline-none ${theme.input}`}
          />
        </label>

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-70 ${theme.button}`}
        >
          {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <>{buttonLabel} <ArrowRight size={16} /></>}
        </button>
      </form>
      {status === 'error' && errorMessage && <p className={`mt-2 text-xs font-semibold ${theme.error}`}>{errorMessage}</p>}
    </div>
  );
}
