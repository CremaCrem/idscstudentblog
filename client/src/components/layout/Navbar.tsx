import React, { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { UserDropdown } from './UserDropdown';
import { ArrowUpRight, Plus, Menu, X, Share2, Check } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 lg:px-10">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold font-display flex items-center gap-1 hover:opacity-80 transition-opacity">
            IDSC Pulse <ArrowUpRight className="w-5 h-5 text-emerald-800" />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">About</Link>
          <Link to="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Explore Topics</Link>
          <Link to="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Latest Posts</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors px-3 py-2 rounded-md hover:bg-zinc-100"
            title="Copy page link"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {isCopied ? <span className="text-emerald-600">Copied!</span> : <span>Share</span>}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button asChild variant="accent" shape="pill" size="sm">
                <Link to="/dashboard" className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Share Write-Up
                </Link>
              </Button>
              <UserDropdown />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Log In</Link>
              <Button asChild variant="accent" shape="pill" size="sm">
                <Link to="/login">Share Your Write-Up</Link>
              </Button>
            </div>
          )}
        </div>

        <button 
          className="md:hidden p-2 -mr-2 text-zinc-600 hover:text-zinc-900 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-zinc-200 p-6 flex flex-col gap-6 shadow-xl">
          <nav className="flex flex-col gap-4">
            <Link to="/about" className="text-lg font-medium text-zinc-800" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link to="/" className="text-lg font-medium text-zinc-800" onClick={() => setIsMobileMenuOpen(false)}>Explore Topics</Link>
            <Link to="/" className="text-lg font-medium text-zinc-800" onClick={() => setIsMobileMenuOpen(false)}>Latest Posts</Link>
          </nav>
          
          <div className="pt-6 border-t border-zinc-100 flex flex-col gap-4">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 font-medium py-2 text-zinc-800 bg-zinc-100 rounded-full"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              {isCopied ? 'Link Copied!' : 'Share This Page'}
            </button>
            {isAuthenticated ? (
              <>
                <Button asChild variant="accent" shape="pill" className="w-full justify-center">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Plus className="w-4 h-4 mr-2" /> Share Write-Up
                  </Link>
                </Button>
                <div className="flex justify-center">
                  <UserDropdown />
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-center font-medium text-zinc-800 py-2" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                <Button asChild variant="accent" shape="pill" className="w-full justify-center">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Share Your Write-Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
