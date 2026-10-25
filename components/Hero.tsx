'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Zap, RotateCcw, Wallet, ArrowRight, Droplets, Hammer } from 'lucide-react';
import { getService, type Service } from '@/lib/services';

// Quick picker: opens the category popup (same as the service cards).
const QUICK_PICKS = [
  { slug: 'plumbing', label: 'Plumbing', icon: Droplets, price: 199 },
  { slug: 'electrical', label: 'Electrical', icon: Zap, price: 199 },
  { slug: 'carpentry', label: 'Carpentry', icon: Hammer, price: 249 },
];

// Hero photos, stored in public/hero/ (electrician, plumber, carpenter).
const PHOTOS = {
  main: { src: '/hero/electrician.png', alt: 'Electrician repairing wiring in a distribution board', pos: '40% center' },
  top: { src: '/hero/plumber.png', alt: 'Plumber fixing the pipe under a bathroom sink', pos: '45% 30%' },
  bottom: { src: '/hero/carpenter.png', alt: 'Carpenter planing a wooden plank in his workshop', pos: '55% 30%' },
};

export default function Hero({ onSelect }: { onSelect?: (service: Service) => void }) {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background: soft dot grid + yellow glow */}
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(#0A0A0A_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.06]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />

      <div className="container relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_1fr] lg:pb-28 lg:pt-16">
        {/* Copy */}
        <div>
          <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
            </span>
            Live in Mumbai, Thane &amp; Navi Mumbai
            <span className="text-neutral-300">|</span>
            <span className="flex items-center gap-1 text-neutral-500">
              <Zap size={11} className="fill-brand text-brand-600" /> &lt; 15 min dispatch
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-ink [font-family:var(--font-headline)] sm:text-6xl lg:text-7xl">
            Home repairs,
            <br />
            at your door in{' '}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10">20 minutes.</span>
              <span className="absolute inset-x-[-0.15em] bottom-[0.08em] z-0 h-[0.42em] -rotate-1 rounded-md bg-brand" aria-hidden="true" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            Book police-verified plumbers, electricians and carpenters in a few taps. Fixed prices, live tracking, and you pay
            only after the job is done.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-ink px-7 py-4 text-sm font-extrabold text-white shadow-[0_10px_30px_-10px_rgba(10,10,10,0.6)] transition hover:bg-black"
            >
              Book a repair <ArrowRight size={16} />
            </Link>
            <a href="#rapid-repair" className="inline-flex items-center gap-2 rounded-2xl border-2 border-ink px-6 py-[0.9rem] text-sm font-extrabold text-ink transition hover:bg-brand">
              See services
            </a>
          </div>

          {/* What do you need help with? */}
          {onSelect && (
            <div className="mt-8 max-w-lg rounded-3xl border border-neutral-200 bg-white/80 p-4 shadow-[0_12px_40px_-20px_rgba(10,10,10,0.35)] backdrop-blur">
              <p className="px-1 text-sm font-bold text-ink">What do you need help with?</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {QUICK_PICKS.map(({ slug, label, icon: Icon, price }) => (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => {
                      const s = getService(slug);
                      if (s) onSelect(s);
                    }}
                    className="group flex flex-col items-center rounded-2xl px-2 py-3 text-center transition hover:bg-neutral-50"
                  >
                    <span className="hf-glass-light flex h-12 w-12 items-center justify-center rounded-2xl text-ink transition group-hover:-translate-y-0.5">
                      <Icon size={20} />
                    </span>
                    <span className="mt-2 text-sm font-bold text-ink">{label}</span>
                    <span className="text-[11px] text-neutral-500">from ₹{price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-neutral-700">
            <span className="flex items-center gap-2"><ShieldCheck size={17} className="text-ink" /> Police verified</span>
            <span className="flex items-center gap-2"><RotateCcw size={16} className="text-ink" /> 7-day warranty</span>
            <span className="flex items-center gap-2"><Wallet size={16} className="text-ink" /> Pay after the job</span>
          </div>
        </div>

        {/* Visual: photo collage with floating cards */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 rotate-3 rounded-[3rem] bg-brand" aria-hidden="true" />
          <div className="relative grid grid-cols-5 grid-rows-6 gap-3 rounded-[2.5rem] bg-white p-3 shadow-2xl" style={{ height: 'min(560px, 120vw)' }}>
            <div className="relative col-span-3 row-span-6 overflow-hidden rounded-[2rem]">
              <Image src={PHOTOS.main.src} alt={PHOTOS.main.alt} fill priority sizes="(max-width: 1024px) 60vw, 340px" className="object-cover" style={{ objectPosition: PHOTOS.main.pos }} />
            </div>
            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-[2rem]">
              <Image src={PHOTOS.top.src} alt={PHOTOS.top.alt} fill sizes="(max-width: 1024px) 40vw, 230px" className="object-cover" style={{ objectPosition: PHOTOS.top.pos }} />
            </div>
            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-[2rem]">
              <Image src={PHOTOS.bottom.src} alt={PHOTOS.bottom.alt} fill sizes="(max-width: 1024px) 40vw, 230px" className="object-cover" style={{ objectPosition: PHOTOS.bottom.pos }} />
            </div>
          </div>

          {/* Floating: price */}
          <div className="absolute -right-3 top-8 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-neutral-100 sm:-right-8">
            <span className="block text-[11px] font-bold uppercase tracking-widest text-neutral-500">Visits from</span>
            <span className="block font-display text-3xl font-extrabold text-ink">₹199</span>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-ink">Fixed price</span>
          </div>

          {/* Floating: verified */}
          <div className="absolute -bottom-5 right-8 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-ink shadow-xl ring-1 ring-neutral-100">
            <ShieldCheck size={16} /> ID &amp; police verified
          </div>

          <p className="relative z-10 mt-14 text-center text-[11px] font-medium text-neutral-800">Images are illustrative.</p>
        </div>
      </div>
    </section>
  );
}
