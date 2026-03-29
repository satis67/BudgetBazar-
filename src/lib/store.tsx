'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { CartItem, User } from '../lib/types';
import { 
  updateUserProfile, 
  syncCart, 
  syncWishlist, 
  subscribeToCart, 
  subscribeToWishlist,
  getUserProfile
} from './firestore';

interface StoreState {
  cart: CartItem[];
  user: User | null;
  wishlist: string[];
  compareList: string[];
  budget: number;
}
interface StoreCtx extends StoreState {
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => void;
  setUser: (u: User | null) => void;
  setBudget: (n: number) => void;
  cartTotal: number;
  cartCount: number;
}

const Ctx = createContext<StoreCtx | null>(null);

const INITIAL: StoreState = { cart: [], user: null, wishlist: [], compareList: [], budget: 50000 };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(INITIAL);

  // 1. Initial Load from LocalStorage (for speed/guests)
  useEffect(() => {
    const saved = localStorage.getItem('bb_store_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse local store', e);
      }
    }
  }, []);

  // 2. Real-time Firestore Sync (when logged in)
  useEffect(() => {
    if (!state.user?.id) return;

    // Subscribe to Cart
    const unsubCart = subscribeToCart(state.user.id, (items) => {
      setState(prev => ({ ...prev, cart: items || [] }));
    });

    // Subscribe to Wishlist
    const unsubWishlist = subscribeToWishlist(state.user.id, (items) => {
      setState(prev => ({ ...prev, wishlist: items || [] }));
    });

    return () => {
      unsubCart();
      unsubWishlist();
    };
  }, [state.user?.id]);

  // 3. Persist to LocalStorage on state change
  useEffect(() => {
    const { user, ...persistable } = state;
    localStorage.setItem('bb_store_v2', JSON.stringify(persistable));
  }, [state]);

  const addToCart = async (item: CartItem) => {
    const existing = state.cart.find(c => c.id === item.id);
    const newCart = existing
      ? state.cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
      : [...state.cart, { ...item, qty: 1 }];
    
    setState(prev => ({ ...prev, cart: newCart }));
    
    if (state.user?.id) {
      await syncCart(state.user.id, newCart);
    }
  };

  const removeFromCart = async (id: string) => {
    const newCart = state.cart.filter(c => c.id !== id);
    setState(prev => ({ ...prev, cart: newCart }));
    
    if (state.user?.id) {
      await syncCart(state.user.id, newCart);
    }
  };

  const updateQty = async (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    const newCart = state.cart.map(c => c.id === id ? { ...c, qty } : c);
    setState(prev => ({ ...prev, cart: newCart }));
    
    if (state.user?.id) {
      await syncCart(state.user.id, newCart);
    }
  };

  const clearCart = async () => {
    setState(prev => ({ ...prev, cart: [] }));
    if (state.user?.id) {
      await syncCart(state.user.id, []);
    }
  };

  const toggleWishlist = async (id: string) => {
    const newWishlist = state.wishlist.includes(id) 
      ? state.wishlist.filter(w => w !== id) 
      : [...state.wishlist, id];
    
    setState(prev => ({ ...prev, wishlist: newWishlist }));
    
    if (state.user?.id) {
      await syncWishlist(state.user.id, newWishlist);
    }
  };

  const toggleCompare = (id: string) => {
    setState(prev => {
      let compareList = prev.compareList;
      if (prev.compareList.includes(id)) {
        compareList = prev.compareList.filter(c => c !== id);
      } else if (prev.compareList.length < 2) {
        compareList = [...prev.compareList, id];
      }
      return { ...prev, compareList };
    });
  };

  const setUser = async (user: User | null) => {
    setState(prev => ({ ...prev, user }));
    if (user) {
      await updateUserProfile(user.id, user);
      // Fetch fresh profile data to see if there's an existing cart/wishlist
      const profile = await getUserProfile(user.id);
      if (profile) {
        // Trigger initial sync if needed
      }
    }
  };

  const setBudget = (budget: number) => {
    setState(prev => ({ ...prev, budget }));
  };

  const cartTotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider value={{ ...state, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, toggleCompare, setUser, setBudget, cartTotal, cartCount }}>
      {children}
    </Ctx.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
};
