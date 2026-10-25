import type { Metadata } from 'next';
import { requireUser } from '@/lib/userAuth';
import { getProfessional } from '@/lib/liveDb';
import { CustomerTopBar, CustomerBottomTabs } from '@/components/app/CustomerNav';

export const metadata: Metadata = {
  title: 'HomeFix',
  robots: { index: false, follow: false },
};

// Logged-in customer area: /app, /app/book, /app/bookings, /app/profile
export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser('/app');
  let isPro = false;
  try {
    isPro = Boolean(await getProfessional(user.uid));
  } catch {
    /* professionals table may not exist yet */
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24 md:pb-10">
      <CustomerTopBar name={user.name} isPro={isPro} />
      <main className="mx-auto max-w-5xl px-4 pt-6">{children}</main>
      <CustomerBottomTabs />
    </div>
  );
}
