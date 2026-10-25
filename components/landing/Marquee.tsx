import { Sparkle } from 'lucide-react';

const ITEMS = [
  'Leaking taps',
  'Blocked drains',
  'Fan repair',
  'Switchboards',
  'Light fitting',
  'Geyser repair',
  'Door locks',
  'Furniture assembly',
  'Drilling & mounting',
  'Bathroom fittings',
];

// Black strip with a slow, endless ticker of services.
export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden || undefined}>
      {ITEMS.map((item) => (
        <li key={item} className="flex items-center gap-8 whitespace-nowrap font-display text-lg font-extrabold text-white sm:text-2xl">
          {item}
          <Sparkle size={18} className="shrink-0 fill-brand text-brand" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Services we offer" className="overflow-hidden border-y border-black bg-ink py-5">
      <div className="hf-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
