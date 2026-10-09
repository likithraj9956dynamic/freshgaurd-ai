// ============================================================
// FreshGuard AI — Components: Toast System
// ============================================================

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'warning' | 'critical' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, action, duration = 5000 }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast = { id, type, title, message, action, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className="toast-container" role="region" aria-label="Notifications">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            role="alert"
          >
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-success" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-warning" />}
              {toast.type === 'critical' && <AlertCircle className="w-4 h-4 text-critical" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-info" />}
            </div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              {toast.message && <div className="toast-message">{toast.message}</div>}
              {toast.action && (
                <button
                  className="toast-action"
                  onClick={() => {
                    toast.action?.onClick();
                    dismissToast(toast.id);
                  }}
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-navy"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
