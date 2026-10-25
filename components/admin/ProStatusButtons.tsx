'use client';

import { useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { updateProfessionalStatus } from '@/app/actions/adminActions';
import type { ProStatus } from '@/lib/liveDb';

const ACTIONS: Record<ProStatus, { label: string; to: ProStatus; style: string }[]> = {
  pending: [
    { label: 'Approve', to: 'approved', style: 'bg-brand text-black hover:bg-brand-600' },
    { label: 'Reject', to: 'rejected', style: 'border border-zinc-700 text-zinc-300 hover:border-red-500 hover:text-red-400' },
  ],
  approved: [{ label: 'Suspend', to: 'suspended', style: 'border border-zinc-700 text-zinc-300 hover:border-brand hover:text-brand' }],
  suspended: [{ label: 'Reactivate', to: 'approved', style: 'bg-brand text-black hover:bg-brand-600' }],
  rejected: [{ label: 'Approve', to: 'approved', style: 'border border-zinc-700 text-zinc-300 hover:border-brand hover:text-brand' }],
};

export default function ProStatusButtons({ uid, status, name }: { uid: string; status: ProStatus; name: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  return (
    <div className="flex flex-wrap items-center gap-2">
      {ACTIONS[status].map((a) => (
        <button
          key={a.to}
          type="button"
          disabled={pending}
          onClick={() => {
            if (a.to !== 'approved' && !window.confirm(`${a.label} ${name}?`)) return;
            setError('');
            startTransition(async () => {
              const res = await updateProfessionalStatus(uid, a.to);
              if (!res.ok) setError(res.error ?? 'Failed');
            });
          }}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${a.style}`}
        >
          {a.label}
        </button>
      ))}
      {pending && <Loader2 size={14} className="animate-spin text-zinc-400" />}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
