'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, User } from 'lucide-react';
import Header from '../../components/Header';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileSidebar from '../../components/MobileBar';
import { useAuth } from '@/context/AuthContext';

interface Order {
  id: string;
  product: {
    name: string;
    price: number;
  };
  member: {
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  quantity: number;
  address: string;
  status: string;
  createdAt: string;
  notes?: string;
}

const StockistOrdersPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getStoredToken, userProfile } = useAuth();

  useEffect(() => {
    if (userProfile?.isStockist) {
      fetchOrders();
    }
  }, [userProfile]);

  const fetchOrders = async () => {
    try {
      const token = getStoredToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/stockist/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliverOrder = async (orderId: string) => {
    if (!confirm('Mark this order as delivered?')) return;

    try {
      const token = getStoredToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/stockist/orders/${orderId}/deliver`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        alert('Order marked as delivered! Commission has been paid.');
        fetchOrders();
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error delivering order:', error);
      alert('Error updating order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (!userProfile?.isStockist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Stockist Access Required</h2>
          <p className="text-gray-600">You need to be a stockist to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <div className="flex pt-16">
        <DesktopSidebar 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <MobileSidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Stockist Orders
                </h1>
                <p className="text-gray-600">Manage product delivery requests from members</p>
              </div>
              <div className="mt-3 lg:mt-0">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Pending: {orders.filter(o => o.status === 'pending').length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Delivered: {orders.filter(o => o.status === 'delivered').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.product.name}
                        </h3>
                        <p className="text-gray-600">Quantity: {order.quantity}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Customer:</span>
                          <span>{order.member.fullName}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Phone:</span>
                          <span className="ml-2">{order.member.phoneNumber}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Email:</span>
                          <span className="ml-2">{order.member.email}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="font-medium">Delivery Address:</span>
                            <p className="mt-1 text-gray-600">{order.address}</p>
                          </div>
                        </div>
                        {order.notes && (
                          <div className="text-sm">
                            <span className="font-medium">Notes:</span>
                            <p className="mt-1 text-gray-600">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="lg:text-right">
                      <button
                        onClick={() => handleDeliverOrder(order.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Truck className="w-4 h-4" />
                        Mark Delivered
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        Commission: ₦{(order.product.price * order.quantity * 0.1).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                    <span>Order ID: {order.id}</span>
                    <span>Requested: {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {orders.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-8 text-center"
              >
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600">You don't have any product requests from members yet.</p>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockistOrdersPage;