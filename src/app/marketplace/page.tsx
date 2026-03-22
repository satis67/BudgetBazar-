'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES } from '../../lib/data';
import ProductCard from '../../components/ProductCard';

const SORT_OPTIONS = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Best Rating', 'Most Reviews'];
const PRICE_RANGES = [
  { label: 'Under ₹1,000', max: 1000 },
  { label: '₹1,000 – ₹10,000', min: 1000, max: 10000 },
  { label: '₹10,000 – ₹50,000', min: 10000, max: 50000 },
  { label: '₹50,000 – ₹1,50,000', min: 50000, max: 150000 },
  { label: 'Above ₹1,50,000', min: 150000 },
];

export default function MarketplacePage() {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [sort, setSort] = useState('Relevance');
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number; label?: string } | null>(null);
  const [rating, setRating] = useState(0);

  const filtered = useMemo(() => {
    let p = [...PRODUCTS];
    if (category !== 'All') p = p.filter(pr => pr.category === category);
    if (search) p = p.filter(pr => pr.name.toLowerCase().includes(search.toLowerCase()) || (pr.tags && pr.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))));
    if (priceRange) p = p.filter(pr => (!priceRange.min || pr.price >= priceRange.min) && (!priceRange.max || pr.price <= priceRange.max));
    if (rating > 0) p = p.filter(pr => pr.rating >= rating);
    if (sort === 'Price: Low to High') p.sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High to Low') p.sort((a, b) => b.price - a.price);
    else if (sort === 'Best Rating') p.sort((a, b) => b.rating - a.rating);
    else if (sort === 'Most Reviews') p.sort((a, b) => b.reviews - a.reviews);
    return p;
  }, [category, search, sort, priceRange, rating]);

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>

        {/* Top bar */}
        <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Marketplace</h1>
            <p className="text-muted text-sm">{filtered.length} products found</p>
          </div>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ maxWidth: 300 }}>
              <span>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ width: 'auto' }}>
              {SORT_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`filter-chip ${category === cat ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>{cat}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <aside className="filter-sidebar" style={{ display: 'block', minWidth: '240px' }}>
            <div style={{ display: 'block' }}>
              <div className="filter-group">
                <div className="filter-title">Price Range</div>
                {PRICE_RANGES.map(r => (
                  <div key={r.label} className="filter-chip active" style={{ display: 'block', margin: '0.3rem 0', cursor: 'pointer' }}
                    onClick={() => setPriceRange(priceRange?.label === r.label ? null : r as any)}>
                    {r.label}
                  </div>
                ))}
              </div>
              <div className="filter-group">
                <div className="filter-title">Min Rating</div>
                {[4, 3, 2].map(r => (
                  <button key={r} className={`filter-chip ${rating === r ? 'active' : ''}`} onClick={() => setRating(rating === r ? 0 : r)}>
                    {'★'.repeat(r)} & above
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div style={{ flex: 1 }}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No products found</h3>
                <p>Try a different search or category</p>
              </div>
            ) : (
              <div className="grid-auto">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
