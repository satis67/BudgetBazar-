'use client';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS, CATEGORIES, FLASH_SALE_PRODUCTS } from '../lib/data';
import ProductCard from '../components/ProductCard';
import FlashSaleTimer from '../components/FlashSaleTimer';

const CATEGORY_ICONS: Record<string, string> = {
  All: '🏪', Electronics: '📱', Fashion: '👗', Home: '🏠',
  Sports: '⚽', Beauty: '💄', Books: '📚', Gaming: '🎮', Furniture: '🪑', Grocery: '🛒'
};

const STATS = [
  { value: '2M+', label: 'Happy Buyers' },
  { value: '50K+', label: 'Products Listed' },
  { value: '₹100Cr+', label: 'GMV Processed' },
  { value: '4.8★', label: 'Average Rating' },
];

const FRONTEND_FEATURES = [
  { icon: '🤖', title: 'AI Decision Engine', desc: 'Smart APPROVE/REJECT on every product based on your budget and P2P ratio.' },
  { icon: '🎬', title: 'Reels Discovery', desc: 'Vertical scroll-snap product feed. Shop like Instagram.' },
  { icon: '⚡', title: 'Live Auctions', desc: 'Real-time bidding with live countdown timers. Never miss a deal.' },
  { icon: '💬', title: 'AI Chat Assistant', desc: 'Conversational product discovery powered by LLaMA 3 AI.' },
  { icon: '⚖️', title: 'Compare Engine', desc: 'Side-by-side product comparison with AI-driven verdict.' },
  { icon: '💰', title: 'Budget Intelligence', desc: 'Set your budget, get warnings before you overspend.' },
  { icon: '🏆', title: 'Seller Levels', desc: 'Bronze → Silver → Gold → Platinum seller progression.' },
  { icon: '🎯', title: 'Smart Recommendations', desc: 'AI-personalized suggestions based on your browsing history.' },
  { icon: '👥', title: 'Group Buy', desc: 'Invite friends, unlock lower price together.' },
];

export default function HomePage() {
  return (
    <div className="page">
      {/* Category Bar (Flipkart Style) */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: '0.75rem 0', position: 'sticky', top: '70px', zIndex: 10 }}>
        <div className="container" style={{ display: 'flex', gap: '2rem', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <Link key={cat} href={`/marketplace?category=${cat}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', textDecoration: 'none', color: 'var(--text)' }}>
              <span style={{ fontSize: '1.5rem' }}>{CATEGORY_ICONS[cat] || '📦'}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{cat}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="hero container" style={{ paddingTop: '4rem' }}>
        <div className="animate-in" style={{ marginBottom: '1rem' }}>
          <span className="badge badge-ai" style={{ fontSize: '0.75rem', padding: '0.4rem 0.9rem' }}>
            ✨ AI Decision Engine v2.0 — LLaMA 3 Powered
          </span>
        </div>
        <h1 className="hero-title animate-in axe-stylish">
          BudgetBazar
        </h1>
        <p className="hero-sub animate-in">
          India&apos;s only marketplace with real-time AI budget advice, live auctions, and social commerce baked in.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }} className="animate-in">
          <Link href="/marketplace" className="btn btn-primary btn-lg">Explore Now →</Link>
          <Link href="/auction" className="btn btn-secondary btn-lg">⚡ Live Auction</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '4rem', maxWidth: '700px', margin: '4rem auto 0' }}>
          {STATS.map(s => (
            <div key={s.label} className="stat-card text-center">
              <div className="stat-value gradient-text">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="section" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(236,72,153,0.05))', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="flex-between mb-3">
            <div>
              <h2 style={{ fontSize: '1.75rem' }}>🔥 Flash Sale</h2>
              <p className="text-muted text-sm">Ends in:</p>
            </div>
            <FlashSaleTimer />
          </div>
          <div className="grid-auto">
            {FLASH_SALE_PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <h2 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>Browse Categories</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <Link key={cat} href={`/marketplace?category=${cat}`} className="cat-pill">
              <span className="cat-icon">{CATEGORY_ICONS[cat] || '📦'}</span>
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="section container">
        <div className="flex-between mb-3">
          <h2 style={{ fontSize: '1.75rem' }}>🔥 Trending Now</h2>
          <Link href="/marketplace" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div className="grid-auto">
          {PRODUCTS.filter(p => p.badge === 'TRENDING' || p.badge === 'HOT').slice(0, 8).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* AI Features */}
      <section className="section" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="text-center mb-3">
            <h2 style={{ fontSize: '2rem' }}>Why Budget Bazar?</h2>
            <p className="text-muted" style={{ marginTop: '0.5rem' }}>Features that are 10 years ahead of every other marketplace.</p>
          </div>
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {FRONTEND_FEATURES.map(f => (
              <div key={f.title} className="card p-3">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p className="text-muted text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section container">
        <div className="flex-between mb-3">
          <h2 style={{ fontSize: '1.75rem' }}>🆕 New Arrivals</h2>
          <Link href="/marketplace?badge=NEW" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        <div className="grid-auto">
          {PRODUCTS.filter(p => p.badge === 'NEW').slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section container">
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '1.5rem', padding: '4rem 3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Start Selling Today</h2>
          <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.1rem' }}>Join 12,000+ sellers. Zero upfront fees. AI-powered listing.</p>
          <Link href="/seller" className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700, padding: '1rem 2.5rem' }}>
            Become a Seller →
          </Link>
        </div>
      </section>
    </div>
  );
}
