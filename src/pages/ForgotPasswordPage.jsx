import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, Send, ArrowLeft, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthScreen, MobileBrand, Field, inputClass } from '../components/AuthUi';
import { passwordApi } from '../services/api';

/**
 * /forgot-password — requests a reset link.
 * Replaces the old server-rendered EJS page; submits JSON to the API so the
 * request goes through the Vite proxy (same-origin) with the dashboard theme.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await passwordApi.forgotPassword({ email: email.trim() });
      setSent(true);
      toast.success('Reset link requested.');
    } catch (err) {
      const message = err?.message || 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreen>
      <div className="w-full max-w-md">
        <MobileBrand />

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Forgot password?
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter the email address tied to your account and we'll send you a link to choose a
              new password.
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div
                role="status"
                className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm font-medium border border-emerald-100 dark:border-emerald-900/60 flex items-start gap-2"
              >
                <Inbox size={16} className="mt-0.5 shrink-0" />
                <span>
                  If an account exists for that address, a reset link is on its way. The link is
                  valid for 15 minutes.
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Didn't get it? Check your spam folder, or{' '}
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  try again
                </button>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field icon={Mail} label="Email address">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@company.com"
                />
              </Field>

              {error && (
                <div
                  role="alert"
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/60"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send reset link
                  </>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Remembered it?{' '}
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthScreen>
  );
}
