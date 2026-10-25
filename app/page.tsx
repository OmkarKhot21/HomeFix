import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/userAuth';
import { getProfessional } from '@/lib/liveDb';
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
  return <LandingPage />;
}
