import type { Metadata } from 'next';
import { requireUser } from '@/lib/userAuth';
import AppHeader from '@/components/AppHeader';
import PartnerForm from './PartnerForm';

export const metadata: Metadata = {
  title: 'Join as a partner | HomeFix',
  robots: { index: false, follow: false },
};

export default async function PartnerPage() {
  const user = await requireUser('/partner');
  const phone = user.phone?.replace(/^\+91/, '') ?? '';

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader name={user.name} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Join HomeFix as a partner</h1>
        <p className="mt-1 text-slate-600">
          Get repair jobs near you with fixed rates and on-time payments. Share a few details and our team will call you.
        </p>
        <PartnerForm defaultName={user.name ?? ''} defaultPhone={phone} />
      </main>
    </div>
  );
}
