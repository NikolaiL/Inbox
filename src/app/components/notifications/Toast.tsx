import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const typeClasses = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div
      role="alert"
      className={`fixed bottom-5 right-5 p-4 rounded-lg text-white shadow-lg ${typeClasses[type]}`}
    >
      {message}
    </div>
  );
} 