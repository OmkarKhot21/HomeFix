import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/userAuth';
import { getBookingForCustomer } from '@/lib/liveDb';
import { etaMinutes, distanceKm } from '@/lib/geo';
import LiveTracking from '@/components/app/LiveTracking';

export const dynamic = 'force-dynamic';

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/app/bookings/${id}`);
  const booking = await getBookingForCustomer(user.uid, id);
  if (!booking) notFound();

  // Same shape as /api/bookings/[id], so the client can keep polling it.
  let proLocation = null;
  let eta = null;
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

  return <LiveTracking initial={{ booking: { ...booking, pro }, proLocation, eta }} />;
}
