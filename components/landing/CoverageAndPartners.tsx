import Link from 'next/link';
import { MapPin, ArrowRight, Radio, Wallet, Navigation, CalendarCheck2 } from 'lucide-react';

const CITIES = [
  { city: 'Thane', areas: ['Thane West', 'Thane East', 'Ghodbunder Road', 'Majiwada', 'Kolshet'] },
  { city: 'Mumbai', areas: ['Mulund', 'Bhandup', 'Powai', 'Vikhroli', 'Ghatkopar'] },
  { city: 'Navi Mumbai', areas: ['Airoli', 'Ghansoli', 'Vashi', 'Nerul', 'Kharghar'] },
];

export function Coverage() {
  return (
    <section id="coverage" className="scroll-mt-20 border-b border-neutral-200/60 bg-neutral-50 py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Areas we serve</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Built for the Mumbai Metropolitan Region
          </h2>
          <p className="mt-3 text-neutral-600">
            We grow neighbourhood by neighbourhood so a professional is always close enough to reach you fast.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {CITIES.map(({ city, areas }) => (
            <div key={city} className="rounded-3xl bg-white p-6 ring-1 ring-neutral-200">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-neutral-900" />
                <h3 className="font-display text-xl font-extrabold text-neutral-900">{city}</h3>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {areas.map((a) => (
                  <li key={a} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700">{a}</li>
                ))}
                <li className="rounded-full px-3 py-1.5 text-xs font-semibold text-neutral-500">& nearby</li>
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-neutral-500">
          Not sure if we cover your building? Request a callback below and we’ll confirm.
        </p>
      </div>
    </section>
  );
}

export function ForProfessionals() {
  return (
    <section id="partners" className="scroll-mt-20 bg-white py-20">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-ink p-8 text-white sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand">For professionals</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Plumber, electrician or carpenter? Grow your income with HomeFix.
            </h2>
            <p className="mt-4 max-w-md text-white/60">
              Go online when it suits you, accept jobs near you, and see what you’ve earned today, this week and this month.
            </p>
            <Link
              href="/login?next=/pro"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-brand px-6 py-3.5 text-sm font-extrabold text-ink hover:brightness-95"
            >
              Join as a partner <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Radio, title: 'Online / offline', text: 'One tap to start or stop receiving jobs' },
              { icon: Navigation, title: 'Jobs near you', text: 'Requests within 10 km, with directions' },
              { icon: Wallet, title: 'Earnings dashboard', text: 'Daily, weekly and monthly totals' },
              { icon: CalendarCheck2, title: 'Your schedule', text: 'Accept only the jobs that fit your day' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white/[0.05] p-5 ring-1 ring-white/10">
                <span className="hf-glass flex h-11 w-11 items-center justify-center rounded-xl text-brand">
                  <Icon size={20} />
                </span>
                <p className="mt-3 text-sm font-bold">{title}</p>
                <p className="mt-1 text-xs text-white/50">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
