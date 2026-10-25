'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useNightNow } from '@/components/useNightNow';
import CallbackModal from '@/components/CallbackModal';
import { ChevronDown, ArrowRight, PhoneCall } from 'lucide-react';

const FAQS = [
  {
    q: 'How fast can a professional reach me?',
    a: 'For “Right now” bookings, we alert verified professionals near your address immediately. Once someone accepts, you see their live location and an arrival time on the tracking screen.',
  },
  {
    q: 'What does the visit charge include?',
    a: 'The visit charge covers the inspection and standard work for that service. If a part needs replacing, the professional shows you the part price before fitting it — nothing is added without your okay.',
    night: ' Right now it’s after 8 PM, so plumbing and electrical visits have a flat ₹150 night charge, shown before you book.',
  },
  {
    q: 'When and how do I pay?',
    a: 'Only after the job is done and you’re happy with it. You can pay by UPI, card or cash directly at the end of the visit.',
  },
  {
    q: 'What if the problem comes back?',
    a: 'Every repair has a 7-day workmanship warranty. If the same issue returns within 7 days, we send a professional to fix it at no extra charge.',
  },
  {
    q: 'Are your professionals verified?',
    a: 'Yes. Each partner completes an identity check, police verification and a skill check before they can go online.',
  },
  {
    q: 'Can I schedule a visit for later?',
    a: 'Yes. Choose “Schedule” while booking, then pick a day within the next week and a time slot that suits you. Electrical work can also be booked at night, between 8 PM and 12 AM.',
  },
];

export function Faq() {
  const nightNow = useNightNow();
  return (
    <section id="faq" className="scroll-mt-20 border-t border-neutral-200/60 bg-neutral-50 py-20">
      <div className="container mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">Questions, answered</h2>
          <p className="mt-3 text-neutral-600">Can’t find what you’re looking for? Request a callback and our team will help.</p>
        </div>
        <div className="divide-y divide-neutral-200 rounded-3xl bg-white ring-1 ring-neutral-200">
          {FAQS.map(({ q, a, night }) => (
            <details key={q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-neutral-900">
                {q}
                <ChevronDown size={18} className="shrink-0 text-neutral-400 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                {a}
                {nightNow && night}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const [callbackOpen, setCallbackOpen] = useState(false);
  return (
    <section className="bg-neutral-50 pb-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-brand px-8 py-14 text-center sm:px-16">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#0A0A0A_1px,transparent_1px)] [background-size:18px_18px]" aria-hidden="true" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Something broken? Don’t wait hours. Wait minutes.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-ink/70">Book a verified professional and watch them arrive.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/login" className="inline-flex items-center gap-2 rounded-2xl bg-ink px-7 py-4 text-sm font-extrabold text-white hover:bg-black">
                Book a repair <ArrowRight size={16} />
              </Link>
              <button type="button" onClick={() => setCallbackOpen(true)} className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink px-7 py-4 text-sm font-extrabold text-ink hover:bg-ink/5">
                <PhoneCall size={16} /> Request a callback
              </button>
            </div>
          </div>
        </div>
      </div>
      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </section>
  );
}
