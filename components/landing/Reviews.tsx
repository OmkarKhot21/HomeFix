import { Droplets, Zap } from 'lucide-react';
import { REVIEWS, REVIEWS_ARE_SAMPLES, type Review } from '@/lib/reviews';

// Customer reviews: frosted-glass cards drifting slowly right-to-left in a seamless loop.
// The list is rendered twice and the track slides by exactly half its width, so the loop has no jump.

function Stars({ rating, showNumber = true }: { rating: number; showNumber?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${rating} out of 5 stars`}>
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" className={i < rating ? 'text-brand' : 'text-white/20'}>
            <path
              fill="currentColor"
              d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5z"
            />
          </svg>
        ))}
      </span>
      {showNumber && <span className="text-xs font-bold tabular-nums text-white">{rating.toFixed(1)}</span>}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

function ReviewCard({ r, hidden }: { r: Review; hidden?: boolean }) {
  const Icon = r.service === 'Plumbing' ? Droplets : Zap;
  return (
    <figure className="hf-review-card mr-5 flex h-[256px] w-[300px] shrink-0 flex-col rounded-3xl p-6 sm:w-[340px]" aria-hidden={hidden || undefined}>
      <div className="flex items-center justify-between gap-3">
        <Stars rating={r.rating} />
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/15">
          <Icon size={12} className="text-brand" /> {r.service}
        </span>
      </div>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-white/85">{r.text}</blockquote>
      <figcaption className="mt-4 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-600 text-[10px] font-extrabold text-ink">
          {initials(r.name)}
        </span>
        <span className="text-xs font-semibold text-white/70">{r.name}</span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  // Only real reviews go on the site: while the list holds placeholder examples, the section stays hidden.
  if (REVIEWS_ARE_SAMPLES) return null;
  const avg = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="relative overflow-hidden bg-ink py-20 text-white">
      {/* Soft glows behind the glass */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
        <span className="absolute left-1/3 bottom-0 h-64 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <span className="absolute -right-20 top-1/4 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Reviews</p>
            <h2 id="reviews-heading" className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              What customers say
            </h2>
          </div>
          <div className="hf-review-card flex items-center gap-3 rounded-2xl px-5 py-3">
            <span className="font-display text-3xl font-extrabold">{avg.toFixed(1)}</span>
            <span className="flex flex-col gap-1">
              <Stars rating={Math.round(avg)} showNumber={false} />
              <span className="text-[11px] text-white/60">{REVIEWS.length} reviews</span>
            </span>
          </div>
        </div>
      </div>

      {/* Drifting row; fades out at both edges */}
      <div className="hf-reviews-viewport relative mt-10">
        <div className="hf-reviews-track flex w-max">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} r={r} />
          ))}
          {REVIEWS.map((r) => (
            <ReviewCard key={`${r.name}-copy`} r={r} hidden />
          ))}
        </div>
      </div>
    </section>
  );
}
