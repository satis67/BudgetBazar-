'use client';
import Link from 'next/link';
import { useStore } from '../../lib/store';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, budget } = useStore();
  const savings = cart.reduce((s, i) => s + (i.originalPrice - i.price) * i.qty, 0);
  const delivery = cartTotal > 999 ? 0 : 49;
  const grandTotal = cartTotal + delivery;
  const budgetLeft = budget - grandTotal;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>🛒 Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p className="mb-3">Add products from the marketplace to get started</p>
            <Link href="/marketplace" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'flex-start' }}>
            {/* Cart Items */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="text-muted text-sm">{cart.length} item(s)</span>
                <button className="text-sm text-danger" style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={clearCart}>Clear All</button>
              </div>

              {cart.map(item => (
                <div key={item.id} className="card p-2 mb-2" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0.75rem', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <Link href={`/product/${item.id}`}><div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>{item.name}</div></Link>
                    <div className="text-muted text-sm mb-1">by {item.sellerName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', borderRadius: '0.5rem', padding: '0.2rem 0.4rem' }}>
                        <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', color: 'white', cursor: 'pointer' }}>−</button>
                        <span style={{ minWidth: '1.5rem', textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: '28px', height: '28px', border: 'none', background: 'transparent', color: 'white', cursor: 'pointer' }}>+</button>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{(item.price * item.qty).toLocaleString()}</span>
                      <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>🗑 Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card p-3" style={{ position: 'sticky', top: '90px' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>

              {budgetLeft < 0 && (
                <div className="alert alert-warning mb-2">
                  ⚠️ This exceeds your budget by ₹{Math.abs(budgetLeft).toLocaleString()}!
                </div>
              )}
              {budgetLeft >= 0 && budgetLeft < budget * 0.2 && (
                <div className="alert alert-info mb-2">
                  💡 You have ₹{budgetLeft.toLocaleString()} left in your budget.
                </div>
              )}

              {[
                ['Subtotal', `₹${cartTotal.toLocaleString()}`],
                ['You Save', `-₹${savings.toLocaleString()}`, 'var(--accent)'],
                ['Delivery', delivery === 0 ? 'FREE' : `₹${delivery}`, delivery === 0 ? 'var(--accent)' : undefined],
              ].map(([k, v, color]) => (
                <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                  <span className="text-muted">{k}</span>
                  <span style={{ fontWeight: 600, color: color as string }}>{v}</span>
                </div>
              ))}

              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                <span>Grand Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>

              <button className="btn btn-primary btn-full btn-lg">
                Proceed to Checkout 🚀
              </button>
              <p className="text-muted text-sm text-center" style={{ marginTop: '0.75rem' }}>🔒 Secure payment · 7-day returns</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
