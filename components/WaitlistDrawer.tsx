'use client';

import { useState } from 'react';
import { X, Smartphone, Loader2, CheckCircle2 } from 'lucide-react';
import { captureWaitlist } from '@/app/actions/captureLead';

export default function WaitlistDrawer({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    const res = await captureWaitlist(formData);
    if (res.success) {
      setStatus('success');
    } else {
      setStatus('idle');
      alert('Error joining waitlist.');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative border-2 border-black shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-5">
            <Smartphone size={28} />
          </div>
          <h3 className="text-2xl font-extrabold font-display mb-2">Join HomeFix Waitlist</h3>
          <p className="text-slate-600 text-sm mb-6">
            Get early access to our platform for zero-friction service booking in MMR.
          </p>

          {status === 'success' ? (
            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200">
              <CheckCircle2 size={32} className="mx-auto mb-3 text-emerald-600" />
              <h4 className="font-bold mb-1">You&apos;re on the list!</h4>
              <p className="text-sm">We&apos;ll text you a download link as soon as we launch in your area.</p>
            </div>
          ) : (
            <form action={handleSubmit} className="text-left">
              <div className="mb-4">
                <div className="flex border-2 border-black rounded-xl overflow-hidden focus-within:ring-4 ring-slate-200 transition-all">
                  <span className="bg-slate-50 px-4 py-3 font-bold text-slate-500 border-r border-slate-200">+91</span>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile" 
                    className="w-full px-4 py-3 focus:outline-none font-body"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-black text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Join Waitlist via SMS'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
