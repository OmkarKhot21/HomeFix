import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Hourglass, ShieldAlert, ShieldCheck, FileCheck2, Phone } from 'lucide-react';
import { requireUser } from '@/lib/userAuth';
import {
  getProfessional,
  getActiveJobForPro,
  listOpenRequestsForPro,
  getProEarnings,
  expireStaleBookings,
  commissionPercent,
} from '@/lib/liveDb';
import ProDashboard from '@/components/pro/ProDashboard';

export const dynamic = 'force-dynamic';

export default async function ProPage() {
  const user = await requireUser('/pro');
  let pro;
  try {
    pro = await getProfessional(user.uid);
  } catch (err) {
    // Usually means db/migrations/003_live_dispatch.sql hasn't been run yet.
    console.error('[PRO] could not load professional:', err);
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <h1 className="font-display text-2xl font-extrabold">Partner accounts are being set up</h1>
        <p className="mt-2 text-white/60">Please try again in a little while.</p>
        <Link href="/app" className="mt-6 inline-block rounded-2xl border border-white/15 px-5 py-3 text-sm font-bold hover:border-white/40">
          Go to customer app
        </Link>
      </div>
    );
  }
  if (!pro) redirect('/pro/join');

  if (pro.status !== 'approved') {
    const rejected = pro.status === 'rejected';
    const suspended = pro.status === 'suspended';
    return (
      <div className="mx-auto max-w-lg space-y-6 py-6 text-center">
        <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl ${rejected || suspended ? 'bg-red-500/15 text-red-300' : 'bg-brand/15 text-brand'}`}>
          {rejected || suspended ? <ShieldAlert size={30} /> : <Hourglass size={30} />}
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold">
            {rejected ? 'Application not approved' : suspended ? 'Account paused' : 'Application under review'}
          </h1>
          <p className="mt-2 text-white/60">
            {rejected
              ? 'We couldn’t approve your application this time. You can update your details and apply again.'
              : suspended
                ? 'Your partner account is paused. Please contact the HomeFix team.'
                : `Thanks, ${pro.name.split(' ')[0]}! Our team will call you on +91 ${pro.phone} to complete verification.`}
          </p>
        </div>
        {!rejected && !suspended && (
          <ol className="space-y-3 rounded-3xl bg-white/[0.04] p-5 text-left ring-1 ring-white/10">
            {[
              { icon: Phone, text: 'A quick call from our partner team' },
              { icon: FileCheck2, text: 'ID and police verification' },
              { icon: ShieldCheck, text: 'Short skill check, then you can go online' },
            ].map(({ icon: Icon, text }, i) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold">{i + 1}</span>
                <Icon size={16} className="shrink-0 text-brand" />
                {text}
              </li>
            ))}
          </ol>
        )}
        <Link href="/pro/join" className="inline-block rounded-2xl border border-white/15 px-5 py-3 text-sm font-bold hover:border-white/40">
          {rejected ? 'Update and re-apply' : 'Edit my details'}
        </Link>
      </div>
    );
  }

  await expireStaleBookings();
  const [activeJob, earnings] = await Promise.all([getActiveJobForPro(pro.uid), getProEarnings(pro.uid)]);
  const requests = pro.isOnline && !activeJob ? await listOpenRequestsForPro(pro) : [];

  return (
    <ProDashboard
      name={pro.name}
      trade={pro.trade}
      commission={commissionPercent()}
      initial={{
        pro: { status: pro.status, isOnline: pro.isOnline, hasLocation: pro.lat !== null, lat: pro.lat, lng: pro.lng },
        activeJob,
        requests,
        earnings,
      }}
    />
  );
}
