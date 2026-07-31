import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200" role="dialog" aria-modal="true">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <h3 className="text-lg font-semibold text-zinc-900 m-0">{title}</h3>
            <button 
              className="text-zinc-400 hover:text-zinc-600 transition-colors bg-transparent border-none cursor-pointer p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800" 
              onClick={onClose} 
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};
