'use client';

import { useMemo, useState } from 'react';
import type { AdminBooking } from '@/lib/liveDb';

// Admin orders table: when each order was booked, accepted and completed, and how it was paid.
const STATUS_LABEL: Record<string, string> = {
  new: 'Received',
  searching: 'Finding pro',
  accepted: 'On the way',
  arrived: 'Arrived',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  expired: 'No pro found',
};
const STATUS_STYLE: Record<string, string> = {
  completed: 'bg-brand text-ink',
  cancelled: 'bg-zinc-800 text-zinc-400',
  expired: 'bg-zinc-800 text-zinc-400',
};
const PAY_LABEL: Record<string, string> = { upi: 'UPI', cash: 'Cash', card: 'Card' };
const LIVE = ['new', 'searching', 'accepted', 'arrived', 'in_progress'];

function fmt(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}

function duration(from: string, to: string | null) {
  if (!to) return null;
  const mins = Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 60000));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h < 24 ? `${h} h ${m} min` : `${Math.floor(h / 24)} d ${h % 24} h`;
}

export default function OrdersTable({ orders }: { orders: AdminBooking[] }) {
  const [status, setStatus] = useState<'all' | 'live' | 'completed' | 'closed'>('all');
  const [pay, setPay] = useState<'all' | 'cash' | 'upi' | 'card'>('all');

  const rows = useMemo(
    () =>
      orders.filter((o) => {
        if (status === 'live' && !LIVE.includes(o.status)) return false;
        if (status === 'completed' && o.status !== 'completed') return false;
        if (status === 'closed' && o.status !== 'cancelled' && o.status !== 'expired') return false;
        if (pay !== 'all' && o.paymentMethod !== pay) return false;
        return true;
      }),
    [orders, status, pay]
  );

  const th = 'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500';
  const td = 'px-3 py-2.5 align-top text-sm text-zinc-200';
  const select = 'rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-zinc-500';

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">
          Orders <span className="text-zinc-500">({rows.length}{rows.length !== orders.length ? ` of ${orders.length}` : ''})</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="orders-status">Status</label>
          <select id="orders-status" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={select}>
            <option value="all">All statuses</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="closed">Cancelled / no pro found</option>
          </select>
          <label className="sr-only" htmlFor="orders-pay">Payment</label>
          <select id="orders-pay" value={pay} onChange={(e) => setPay(e.target.value as typeof pay)} className={select}>
            <option value="all">All payments</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead>
            <tr>
              <th className={th}>#</th>
              <th className={th}>Service</th>
              <th className={th}>Customer</th>
              <th className={th}>Professional</th>
              <th className={th}>Booked</th>
              <th className={th}>Accepted</th>
              <th className={th}>Completed</th>
              <th className={th}>Status</th>
              <th className={th}>Amount</th>
              <th className={th}>Paid by</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.length === 0 && (
              <tr>
                <td className={td} colSpan={10}>No orders match these filters.</td>
              </tr>
            )}
            {rows.map((o) => {
              const took = o.status === 'completed' ? duration(o.createdAt, o.completedAt) : null;
              return (
                <tr key={o.id}>
                  <td className={`${td} tabular-nums text-zinc-400`}>{o.id}</td>
                  <td className={td}>
                    {o.service}
                    <span className="mt-0.5 block max-w-[220px] truncate text-xs text-zinc-500" title={o.address}>{o.address}</span>
                  </td>
                  <td className={td}>
                    {o.customerName || '—'}
                    {o.contactName && <span className="block text-xs text-zinc-500">Contact: {o.contactName}</span>}
                    <a href={`tel:+91${o.contactPhone}`} className="block text-xs text-zinc-400 underline">{o.contactPhone}</a>
                  </td>
                  <td className={td}>
                    {o.proName || '—'}
                    {o.proTrade && <span className="block text-xs capitalize text-zinc-500">{o.proTrade}</span>}
                  </td>
                  <td className={`${td} whitespace-nowrap`}>{fmt(o.createdAt)}</td>
                  <td className={`${td} whitespace-nowrap`}>{fmt(o.acceptedAt)}</td>
                  <td className={`${td} whitespace-nowrap`}>
                    {fmt(o.completedAt)}
                    {took && <span className="block text-xs text-zinc-500">took {took}</span>}
                  </td>
                  <td className={td}>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_STYLE[o.status] ?? 'bg-zinc-800 text-zinc-200'}`}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td className={`${td} tabular-nums`}>
                    {o.finalAmount !== null ? `₹${o.finalAmount.toLocaleString('en-IN')}` : '—'}
                    {o.commission !== null && <span className="block text-xs text-zinc-500">₹{o.commission} commission</span>}
                  </td>
                  <td className={td}>{o.paymentMethod ? PAY_LABEL[o.paymentMethod] : o.status === 'completed' ? 'Not recorded' : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
