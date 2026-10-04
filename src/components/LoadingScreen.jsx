import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading state used while the session is being restored and by lazy-loaded
 * page boundaries.
 *
 * - `variant="fullscreen"` — covers the viewport (auth screens / boot).
 * - `variant="inline"`     — fills its parent (route transitions inside the
 *                            app shell) so the sidebar & navbar stay put.
 */
export default function LoadingScreen({
  message = 'Loading…',
  variant = 'fullscreen',
  className = '',
}) {
  const isInline = variant === 'inline';

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'w-full flex flex-col items-center justify-center gap-4 text-center',
        isInline
          ? 'min-h-[50vh] py-16'
          : 'min-h-screen bg-slate-50 dark:bg-slate-950',
        className,
      ].join(' ')}
    >
      {/* Badge + spinner, with breathing room so the spinner never clips. */}
      <div className="relative h-14 w-14 shrink-0">
        <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-600/25">
          D
        </div>
        <span className="absolute -bottom-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-900 ring-2 ring-slate-50 dark:ring-slate-950">
          <Loader2
            size={15}
            className="animate-spin text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
        </span>
      </div>

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
}