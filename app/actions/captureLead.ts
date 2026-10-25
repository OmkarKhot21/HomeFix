'use server';

import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';
import { investorMessageSchema, waitlistLeadSchema, callbackSchema } from '@/lib/validations';
import { addCallbackRequest, addInvestorMessage } from '@/lib/db';

export async function captureInvestor(formData: FormData) {
  const reqHeaders = await headers();
  const clientIp = extractClientIp(reqHeaders);

  // Rate Limiting: Max 5 investor messages per 10 minutes per IP
  const rateLimit = await checkRateLimit(`lead_inv:${clientIp}`, 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return { error: 'Too many requests. Please try again in a few minutes.' };
  }

  // Honeypot check: reject bot submissions silently
  const honeypot = formData.get('website');
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { success: true };
  }

  const parseResult = investorMessageSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parseResult.success) {
    return { error: parseResult.error.issues[0]?.message || 'Please check your details.' };
  }

  const { name, email, message } = parseResult.data;

  try {
    // Save the full message, and keep the email in the leads list as before.
    await addInvestorMessage({ name, email, message });
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

export async function captureCallback(formData: FormData) {
  const reqHeaders = await headers();
  const clientIp = extractClientIp(reqHeaders);

  // Rate Limiting: Max 5 callback requests per 10 minutes per IP
  const rateLimit = await checkRateLimit(`callback:${clientIp}`, 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return { error: 'Too many requests. Please try again in a few minutes.' };
  }

  // Honeypot check: reject bot submissions silently
  const honeypot = formData.get('website');
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return { success: true };
  }

  const parseResult = callbackSchema.safeParse({ phone: formData.get('phone') });
  if (!parseResult.success) {
    return { error: parseResult.error.issues[0]?.message || 'Please enter a valid 10-digit mobile number.' };
  }

  try {
    await addCallbackRequest(parseResult.data.phone);
    return { success: true };
  } catch (err) {
    console.error('[DATABASE ERROR in captureCallback]:', err);
    return { error: 'Unable to send your request. Please try again.' };
  }
}
