'use client';

import { Droplets, Zap, Hammer, Check, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { getService, servicePhotoUrl, type Service } from '@/lib/services';

// Popup opened by each card's Book Now button (see lib/services.ts)
const CATEGORY_SLUGS = ['plumbing', 'electrical', 'carpentry'];

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

export default function Services({ onSelect }: { onSelect: (service: Service) => void }) {
  return (
    <section id="services" className="relative scroll-mt-20 overflow-hidden border-b border-neutral-200/60 bg-white py-20">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Our services</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              What can we fix for you today?
            </h2>
          </div>
          <p className="max-w-sm text-neutral-600">
            Verified technicians dispatched across Thane, Mumbai and Navi Mumbai within 15 minutes of booking.
          </p>
        </div>

        {/* Photo cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const meta = getService(CATEGORY_SLUGS[index]);
            return (
              <article
                key={service.title}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[0_24px_50px_-20px_rgba(10,10,10,0.35)]"
              >
                <div className="relative h-56 overflow-hidden">
                  {meta && (
                    <Image
                      src={servicePhotoUrl(meta.photoId)}
                      alt={meta.photoAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      style={{ objectPosition: meta.photoPosition ?? 'center 30%' }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="hf-glass absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl text-brand">
                    <Icon size={20} />
                  </span>
                  <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-ink shadow">
                    From {service.price}
                  </span>
                  <h3 className="absolute bottom-4 left-5 right-5 font-display text-2xl font-extrabold text-white">{service.title}</h3>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm leading-relaxed text-neutral-600">{service.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ul className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-xs font-medium text-neutral-600">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand">
                          <Check size={10} strokeWidth={3} className="text-ink" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      if (meta) onSelect(meta);
                    }}
                    className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-ink py-3.5 text-sm font-extrabold text-white transition group-hover:bg-brand group-hover:text-ink"
                  >
                    Book now <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
