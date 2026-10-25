'use client';

import { Check } from 'lucide-react';
import Image from 'next/image';

const bannerFeatures = [
  'Live GPS technician tracking',
  'Verified upfront price estimates',
  'Instant cashless UPI/Card checkout',
  '7-Day service workmanship warranty',
];

export default function AppDownloadBanner() {
  return (
    <section id="instagram-community" className="py-20 bg-neutral-950 text-white relative overflow-hidden border-t border-neutral-800">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] backdrop-blur-sm">
          
          {/* Left Column: Slogan & App Badges */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-display font-extrabold text-base shadow-sm">
                HF
              </div>
              <div>
                <h3 className="text-xl font-bold font-display tracking-tight text-white">HOMEFIX</h3>
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">
                  Fixing Homes, Improving Lives
                </p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight leading-snug mb-3 text-white">
              Get home repairs in your pocket
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 mb-6 max-w-lg leading-relaxed">
              Download the HomeFix app on iOS & Android to get emergency technicians dispatched in under 15 minutes, or scan the QR code to follow our journey on Instagram.
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-medium text-neutral-300">
              {bannerFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check size={15} className="text-brand shrink-0" /> {feat}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Instagram QR Code Container */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800 shadow-xl flex flex-col items-center text-center max-w-xs w-full">
              
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
              <p className="text-[11px] text-neutral-400">
                Point your phone camera to follow HomeFix on Instagram.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
