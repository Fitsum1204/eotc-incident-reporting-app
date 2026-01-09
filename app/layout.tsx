import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './provider';
import { Toaster } from '@/components/ui/sonner';
import { ServiceWorkerRegistration } from '@/components/shared/ServiceWorkerRegistration';
/* 
import "leaflet/dist/leaflet.css" */


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Incident Reporting App',
  description: 'Report and manage community incidents',
  manifest: '/manifest.json',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Incident Report',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'> 
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} 
        `}
      >
       <ServiceWorkerRegistration />
        <Providers >
            {children}
        </Providers>
        <Toaster />
      
      </body>
    </html>
  );
}
