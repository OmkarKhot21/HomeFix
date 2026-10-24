import { MapPin, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-slate-100 py-16 border-t border-slate-800">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16 pb-16 border-b border-slate-800">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-display font-black text-lg">
                HF
              </div>
              <div>
                <span className="font-display text-2xl font-black text-white tracking-tight leading-none block">
                  HOMEFIX
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                  Fixing Homes, Improving Lives
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Mumbai Metropolitan Region&apos;s on-demand home maintenance network. Certified, police-verified technicians at your doorstep in under 15 minutes.
            </p>

            <div id="coverage" className="flex items-center gap-2 text-sm text-slate-300">
              <MapPin size={16} className="text-emerald-400 shrink-0" />
              <span>Coverage: <strong>Thane • Mumbai • Navi Mumbai</strong></span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-5">Services</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li><a href="#services" className="hover:text-white transition-colors">Emergency Plumbing</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Electrical Repairs</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Carpentry & Assembly</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Appliance Installation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-5">Download</h4>
            <ul className="space-y-3 text-sm text-slate-400 font-medium">
              <li><a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Google Play Store</a></li>
              <li><a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Apple App Store</a></li>
              <li><a href="#instagram-community" className="hover:text-white transition-colors">Instagram Community</a></li>
              <li><Link href="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors text-xs">Admin Console ↗</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-300 mb-5">Trust & Safety</h4>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2 font-bold text-white">
                <ShieldCheck size={16} className="text-emerald-400" /> Police Verified
              </div>
              <p className="text-slate-400 leading-relaxed">
                All personnel carry verified ID badges and background clearance checks.
              </p>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HomeFix Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-slate-500 font-medium">Fixing Homes, Improving Lives.</p>
        </div>
      </div>
    </footer>
  );
}
