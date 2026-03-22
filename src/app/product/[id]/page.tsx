'use client';
import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS } from '../../../lib/data';
import { useStore } from '../../../lib/store';
import CheckoutButton from '@/components/CheckoutButton';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS.find(p => p.id === params.id);
  if (!product) return notFound();

  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareList, budget } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) return notFound();

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ ...product, qty: 1 });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isWished = wishlist.includes(product.id);
  const inCompare = compareList.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const aiDecision = product.price <= budget ? 'APPROVE' : 'REJECT';
  const aiReason = aiDecision === 'APPROVE'
    ? `Great value! This product fits your budget of ₹${budget.toLocaleString()}. Rating of ${product.rating}/5 with ${product.reviews.toLocaleString()} reviews confirms high quality.`
    : `This exceeds your current budget of ₹${budget.toLocaleString()} by ₹${(product.price - budget).toLocaleString()}. Consider adjusting your budget or looking at cheaper alternatives.`;

  const similar = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>

        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-3" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href="/">Home</Link> / <Link href="/marketplace">Marketplace</Link> / <Link href={`/marketplace?category=${product.category}`}>{product.category}</Link> / <span style={{ color: 'var(--text)' }}>{product.name}</span>
        </nav>

        <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
          {/* Images */}
          <div>
            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '1.25rem', aspectRatio: '1/1', objectFit: 'cover' }} />
          </div>

          {/* Info */}
          <div>
            {product.badge && <span className={`badge badge-${product.badge.toLowerCase().replace(' ', '')}`}>{product.badge}</span>}
            <h1 style={{ fontSize: '1.75rem', margin: '0.75rem 0 0.5rem', fontWeight: 700 }}>{product.name}</h1>
            <p className="text-muted text-sm mb-2">by <strong style={{ color: 'var(--primary)' }}>{product.sellerName}</strong></p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
              <span className="text-muted text-sm">{product.rating} ({product.reviews.toLocaleString()} reviews)</span>
              <span className="text-sm" style={{ color: 'var(--accent)' }}>✓ {product.sold.toLocaleString()} sold</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>₹{product.price.toLocaleString()}</span>
              <span className="product-original" style={{ fontSize: '1rem' }}>₹{product.originalPrice.toLocaleString()}</span>
              {discount > 0 && <span className="badge badge-sale">{discount}% off</span>}
            </div>

            {/* AI Decision */}
            <div className="card p-2 mb-3" style={{ borderLeft: `4px solid ${aiDecision === 'APPROVE' ? 'var(--accent)' : 'var(--danger)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span>🤖</span>
                <strong>AI Decision:</strong>
                <span style={{ color: aiDecision === 'APPROVE' ? 'var(--accent)' : 'var(--danger)', fontWeight: 700 }}>{aiDecision}</span>
              </div>
              <p className="text-sm text-muted">{aiReason}</p>
            </div>

            <p className="text-muted mb-3" style={{ lineHeight: 1.8 }}>{product.description}</p>

            {/* Specs */}
            <div className="card p-2 mb-3">
              <div className="filter-title mb-1">Quick Specs</div>
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                  <span className="text-muted">{k}</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Delivery */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              <span>{product.freeDelivery ? '✅ Free Delivery' : '🚚 Paid Delivery'}</span>
              <span>📦 Arrives in {product.deliveryDays} days</span>
              <span>🔄 7-day returns</span>
            </div>

            {/* Qty + Cart */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', borderRadius: '0.5rem', padding: '0.25rem' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', color: 'white', cursor: 'pointer', borderRadius: '0.4rem' }}>−</button>
                <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', color: 'white', cursor: 'pointer', borderRadius: '0.4rem' }}>+</button>
              </div>
              <button 
                className={`btn ${added ? 'btn-success' : 'btn-primary'}`} 
                style={{ flex: 1 }} 
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? '✓ Added to Cart' : '🛒 Add to Cart'}
              </button>
            </div>

            <div className="mb-3">
              <CheckoutButton amount={product.price * qty} productId={product.id} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className={`btn btn-secondary`} style={{ flex: 1 }} onClick={() => toggleWishlist(product.id)}>
                {isWished ? '❤️ Wishlisted' : '🤍 Wishlist'}
              </button>
              <button className={`btn btn-secondary`} style={{ flex: 1 }} onClick={() => toggleCompare(product.id)}>
                {inCompare ? '⚖️ Comparing' : '⚖️ Compare'}
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <section style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Similar Products</h2>
            <div className="grid-auto">
              {similar.map(p => {
                const { addToCart: ac } = useStore();
                return (
                  <div key={p.id} className="product-card">
                    <Link href={`/product/${p.id}`}><img className="product-img" src={p.image} alt={p.name} loading="lazy" /></Link>
                    <div className="product-body">
                      <Link href={`/product/${p.id}`}><div className="product-name">{p.name}</div></Link>
                      <div style={{ marginTop: '0.5rem' }}><span className="product-price">₹{p.price.toLocaleString()}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
