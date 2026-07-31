import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'pill';
  asChild?: boolean;
}

const baseClasses = "inline-flex items-center justify-center gap-2 font-medium border border-transparent cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = {
  primary: "bg-zinc-900 text-white hover:bg-black shadow-sm",
  accent: "bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm",
  outline: "bg-transparent border-zinc-200 text-zinc-900 hover:bg-stone-50",
  ghost: "bg-transparent text-zinc-600 hover:text-zinc-900",
  destructive: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
};

const sizeClasses = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const shapeClasses = {
  default: "rounded-xl",
  pill: "rounded-full",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', shape = 'default', asChild = false, children, ...props }, ref) => {
    const classNames = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      shapeClasses[shape],
      className
    ].filter(Boolean).join(' ');

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: [classNames, child.props.className].filter(Boolean).join(' '),
        ...props
      });
    }

    return (
      <button ref={ref} className={classNames} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
