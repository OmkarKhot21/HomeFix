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
        setErrorMessage('error' in res && res.error ? res.error : 'Error capturing email.');
      }
    } catch {
      setStatus('idle');
      setErrorMessage('Something went wrong. Please try again.');
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative border-2 border-black shadow-2xl">
        <button 
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 text-slate-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-5">
            <ChartLine size={28} />
          </div>
          <h3 className="text-2xl font-extrabold font-display mb-2">HomeFix Investor Deck</h3>
          <p className="text-slate-600 text-sm mb-6">
            Access executive financial projections, unit economics, and MMR expansion playbooks.
          </p>

          {status === 'success' ? (
            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200">
              <CheckCircle2 size={32} className="mx-auto mb-3 text-emerald-600" />
              <h4 className="font-bold mb-1">Success!</h4>
              <p className="text-sm">Thanks! We&apos;ll email you the deck within 24 hours.</p>
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
                <label className="block text-sm font-bold text-slate-700 mb-2">Work Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  required
                  placeholder="partner@venturefund.com" 
                  className="w-full border-2 border-black rounded-xl px-4 py-3 focus:outline-none focus:ring-4 ring-slate-200 transition-all font-body"
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
                className="w-full bg-black text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Get Confidential Access'}
              </button>
            </form>
          )}
          
          <div className="bg-slate-50 p-4 rounded-xl text-left text-xs text-slate-500 mt-6 border border-slate-200">
            <p><strong>• Current Round:</strong> Seed Phase (Seeking ₹2.5 Cr)</p>
            <p><strong>• Margins:</strong> 18.5% Net Contribution After CAC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
