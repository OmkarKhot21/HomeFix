'use client';

import { useState } from 'react';
import { Loader2, MapPin, Plus, Trash2, Check } from 'lucide-react';
import { saveProfile, removeAddress } from '@/app/actions/customerActions';
import AddressPicker from './AddressPicker';
import type { Address } from '@/lib/liveDb';

const inputClass =
  'mt-1.5 w-full rounded-2xl border-2 border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900';

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string | null }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setStatus('saving');
    const res = await saveProfile(new FormData(e.currentTarget));
    if (res.ok) {
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } else {
      setStatus('idle');
      setError(res.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-neutral-800">Full name</label>
        <input id="name" name="name" defaultValue={name} maxLength={80} autoComplete="name" className={inputClass} />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-semibold text-neutral-800">Mobile number</label>
        <div className="mt-1.5 flex items-center rounded-2xl border-2 border-neutral-200 bg-white px-3 focus-within:border-neutral-900">
          <span className="border-r border-neutral-200 pr-3 text-sm font-bold text-neutral-500">+91</span>
          <input id="phone" name="phone" type="tel" inputMode="numeric" maxLength={10} defaultValue={phone} placeholder="98765 43210" className="w-full bg-transparent px-3 py-3 text-sm text-neutral-900 outline-none" />
        </div>
      </div>
      {email && (
        <div>
          <span className="text-sm font-semibold text-neutral-800">Email</span>
          <p className="mt-1.5 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">{email}</p>
        </div>
      )}
      {error && <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={status === 'saving'}
        className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-bold text-white hover:bg-black disabled:opacity-60"
      >
        {status === 'saving' && <Loader2 size={16} className="animate-spin" />}
        {status === 'saved' && <Check size={16} />}
        {status === 'saved' ? 'Saved' : 'Save changes'}
      </button>
    </form>
  );
}

export function AddressBook({ initial }: { initial: Address[] }) {
  const [addresses, setAddresses] = useState(initial);
  const [showPicker, setShowPicker] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this address?')) return;
    setDeleting(id);
    setError('');
    const res = await removeAddress(id);
    setDeleting(null);
    if (res.ok) setAddresses((list) => list.filter((a) => a.id !== id));
    else setError(res.error);
  }

  return (
    <div>
      <ul className="space-y-2">
        {addresses.map((a) => (
          <li key={a.id} className="flex items-start gap-3 rounded-2xl border-2 border-neutral-200 p-4">
            <MapPin size={18} className="mt-0.5 shrink-0 text-neutral-900" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-neutral-900">{a.label}</span>
              <span className="block text-sm text-neutral-600">{[a.line1, a.line2].filter(Boolean).join(', ')}</span>
            </span>
            <button
              type="button"
              onClick={() => handleDelete(a.id)}
              disabled={deleting === a.id}
              aria-label={`Delete ${a.label} address`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-600"
            >
              {deleting === a.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          </li>
        ))}
      </ul>
      {error && <p role="alert" className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}
      <button
        type="button"
        onClick={() => setShowPicker(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 p-4 text-sm font-bold text-neutral-900 hover:border-neutral-900"
      >
        <Plus size={16} /> Add new address
      </button>
      {showPicker && (
        <AddressPicker
          onClose={() => setShowPicker(false)}
          onSaved={(a) => {
            setAddresses((list) => [a, ...list]);
            setShowPicker(false);
          }}
        />
      )}
    </div>
  );
}
