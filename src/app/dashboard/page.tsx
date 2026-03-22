'use client';
import { useState, Fragment } from 'react';
import Link from 'next/link';
import { useStore } from '../../lib/store';
import { PRODUCTS } from '../../lib/data';

const ORDERS = [
  { id: 'ORD-2024-001', name: 'iPhone 16 Pro Max 256GB', status: 'delivered', date: '2024-12-01', total: 134900 },
  { id: 'ORD-2024-002', name: 'Sony WH-1000XM5 ANC', status: 'shipped', date: '2025-01-15', total: 28990 },
  { id: 'ORD-2024-003', name: 'MacBook Air M3 15"', status: 'confirmed', date: '2025-03-18', total: 149900 },
];

const STATUS_STEPS = ['placed', 'confirmed', 'shipped', 'delivered'];

export default function DashboardPage() {
  const { budget, setBudget, cart, wishlist, cartTotal } = useStore();
  const [newBudget, setNewBudget] = useState(String(budget));
  const points = cart.length * 25 + wishlist.length * 5;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>📊 My Dashboard</h1>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {[
            { icon: '🏆', label: 'Smart Points', value: points, color: 'var(--warning)' },
            { icon: '🛒', label: 'Cart Items', value: cart.length, color: 'var(--primary)' },
            { icon: '❤️', label: 'Wishlisted', value: wishlist.length, color: 'var(--secondary)' },
            { icon: '📦', label: 'Total Orders', value: ORDERS.length, color: 'var(--accent)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          {/* Budget Planner */}
          <div className="card p-3">
            <h3 style={{ marginBottom: '1.25rem' }}>💰 Budget Intelligence</h3>
            <div className="form-group">
              <label>Monthly Budget (₹)</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input type="number" value={newBudget} onChange={e => setNewBudget(e.target.value)} />
                <button className="btn btn-primary btn-sm" onClick={() => setBudget(Number(newBudget))}>Set</button>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span className="text-muted">Spent (Cart)</span>
                <span>₹{cartTotal.toLocaleString()} / ₹{budget.toLocaleString()}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (cartTotal / budget) * 100)}%` }} />
              </div>
              {cartTotal > budget * 0.8 && (
                <div className="alert alert-warning mt-2">⚠️ You're above 80% of your budget!</div>
              )}
            </div>
          </div>

          {/* Rewards */}
          <div className="card p-3">
            <h3 style={{ marginBottom: '1.25rem' }}>🏆 Smart Points</h3>
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--heading)' }} className="gradient-text">{points}</div>
              <div className="text-muted text-sm">Points earned this month</div>
            </div>
            <div className="progress-bar mt-2">
              <div className="progress-fill" style={{ width: `${Math.min(100, points)}%` }} />
            </div>
            <p className="text-muted text-sm mt-2">{Math.max(0, 100 - points)} more points for Gold Badge 🥇</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <span className="badge badge-new">Smart Shopper</span>
              {points >= 50 && <span className="badge badge-hot">Deal Hunter</span>}
              {cart.length >= 3 && <span className="badge badge-ai">AI Trusted Buyer</span>}
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="card p-3">
          <h3 style={{ marginBottom: '1.5rem' }}>📦 My Orders</h3>
          {ORDERS.map(order => {
            const stepIdx = STATUS_STEPS.indexOf(order.status);
            return (
              <div key={order.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="flex-between mb-2">
                  <div>
                    <div style={{ fontWeight: 600 }}>{order.name}</div>
                    <div className="text-muted text-sm">{order.id} · {order.date}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>₹{order.total.toLocaleString()}</div>
                </div>
                <div className="order-status-bar">
                  {STATUS_STEPS.map((step, i) => (
                    <Fragment key={step}>
                      <div className={`order-step ${i <= stepIdx ? 'done' : ''}`}>
                        <div className="order-step-circle">{i <= stepIdx ? '✓' : i + 1}</div>
                        <span style={{ textTransform: 'capitalize' }}>{step}</span>
                      </div>
                      {i < STATUS_STEPS.length - 1 && <div className={`order-step-line ${i < stepIdx ? 'done' : ''}`} />}
                    </Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
