// ============================================================
// FreshGuard AI — Components: Confirmation Dialog
// ============================================================

import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: 'accent' | 'warning' | 'success';
  variant?: 'default' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmColor = 'accent',
  variant = 'default',
  size = 'md',
}: ConfirmationDialogProps) {
  const [isRendered, setIsRendered] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isRendered || !isOpen) return null;

  const getModalStyles = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-lg';
      default:
        return 'max-w-md';
    }
  };

  const getButtonColor = () => {
    if (variant === 'danger') {
      return 'bg-critical text-white hover:bg-critical-dark';
    }
    switch (confirmColor) {
      case 'warning':
        return 'bg-warning text-white hover:bg-warning-dark';
      case 'success':
        return 'bg-success text-white hover:bg-success-dark';
      default:
        return 'bg-accent text-white hover:bg-accent-dark';
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />
      <div
        className={`relative w-full ${getModalStyles()} rounded-lg border border-border-subtle bg-white shadow-xl`}
      >
        <div className="flex items-start justify-between p-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            variant === 'danger'
              ? 'bg-critical-soft'
              : 'bg-accent-soft'
          }`}>
            {variant === 'danger' ? (
              <AlertTriangle className="w-5 h-5 text-critical" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-accent" />
            )}
          </div>
          <button
            className="p-1 rounded-md hover:bg-muted"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-border-subtle">
          <button
            className="px-4 py-2 text-sm font-medium rounded-md border border-border-subtle hover:bg-muted transition-colors"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md ${getButtonColor()} transition-colors`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
