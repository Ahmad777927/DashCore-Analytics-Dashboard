import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Lock, Loader2, Eye, EyeOff, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AuthScreen,
  MobileBrand,
  Field,
  PasswordMeter,
  inputClass,
  inputIconWithToggle,
  usePasswordStrength,
} from '../components/AuthUi';
import { passwordApi } from '../services/api';

/**
 * /reset-password/:token — validates the emailed token, then applies a new
 * password. Replaces the old server-rendered EJS pages (form + error states).
 */
export default function ResetPasswordPage() {
  const { token } = useParams();

  // 'checking' | 'valid' | 'invalid'
  const [status, setStatus] = useState('checking');
  const [invalidMessage, setInvalidMessage] = useState('');
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = usePasswordStrength(form.password);

  // Verify the link before showing the form (mirrors the old GET handler).
  useEffect(() => {
    let active = true;

    passwordApi
      .verifyResetToken(token)
      .then(() => {
        if (active) setStatus('valid');
      })
      .catch((err) => {
        if (!active) return;
        setInvalidMessage(
          err?.message || 'This reset link is invalid or has expired. Please request a new one.'
        );
        setStatus('invalid');
      });

    return () => {
      active = false;
    };
  }, [token]);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await passwordApi.resetPassword({
        token,
        password: form.password,
        confirm: form.confirm,
      });
      setDone(true);
      toast.success('Your password has been updated.');
    } catch (err) {
      const message = err?.message || 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);

      // Token expired between page load and submit — flip to the invalid state.
      if (err?.status === 400 && /reset link/i.test(message)) {
        setInvalidMessage(message);
        setStatus('invalid');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = strength.score === 4 && form.confirm.length > 0;

  /* Checking ---------------------------------------------------------------- */
  if (status === 'checking') {
    return (
      <AuthScreen>
        <div className="w-full max-w-md">
          <MobileBrand />
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
              <Loader2 className="animate-spin" size={18} />
              Checking your reset link…
            </div>
          </div>
        </div>
      </AuthScreen>
    );
  }

  /* Invalid link ------------------------------------------------------------ */
  if (status === 'invalid') {
    return (
      <AuthScreen>
        <div className="w-full max-w-md">
          <MobileBrand />
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="space-y-1.5">
              <div className="h-11 w-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Link invalid</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{invalidMessage}</p>
            </div>
            <Link
              to="/forgot-password"
              className="block w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all text-center shadow-lg shadow-blue-600/20"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </AuthScreen>
    );
  }

  /* Success ----------------------------------------------------------------- */
  if (done) {
    return (
      <AuthScreen>
        <div className="w-full max-w-md">
          <MobileBrand />
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="space-y-1.5">
              <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={22} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Password updated
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Your password has been changed successfully. You can now sign in with it.
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all text-center shadow-lg shadow-blue-600/20"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </AuthScreen>
    );
  }


  /* Form -------------------------------------------------------------------- */
  return (
    <AuthScreen>
      <div className="w-full max-w-md">
        <MobileBrand />

        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Choose a new password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Pick a strong password you haven't used here before.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field icon={Lock} label="New password">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                autoFocus
                value={form.password}
                onChange={update('password')}
                className={inputIconWithToggle}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Field>

            {form.password.length > 0 && <PasswordMeter strength={strength} />}

            <Field icon={Lock} label="Confirm password">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={form.confirm}
                onChange={update('confirm')}
                className={inputClass}
                placeholder="••••••••"
              />
            </Field>

            {form.confirm.length > 0 && form.password !== form.confirm && (
              <p className="text-xs text-red-500 dark:text-red-400 -mt-2">
                Passwords do not match
              </p>
            )}

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
              disabled={isLoading || !canSubmit}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Updating…
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Update password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </AuthScreen>
  );
}
