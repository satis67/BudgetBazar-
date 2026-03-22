'use client';
import { useStore } from '../../lib/store';
import { PRODUCTS } from '../../lib/data';
import Link from 'next/link';
import styles from './reels.module.css';
import { useState } from 'react';

export default function ReelsPage() {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (p: typeof PRODUCTS[0]) => {
    addToCart({ ...p, qty: 1 });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className={styles.reelsContainer}>
      {PRODUCTS.map(p => (
        <div key={p.id} className={styles.reelSlide}>
          <img src={p.image} className={styles.reelBg} alt={p.name} />
          <div className={styles.reelOverlay}>
            <div className={styles.reelContent}>
              <div className="flex-between mb-2">
                <div>
                  {p.badge && <span className={`badge badge-${p.badge.toLowerCase().replace(' ', '')} mb-1`}>{p.badge}</span>}
                  <h2 className={styles.reelTitle}>{p.name}</h2>
                </div>
                <div className={styles.reelPrice}>₹{p.price.toLocaleString()}</div>
              </div>
              
              <p className={styles.reelDesc}>{p.description}</p>
              
              <div className={styles.reelActions}>
                <Link href={`/product/${p.id}`} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                  Shop Now →
                </Link>
                <button 
                  className={`btn ${addedId === p.id ? 'btn-success' : 'btn-primary'} btn-lg`}
                  style={{ flex: 1 }}
                  onClick={() => handleAddToCart(p)}
                  disabled={addedId === p.id}
                >
                  {addedId === p.id ? '✓ Added' : '🛒 Add to Cart'}
                </button>
                <button 
                  className={`btn ${wishlist.includes(p.id) ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                  style={{ width: '60px', padding: '0', display: 'flex', justifyContent: 'center' }}
                  onClick={() => toggleWishlist(p.id)}
                >
                  {wishlist.includes(p.id) ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
