import { Zap, Check, Gauge, Radio, ChevronRight } from 'lucide-react';
import WaitlistForm, { type WaitlistTheme } from '@/components/designs/WaitlistForm';
import { SERVICES, STEPS, PROMISES, AREAS } from '@/components/designs/data';

// Concept 3 — "15:00": Dark + electric lime (#C6F432), quick-commerce speed energy.
// The 15-minute timer SLA is the hero of the entire experience.

const LIME = '#C6F432';

const limeForm: WaitlistTheme = {
  wrapper: 'rounded-2xl bg-[#141A23] p-2 ring-1 ring-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)]',
  field: 'bg-[#1C2533] text-white',
  input: 'text-white placeholder:text-neutral-400',
  prefix: 'text-neutral-400 border-neutral-700',
  button: 'bg-[#C6F432] text-black font-extrabold hover:bg-[#D5F755]',
  error: 'text-red-400',
  success: 'bg-[#141A23] text-[#C6F432] ring-1 ring-[#C6F432]/30',
};

const darkCardForm: WaitlistTheme = {
  wrapper: 'rounded-2xl bg-black/60 p-2 ring-1 ring-[#C6F432]/30',
  field: 'bg-white/5 text-white',
  input: 'text-white placeholder:text-white/40',
  prefix: 'text-white/60 border-white/20',
  button: 'bg-[#C6F432] text-black font-bold hover:bg-[#B7E725]',
  error: 'text-red-300',
  success: 'bg-white/10 text-[#C6F432]',
};

export default function FifteenMinuteConcept() {
  return (
    <main className="min-h-screen bg-[#0B0F14] text-white selection:bg-[#C6F432] selection:text-black">
      {/* Top Ticker */}
      <div className="bg-[#141A23] border-b border-white/10 py-2 px-4 text-center text-xs font-semibold text-neutral-300 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-[#C6F432] animate-pulse" />
        <span>Live Dispatch Active in <strong>Thane</strong>, <strong>Mumbai</strong> & <strong>Navi Mumbai</strong></span>
        <span className="text-white/30 hidden sm:inline">|</span>
        <span className="text-[#C6F432] hidden sm:inline font-bold">15-Min Guaranteed SLA</span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F14]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2.5">
            <span 
              className="flex h-9 w-9 items-center justify-center rounded-xl font-display text-sm font-black text-black"
              style={{ backgroundColor: LIME }}
            >
              15
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-extrabold tracking-tight leading-none text-white">HOMEFIX</span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#C6F432] mt-0.5">Express 15m</span>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-neutral-300 md:flex">
            <a href="#speed" className="hover:text-[#C6F432] transition">Speed Guarantee</a>
            <a href="#services" className="hover:text-[#C6F432] transition">Services</a>
            <a href="#how-it-works" className="hover:text-[#C6F432] transition">How It Works</a>
            <a href="#coverage" className="hover:text-[#C6F432] transition">Coverage</a>
          </nav>

          <a 
            href="#dispatch"
            className="rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider text-black transition active:scale-95"
            style={{ backgroundColor: LIME }}
          >
            Get App Link
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="dispatch" className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 relative z-10">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 mb-6">
              <Zap size={14} className="text-[#C6F432] fill-current" />
              <span>Next-Gen Quick-Commerce Repairs</span>
              <span className="text-white/30">•</span>
              <span className="text-[#C6F432]">Starts ₹199</span>
            </div>

            <h1 className="text-4xl font-black leading-[1.08] sm:text-5xl lg:text-6xl tracking-tight">
              Home repairs,
              <br />
              dispatched in{' '}
              <span 
                className="px-2 py-0.5 rounded-lg text-black font-mono inline-block transform -rotate-1 shadow-lg"
                style={{ backgroundColor: LIME }}
              >
                15:00
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base sm:text-lg text-neutral-400 leading-relaxed">
              Burst pipes, electrical short-circuits, and jammed locks don&apos;t wait for tomorrow. Auto-matched nearest verified technician dispatched in under 15 minutes.
            </p>

            <div className="mt-8 max-w-xl">
              <WaitlistForm theme={limeForm} buttonLabel="Dispatch Pro" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5 text-neutral-200">
                <Check size={16} className="text-[#C6F432]" /> Standard Fixed Rates
              </span>
              <span className="flex items-center gap-1.5 text-neutral-200">
                <Check size={16} className="text-[#C6F432]" /> Police Verified Badge
              </span>
              <span className="flex items-center gap-1.5 text-neutral-200">
                <Check size={16} className="text-[#C6F432]" /> 30-Day Free Revisit
              </span>
            </div>
          </div>

          {/* Right Hero Column: Visual Speed Radar Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl bg-[#141A23] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2">
                  <Radio size={16} className="text-[#C6F432] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">Live SLA Monitor</span>
                </div>
                <span className="text-xs font-mono font-bold bg-[#C6F432]/10 text-[#C6F432] border border-[#C6F432]/30 px-2 py-0.5 rounded-full">
                  Target: &lt; 15 Mins
                </span>
              </div>

              {/* Countdown Dial Visual */}
              <div className="py-6 text-center">
                <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-dashed border-[#C6F432]/60 p-4 relative mb-4">
                  <Gauge size={28} className="text-[#C6F432] mb-1" />
                  <span className="font-mono text-3xl font-black tracking-tight text-white">15:00</span>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Max Dispatch</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left mt-2">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-[10px] uppercase font-bold text-neutral-400">Local Handyman</p>
                    <p className="text-sm font-bold text-rose-400 mt-0.5">2 - 5 Hours</p>
                    <p className="text-[10px] text-neutral-500">Uncertain rates & no warranty</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#C6F432]/10 border border-[#C6F432]/30">
                    <p className="text-[10px] uppercase font-bold text-[#C6F432]">HomeFix Express</p>
                    <p className="text-sm font-black text-white mt-0.5">&lt; 15 Minutes</p>
                    <p className="text-[10px] text-[#C6F432]/80">Fixed ₹199 base inspection</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span>Coverage Zone</span>
                <span className="text-white font-semibold">Thane • Mumbai • Navi Mumbai</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Grid with Fast Dispatch Tags */}
      <section id="services" className="py-20 border-t border-white/10 bg-[#0F141C]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#C6F432]">Instant Booking Menu</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">What needs rapid repair?</h2>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm">
              All services backed by fixed rates and guaranteed certified professionals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {SERVICES.map(({ name, price, icon: Icon, group }) => (
              <a 
                key={name}
                href="#dispatch"
                className="group p-4 rounded-2xl bg-[#141A23] border border-white/5 hover:border-[#C6F432]/40 transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#C6F432] group-hover:bg-[#C6F432] group-hover:text-black transition-colors mb-3">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-0.5">{group}</span>
                  <h3 className="font-bold text-sm text-white group-hover:text-[#C6F432] transition-colors">{name}</h3>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-neutral-200">₹{price}</span>
                  <span className="text-[10px] font-bold text-[#C6F432] flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Book <ChevronRight size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section id="how-it-works" className="py-20 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6F432]">Hyperlocal Logistics</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">How HomeFix beats standard handymen</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#141A23] border border-white/10 relative">
                <span className="text-4xl font-mono font-black text-[#C6F432]/30 mb-3 block">0{idx + 1}</span>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Highlights */}
      <section id="speed" className="py-20 border-t border-white/10 bg-[#0F141C]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C6F432]">Zero Compromises</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Built on Speed & Safety</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROMISES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-[#141A23] border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#C6F432]/10 border border-[#C6F432]/20 flex items-center justify-center text-[#C6F432] shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white mb-0.5">{p.title}</h3>
                    <p className="text-xs text-neutral-400">{p.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverage Areas */}
      <section id="coverage" className="py-16 border-t border-white/10 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h3 className="text-lg font-bold text-white mb-3">Serving the Mumbai Metropolitan Region</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {AREAS.map((a) => (
              <span key={a} className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300">
                {a}
              </span>
            ))}
          </div>
          <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#141A23] border border-white/10">
            <h4 className="font-bold text-white text-base mb-1">Get early access at launch</h4>
            <p className="text-xs text-neutral-400 mb-4">Be the first to receive instant repairs in your neighborhood.</p>
            <WaitlistForm theme={darkCardForm} buttonLabel="Join Waitlist" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-center text-xs text-neutral-500">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} HomeFix Technologies Pvt. Ltd. Concept 3: 15:00 Express Edition.</p>
        </div>
      </footer>
    </main>
  );
}
