'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check, CalendarDays, Plus, Loader2, MapPin, Zap, ShieldCheck, ChevronDown, UserRound, Users } from 'lucide-react';
import { BOOKABLE_SERVICES, getService, servicePhotoUrl } from '@/lib/services';
import { BOOKING_SLOTS } from '@/lib/validations';
import { NIGHT_CHARGE, NIGHT_SLOT, canBookNightSlot, hasNightCharge, quotePrice } from '@/lib/pricing';
import { placeBooking } from '@/app/actions/customerActions';
import AddressPicker from './AddressPicker';
import { useNightNow } from '@/components/useNightNow';
import type { Address } from '@/lib/liveDb';

function nextDays(count: number): { value: string; day: string; date: string }[] {
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.now() + i * 86400000);
    const value = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    out.push({
      value,
      day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short' }),
      date: d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' }),
    });
  }
  return out;
}

const SCHEDULE_SLOTS = BOOKING_SLOTS.filter((s) => s !== 'As soon as possible');
const isMobile = (v: string) => /^[6-9]\d{9}$/.test(v);

const card = 'rounded-3xl bg-white p-5 ring-1 ring-neutral-200 sm:p-6';
const sub = 'border-t border-neutral-100 pt-5 mt-5';
const subTitle = 'block text-sm font-bold text-neutral-900';
const choice = (on: boolean) =>
  `rounded-2xl border-2 p-4 text-left transition ${on ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 hover:border-neutral-400'}`;
const textInput =
  'mt-1.5 w-full rounded-2xl border-2 border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-900';

function PhoneInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-1.5 flex items-center rounded-2xl border-2 border-neutral-200 bg-white px-3 focus-within:border-neutral-900">
      <span className="border-r border-neutral-200 pr-3 text-sm font-bold text-neutral-500">+91</span>
      <input
        id={id}
        type="tel"
        inputMode="numeric"
        maxLength={10}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        placeholder="98765 43210"
        className="w-full bg-transparent px-3 py-3 text-sm text-neutral-900 outline-none"
      />
    </div>
  );
}

// Booking order: service (preselected) → details (problem, address, contact, timing) → Book.
export default function BookFlow({
  initialService,
  initialAddresses,
  myName,
  myPhone: initialMyPhone,
  savedContact,
}: {
  initialService: string | null;
  initialAddresses: Address[];
  myName: string | null;
  myPhone: string;
  savedContact: { name: string; phone: string } | null;
}) {
  const router = useRouter();
  const [serviceSlug, setServiceSlug] = useState<string | null>(initialService);
  const [choosingService, setChoosingService] = useState(!initialService);
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [addressId, setAddressId] = useState<string | null>(initialAddresses[0]?.id ?? null);
  const [showPicker, setShowPicker] = useState(false);
  const [timing, setTiming] = useState<'asap' | 'scheduled'>('asap');
  const days = useMemo(() => nextDays(7), []);
  const [date, setDate] = useState(days[0].value);
  const [slot, setSlot] = useState<string>(SCHEDULE_SLOTS[0]);
  const [notes, setNotes] = useState('');
  // Who the professional should call: me, or someone else at the address.
  const [contactMode, setContactMode] = useState<'self' | 'other'>(savedContact ? 'other' : 'self');
  const [myPhone, setMyPhone] = useState(initialMyPhone);
  const [otherName, setOtherName] = useState(savedContact?.name ?? '');
  const [otherPhone, setOtherPhone] = useState(savedContact?.phone ?? '');
  const [saveContact, setSaveContact] = useState(Boolean(savedContact));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const service = getService(serviceSlug);
  const selectedAddress = addresses.find((a) => a.id === addressId) ?? null;
  const contactPhone = contactMode === 'self' ? myPhone : otherPhone;

  // Night slot only for electrical work; fall back to the first slot if the service changes.
  const slotOptions = service && canBookNightSlot(service) ? SCHEDULE_SLOTS : SCHEDULE_SLOTS.filter((s) => s !== NIGHT_SLOT);
  const effectiveSlot = slotOptions.includes(slot as (typeof SCHEDULE_SLOTS)[number]) ? slot : slotOptions[0];
  // Follows the real clock: the night charge only shows up from 8 PM (or for the night slot).
  const nightNow = useNightNow();
  const quote = service ? quotePrice(service, timing, effectiveSlot) : null;
  const nightNowApplies = Boolean(service && hasNightCharge(service) && nightNow);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!service) return setError('Please choose a service.');
    if (!addressId) return setError('Please add the address where you need the service.');
    if (contactMode === 'other' && otherName.trim().length < 2) return setError('Please enter the contact person’s name.');
    if (!isMobile(contactPhone)) return setError('Please enter a valid 10-digit mobile number for the contact.');
    setSubmitting(true);
    const res = await placeBooking({
      service: service.slug,
      addressId,
      phone: contactPhone,
      contactIsSelf: contactMode === 'self',
      contactName: contactMode === 'other' ? otherName.trim() : undefined,
      saveContact,
      timing,
      preferredDate: timing === 'scheduled' ? date : undefined,
      preferredSlot: timing === 'scheduled' ? effectiveSlot : undefined,
      notes,
    });
    if (res.ok) {
      router.push(`/app/bookings/${res.bookingId}`);
    } else {
      setSubmitting(false);
      setError(res.error);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4 pb-10" noValidate>
        <h1 className="font-display text-2xl font-extrabold text-neutral-900 sm:text-3xl">Book a professional</h1>

        {/* Service */}
        <section className={card} aria-labelledby="step-service">
          <h2 id="step-service" className="text-xs font-bold uppercase tracking-widest text-neutral-500">Service</h2>
          {service && !choosingService ? (
            <div className="mt-3 flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
                <Image src={servicePhotoUrl(service.photoId)} alt="" fill sizes="64px" className="object-cover" style={{ objectPosition: service.photoPosition ?? 'center 30%' }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-neutral-900">{service.name}</p>
                <p className="text-sm text-neutral-500">{service.summary}</p>
                <p className="mt-0.5 text-xs font-semibold text-neutral-700">From ₹{service.price} · {service.duration}</p>
              </div>
              <button type="button" onClick={() => setChoosingService(true)} className="shrink-0 text-sm font-bold text-neutral-900 hover:underline">
                Change
              </button>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BOOKABLE_SERVICES.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => {
                    setServiceSlug(s.slug);
                    setChoosingService(false);
                  }}
                  className={`rounded-2xl border-2 px-3 py-3 text-left transition ${
                    serviceSlug === s.slug ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <span className="block text-sm font-bold">{s.name}</span>
                  <span className={`block text-xs ${serviceSlug === s.slug ? 'text-white/70' : 'text-neutral-500'}`}>from ₹{s.price}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Details */}
        <section className={card} aria-labelledby="step-details">
          <h2 id="step-details" className="font-display text-lg font-extrabold text-neutral-900">Details</h2>

          {/* Problem */}
          <label htmlFor="notes" className={`${subTitle} mt-4`}>
            What’s the problem? <span className="font-normal text-neutral-500">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            maxLength={500}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Kitchen tap leaking from the base since yesterday"
            className={textInput}
          />

          {/* Address */}
          <div className={sub}>
            <span className={subTitle}>Address</span>
            <div className="mt-2 space-y-2">
              {addresses.length === 0 && <p className="text-sm text-neutral-500">Add the address where the professional should come.</p>}
              {addresses.map((a) => {
                const selected = a.id === addressId;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAddressId(a.id)}
                    aria-pressed={selected}
                    className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                      selected ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <MapPin size={18} className="mt-0.5 shrink-0 text-neutral-900" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-neutral-900">{a.label}</span>
                      <span className="block text-sm text-neutral-600">{[a.line1, a.line2].filter(Boolean).join(', ')}</span>
                    </span>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'}`}>
                      {selected && <Check size={12} className="text-white" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 p-4 text-sm font-bold text-neutral-900 hover:border-neutral-900"
              >
                <Plus size={16} /> Add new address
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className={sub}>
            <span className={subTitle}>Who should the professional call?</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setContactMode('self')} aria-pressed={contactMode === 'self'} className={choice(contactMode === 'self')}>
                <UserRound size={18} className={contactMode === 'self' ? 'text-brand' : 'text-neutral-900'} />
                <span className="mt-2 block text-sm font-bold">Me</span>
                <span className={`block truncate text-xs ${contactMode === 'self' ? 'text-white/70' : 'text-neutral-500'}`}>
                  {myName ? myName.split(' ')[0] : 'Your number'}
                </span>
              </button>
              <button type="button" onClick={() => setContactMode('other')} aria-pressed={contactMode === 'other'} className={choice(contactMode === 'other')}>
                <Users size={18} className={contactMode === 'other' ? 'text-brand' : 'text-neutral-900'} />
                <span className="mt-2 block text-sm font-bold">Someone else</span>
                <span className={`block text-xs ${contactMode === 'other' ? 'text-white/70' : 'text-neutral-500'}`}>Family, tenant, staff…</span>
              </button>
            </div>

            {contactMode === 'self' ? (
              <div className="mt-3">
                <label htmlFor="my-phone" className="text-sm font-semibold text-neutral-800">Your mobile number</label>
                <PhoneInput id="my-phone" value={myPhone} onChange={setMyPhone} />
              </div>
            ) : (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="other-name" className="text-sm font-semibold text-neutral-800">Contact name</label>
                  <input
                    id="other-name"
                    value={otherName}
                    onChange={(e) => setOtherName(e.target.value)}
                    maxLength={80}
                    placeholder="e.g. Sunita (mother)"
                    className={textInput}
                  />
                </div>
                <div>
                  <label htmlFor="other-phone" className="text-sm font-semibold text-neutral-800">Their mobile number</label>
                  <PhoneInput id="other-phone" value={otherPhone} onChange={setOtherPhone} />
                </div>
              </div>
            )}

            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl bg-neutral-50 p-3">
              <input
                type="checkbox"
                checked={saveContact}
                onChange={(e) => setSaveContact(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-neutral-900"
              />
              <span className="text-sm">
                <span className="block font-semibold text-neutral-900">Use this contact for all my future bookings</span>
                <span className="block text-xs text-neutral-500">You can change it any time while booking.</span>
              </span>
            </label>
            <p className="mt-2 text-xs text-neutral-500">The professional will call this number when they’re on the way.</p>
          </div>

          {/* Timing */}
          <div className={sub}>
            <span className={subTitle}>When do you need it?</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setTiming('asap')} aria-pressed={timing === 'asap'} className={choice(timing === 'asap')}>
                <Zap size={18} className={timing === 'asap' ? 'text-brand' : 'text-neutral-900'} />
                <span className="mt-2 block text-sm font-bold">Right now</span>
                <span className={`block text-xs ${timing === 'asap' ? 'text-white/70' : 'text-neutral-500'}`}>
                  {nightNowApplies ? `Night · +₹${NIGHT_CHARGE}` : 'Nearest pro, ~15 min'}
                </span>
              </button>
              <button type="button" onClick={() => setTiming('scheduled')} aria-pressed={timing === 'scheduled'} className={choice(timing === 'scheduled')}>
                <CalendarDays size={18} className={timing === 'scheduled' ? 'text-brand' : 'text-neutral-900'} />
                <span className="mt-2 block text-sm font-bold">Schedule</span>
                <span className={`block text-xs ${timing === 'scheduled' ? 'text-white/70' : 'text-neutral-500'}`}>Pick a day and time</span>
              </button>
            </div>
            {timing === 'scheduled' && (
              <div className="mt-3 space-y-3">
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {days.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDate(d.value)}
                      aria-pressed={date === d.value}
                      className={`shrink-0 rounded-2xl border-2 px-4 py-2.5 text-center transition ${
                        date === d.value ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <span className="block text-xs font-semibold opacity-80">{d.day}</span>
                      <span className="block text-sm font-bold">{d.date}</span>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <label htmlFor="slot" className="sr-only">Time slot</label>
                  <select
                    id="slot"
                    value={effectiveSlot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full appearance-none rounded-2xl border-2 border-neutral-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-neutral-900 outline-none focus:border-neutral-900"
                  >
                    {slotOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                </div>
                {service && canBookNightSlot(service) && (
                  <p className="text-xs text-neutral-500">Electrical jobs can also be booked at night, 8 PM – 12 AM.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Summary + Book */}
        <section className={card} aria-label="Booking summary">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Service</dt>
              <dd className="text-right font-semibold text-neutral-900">{service?.name ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Address</dt>
              <dd className="max-w-[60%] truncate text-right font-semibold text-neutral-900">
                {selectedAddress ? `${selectedAddress.label} · ${selectedAddress.line1}` : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Contact</dt>
              <dd className="max-w-[60%] truncate text-right font-semibold text-neutral-900">
                {contactMode === 'self' ? 'You' : otherName.trim() || 'Someone else'}
                {isMobile(contactPhone) ? ` · +91 ${contactPhone}` : ''}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">When</dt>
              <dd className="text-right font-semibold text-neutral-900">
                {timing === 'asap' ? 'Right now' : `${days.find((d) => d.value === date)?.day ?? date}, ${effectiveSlot}`}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-neutral-100 pt-3">
              <dt className="text-neutral-500">Visit charge</dt>
              <dd className="font-semibold text-neutral-900">{quote ? `₹${quote.base}` : '—'}</dd>
            </div>
            {quote && quote.nightCharge > 0 && (
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">Night charge (after 8 PM)</dt>
                <dd className="font-semibold text-neutral-900">+₹{quote.nightCharge}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-neutral-900">Total</dt>
              <dd className="font-display text-lg font-extrabold text-neutral-900">{quote ? `₹${quote.total}` : '—'}</dd>
            </div>
          </dl>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
            <ShieldCheck size={13} /> Pay after the job. Parts, if needed, are shown to you before fitting.
          </p>

          {error && <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-4 text-base font-extrabold text-white transition hover:bg-black disabled:opacity-60"
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {submitting ? 'Booking…' : 'Book'}
          </button>
          <p className="mt-3 text-center text-xs text-neutral-500">
            By booking, you agree to our{' '}
            <a href="/terms" target="_blank" className="font-semibold text-neutral-700 underline hover:text-black">Terms</a>, including the{' '}
            <a href="/terms#cancel" target="_blank" className="font-semibold text-neutral-700 underline hover:text-black">cancellation</a> and{' '}
            <a href="/terms#warranty" target="_blank" className="font-semibold text-neutral-700 underline hover:text-black">warranty</a> rules.
          </p>
        </section>
      </form>

      {/* Outside the booking form: the picker has its own form */}
      {showPicker && (
        <AddressPicker
          onClose={() => setShowPicker(false)}
          onSaved={(a) => {
            setAddresses((list) => [a, ...list]);
            setAddressId(a.id);
            setShowPicker(false);
          }}
        />
      )}
    </>
  );
}
