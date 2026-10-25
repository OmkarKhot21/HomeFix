import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/userAuth';
import { getBookingForCustomer, getUserProfile } from '@/lib/liveDb';
import { getReviewForBooking, displayName, type BookingReview } from '@/lib/reviewsDb';
import { buildTracking } from '@/lib/tracking';
import LiveTracking from '@/components/app/LiveTracking';

export const dynamic = 'force-dynamic';

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser(`/app/bookings/${id}`);
  const booking = await getBookingForCustomer(user.uid, id);
  if (!booking) notFound();

  // Review card for completed jobs. Skipped quietly if the reviews table isn't set up yet.
  let review: { existing: BookingReview | null; publicName: string } | null = null;
  if (booking.status === 'completed') {
    try {
      const [existing, profile] = await Promise.all([getReviewForBooking(user.uid, id), getUserProfile(user.uid)]);
      review = { existing, publicName: displayName(profile?.name ?? user.name) };
    } catch (err) {
      console.error('[REVIEWS] not available (run db/migrations/006_reviews.sql):', err);
    }
  }

  // Same shape as /api/bookings/[id], so the client can keep polling it.
  return <LiveTracking initial={await buildTracking(booking)} review={review} />;
}
