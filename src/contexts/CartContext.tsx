import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  createCart as apiCreateCart,
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  applyDiscount as apiApplyDiscount,
  createCheckout as apiCreateCheckout,
} from '@/lib/sellqo';

const CART_ID_KEY = 'mancini_cart_id';
const USE_MOCK = !import.meta.env.VITE_SELLQO_API_URL;

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  discountCode: string | null;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  applyCode: (code: string) => Promise<boolean>;
  clearCart: () => void;
  checkout: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize cart
  useEffect(() => {
    const storedId = localStorage.getItem(CART_ID_KEY);
    if (storedId) {
      setCartId(storedId);
      if (!USE_MOCK) {
        apiGetCart(storedId).then((res: any) => {
          const cart = res?.data || res;
          if (cart?.items) {
            setItems(cart.items.map(mapCartItem));
          }
        }).catch(() => {
          // Cart expired, create new one
          localStorage.removeItem(CART_ID_KEY);
          initCart();
        });
      }
    } else {
      initCart();
    }
  }, []);

  const initCart = async () => {
    if (USE_MOCK) {
      const mockId = 'mock-cart-' + Date.now();
      setCartId(mockId);
      localStorage.setItem(CART_ID_KEY, mockId);
    } else {
      try {
        const res: any = await apiCreateCart();
        const id = res?.data?.id || res?.id;
        if (id) {
          setCartId(id);
          localStorage.setItem(CART_ID_KEY, id);
        }
      } catch (e) {
        console.error('Failed to create cart:', e);
      }
    }
  };

  function mapCartItem(raw: any): CartItem {
    return {
      id: raw.id || raw.item_id || `item-${Date.now()}-${Math.random()}`,
      product_id: raw.product_id,
      variant_id: raw.variant_id,
      title: raw.title || raw.name || '',
      price: raw.price || 0,
      quantity: raw.quantity || 1,
      image: raw.image || raw.image_url,
      size: raw.size || raw.options?.size,
      color: raw.color || raw.options?.color,
    };
  }

  const addItem = useCallback(async (item: Omit<CartItem, 'id'>) => {
    if (USE_MOCK) {
      setItems(prev => {
        const existing = prev.find(i => i.product_id === item.product_id && i.variant_id === item.variant_id);
        if (existing) {
          return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i);
        }
        return [...prev, { ...item, id: `item-${Date.now()}-${Math.random().toString(36).slice(2)}` }];
      });
    } else if (cartId) {
      setLoading(true);
      try {
        await apiAddToCart(cartId, { product_id: item.product_id, variant_id: item.variant_id, quantity: item.quantity });
        const res: any = await apiGetCart(cartId);
        const cart = res?.data || res;
        if (cart?.items) setItems(cart.items.map(mapCartItem));
      } catch (e) {
        console.error('Failed to add to cart:', e);
      }
      setLoading(false);
    }
    setIsDrawerOpen(true);
  }, [cartId]);

  const updateItem = useCallback(async (id: string, quantity: number) => {
    if (quantity <= 0) {
      return removeItem(id);
    }
    if (USE_MOCK) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    } else if (cartId) {
      setLoading(true);
      try {
        await apiUpdateCartItem(cartId, id, quantity);
        const res: any = await apiGetCart(cartId);
        const cart = res?.data || res;
        if (cart?.items) setItems(cart.items.map(mapCartItem));
      } catch (e) {
        console.error('Failed to update cart item:', e);
      }
      setLoading(false);
    }
  }, [cartId]);

  const removeItem = useCallback(async (id: string) => {
    if (USE_MOCK) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else if (cartId) {
      setLoading(true);
      try {
        await apiRemoveCartItem(cartId, id);
        const res: any = await apiGetCart(cartId);
        const cart = res?.data || res;
        if (cart?.items) setItems(cart.items.map(mapCartItem));
      } catch (e) {
        console.error('Failed to remove cart item:', e);
      }
      setLoading(false);
    }
  }, [cartId]);

  const applyCode = useCallback(async (code: string): Promise<boolean> => {
    if (USE_MOCK) {
      // Mock: 10% discount for any code
      setDiscountCode(code);
      setDiscount(0.1);
      return true;
    }
    if (!cartId) return false;
    try {
      const res: any = await apiApplyDiscount(cartId, code);
      if (res?.data?.discount) {
        setDiscount(res.data.discount);
        setDiscountCode(code);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [cartId]);

  const clearCart = useCallback(() => {
    setItems([]);
    setDiscount(0);
    setDiscountCode(null);
    localStorage.removeItem(CART_ID_KEY);
    setCartId(null);
    // Re-init
    initCart();
  }, []);

  const checkout = useCallback(async () => {
    const successUrl = window.location.origin + '/checkout/success';
    const cancelUrl = window.location.origin + '/cart';

    if (USE_MOCK) {
      window.location.href = successUrl;
      return;
    }

    if (!cartId) return;
    setLoading(true);
    try {
      const res: any = await apiCreateCheckout(cartId, successUrl, cancelUrl);
      const checkoutUrl = res?.data?.checkout_url || res?.checkout_url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        window.location.href = successUrl;
      }
    } catch (e) {
      console.error('Checkout failed:', e);
    }
    setLoading(false);
  }, [cartId]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <CartContext.Provider value={{
      items, itemCount, subtotal, discount, discountCode,
      isDrawerOpen, openDrawer, closeDrawer,
      addItem, updateItem, removeItem, applyCode, clearCart, checkout, loading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
