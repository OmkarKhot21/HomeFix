import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/userAuth';
import { getProfessional } from '@/lib/liveDb';
import { getPublicReviews, type ReviewSummary } from '@/lib/reviewsDb';
import LandingPage from '@/components/LandingPage';

export const dynamic = 'force-dynamic';

// Visitors see the marketing site. Logged-in people go straight to their app:
// professionals to the partner dashboard, everyone else to the customer home.
export default async function Home() {
  const user = await getSessionUser();
  if (user) {
    let isPro = false;
    try {
      isPro = Boolean(await getProfessional(user.uid));
    } catch {
      /* professionals table may not exist yet */
    }
    redirect(isPro ? '/pro' : '/app');
  }

  // Real customer reviews; the section stays hidden if there are none (or the table isn't set up yet).
  let reviews: ReviewSummary | null = null;
  try {
    reviews = await getPublicReviews(30);
  } catch (err) {
    console.error('[REVIEWS] not available (run db/migrations/006_reviews.sql):', err);
  }

  return <LandingPage reviews={reviews} />;
}
