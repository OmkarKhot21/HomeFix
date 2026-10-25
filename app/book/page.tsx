import type { Metadata } from 'next';
import { requireUser } from '@/lib/userAuth';
import { getService } from '@/lib/services';
import AppHeader from '@/components/AppHeader';
import BookingForm from './BookingForm';

export const metadata: Metadata = {
  title: 'Book a service | HomeFix',
  robots: { index: false, follow: false },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: serviceParam } = await searchParams;
  const service = getService(serviceParam);
  const user = await requireUser(service ? `/book?service=${service.slug}` : '/book');

  // Phone sign-ins carry +91XXXXXXXXXX; prefill the 10 digits.
  const phone = user.phone?.replace(/^\+91/, '') ?? '';

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader name={user.name} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Book a professional</h1>
        <p className="mt-1 text-slate-600">Tell us what you need. Our team will call you to confirm the visit.</p>
        <BookingForm defaultService={service?.slug ?? ''} defaultPhone={phone} />
      </main>
    </div>
  );
}
