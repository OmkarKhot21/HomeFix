import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getAllLeadsUnified, getLeadMetrics } from '@/lib/db';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Operations & Pipeline | HomeFix',
  description: 'Operations control panel and lead pipeline management for HomeFix.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    redirect('/admin/login');
  }

  const session = await verifySessionToken(sessionCookie);
  if (!session.valid) {
    redirect('/admin/login');
  }

  const leads = getAllLeadsUnified();
  const metrics = getLeadMetrics();

  return (
    <AdminDashboardClient
      initialLeads={leads}
      initialMetrics={metrics}
      adminUser={session.username || 'admin'}
    />
  );
}
