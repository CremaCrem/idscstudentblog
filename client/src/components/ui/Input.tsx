import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    const baseClasses = "w-full rounded-xl border bg-white px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50";
    const normalClasses = "border-zinc-300 focus:border-emerald-800 focus:ring-emerald-800/20";
    const errorClasses = "border-red-500 focus:border-red-500 focus:ring-red-500/20";

    const classNames = [
      baseClasses,
      error ? errorClasses : normalClasses,
      className
    ].filter(Boolean).join(' ');

    return (
      <input ref={ref} className={classNames} {...props} />
    );
  }
);

Input.displayName = 'Input';
