import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ username: identifier, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError({ message: err.message || 'An unexpected error occurred.', code: err.code });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1">
      <div className="hidden md:flex flex-1 relative flex-col justify-center p-16 overflow-hidden bg-gradient-to-br from-emerald-800 to-[#022c22]">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display font-bold text-5xl text-white m-0 tracking-tight">Welcome Back</h2>
          <p className="text-white/80 text-lg mt-6 leading-relaxed m-0">
            Access your student dashboard to manage your submitted technical blogs and track your verified links.
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h1 className="font-semibold text-2xl text-zinc-900 mb-8 text-center m-0">Sign in to your account</h1>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {error && (
              <div className={`px-4 py-3 rounded-xl text-sm font-medium text-center ${
                error.code === 'ACCOUNT_PENDING_APPROVAL' 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                  : error.code === 'ACCOUNT_REJECTED'
                  ? 'bg-red-100 text-red-900 border border-red-300'
                  : 'bg-red-600 text-white'
              }`}>
                {error.message}
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-900">Email or Username</label>
              <Input 
                type="text" 
                placeholder="student@university.edu" 
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-900">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button variant="primary" shape="pill" className="mt-4 w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account? <Link to="/register" className="text-emerald-800 font-medium hover:underline">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
