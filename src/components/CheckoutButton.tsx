"use client";

import React, { useState } from 'react';

interface CheckoutButtonProps {
  amount: number;
  productId: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ amount, productId }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on the server
      const response = await fetch('/api/checkout/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, productId }),
      });
      
      const order = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Budget Bazar",
        description: `Purchase for product ${productId}`,
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
          // Redirect to success page or update UI
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </>
  );
};

export default CheckoutButton;
