import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LEGAL } from '@/lib/legal';

// Shared layout for the Privacy Policy and Terms pages: readable width, clear headings, contents list.

export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: React.ReactNode;
  sections: { id: string; title: string; body: React.ReactNode }[];
}) {
  return (
    <div className="min-h-screen bg-white text-neutral-800">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <Link href="/" className="inline-flex items-center gap-2 font-display text-lg font-extrabold text-ink">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-xs font-black text-brand">HF</span>
            {LEGAL.brand}
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-ink">
            <ArrowLeft size={16} /> Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: {LEGAL.lastUpdated}</p>
        <div className="mt-6 space-y-4 text-[15px] leading-7">{intro}</div>

        <nav aria-label="Contents" className="mt-8 rounded-2xl bg-neutral-50 p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Contents</p>
          <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-neutral-700 underline-offset-2 hover:text-ink hover:underline">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((s, i) => (
          <section key={s.id} id={s.id} className="scroll-mt-6 pt-10">
            <h2 className="font-display text-xl font-extrabold text-ink">
              {i + 1}. {s.title}
            </h2>
            <div className="mt-3 space-y-3 text-[15px] leading-7 [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_li]:pl-1 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
              {s.body}
            </div>
          </section>
        ))}

        <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-200 pt-6 text-sm">
          <Link href="/privacy" className="font-semibold text-neutral-700 hover:text-ink">Privacy Policy</Link>
          <Link href="/terms" className="font-semibold text-neutral-700 hover:text-ink">Terms of Service</Link>
          <a href="/contact" className="font-semibold text-neutral-700 hover:text-ink">Contact us</a>
        </div>
      </main>
    </div>
  );
}
