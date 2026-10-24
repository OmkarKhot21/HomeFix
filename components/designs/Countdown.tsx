'use client';

import { useEffect, useState } from 'react';

// Looping 15:00 → 00:00 timer used as the hero visual in concept 3.
// Runs 30x faster than real time so the motion is visible.
export default function Countdown() {
  const total = 15 * 60;
  const [left, setLeft] = useState(total);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => (s <= 0 ? total : s - 30));
    }, 1000);
    return () => clearInterval(id);
  }, [total]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const progress = 1 - left / total;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="#C6F432"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 88}
          strokeDashoffset={2 * Math.PI * 88 * (1 - progress)}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">Pro arriving in</span>
        <span className="font-display text-6xl font-extrabold tabular-nums text-white sm:text-7xl" aria-label="15 minutes">
          {mm}:{ss}
        </span>
        <span className="mt-2 rounded-full bg-[#C6F432]/15 px-3 py-1 text-xs font-bold text-[#C6F432]">Illustration</span>
      </div>
    </div>
  );
}
