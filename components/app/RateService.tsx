'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { submitReview } from '@/app/actions/customerActions';

const LABELS = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Excellent'];

function StarButton({ filled, onClick, label, size = 40 }: { filled: boolean; onClick?: () => void; label: string; size?: number }) {
  const star = (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={`transition ${filled ? 'text-brand drop-shadow-sm' : 'text-neutral-200'}`}>
      <path fill="currentColor" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5z" />
    </svg>
  );
  if (!onClick) return star;
  return (
    <button type="button" onClick={onClick} aria-label={label} className="rounded-full p-0.5 transition active:scale-90">
      {star}
    </button>
  );
}

/** After a completed job: 1–5 stars and an optional comment, shown on the home page as "First L.". */
export default function RateService({
  bookingId,
  publicName,
  existing,
}: {
  bookingId: string;
  publicName: string;
  existing: { rating: number; comment: string | null } | null;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ rating: number; comment: string | null } | null>(existing);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError('Tap a star to rate your service.');
      return;
    }
    setSaving(true);
    setError('');
    const res = await submitReview(bookingId, { rating, comment });
    setSaving(false);
    if (res.ok) setDone({ rating, comment: comment.trim() || null });
    else setError(res.error);
  }

  if (done) {
    return (
      <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 sm:p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-neutral-900">
          <CheckCircle2 size={18} className="text-brand-600" /> Thanks for your review
        </p>
        <div className="mt-3 flex gap-0.5" aria-label={`You rated ${done.rating} out of 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <StarButton key={n} filled={n <= done.rating} label={`${n} stars`} size={22} />
          ))}
        </div>
        {done.comment && <p className="mt-2 text-sm text-neutral-600">{done.comment}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 sm:p-6">
      <h2 className="font-display text-xl font-extrabold text-neutral-900">Rate your service</h2>
      <p className="mt-1 text-sm text-neutral-600">How was your professional? Your review helps other customers.</p>

      <div className="mt-4 flex items-center gap-1" role="radiogroup" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <StarButton key={n} filled={n <= rating} onClick={() => setRating(n)} label={`${n} star${n > 1 ? 's' : ''}: ${LABELS[n]}`} />
        ))}
        <span className="ml-2 text-sm font-semibold text-neutral-700">{LABELS[rating]}</span>
      </div>

      <label htmlFor="review-comment" className="mt-4 block text-sm font-semibold text-neutral-800">
        Tell others about it <span className="font-normal text-neutral-500">(optional)</span>
      </label>
      <textarea
        id="review-comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={400}
        rows={3}
        placeholder="e.g. Arrived on time, fixed the leak quickly and cleaned up after."
        className="mt-1.5 w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
      />
      <p className="mt-1.5 text-xs text-neutral-500">
        Shown on the HomeFix website as “{publicName}”.
      </p>

      {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
      >
        {saving && <Loader2 size={18} className="animate-spin" />} Submit review
      </button>
    </form>
  );
}
