// ============================================================
// FreshGuard AI — Components: Slider (v1)
// ============================================================

import React from 'react';

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
}: {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) {
  return (
    <input
      type="range"
      value={value[0]}
      onMouseDown={(e) => {
        const start = e.clientX;
        const handler = (ev: MouseEvent) => {
          const delta = ev.clientX - start;
          const newValue = Math.min(max, Math.max(min, value[0] + delta / (max - min) * 100));
          onValueChange([Math.round(newValue / step) * step]);
        };
        const stop = () => window.removeEventListener('mousemove', handler);
        window.addEventListener('mousemove', handler);
        window.addEventListener('mouseup', stop);
      }}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className={`w-full h-2 rounded-lg appearance-none bg-border cursor-pointer accent-accent ${className}`}
      min={min}
      max={max}
      step={step}
    />
  );
}
