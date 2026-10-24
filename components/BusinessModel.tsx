'use client';

import { useState } from 'react';
import { Calculator, ShieldCheck } from 'lucide-react';

export default function BusinessModel() {
  const [jobs, setJobs] = useState(500);
  const [ticket, setTicket] = useState(850);

  const monthlyRevenue = jobs * ticket * 0.18 * 30;

  return (
    <section id="business-model" className="py-24 bg-white border-t border-slate-200">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full mb-3">
            Monetization Framework
          </span>
          <h2 className="text-4xl font-extrabold font-display mb-4">Dual Revenue Engine</h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Combining high-volume transactional unit economics with high-margin recurring SaaS subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 hover:-translate-y-2 transition-transform hover:border-black hover:shadow-xl border-t-8 border-t-black">
            <span className="inline-block bg-black text-white text-xs font-bold uppercase px-3 py-1 rounded mb-4">Stream 01</span>
            <h3 className="text-2xl font-bold font-display mb-2">Transaction Commissions</h3>
            <div className="text-3xl font-extrabold mb-6">15% - 20% <span className="text-base font-medium text-slate-500 font-body">/ Completed Job</span></div>
            <p className="text-slate-600 mb-6">Automated escrow split at job completion. High-frequency daily consumer demand drives immediate positive cash flow per booking.</p>
            <ul className="space-y-3 font-semibold text-sm">
              <li className="flex items-center gap-2"><ShieldCheck className="text-emerald-600" size={18} /> Automated Split Payment</li>
              <li className="flex items-center gap-2"><ShieldCheck className="text-emerald-600" size={18} /> Dynamic Peak Pricing</li>
              <li className="flex items-center gap-2"><ShieldCheck className="text-emerald-600" size={18} /> Zero CAC on Repeat Bookings</li>
            </ul>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 hover:-translate-y-2 transition-transform hover:border-black hover:shadow-xl border-t-8 border-t-slate-600">
            <span className="inline-block bg-slate-600 text-white text-xs font-bold uppercase px-3 py-1 rounded mb-4">Stream 02</span>
            <h3 className="text-2xl font-bold font-display mb-2">Partner Subscription Tiers</h3>
            <div className="text-3xl font-extrabold mb-6">₹999 - ₹2,999 <span className="text-base font-medium text-slate-500 font-body">/ Month per Pro</span></div>
            <p className="text-slate-600 mb-6">SaaS tier for high-volume local contractors seeking priority dispatch, business intelligence analytics, and lead preferences.</p>
            <ul className="space-y-3 font-semibold text-sm">
              <li className="flex items-center gap-2"><ShieldCheck className="text-emerald-600" size={18} /> Priority Area Dispatch</li>
              <li className="flex items-center gap-2"><ShieldCheck className="text-emerald-600" size={18} /> Tool Insurance Coverage</li>
              <li className="flex items-center gap-2"><ShieldCheck className="text-emerald-600" size={18} /> Guaranteed Job Allocation</li>
            </ul>
          </div>
        </div>

        {/* Interactive Calculator */}
        <div className="bg-slate-50 border-2 border-black rounded-3xl p-10 shadow-lg">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
            <Calculator className="text-black" size={24} />
            <div>
              <h4 className="text-xl font-bold font-display">Interactive Unit Economics Estimator</h4>
              <p className="text-sm text-slate-500">See how MMR density fuels scalability</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="space-y-6">
              <div>
                <label className="flex justify-between font-bold mb-3 text-sm">
                  Daily Completed Orders (MMR)
                  <span className="text-black">{jobs.toLocaleString()}</span>
                </label>
                <input 
                  type="range" 
                  min="100" max="5000" step="100" 
                  value={jobs} 
                  onChange={(e) => setJobs(parseInt(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
              <div>
                <label className="flex justify-between font-bold mb-3 text-sm">
                  Avg. Ticket Size (₹)
                  <span className="text-black">₹{ticket.toLocaleString()}</span>
                </label>
                <input 
                  type="range" 
                  min="400" max="2500" step="50" 
                  value={ticket} 
                  onChange={(e) => setTicket(parseInt(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border-2 border-black rounded-2xl p-8 text-center shadow-md">
              <span className="text-slate-500 font-semibold text-sm uppercase tracking-wider block mb-2">Estimated Monthly Gross Revenue (18% Take Rate)</span>
              <h3 className="text-5xl font-extrabold text-emerald-600 font-display">₹{Math.round(monthlyRevenue).toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
