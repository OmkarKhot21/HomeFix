import { getRecentCallbacks, getRecentInvestorMessages, type InvestorMessageRow } from '@/lib/db';
import { listBookingsForAdmin, listProfessionalsForAdmin, getPlatformTotals, getOrderStats, commissionPercent } from '@/lib/liveDb';
import ProStatusButtons from './ProStatusButtons';
import OrdersInsights from './OrdersInsights';
import OrdersTable from './OrdersTable';
import ReviewVisibilityButton from './ReviewVisibilityButton';
import { listReviewsForAdmin, type AdminReview } from '@/lib/reviewsDb';

// Server-rendered operations panel for the admin dashboard: professionals to approve,
// live and past jobs, platform earnings and callback requests.

function formatIST(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
}

const PRO_BADGE: Record<string, string> = {
  pending: 'bg-brand/15 text-brand',
  approved: 'bg-brand/15 text-brand',
  rejected: 'bg-red-500/15 text-red-300',
  suspended: 'bg-zinc-700 text-zinc-300',
};

export default async function RequestsPanel() {
  let data;
  try {
    const [bookings, pros, callbacks, totals, stats] = await Promise.all([
      listBookingsForAdmin(),
      listProfessionalsForAdmin(),
      getRecentCallbacks(),
      getPlatformTotals(),
      getOrderStats(14),
    ]);
    // Loaded separately so the panel still works before 004_investor_messages.sql is run.
    let investorMessages: InvestorMessageRow[] | null = null;
    try {
      investorMessages = await getRecentInvestorMessages();
    } catch (err) {
      console.error('[ADMIN] Could not load investor messages:', err);
    }
    // Loaded separately so the panel still works before 006_reviews.sql is run.
    let reviews: AdminReview[] | null = null;
    try {
      reviews = await listReviewsForAdmin();
    } catch (err) {
      console.error('[ADMIN] Could not load reviews:', err);
    }
    data = { bookings, pros, callbacks, totals, stats, investorMessages, reviews };
  } catch (err) {
    console.error('[ADMIN] Could not load operations data:', err);
    return (
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border border-brand/40 bg-brand/10 p-5 text-sm text-brand">
          Operations tables are not set up yet. Run <code>db/migrations/002_app_flow.sql</code> and then{' '}
          <code>db/migrations/003_live_dispatch.sql</code> in the Neon SQL editor, then refresh this page.
        </div>
      </section>
    );
  }

  const card = 'rounded-2xl border border-zinc-800 bg-zinc-950 p-5';
  const th = 'px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500';
  const td = 'px-3 py-2.5 align-top text-sm text-zinc-200';
  const pendingPros = data.pros.filter((p) => p.status === 'pending').length;
  const onlinePros = data.pros.filter((p) => p.status === 'approved' && p.isOnline).length;

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-6 pb-16 text-white">
      {/* Totals */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Completed jobs', value: data.totals.completedJobs.toLocaleString('en-IN') },
          { label: 'Gross billed', value: `₹${data.totals.gross.toLocaleString('en-IN')}` },
          { label: `HomeFix commission (${commissionPercent()}%)`, value: `₹${data.totals.commission.toLocaleString('en-IN')}` },
          { label: 'Pros online now', value: `${onlinePros}${pendingPros ? ` · ${pendingPros} awaiting approval` : ''}` },
        ].map((s) => (
          <div key={s.label} className={card}>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{s.label}</p>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Professionals */}
      <div className={card}>
        <h2 className="text-lg font-bold">Professionals <span className="text-zinc-500">({data.pros.length})</span></h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead><tr><th className={th}>Name</th><th className={th}>Trade</th><th className={th}>Phone</th><th className={th}>Area</th><th className={th}>Exp.</th><th className={th}>Status</th><th className={th}>Applied</th><th className={th}>Actions</th></tr></thead>
            <tbody className="divide-y divide-zinc-800">
              {data.pros.length === 0 && <tr><td className={td} colSpan={8}>No professionals yet.</td></tr>}
              {data.pros.map((p) => (
                <tr key={p.uid}>
                  <td className={td}>
                    {p.name}
                    {p.status === 'approved' && (
                      <span className={`ml-2 inline-block h-2 w-2 rounded-full ${p.isOnline ? 'bg-brand' : 'bg-zinc-600'}`} title={p.isOnline ? 'Online' : 'Offline'} />
                    )}
                  </td>
                  <td className={`${td} capitalize`}>{p.trade}</td>
                  <td className={td}><a href={`tel:+91${p.phone}`} className="underline">{p.phone}</a></td>
                  <td className={td}>{p.area}</td>
                  <td className={td}>{p.experienceYears} yrs</td>
                  <td className={td}><span className={`rounded-full px-2 py-0.5 text-xs font-bold capitalize ${PRO_BADGE[p.status]}`}>{p.status}</span></td>
                  <td className={td}>{formatIST(p.createdAt)}</td>
                  <td className={td}><ProStatusButtons uid={p.uid} status={p.status} name={p.name} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders: charts + table */}
      <OrdersInsights stats={data.stats} />
      <OrdersTable orders={data.bookings} />

      {/* Reviews */}
      <div className={card}>
        <h2 className="text-lg font-bold">
          Reviews {data.reviews && <span className="text-zinc-500">({data.reviews.length})</span>}
        </h2>
        {data.reviews === null ? (
          <p className="mt-3 text-sm text-zinc-400">
            Run <code>db/migrations/006_reviews.sql</code> in the Neon SQL editor to start collecting reviews.
          </p>
        ) : data.reviews.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">No reviews yet. Customers can rate a job after it is completed.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr>
                  <th className={th}>Rating</th>
                  <th className={th}>Review</th>
                  <th className={th}>Customer</th>
                  <th className={th}>Service</th>
                  <th className={th}>Professional</th>
                  <th className={th}>Date</th>
                  <th className={th}>On website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data.reviews.map((r) => (
                  <tr key={r.id} className={r.hidden ? 'opacity-50' : ''}>
                    <td className={`${td} whitespace-nowrap font-bold text-brand`}>{'★'.repeat(r.rating)}<span className="text-zinc-700">{'★'.repeat(5 - r.rating)}</span></td>
                    <td className={`${td} max-w-sm`}>{r.text || <span className="text-zinc-500">No comment</span>}</td>
                    <td className={td}>{r.name}<span className="block text-xs text-zinc-500">Job #{r.bookingId}</span></td>
                    <td className={td}>{r.service}</td>
                    <td className={td}>{r.proName || '—'}</td>
                    <td className={`${td} whitespace-nowrap`}>{formatIST(r.createdAt)}</td>
                    <td className={td}><ReviewVisibilityButton id={r.id} hidden={r.hidden} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Investor messages */}
      <div className={card}>
        <h2 className="text-lg font-bold">
          Investor messages{' '}
          {data.investorMessages && <span className="text-zinc-500">({data.investorMessages.length})</span>}
        </h2>
        {data.investorMessages === null ? (
          <p className="mt-3 text-sm text-zinc-400">
            Run <code>db/migrations/004_investor_messages.sql</code> in the Neon SQL editor to start receiving these.
          </p>
        ) : data.investorMessages.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">No messages yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-800">
            {data.investorMessages.map((m) => (
              <li key={m.id} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-zinc-100">
                    {m.name}{' '}
                    <a href={`mailto:${encodeURIComponent(m.email)}`} className="ml-1 text-sm font-normal text-brand underline">
                      {m.email}
                    </a>
                  </p>
                  <span className="text-xs text-zinc-500">{formatIST(m.created_at)}</span>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-zinc-300">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Callbacks */}
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
    </section>
  );
}
