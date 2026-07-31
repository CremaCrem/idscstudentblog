import React from 'react';
import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 p-4 lg:p-8 flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="w-full min-h-[90vh] flex flex-col bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};
