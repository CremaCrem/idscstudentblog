import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Student Blog Showcase. Built for decentralized learning.
        </div>
      </div>
    </footer>
  );
};
