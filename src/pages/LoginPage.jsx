import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock, User, Loader2, Eye, EyeOff, Mail, AtSign,
  ShieldCheck, ArrowLeft,
} from 'lucide-react';
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

/* ------------------------------------------------------------------ */
/* Sign-in / sign-up form                                              */
/* ------------------------------------------------------------------ */

function AuthForm({ isSignup, form, update, showPassword, setShowPassword, strength, error, isLoading, canSubmit, onSubmit, switchMode }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {isSignup && (
        <>
          <Field icon={User} label="Full name">
            <input
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={update('name')}
              className={inputClass}
              placeholder="Alex Johnson"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field icon={AtSign} label="Username">
              <input
                type="text"
                required
                autoComplete="username"
                value={form.username}
                onChange={update('username')}
                className={inputClass}
                placeholder="alexj"
              />
            </Field>
            <Field icon={Mail} label="Email">
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={update('email')}
                className={inputClass}
                placeholder="you@company.com"
              />
            </Field>
          </div>
        </>
      )}

      {!isSignup && (
        <Field icon={AtSign} label="Username or email">
          <input
            type="text"
            required
            autoComplete="username"
            value={form.identifier}
            onChange={update('identifier')}
            className={inputClass}
            placeholder="alexj or you@company.com"
          />
        </Field>
      )}

      <Field icon={Lock} label="Password">
        <input
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete={isSignup ? 'new-password' : 'current-password'}
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

      {isSignup && form.password.length > 0 && <PasswordMeter strength={strength} />}

      {!isSignup && (
        <div className="flex justify-end -mt-1">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
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
            {isSignup ? 'Creating account…' : 'Signing in…'}
          </>
        ) : (
          <>
            <ShieldCheck size={18} />
            {isSignup ? 'Create Account' : 'Sign In'}
          </>
        )}
      </button>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400">
        {isSignup ? 'Already have an account? ' : "Don't have an account? "}
        <button
          type="button"
          onClick={() => switchMode(isSignup ? 'login' : 'signup')}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          {isSignup ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </form>
  );
}
/* ------------------------------------------------------------------ */
/* Auth card (header + tabs + form)                                    */
/* ------------------------------------------------------------------ */

function AuthCard(props) {
  const { mode, isSignup, switchMode } = props;

  return (
    <div className="w-full max-w-md">
      {/* Mobile brand */}
      <MobileBrand />

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isSignup
              ? 'Start managing your business in minutes.'
              : 'Sign in to access your dashboard.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {[
            { id: 'login', label: 'Sign In' },
            { id: 'signup', label: 'Sign Up' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchMode(tab.id)}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AuthForm {...props} />
      </div>

      <p className="text-center mt-6 text-xs text-slate-400 dark:text-slate-500">
        <Link
          to="/help"
          className="hover:text-slate-600 dark:hover:text-slate-300 inline-flex items-center gap-1"
        >
          <ArrowLeft size={12} />
          Need help signing in?
        </Link>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    identifier: '',
    password: '',
    name: '',
    username: '',
    email: '',
  });

  const strength = usePasswordStrength(form.password);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || '/';

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user;
      if (mode === 'login') {
        user = await login({
          identifier: form.identifier.trim(),
          password: form.password,
        });
        toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      } else {
        user = await signup({
          name: form.name.trim(),
          username: form.username.trim().toLowerCase(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        });
        toast.success(`Account created. Welcome, ${user.name.split(' ')[0]}!`);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err?.message || 'Something went wrong. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignup = mode === 'signup';
  const canSubmit = isSignup ? strength.score === 4 : Boolean(form.identifier && form.password);

  return (
    <AuthScreen>
      <AuthCard
        mode={mode}
        isSignup={isSignup}
        switchMode={switchMode}
        form={form}
        update={update}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        strength={strength}
        error={error}
        isLoading={isLoading}
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
      />
    </AuthScreen>
  );
}