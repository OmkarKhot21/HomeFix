'use client';

import { useState } from 'react';
import { MapPin, Droplets, Zap, Hammer, Star, User, ShieldCheck, CreditCard, Navigation } from 'lucide-react';

const steps = [
  {
    num: '01',
    title: 'Select your repair issue',
    desc: 'Pick from plumbing, electrical, or carpentry with clear pre-set pricing and zero bargaining.',
    icon: Navigation,
  },
  {
    num: '02',
    title: 'Instant GPS dispatch',
    desc: 'Our spatial routing pairs your request with the closest police-verified technician in your neighborhood.',
    icon: ShieldCheck,
  },
  {
    num: '03',
    title: 'Inspect & pay securely',
    desc: 'Pay via UPI, card, or cash only after the work is done. All repairs backed by a 30-day warranty.',
    icon: CreditCard,
  },
];

export default function PhoneMockup() {
  const [activeService, setActiveService] = useState('plumber');
  const [bookingState, setBookingState] = useState<'idle' | 'routing' | 'dispatched'>('idle');

  const handleBook = () => {
    setBookingState('routing');
    setTimeout(() => {
      setBookingState('dispatched');
      setTimeout(() => {
        setBookingState('idle');
      }, 3500);
    }, 1400);
  };

  return (
    <section id="how-it-works" className="py-14 sm:py-16 bg-transparent border-t border-slate-200/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Numbered timeline steps */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-xs font-semibold text-slate-700 mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
              Simple Booking Flow
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3 text-slate-900 tracking-tight">
              Book a verified pro in 3 simple taps
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-lg leading-relaxed">
              No endless phone calls, no bargaining with unverified workers. Just select your issue, watch your pro arrive, and inspect the repair.
            </p>
            
            {/* Timeline Steps */}
            <div className="space-y-4 max-w-xl">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={idx}
                    className="flex gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 hover:border-slate-300 hover:bg-white transition-all duration-200 group"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-bold text-xs shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        {step.num}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-[310px] sm:w-[330px] h-[600px] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] relative transition-transform hover:scale-[1.01] duration-300">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-20"></div>
              
              {/* Screen */}
              <div className="w-full h-full bg-slate-900 rounded-[34px] overflow-hidden text-white flex flex-col pt-9 px-4 pb-4 relative">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-md bg-white text-black font-extrabold text-[10px] flex items-center justify-center font-display">HF</span>
                    <span className="font-display font-bold text-xs tracking-tight">HOMEFIX</span>
                  </div>
                  <span className="flex items-center gap-1 text-[9px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full text-slate-300 font-medium">
                    <MapPin size={9} className="text-emerald-400" /> Thane West, 400601
                  </span>
                </div>

                {/* Question */}
                <h3 className="text-lg font-bold mb-1 font-display tracking-tight">Need urgent repair?</h3>
                <p className="text-[11px] text-slate-400 mb-3.5">Select category to view nearby technicians:</p>
                
                {/* Category toggles */}
                <div className="flex gap-1.5 mb-5">
                  <button 
                    onClick={() => setActiveService('plumber')} 
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${activeService === 'plumber' ? 'bg-white text-black shadow-sm' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-750'}`}
                  >
                    <Droplets size={12} /> Plumber
                  </button>
                  <button 
                    onClick={() => setActiveService('electrical')} 
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${activeService === 'electrical' ? 'bg-white text-black shadow-sm' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-750'}`}
                  >
                    <Zap size={12} /> Electrician
                  </button>
                  <button 
                    onClick={() => setActiveService('carpentry')} 
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${activeService === 'carpentry' ? 'bg-white text-black shadow-sm' : 'bg-slate-800/90 text-slate-300 hover:bg-slate-750'}`}
                  >
                    <Hammer size={12} /> Carpenter
                  </button>
                </div>

                {/* Nearest Tech Card */}
                <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-3.5 flex gap-3 items-center mb-auto shadow-sm">
                  <div className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center font-bold text-xs text-slate-200 shrink-0">
                    RK
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-xs text-white">Ramesh Kumar</h5>
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-900 bg-amber-400 px-1 py-0.2 rounded">
                        <Star size={9} className="fill-slate-900" /> 4.9
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Master Plumber • 340+ repairs</p>
                    <span className="inline-block text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.2 rounded font-bold mt-1">
                      Available in 8 Mins
                    </span>
                  </div>
                </div>

                {/* Interactive Simulated Action Button */}
                <button 
                  onClick={handleBook}
                  disabled={bookingState !== 'idle'}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                    bookingState === 'idle' ? 'bg-white text-black hover:bg-slate-100' :
                    bookingState === 'routing' ? 'bg-blue-600 text-white animate-pulse' :
                    'bg-emerald-600 text-white'
                  }`}
                >
                  {bookingState === 'idle' ? 'Tap To Dispatch Technician' :
                   bookingState === 'routing' ? 'Finding Nearest Technician...' :
                   'Technician Dispatched! (ETA 8m)'}
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
