'use client';
import Link from 'next/link';
import { useStore } from '../../lib/store';
import { PRODUCTS } from '../../lib/data';
import ProductCard from '../../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useStore();
  const products = wishlist.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean) as typeof PRODUCTS;

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>❤️ My Wishlist</h1>
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p className="mb-3">Save products to buy later. Click the heart icon on any product.</p>
            <Link href="/marketplace" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <>
            <p className="text-muted mb-3">{products.length} saved items</p>
            <div className="grid-auto">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
