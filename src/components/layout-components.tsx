// src/components/layout-components.tsx
"use client";

import { Facebook, Instagram, Twitter, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { categories } from "@/content/catalog";
import { storeConfig } from "@/content/store";

const socialIcons = { facebook: Facebook, twitter: Twitter, instagram: Instagram } as const;

export const Header = () => {
  const { setIsCartOpen, cartItems } = useCart();

  return (
    <header className="py-4 px-4 bg-background border-b">
      <div className="max-w-4xl mx-auto flex justify-center items-center relative">
        <Link href="/">
          <Image
            src={storeConfig.brand.logoUrl}
            alt={`Logo de ${storeConfig.brand.displayName}`}
            width={350}
            height={350}
            priority
            className="w-64 md:w-80"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="relative absolute right-0"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingCart className="h-6 w-6" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {cartItems.length}
            </span>
          )}
          <span className="sr-only">Abrir carrito</span>
        </Button>
      </div>
    </header>
  );
};


export const Navigation = () => (
  <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
    <div className="flex w-full max-w-xl mx-auto items-center space-x-2 border border-primary rounded-full p-2 mb-8 bg-card shadow-lg">
      <Input type="search" placeholder={storeConfig.catalog.searchPlaceholder} className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow" />
      <Button type="submit" size="icon" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
        <Search className="h-5 w-5" />
      </Button>
    </div>

    <nav className="flex flex-wrap justify-center gap-4">
      {categories.map((category) => (
        <Button key={category.id} variant="link" asChild size="lg" className="text-xl px-6 py-3">
          <Link href={`/${category.id}`} scroll={false}>{category.name}</Link>
        </Button>
      ))}
    </nav>
  </div>
);


export const Footer = () => (
  <footer className="bg-card py-8 px-4 text-muted-foreground border-t">
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <Image
          src={storeConfig.brand.logoUrl}
          alt={`Logo de ${storeConfig.brand.displayName} en el pie de página`}
          width={50}
          height={50}
          className="rounded-full"
        />
        <p className="text-sm">&copy; {storeConfig.footer.copyrightYear} {storeConfig.footer.companyName}. <br /> {storeConfig.footer.copyrightSuffix}</p>
      </div>
      <div className="flex justify-center space-x-6">
        {[...storeConfig.footer.socialLinks].sort((a, b) => a.sortOrder - b.sortOrder).map((link) => {
          const Icon = socialIcons[link.id];
          return <a key={link.id} href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label={link.label}><Icon /></a>;
        })}
      </div>
    </div>
  </footer>
);
