'use client';

import { ThemeProvider } from '@/app/providers/theme-provider';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
        {children}
      </div>

      {/* 🌟 Toast Notification System - CarLinq Style */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb 0%, #f97316 100%)',
            color: '#ffffff',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}
