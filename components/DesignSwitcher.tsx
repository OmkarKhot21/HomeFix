'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

const VARIANTS = [
  { href: '/', label: 'Default MVP' },
  { href: '/designs/1', label: '1. Toolbox' },
  { href: '/designs/2', label: '2. Trusted' },
  { href: '/designs/3', label: '3. Express' },
];

export default function DesignSwitcher() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <aside aria-label="Design variants switcher" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] max-w-fit">
      <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/90 text-white backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs font-semibold">
        <Link 
          href="/designs" 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          title="View all design concepts"
        >
          <Sparkles size={13} className="text-amber-400" />
          <span className="hidden sm:inline font-bold">Designs:</span>
        </Link>
        <div className="flex items-center gap-1">
          {VARIANTS.map((v) => {
            const isActive = pathname === v.href;
            return (
              <Link
                key={v.href}
                href={v.href}
                className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {v.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
