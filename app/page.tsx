'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import KpiSection from '@/components/KpiSection';
import Services from '@/components/Services';
import PhoneMockup from '@/components/PhoneMockup';
import AppDownloadBanner from '@/components/AppDownloadBanner';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-slate-50 selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* Global Seamless Background — Flowing across the entire website */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* 3D Parametric Wave Image — Anchored right with sculpted depth */}
        <div 
          className="absolute inset-0 bg-cover bg-right opacity-35 lg:opacity-45 mix-blend-multiply scale-105"
          style={{ backgroundImage: `url('/bg-waves.jpg')` }}
        />

        {/* Lighting & Shadow Mask:
            - RIGHT: Darker, deeper shadows & rich sculptural contrast
            - LEFT: Gradually decreases in color, fading into clean light white */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-900/20 via-slate-800/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/40" />

        {/* Subtle architectural micro-grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
      </div>

      {/* Page Content Layers */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <KpiSection />
        <Services />
        <PhoneMockup />
        <AppDownloadBanner />
        <Footer />
      </div>

    </main>
  );
}
