'use client';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PRODUCTS, CATEGORIES, FLASH_SALE_PRODUCTS } from '../lib/data';
import ProductCard from '../components/ProductCard';
import FlashSaleTimer from '../components/FlashSaleTimer';
import { Sparkles, Zap, ShoppingBag, TrendingUp, Star, ShieldCheck, ArrowRight, Layers, Flame, MousePointer2 } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  All: '🏪', Electronics: '📱', Fashion: '👗', Home: '🏠',
  Sports: '⚽', Beauty: '💄', Books: '📚', Gaming: '🎮', Furniture: '🪑', Grocery: '🛒'
};

const STATS = [
  { value: '2M+', label: 'Happy Buyers', color: '#6366f1' },
  { value: '50K+', label: 'Products', color: '#ec4899' },
  { value: '₹100Cr+', label: 'Sales', color: '#10b981' },
  { value: '4.8★', label: 'Rating', color: '#f59e0b' },
];

const FRONTEND_FEATURES = [
  { icon: <Sparkles className="text-indigo-400" />, title: 'AI Decision Engine', desc: 'Smart APPROVE/REJECT on every product based on your budget.' },
  { icon: <Layers className="text-pink-400" />, title: 'Reels Discovery', desc: 'Vertical scroll-snap product feed. Shop like Instagram.' },
  { icon: <Zap className="text-yellow-400" />, title: 'Live Auctions', desc: 'Real-time bidding with live countdown timers. Never miss a deal.' },
  { icon: <Star className="text-purple-400" />, title: 'Smart Recommendations', desc: 'AI-personalized suggestions based on your history.' },
  { icon: <ShieldCheck className="text-green-400" />, title: 'Buyer Protection', desc: 'Every transaction is secured with AI fraud detection.' },
  { icon: <Flame className="text-orange-400" />, title: 'Flash Sales', desc: 'Exclusive deals that disappear in hours. First come, first serve.' },
];

export default function HomePage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full" 
        />
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-pink-600/10 blur-[150px] rounded-full" 
        />
      </div>

      {/* Category Bar (Flipkart Style) */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/5 border-b border-white/10 py-3 overflow-x-auto scrollbar-hide">
        <div className="container mx-auto px-4 flex gap-10 items-center justify-center min-w-max">
          {CATEGORIES.map(cat => (
            <Link 
              key={cat} 
              href={`/marketplace?category=${cat}`} 
              className="group flex flex-col items-center gap-1.5 transition-all"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform duration-300 transform-gpu">{CATEGORY_ICONS[cat] || '📦'}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white group-hover:tracking-[0.15em] transition-all">{cat}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
              <Sparkles size={14} /> AI Decision Engine v2.0
            </span>
            <h1 className="text-7xl md:text-8xl font-black mb-6 tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 overflow-visible">
              BudgetBazar
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Experience the future of commerce. AI-driven budget advice, real-time auctions, and premium shop feeds—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/marketplace" className="group relative px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-2 hover:bg-gray-200 transition-all shadow-xl shadow-white/10">
                Explore Marketplace <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/auction" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all">
                <Zap size={18} className="text-yellow-400" /> Live Auctions
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20"
          >
            {STATS.map(s => (
              <div key={s.label} className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl">
                <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <section className="py-20 border-y border-white/10 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-orange-500 mb-2">
                <Flame size={24} fill="currentColor" />
                <h2 className="text-3xl font-black uppercase tracking-tight">Flash Sale</h2>
              </div>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Premium high-performance gear at jaw-dropping prices</p>
            </div>
            <FlashSaleTimer />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FLASH_SALE_PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Hero Features Grid */}
      <section className="py-32 container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-4">Unrivaled Excellence</h2>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">We've built features that traditional marketplaces can only dream of. Designed for the web of 2026.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FRONTEND_FEATURES.map((f, i) => (
            <motion.div 
              whileHover={{ y: -10 }}
              key={f.title} 
              className="group backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500"
            >
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-black mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending Selection */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <TrendingUp className="text-pink-500" />
              <h2 className="text-4xl font-black tracking-tight">Trending Now</h2>
            </div>
            <Link href="/marketplace" className="text-indigo-400 font-bold flex items-center gap-2 hover:underline">
              View Collection <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.filter(p => p.badge === 'TRENDING' || p.badge === 'HOT').slice(0, 8).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive CTA */}
      <section className="py-32 container mx-auto px-4">
        <div className="relative group overflow-hidden rounded-[3rem] p-16 md:p-24 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-90 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover opacity-20 mix-blend-overlay" />
          
          <div className="relative z-10 text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">Ready to Evolve?</h2>
            <p className="text-xl text-white/80 mb-12 max-w-xl mx-auto">Join the premium community of over 12,000 sellers and start your journey with Budget Bazar today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/seller" className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all shadow-2xl">
                Become a Seller
              </Link>
              <Link href="/register" className="px-12 py-5 bg-black text-white font-black rounded-2xl hover:bg-gray-900 transition-all">
                Join Now <ArrowRight size={18} className="inline ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Mouse Interaction Badge */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="fixed bottom-10 right-10 z-50 p-4 backdrop-blur-3xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl pointer-events-none hidden lg:flex items-center gap-3"
      >
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live AI Optimization Active</span>
      </motion.div>
    </div>
  );
}
