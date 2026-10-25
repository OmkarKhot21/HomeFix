import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/userAuth';
import { getBookingForCustomer, expireStaleBookings } from '@/lib/liveDb';
import { buildTracking } from '@/lib/tracking';

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
    return NextResponse.json(await buildTracking(booking), { headers: noStore });
  } catch (err) {
    console.error('[DATABASE ERROR in /api/bookings/[id]]:', err);
    return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: noStore });
  }
}
