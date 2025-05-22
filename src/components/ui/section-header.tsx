
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  pretitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  pretitle,
  title,
  description,
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12',
        centered && 'text-center mx-auto',
        className
      )}
    >
      {pretitle && (
        <p className="text-tech-cyan font-semibold mb-2 uppercase tracking-wider text-sm">
          {pretitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      {description && (
        <p className="text-muted-foreground text-lg">{description}</p>
      )}
    </div>
  );
}
