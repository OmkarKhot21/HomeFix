'use client';

import { useState } from 'react';
import { ShieldCheck, Zap, PhoneCall, CheckCircle2, Sparkles } from 'lucide-react';
import { captureCallback } from '@/app/actions/captureLead';

export default function Hero() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGetLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setStatus('error');
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    formData.set('phone', phone);
    
    try {
      const res = await captureCallback(formData);
      if ('success' in res && res.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage('error' in res && res.error ? res.error : 'Please enter a valid 10-digit mobile number.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section className="relative overflow-hidden py-14 lg:py-20 bg-transparent border-b border-slate-200/60">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.18] mb-3 text-center">
            Home repairs,{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-slate-950 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                solved in 15 minutes.
              </span>
              <span className="absolute left-0 bottom-1 w-full h-2.5 bg-slate-200/70 -rotate-1 -z-0 rounded"></span>
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg font-semibold text-slate-700 font-display mb-3 text-center">
            Fixing Homes, Improving Lives.
          </p>

          <p className="text-sm sm:text-base text-slate-600 mb-7 max-w-xl leading-relaxed text-center">
            On-demand verified plumbers, electricians, and carpenters. Track technician arrival live, pay pre-set standard prices, and enjoy a 30-day workmanship guarantee.
          </p>

          {/* Request a callback form */}
          <p className="text-sm font-semibold text-slate-800 mb-2">Request a callback from our team</p>
          <div id="get-app" className="scroll-mt-28 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-300/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-slate-400 focus-within:border-black focus-within:ring-4 focus-within:ring-slate-100 transition-all max-w-lg w-full mb-4 text-left">
            {status === 'success' ? (
              <div className="flex items-center gap-3 p-3 text-emerald-800 bg-emerald-50/80 rounded-xl font-semibold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Thanks! Our team will call you back shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleGetLink} className="flex flex-col sm:flex-row gap-2 relative">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] opacity-0 pointer-events-none"
                />
                <div className="flex items-center px-3.5 py-2.5 bg-slate-50/80 rounded-xl border border-slate-200/80 flex-1">
                  <span className="text-xs font-bold text-slate-500 mr-2.5 border-r border-slate-300 pr-2.5">+91</span>
                  <input 
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (status === 'error' || errorMessage) {
                        setStatus('idle');
                        setErrorMessage('');
                      }
                    }}
                    placeholder="Your mobile number"
                    aria-label="Your mobile number"
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
                  <PhoneCall size={14} />
                  {status === 'loading' ? 'Sending...' : 'Request Callback'}
                </button>
              </form>
            )}
          </div>

          {status === 'error' && errorMessage && (
            <p className="text-xs font-semibold text-red-600 mb-4 -mt-2 text-center">
              {errorMessage}
            </p>
          )}

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-5 text-xs font-semibold text-slate-600 mt-4">
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
      </div>
    </section>
  );
}
