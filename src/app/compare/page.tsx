'use client';
import { useState, Fragment } from 'react';
import Link from 'next/link';
import { useStore } from '../../lib/store';
import { PRODUCTS } from '../../lib/data';

export default function ComparePage() {
  const { compareList, toggleCompare } = useStore();
  const products = compareList.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as typeof PRODUCTS;

  const allSpecKeys = Array.from(new Set(products.flatMap(p => Object.keys(p.specs))));

  if (products.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ paddingTop: '2rem' }}>
          <div className="empty-state">
            <div className="icon">⚖️</div>
            <h2>No products to compare</h2>
            <p className="mb-3">Go to the marketplace and click "Compare" on up to 2 products.</p>
            <Link href="/marketplace" className="btn btn-primary">Browse Marketplace</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>⚖️ Product Comparison</h1>

        {products.length === 2 && (() => {
          const p2p = (p: typeof PRODUCTS[0]) => p.rating / (p.price / 10000);
          const winner = p2p(products[0]) >= p2p(products[1]) ? products[0] : products[1];
          return (
            <div className="alert alert-info mb-3" style={{ fontSize: '1rem' }}>
              🤖 <strong>AI Verdict:</strong> <strong style={{ color: 'var(--primary)' }}>{winner.name}</strong> is the better value — higher Price-to-Performance ratio ({p2p(winner).toFixed(2)} vs {p2p(winner === products[0] ? products[1] : products[0]).toFixed(2)}).
            </div>
          );
        })()}

        <div style={{ display: 'grid', gridTemplateColumns: `200px ${products.map(() => '1fr').join(' ')}`, gap: '1rem' }}>
          {/* Header images row */}
          <div></div>
          {products.map(p => (
            <div key={p.id} className="card p-2" style={{ textAlign: 'center' }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '0.75rem', marginBottom: '0.75rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{p.name}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{p.price.toLocaleString()}</div>
              <div className="stars text-sm">{'★'.repeat(Math.floor(p.rating))} {p.rating}</div>
              <button className="btn btn-danger btn-sm btn-full" style={{ marginTop: '0.75rem' }} onClick={() => toggleCompare(p.id)}>Remove</button>
            </div>
          ))}

          {/* Comparison rows */}
          {[
            ['Price', (p: typeof PRODUCTS[0]) => `₹${p.price.toLocaleString()}`],
            ['Rating', (p: typeof PRODUCTS[0]) => `${p.rating} ★ (${p.reviews.toLocaleString()})`],
            ['Category', (p: typeof PRODUCTS[0]) => p.category],
            ['Delivery', (p: typeof PRODUCTS[0]) => `${p.deliveryDays} days${p.freeDelivery ? ' (Free)' : ''}`],
            ['In Stock', (p: typeof PRODUCTS[0]) => `${p.stock} units`],
            ['Sold', (p: typeof PRODUCTS[0]) => `${p.sold.toLocaleString()}`],
            ...allSpecKeys.map(k => [k, (p: typeof PRODUCTS[0]) => p.specs[k] || '—']),
          ].map(([label, fn]) => (
            <Fragment key={label as string}>
              <div className="flex-center" style={{ padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>
                {label as string}
              </div>
              {products.map(p => (
                <div key={`${p.id}-${label}`} style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '0.5rem', textAlign: 'center', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                  {(fn as Function)(p)}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
