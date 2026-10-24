import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CONCEPTS = [
  {
    href: '/designs/1',
    name: 'Toolbox',
    vibe: 'Bold yellow + black, Swiggy-style. Action first, big category tiles.',
    swatch: ['#FFC107', '#111111', '#FFFFFF'],
  },
  {
    href: '/designs/2',
    name: 'Trusted Neighbour',
    vibe: 'Warm cream + deep green. Calm and premium, built around trust.',
    swatch: ['#FBF7F0', '#14532D', '#F59E0B'],
  },
  {
    href: '/designs/3',
    name: 'Express',
    vibe: 'Dark + electric lime, quick-commerce energy. The 15-minute timer is the hero.',
    swatch: ['#0B0F14', '#C6F432', '#FFFFFF'],
  },
];

export default function DesignsIndex() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">HomeFix</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Design concepts</h1>
        <p className="mt-2 text-slate-600">
          Three directions for the landing page. The live site at{' '}
          <Link href="/" className="font-semibold text-slate-900 underline">/</Link> is unchanged.
        </p>

        <div className="mt-10 grid gap-4">
          {CONCEPTS.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-900 hover:shadow-lg"
            >
              <div className="flex shrink-0 overflow-hidden rounded-xl border border-slate-200">
                {c.swatch.map((s) => (
                  <span key={s} className="h-14 w-6 sm:w-8" style={{ backgroundColor: s }} />
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-400">Concept {i + 1}</p>
                <h2 className="text-lg font-bold text-slate-900">{c.name}</h2>
                <p className="text-sm text-slate-600">{c.vibe}</p>
              </div>
              <ArrowRight className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
