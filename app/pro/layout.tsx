import type { Metadata } from 'next';
import Link from 'next/link';
import { LogOut, UserRound } from 'lucide-react';
import { requireUser } from '@/lib/userAuth';
import { logoutUser } from '@/app/actions/userActions';

export const metadata: Metadata = {
  title: 'HomeFix Partner',
  robots: { index: false, follow: false },
};

// Professional ("partner") area: /pro and /pro/join
export default async function ProLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser('/pro');
  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href="/pro" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand font-display text-sm font-extrabold text-ink">HF</span>
            <span className="font-display text-lg font-extrabold tracking-tight">
              HomeFix <span className="text-brand">Partner</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 hover:border-white/40 hover:text-white"
            >
              <UserRound size={14} /> <span className="hidden sm:inline">Customer mode</span>
            </Link>
            <form action={logoutUser}>
              <button type="submit" aria-label="Log out" title={`Log out ${user.name ?? ''}`} className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
                <LogOut size={17} />
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
