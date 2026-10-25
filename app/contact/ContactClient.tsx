'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, PhoneCall } from 'lucide-react';
import CallbackModal from '@/components/CallbackModal';

// Contact page: works for everyone, including logged-in users (the home page redirects them).
export default function ContactClient() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-xl px-5 py-12">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-ink">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-neutral-200 sm:p-9">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-ink">
            <PhoneCall size={22} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-ink sm:text-3xl">Talk to the HomeFix team</h1>
          <p className="mt-2 text-neutral-600">
            Leave your number and our team will call you back. We can help with a booking, a complaint, a warranty claim (keep your booking number
            ready), or a request about your personal data.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink py-4 text-sm font-extrabold text-white transition hover:bg-black"
          >
            <PhoneCall size={16} /> Request a callback
          </button>
          <p className="mt-6 text-xs text-neutral-500">
            Read our <Link href="/privacy" className="font-semibold underline">Privacy Policy</Link> and{' '}
            <Link href="/terms" className="font-semibold underline">Terms of Service</Link>.
          </p>
        </div>
      </div>
      <CallbackModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
