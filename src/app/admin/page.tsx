'use client';

import { useEffect, useState } from 'react';
import { getProducts, getAllOrders, updateOrderStatus } from '@/lib/firestore';
import { Product, Order } from '@/lib/types';
import { Loader2, CheckCircle, Truck, Package, Save } from 'lucide-react';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pData, oData] = await Promise.all([
          getProducts(),
          getAllOrders()
        ]);
        setProducts(pData);
        setOrders(oData);
      } catch (e) {
        console.error("Failed to fetch admin data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (e) {
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const totalRevenue = orders.reduce((s, o) => s + (o.status === 'delivered' ? o.totalAmount : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="page bg-gray-50 min-h-screen">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">🛡 Admin Control Center</h1>
            <p className="text-gray-500">Manage products, orders, and system health.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-gray-700">System Live</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Delivered Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Orders', value: orders.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Pending Orders', value: pendingOrders, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Active Products', value: products.length, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} p-6 rounded-3xl border border-white shadow-sm`}>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders Management */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2"><Package size={20} className="text-indigo-600" /> Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-black text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer & Address</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm">#{order.id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <div className="text-xs font-bold text-gray-700 truncate">{order.userId}</div>
                      <div className="text-[10px] text-gray-400 line-clamp-1">{order.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-600">{order.items?.length || 0} Items</div>
                    </td>
                    <td className="px-6 py-4 font-black text-indigo-600">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest 
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                          order.status === 'confirmed' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                            title="Confirm Order"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                            title="Mark Shipped"
                          >
                            <Truck size={16} />
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                            title="Mark Delivered"
                          >
                            <Save size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Table (Simplified) */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-xl font-bold flex items-center gap-2">🎁 Inventory Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-xs font-black text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-sm text-gray-900">{p.name}</td>
                    <td className="px-6 py-4"><span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-medium text-gray-600">{p.category}</span></td>
                    <td className="px-6 py-4 font-bold">₹{p.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.stock < 20 ? 'bg-red-500' : 'bg-green-500'}`} />
                        <span className="text-sm font-medium">{p.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.stock < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {p.stock < 20 ? 'Low Stock' : 'Active'}
                      </span>
                    </td>
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
