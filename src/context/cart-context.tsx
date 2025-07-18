// src/context/cart-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '@/components/product-card';

export interface CartItem extends Product {
  customizationValue?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Product, customizationValue?: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: Product, customizationValue?: string) => {
    setCartItems(prevItems => [...prevItems, { ...item, customizationValue }]);
  };

  const removeFromCart = (index: number) => {
    setCartItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
    setIsCartOpen(false);
  };

  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(' €', '').replace(',', '.'));
    return sum + (isNaN(price) ? 0 : price);
  }, 0);


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, total, isCartOpen, setIsCartOpen }}>
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
