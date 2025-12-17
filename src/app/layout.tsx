// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/context/cart-context';
import { CartSheet } from '@/components/cart-sheet';

export const metadata: Metadata = {
  title: 'CraftLab - Tienda de Manualidades',
  description: 'Descubre un mundo de creatividad con nuestra exclusiva selección de materiales y kits de manualidades. Calidad premium para tus proyectos.',
  keywords: "manualidades, tienda de manualidades, arte, creatividad, diy, materiales de arte, kits de manualidades, premium, exclusivo",
  icons: {
    icon: 'https://i.imgur.com/WaDyt2D.png',
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
        <link rel="icon" href="https://i.imgur.com/UKokrUq.png" />
        <link rel="apple-touch-icon" href="https://i.imgur.com/UKokrUq.png" />
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
