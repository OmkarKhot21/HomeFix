import type { Service } from './services';

// Night pricing for plumbing and electrical work.
// Used by the booking screen (to show the price) and the server (to charge it).

export const NIGHT_CHARGE = 150;
export const NIGHT_SLOT = 'Night (8 PM – 12 AM)';
/** "Right now" bookings placed from 8 PM until 6 AM (India time) are night jobs. */
const NIGHT_START_HOUR = 20;
const NIGHT_END_HOUR = 6;

export function hasNightCharge(service: Pick<Service, 'category'>): boolean {
  return service.category === 'Plumbing' || service.category === 'Electrical';
}

/** Only electrical work can be scheduled in the night slot. */
export function canBookNightSlot(service: Pick<Service, 'category'>): boolean {
  return service.category === 'Electrical';
}

export function isNightNowInIndia(now: Date = new Date()): boolean {
  const hour = Number(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }));
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
}

export interface PriceQuote {
  base: number;
  nightCharge: number;
  total: number;
}

export function quotePrice(
  service: Pick<Service, 'category' | 'price'>,
  timing: 'asap' | 'scheduled',
  slot: string | null | undefined,
  now: Date = new Date()
): PriceQuote {
  const isNightJob = timing === 'asap' ? isNightNowInIndia(now) : slot === NIGHT_SLOT;
  const nightCharge = hasNightCharge(service) && isNightJob ? NIGHT_CHARGE : 0;
  return { base: service.price, nightCharge, total: service.price + nightCharge };
}
