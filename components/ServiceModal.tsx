'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check, Clock, ShieldCheck, LogIn, ArrowRight } from 'lucide-react';
import { servicePhotoUrl, type Service } from '@/lib/services';

// Popup shown when a visitor picks a service: a photo of a professional at work,
// what they will do, the starting price, and a pulsing "Login to book" box.
export default function ServiceModal({
  service,
  isLoggedIn,
  onClose,
}: {
  service: Service | null;
  isLoggedIn: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!service) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [service, onClose]);

  if (!service) return null;

  const bookHref = `/book?service=${service.slug}`;
  const ctaHref = isLoggedIn ? bookHref : `/login?service=${service.slug}`;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-t-3xl bg-slate-950 text-white shadow-2xl sm:rounded-3xl"
      >
        {/* Photo background */}
        <div className="relative h-72 sm:h-80">
          <Image
            src={servicePhotoUrl(service.photoId)}
            alt={service.photoAlt}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-cover"
            style={{ objectPosition: service.photoPosition ?? 'center 30%' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <ShieldCheck size={13} className="text-emerald-400" /> Verified {service.category.toLowerCase()} professional
            </span>
            <h2 id="service-modal-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight">
              {service.name}
            </h2>
            <p className="mt-1 text-sm text-white/75">{service.summary}</p>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 pb-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">What the professional will do</h3>
          <ul className="mt-3 space-y-2.5">
            {service.tasks.map((task) => (
              <li key={task} className="flex items-start gap-2.5 text-sm text-white/85">
                <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                {task}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span>
              <span className="text-white/50">Starts at </span>
              <span className="font-display text-xl font-extrabold">₹{service.price}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-white/70">
              <Clock size={15} /> {service.duration}
            </span>
          </div>
          <p className="mt-2 text-xs text-white/45">Parts, if needed, are charged separately at fixed rates. 30-day warranty on work.</p>
        </div>

        {/* Pulsing call to action in the corner */}
        <div className="pointer-events-none sticky bottom-0 flex justify-end bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent px-5 pb-5 pt-8">
        <Link
          href={ctaHref}
          className="hf-login-pulse pointer-events-auto inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-extrabold text-slate-950 transition hover:bg-slate-100"
        >
          {isLoggedIn ? (
            <>
              Book now <ArrowRight size={16} />
            </>
          ) : (
            <>
              <LogIn size={16} /> Login to book
            </>
          )}
        </Link>
        </div>
      </div>
    </div>
  );
}
