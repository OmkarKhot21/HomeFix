'use server';

import { getSessionUser } from '@/lib/userAuth';
import { checkRateLimit } from '@/lib/rateLimit';
import { partnerSchema, locationSchema, completeJobSchema } from '@/lib/validations';
import {
  getProfessional,
  upsertProfessional,
  setProfessionalOnline,
  updateProfessionalLocation,
  acceptBooking,
  declineBooking,
  releaseBooking,
  markArrived,
  markStarted,
  markCompleted,
  type Professional,
} from '@/lib/liveDb';

type Result = { ok: true } | { ok: false; error: string };

const validId = (id: unknown): id is string => typeof id === 'string' && /^\d{1,18}$/.test(id);

/** Loads the logged-in, approved professional or explains why not. */
async function requireApprovedPro(): Promise<{ pro: Professional } | { error: string }> {
  const user = await getSessionUser();
  if (!user) return { error: 'Please log in again.' };
  const pro = await getProfessional(user.uid);
  if (!pro) return { error: 'Please complete your professional sign-up first.' };
  if (pro.status !== 'approved') return { error: 'Your account is not approved yet.' };
  return { pro };
}

export async function applyAsProfessional(formData: FormData): Promise<Result> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Please log in again to continue.' };

  const limit = await checkRateLimit(`partner:${user.uid}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) return { ok: false, error: 'Too many attempts. Please try again later.' };

  const parsed = partnerSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    trade: formData.get('trade'),
    area: formData.get('area'),
    experienceYears: formData.get('experienceYears'),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || 'Please check the form.' };

  try {
    await upsertProfessional(user.uid, parsed.data);
    return { ok: true };
  } catch (err) {
    console.error('[DATABASE ERROR in applyAsProfessional]:', err);
    return { ok: false, error: 'We could not save your details. Please try again.' };
  }
}

export async function setOnline(online: boolean): Promise<Result> {
  const r = await requireApprovedPro();
  if ('error' in r) return { ok: false, error: r.error };
  try {
    await setProfessionalOnline(r.pro.uid, Boolean(online));
    return { ok: true };
  } catch (err) {
    console.error('[DATABASE ERROR in setOnline]:', err);
    return { ok: false, error: 'Could not change your status. Please try again.' };
  }
}

export async function reportLocation(lat: number, lng: number): Promise<Result> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Please log in again.' };
  const parsed = locationSchema.safeParse({ lat, lng });
  if (!parsed.success) return { ok: false, error: 'Invalid location.' };
  const limit = await checkRateLimit(`location:${user.uid}`, 30, 60 * 1000);
  if (!limit.allowed) return { ok: true }; // silently drop extra updates
  try {
    await updateProfessionalLocation(user.uid, parsed.data.lat, parsed.data.lng);
    return { ok: true };
  } catch (err) {
    console.error('[DATABASE ERROR in reportLocation]:', err);
    return { ok: false, error: 'Could not update location.' };
  }
}

export async function acceptJob(id: string): Promise<Result> {
  if (!validId(id)) return { ok: false, error: 'Invalid job.' };
  const r = await requireApprovedPro();
  if ('error' in r) return { ok: false, error: r.error };
  if (!r.pro.isOnline) return { ok: false, error: 'Go online to accept jobs.' };
  try {
    const ok = await acceptBooking(r.pro, id);
    return ok ? { ok: true } : { ok: false, error: 'Another professional accepted this job first.' };
  } catch (err) {
    console.error('[DATABASE ERROR in acceptJob]:', err);
    return { ok: false, error: 'Could not accept the job. Please try again.' };
  }
}

export async function declineJob(id: string): Promise<Result> {
  if (!validId(id)) return { ok: false, error: 'Invalid job.' };
  const r = await requireApprovedPro();
  if ('error' in r) return { ok: false, error: r.error };
  try {
    await declineBooking(r.pro.uid, id);
    return { ok: true };
  } catch (err) {
    console.error('[DATABASE ERROR in declineJob]:', err);
    return { ok: false, error: 'Could not decline. Please try again.' };
  }
}

export async function releaseJob(id: string): Promise<Result> {
  if (!validId(id)) return { ok: false, error: 'Invalid job.' };
  const r = await requireApprovedPro();
  if ('error' in r) return { ok: false, error: r.error };
  try {
    const ok = await releaseBooking(r.pro.uid, id);
    return ok ? { ok: true } : { ok: false, error: 'You can only cancel before you arrive.' };
  } catch (err) {
    console.error('[DATABASE ERROR in releaseJob]:', err);
    return { ok: false, error: 'Could not cancel the job. Please try again.' };
  }
}

export async function advanceJob(
  id: string,
  step: 'arrived' | 'started' | 'completed',
  amount?: number | string,
  paymentMethod?: string
): Promise<Result> {
  if (!validId(id)) return { ok: false, error: 'Invalid job.' };
  const r = await requireApprovedPro();
  if ('error' in r) return { ok: false, error: r.error };
  try {
    let ok = false;
    if (step === 'arrived') ok = await markArrived(r.pro.uid, id);
    else if (step === 'started') ok = await markStarted(r.pro.uid, id);
    else {
      const parsed = completeJobSchema.safeParse({ amount, paymentMethod });
      if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || 'Please enter the amount.' };
      ok = await markCompleted(r.pro.uid, id, parsed.data.amount, parsed.data.paymentMethod);
    }
    return ok ? { ok: true } : { ok: false, error: 'This job has already moved on. Refreshing…' };
  } catch (err) {
    console.error('[DATABASE ERROR in advanceJob]:', err);
    return { ok: false, error: 'Could not update the job. Please try again.' };
  }
}
