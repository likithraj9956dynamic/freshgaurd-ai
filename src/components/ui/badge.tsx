// ============================================================
// FreshGuard AI — UI: Badge (shadcn-inspired)
// ============================================================

import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'gold' | 'outline' | 'destructive' | 'success';
}

export function Badge({
  className = '',
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-[#0B3B2C] text-[#FDFBF7] border-white/10',
    secondary: 'bg-[#071C16] text-[#8E9B90] border-white/5',
    gold: 'bg-[#C5A059]/15 text-[#E0C588] border-[#C5A059]/30',
    outline: 'bg-transparent text-[#FDFBF7] border-white/20',
    destructive: 'bg-[#9E2A2B]/20 text-[#F87171] border-[#9E2A2B]/40',
    success: 'bg-[#16A34A]/20 text-[#4ADE80] border-[#16A34A]/40',
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider uppercase border font-medium ${selectedVariant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
