import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logoutUser } from '@/app/actions/userActions';

// Slim header for logged-in pages (/book, /partner).
export default function AppHeader({ name }: { name: string | null }) {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black font-display text-sm font-extrabold text-white">HF</span>
          <span className="font-display text-lg font-bold tracking-tight">HOMEFIX</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {name && <span className="hidden font-semibold text-neutral-700 sm:inline">Hi, {name.split(' ')[0]}</span>}
          <form action={logoutUser}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 font-semibold text-neutral-700 transition hover:border-black hover:text-black"
            >
              <LogOut size={14} /> Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
