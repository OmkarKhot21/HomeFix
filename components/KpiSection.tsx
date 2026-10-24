'use client';

import { Timer, ShieldCheck, BadgeIndianRupee, Award } from 'lucide-react';

const trustItems = [
  {
    icon: Timer,
    stat: '< 15 Mins',
    label: 'Average Dispatch',
    desc: 'Hyperlocal GPS matching across MMR',
  },
  {
    icon: ShieldCheck,
    stat: '100% Verified',
    label: 'Police Checked',
    desc: 'Strict identity vetting & skill audits',
  },
  {
    icon: BadgeIndianRupee,
    stat: 'Upfront Rates',
    label: 'Standard Pricing',
    desc: 'Pre-set rate cards with zero surge fees',
  },
  {
    icon: Award,
    stat: '30-Day',
    label: 'Work Warranty',
    desc: 'Free re-inspection if issue recurs',
  },
];

export default function KpiSection() {
  return (
    <section id="why-us" className="py-12 bg-white/40 backdrop-blur-[2px] border-y border-slate-200/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 hover:border-slate-400 hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900 leading-tight mb-0.5">
                    {item.stat}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mb-0.5">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
