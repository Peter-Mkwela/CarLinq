// app/components/client-layout.tsx
'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { Toaster } from 'react-hot-toast';
import Loading from './Loading';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState({
    isLoading: false,
    progress: 0
  });
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Function to simulate loading progress
  const simulateProgress = useCallback(() => {
    setLoading({ isLoading: true, progress: 0 });
    
    const interval = setInterval(() => {
      setLoading(prev => {
        if (prev.progress >= 95) {
          clearInterval(interval);
          return { ...prev, progress: 95 };
        }
        const increment = Math.random() * 15;
        return { ...prev, progress: Math.min(prev.progress + increment, 95) };
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Don't show loading for initial page load (handled by suspense)
    if (pathname !== '/' && !loading.isLoading) {
      const cleanup = simulateProgress();
      
      const timer = setTimeout(() => {
        setLoading({ isLoading: false, progress: 100 });
      }, 800); // Minimum loading time

      return () => {
        cleanup();
        clearTimeout(timer);
      };
    }
  }, [pathname, searchParams, simulateProgress]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
        {/* Show loading screen during route transitions */}
        {loading.isLoading ? (
          <Loading />
        ) : (
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        )}
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