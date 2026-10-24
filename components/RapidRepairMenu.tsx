'use client';

import { ArrowUpRight, Zap } from 'lucide-react';
import { SERVICES } from '@/components/designs/data';
import { REPAIR_ICONS } from '@/components/RepairIcons';

// "Instant Booking Menu" — the 10 quick repair boxes from the Express design concept.
// Clicking a box scrolls up to the hero waitlist form and focuses the phone field.
export default function RapidRepairMenu() {
  const goToForm = () => {
    const el = document.getElementById('get-app');
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
    const input = el.querySelector<HTMLInputElement>('input[name="phone"]');
    if (input) setTimeout(() => input.focus(), 400);
  };

  return (
    <section id="rapid-repair" className="relative bg-[#0B0F14] py-14 sm:py-20 text-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C6F432]/30 bg-[#C6F432]/10 px-3 py-1 text-xs font-bold text-[#C6F432]">
              <Zap size={12} className="fill-current" /> Instant Booking Menu
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              What needs rapid repair?
            </h2>
          </div>
          <p className="text-sm text-white/55">Tap a repair to get notified first</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map(({ name, price, icon: Icon }) => {
            const Animated = REPAIR_ICONS[name];
            return (
            <button
              key={name}
              type="button"
              onClick={goToForm}
              className="group relative flex min-h-[150px] flex-col justify-between rounded-2xl bg-white/[0.04] p-4 text-left ring-1 ring-white/10 transition hover:bg-white/[0.08] hover:ring-[#C6F432]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6F432]"
            >
              <span className="text-[#C6F432]">
                {Animated ? <Animated /> : <Icon className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />}
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="absolute right-3 top-3 text-white/25 transition group-hover:text-[#C6F432]"
              />
              <span className="mt-8">
                <span className="block text-sm font-bold leading-tight">{name}</span>
                <span className="mt-0.5 block text-xs text-white/55">from ₹{price}</span>
              </span>
            </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
