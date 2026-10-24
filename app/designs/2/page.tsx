import { ShieldCheck, Check, BadgeCheck, Fingerprint, FileCheck2, GraduationCap, Star, MapPin } from 'lucide-react';
import WaitlistForm, { type WaitlistTheme } from '@/components/designs/WaitlistForm';
import { SERVICES, STEPS, PROMISES, AREAS } from '@/components/designs/data';

// Concept 2 — "Trusted Neighbour": warm cream + deep green, calm and premium,
// built around the main worry of letting a stranger into your home.

const GREEN = '#14532D';

const lightForm: WaitlistTheme = {
  wrapper: 'rounded-2xl bg-white p-2 ring-1 ring-[#E9E1D3] shadow-[0_10px_30px_rgba(20,83,45,0.08)]',
  field: 'bg-[#F6F1E8] text-[#14532D]',
  input: 'text-stone-900 placeholder:text-stone-400',
  prefix: 'text-stone-500 border-stone-300',
  button: 'bg-[#14532D] text-white hover:bg-[#0F3F22]',
  error: 'text-red-700',
  success: 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200',
};

const greenForm: WaitlistTheme = {
  wrapper: 'rounded-2xl bg-white/10 p-2 ring-1 ring-white/15',
  field: 'bg-white/10 text-white',
  input: 'text-white placeholder:text-white/50',
  prefix: 'text-white/70 border-white/25',
  button: 'bg-[#F59E0B] text-stone-950 hover:bg-[#FBBF24]',
  error: 'text-amber-200',
  success: 'bg-white/10 text-white',
};

const CHECKS = [
  { icon: Fingerprint, label: 'Aadhaar & police verification' },
  { icon: GraduationCap, label: 'Skill test before onboarding' },
  { icon: FileCheck2, label: 'Uniform & HomeFix ID badge' },
  { icon: BadgeCheck, label: 'Rated after every job' },
];

const GROUPS = ['Plumbing', 'Electrical', 'Carpentry'] as const;

export default function TrustedNeighbourConcept() {
  return (
    <main className="min-h-screen bg-[#FBF7F0] text-stone-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#E9E1D3] bg-[#FBF7F0]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-extrabold text-white" style={{ backgroundColor: GREEN }}>
              HF
            </span>
            <span className="font-display text-lg font-bold tracking-tight" style={{ color: GREEN }}>HomeFix</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-medium text-stone-600 md:flex">
            <a href="#services" className="hover:text-stone-950">Services</a>
            <a href="#why-us" className="hover:text-stone-950">Our pros</a>
            <a href="#how-it-works" className="hover:text-stone-950">How it works</a>
            <a href="#coverage" className="hover:text-stone-950">Areas</a>
          </nav>
          <a href="#join" className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: GREEN }}>
            Join Waitlist
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="join" className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 ring-1 ring-[#E9E1D3]">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Launching soon · Thane, Mumbai & Navi Mumbai
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-[3.6rem]" style={{ color: GREEN }}>
            A repair pro you can
            <br />
            <span className="text-amber-600">trust at your door.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-stone-600">
            Verified plumbers, electricians and carpenters in 15 minutes. Fixed prices, 30-day warranty.
          </p>
          <div className="mt-8 max-w-xl">
            <WaitlistForm theme={lightForm} />
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">
            {['From ₹199', 'Pay after the job', 'Free re-visit for 30 days'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check size={16} className="text-emerald-700" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Visual: "Pro ID card" explaining verification (no fake person/ratings) */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-amber-100 via-[#F6F1E8] to-emerald-100" />
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_60px_-20px_rgba(20,83,45,0.35)] ring-1 ring-[#E9E1D3]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">HomeFix Pro ID</span>
              <ShieldCheck className="text-emerald-700" />
            </div>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F6F1E8]">
                <span className="font-display text-xl font-bold" style={{ color: GREEN }}>HF</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold">Every HomeFix pro</p>
                <p className="text-sm text-stone-500">goes through 4 checks</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {CHECKS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 rounded-xl bg-[#FBF7F0] px-3 py-2.5 text-sm font-medium">
                  <Icon size={18} className="shrink-0 text-emerald-700" />
                  <span className="flex-1">{label}</span>
                  <Check size={16} className="text-emerald-700" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Services, grouped by trade (Urban Company style) */}
      <section id="services" className="scroll-mt-20 bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold" style={{ color: GREEN }}>What can we fix?</h2>
          <p className="mt-2 text-stone-600">Clear prices before you book. No surprises.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {GROUPS.map((g) => (
              <div key={g} className="rounded-3xl bg-[#FBF7F0] p-6 ring-1 ring-[#E9E1D3]">
                <h3 className="font-display text-lg font-bold" style={{ color: GREEN }}>{g}</h3>
                <ul className="mt-4 divide-y divide-[#E9E1D3]">
                  {SERVICES.filter((s) => s.group === g).map(({ name, price, icon: Icon }) => (
                    <li key={name}>
                      <a href="#join" className="flex items-center gap-3 py-3 text-sm hover:opacity-80">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-[#E9E1D3]">
                          <Icon size={18} className="text-emerald-800" />
                        </span>
                        <span className="flex-1 font-semibold">{name}</span>
                        <span className="text-stone-500">₹{price}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us / promises */}
      <section id="why-us" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <h2 className="text-3xl font-extrabold" style={{ color: GREEN }}>Our promise to your home</h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {PROMISES.map(({ title, text, icon: Icon }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <Icon size={22} className="text-amber-700" />
              </span>
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm text-stone-600">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — horizontal timeline */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-[#E9E1D3] bg-[#F6F1E8] py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold" style={{ color: GREEN }}>How it works</h2>
          <ol className="relative mt-12 grid gap-10 md:grid-cols-3">
            <div className="absolute left-6 right-6 top-6 hidden h-px bg-emerald-800/20 md:block" aria-hidden="true" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-bold text-white ring-8 ring-[#F6F1E8]" style={{ backgroundColor: GREEN }}>
                  {i + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-stone-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Coverage */}
      <section id="coverage" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="text-3xl font-extrabold" style={{ color: GREEN }}>Starting close to home</h2>
            <p className="mt-2 text-stone-600">We&apos;re launching neighbourhood by neighbourhood so every pro stays within 15 minutes.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-[#E9E1D3]">
                <MapPin size={14} className="text-amber-600" /> {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl rounded-[2rem] p-8 sm:p-12" style={{ backgroundColor: GREEN }}>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Star className="text-amber-400" />
              <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Get early access</h2>
              <p className="mt-2 text-emerald-100/80">Early members get their first inspection on us.*</p>
            </div>
            <WaitlistForm theme={greenForm} showCity={false} buttonLabel="Notify me" />
          </div>
        </div>
        <p className="mx-auto mt-3 max-w-6xl text-xs text-stone-400">*Example offer — only show if HomeFix actually runs it.</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E9E1D3] py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 HomeFix Technologies Pvt. Ltd. · Fixing Homes, Improving Lives.</span>
          <div className="flex gap-6">
            <a href="#services" className="hover:text-stone-900">Services</a>
            <a href="#coverage" className="hover:text-stone-900">Areas</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900">Instagram</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
