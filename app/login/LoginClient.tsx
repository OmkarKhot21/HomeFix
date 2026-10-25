'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { ArrowLeft, Loader2, Mail, ShieldCheck } from 'lucide-react';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebaseClient';
import { startUserSession } from '@/app/actions/userActions';
import RoleChooser from '@/components/RoleChooser';

type Mode = 'signin' | 'signup' | 'reset';

function friendlyError(err: unknown): string | null {
  const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: string }).code) : '';
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return null; // user closed the popup themselves
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google popup. Please allow popups and try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in instead.';
    case 'auth/weak-password':
      return 'Please choose a password with at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This login method isn’t enabled yet. Please try Google instead.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network problem. Please check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

const inputClass =
  'mt-2 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900';

export default function LoginClient({
  serviceSlug,
  serviceName,
  nextPath,
  alreadyLoggedInName,
}: {
  serviceSlug: string | null;
  serviceName: string | null;
  nextPath: string | null;
  alreadyLoggedInName: string | null;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<null | 'google' | 'email'>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [chooserName, setChooserName] = useState<string | null>(alreadyLoggedInName);

  function switchMode(next: Mode) {
    setMode(next);
    setError('');
    setNotice('');
  }

  async function finishLogin(user: User) {
    // forceRefresh so a name set during sign-up is included in the token
    const idToken = await user.getIdToken(true);
    const res = await startUserSession(idToken);
    // Our own session cookie is the source of truth; drop the Firebase browser session.
    await signOut(getFirebaseAuth()).catch(() => {});
    if (!res.ok) {
      setError(res.error);
      setBusy(null);
      return;
    }

    if (serviceSlug) {
      router.push(`/book?service=${serviceSlug}`);
    } else if (nextPath) {
      router.push(nextPath);
    } else {
      setBusy(null);
      setChooserName(user.displayName ?? '');
    }
    router.refresh();
  }

  async function handleGoogle() {
    setError('');
    setNotice('');
    setBusy('google');
    try {
      const result = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
      await finishLogin(result.user);
    } catch (err) {
      const msg = friendlyError(err);
      if (msg) setError(msg);
      setBusy(null);
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setNotice('');
    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setBusy('email');
    const auth = getFirebaseAuth();
    try {
      if (mode === 'reset') {
        await sendPasswordResetEmail(auth, cleanEmail);
        setNotice('If an account exists for this email, we’ve sent a link to reset your password.');
        setBusy(null);
        return;
      }

      if (password.length < 6) {
        setError('Please enter a password with at least 6 characters.');
        setBusy(null);
        return;
      }

      if (mode === 'signup') {
        if (name.trim().length < 2) {
          setError('Please enter your name.');
          setBusy(null);
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await updateProfile(result.user, { displayName: name.trim().slice(0, 80) });
        await finishLogin(result.user);
      } else {
        const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
        await finishLogin(result.user);
      }
    } catch (err) {
      // For password resets, don't reveal whether the email exists.
      if (mode === 'reset') {
        setNotice('If an account exists for this email, we’ve sent a link to reset your password.');
      } else {
        setError(friendlyError(err) ?? 'Something went wrong. Please try again.');
      }
      setBusy(null);
    }
  }

  const title =
    mode === 'reset'
      ? 'Reset your password'
      : mode === 'signup'
        ? 'Create your HomeFix account'
        : serviceName
          ? `Log in to book ${serviceName}`
          : 'Log in to HomeFix';

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-black">
          <ArrowLeft size={16} /> Back to HomeFix
        </Link>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-black font-display text-lg font-extrabold text-white">HF</span>
            <span className="font-display text-xl font-bold tracking-tight">HOMEFIX</span>
          </div>

          <h1 className="mt-6 font-display text-2xl font-extrabold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {mode === 'reset' ? 'Enter your email and we’ll send you a reset link.' : 'Continue with Google or your email.'}
          </p>

          {!isFirebaseConfigured ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Login is being set up. Please check back soon, or request a callback from the home page.
            </div>
          ) : (
            <>
              {mode !== 'reset' && (
                <>
                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={busy !== null}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-900 transition hover:border-slate-900 disabled:opacity-60"
                  >
                    {busy === 'google' ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
                      </svg>
                    )}
                    Continue with Google
                  </button>

                  <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
                  </div>
                </>
              )}

              <form onSubmit={handleEmail} className={mode === 'reset' ? 'mt-6 space-y-4' : 'space-y-4'} noValidate>
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="login-name" className="text-sm font-semibold text-slate-800">Your name</label>
                    <input
                      id="login-name"
                      type="text"
                      autoComplete="name"
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="login-email" className="text-sm font-semibold text-slate-800">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    maxLength={200}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                {mode !== 'reset' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="login-password" className="text-sm font-semibold text-slate-800">Password</label>
                      {mode === 'signin' && (
                        <button type="button" onClick={() => switchMode('reset')} className="text-xs font-semibold text-slate-600 hover:text-black">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <input
                      id="login-password"
                      type="password"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      maxLength={128}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                      className={inputClass}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy !== null}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
                >
                  {busy === 'email' ? <Loader2 size={18} className="animate-spin" /> : <Mail size={16} />}
                  {mode === 'reset' ? 'Send reset link' : mode === 'signup' ? 'Create account' : 'Log in with email'}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-600">
                {mode === 'signin' && (
                  <>
                    New to HomeFix?{' '}
                    <button type="button" onClick={() => switchMode('signup')} className="font-bold text-slate-900 hover:underline">
                      Create an account
                    </button>
                  </>
                )}
                {mode === 'signup' && (
                  <>
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('signin')} className="font-bold text-slate-900 hover:underline">
                      Log in
                    </button>
                  </>
                )}
                {mode === 'reset' && (
                  <button type="button" onClick={() => switchMode('signin')} className="font-bold text-slate-900 hover:underline">
                    Back to log in
                  </button>
                )}
              </p>
            </>
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800">
              {notice}
            </p>
          )}

          <p className="mt-6 flex items-start gap-2 text-xs text-slate-500">
            <ShieldCheck size={14} className="mt-0.5 shrink-0" />
            We only use your email to manage your bookings. No spam.
          </p>
        </div>
      </div>

      {chooserName !== null && <RoleChooser name={chooserName} />}
    </main>
  );
}
