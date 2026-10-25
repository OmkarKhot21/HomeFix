'use server';

import { revalidatePath } from 'next/cache';
import { verifyAdminApi } from '@/lib/auth';
import { setProfessionalStatus, type ProStatus } from '@/lib/liveDb';

const ALLOWED: ProStatus[] = ['approved', 'rejected', 'suspended', 'pending'];

/** Approve, reject or suspend a professional (admin only). */
export async function updateProfessionalStatus(uid: string, status: ProStatus): Promise<{ ok: boolean; error?: string }> {
  const auth = await verifyAdminApi();
  if (!auth.authorized) return { ok: false, error: 'Unauthorized' };
  if (typeof uid !== 'string' || uid.length === 0 || uid.length > 128 || !ALLOWED.includes(status)) {
    return { ok: false, error: 'Invalid request' };
  }
  try {
    await setProfessionalStatus(uid, status);
    revalidatePath('/admin');
    return { ok: true };
  } catch (err) {
    console.error('[DATABASE ERROR in updateProfessionalStatus]:', err);
    return { ok: false, error: 'Could not update. Please try again.' };
  }
}
