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

        <button className="md:hidden text-black p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`absolute md:static top-20 left-0 w-full md:w-auto bg-white md:bg-transparent flex-col md:flex-row items-center gap-8 p-6 md:p-0 shadow-xl md:shadow-none border-b-2 border-black md:border-none transition-all ${isOpen ? 'flex' : 'hidden md:flex'}`}>
          <ul className="flex flex-col md:flex-row gap-6 font-semibold text-sm text-neutral-600">
            <li><a href="#services" className="hover:text-black transition-colors">Services</a></li>
            <li><a href="#why-us" className="hover:text-black transition-colors">Why HomeFix</a></li>
            <li><a href="#how-it-works" className="hover:text-black transition-colors">How It Works</a></li>
            <li><a href="#coverage" className="hover:text-black transition-colors">Areas Covered</a></li>
            {onOpenInvestor && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onOpenInvestor();
                    setIsOpen(false);
                  }}
                  className="hover:text-black transition-colors font-semibold text-sm text-neutral-600 text-left"
                >
                  Investors
                </button>
              </li>
            )}
          </ul>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/app"
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md"
              >
                <CalendarCheck size={16} /> {firstName ? `Hi, ${firstName}` : 'Book a service'}
              </Link>
              <form action={logoutUser}>
                <button
                  type="submit"
                  aria-label="Log out"
                  title="Log out"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 hover:border-black hover:text-black transition"
                >
                  <LogOut size={16} />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 bg-brand text-ink px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider hover:bg-brand-600 hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <LogIn size={16} /> Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
