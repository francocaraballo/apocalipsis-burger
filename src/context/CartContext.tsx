import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('apocalipsis-cart', []);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, [setItems]);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, [setItems]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [setItems]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, [setItems]);

  const getTotal = useCallback(() => {
    return items.reduce(
      (acc, { product, quantity }) => acc + product.price * quantity,
      0
    );
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((acc, { quantity }) => acc + quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getTotalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return context;
}
