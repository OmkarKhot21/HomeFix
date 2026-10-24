import { ArrowRight, Zap, Wrench, Hammer, Plug, Droplets } from 'lucide-react';
import WaitlistForm, { type WaitlistTheme } from '@/components/designs/WaitlistForm';
import { SERVICES, STEPS, PROMISES, AREAS } from '@/components/designs/data';

// Concept 1 — "Toolbox": bold tool-yellow + black, Swiggy-style action-first layout.

const heroForm: WaitlistTheme = {
  wrapper: 'rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.18)]',
  field: 'bg-neutral-100',
  input: 'text-neutral-900 placeholder:text-neutral-400',
  prefix: 'text-neutral-500 border-neutral-300',
  button: 'bg-neutral-950 text-[#FFC107] hover:bg-black',
  error: 'text-red-700',
  success: 'bg-white text-emerald-800',
};

const darkForm: WaitlistTheme = {
  wrapper: 'rounded-2xl bg-white/5 p-2 ring-1 ring-white/10',
  field: 'bg-white/10 text-white',
  input: 'text-white placeholder:text-white/40',
  prefix: 'text-white/60 border-white/20',
  button: 'bg-[#FFC107] text-neutral-950 hover:bg-[#FFD24D]',
  error: 'text-red-300',
  success: 'bg-white/10 text-[#FFC107]',
};

export default function ToolboxConcept() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#FFC107]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 font-display text-sm font-extrabold text-[#FFC107]">HF</span>
            <span className="font-display text-lg font-extrabold tracking-tight">HomeFix</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <a href="#services" className="hover:opacity-70">Services</a>
            <a href="#how-it-works" className="hover:opacity-70">How it works</a>
            <a href="#why-us" className="hover:opacity-70">Why HomeFix</a>
            <a href="#coverage" className="hover:opacity-70">Areas</a>
          </nav>
          <a href="#join" className="rounded-xl bg-neutral-950 px-4 py-2 text-sm font-bold text-[#FFC107] hover:bg-black">
            Join Waitlist
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="join" className="relative overflow-hidden bg-[#FFC107]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:pb-24 lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3 py-1 text-xs font-bold text-[#FFC107]">
              <Zap size={12} className="fill-current" /> Launching soon in Thane & Mumbai
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Home repairs,
              <br />
              fixed in <span className="relative whitespace-nowrap">15 minutes<span className="absolute -bottom-1 left-0 h-2 w-full rounded bg-neutral-950/15" /></span>.
            </h1>
            <p className="mt-4 max-w-md text-base font-medium text-neutral-800 sm:text-lg">
              Verified plumbers, electricians & carpenters at your door. Fixed prices from ₹199.
            </p>
            <div className="mt-7 max-w-xl">
              <WaitlistForm theme={heroForm} />
            </div>
          </div>

          {/* Visual: tilted tool tiles (stand-in until real photos/3D icons exist) */}
          <div className="relative mx-auto h-72 w-full max-w-md sm:h-96" aria-hidden="true">
            <div className="absolute left-[8%] top-[6%] flex h-32 w-32 -rotate-6 items-center justify-center rounded-[2rem] bg-neutral-950 shadow-2xl sm:h-40 sm:w-40">
              <Wrench className="h-14 w-14 text-[#FFC107] sm:h-16 sm:w-16" />
            </div>
            <div className="absolute right-[6%] top-[0%] flex h-28 w-28 rotate-6 items-center justify-center rounded-[2rem] bg-white shadow-xl sm:h-32 sm:w-32">
              <Droplets className="h-12 w-12 text-sky-500" />
            </div>
            <div className="absolute bottom-[4%] left-[22%] flex h-28 w-28 rotate-3 items-center justify-center rounded-[2rem] bg-white shadow-xl sm:h-36 sm:w-36">
              <Plug className="h-12 w-12 text-neutral-900 sm:h-14 sm:w-14" />
            </div>
            <div className="absolute bottom-[12%] right-[4%] flex h-32 w-32 -rotate-3 items-center justify-center rounded-[2rem] bg-neutral-950 shadow-2xl sm:h-40 sm:w-40">
              <Hammer className="h-14 w-14 text-white sm:h-16 sm:w-16" />
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-4 py-3 text-center shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Starts at</p>
              <p className="font-display text-3xl font-extrabold">₹199</p>
            </div>
          </div>
        </div>
        {/* Curved bottom edge */}
        <div className="h-10 rounded-t-[2.5rem] bg-white" />
      </section>

      {/* Categories */}
      <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">What needs fixing?</h2>
        <div className="mt-8 grid grid-cols-3 gap-x-3 gap-y-8 sm:grid-cols-5">
          {SERVICES.map(({ name, price, icon: Icon }) => (
            <a key={name} href="#join" className="group flex flex-col items-center text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFF4CC] transition group-hover:bg-[#FFC107] sm:h-24 sm:w-24">
                <Icon className="h-9 w-9 text-neutral-900 sm:h-10 sm:w-10" strokeWidth={1.75} />
              </span>
              <span className="mt-3 text-sm font-bold leading-tight">{name}</span>
              <span className="text-xs text-neutral-500">from ₹{price}</span>
            </a>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-neutral-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Fixed in 3 steps</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC107] font-display text-xl font-extrabold">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why-us" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Why HomeFix?</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {PROMISES.map(({ title, text, icon: Icon }) => (
            <div key={title} className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-neutral-100 sm:flex-row sm:items-center sm:p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950">
                <Icon className="h-6 w-6 text-[#FFC107]" />
              </span>
              <div>
                <h3 className="font-bold leading-tight">{title}</h3>
                <p className="text-sm text-neutral-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6">
        <h2 className="text-2xl font-extrabold sm:text-3xl">Launching first in</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <span key={a} className="rounded-full border-2 border-neutral-950 px-4 py-2 text-sm font-bold">{a}</span>
          ))}
        </div>
        <p className="mt-4 text-sm text-neutral-500">Not on the list? Join the waitlist and we&apos;ll tell you when we reach you.</p>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-neutral-950 p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Be first in line <span className="text-[#FFC107]">when we launch.</span>
              </h2>
              <p className="mt-3 text-white/60">One text with the app link. No spam.</p>
            </div>
            <WaitlistForm theme={darkForm} showCity={false} buttonLabel="Notify me" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFC107] font-display text-xs font-extrabold text-neutral-950">HF</span>
            <span>© 2026 HomeFix Technologies Pvt. Ltd.</span>
          </div>
          <div className="flex gap-6">
            <a href="#services" className="hover:text-neutral-950">Services</a>
            <a href="#coverage" className="hover:text-neutral-950">Areas</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-neutral-950">
              Instagram <ArrowRight size={12} className="-rotate-45" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
