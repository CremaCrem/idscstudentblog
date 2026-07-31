import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'health-healthy' | 'health-warning' | 'health-broken';
  dot?: boolean;
}

const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full border whitespace-nowrap";

const variantClasses = {
  'default': "bg-stone-100 text-stone-700 border-transparent",
  'health-healthy': "bg-emerald-50 text-emerald-700 border-emerald-200/50",
  'health-warning': "bg-amber-50 text-amber-700 border-amber-200/50",
  'health-broken': "bg-red-50 text-red-700 border-red-200/50",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', dot, children, ...props }, ref) => {
    
    const getDotClass = () => {
      const base = "w-2 h-2 rounded-full";
      if (variant === 'health-healthy') return `${base} bg-emerald-600`;
      if (variant === 'health-warning') return `${base} bg-amber-600`;
      if (variant === 'health-broken') return `${base} bg-red-600`;
      return '';
    };

    const classNames = [
      baseClasses,
      variantClasses[variant],
      className
    ].filter(Boolean).join(' ');

    return (
      <span ref={ref} className={classNames} {...props}>
        {dot && <span className={getDotClass()} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
