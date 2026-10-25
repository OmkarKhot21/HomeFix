import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/userAuth';
import { getBookingForCustomer } from '@/lib/liveDb';
import { buildTracking } from '@/lib/tracking';
import LiveTracking from '@/components/app/LiveTracking';

export const dynamic = 'force-dynamic';

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/app/bookings/${id}`);
  const booking = await getBookingForCustomer(user.uid, id);
  if (!booking) notFound();

  // Same shape as /api/bookings/[id], so the client can keep polling it.
  return <LiveTracking initial={await buildTracking(booking)} />;
}
