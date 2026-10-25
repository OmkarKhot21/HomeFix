import { Droplets, Zap, Hammer } from 'lucide-react';
import { getServiceByName } from '@/lib/services';
import type { PublicReview, ReviewSummary } from '@/lib/reviewsDb';

// Real customer reviews (left after completed jobs) on frosted-glass cards.
// A single review sits still; 2 or more drift slowly right-to-left in a seamless loop on every
// screen size (the loop is rendered twice and the track slides by exactly half its width).
const DRIFT_FROM = 2;
const MIN_CARDS_PER_LOOP = 8; // 8 cards × ~360px is wider than any screen
const SECONDS_PER_CARD = 7;

function Stars({ rating, showNumber = true }: { rating: number; showNumber?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      <span className="inline-flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" className={i < Math.round(rating) ? 'text-brand' : 'text-white/20'}>
            <path fill="currentColor" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" />
          </svg>
        ))}
      </span>
      {showNumber && <span className="text-xs font-bold tabular-nums text-white">{rating.toFixed(1)}</span>}
    </span>
  );
}

function initials(name: string) {
  return name
    .replace(/\./g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

function ReviewCard({ r, hidden, drifting }: { r: PublicReview; hidden?: boolean; drifting?: boolean }) {
  const category = getServiceByName(r.service)?.category;
  const Icon = category === 'Plumbing' ? Droplets : category === 'Electrical' ? Zap : Hammer;
  return (
    <figure
      className={`hf-review-card flex min-h-[256px] w-[300px] shrink-0 flex-col rounded-3xl p-6 sm:w-[340px] ${drifting ? 'mr-5' : ''}`}
      aria-hidden={hidden || undefined}
    >
      <div className="flex items-center justify-between gap-3">
        <Stars rating={r.rating} />
        <span className="inline-flex max-w-[55%] items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80 ring-1 ring-white/15">
          <Icon size={12} className="shrink-0 text-brand" /> <span className="truncate">{r.service}</span>
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

export default function Reviews({ summary }: { summary: ReviewSummary | null }) {
  // Nothing to show until customers have left written reviews.
  if (!summary || summary.reviews.length === 0) return null;
  const { reviews, average, count } = summary;
  const drift = reviews.length >= DRIFT_FROM;
  // With only a few reviews, repeat them so one loop is wide enough to fill any screen without gaps.
  const repeats = Math.max(1, Math.ceil(MIN_CARDS_PER_LOOP / reviews.length));
  const loop = Array.from({ length: repeats }, (_, k) => reviews.map((r) => ({ r, key: `${r.id}-${k}`, copy: k > 0 }))).flat();
  // Keep the same reading speed whatever the number of cards (about 7 s per card).
  const duration = `${loop.length * SECONDS_PER_CARD}s`;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="relative overflow-hidden bg-ink py-20 text-white">
      {/* Soft glows behind the glass */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/30 blur-3xl" />
        <span className="absolute bottom-0 left-1/3 h-64 w-96 rounded-full bg-brand-600/20 blur-3xl" />
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
            <span className="font-display text-3xl font-extrabold">{average.toFixed(1)}</span>
            <span className="flex flex-col gap-1">
              <Stars rating={average} showNumber={false} />
              <span className="text-[11px] text-white/60">
                {count} {count === 1 ? 'rating' : 'ratings'}
              </span>
            </span>
          </div>
        </div>

        {!drift && (
          <div className="mt-10 flex flex-wrap justify-center gap-5 sm:justify-start">
            {reviews.map((r) => (
              <ReviewCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </div>

      {drift && (
        <div className="hf-reviews-viewport relative mt-10">
          <div className="hf-reviews-track flex w-max" style={{ animationDuration: duration }}>
            {loop.map(({ r, key, copy }) => (
              <ReviewCard key={key} r={r} hidden={copy} drifting />
            ))}
            {loop.map(({ r, key }) => (
              <ReviewCard key={`${key}-b`} r={r} hidden drifting />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
