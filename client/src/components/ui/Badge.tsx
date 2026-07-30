import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'health-healthy' | 'health-warning' | 'health-broken';
  dot?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', dot, children, ...props }, ref) => {
    
    const getDotClass = () => {
      if (variant === 'health-healthy') return styles['dot-healthy'];
      if (variant === 'health-warning') return styles['dot-warning'];
      if (variant === 'health-broken') return styles['dot-broken'];
      return '';
    };

    const classNames = [
      styles.badge,
      styles[`variant-${variant}`],
      className
    ].filter(Boolean).join(' ');

    return (
      <span ref={ref} className={classNames} {...props}>
        {dot && <span className={`${styles.dot} ${getDotClass()}`} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
