import type { CustomerBooking } from '@/lib/liveDb';
import type { LatLng } from '@/lib/geo';
import { getRoute } from '@/lib/routing';

export interface TrackingPayload {
  booking: Omit<CustomerBooking, 'pro'> & {
    pro: null | { name: string; phone: string; trade: string; experienceYears: number };
  };
  proLocation: { lat: number; lng: number; updatedAt: string | null } | null;
  eta: { minutes: number; km: number; byRoad: boolean } | null;
  /** Road route from the professional to the home, when available. */
  route: LatLng[] | null;
}

/** What the customer's tracking screen shows. Used by the page and by the polling API. */
export async function buildTracking(booking: CustomerBooking): Promise<TrackingPayload> {
  let proLocation: TrackingPayload['proLocation'] = null;
  let eta: TrackingPayload['eta'] = null;
  let route: TrackingPayload['route'] = null;

  // Only share the professional's live position while they are on the way.
  if (booking.pro && booking.status === 'accepted' && booking.pro.lat !== null && booking.pro.lng !== null) {
    const from = { lat: booking.pro.lat, lng: booking.pro.lng };
    proLocation = { ...from, updatedAt: booking.pro.locationAt };
    if (booking.lat !== null && booking.lng !== null) {
      const to = { lat: booking.lat, lng: booking.lng };
      const r = await getRoute(from, to);
      eta = { minutes: r.minutes, km: r.km, byRoad: r.source === 'road' };
      // Join the road line exactly to the pro's pin and the home.
      route = r.path.length > 1 ? [from, ...r.path, to] : null;
    }
  }

  const pro = booking.pro
    ? { name: booking.pro.name, phone: booking.pro.phone, trade: booking.pro.trade, experienceYears: booking.pro.experienceYears }
    : null;

  return { booking: { ...booking, pro }, proLocation, eta, route };
}
