'use server';

import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';
import { investorLeadSchema, waitlistLeadSchema } from '@/lib/validations';

export async function captureInvestor(formData: FormData) {
  const reqHeaders = await headers();
  const clientIp = extractClientIp(reqHeaders);

  // Rate Limiting: Max 10 submissions per 5 minutes per IP
  const rateLimit = await checkRateLimit(`lead_inv:${clientIp}`, 10, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return { error: 'Too many requests. Please try again in a few minutes.' };
  }

  // Honeypot check: reject bot submissions silently
  const honeypot = formData.get('website');
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { success: true };
  }

  const rawEmail = formData.get('email');
  const parseResult = investorLeadSchema.safeParse({ email: rawEmail });

  if (!parseResult.success) {
    return { error: parseResult.error.issues[0]?.message || 'Please provide a valid email address.' };
  }

  const { email } = parseResult.data;

  try {
    await db.addInvestor(email);
    return { success: true };
  } catch (err) {
    console.error('[DATABASE ERROR in captureInvestor]:', err);
    return { error: 'Unable to save lead. Please try again.' };
  }
}

export async function captureWaitlist(formData: FormData) {
  const reqHeaders = await headers();
  const clientIp = extractClientIp(reqHeaders);

  // Rate Limiting: Max 10 submissions per 5 minutes per IP
  const rateLimit = await checkRateLimit(`lead_wait:${clientIp}`, 10, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return { error: 'Too many requests. Please try again in a few minutes.' };
  }

  // Honeypot check: reject bot submissions silently
  const honeypot = formData.get('website');
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { success: true };
  }

  const rawPhone = formData.get('phone');
  const parseResult = waitlistLeadSchema.safeParse({ phone: rawPhone });

  if (!parseResult.success) {
    return {
      error: parseResult.error.issues[0]?.message || 'Please enter a valid 10 to 14 digit mobile number.',
    };
  }

  const { phone } = parseResult.data;

  try {
    await db.addWaitlist(phone);
    return { success: true };
  } catch (err) {
    console.error('[DATABASE ERROR in captureWaitlist]:', err);
    return { error: 'Unable to save lead. Please try again.' };
  }
}
