// ============================================================
// FreshGuard AI — UI: Dialog (shadcn-inspired)
// ============================================================

import React, { useEffect, createContext, useContext } from 'react';
import { X } from 'lucide-react';

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  children,
  className = '',
  maxWidth = 'max-w-xl',
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}) {
  const context = useContext(DialogContext);
  if (!context || !context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => context.onOpenChange(false)}
      />

      {/* Modal Surface */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} rounded border border-[#C5A059]/30 bg-gradient-to-b from-[#0A241D] to-[#041410] p-6 sm:p-8 shadow-2xl z-10 animate-in zoom-in-95 duration-200 ${className}`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(197, 160, 89, 0.1)',
        }}
      >
        <button
          onClick={() => context.onOpenChange(false)}
          className="absolute right-4 top-4 p-1.5 rounded text-[#8E9B90] hover:text-[#FDFBF7] hover:bg-white/5 transition-colors focus:outline-none"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 mb-6 border-b border-white/5 pb-4 ${className}`}>
      {children}
    </div>
  );
}

export function DialogTitle({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className={`text-2xl font-editorial font-medium text-[#FDFBF7] ${className}`}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={`text-xs text-[#8E9B90] leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function DialogFooter({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mt-6 pt-4 border-t border-white/5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}
