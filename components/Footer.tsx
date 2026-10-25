'use client';

import { MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Footer({ onOpenInvestor }: { onOpenInvestor?: () => void }) {
  return (
    <footer className="bg-black text-neutral-100 py-16 border-t border-neutral-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16 pb-16 border-b border-neutral-800">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand font-display text-lg font-black text-ink">
                HF
              </div>
              <div>
                <span className="font-display text-2xl font-black text-white tracking-tight leading-none block">
                  HOMEFIX
                </span>
                <span className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase">
                  Fixing Homes, Improving Lives
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-sm">
              Mumbai Metropolitan Region&apos;s on-demand home maintenance network. Certified, police-verified technicians at your doorstep in under 15 minutes.
            </p>

            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <MapPin size={16} className="text-brand shrink-0" />
              <span>Coverage: <strong>Thane • Mumbai • Navi Mumbai</strong></span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-neutral-300 mb-5">Services</h4>
            <ul className="space-y-3 text-sm text-neutral-400 font-medium">
              <li><a href="#services" className="hover:text-white transition-colors">Emergency Plumbing</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Electrical Repairs</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Carpentry & Assembly</a></li>
              <li><a href="#rapid-repair" className="hover:text-white transition-colors">Geyser &amp; Fan Repair</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-neutral-300 mb-5">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-400 font-medium">
              <li><Link href="/login" className="hover:text-white transition-colors">Log in / Sign up</Link></li>
              <li><a href="#partners" className="hover:text-white transition-colors">Become a partner</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              {onOpenInvestor && (
                <li>
                  <button 
                    type="button" 
                    onClick={onOpenInvestor} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Investors ↗
                  </button>
                </li>
              )}
              <li><Link href="/admin/login" className="text-neutral-500 hover:text-neutral-300 transition-colors text-xs">Admin Console ↗</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-neutral-300 mb-5">Trust & Safety</h4>
            <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl text-xs space-y-2 text-neutral-300">
              <div className="flex items-center gap-2 font-bold text-white">
                <ShieldCheck size={16} className="text-brand" /> Police Verified
              </div>
              <p className="text-neutral-400 leading-relaxed">
                All professionals carry verified ID badges and have passed background checks.
              </p>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} HomeFix Technologies Pvt. Ltd. All rights reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
          </nav>
          <p className="text-neutral-500 font-medium">Fixing Homes, Improving Lives.</p>
        </div>
      </div>
    </footer>
  );
}
