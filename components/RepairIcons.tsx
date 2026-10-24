import type { ReactNode } from 'react';

// Animated line icons for the Instant Booking Menu boxes.
// Animations live in app/globals.css (classes prefixed "hf-") and are
// disabled for visitors who prefer reduced motion.

function Svg({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`hf-anim h-8 w-8 overflow-visible ${className}`}
    >
      {children}
    </svg>
  );
}

// Water drop falling from the tap
function LeakingTap() {
  return (
    <Svg>
      <path d="M3 6v6" />
      <path d="M3 9h9a3 3 0 0 1 3 3v1" />
      <path d="M9 9V5.5" />
      <path d="M6.5 5.5h5" />
      <path className="hf-drip" d="M15 15.5s-1.4 1.7-1.4 2.6a1.4 1.4 0 0 0 2.8 0c0-.9-1.4-2.6-1.4-2.6z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

// Wrench tightening back and forth
function BlockedDrain() {
  return (
    <Svg>
      <path className="hf-wrench" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Svg>
  );
}

// Shower head spraying water
function BathroomFittings() {
  const drops = [
    { x: 8.5, y: 14, d: '0s' },
    { x: 11, y: 12.5, d: '0.25s' },
    { x: 12.5, y: 11, d: '0.5s' },
    { x: 14, y: 8.5, d: '0.15s' },
    { x: 10, y: 15.5, d: '0.65s' },
    { x: 15.5, y: 10, d: '0.4s' },
  ];
  return (
    <Svg>
      <path d="m4 4 2.5 2.5" />
      <path d="M13.5 6.5a4.95 4.95 0 0 0-7 7" />
      <path d="M15 5 5 15" />
      {drops.map((p) => (
        <circle key={`${p.x}-${p.y}`} className="hf-spray" cx={p.x} cy={p.y} r={0.9} fill="currentColor" stroke="none" style={{ animationDelay: p.d }} />
      ))}
    </Svg>
  );
}

// Flickering geyser flame
function GeyserRepair() {
  return (
    <Svg>
      <path className="hf-flame" d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </Svg>
  );
}

// Fan speeds up, then stops suddenly
function FanRepair() {
  return (
    <Svg>
      <g className="hf-fan">
        <circle cx="12" cy="12" r="2" />
        <path d="M12 10c0-4 1-7 4-7s2 5-2 7" />
        <path d="M14 12c4 0 7 1 7 4s-5 2-7-2" />
        <path d="M12 14c0 4-1 7-4 7s-2-5 2-7" />
        <path d="M10 12c-4 0-7-1-7-4s5-2 7 2" />
      </g>
    </Svg>
  );
}

// Plug pushes into the socket and sparks
function Switchboard() {
  return (
    <Svg>
      <rect x="5" y="2" width="14" height="5" rx="1.5" />
      <g className="hf-plug">
        <path d="M9.5 7v3" />
        <path d="M14.5 7v3" />
        <path d="M7 10h10v3a5 5 0 0 1-10 0z" />
        <path d="M12 18v4" />
      </g>
      <path className="hf-spark" d="M3.5 9.5 2 11" />
      <path className="hf-spark" d="M20.5 9.5 22 11" />
      <path className="hf-spark" d="M3 6.5H1.5" />
      <path className="hf-spark" d="M21 6.5h1.5" />
    </Svg>
  );
}

// Bulb glowing with a quick flicker
function LightFitting() {
  return (
    <Svg className="hf-glow">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5z" fill="currentColor" fillOpacity={0.25} />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </Svg>
  );
}

// Lock shackle pops open and clicks shut
function DoorLock() {
  return (
    <Svg>
      <path className="hf-shackle" d="M8 12V8a4 4 0 0 1 8 0v4" />
      <rect x="4" y="12" width="16" height="10" rx="2" />
      <path d="M12 16v2" />
    </Svg>
  );
}

// Sofa bounces like someone just sat down
function FurnitureAssembly() {
  return (
    <Svg>
      <g className="hf-squish">
        <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
        <path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" />
        <path d="M4 18v2M20 18v2" />
      </g>
    </Svg>
  );
}

// Drill buzzes in bursts with a spinning bit
function DrillingMounting() {
  return (
    <Svg>
      <g className="hf-drill">
        <path d="M10 18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3 1 1 0 0 1 1-1z" />
        <path d="M13 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1z" />
        <path d="M5 10v8" />
        <path className="hf-bit" d="M14 6h7" />
      </g>
      <circle className="hf-dust" cx="22.5" cy="4.5" r="0.7" fill="currentColor" stroke="none" />
      <circle className="hf-dust" cx="23" cy="7.5" r="0.6" fill="currentColor" stroke="none" style={{ animationDelay: '0.2s' }} />
    </Svg>
  );
}

export const REPAIR_ICONS: Record<string, () => ReactNode> = {
  'Leaking Tap': LeakingTap,
  'Blocked Drain': BlockedDrain,
  'Bathroom Fittings': BathroomFittings,
  'Geyser Repair': GeyserRepair,
  'Fan Repair': FanRepair,
  Switchboard: Switchboard,
  'Light Fitting': LightFitting,
  'Door Lock': DoorLock,
  'Furniture Assembly': FurnitureAssembly,
  'Drilling & Mounting': DrillingMounting,
};
