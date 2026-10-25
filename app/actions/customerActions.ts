'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser, createUserSession } from '@/lib/userAuth';
import { checkRateLimit } from '@/lib/rateLimit';
import { addressSchema, profileSchema, liveBookingSchema, bookingSchema } from '@/lib/validations';
import { getService } from '@/lib/services';
import { NIGHT_SLOT, canBookNightSlot, quotePrice } from '@/lib/pricing';
import {
  addAddress,
  deleteAddress,
  getAddress,
  updateUserProfile,
  createLiveBooking,
  cancelBookingByCustomer,
  tradeForCategory,
  setUserPhoneIfEmpty,
  setDefaultContact,
  type Address,
} from '@/lib/liveDb';

type Fail = { ok: false; error: string };

function todayInIndia(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export async function saveAddress(input: {
  label: string;
  line1: string;
  line2?: string;
  lat: number;
  lng: number;
}): Promise<{ ok: true; address: Address } | Fail> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Please log in again.' };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || 'Please check the address.' };

  try {
    const address = await addAddress(user.uid, parsed.data);
    revalidatePath('/app/profile');
    return { ok: true, address };
  } catch (err) {
    console.error('[DATABASE ERROR in saveAddress]:', err);
    return { ok: false, error: 'Could not save the address. Please try again.' };
  }
}

export async function removeAddress(id: string): Promise<{ ok: true } | Fail> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Please log in again.' };
  if (!/^\d{1,18}$/.test(String(id))) return { ok: false, error: 'Invalid address.' };
  try {
    await deleteAddress(user.uid, id);
    revalidatePath('/app/profile');
    return { ok: true };
  } catch (err) {
    console.error('[DATABASE ERROR in removeAddress]:', err);
    return { ok: false, error: 'Could not delete the address.' };
  }
}

export async function saveProfile(formData: FormData): Promise<{ ok: true } | Fail> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Please log in again.' };

  const parsed = profileSchema.safeParse({ name: formData.get('name'), phone: formData.get('phone') });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || 'Please check your details.' };

  try {
    await updateUserProfile(user.uid, parsed.data.name, parsed.data.phone);
    // Refresh the session so the new name shows everywhere.
    await createUserSession({ ...user, name: parsed.data.name, phone: `+91${parsed.data.phone}` });
    revalidatePath('/app', 'layout');
    return { ok: true };
  } catch (err) {
    console.error('[DATABASE ERROR in saveProfile]:', err);
    return { ok: false, error: 'Could not save your profile.' };
  }
}

export async function placeBooking(input: {
  service: string;
  addressId: string;
  phone: string;
  contactIsSelf: boolean;
  contactName?: string;
  saveContact?: boolean;
  timing: 'asap' | 'scheduled';
  preferredDate?: string;
  preferredSlot?: string;
  notes?: string;
}): Promise<{ ok: true; bookingId: string } | Fail> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Please log in again to book.' };

  const limit = await checkRateLimit(`booking:${user.uid}`, 6, 60 * 60 * 1000);
  if (!limit.allowed) return { ok: false, error: 'You have placed several bookings recently. Please try again later.' };

  const parsed = liveBookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message || 'Please check the booking.' };
  const d = parsed.data;

  const service = getService(d.service);
  if (!service) return { ok: false, error: 'Please choose a service.' };
  if (!d.contactIsSelf && (!d.contactName || d.contactName.length < 2)) {
    return { ok: false, error: 'Please enter the name of the person the professional should contact.' };
  }

  // Scheduled visits reuse the date/slot rules from the original booking form.
  let preferredDate = todayInIndia();
  let preferredSlot = 'As soon as possible';
  if (d.timing === 'scheduled') {
    const check = bookingSchema
      .pick({ preferredDate: true, preferredSlot: true })
      .safeParse({ preferredDate: d.preferredDate, preferredSlot: d.preferredSlot });
    if (!check.success) return { ok: false, error: check.error.issues[0]?.message || 'Please choose a date and time.' };
    preferredDate = check.data.preferredDate;
    preferredSlot = check.data.preferredSlot;
    if (preferredSlot === NIGHT_SLOT && !canBookNightSlot(service)) {
      return { ok: false, error: 'The night slot is only available for electrical work.' };
    }
  }

  // Price is always worked out here, using India time, never trusted from the browser.
  const quote = quotePrice(service, d.timing, preferredSlot);

  try {
    const address = await getAddress(user.uid, d.addressId);
    if (!address) return { ok: false, error: 'Please choose an address.' };

    const fullAddress = [`${address.line1}`, address.line2].filter(Boolean).join(', ');
    const bookingId = await createLiveBooking({
      uid: user.uid,
      service: service.name,
      trade: tradeForCategory(service.category),
      contactPhone: d.phone,
      contactName: d.contactIsSelf ? null : d.contactName,
      address: fullAddress,
      lat: address.lat,
      lng: address.lng,
      preferredDate,
      preferredSlot,
      notes: d.notes,
      priceEstimate: quote.total,
      nightCharge: quote.nightCharge,
    });

    // Remember contact choices (never blocks the booking if this fails).
    try {
      if (d.contactIsSelf) await setUserPhoneIfEmpty(user.uid, d.phone);
      if (d.saveContact) {
        if (d.contactIsSelf) await setDefaultContact(user.uid, null, null);
        else await setDefaultContact(user.uid, d.contactName, d.phone);
      }
    } catch (err) {
      console.error('[DATABASE ERROR saving contact preference]:', err);
    }

    return { ok: true, bookingId };
  } catch (err) {
    console.error('[DATABASE ERROR in placeBooking]:', err);
    return { ok: false, error: 'We could not place your booking. Please try again.' };
  }
}

export async function cancelBooking(id: string): Promise<{ ok: true } | Fail> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Please log in again.' };
  if (!/^\d{1,18}$/.test(String(id))) return { ok: false, error: 'Invalid booking.' };
  try {
    const done = await cancelBookingByCustomer(user.uid, id);
    return done ? { ok: true } : { ok: false, error: 'This booking can no longer be cancelled.' };
  } catch (err) {
    console.error('[DATABASE ERROR in cancelBooking]:', err);
    return { ok: false, error: 'Could not cancel. Please try again.' };
  }
}
