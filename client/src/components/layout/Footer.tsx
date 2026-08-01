import React from 'react';
import { Link } from 'react-router';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-zinc-500">
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-zinc-800 hover:underline transition-colors">Privacy Policy</Link>
            <span className="text-zinc-300">·</span>
            <Link to="/terms" className="hover:text-zinc-800 hover:underline transition-colors">Terms of Use</Link>
          </div>
          <div>© {new Date().getFullYear()} IDSC Pulse. Built for the Infotech Development Systems College community.</div>
        </div>
      </div>
    </footer>
  );
};
