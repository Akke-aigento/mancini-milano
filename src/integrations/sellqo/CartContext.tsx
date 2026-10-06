import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCartQuery, useAddToCart, useUpdateCartItem, useRemoveCartItem, useApplyDiscount, useCreateCheckout, CART_STORAGE_KEY, getStoredCartId, sellqoKeys } from './hooks';
import { SellQoError } from './client';
import type { Cart, CartItem } from './types';

// error_code is only present once the proxy forwards it; without it we keep the generic text.
function addToCartErrorMessage(error: unknown): string {
  if (error instanceof SellQoError && error.code) {
    if (error.code === 'INSUFFICIENT_STOCK') {
      const available = Number(error.details?.available_stock);
      return available > 0 ? `Only ${available} left` : 'Sorry, this size is sold out';
    }
    // CART_EXPIRED is raised client-side (hooks.ts) and has no customer-facing message.
    if (error.code !== 'CART_EXPIRED' && error.message) return error.message;
  }
  return 'Could not add to cart. Please try again.';
}

interface CartContextType {
  cart: Cart | undefined;
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  total: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: { product_id: string; variant_id?: string; quantity: number; title: string; variant_title: string; price: number; image?: string }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  checkout: (options?: { success_url?: string; cancel_url?: string }) => Promise<void>;
  isAddingItem: boolean;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function SellQoCartProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useCartQuery();
  const addToCartMutation = useAddToCart();
  const updateItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const discount = useApplyDiscount();
  const createCheckout = useCreateCheckout();
  const [isOpen, setIsOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(async (item: { product_id: string; variant_id?: string; quantity: number; title: string; variant_title: string; price: number; image?: string }) => {
    try {
      await addToCartMutation.mutateAsync({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      });
      setIsOpen(true);
    } catch (error) {
      console.error('Add to cart failed:', error);
      const { toast } = await import('sonner');
      toast.error(addToCartErrorMessage(error));
    }
  }, [addToCartMutation]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeCartItem.mutateAsync(itemId);
      } else {
        await updateItem.mutateAsync({ itemId, quantity });
      }
    } catch (error) {
      console.error('Update quantity failed:', error);
      const { toast } = await import('sonner');
      toast.error('Could not update quantity. Please try again.');
    }
  }, [updateItem, removeCartItem]);

  const removeItemFn = useCallback(async (itemId: string) => {
    try {
      await removeCartItem.mutateAsync(itemId);
    } catch (error) {
      console.error('Remove item failed:', error);
      const { toast } = await import('sonner');
      toast.error('Could not remove item. Please try again.');
    }
  }, [removeCartItem]);

  const applyDiscountCode = useCallback(async (code: string) => {
    await discount.mutateAsync(code);
  }, [discount]);

  const doCheckout = useCallback(async (options?: { success_url?: string; cancel_url?: string }) => {
    await createCheckout.mutateAsync(options);
  }, [createCheckout]);

  const clearCart = useCallback(() => {
    const cartId = getStoredCartId();
    try { localStorage.removeItem(CART_STORAGE_KEY); } catch { /* noop */ }
    if (cartId) {
      queryClient.setQueryData(sellqoKeys.cart(cartId), undefined);
    }
    queryClient.removeQueries({ queryKey: ['sellqo', 'cart'] });
  }, [queryClient]);

  const items = cart?.items || [];
  const itemCount = cart?.item_count || items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;

  const value = useMemo<CartContextType>(() => ({
    cart, items, isLoading, isOpen, itemCount, subtotal, total,
    openCart, closeCart, addItem, updateQuantity, removeItem: removeItemFn,
    applyDiscount: applyDiscountCode, checkout: doCheckout,
    isAddingItem: addToCartMutation.isPending,
    discountCode, setDiscountCode, clearCart,
  }), [cart, items, isLoading, isOpen, itemCount, subtotal, total, openCart, closeCart, addItem, updateQuantity, removeItemFn, applyDiscountCode, doCheckout, addToCartMutation.isPending, discountCode, setDiscountCode, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useSellQoCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useSellQoCart must be used within SellQoCartProvider');
  return context;
}
