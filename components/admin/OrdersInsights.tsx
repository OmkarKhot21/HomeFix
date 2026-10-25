'use client';

import { useMemo, useState } from 'react';
import type { OrderStats } from '@/lib/liveDb';

// Admin charts: orders booked vs completed per day, and how customers paid.
// Colours validated for the dark admin surface (#09090b) with the dataviz palette checker:
// booked = blue #3987e5, completed = yellow #c98500 (CVD ΔE 27.4, contrast ≥ 3:1).
const SERIES = {
  booked: { label: 'Booked', color: '#3987e5' },
  completed: { label: 'Completed', color: '#c98500' },
} as const;
const PAY_LABEL: Record<string, string> = { upi: 'UPI', cash: 'Cash', card: 'Card', unknown: 'Not recorded' };

function dayLabel(date: string, short = true) {
  const d = new Date(`${date}T00:00:00+05:30`);
  return d.toLocaleDateString('en-IN', short ? { day: 'numeric', month: 'short' } : { weekday: 'short', day: 'numeric', month: 'short' });
}

function niceMax(n: number) {
  if (n <= 4) return 4;
  const pow = Math.pow(10, Math.floor(Math.log10(n)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => n / s <= 4) ?? 10 * pow;
  return Math.ceil(n / step) * step;
}

function OrdersPerDay({ daily }: { daily: OrderStats['daily'] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [asTable, setAsTable] = useState(false);
  const totals = useMemo(
    () => daily.reduce((t, d) => ({ booked: t.booked + d.booked, completed: t.completed + d.completed }), { booked: 0, completed: 0 }),
    [daily]
  );

  const W = 720;
  const H = 240;
  const pad = { top: 16, right: 8, bottom: 28, left: 32 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const max = niceMax(Math.max(1, ...daily.map((d) => Math.max(d.booked, d.completed))));
  const ticks = [0, max / 2, max];
  const group = innerW / daily.length;
  const barW = Math.max(4, Math.min(14, (group - 10) / 2));
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  // Rounded top (4px), square bottom anchored to the baseline.
  const bar = (x: number, v: number, color: string) => {
    if (v <= 0) return null;
    const top = y(v);
    const h = pad.top + innerH - top;
    const r = Math.min(4, barW / 2, h);
    const d = `M${x},${top + h} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${top + h} Z`;
    return <path d={d} fill={color} />;
  };

  const h = hover !== null ? daily[hover] : null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-zinc-100">Orders per day</h3>
          <p className="text-xs text-zinc-400">Last {daily.length} days, India time</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-300">
          {(['booked', 'completed'] as const).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: SERIES[k].color }} aria-hidden="true" />
              {SERIES[k].label} <span className="font-semibold text-zinc-100">{totals[k]}</span>
            </span>
          ))}
          <button type="button" onClick={() => setAsTable((v) => !v)} className="rounded-md border border-zinc-700 px-2 py-1 text-zinc-300 hover:border-zinc-500">
            {asTable ? 'View chart' : 'View as table'}
          </button>
        </div>
      </div>

      {asTable ? (
        <div className="mt-4 max-h-64 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500">
                <th className="py-1.5 pr-4 font-semibold">Day</th>
                <th className="py-1.5 pr-4 font-semibold">Booked</th>
                <th className="py-1.5 font-semibold">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-200">
              {[...daily].reverse().map((d) => (
                <tr key={d.date}>
                  <td className="py-1.5 pr-4">{dayLabel(d.date, false)}</td>
                  <td className="py-1.5 pr-4 tabular-nums">{d.booked}</td>
                  <td className="py-1.5 tabular-nums">{d.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative mt-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Orders per day: ${totals.booked} booked and ${totals.completed} completed in the last ${daily.length} days`}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="#27272a" strokeWidth={1} />
                <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#71717a">
                  {Number.isInteger(t) ? t : t.toFixed(1)}
                </text>
              </g>
            ))}
            {daily.map((d, i) => {
              const cx = pad.left + group * i + group / 2;
              const x1 = cx - barW - 1; // 2px gap between the pair
              const x2 = cx + 1;
              return (
                <g key={d.date}>
                  {hover === i && <rect x={pad.left + group * i} y={pad.top} width={group} height={innerH} fill="#ffffff" opacity={0.04} />}
                  {bar(x1, d.booked, SERIES.booked.color)}
                  {bar(x2, d.completed, SERIES.completed.color)}
                  {(i % 2 === daily.length % 2 || daily.length <= 7) && (
                    <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill="#71717a">
                      {dayLabel(d.date)}
                    </text>
                  )}
                  {/* Hit target: the whole day column */}
                  <rect
                    x={pad.left + group * i}
                    y={pad.top}
                    width={group}
                    height={innerH}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  />
                </g>
              );
            })}
            <line x1={pad.left} x2={W - pad.right} y1={pad.top + innerH} y2={pad.top + innerH} stroke="#3f3f46" strokeWidth={1} />
          </svg>
          {h && hover !== null && (
            <div
              className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs shadow-xl"
              style={{ left: `${((pad.left + group * hover + group / 2) / W) * 100}%` }}
            >
              <p className="font-semibold text-zinc-100">{dayLabel(h.date, false)}</p>
              {(['booked', 'completed'] as const).map((k) => (
                <p key={k} className="mt-0.5 flex items-center gap-1.5 text-zinc-300">
                  <span className="h-2 w-2 rounded-sm" style={{ background: SERIES[k].color }} aria-hidden="true" />
                  {SERIES[k].label}: <span className="font-semibold text-zinc-100">{h[k]}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PaymentSplit({ payments }: { payments: OrderStats['payments'] }) {
  const total = payments.reduce((s, p) => s + p.amount, 0);
  const max = Math.max(1, ...payments.map((p) => p.amount));
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <h3 className="text-base font-bold text-zinc-100">How customers paid</h3>
      <p className="text-xs text-zinc-400">Completed jobs, all time · ₹{total.toLocaleString('en-IN')} total</p>
      {payments.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-400">No completed jobs yet.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {payments.map((p) => {
            const share = total > 0 ? Math.round((p.amount / total) * 100) : 0;
            return (
              <li key={p.method} title={`${PAY_LABEL[p.method]}: ₹${p.amount.toLocaleString('en-IN')} from ${p.jobs} jobs`}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold text-zinc-100">{PAY_LABEL[p.method]}</span>
                  <span className="tabular-nums text-zinc-300">
                    ₹{p.amount.toLocaleString('en-IN')} <span className="text-zinc-500">· {share}% · {p.jobs} {p.jobs === 1 ? 'job' : 'jobs'}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full rounded-full bg-zinc-800">
                  <div className="h-2.5 rounded-full" style={{ width: `${Math.max(2, (p.amount / max) * 100)}%`, background: SERIES.completed.color }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function OrdersInsights({ stats }: { stats: OrderStats }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <OrdersPerDay daily={stats.daily} />
      <PaymentSplit payments={stats.payments} />
    </div>
  );
}
