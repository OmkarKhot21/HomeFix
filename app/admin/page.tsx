import { requireAdmin } from '@/lib/auth';
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
  // Reusable security boundary: throws redirect if session is missing, invalid, or expired
  const session = await requireAdmin();

  const [leads, metrics] = await Promise.all([getAllLeadsUnified(), getLeadMetrics()]);

  return (
    <AdminDashboardClient
      initialLeads={leads}
      initialMetrics={metrics}
      adminUser={session.username}
    />
  );
}
