'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, User, MapPin, DollarSign } from 'lucide-react';
import Header from '../../components/Header';
import DesktopSidebar from '../../components/DesktopSidebar';
import MobileSidebar from '../../components/MobileBar';
import { useAuth } from '@/context/AuthContext';

interface Request {
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

const StockistRequestsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('requests');
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getStoredToken, userProfile } = useAuth();

  useEffect(() => {
    if (userProfile?.isStockist) {
      fetchRequests();
    }
  }, [userProfile]);

  const fetchRequests = async () => {
    try {
      const token = getStoredToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/stockist/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearRequest = async (requestId: string) => {
    if (!confirm('Mark this request as delivered and process commission?')) return;

    try {
      const token = getStoredToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/stockist/orders/${requestId}/deliver`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        alert('Request cleared! Commission has been recorded.');
        fetchRequests();
      } else {
        alert(data.error || 'Failed to clear request');
      }
    } catch (error) {
      console.error('Error clearing request:', error);
      alert('Error clearing request');
    }
  };

  const calculateCommission = (price: number, quantity: number) => {
    return price * quantity * 0.1;
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
        <div className="text-lg">Loading requests...</div>
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
                  Product Requests
                </h1>
                <p className="text-gray-600">Manage and fulfill product requests from members</p>
              </div>
              <div className="mt-3 lg:mt-0">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-800">
                    <strong>{requests.length}</strong> pending request{requests.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {request.product.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Quantity: {request.quantity}</span>
                          <span>Total: ₦{(request.product.price * request.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Pending
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{request.member.fullName}</p>
                            <p className="text-sm text-gray-600">{request.member.phoneNumber}</p>
                            <p className="text-sm text-gray-600">{request.member.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">Delivery Address</p>
                            <p className="text-sm text-gray-600 mt-1">{request.address}</p>
                          </div>
                        </div>
                        {request.notes && (
                          <div>
                            <p className="font-medium text-gray-900">Customer Notes</p>
                            <p className="text-sm text-gray-600 mt-1">{request.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:text-right space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">
                          ₦{calculateCommission(request.product.price, request.quantity).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">Your Commission (10%)</p>
                    </div>

                    <button
                      onClick={() => handleClearRequest(request.id)}
                      className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Clear Request
                    </button>

                    <p className="text-xs text-gray-500">
                      Requested: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {requests.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-8 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
                <p className="text-gray-600">You don't have any pending product requests.</p>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockistRequestsPage;