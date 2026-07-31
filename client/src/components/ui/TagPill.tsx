import React from 'react';
import { X } from 'lucide-react';

interface TagPillProps {
  label: string;
  onRemove?: () => void;
  isActive?: boolean;
  onClick?: () => void;
}

export const TagPill: React.FC<TagPillProps> = ({ label, onRemove, isActive = true, onClick }) => {
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors border
        ${isActive ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-stone-100 text-stone-700 border-transparent'}
        ${onClick && !isActive ? 'cursor-pointer hover:bg-stone-200' : ''}
        ${onClick && isActive ? 'cursor-pointer hover:bg-emerald-900' : ''}
      `}
      onClick={onClick}
    >
      {!isActive && <span className="font-semibold text-stone-400">#</span>}
      {label}
      
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={`ml-1 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 ${isActive ? 'text-white/70 hover:text-white focus-visible:ring-white' : 'text-stone-400 hover:text-stone-700 focus-visible:ring-emerald-800'}`}
          aria-label={`Remove tag ${label}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};
