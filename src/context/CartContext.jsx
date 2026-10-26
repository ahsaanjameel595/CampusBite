import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CartContext = createContext(null);

function normalizeCart(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item.id === 'string' && Number.isFinite(Number(item.price)) && Number(item.quantity) > 0)
    .map((item) => ({ ...item, quantity: Math.floor(Number(item.quantity)) }));
}

export function CartProvider({ children }) {
  const [storedCart, setStoredCart] = useLocalStorage('campusbite-cart', []);
  const cartItems = normalizeCart(storedCart);

  const addToCart = useCallback((item) => {
    if (!item?.id || !item.available) return false;
    setStoredCart((current) => {
      const cart = normalizeCart(current);
      const existing = cart.find((entry) => entry.id === item.id);
      return existing
        ? cart.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry)
        : [...cart, { ...item, quantity: 1 }];
    });
    return true;
  }, [setStoredCart]);

  const removeFromCart = useCallback((itemId) => {
    setStoredCart((current) => normalizeCart(current).filter((item) => item.id !== itemId));
  }, [setStoredCart]);

  const increaseQuantity = useCallback((itemId) => {
    setStoredCart((current) => normalizeCart(current).map((item) => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item));
  }, [setStoredCart]);

  const decreaseQuantity = useCallback((itemId) => {
    setStoredCart((current) => normalizeCart(current).flatMap((item) => {
      if (item.id !== itemId) return [item];
      return item.quantity <= 1 ? [] : [{ ...item, quantity: item.quantity - 1 }];
    }));
  }, [setStoredCart]);

  const clearCart = useCallback(() => {
    setStoredCart([]);
  }, [setStoredCart]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  const value = useMemo(() => ({
    cartItems, cartCount, cartTotal, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart,
    getItemQuantity: (itemId) => cartItems.find((item) => item.id === itemId)?.quantity ?? 0,
  }), [cartItems, cartCount, cartTotal, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
