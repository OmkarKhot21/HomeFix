import Link from 'next/link';
import { Phone, ShieldCheck, Check, Navigation, Clock, ArrowRight } from 'lucide-react';

// Illustration of the real live-tracking screen (/app/bookings/[id]).
function MapIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
      <rect width="400" height="300" fill="#EEF1EA" />
      {/* blocks */}
      {[
        [20, 20, 90, 60], [130, 20, 110, 60], [260, 20, 120, 60],
        [20, 100, 60, 80], [100, 100, 140, 80], [260, 100, 50, 80], [330, 100, 50, 80],
        [20, 200, 120, 80], [160, 200, 80, 80], [260, 200, 120, 80],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="8" fill={i % 4 === 1 ? '#DDE8D2' : '#FFFFFF'} />
      ))}
      {/* main road */}
      <path d="M0 90 H400 M250 0 V300 M0 190 H400 M90 0 V300" stroke="#F8D57E" strokeWidth="10" fill="none" opacity="0.55" />
      {/* route */}
      <path d="M60 255 L60 190 L250 190 L250 90 L330 90" stroke="#0A0A0A" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 12" />
      {/* home */}
      <g transform="translate(330 90)">
        <circle r="18" fill="#0A0A0A" stroke="#fff" strokeWidth="4" />
        <path d="M-7 1 0-6 7 1M-5 0v7h10v-7" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* pro */}
      <g transform="translate(150 190)">
        <circle r="26" fill="#FFC800" opacity="0.35">
          <animate attributeName="r" values="18;30;18" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle r="18" fill="#FFC800" stroke="#fff" strokeWidth="4" />
        <circle cx="-5" cy="5" r="3" stroke="#0A0A0A" strokeWidth="2" fill="none" />
        <circle cx="6" cy="5" r="3" stroke="#0A0A0A" strokeWidth="2" fill="none" />
        <path d="M-2 5h5l2-7h-3" stroke="#0A0A0A" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function TrackingShowcase() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200/60 bg-neutral-50 py-20">
      <div className="container mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Live tracking</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Know exactly when help arrives
          </h2>
          <p className="mt-3 max-w-lg text-neutral-600">
            The moment a professional accepts your job, you see who’s coming, how far away they are, and a live arrival time —
            just like tracking a food order.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { icon: Navigation, title: 'Live location on the map', text: 'Updated every few seconds while they ride to you.' },
              { icon: Clock, title: 'Arrival time you can plan around', text: 'No more “I’ll be there in 10 minutes” for an hour.' },
              { icon: Phone, title: 'Call your pro in one tap', text: 'Share directions or gate codes before they reach.' },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="hf-glass-light flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block font-bold text-neutral-900">{title}</span>
                  <span className="block text-sm text-neutral-600">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <Link href="/login" className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-black">
            Book a repair <ArrowRight size={16} />
          </Link>
        </div>

        {/* Phone mockup of the tracking screen */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-brand/30 via-transparent to-neutral-200" aria-hidden="true" />
          <div className="overflow-hidden rounded-[2.5rem] border-[10px] border-neutral-900 bg-white shadow-2xl">
            <div className="h-56">
              <MapIllustration />
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Fan Repair</p>
                <p className="font-display text-2xl font-extrabold text-neutral-900">Arriving in 9 min</p>
                <p className="text-xs text-neutral-500">1.8 km away · estimated from live location</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-neutral-50 p-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink font-display text-lg font-extrabold text-brand">E</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-neutral-900">Your electrician</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-900"><ShieldCheck size={12} /> ID & police verified</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-extrabold text-ink">
                  <Phone size={13} /> Call
                </span>
              </div>
              <ol className="space-y-2 text-xs font-semibold">
                {['Booking placed', 'Pro on the way', 'Arrived'].map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full ${i < 1 ? 'bg-neutral-900 text-white' : i === 1 ? 'bg-brand' : 'bg-neutral-200'}`}>
                      {i < 1 && <Check size={11} strokeWidth={3} />}
                    </span>
                    <span className={i <= 1 ? 'text-neutral-900' : 'text-neutral-400'}>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-neutral-500">Illustration of the live tracking screen</p>
        </div>
      </div>
    </section>
  );
}
