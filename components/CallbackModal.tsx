'use client';

import { useEffect, useRef, useState } from 'react';
import { X, PhoneCall, CheckCircle2, Loader2 } from 'lucide-react';
import { captureCallback } from '@/app/actions/captureLead';

// "Request a callback" popup: the visitor leaves a number and our team calls back.
export default function CallbackModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setStatus('loading');
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    formData.set('phone', phone);
    try {
      const res = await captureCallback(formData);
      if ('success' in res && res.success) setStatus('success');
      else {
        setStatus('error');
        setErrorMessage('error' in res && res.error ? res.error : 'Please enter a valid 10-digit mobile number.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="callback-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-t-3xl bg-white p-7 shadow-2xl sm:rounded-3xl"
      >
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-ink">
          <X size={20} />
        </button>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-ink">
          <PhoneCall size={22} />
        </span>
        <h2 id="callback-title" className="mt-4 font-display text-2xl font-extrabold text-ink">Request a callback</h2>
        <p className="mt-1 text-sm text-neutral-600">Leave your number and our team will call you back shortly.</p>

        {status === 'success' ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-brand-50 p-4 text-sm font-semibold text-neutral-900">
            <CheckCircle2 size={20} className="shrink-0" />
            Thanks! Our team will call you back shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative mt-6 space-y-3">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="pointer-events-none absolute -left-[9999px] opacity-0" />
            <label htmlFor="callback-phone" className="text-sm font-semibold text-neutral-800">Mobile number</label>
            <div className="flex items-center rounded-2xl border-2 border-neutral-200 px-3 focus-within:border-ink">
              <span className="border-r border-neutral-200 pr-3 text-sm font-bold text-neutral-500">+91</span>
              <input
                ref={inputRef}
                id="callback-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ''));
                  if (status === 'error') {
                    setStatus('idle');
                    setErrorMessage('');
                  }
                }}
                placeholder="98765 43210"
                className="w-full bg-transparent px-3 py-3 text-sm text-neutral-900 outline-none"
              />
            </div>
            {status === 'error' && errorMessage && <p role="alert" className="text-xs font-semibold text-red-600">{errorMessage}</p>}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-4 text-sm font-extrabold text-white transition hover:bg-black disabled:opacity-60"
            >
              {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <PhoneCall size={16} />} Request callback
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
