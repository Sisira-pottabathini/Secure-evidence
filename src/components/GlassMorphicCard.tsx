
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassMorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassMorphicCard: React.FC<GlassMorphicCardProps> = ({
  children,
  className,
  hover = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-card relative overflow-hidden animate-fade-in',
        hover && 'hover:translate-y-[-5px]',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassMorphicCard;
