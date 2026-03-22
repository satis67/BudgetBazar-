"use client";

import React, { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Truck, RotateCcw, ShieldCheck, Heart, Scale, Star, ChevronRight, ShoppingCart } from 'lucide-react';
import { PRODUCTS } from '../../../lib/data';
import { useStore } from '../../../lib/store';
import CheckoutButton from '@/components/CheckoutButton';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return notFound();

  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareList, budget } = useStore();
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ ...product, qty: 1 });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const [checking, setChecking] = useState(false);

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setChecking(true);
      setDeliveryStatus(null);
      setTimeout(() => {
        setDeliveryStatus(`Delivery by ${new Date(Date.now() + product.deliveryDays * 86400000).toLocaleDateString()}`);
        setChecking(false);
      }, 1500);
    } else {
      setDeliveryStatus("Please enter a valid 6-digit pincode");
    }
  };

  const isWished = wishlist.includes(product.id);
  const inCompare = compareList.includes(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const aiDecision = product.price <= budget ? 'APPROVE' : 'REJECT';

  const ratingsBreakdown = [
    { star: 5, count: 8500, color: '#38a169' },
    { star: 4, count: 2100, color: '#48bb78' },
    { star: 3, count: 1200, color: '#f6e05e' },
    { star: 2, count: 450, color: '#f6ad55' },
    { star: 1, count: 200, color: '#f56565' },
  ];

  const similar = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="page bg-gray-50/50 min-h-screen">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/marketplace" className="hover:text-indigo-600 transition-colors">Marketplace</Link>
          <ChevronRight size={14} />
          <Link href={`/marketplace?category=${product.category}`} className="hover:text-indigo-600 transition-colors">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Images Section */}
          <div className="lg:col-span-5 space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 sticky top-24"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full aspect-square object-cover rounded-2xl"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button 
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all shadow-lg ${added ? 'bg-green-600 text-white' : 'bg-[#ff9f00] text-white hover:bg-[#fb9200]'}`}
                >
                  <ShoppingCart size={20} /> {added ? 'ADDED' : 'ADD TO CART'}
                </button>
                <button className="flex items-center justify-center gap-2 py-4 bg-[#fb641b] hover:bg-[#f4511e] text-white rounded-xl font-bold shadow-lg transition-all">
                  BUY NOW
                </button>
              </div>
            </motion.div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              {product.badge && (
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  ✨ {product.badge}
                </span>
              )}
              <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
                  {product.rating} <Star size={14} fill="white" />
                </div>
                <span className="text-gray-500 font-medium text-sm">
                  {product.reviews.toLocaleString()} Ratings & {Math.floor(product.reviews/4).toLocaleString()} Reviews
                </span>
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_627d61.png" alt="Assured" className="h-5" />
              </div>

              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-black text-gray-900">₹{product.price.toLocaleString()}</span>
                <span className="text-gray-400 line-through text-lg">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-green-600 font-bold text-lg">{discount}% off</span>
              </div>
              <p className="text-xs text-gray-400 font-medium italic mb-6">+ ₹99 Secured Packaging Fee</p>

              {/* AI Decision Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-5 rounded-2xl mb-8 border-l-4 ${aiDecision === 'APPROVE' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🤖</span>
                  <span className="font-bold text-sm uppercase tracking-wider text-gray-700">AI Budget Assistant</span>
                  <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-black ${aiDecision === 'APPROVE' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {aiDecision}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {aiDecision === 'APPROVE' 
                    ? `Perfect match! This fits your ₹${budget.toLocaleString()} budget with high quality assurance.`
                    : `Wait! This exceeds your ₹${budget.toLocaleString()} budget. Try looking at the similar products below.`}
                </p>
              </motion.div>

              {/* Delivery Check */}
              <div className="flex flex-wrap gap-8 items-start mb-8 border-t border-gray-50 pt-8">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
                    <MapPin size={16} /> Check Delivery
                  </h3>
                  <div className="flex gap-2 max-w-sm">
                    <input 
                      type="text" 
                      placeholder="Enter Pincode" 
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0,6))}
                    />
                    <button 
                      onClick={checkDelivery}
                      disabled={checking || pincode.length !== 6}
                      className={`text-indigo-600 font-bold text-sm px-4 py-2 rounded-xl transition-all ${checking || pincode.length !== 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50'}`}
                    >
                      {checking ? 'Checking...' : 'Check'}
                    </button>
                  </div>
                  {deliveryStatus && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] font-bold mt-2 text-green-600">
                      {deliveryStatus}
                    </motion.p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck size={16} className="text-indigo-500" /> <span>{product.freeDelivery ? 'Free Delivery' : 'Standard Delivery Charges'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RotateCcw size={16} className="text-indigo-500" /> <span>7 Days Replacement Policy</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-50 pt-8 mb-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Product Description</h3>
                <p className="text-gray-600 text-sm leading-8">{product.description}</p>
              </div>

              {/* Ratings Breakdown */}
              <div className="border-t border-gray-50 pt-8">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-6">Ratings & Reviews</h3>
                <div className="flex flex-wrap gap-12 items-center">
                  <div className="text-center">
                    <h4 className="text-5xl font-black text-gray-900">{product.rating} <span className="text-2xl text-gray-400">/ 5</span></h4>
                    <p className="text-xs text-gray-400 font-bold mt-2 uppercase tracking-widest">{product.reviews.toLocaleString()} Reviews</p>
                  </div>
                  
                  <div className="flex-1 min-w-[250px] space-y-3">
                    {ratingsBreakdown.map((r) => (
                      <div key={r.star} className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-500 w-4">{r.star}★</span>
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(r.count / 12000) * 100}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: r.color }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold w-12 text-right">{r.count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Wishlist/Compare) */}
              <div className="flex gap-4 border-t border-gray-50 pt-8 mt-8">
                <button 
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold border transition-all ${isWished ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Heart size={18} fill={isWished ? "currentColor" : "none"} /> {isWished ? 'WISHLISTED' : 'WISHLIST'}
                </button>
                <button 
                  onClick={() => toggleCompare(product.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold border transition-all ${inCompare ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <Scale size={18} /> {inCompare ? 'COMPARING' : 'COMPARE'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-8 border-l-4 border-indigo-600 pl-4">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similar.map(p => (
                <motion.div 
                  whileHover={{ y: -5 }}
                  key={p.id} 
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group"
                >
                  <Link href={`/product/${p.id}`}>
                    <img className="aspect-square object-cover rounded-xl mb-4 group-hover:opacity-90 transition-opacity" src={p.image} alt={p.name} />
                  </Link>
                  <Link href={`/product/${p.id}`}>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{p.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-black text-gray-900">₹{p.price.toLocaleString()}</span>
                    <span className="text-xs text-green-600 font-bold">Hot Deal</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
