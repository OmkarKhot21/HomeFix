'use client';

import { ArrowUpRight, Zap } from 'lucide-react';
import { REPAIR_ICONS } from '@/components/RepairIcons';
import { BOOKABLE_SERVICES, getServiceByName, type Service } from '@/lib/services';

// "Instant Booking Menu" — the 10 quick repair boxes (services from lib/services.ts).
// Clicking a box opens the service popup.
export default function RapidRepairMenu({ onSelect }: { onSelect: (service: Service) => void }) {

  return (
    <section id="rapid-repair" className="relative bg-ink py-14 sm:py-20 text-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
              <Zap size={12} className="fill-current" /> Instant Booking Menu
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              What needs rapid repair?
            </h2>
          </div>
          <p className="text-sm text-white/55">Tap a repair to see what’s included</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BOOKABLE_SERVICES.map(({ name, price }) => {
            const Animated = REPAIR_ICONS[name];
            return (
            <button
              key={name}
              type="button"
              onClick={() => {
                const service = getServiceByName(name);
                if (service) onSelect(service);
              }}
              className="group relative flex min-h-[150px] flex-col justify-between rounded-2xl bg-white/[0.04] p-4 text-left ring-1 ring-white/10 transition hover:bg-white/[0.08] hover:ring-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span className="hf-glass flex h-14 w-14 items-center justify-center rounded-2xl text-brand">
                {Animated ? <Animated /> : null}
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="absolute right-3 top-3 text-white/25 transition group-hover:text-brand"
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
