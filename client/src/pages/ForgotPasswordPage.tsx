import React from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/Button';

const ADMIN_CONTACT_URL = import.meta.env.VITE_ADMIN_CONTACT_URL;

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="flex min-h-full flex-1">
      <div className="hidden md:flex flex-1 relative flex-col justify-center p-16 overflow-hidden bg-gradient-to-br from-emerald-800 to-[#022c22]">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display font-bold text-5xl text-white m-0 tracking-tight">Locked Out?</h2>
          <p className="text-white/80 text-lg mt-6 leading-relaxed m-0">
            Password resets are handled personally by the IDSC administrator to keep your account safe.
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md text-center">
          <h1 className="font-semibold text-2xl text-zinc-900 mb-4 m-0">Forgot your password?</h1>
          <p className="text-zinc-600 leading-relaxed m-0">
            Message the IDSC administrator with your <strong>full name</strong> and <strong>student ID</strong>.
            Once your identity is confirmed, you'll receive a one-time reset link that is valid for 30 minutes.
          </p>
          {ADMIN_CONTACT_URL && (
            <Button asChild variant="primary" shape="pill" className="w-full mt-8">
              <a href={ADMIN_CONTACT_URL} target="_blank" rel="noopener noreferrer">Message the Administrator</a>
            </Button>
          )}
          <div className="mt-8 text-sm text-zinc-500">
            Remembered it? <Link to="/login" className="text-emerald-800 font-medium hover:underline">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
