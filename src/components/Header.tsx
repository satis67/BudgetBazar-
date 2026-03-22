"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '../lib/store';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { cartCount, wishlist } = useStore();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="header-logo gradient-text">Budget Bazar</Link>

        <form onSubmit={handleSearch} className="search-bar" style={{ flex: 1, maxWidth: 480 }}>
          <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>🔍</span>
          </button>
          <input 
            placeholder='Search products, brands, categories...' 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <nav className="header-nav">
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/auction" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span className="live-dot"></span> Live Auction
          </Link>
          <Link href="/reels" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            🎬 Reels
          </Link>
          <Link href="/seller">Sell</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/wishlist" className="cart-icon" title="Wishlist">
            ❤️ <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{wishlist.length}</span>
          </Link>
          <Link href="/cart" className="cart-icon">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                {user.displayName || user.email || user.phoneNumber}
              </span>
              <button 
                onClick={logout}
                className="btn btn-secondary btn-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
          
          <Link href="/admin" className="btn btn-secondary btn-sm">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
