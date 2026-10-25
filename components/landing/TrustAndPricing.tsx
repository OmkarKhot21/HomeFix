import { Fingerprint, FileCheck2, GraduationCap, Star, BadgeIndianRupee, RotateCcw, Wallet, ShieldCheck } from 'lucide-react';

const CHECKS = [
  { icon: Fingerprint, title: 'Identity check', text: 'Government ID verified against the person who shows up at your door.' },
  { icon: FileCheck2, title: 'Police verification', text: 'Background verification completed before a partner can go online.' },
  { icon: GraduationCap, title: 'Skill check', text: 'Every partner proves their trade skills before taking their first job.' },
  { icon: Star, title: 'Rated after every job', text: 'Partners who fall below our standards are suspended from the platform.' },
];

const PROMISES = [
  { icon: BadgeIndianRupee, title: 'Upfront prices', text: 'See the full price before you book — no hidden fees, no bargaining.' },
  { icon: Wallet, title: 'Pay after the work', text: 'Inspect first, then pay by UPI, card or cash.' },
  { icon: RotateCcw, title: '7-day warranty', text: 'Same problem again within 7 days? We fix it free.' },
];

export function WhyHomeFix() {
  return (
    <section id="why-us" className="scroll-mt-20 bg-ink py-20 text-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-widest text-brand">Why HomeFix</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Letting someone into your home should never be a gamble
            </h2>
            <p className="mt-4 max-w-md text-white/60">
              Every HomeFix partner goes through four checks before they can accept a single job. You see their name and
              verification status before they arrive.
            </p>
            <div className="mt-8 space-y-3">
              {PROMISES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-3 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                  <span className="hf-glass flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-brand">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{title}</span>
                    <span className="block text-sm text-white/55">{text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ol className="relative space-y-4">
            {CHECKS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative flex gap-5 rounded-3xl bg-white/[0.04] p-6 ring-1 ring-white/10">
                <span className="hf-glass flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-brand">
                  <Icon size={22} />
                </span>
                <span>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">Check {i + 1}</span>
                  <span className="mt-1 block font-display text-xl font-extrabold">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-white/60">{text}</span>
                </span>
              </li>
            ))}
            <li className="flex items-center gap-3 rounded-3xl border border-dashed border-brand/40 p-5 text-sm font-semibold text-brand">
              <ShieldCheck size={20} /> Only then does the “Verified” badge appear on your booking.
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
