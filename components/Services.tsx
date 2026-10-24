'use client';

import { Droplets, Zap, Hammer, Check, ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Plumbing Services',
    icon: Droplets,
    price: '₹199',
    description: 'Emergency leak detection, pipeline relining, blocked drains, tap replacements, and washroom fittings.',
    tags: ['Leaking Taps', 'Blocked Drains', 'Pipe Fitting', 'Flush & Tank'],
    features: ['Standardized parts catalog', 'Zero-mess cleanup guaranteed'],
  },
  {
    title: 'Electrical Repairs',
    icon: Zap,
    price: '₹199',
    description: 'Short circuits, MCB trip troubleshooting, switchboard replacements, ceiling fan fixes, and smart switches.',
    tags: ['Short Circuit', 'MCB Trips', 'Fans & Lights', 'Switchboards'],
    features: ['Safety certified insulators', 'Complete load safety audit'],
  },
  {
    title: 'Carpentry & Assembly',
    icon: Hammer,
    price: '₹249',
    description: 'Furniture assembly, door lock & latch replacement, hinge restoration, drawer repair, and drilling/mounting.',
    tags: ['Door Locks', 'Furniture Assembly', 'Hinges & Latches', 'Drilling'],
    features: ['Industrial grade power tools', 'Transparent hardware pricing'],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-14 sm:py-16 bg-transparent border-b border-slate-200/60 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-xs font-semibold text-slate-700 mb-3 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            Instant Booking Categories
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3 text-slate-900 tracking-tight">
            What can we fix for you today?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed">
            Verified technicians dispatched in Thane, Mumbai, and Navi Mumbai within 15 minutes of your booking.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-3xl p-7 hover:border-slate-400/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Icon & Starting Price */}
                  <div className="flex justify-between items-center mb-5">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-bold bg-slate-100/80 border border-slate-200 px-2.5 py-1 rounded-full text-slate-800">
                      Starts at {service.price}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold font-display mb-2 text-slate-900">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 mb-4 text-xs sm:text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Problem Tags (Subtle interesting detail) */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {service.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200/70 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Feature Checkmarks */}
                  <ul className="space-y-2 font-medium text-xs text-slate-600 mb-6 border-t border-slate-100 pt-4">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <Check size={14} className="text-slate-900 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Button */}
                <button 
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('get-app');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      const input = el.querySelector<HTMLInputElement>('input[name="phone"]');
                      if (input) {
                        setTimeout(() => input.focus(), 400);
                      }
                    }
                  }}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-900 hover:text-white font-bold text-xs uppercase tracking-wider text-slate-800 border border-slate-200/80 hover:border-slate-900 transition-all duration-200"
                >
                  Book in App <ArrowRight size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
