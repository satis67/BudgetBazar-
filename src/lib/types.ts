export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  subCategory: string;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  specs: Record<string, string>;
  stock: number;
  sold: number;
  badge?: 'HOT' | 'NEW' | 'SALE' | 'TRENDING' | 'AI PICK';
  tags: string[];
  deliveryDays: number;
  freeDelivery: boolean;
}

export interface CartItem extends Product { qty: number; }
export interface User {
  id: string; name: string; email: string;
  role: 'buyer' | 'seller' | 'admin';
  balance: number; points: number; onboarded: boolean;
  avatar?: string;
}
export interface Order {
  id: string; 
  userId: string;
  items: CartItem[]; 
  totalAmount: number;
  paymentMethod: 'COD' | 'Online';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
  createdAt: string; 
  deliveryDate: string;
}
export interface Auction {
  id: string; productId: string; productName: string;
  productImage: string; startPrice: number; currentBid: number;
  leadBidder: string; endsAt: number; bids: number;
}
export interface Seller {
  id: string; name: string; rating: number;
  totalSales: number; joinedAt: string; level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  products: number; revenue: number;
}
