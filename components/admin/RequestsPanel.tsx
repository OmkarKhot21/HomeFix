import { getRecentBookings, getRecentPartners, getRecentCallbacks } from '@/lib/db';

// Server-rendered lists of booking requests, partner applications and callback
// requests for the admin dashboard. Shows a setup hint if the tables don't exist yet.

function formatIST(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
}

export default async function RequestsPanel() {
  let data;
  try {
    const [bookings, partners, callbacks] = await Promise.all([
      getRecentBookings(),
      getRecentPartners(),
      getRecentCallbacks(),
    ]);
    data = { bookings, partners, callbacks };
  } catch (err) {
    console.error('[ADMIN] Could not load requests:', err);
    return (
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border border-amber-700/50 bg-amber-950/30 p-5 text-sm text-amber-100">
          Booking, partner and callback tables are not set up yet. Run <code>db/migrations/002_app_flow.sql</code> in
          the Neon SQL editor, then refresh this page.
        </div>
      </section>
    );
  }

  const card = 'rounded-2xl border border-zinc-800 bg-zinc-950 p-5';
  const th = 'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500';
  const td = 'px-3 py-2.5 align-top text-sm text-zinc-200';

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-6 pb-16 text-white">
      <div className={card}>
        <h2 className="text-lg font-bold">Booking requests <span className="text-zinc-500">({data.bookings.length})</span></h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead><tr><th className={th}>#</th><th className={th}>Service</th><th className={th}>Customer</th><th className={th}>Phone</th><th className={th}>Address</th><th className={th}>When</th><th className={th}>Notes</th><th className={th}>Received</th></tr></thead>
            <tbody className="divide-y divide-zinc-800">
              {data.bookings.length === 0 && <tr><td className={td} colSpan={8}>No booking requests yet.</td></tr>}
              {data.bookings.map((b) => (
                <tr key={b.id}>
                  <td className={td}>{b.id}</td>
                  <td className={td}>{b.service}</td>
                  <td className={td}>{b.customer_name || b.customer_email || '—'}</td>
                  <td className={td}><a href={`tel:+91${b.contact_phone}`} className="underline">{b.contact_phone}</a></td>
                  <td className={`${td} max-w-xs whitespace-pre-line`}>{b.address}</td>
                  <td className={td}>{b.preferred_date}<br /><span className="text-zinc-500">{b.preferred_slot}</span></td>
                  <td className={`${td} max-w-xs`}>{b.notes || '—'}</td>
                  <td className={td}>{formatIST(b.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={card}>
          <h2 className="text-lg font-bold">Partner applications <span className="text-zinc-500">({data.partners.length})</span></h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead><tr><th className={th}>Name</th><th className={th}>Trade</th><th className={th}>Phone</th><th className={th}>Area</th><th className={th}>Exp.</th><th className={th}>Received</th></tr></thead>
              <tbody className="divide-y divide-zinc-800">
                {data.partners.length === 0 && <tr><td className={td} colSpan={6}>No applications yet.</td></tr>}
                {data.partners.map((p) => (
                  <tr key={p.id}>
                    <td className={td}>{p.name}</td>
                    <td className={`${td} capitalize`}>{p.trade}</td>
                    <td className={td}><a href={`tel:+91${p.phone}`} className="underline">{p.phone}</a></td>
                    <td className={td}>{p.area}</td>
                    <td className={td}>{p.experience_years} yrs</td>
                    <td className={td}>{formatIST(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={card}>
          <h2 className="text-lg font-bold">Callback requests <span className="text-zinc-500">({data.callbacks.length})</span></h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[320px]">
              <thead><tr><th className={th}>Phone</th><th className={th}>Received</th></tr></thead>
              <tbody className="divide-y divide-zinc-800">
                {data.callbacks.length === 0 && <tr><td className={td} colSpan={2}>No callback requests yet.</td></tr>}
                {data.callbacks.map((c) => (
                  <tr key={c.id}>
                    <td className={td}><a href={`tel:+91${c.phone}`} className="underline">{c.phone}</a></td>
                    <td className={td}>{formatIST(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
