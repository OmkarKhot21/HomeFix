import { ShieldCheck, Wallet, MapPinned, Clock } from 'lucide-react';
import { requireUser } from '@/lib/userAuth';
import { getProfessional, getUserProfile } from '@/lib/liveDb';
import ProJoinForm from '@/components/pro/ProJoinForm';

export const dynamic = 'force-dynamic';

export default async function ProJoinPage() {
  const user = await requireUser('/pro/join');
  let defaults: { name: string; phone: string; trade?: string; area?: string; experienceYears?: number } = {
    name: user.name ?? '',
    phone: user.phone?.replace(/^\+91/, '') ?? '',
  };
  try {
    const [pro, profile] = await Promise.all([getProfessional(user.uid), getUserProfile(user.uid)]);
    if (pro) defaults = { name: pro.name, phone: pro.phone, trade: pro.trade, area: pro.area, experienceYears: pro.experienceYears };
    else if (profile?.phone) defaults.phone = profile.phone.replace(/^\+91/, '');
  } catch {
    /* use session defaults */
  }

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-widest text-brand">Become a HomeFix partner</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Get repair jobs near you</h1>
        <p className="mt-2 max-w-lg text-white/60">Go online when you want, accept jobs in your area, and track your earnings every day.</p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: MapPinned, title: 'Jobs nearby', text: 'Within 10 km of you' },
          { icon: Clock, title: 'Your hours', text: 'Go online anytime' },
          { icon: Wallet, title: 'Clear earnings', text: 'Daily, weekly, monthly' },
          { icon: ShieldCheck, title: 'Verified badge', text: 'Customers trust you' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
            <Icon size={20} className="text-brand" />
            <p className="mt-2 text-sm font-bold">{title}</p>
            <p className="text-xs text-white/50">{text}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl bg-white/[0.04] p-5 ring-1 ring-white/10 sm:p-7">
        <h2 className="mb-5 font-display text-xl font-extrabold">Your details</h2>
        <ProJoinForm defaults={defaults} />
        <p className="mt-4 text-xs text-white/40">
          After you apply, our team verifies your ID and does a police verification and a short skill check before you can go online.
        </p>
      </section>
    </div>
  );
}
