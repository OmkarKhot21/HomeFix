import { requireUser } from '@/lib/userAuth';
import { listAddresses, getUserProfile, type Address } from '@/lib/liveDb';
import { getService } from '@/lib/services';
import BookFlow from '@/components/app/BookFlow';

export const dynamic = 'force-dynamic';

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service: serviceParam } = await searchParams;
  const service = getService(serviceParam);
  const user = await requireUser(service ? `/app/book?service=${service.slug}` : '/app/book');

  let addresses: Address[] = [];
  let myPhone = user.phone?.replace(/^\+91/, '') ?? '';
  let savedContact: { name: string; phone: string } | null = null;
  try {
    const [list, profile] = await Promise.all([listAddresses(user.uid), getUserProfile(user.uid)]);
    addresses = list;
    if (profile?.phone) myPhone = profile.phone.replace(/^\+91/, '');
    if (profile?.contactName && profile.contactPhone) savedContact = { name: profile.contactName, phone: profile.contactPhone };
  } catch (err) {
    console.error('[BOOK] could not load profile:', err);
  }

  return (
    <BookFlow
      initialService={service?.slug ?? null}
      initialAddresses={addresses}
      myName={user.name}
      myPhone={myPhone}
      savedContact={savedContact}
    />
  );
}
