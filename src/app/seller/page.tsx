'use client';
import { useState } from 'react';
import { PRODUCTS, SELLERS } from '../../lib/data';

const myProducts = PRODUCTS.slice(0, 5);

export default function SellerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add'>('overview');
  const me = SELLERS[0];
  const grossRevenue = me.revenue;
  const commission = grossRevenue * 0.05;
  const netRevenue = grossRevenue - commission;
  const [form, setForm] = useState({ name: '', price: '', category: 'Electronics', desc: '' });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="flex-between mb-3">
          <div>
            <h1 style={{ fontSize: '1.75rem' }}>🏪 Seller Portal</h1>
            <p className="text-muted text-sm">{me.name} · <span className={`level-${me.level.toLowerCase()}`}>⭐ {me.level}</span></p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {(['overview', 'products', 'add'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`btn ${activeTab === t ? 'btn-primary' : 'btn-secondary'} btn-sm`} style={{ textTransform: 'capitalize' }} >
                {t === 'add' ? '+ New Product' : t}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { label: 'Gross Revenue', value: `₹${(grossRevenue / 100000).toFixed(1)}L`, color: 'var(--accent)' },
                { label: `Commission (5%)`, value: `-₹${(commission / 1000).toFixed(0)}K`, color: 'var(--danger)' },
                { label: 'Net Earnings', value: `₹${(netRevenue / 100000).toFixed(1)}L`, color: 'var(--primary)' },
                { label: 'Total Orders', value: me.totalSales.toLocaleString(), color: 'var(--warning)' },
                { label: 'Products Listed', value: me.products, color: 'var(--text)' },
                { label: 'Avg Rating', value: `${me.rating} ★`, color: 'var(--warning)' },
              ].map(s => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-value" style={{ color: s.color, fontSize: '1.6rem' }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="card p-3 mb-2">
              <h3 style={{ marginBottom: '1rem' }}>🎖 Seller Level Progress</h3>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                {['Bronze', 'Silver', 'Gold', 'Platinum'].map((lvl, i) => (
                  <div key={lvl} style={{ textAlign: 'center', opacity: i <= 3 ? 1 : 0.4 }}>
                    <div className={`stat-value level-${lvl.toLowerCase()}`} style={{ fontSize: '1.5rem' }}>
                      {i === 0 ? '🥉' : i === 1 ? '🥈' : i === 2 ? '🥇' : '💎'}
                    </div>
                    <div className="text-sm" style={{ marginTop: '0.3rem' }}>{lvl}</div>
                    {me.level === lvl && <span className="badge badge-ai" style={{ marginTop: '0.3rem' }}>CURRENT</span>}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <div className="card p-3">
            <h3 style={{ marginBottom: '1rem' }}>My Products</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0' }}>Product</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem 0', fontWeight: 500, fontSize: '0.9rem' }}>{p.name}</td>
                    <td>₹{p.price.toLocaleString()}</td>
                    <td className="text-muted">{p.category}</td>
                    <td>{p.stock}</td>
                    <td>⭐ {p.rating}</td>
                    <td><span className="badge badge-sale">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="card p-3" style={{ maxWidth: 600, margin: '0 auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>➕ Add New Product</h3>
            {submitted ? (
              <div className="alert alert-success">✅ Product submitted for review! It will go live within 24 hours.</div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                <div className="form-group"><label>Product Name</label><input required placeholder="e.g. Samsung Galaxy S25 Ultra" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="form-group"><label>Price (₹)</label><input required type="number" placeholder="Enter selling price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                <div className="form-group"><label>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty', 'Books', 'Gaming', 'Furniture', 'Grocery'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Description</label><textarea rows={4} placeholder="Describe your product..." value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} style={{ resize: 'vertical' }} /></div>
                <div className="alert alert-info mb-3">🤖 AI will auto-generate specs and optimize your listing for better visibility.</div>
                <button type="submit" className="btn btn-primary btn-full btn-lg">Submit Product</button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
