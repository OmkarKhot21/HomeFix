'use client';

import Link from 'next/link';
import { Wrench, HardHat, ArrowRight } from 'lucide-react';

// Shown after logging in from the main Login button:
// lets the person say whether they need a professional or are one.
export default function RoleChooser({ name }: { name?: string | null }) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-chooser-title"
        className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <p className="text-sm font-semibold text-slate-500">{name ? `Welcome, ${name.split(' ')[0]}!` : 'Welcome!'}</p>
        <h2 id="role-chooser-title" className="mt-1 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
          How can we help you today?
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/book"
            className="group flex flex-col rounded-2xl border-2 border-slate-200 p-6 transition hover:border-slate-900 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Wrench size={22} />
            </span>
            <span className="mt-5 font-display text-xl font-extrabold text-slate-900">Need a professional</span>
            <span className="mt-1 text-sm text-slate-600">Book a verified plumber, electrician or carpenter at your door.</span>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
              Book a service <ArrowRight size={15} className="transition group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/partner"
            className="group flex flex-col rounded-2xl border-2 border-slate-200 p-6 transition hover:border-slate-900 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-slate-900">
              <HardHat size={22} />
            </span>
            <span className="mt-5 font-display text-xl font-extrabold text-slate-900">I am a professional</span>
            <span className="mt-1 text-sm text-slate-600">Join HomeFix as a partner and get repair jobs near you.</span>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
              Join as a partner <ArrowRight size={15} className="transition group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
