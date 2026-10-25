import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/userAuth';
import { getBookingForCustomer, expireStaleBookings } from '@/lib/liveDb';
import { etaMinutes, distanceKm } from '@/lib/geo';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

// Polled every few seconds by the customer's live tracking screen.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: noStore });

  const { id } = await params;
  try {
    await expireStaleBookings();
    const booking = await getBookingForCustomer(user.uid, id);
    if (!booking) return NextResponse.json({ error: 'not_found' }, { status: 404, headers: noStore });

    // Only share the professional's live position while they are on the way.
    let eta: { minutes: number; km: number } | null = null;
    let proLocation: { lat: number; lng: number; updatedAt: string | null } | null = null;
    if (booking.pro && booking.status === 'accepted' && booking.pro.lat !== null && booking.pro.lng !== null) {
      proLocation = { lat: booking.pro.lat, lng: booking.pro.lng, updatedAt: booking.pro.locationAt };
      if (booking.lat !== null && booking.lng !== null) {
        const from = { lat: booking.pro.lat, lng: booking.pro.lng };
        const to = { lat: booking.lat, lng: booking.lng };
        eta = { minutes: etaMinutes(from, to), km: distanceKm(from, to) };
      }
    }

    const pro = booking.pro
      ? { name: booking.pro.name, phone: booking.pro.phone, trade: booking.pro.trade, experienceYears: booking.pro.experienceYears }
      : null;

    return NextResponse.json({ booking: { ...booking, pro }, proLocation, eta }, { headers: noStore });
  } catch (err) {
    console.error('[DATABASE ERROR in /api/bookings/[id]]:', err);
    return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: noStore });
  }
}
