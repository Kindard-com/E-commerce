"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './products';
import { mapMedusaProduct } from './medusa-mapper';
import { medusaClient } from './medusa';

export type CartItem = {
  lineItemId?: string;
  product: Product;
  size: string;
  color: string;
  qty: number;
};

type StoreContextType = {
  cart: CartItem[];
  medusaCartId: string | null;
  setMedusaCartId: (id: string | null) => void;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (index: number) => Promise<void>;
  updateQty: (index: number, qty: number) => Promise<void>;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isDetailOpen: boolean;
  setDetailOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  user: any | null; // Customer data from Medusa
  authLoading: boolean;
  isAdmin: boolean;
  cartLoading: boolean;
  refreshUser: () => Promise<void>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [medusaCart, setMedusaCart] = useState<any>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshUser = async () => {
    setAuthLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('medusa_token') : null;
      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || (typeof window !== 'undefined' ? '/medusa' : "http://127.0.0.1:9000");
      const res = await fetch(`${baseUrl}/store/customers/me`, {
        headers: {
          'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_example_from_env",
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Not logged in');
      const data = await res.json();
      setUser(data.customer);
    } catch (e) {
      setUser(null);
      if (typeof window !== 'undefined') localStorage.removeItem('medusa_token');
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    // Check for admin
    fetch('/api/admin/me')
      .then(res => res.json())
      .then(data => setIsAdmin(!!data.isAdmin))
      .catch(() => setIsAdmin(false));

    // Check for Medusa customer
    refreshUser();
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = async (item: CartItem) => {
    setCartOpen(true);
    setCartLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setCart(prev => {
      const existing = prev.findIndex(i => i.product.id === item.product.id && i.size === item.size && i.color === item.color);
      if (existing >= 0) {
        const next = [...prev];
        next[existing].qty += item.qty;
        return next;
      }
      return [...prev, item];
    });
    setCartLoading(false);
  };

  const removeFromCart = async (index: number) => {
    setCartLoading(true);
    await new Promise(r => setTimeout(r, 200));
    setCart(prev => prev.filter((_, i) => i !== index));
    setCartLoading(false);
  };

  const updateQty = async (index: number, qty: number) => {
    if (qty < 1) return;
    setCartLoading(true);
    await new Promise(r => setTimeout(r, 200));
    setCart(prev => {
      const next = [...prev];
      next[index].qty = qty;
      return next;
    });
    setCartLoading(false);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        medusaCartId: medusaCart?.id || null,
        setMedusaCartId: (id: string | null) => setMedusaCart(id ? { id } : null),
        addToCart,
        removeFromCart,
        updateQty,
        isCartOpen,
        setCartOpen,
        isMenuOpen,
        setMenuOpen,
        isDetailOpen,
        setDetailOpen,
        selectedProduct,
        setSelectedProduct,
        user,
        authLoading,
        isAdmin,
        cartLoading,
        refreshUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
