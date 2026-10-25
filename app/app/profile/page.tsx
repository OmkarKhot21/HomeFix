import Link from 'next/link';
import { LogOut, HardHat, ChevronRight } from 'lucide-react';
import { requireUser } from '@/lib/userAuth';
import { getUserProfile, listAddresses, getProfessional, type Address } from '@/lib/liveDb';
import { logoutUser } from '@/app/actions/userActions';
import { ProfileForm, AddressBook } from '@/components/app/ProfileEditor';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await requireUser('/app/profile');
  let addresses: Address[] = [];
  let name = user.name ?? '';
  let phone = user.phone?.replace(/^\+91/, '') ?? '';
  let email = user.email;
  let isPro = false;
  try {
    const [profile, list, pro] = await Promise.all([getUserProfile(user.uid), listAddresses(user.uid), getProfessional(user.uid)]);
    addresses = list;
    isPro = Boolean(pro);
    if (profile) {
      name = profile.name ?? name;
      phone = profile.phone?.replace(/^\+91/, '') ?? phone;
      email = profile.email ?? email;
    }
  } catch (err) {
    console.error('[PROFILE] could not load:', err);
  }

  const card = 'rounded-3xl bg-white p-5 ring-1 ring-neutral-200 sm:p-6';

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink font-display text-2xl font-extrabold text-brand">
          {(name.trim()[0] || 'U').toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900">{name || 'Your profile'}</h1>
          {email && <p className="text-sm text-neutral-500">{email}</p>}
        </div>
      </div>

      <section className={card} aria-labelledby="details-heading">
        <h2 id="details-heading" className="mb-4 font-display text-lg font-extrabold text-neutral-900">Personal details</h2>
        <ProfileForm name={name} phone={phone} email={email} />
      </section>

      <section id="addresses" className={`${card} scroll-mt-24`} aria-labelledby="addresses-heading">
        <h2 id="addresses-heading" className="mb-4 font-display text-lg font-extrabold text-neutral-900">Saved addresses</h2>
        <AddressBook initial={addresses} />
      </section>

      <Link href="/pro" className={`${card} flex items-center gap-4 hover:ring-neutral-400`}>
        <HardHat size={20} className="shrink-0 text-neutral-900" />
        <span className="flex-1 text-sm font-bold text-neutral-900">{isPro ? 'Open partner dashboard' : 'Join HomeFix as a professional'}</span>
        <ChevronRight size={16} className="text-neutral-400" />
      </Link>

      <form action={logoutUser}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-3xl bg-white p-4 text-sm font-bold text-red-600 ring-1 ring-neutral-200 hover:bg-red-50"
        >
          <LogOut size={16} /> Log out
        </button>
      </form>
    </div>
  );
}
