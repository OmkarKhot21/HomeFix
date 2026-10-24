'use client';

import { useState } from 'react';
import { ShieldCheck, Zap, Star, ArrowRight, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { captureWaitlist } from '@/app/actions/captureLead';

export default function Hero() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleGetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    const formData = new FormData();
    formData.append('phone', phone);
    
    try {
      const res = await captureWaitlist(formData);
      if (res.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="relative overflow-hidden py-14 lg:py-20 bg-transparent border-b border-slate-200/60">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Refined, modern copy */}
          <div className="lg:col-span-7">
            
            {/* Live Status Pill with pulsing beacon */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 border border-slate-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-6 text-slate-800 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-800">Live in Mumbai, Thane & Navi Mumbai</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Zap size={11} className="text-amber-500 fill-amber-500" /> &lt; 15m Dispatch
              </span>
            </div>

            {/* Headline with subtle depth */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.18] mb-3">
              Home repairs,{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  solved in 15 minutes.
                </span>
                <span className="absolute left-0 bottom-1 w-full h-2.5 bg-slate-200/70 -rotate-1 -z-0 rounded"></span>
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg font-semibold text-slate-700 font-display mb-3">
              Fixing Homes, Improving Lives.
            </p>

            <p className="text-sm sm:text-base text-slate-600 mb-7 max-w-lg leading-relaxed">
              On-demand verified plumbers, electricians, and carpenters. Track technician arrival live, pay pre-set standard prices, and enjoy a 30-day workmanship guarantee.
            </p>

            {/* "Get App Link via SMS" form */}
            <div id="get-app" className="scroll-mt-28 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-300/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-slate-400 focus-within:border-black focus-within:ring-4 focus-within:ring-slate-100 transition-all max-w-lg mb-4">
              {status === 'success' ? (
                <div className="flex items-center gap-3 p-3 text-emerald-800 bg-emerald-50/80 rounded-xl font-semibold text-sm">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>Download link sent! Check your SMS/WhatsApp shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleGetLink} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex items-center px-3.5 py-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex-1">
                    <span className="text-xs font-bold text-slate-500 mr-2.5 border-r border-slate-300 pr-2.5">+91</span>
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter mobile number"
                      className="bg-transparent text-sm font-medium w-full focus:outline-none text-slate-900 placeholder:text-slate-400"
                      maxLength={10}
                      disabled={status === 'loading'}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md whitespace-nowrap"
                  >
                    {status === 'loading' ? 'Sending...' : 'Get App Link'}
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>

            {status === 'error' && (
              <p className="text-xs font-semibold text-red-600 mb-4 -mt-2">
                Please enter a valid 10-digit mobile number.
              </p>
            )}

            {/* Store Download Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <a 
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm hover:shadow"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.22-.303V2.117c.068-.112.143-.214.22-.303zM15.207 13.414l2.84 2.84-12.78 7.378 9.94-10.218zm2.84-5.654l-2.84 2.84-9.94-10.218 12.78 7.378zm1.414 1.414l3.18 1.837c.87.502.87 1.325 0 1.827l-3.18 1.836-2.55-2.55 2.55-2.55z" />
                </svg>
                <div className="text-left">
                  <div className="text-[8px] font-semibold text-slate-400 uppercase leading-none">GET IT ON</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
              </a>

              <a 
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm hover:shadow"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.56.65-.98 1.7-0.85 2.72 1.01.08 2.01-.52 2.56-1.22z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[8px] font-semibold text-slate-400 uppercase leading-none">Download on the</div>
                  <div className="text-xs font-bold leading-tight">App Store</div>
                </div>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-slate-900" /> 100% Police Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={15} className="text-slate-900" /> Guaranteed &lt; 15m Dispatch
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" /> 30-Day Service Warranty
              </span>
            </div>
          </div>

          {/* Right Column: Live Dispatch Smartphone Card with subtle depth */}
          <div className="lg:col-span-5 flex justify-center relative">
            
            {/* Soft backdrop blur card */}
            <div className="w-full max-w-sm bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[32px] p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] relative hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.16)] transition-all duration-300">
              
              {/* App Status Header */}
              <div className="flex justify-between items-center pb-3.5 mb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-display font-extrabold text-xs shadow-sm">
                    HF
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 font-display leading-none">HomeFix Express</h4>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider mt-0.5">● Live Dispatch</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full text-slate-800">
                  ETA: 8 Mins
                </span>
              </div>

              {/* Map Preview Graphic with modern radar beacon */}
              <div className="w-full h-44 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-2xl relative overflow-hidden flex flex-col justify-end p-4 text-white mb-3.5 border border-slate-800 shadow-inner">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:14px_14px]"></div>
                
                {/* Animated technician beacon on map */}
                <div className="absolute top-10 left-16 flex items-center justify-center">
                  <span className="animate-ping absolute h-8 w-8 rounded-full bg-emerald-400 opacity-40"></span>
                  <span className="relative flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow-lg">
                    <Zap size={10} />
                  </span>
                </div>

                {/* Simulated route dotted line */}
                <div className="absolute top-14 left-20 w-32 h-14 border-b-2 border-r-2 border-dashed border-emerald-400/60 rounded-br-2xl pointer-events-none"></div>

                <div className="relative z-10 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <Zap size={11} /> Pro on the way (0.8 km)
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Auto-matched</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-200 flex items-center gap-1 truncate">
                    <MapPin size={11} className="text-slate-400 shrink-0" /> Thane West, Mumbai
                  </p>
                </div>
              </div>

              {/* Technician Info */}
              <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-800 shrink-0">
                  RK
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-xs text-slate-900">Ramesh Kumar</h5>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-900 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">
                      <Star size={10} className="text-amber-500 fill-amber-500" /> 4.9
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Master Plumber • 340+ verified repairs</p>
                </div>
              </div>

              {/* Booking SLA Card */}
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 px-1.5">
                <span className="text-[11px]">Standard Inspection</span>
                <span className="text-slate-900 font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-md">₹199 fixed</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
