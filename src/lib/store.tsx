'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { CartItem, User } from '../lib/types';
import { supabase } from './supabase';

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

  useEffect(() => {
    const saved = localStorage.getItem('bb_store_v2');
    if (saved) try { setState(JSON.parse(saved)); } catch {}

    // Supabase Auth Listener (Foundation) - Only run if supabase is enabled
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        if (session?.user) {
          // Map Supabase user to our User type
          const u: User = {
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: 'buyer',
            balance: 50000,
            points: 0,
            onboarded: true
          };
          setUser(u);
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setState(prev => {
      const existing = prev.cart.find(c => c.id === item.id);
      const cart = existing
        ? prev.cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
        : [...prev.cart, { ...item, qty: 1 }];
      const newState = { ...prev, cart };
      localStorage.setItem('bb_store_v2', JSON.stringify(newState));
      return newState;
    });
  };

  const removeFromCart = (id: string) => {
    setState(prev => {
      const newState = { ...prev, cart: prev.cart.filter(c => c.id !== id) };
      localStorage.setItem('bb_store_v2', JSON.stringify(newState));
      return newState;
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setState(prev => {
      const newState = { ...prev, cart: prev.cart.map(c => c.id === id ? { ...c, qty } : c) };
      localStorage.setItem('bb_store_v2', JSON.stringify(newState));
      return newState;
    });
  };

  const clearCart = () => {
    setState(prev => {
      const newState = { ...prev, cart: [] };
      localStorage.setItem('bb_store_v2', JSON.stringify(newState));
      return newState;
    });
  };

  const toggleWishlist = (id: string) => {
    setState(prev => {
      const wishlist = prev.wishlist.includes(id) 
        ? prev.wishlist.filter(w => w !== id) 
        : [...prev.wishlist, id];
      const newState = { ...prev, wishlist };
      localStorage.setItem('bb_store_v2', JSON.stringify(newState));
      return newState;
    });
  };

  const toggleCompare = (id: string) => {
    setState(prev => {
      let compareList = prev.compareList;
      if (prev.compareList.includes(id)) {
        compareList = prev.compareList.filter(c => c !== id);
      } else if (prev.compareList.length < 2) {
        compareList = [...prev.compareList, id];
      }
      const newState = { ...prev, compareList };
      localStorage.setItem('bb_store_v2', JSON.stringify(newState));
      return newState;
    });
  };

  const setUser = (user: User | null) => {
    setState(prev => {
      const newState = { ...prev, user };
      localStorage.setItem('bb_store_v2', JSON.stringify(newState));
      return newState;
    });
  };

  const setBudget = (budget: number) => {
    setState(prev => {
      const newState = { ...prev, budget };
      localStorage.setItem('bb_store_v2', JSON.stringify(newState));
      return newState;
    });
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
