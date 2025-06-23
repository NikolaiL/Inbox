"use client";

import React from 'react';
import { useNotificationStore } from '../../../store/useNotificationStore';
import { Toast } from './Toast';

export function NotificationProvider() {
  const { toasts, dismissToast } = useNotificationStore();

  return (
    <div className="fixed top-5 right-5 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  );
} 