'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, MapPin, User, ImageIcon } from 'lucide-react';
import Header from '../../components/Header';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileSidebar from '../../components/MobileBar';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';

interface Order {
  id: string;
  product: {
    name: string;
    price: number;
    commissionPercentage: number;
    image?: string | null;
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
  const { currency, convertAmount, formatAmount, exchangeRate } = useCurrency();

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

  const calculateCommission = (price: number, quantity: number, commissionPercentage: number) => {
    const commission = (price * quantity * commissionPercentage) / 100;
    return convertAmount(commission);
  };

  const processAmount = (amount: number): string => {
    return convertAmount(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Stockist Access Required</h2>
          <p className="text-gray-600">You need to be a stockist to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-700">Loading orders...</div>
        </div>
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

        <main className="flex-1 w-full lg:ml-64 p-3 sm:p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Stockist Orders
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage product delivery requests from members</p>
              </div>
              <div className="mt-3 sm:mt-0">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                    <span>Pending: {orders.filter(o => o.status === 'pending').length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    <span>Delivered: {orders.filter(o => o.status === 'delivered').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                        <div className="flex-shrink-0">
                          {order.product.image ? (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={order.product.image}
                                alt={order.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">
                                {order.product.name}
                              </h3>
                              <p className="text-gray-600 mt-1">Quantity: {order.quantity}</p>
                              <p className="text-lg font-bold text-blue-600 mt-1">
                                {processAmount(order.product.price * order.quantity)}
                              </p>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2">Customer Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="font-medium">Name:</span>
                                <span className="truncate">{order.member.fullName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <PhoneIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="font-medium">Phone:</span>
                                <a href={`tel:${order.member.phoneNumber}`} className="text-blue-600 hover:underline truncate">
                                  {order.member.phoneNumber}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <EmailIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <span className="font-medium">Email:</span>
                                <a href={`mailto:${order.member.email}`} className="text-blue-600 hover:underline truncate">
                                  {order.member.email}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2">Delivery Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium">Address:</span>
                                  <p className="mt-1 text-gray-700 break-words">{order.address}</p>
                                </div>
                              </div>
                              {order.notes && (
                                <div className="pt-2 border-t border-gray-200">
                                  <span className="font-medium text-sm">Special Notes:</span>
                                  <p className="mt-1 text-gray-700 text-sm break-words">{order.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="lg:w-48 flex-shrink-0">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-xs font-medium text-blue-800 mb-2">
                            Your Commission ({order.product.commissionPercentage}%)
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {calculateCommission(order.product.price, order.quantity, order.product.commissionPercentage)}
                          </div>
                          <button
                            onClick={() => handleDeliverOrder(order.id)}
                            className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            <Truck className="w-4 h-4" />
                            Mark Delivered
                          </button>
                        </div>
                      </div>
                    )}

                    {order.status === 'delivered' && (
                      <div className="lg:w-48 flex-shrink-0 flex flex-col items-center justify-center">
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-xs font-medium text-green-800 mb-1">
                            Commission Earned ({order.product.commissionPercentage}%)
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {calculateCommission(order.product.price, order.quantity, order.product.commissionPercentage)}
                          </div>
                          <div className="mt-3 flex items-center justify-center text-green-700">
                            <CheckCircle className="w-5 h-5 mr-1" />
                            <span className="text-sm font-medium">Delivered</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500">
                    <div className="flex flex-wrap gap-3 mb-2 sm:mb-0">
                      <span className="font-medium">Order ID:</span>
                      <span className="break-all">{order.id.substring(0, 8)}...</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="font-medium">Requested:</span>
                      <span>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {orders.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">You don't have any product requests from members yet. Orders will appear here when members request products through you.</p>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const EmailIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

export default StockistOrdersPage;