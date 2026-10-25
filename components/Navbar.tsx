'use client';

import { Menu, X, LogIn, LogOut, CalendarCheck } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { logoutUser } from '@/app/actions/userActions';
import type { SessionUser } from '@/lib/userAuth';

export default function Navbar({
  user,
  onOpenInvestor,
}: {
  user?: SessionUser | null;
  onOpenInvestor?: () => void;
}) {
  const firstName = user?.name?.split(" ")[0] || null;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex h-20 items-center border-b border-neutral-200/70 bg-white/85 backdrop-blur-md">
      <div className="container mx-auto px-6 flex items-center justify-between w-full max-w-7xl">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink font-display text-lg font-extrabold text-brand shadow-sm">
            HF
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold text-black tracking-tight leading-none">
              HOMEFIX
            </span>
            <span className="text-[9px] font-semibold text-neutral-500 tracking-wider uppercase mt-0.5">
              Fixing Homes, Improving Lives
            </span>
          </div>
        </a>

        <button
          type="button"
          className="md:hidden text-black p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Phones: full-width dropdown with large tap targets. Desktop: inline links. */}
        <nav
          className={`absolute left-0 top-20 w-full flex-col gap-4 border-b border-neutral-200 bg-white px-6 pb-6 pt-2 shadow-xl md:static md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-none md:bg-transparent md:p-0 md:shadow-none ${isOpen ? 'flex' : 'hidden'}`}
        >
          <ul className="flex w-full flex-col divide-y divide-neutral-100 text-base font-semibold text-ink md:w-auto md:flex-row md:gap-6 md:divide-y-0 md:text-sm md:text-neutral-600">
            {[
              { href: '#services', label: 'Services' },
              { href: '#why-us', label: 'Why HomeFix' },
              { href: '#how-it-works', label: 'How It Works' },
              { href: '#coverage', label: 'Areas Covered' },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setIsOpen(false)} className="block py-3.5 transition-colors hover:text-black md:py-0">
                  {l.label}
                </a>
              </li>
            ))}
            {onOpenInvestor && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onOpenInvestor();
                    setIsOpen(false);
                  }}
                  className="block w-full py-3.5 text-left font-semibold transition-colors hover:text-black md:py-0"
                >
                  Investors
                </button>
              </li>
            )}
          </ul>

          {user ? (
            <div className="flex w-full items-center gap-2 md:w-auto">
              <Link
                href="/app"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-neutral-800 md:flex-none md:py-2.5"
              >
                <CalendarCheck size={16} /> {firstName ? `Hi, ${firstName}` : 'Book a service'}
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  aria-label="Log out"
                  title="Log out"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition hover:border-black hover:text-black"
                >
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-extrabold uppercase tracking-wider text-ink shadow-md transition-all hover:bg-brand-600 active:scale-95 md:w-auto md:py-2.5 md:text-xs md:hover:scale-105"
            >
              <LogIn size={16} /> Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
