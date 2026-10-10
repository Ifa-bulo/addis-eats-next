'use client';

import {createContext,useCallback,useContext,useEffect,useMemo,useState,} from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'addis-eats-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                item &&
                typeof item.id === 'string' &&
                Number.isFinite(Number(item.price)) &&
                Number.isFinite(Number(item.quantity)) &&
                Number(item.quantity) > 0
            )
          );
        }
      }
    } catch {
      setItems([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* Keep cart usable when storage is unavailable. */
    }
  }, [items, loaded]);

  function addItem(dish) {
    setItems((current) => {
      const found = current.find((item) => item.id === dish.id);
      return found
        ? current.map((item) =>
            item.id === dish.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [
            ...current,
            {
              id: dish.id,
              name: dish.name,
              price: dish.price,
              image: dish.image,
              quantity: 1,
            },
          ];
    });
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function updateQuantity(id, quantity) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    [items, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}