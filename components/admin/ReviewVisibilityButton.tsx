'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { updateReviewVisibility } from '@/app/actions/adminActions';

/** Hide a review from the home page (spam, abuse, personal details) or show it again. */
export default function ReviewVisibilityButton({ id, hidden }: { id: string; hidden: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!hidden && !window.confirm('Hide this review from the website?')) return;
          setError('');
          startTransition(async () => {
            const res = await updateReviewVisibility(id, !hidden);
            if (!res.ok) setError(res.error ?? 'Failed');
          });
        }}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
          hidden ? 'bg-brand text-black hover:bg-brand-600' : 'border border-zinc-700 text-zinc-300 hover:border-red-500 hover:text-red-400'
        }`}
      >
        {pending && <Loader2 size={12} className="animate-spin" />}
        {hidden ? 'Show' : 'Hide'}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
