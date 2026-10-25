'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  verifyFirebaseIdToken,
  createUserSession,
  clearUserSession,
  getSessionUser,
  type SessionUser,
} from '@/lib/userAuth';
import { upsertUser, createBooking, upsertPartnerApplication } from '@/lib/db';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';
import { bookingSchema, partnerSchema } from '@/lib/validations';
import { getService } from '@/lib/services';

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Called by the login page after Firebase sign-in succeeds. */
export async function startUserSession(idToken: string): Promise<ActionResult> {
  const ip = extractClientIp(await headers());
  const limit = await checkRateLimit(`user_login:${ip}`, 10, 5 * 60 * 1000, { failClosed: true });
  if (!limit.allowed) {
    return { ok: false, error: 'Too many login attempts. Please wait a few minutes and try again.' };
  }

  if (typeof idToken !== 'string') return { ok: false, error: 'Login failed. Please try again.' };

  const user = await verifyFirebaseIdToken(idToken);
  if (!user) return { ok: false, error: 'We could not verify your login. Please try again.' };

  try {
    await upsertUser(user);
  } catch (err) {
    console.error('[DATABASE ERROR in startUserSession]:', err);
    return { ok: false, error: 'Login is temporarily unavailable. Please try again shortly.' };
  }

  await createUserSession(user);
  return { ok: true };
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  return getSessionUser();
}

export async function logoutUser(): Promise<void> {
  await clearUserSession();
  redirect('/');
}

export async function submitBooking(formData: FormData): Promise<ActionResult & { bookingId?: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Please log in again to book.' };

  const limit = await checkRateLimit(`booking:${user.uid}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) return { ok: false, error: 'You have sent several requests. Our team will call you shortly.' };

  const parsed = bookingSchema.safeParse({
    service: formData.get('service'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    preferredDate: formData.get('preferredDate'),
    preferredSlot: formData.get('preferredSlot'),
    notes: formData.get('notes') || undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || 'Please check the form.' };

  // Specific services and broad categories (e.g. "plumbing") are both allowed.
  const service = getService(parsed.data.service);
  if (!service) return { ok: false, error: 'Please choose a service.' };

  try {
    const bookingId = await createBooking({
      uid: user.uid,
      service: service.name,
      contactPhone: parsed.data.phone,
      address: parsed.data.address,
      preferredDate: parsed.data.preferredDate,
      preferredSlot: parsed.data.preferredSlot,
      notes: parsed.data.notes,
    });
    return { ok: true, bookingId };
  } catch (err) {
    console.error('[DATABASE ERROR in submitBooking]:', err);
    return { ok: false, error: 'We could not save your request. Please try again.' };
  }
}

export async function submitPartnerApplication(formData: FormData): Promise<ActionResult> {
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
    await upsertPartnerApplication({ uid: user.uid, ...parsed.data });
    return { ok: true };
  } catch (err) {
    console.error('[DATABASE ERROR in submitPartnerApplication]:', err);
    return { ok: false, error: 'We could not save your details. Please try again.' };
  }
}
