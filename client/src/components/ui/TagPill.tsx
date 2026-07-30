import React from 'react';

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
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors
        ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface text-text-secondary border border-border'}
        ${onClick ? 'cursor-pointer hover:bg-primary/20' : ''}
      `}
      onClick={onClick}
    >
      <span className="font-semibold text-primary/60">#</span>
      {label}
      
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-primary/60 hover:text-primary transition-colors focus:outline-none"
          aria-label={`Remove tag ${label}`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};
