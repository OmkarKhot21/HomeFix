'use client';

import { useState, useEffect } from 'react';
import { X, ChartLine, Loader2, CheckCircle2 } from 'lucide-react';
import { captureInvestor } from '@/app/actions/captureLead';

export default function LeadCaptureModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  async function handleSubmit(formData: FormData) {
    setErrorMessage('');
    setStatus('loading');
    try {
      const res = await captureInvestor(formData);
      if ('success' in res && res.success) {
        setStatus('success');
      } else {
        setStatus('idle');
        setErrorMessage('error' in res && res.error ? res.error : 'Could not send your message. Please try again.');
      }
    } catch {
      setStatus('idle');
      setErrorMessage('Something went wrong. Please try again.');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative border-2 border-black shadow-2xl max-h-[92dvh] overflow-y-auto">
        <button 
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-neutral-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-5">
            <ChartLine size={28} />
          </div>
          <h3 className="text-2xl font-extrabold font-display mb-2">Write to the HomeFix team</h3>
          <p className="text-neutral-600 text-sm mb-6">
            Interested in investing in or partnering with HomeFix? Send us an email and our founders will get back to you.
          </p>

          {status === 'success' ? (
            <div className="bg-brand-50 text-neutral-900 p-6 rounded-2xl border border-brand/50">
              <CheckCircle2 size={32} className="mx-auto mb-3 text-neutral-900" />
              <h4 className="font-bold mb-1">Message sent!</h4>
              <p className="text-sm">Thanks for writing to us. We&apos;ll reply to your email soon.</p>
            </div>
          ) : (
            <form action={handleSubmit} className="text-left relative">
              <input 
                type="text" 
                name="website" 
                tabIndex={-1} 
                autoComplete="off" 
                aria-hidden="true" 
                className="absolute -left-[9999px] opacity-0 pointer-events-none" 
              />
              <div className="mb-4">
                <label htmlFor="inv-name" className="block text-sm font-bold text-neutral-700 mb-2">Your name</label>
                <input
                  id="inv-name"
                  type="text"
                  name="name"
                  required
                  maxLength={80}
                  autoComplete="name"
                  onChange={() => errorMessage && setErrorMessage('')}
                  placeholder="Full name"
                  className="w-full border-2 border-black rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ring-neutral-200 transition-all"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="inv-email" className="block text-sm font-bold text-neutral-700 mb-2">Your email</label>
                <input
                  id="inv-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full border-2 border-black rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ring-neutral-200 transition-all"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="inv-message" className="block text-sm font-bold text-neutral-700 mb-2">Message</label>
                <textarea
                  id="inv-message"
                  name="message"
                  required
                  rows={4}
                  maxLength={2000}
                  onChange={() => errorMessage && setErrorMessage('')}
                  placeholder="Tell us a little about yourself and what you'd like to discuss."
                  className="w-full border-2 border-black rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ring-neutral-200 transition-all"
                />
                {errorMessage && (
                  <p className="text-xs font-semibold text-red-600 mt-2">
                    {errorMessage}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-black text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Send email'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
