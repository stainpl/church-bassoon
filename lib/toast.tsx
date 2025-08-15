'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type Toast = {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; 
};

type ToastContextType = {
  toasts: Toast[];
  push: (msg: string, opts?: { type?: Toast['type']; duration?: number }) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, opts: { type?: Toast['type']; duration?: number } = {}) => {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = {
      id,
      message,
      type: opts.type || 'info',
      duration: opts.duration || 3000,
    };
    setToasts((prev) => [...prev, toast]);
    // auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, push }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx.push;
};

export const useToasts = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToasts must be inside ToastProvider');
  return ctx.toasts;
};
