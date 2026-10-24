'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction, AuthState } from '@/app/actions/authActions';
import { ShieldCheck, Lock, User, ArrowRight, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(loginAction, null);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between p-6 sm:p-10 font-sans selection:bg-white selection:text-black">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to HomeFix
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Online
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-12">
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Ambient Light Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-zinc-800/30 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative">
            {/* Header / Identity */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 mb-4 text-white">
                <ShieldCheck className="w-6 h-6 text-zinc-100" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                HOMEFIX
              </h1>
              <p className="text-xs uppercase tracking-widest text-zinc-400 mt-1 font-mono">
                Operations & Lead Portal
              </p>
            </div>

            {/* Error Message */}
            {state?.error && (
              <div
                role="alert"
                className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-medium">{state.error}</span>
              </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Admin Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    disabled={isPending}
                    placeholder="Enter admin ID"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Passcode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    disabled={isPending}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all disabled:opacity-50 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 px-4 rounded-lg bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-white/5"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Access Operations
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center max-w-6xl w-full mx-auto">
        <p className="text-[11px] text-zinc-600 font-mono tracking-wider">
          HOMEFIX SECURE GATEWAY &bull; RESTRICTED ACCESS ONLY
        </p>
      </div>
    </div>
  );
}
