// Service catalog used by the booking popups, the booking form and the admin.
// Photos are from Pexels (free for commercial use, no attribution required).

export type ServiceCategory = 'Plumbing' | 'Electrical' | 'Carpentry';

export interface Service {
  slug: string;
  name: string;
  category: ServiceCategory;
  price: number; // starting price in ₹
  duration: string; // typical time on site
  summary: string;
  tasks: string[]; // what the professional will do
  photoId: number; // Pexels photo id
  photoAlt: string;
  photoPosition?: string; // CSS object-position, to keep the person in frame
  isCategory?: boolean; // true for the 3 broad category cards
}

export const SERVICES: Service[] = [
  // Plumbing
  {
    slug: 'leaking-tap',
    name: 'Leaking Tap',
    category: 'Plumbing',
    price: 199,
    duration: '30–45 min',
    summary: 'Stop drips and leaks from taps, mixers and connection pipes.',
    tasks: [
      'Find the source of the leak',
      'Replace worn washers, cartridges or spindles',
      'Re-seal joints and connection pipes',
      'Test water flow and clean up',
    ],
    photoId: 6419128,
    photoAlt: 'Plumber tightening a water pipe joint',
  },
  {
    slug: 'blocked-drain',
    name: 'Blocked Drain',
    category: 'Plumbing',
    price: 199,
    duration: '45–60 min',
    summary: 'Clear choked sinks, floor traps and bathroom drains.',
    tasks: [
      'Inspect the drain and locate the blockage',
      'Clear it with a plunger, auger or drain spring',
      'Flush the line and check water flow',
      'Advise on preventing future blockages',
    ],
    photoId: 35290675,
    photoAlt: 'Plumber working on a water pump and pipes',
  },
  {
    slug: 'bathroom-fittings',
    name: 'Bathroom Fittings',
    category: 'Plumbing',
    price: 199,
    duration: '45–90 min',
    summary: 'Install or replace showers, health faucets, mixers and fittings.',
    tasks: [
      'Remove old or damaged fittings',
      'Install showers, mixers, health faucets or towel rods',
      'Seal joints so nothing leaks',
      'Test pressure and leave the area clean',
    ],
    photoId: 39885416,
    photoAlt: 'Plumber cutting a copper pipe in a vise',
  },
  {
    slug: 'geyser-repair',
    name: 'Geyser Repair',
    category: 'Plumbing',
    price: 199,
    duration: '45–60 min',
    summary: 'Fix geysers that won’t heat, trip or leak.',
    tasks: [
      'Check thermostat, heating element and wiring',
      'Repair or replace faulty parts (charged separately)',
      'Inspect inlet, outlet and safety valve',
      'Run a full heating test',
    ],
    photoId: 34938439,
    photoAlt: 'Technician repairing a water heater unit',
  },
  // Electrical
  {
    slug: 'fan-repair',
    name: 'Fan Repair',
    category: 'Electrical',
    price: 199,
    duration: '30–60 min',
    summary: 'Fix slow, noisy or dead ceiling fans and regulators.',
    tasks: [
      'Diagnose speed, noise or wobble problems',
      'Replace capacitor or regulator if needed',
      'Re-balance blades and tighten the mount',
      'Install or remove fans on request',
    ],
    photoId: 32391477,
    photoAlt: 'Electrician on a ladder fixing a ceiling fitting',
    photoPosition: 'center 12%',
  },
  {
    slug: 'switchboard',
    name: 'Switchboard',
    category: 'Electrical',
    price: 199,
    duration: '30–45 min',
    summary: 'Repair or replace switches, sockets and switchboards.',
    tasks: [
      'Safely isolate power before work',
      'Replace burnt or loose switches and sockets',
      'Fix sparking and loose connections',
      'Test every point before leaving',
    ],
    photoId: 7647233,
    photoAlt: 'Electrician fitting a wall switch',
  },
  {
    slug: 'light-fitting',
    name: 'Light Fitting',
    category: 'Electrical',
    price: 199,
    duration: '30–45 min',
    summary: 'Install lights, tube lights, chandeliers and LED panels.',
    tasks: [
      'Mount the fixture securely',
      'Connect and insulate the wiring',
      'Fix flickering or non-working lights',
      'Test and clean up',
    ],
    photoId: 7640978,
    photoAlt: 'Electrician installing a ceiling light fixture',
  },
  // Carpentry
  {
    slug: 'door-lock',
    name: 'Door Lock',
    category: 'Carpentry',
    price: 249,
    duration: '30–60 min',
    summary: 'Repair, replace or install door locks and latches.',
    tasks: [
      'Repair jammed or broken locks',
      'Install new locks, latches or tower bolts',
      'Align doors that don’t close properly',
      'Lubricate hinges and handles',
    ],
    photoId: 35578808,
    photoAlt: 'Locksmith working on a key and lock',
  },
  {
    slug: 'furniture-assembly',
    name: 'Furniture Assembly',
    category: 'Carpentry',
    price: 249,
    duration: '45–120 min',
    summary: 'Assemble beds, wardrobes, tables and flat-pack furniture.',
    tasks: [
      'Unbox and check all parts',
      'Assemble following the manufacturer’s guide',
      'Tighten, level and secure to the wall if needed',
      'Clear away packaging',
    ],
    photoId: 4554420,
    photoAlt: 'Man assembling a table at home',
  },
  {
    slug: 'drilling-mounting',
    name: 'Drilling & Mounting',
    category: 'Carpentry',
    price: 249,
    duration: '30–60 min',
    summary: 'Mount TVs, shelves, frames, curtain rods and more.',
    tasks: [
      'Mark positions and check for hidden wiring',
      'Drill clean holes with the right bits',
      'Fix wall plugs and mount securely',
      'Clean up the dust',
    ],
    photoId: 7218577,
    photoAlt: 'Man drilling into a wall to mount frames',
  },
  // Broad categories (used by the 3 large service cards)
  {
    slug: 'plumbing',
    name: 'Plumbing Services',
    category: 'Plumbing',
    price: 199,
    duration: '30–90 min',
    summary: 'Leaks, blocked drains, bathroom fittings and geysers.',
    tasks: [
      'Leak detection and tap repairs',
      'Drain and floor-trap cleaning',
      'Bathroom and kitchen fittings',
      'Geyser and water-line checks',
    ],
    photoId: 32588548,
    photoAlt: 'Plumber in work overalls repairing a pipe',
    isCategory: true,
  },
  {
    slug: 'electrical',
    name: 'Electrical Repairs',
    category: 'Electrical',
    price: 199,
    duration: '30–60 min',
    summary: 'Switches, MCB trips, fans, lights and wiring faults.',
    tasks: [
      'Short circuit and MCB trip diagnosis',
      'Switchboard and socket repairs',
      'Fan and light installation',
      'Safety check of the circuit',
    ],
    photoId: 27928761,
    photoAlt: 'Electrician working on a distribution board',
    isCategory: true,
  },
  {
    slug: 'carpentry',
    name: 'Carpentry & Assembly',
    category: 'Carpentry',
    price: 249,
    duration: '30–120 min',
    summary: 'Locks, hinges, furniture assembly, drilling and mounting.',
    tasks: [
      'Door lock and hinge repairs',
      'Furniture assembly and repair',
      'Drilling and wall mounting',
      'Drawer and cabinet fixes',
    ],
    photoId: 18947381,
    photoAlt: 'Carpenter shaping a wooden plank in his workshop',
    isCategory: true,
  },
];

export const BOOKABLE_SERVICES = SERVICES.filter((s) => !s.isCategory);

export function getService(slug: string | undefined | null): Service | undefined {
  if (!slug) return undefined;
  return SERVICES.find((s) => s.slug === slug);
}

export function getServiceByName(name: string): Service | undefined {
  return SERVICES.find((s) => s.name === name);
}

export function servicePhotoUrl(photoId: number): string {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg`;
}

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug) as [string, ...string[]];
