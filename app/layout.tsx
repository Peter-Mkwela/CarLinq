/* eslint-disable @typescript-eslint/no-unused-vars */
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientLayout from '@/components/client-layout';
import AuthSessionProvider from './providers/session-provider';
import Loading from '@/components/Loading';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CarLinq - Professional Car Trading Platform',
  description:
    'Bridging the gap between car dealers and buyers with verified listings and secure transactions',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthSessionProvider>
          {/* Remove Suspense from here since we're handling it in ClientLayout */}
          <ClientLayout>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ClientLayout>
        </AuthSessionProvider>
      </body>
    </html>
  );
}