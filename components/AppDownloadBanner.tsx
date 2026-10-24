'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';

const bannerFeatures = [
  'Live GPS technician tracking',
  'Verified upfront price estimates',
  'Instant cashless UPI/Card checkout',
  '30-Day service workmanship warranty',
];

export default function AppDownloadBanner() {
  return (
    <section id="instagram-community" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] backdrop-blur-sm">
          
          {/* Left Column: Slogan & App Badges */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-display font-extrabold text-base shadow-sm">
                HF
              </div>
              <div>
                <h3 className="text-xl font-bold font-display tracking-tight text-white">HOMEFIX</h3>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                  Fixing Homes, Improving Lives
                </p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight leading-snug mb-3 text-white">
              Get home repairs in your pocket
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-lg leading-relaxed">
              Download the HomeFix app on iOS & Android to get emergency technicians dispatched in under 15 minutes, or scan the QR code to follow our journey on Instagram.
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 text-xs sm:text-sm font-medium text-slate-300">
              {bannerFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check size={15} className="text-emerald-400 shrink-0" /> {feat}
                </div>
              ))}
            </div>

            {/* Store Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a 
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white text-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-all hover:-translate-y-0.5 shadow-md active:scale-95"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a2.38 2.38 0 0 1-.22-.303V2.117c.068-.112.143-.214.22-.303zM15.207 13.414l2.84 2.84-12.78 7.378 9.94-10.218zm2.84-5.654l-2.84 2.84-9.94-10.218 12.78 7.378zm1.414 1.414l3.18 1.837c.87.502.87 1.325 0 1.827l-3.18 1.836-2.55-2.55 2.55-2.55z" />
                </svg>
                <div className="text-left">
                  <div className="text-[8px] font-semibold text-slate-600 uppercase leading-none">GET IT ON</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
              </a>

              <a 
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-white text-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-all hover:-translate-y-0.5 shadow-md active:scale-95"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.56.65-.98 1.7-0.85 2.72 1.01.08 2.01-.52 2.56-1.22z"/>
                </svg>
                <div className="text-left">
                  <div className="text-[8px] font-semibold text-slate-600 uppercase leading-none">Download on the</div>
                  <div className="text-xs font-bold leading-tight">App Store</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Instagram QR Code Container */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center text-center max-w-xs w-full">
              
              {/* Official Instagram QR Code Container */}
              <div className="w-48 h-48 bg-white rounded-2xl p-2.5 flex items-center justify-center mb-3.5 relative overflow-hidden shadow-sm">
                <Image 
                  src="/instagram-qr.jpg" 
                  alt="Scan to follow HomeFix on Instagram" 
                  width={200}
                  height={200}
                  className="w-full h-full object-contain rounded-xl"
                  priority
                />
              </div>

              {/* Instagram CTA */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mb-1">
                <svg className="w-4 h-4 text-pink-400 fill-none stroke-current stroke-2 shrink-0" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>Scan to follow us on Instagram</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Point your phone camera to follow HomeFix on Instagram.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
