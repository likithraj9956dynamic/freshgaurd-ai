// ============================================================
// FreshGuard AI — Photography with graceful fallback
// ============================================================

import React from 'react';

interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
  fallbackLabel?: string;
  eager?: boolean;
}

export function Photo({
  src,
  alt,
  className = '',
  ratio = 'aspect-[16/9]',
  fallbackLabel = 'FreshGuard AI',
  eager = false,
}: PhotoProps) {
  const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={`photo ${ratio} ${className}`}>
      {/* Fallback shown until the image loads or on error */}
      <div className="photo-fallback" aria-hidden="true">
        <span className="eyebrow">{fallbackLabel}</span>
      </div>
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={status === 'loaded' ? 'is-loaded' : ''}
        />
      )}
    </div>
  );
}
