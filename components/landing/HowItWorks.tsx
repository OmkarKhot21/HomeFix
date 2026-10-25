import { MousePointerClick, MapPinned, Wallet, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: MousePointerClick,
    title: 'Pick the repair',
    text: 'Choose from 10 common repairs with the price shown upfront.',
    detail: 'Leaking tap · from ₹199',
  },
  {
    icon: MapPinned,
    title: 'Track your pro live',
    text: 'The nearest verified professional accepts in minutes. Watch them on the map with a live arrival time.',
    detail: 'Arriving in 12 min',
  },
  {
    icon: Wallet,
    title: 'Pay after the job',
    text: 'Inspect the work first, then pay by UPI, card or cash. Every repair is covered by a 7-day warranty.',
    detail: '7-day warranty',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-b border-neutral-200/60 bg-white py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            From “it’s broken” to fixed in three steps
          </h2>
          <p className="mt-3 text-neutral-600">No calling around, no haggling, no waiting all day for someone who may not show up.</p>
        </div>

        <ol className="mt-12 grid gap-6 lg:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text, detail }, i) => (
            <li key={title} className="group relative flex flex-col rounded-3xl border border-neutral-200 bg-neutral-50/60 p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="hf-glass-light flex h-12 w-12 items-center justify-center rounded-2xl text-ink">
                  <Icon size={22} />
                </span>
                <span className="font-display text-5xl font-extrabold text-neutral-200 transition group-hover:text-neutral-300">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-extrabold text-neutral-900">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">{text}</p>
              <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 ring-1 ring-neutral-200">
                {detail}
              </span>
              {i < STEPS.length - 1 && (
                <ArrowRight className="absolute -right-5 top-1/2 hidden -translate-y-1/2 text-neutral-300 lg:block" size={22} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
