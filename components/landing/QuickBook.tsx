'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, Plus } from 'lucide-react';
import { BOOKABLE_SERVICES, servicePhotoUrl, type Service } from '@/lib/services';

// Swipeable row of service photo cards; "Book" opens the service popup.
export default function QuickBook({ onSelect }: { onSelect: (service: Service) => void }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const row = rowRef.current;
    if (row) row.scrollBy({ left: dir * Math.min(row.clientWidth * 0.8, 640), behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="quickbook-heading" className="relative overflow-hidden bg-brand-50 py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Book in one tap</p>
            <h2 id="quickbook-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Pick a repair, we’ll handle the rest
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-white text-ink transition hover:bg-brand"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-ink text-white transition hover:bg-black"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>

      {/* Row starts aligned with the content but runs to the right edge of the screen */}
      <div
        ref={rowRef}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-6 scroll-pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
          {BOOKABLE_SERVICES.map((s) => (
            <article
              key={s.slug}
              className="group w-64 shrink-0 snap-start overflow-hidden rounded-3xl border border-neutral-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[0_20px_40px_-20px_rgba(10,10,10,0.35)] sm:w-72"
            >
              <button type="button" onClick={() => onSelect(s)} className="block w-full text-left" aria-label={`See details for ${s.name}`}>
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={servicePhotoUrl(s.photoId)}
                    alt={s.photoAlt}
                    fill
                    sizes="288px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    style={{ objectPosition: s.photoPosition ?? 'center 30%' }}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur">
                    {s.category}
                  </span>
                </div>
              </button>
              <div className="p-5">
                <h3 className="font-display text-lg font-extrabold text-ink">{s.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-sm text-neutral-600">{s.summary}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span>
                    <span className="block font-display text-lg font-extrabold text-ink">₹{s.price}</span>
                    <span className="flex items-center gap-1 text-xs text-neutral-500">
                      <Clock size={12} /> {s.duration}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelect(s)}
                    className="inline-flex items-center gap-1 rounded-xl border-2 border-ink px-3.5 py-2 text-sm font-extrabold text-ink transition hover:bg-brand"
                  >
                    <Plus size={15} strokeWidth={3} /> Book
                  </button>
                </div>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
