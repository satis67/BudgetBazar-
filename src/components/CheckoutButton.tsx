"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStore } from '@/lib/store';
import { createOrder } from '@/lib/firestore';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CheckoutButtonProps {
  amount: number;
  items: any[];
  address: string;
  onSuccess?: () => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ amount, items, address, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { clearCart } = useStore();
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please login to place an order.");
      router.push('/login');
      return;
    }

    if (!address || address.trim().length < 10) {
      alert("Please enter a valid shipping address.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        items,
        totalAmount: amount,
        address,
        paymentMethod: "COD" as const,
        status: "pending" as const,
        deliveryDate: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days from now
      };

      const orderId = await createOrder(orderData as any);
      
      if (orderId) {
        alert("Order placed successfully! (Cash on Delivery)");
        clearCart();
        if (onSuccess) onSuccess();
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Order placement failed", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlaceOrder}
      disabled={loading || items.length === 0}
      className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 group disabled:bg-gray-700 disabled:shadow-none"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} /> Processing...
        </>
      ) : (
        <>
          Place Order (Cash on Delivery) <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
        </>
      )}
    </button>
  );
};

export default CheckoutButton;
