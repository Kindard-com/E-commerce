"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './products';
import { medusaClient } from './medusa';
import { findVariantId } from './variants';
import {
  addLineItemToMedusa,
  applyCustomerToken,
  initMedusaCart,
  mapCartItems,
  persistCartId,
  removeLineItemFromMedusa,
  updateLineItemInMedusa,
  type CartItem,
} from './cart';

export type { CartItem }

type StoreContextType = {
  cart: CartItem[];
  medusaCart: any | null;
  medusaCartId: string | null;
  setMedusaCartId: (id: string | null) => void;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (index: number) => Promise<void>;
  updateQty: (index: number, qty: number) => Promise<void>;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  isDetailOpen: boolean;
  setDetailOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  user: any | null;
  authLoading: boolean;
  isAdmin: boolean;
  cartLoading: boolean;
  cartError: string | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [medusaCart, setMedusaCart] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const applyCart = (nextCart: any | null) => {
    setMedusaCart(nextCart)
    setCart(nextCart ? mapCartItems(nextCart) : [])
    persistCartId(nextCart?.id || null)
  }

  const refreshUser = async () => {
    setAuthLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('medusa_token') : null;
      applyCustomerToken()
      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      const { customer } = await medusaClient.store.customer.retrieve()
      setUser(customer);
    } catch (e) {
      setUser(null);
      if (typeof window !== 'undefined') localStorage.removeItem('medusa_token');
      applyCustomerToken()
    }
    setAuthLoading(false);
  };

  const logout = async () => {
    if (typeof window !== 'undefined') localStorage.removeItem('medusa_token')
    applyCustomerToken()
    setUser(null)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {
      // Admin session may not exist.
    }
  }

  useEffect(() => {
    fetch('/api/admin/me')
      .then(res => res.json())
      .then(data => setIsAdmin(!!data.isAdmin))
      .catch(() => setIsAdmin(false));

    refreshUser();
    initMedusaCart()
      .then((cart) => applyCart(cart))
      .catch((error) => setCartError(error?.message || 'Could not load bag'))
  }, []);

  const addToCart = async (item: CartItem) => {
    setCartOpen(true);
    setCartLoading(true);
    setCartError(null)
    try {
      const variantId = item.variantId || findVariantId(item.product, item.size, item.color)
      if (!variantId) {
        throw new Error('This product is missing a purchasable variant in Medusa.')
      }
      let cartId = medusaCart?.id as string | undefined
      if (!cartId) {
        const created = await initMedusaCart()
        cartId = created?.id
        applyCart(created)
      }
      if (!cartId) throw new Error('Could not create a Medusa cart.')
      const next = await addLineItemToMedusa(cartId, variantId, item.qty || 1)
      applyCart(next)
    } catch (error: any) {
      setCartError(error?.message || 'Could not add item to bag')
    } finally {
      setCartLoading(false);
    }
  };

  const removeFromCart = async (index: number) => {
    const item = cart[index]
    if (!item?.lineItemId || !medusaCart?.id) return
    setCartLoading(true);
    setCartError(null)
    try {
      const next = await removeLineItemFromMedusa(medusaCart.id, item.lineItemId)
      applyCart(next)
    } catch (error: any) {
      setCartError(error?.message || 'Could not remove item')
    } finally {
      setCartLoading(false);
    }
  };

  const updateQty = async (index: number, qty: number) => {
    const item = cart[index]
    if (!item?.lineItemId || !medusaCart?.id) return
    setCartLoading(true);
    setCartError(null)
    try {
      const next = await updateLineItemInMedusa(medusaCart.id, item.lineItemId, qty)
      applyCart(next)
    } catch (error: any) {
      setCartError(error?.message || 'Could not update quantity')
    } finally {
      setCartLoading(false);
    }
  };

  const clearCart = () => {
    applyCart(null)
  }

  return (
    <StoreContext.Provider
      value={{
        cart,
        medusaCart,
        medusaCartId: medusaCart?.id || null,
        setMedusaCartId: (id: string | null) => {
          if (!id) {
            applyCart(null)
            return
          }
          persistCartId(id)
          initMedusaCart().then(applyCart)
        },
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
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
        cartError,
        refreshUser,
        logout,
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
