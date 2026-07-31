import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router';
import { ChevronDown, ShieldAlert, LayoutDashboard, LogOut } from 'lucide-react';

export const UserDropdown: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
        className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 hover:bg-zinc-100 border border-zinc-200 rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/50"
      >
        <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
          {user.username.substring(0, 2)}
        </div>
        <span className="text-sm font-medium text-zinc-900">{user.username}</span>
        {isAdmin && (
          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 bg-amber-100 border border-amber-200 text-amber-800 font-semibold rounded">
            Admin
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-3 border-b border-zinc-100 mb-1">
            <p className="text-xs text-zinc-500 m-0">Signed in as</p>
            <p className="text-sm font-semibold text-zinc-900 truncate m-0 mt-0.5">{user.email}</p>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-stone-50 hover:text-zinc-900 transition-colors focus-visible:bg-stone-50 focus-visible:outline-none"
              onClick={() => setOpen(false)}
            >
              <ShieldAlert className="w-4 h-4 text-zinc-500" />
              Admin Dashboard
            </Link>
          )}

          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-stone-50 hover:text-zinc-900 transition-colors focus-visible:bg-stone-50 focus-visible:outline-none"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="w-4 h-4 text-zinc-500" />
            My Dashboard
          </Link>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer mt-1 border-t border-zinc-100 pt-2 focus-visible:bg-red-50 focus-visible:outline-none"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
