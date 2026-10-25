'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, UserRound, LogOut, HardHat } from 'lucide-react';
import { logoutUser } from '@/app/actions/userActions';

const TABS = [
  { href: '/app', label: 'Home', icon: Home, match: (p: string) => p === '/app' || p.startsWith('/app/book') && !p.startsWith('/app/bookings') },
  { href: '/app/bookings', label: 'Bookings', icon: ClipboardList, match: (p: string) => p.startsWith('/app/bookings') },
  { href: '/app/profile', label: 'Profile', icon: UserRound, match: (p: string) => p.startsWith('/app/profile') },
];

export function CustomerTopBar({ name, isPro }: { name: string | null; isPro: boolean }) {
  const pathname = usePathname();
  const initial = (name?.trim()[0] || 'U').toUpperCase();
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/app" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink font-display text-sm font-extrabold text-brand">HF</span>
          <span className="font-display text-lg font-extrabold tracking-tight text-neutral-900">HomeFix</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {TABS.map((t) => {
            const active = t.match(pathname);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {isPro && (
            <Link
              href="/pro"
              className="hidden items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:border-neutral-900 sm:inline-flex"
            >
              <HardHat size={14} /> Partner mode
            </Link>
          )}
          <Link href="/app/profile" aria-label="Your profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
            {initial}
          </Link>
          <form action={logoutUser} className="hidden md:block">
            <button type="submit" aria-label="Log out" title="Log out" className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900">
              <LogOut size={17} />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

export function CustomerBottomTabs() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3">
        {TABS.map((t) => {
          const active = t.match(pathname);
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold ${active ? 'text-neutral-900' : 'text-neutral-400'}`}
            >
              <span className={`flex h-8 w-12 items-center justify-center rounded-full transition ${active ? 'bg-brand' : ''}`}>
                <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              </span>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
