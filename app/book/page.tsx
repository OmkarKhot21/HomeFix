import { redirect } from 'next/navigation';
import { getService } from '@/lib/services';

// Old booking URL: forward to the new booking flow.
export default async function OldBookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const s = getService(service);
  redirect(s ? `/app/book?service=${s.slug}` : '/app/book');
}
