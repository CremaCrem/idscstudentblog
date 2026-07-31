import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hoverEffect = false, children, ...props }, ref) => {
    const classNames = [
      "bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-200",
      hoverEffect ? "hover:-translate-y-1 hover:shadow-xl" : "",
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
