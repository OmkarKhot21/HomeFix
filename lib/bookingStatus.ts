import type { JobStatus } from './liveDb';

// How each booking status is shown to customers.
export const STATUS_META: Record<JobStatus, { label: string; tone: 'live' | 'done' | 'muted' | 'warn' }> = {
  new: { label: 'Request received', tone: 'muted' },
  searching: { label: 'Finding a professional', tone: 'live' },
  accepted: { label: 'Professional on the way', tone: 'live' },
  arrived: { label: 'Professional has arrived', tone: 'live' },
  in_progress: { label: 'Work in progress', tone: 'live' },
  completed: { label: 'Completed', tone: 'done' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
  expired: { label: 'No professional available', tone: 'warn' },
};

export const TONE_CLASSES: Record<'live' | 'done' | 'muted' | 'warn', string> = {
  live: 'bg-brand text-ink ring-1 ring-brand-600',
  done: 'bg-ink text-white ring-1 ring-ink',
  muted: 'bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200',
  warn: 'bg-white text-neutral-900 ring-1 ring-neutral-900',
};

export const LIVE_STATUSES: JobStatus[] = ['searching', 'accepted', 'arrived', 'in_progress'];

export function formatDateTimeIST(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}
