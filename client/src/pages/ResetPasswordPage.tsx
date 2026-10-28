import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../services/authApi';

export const ResetPasswordPage: React.FC = () => {
  const { token = '' } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.details?.find((d: any) => d.field === 'password')?.issue || err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1">
      <div className="hidden md:flex flex-1 relative flex-col justify-center p-16 overflow-hidden bg-gradient-to-br from-emerald-800 to-[#022c22]">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display font-bold text-5xl text-white m-0 tracking-tight">Fresh Start</h2>
          <p className="text-white/80 text-lg mt-6 leading-relaxed m-0">
            Choose a new password. You'll be signed out of every other device once it's saved.
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="font-semibold text-2xl text-zinc-900 mb-8 text-center m-0">Set a new password</h1>
          {done ? (
            <div className="px-4 py-3 rounded-xl text-sm font-medium text-center bg-emerald-100 text-emerald-900 border border-emerald-300">
              Your password has been reset. Redirecting you to login…
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm font-medium text-center bg-red-600 text-white">
                  {error}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-900">New Password</label>
                <Input
                  type="password"
                  placeholder="At least 8 characters, 1 letter and 1 number"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-zinc-900">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
              </div>
              <Button variant="primary" shape="pill" className="mt-4 w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Reset Password'}
              </Button>
            </form>
          )}
          <div className="mt-8 text-center text-sm text-zinc-500">
            <Link to="/login" className="text-emerald-800 font-medium hover:underline">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
