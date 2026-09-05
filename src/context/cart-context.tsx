// src/context/cart-context.tsx
"use client";

import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';
import type { Product } from '@/content/catalog';
import { useToast } from '@/hooks/use-toast';
import { canAddProduct, getCartQuantityForProduct, isProductOutOfStock } from '@/lib/product-stock';

export interface CartItem extends Product {
  customizationValue?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Product, customizationValue?: string) => void;
  canAddToCart: (item: Product) => boolean;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const cartItemsRef = useRef<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const addToCart = (item: Product, customizationValue?: string) => {
    const quantityInCart = getCartQuantityForProduct(cartItemsRef.current, item.id);
    if (!canAddProduct(item, quantityInCart)) {
      toast({
        title: isProductOutOfStock(item) ? 'Producto agotado' : 'Stock máximo alcanzado',
        description: isProductOutOfStock(item)
          ? `${item.name} no está disponible.`
          : `Solo hay ${item.stock} unidades disponibles de ${item.name}.`,
        variant: 'destructive',
      });
      return;
    }

    const nextItems = [...cartItemsRef.current, { ...item, customizationValue }];
    cartItemsRef.current = nextItems;
    setCartItems(nextItems);
    toast({
      title: 'Producto añadido',
      description: `${item.name} ${customizationValue ? `(${customizationValue})` : ''} ha sido añadido al carrito.`,
    });
  };

  const canAddToCart = (item: Product) => canAddProduct(
    item,
    getCartQuantityForProduct(cartItems, item.id),
  );

  const removeFromCart = (index: number) => {
    const nextItems = cartItemsRef.current.filter((_, itemIndex) => itemIndex !== index);
    cartItemsRef.current = nextItems;
    setCartItems(nextItems);
  };

  const clearCart = () => {
    cartItemsRef.current = [];
    setCartItems([]);
    setIsCartOpen(false);
  };

  const total = cartItems.reduce((sum, item) => {
    return sum + item.price;
  }, 0);


  return (
    <CartContext.Provider value={{ cartItems, addToCart, canAddToCart, removeFromCart, clearCart, total, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
