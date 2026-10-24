'use server';

import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { checkRateLimit, extractClientIp } from '@/lib/rateLimit';

// Sanitize string to remove any HTML tags and dangerous characters
function sanitizeInput(str: string): string {
  return str
    .replace(/[<>'"&]/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
const PHONE_REGEX = /^\+?[0-9]{10,14}$/;

export async function captureInvestor(formData: FormData) {
  const reqHeaders = await headers();
  const clientIp = extractClientIp(reqHeaders);

  // Rate Limiting: Max 10 submissions per 5 minutes per IP
  const rateLimit = checkRateLimit(`lead_inv:${clientIp}`, 10, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return { error: 'Too many requests. Please try again in a few minutes.' };
  }

  const rawEmail = formData.get('email');
  if (!rawEmail || typeof rawEmail !== 'string') {
    return { error: 'Valid email address is required.' };
  }

  const cleanEmail = sanitizeInput(rawEmail).toLowerCase();

  if (cleanEmail.length < 5 || cleanEmail.length > 120 || !EMAIL_REGEX.test(cleanEmail)) {
    return { error: 'Please provide a valid email address.' };
  }

  try {
    db.addInvestor(cleanEmail);
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
  const rateLimit = checkRateLimit(`lead_wait:${clientIp}`, 10, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return { error: 'Too many requests. Please try again in a few minutes.' };
  }

  const rawPhone = formData.get('phone');
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { error: 'Valid mobile number is required.' };
  }

  // Normalize: remove dashes, spaces, parentheses
  const normalizedPhone = rawPhone.replace(/[\s\-()]/g, '').trim();
  const cleanPhone = sanitizeInput(normalizedPhone);

  if (cleanPhone.length < 10 || cleanPhone.length > 15 || !PHONE_REGEX.test(cleanPhone)) {
    return { error: 'Please enter a valid 10 to 12 digit mobile number.' };
  }

  try {
    db.addWaitlist(cleanPhone);
    return { success: true };
  } catch (err) {
    console.error('[DATABASE ERROR in captureWaitlist]:', err);
    return { error: 'Unable to save lead. Please try again.' };
  }
}
