'use client';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../lib/store';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Truck, MapPin, Info, AlertTriangle, Loader2, Package, Wallet } from 'lucide-react';
import { useState } from 'react';
import CheckoutButton from '@/components/CheckoutButton';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, budget } = useStore();
  const [address, setAddress] = useState("");
  const savings = cart.reduce((s, i) => s + (i.originalPrice - i.price) * i.qty, 0);
  const delivery = cartTotal > 999 ? 0 : 49;
  const grandTotal = cartTotal + delivery;
  const budgetLeft = budget - grandTotal;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/marketplace" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-4xl font-black tracking-tight">Your Cart</h1>
          <span className="ml-auto bg-indigo-500/10 text-indigo-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/20">
            {cart.length} Items Selected
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-[3rem]">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
              <ShoppingCart size={40} className="text-gray-600" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Empty Cart</h3>
            <p className="text-gray-500 max-w-sm mb-10">Your cart looks a bit lonely. Let's find some amazing products for you.</p>
            <Link href="/marketplace" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex justify-between items-center px-4 mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">Product Details</span>
                <button 
                  onClick={clearCart}
                  className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} /> Clear All
                </button>
              </div>

              <AnimatePresence mode="popLayout">
                {cart.map(item => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id} 
                    className="backdrop-blur-xl bg-white/5 border border-white/10 p-4 rounded-3xl flex flex-col md:flex-row gap-6 items-center"
                  >
                    <div className="relative group overflow-hidden rounded-2xl w-32 h-32 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <Link href={`/product/${item.id}`} className="hover:text-indigo-400 transition-colors">
                        <h4 className="text-xl font-bold mb-1">{item.name}</h4>
                      </Link>
                      <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-4">Seller: {item.sellerName || 'Verified Seller'}</p>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-1">
                          <button 
                            onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center font-black">{item.qty}</span>
                          <button 
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-2xl font-black">₹{(item.price * item.qty).toLocaleString()}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-xs text-green-500 font-bold">Saved ₹{((item.originalPrice - item.price) * item.qty).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-4 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    >
                      <Trash2 size={24} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 sticky top-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-2xl bg-white/5 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Package size={120} />
                </div>

                <h3 className="text-2xl font-black mb-8">Order Summary</h3>

                <AnimatePresence>
                  {budgetLeft < 0 && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-red-500/20 border border-red-500/30 p-4 rounded-2xl mb-6 flex gap-3 text-red-400"
                    >
                      <AlertTriangle className="flex-shrink-0" size={20} />
                      <div className="text-xs font-bold leading-relaxed">
                        Budget exceeded by ₹{Math.abs(budgetLeft).toLocaleString()}! Consider removing some items.
                      </div>
                    </motion.div>
                  )}
                  {budgetLeft >= 0 && budgetLeft < budget * 0.2 && (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-indigo-500/20 border border-indigo-500/30 p-4 rounded-2xl mb-6 flex gap-3 text-indigo-400"
                    >
                      <Info className="flex-shrink-0" size={20} />
                      <div className="text-xs font-bold leading-relaxed">
                        You have ₹{budgetLeft.toLocaleString()} remaining in your budget. Good pick!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span>Subtotal</span>
                    <span className="text-white">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex justify-between text-green-500 font-bold italic">
                      <span>Total Savings</span>
                      <span>-₹{savings.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400 font-medium">
                    <span className="flex items-center gap-2"><Truck size={14} /> Delivery</span>
                    <span className={delivery === 0 ? 'text-green-500 font-black' : 'text-white'}>
                      {delivery === 0 ? 'FREE' : `₹${delivery}`}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-white/10 mb-6" />

                {/* Shipping Address */}
                <div className="mb-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                    <MapPin size={14} /> Shipping Address
                  </h4>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full address, pincode, and phone..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-24 resize-none"
                  />
                </div>

                <div className="flex justify-between items-end mb-10">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500">Total Amount</span>
                  <span className="text-4xl font-black tracking-tighter text-indigo-400">₹{grandTotal.toLocaleString()}</span>
                </div>

                <CheckoutButton 
                  amount={grandTotal} 
                  items={cart} 
                  address={address} 
                  onSuccess={() => setAddress("")}
                />
                
                <div className="mt-8 flex flex-col items-center justify-center gap-2 py-4 border-t border-white/5 opacity-60">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
                    <Truck size={14} /> Cash on Delivery Available
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">Safe & Secure Physical Payments</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
