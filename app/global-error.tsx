'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex items-center justify-center min-h-screen font-sans bg-slate-50 text-slate-900">
        <div className="text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-sm">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-slate-600 mb-6">An unexpected error occurred.</p>
          <button 
            onClick={() => reset()}
            className="px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
