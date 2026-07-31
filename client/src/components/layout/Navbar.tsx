import React from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { UserDropdown } from './UserDropdown';
import { ArrowUpRight, Plus } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 lg:px-10">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold font-display flex items-center gap-1 hover:opacity-80 transition-opacity">
            IDSC Student Blogs <ArrowUpRight className="w-5 h-5 text-emerald-800" />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">About</Link>
          <Link to="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Explore Topics</Link>
          <Link to="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Latest Posts</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button asChild variant="accent" shape="pill" size="sm">
                <Link to="/dashboard" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> New Post
                </Link>
              </Button>
              <UserDropdown />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Log In</Link>
              <Button asChild variant="accent" shape="pill" size="sm">
                <Link to="/login">Submit Blog</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
