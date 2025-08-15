// components/ToastContainer.tsx
'use client';

import React from 'react';
import { useToasts } from '@/lib/toast';

export const ToastContainer: React.FC = () => {
  const toasts = useToasts();

  return (
    <div className="fixed top-4 right-4 flex flex-col space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            max-w-xs px-4 py-2 rounded shadow-lg text-white 
            ${t.type === 'error' ? 'bg-red-500' : ''}
            ${t.type === 'success' ? 'bg-green-500' : ''}
            ${t.type === 'info' ? 'bg-blue-500' : ''}
          `}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};
