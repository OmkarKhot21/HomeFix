import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser, safeNextPath } from '@/lib/userAuth';
import { getService } from '@/lib/services';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login | HomeFix',
  description: 'Log in to HomeFix with Google or your email.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; next?: string }>;
}) {
  const params = await searchParams;
  const service = getService(params.service);
  const next = safeNextPath(params.next);
  const user = await getSessionUser();

  // Already logged in and heading somewhere specific: skip the login screen.
  if (user && service) redirect(`/book?service=${service.slug}`);
  if (user && next) redirect(next);

  return (
    <LoginClient
      serviceSlug={service?.slug ?? null}
      serviceName={service?.name ?? null}
      nextPath={next}
      alreadyLoggedInName={user ? user.name ?? '' : null}
    />
  );
}
