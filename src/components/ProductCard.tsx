'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '../lib/types';
import { useStore } from '../lib/store';

const BADGE_CLASS: Record<string, string> = {
  HOT: 'badge-hot', NEW: 'badge-new', SALE: 'badge-sale', TRENDING: 'badge-trending', 'AI PICK': 'badge-ai'
};

export default function ProductCard({ product: p }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [added, setAdded] = useState(false);
  const isWished = wishlist.includes(p.id);
  const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart({ ...p, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card">
      <div style={{ position: 'relative' }}>
        <Link href={`/product/${p.id}`}>
          <img className="product-img" src={p.image} alt={p.name} loading="lazy" />
        </Link>
        {p.badge && (
          <span className={`badge ${BADGE_CLASS[p.badge]}`} style={{ position: 'absolute', top: '0.6rem', left: '0.6rem' }}>
            {p.badge}
          </span>
        )}
        <button
          onClick={() => toggleWishlist(p.id)}
          style={{ position: 'absolute', top: '0.6rem', right: '0.6rem', background: 'rgba(0,0,0,0.5)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWished ? '❤️' : '🤍'}
        </button>
        {p.freeDelivery && (
          <span style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(16,185,129,0.85)', color: 'white', fontSize: '0.65rem', fontWeight: 700, textAlign: 'center', padding: '0.2rem', letterSpacing: '0.05em' }}>
            FREE DELIVERY
          </span>
        )}
      </div>
      <div className="product-body">
        <Link href={`/product/${p.id}`}><div className="product-name">{p.name}</div></Link>
        <div className="text-sm text-muted mb-1">{p.sellerName}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <span className="product-price">₹{p.price.toLocaleString()}</span>
          <span className="product-original">₹{p.originalPrice.toLocaleString()}</span>
          {discount > 0 && <span className="product-discount">{discount}% off</span>}
        </div>
        <div className="product-meta">
          <span className="stars">{'★'.repeat(Math.floor(p.rating))} <span className="text-muted text-sm">({p.reviews.toLocaleString()})</span></span>
          <span className="text-muted text-sm">{p.deliveryDays}d delivery</span>
        </div>
        <button
          className={`btn ${added ? 'btn-success' : 'btn-primary'} btn-sm btn-full mt-2`}
          onClick={handleAddToCart}
          disabled={added}
        >
          {added ? '✓ Added to Cart' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}
