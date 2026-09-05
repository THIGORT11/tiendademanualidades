// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/context/cart-context';
import { CartSheet } from '@/components/cart-sheet';
import { storeConfig } from '@/content/store';

export const metadata: Metadata = {
  title: storeConfig.metadata.title,
  description: storeConfig.metadata.description,
  keywords: storeConfig.metadata.keywords,
  icons: {
    icon: storeConfig.brand.faviconUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href={storeConfig.brand.faviconUrl} />
        <link rel="apple-touch-icon" href={storeConfig.brand.faviconUrl} />
        <meta name="msapplication-TileColor" content="#070b18" />
        <meta name="theme-color" content="#070b18" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased overflow-x-hidden">
        <CartProvider>
          {children}
          <CartSheet />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
