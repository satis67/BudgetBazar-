'use client';
import { PRODUCTS, SELLERS } from '../../lib/data';

const totalRevenue = SELLERS.reduce((s, sl) => s + sl.revenue, 0);
const totalSales = SELLERS.reduce((s, sl) => s + sl.totalSales, 0);
const commission = totalRevenue * 0.05;

export default function AdminPage() {
  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🛡 Admin Control Center</h1>
        <p className="text-muted mb-3">Full system overview and management.</p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {[
            { label: 'Gross Revenue', value: `₹${(totalRevenue / 10000000).toFixed(1)}Cr`, color: 'var(--accent)' },
            { label: 'Platform Commission', value: `₹${(commission / 100000).toFixed(1)}L`, color: 'var(--primary)' },
            { label: 'Total Orders', value: totalSales.toLocaleString(), color: 'var(--warning)' },
            { label: 'Active Sellers', value: SELLERS.length, color: 'var(--text)' },
            { label: 'Products', value: PRODUCTS.length, color: 'var(--secondary)' },
            { label: 'Commission Rate', value: '5%', color: 'var(--danger)' },
          ].map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-value" style={{ color: s.color, fontSize: '1.6rem' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sellers Table */}
        <div className="card p-3 mb-3">
          <h3 style={{ marginBottom: '1.25rem' }}>Top Sellers</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0' }}>Seller</th>
                <th>Level</th>
                <th>Products</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Commission</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SELLERS.map(seller => (
                <tr key={seller.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>
                    <div>{seller.name}</div>
                    <div className="text-muted text-sm">⭐ {seller.rating}</div>
                  </td>
                  <td><span className={`level-${seller.level.toLowerCase()}`}>{seller.level}</span></td>
                  <td>{seller.products}</td>
                  <td>{seller.totalSales.toLocaleString()}</td>
                  <td>₹{(seller.revenue / 100000).toFixed(1)}L</td>
                  <td>₹{((seller.revenue * 0.05) / 1000).toFixed(0)}K</td>
                  <td><span className="badge badge-sale">Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Products Table */}
        <div className="card p-3">
          <h3 style={{ marginBottom: '1.25rem' }}>All Products ({PRODUCTS.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem 0' }}>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                    <td style={{ padding: '0.6rem 0', fontWeight: 500 }}>{p.name}</td>
                    <td className="text-muted">{p.category}</td>
                    <td>₹{p.price.toLocaleString()}</td>
                    <td>{p.stock}</td>
                    <td style={{ color: 'var(--accent)' }}>{p.sold.toLocaleString()}</td>
                    <td>⭐ {p.rating}</td>
                    <td><span className={`badge ${p.stock < 20 ? 'badge-hot' : 'badge-sale'}`}>{p.stock < 20 ? 'Low Stock' : 'Active'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
