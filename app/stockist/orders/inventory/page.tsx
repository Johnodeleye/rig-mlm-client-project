'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Box, TrendingUp, AlertTriangle } from 'lucide-react';
import Header from '@/app/components/Header';
import DesktopSidebar from '@/app/components/DesktopSidebar';
import MobileSidebar from '@/app/components/MobileBar';
import { useAuth } from '@/context/AuthContext';

interface InventoryItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
}

const StockistInventoryPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('inventory');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getStoredToken, userProfile } = useAuth();

  useEffect(() => {
    if (userProfile?.isStockist) {
      fetchInventory();
    }
  }, [userProfile]);

  const fetchInventory = async () => {
    try {
      const token = getStoredToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/stockist/inventory`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setInventory(data.inventory || []);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: 'text-red-600', bg: 'bg-red-50', text: 'Out of Stock' };
    if (quantity <= 10) return { color: 'text-orange-600', bg: 'bg-orange-50', text: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-50', text: 'In Stock' };
  };

  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.quantity <= 10).length;

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
        <div className="text-lg">Loading inventory...</div>
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
                  Stockist Inventory
                </h1>
                <p className="text-gray-600">Manage your product stock and availability</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Box className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900">₦{totalValue.toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {lowStockItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 border border-orange-200 rounded-xl lg:rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Low Stock Alert</p>
                  <p className="text-sm text-orange-700">
                    {lowStockItems} product{lowStockItems !== 1 ? 's' : ''} running low on stock
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:gap-6">
            {inventory.map((item, index) => {
              const status = getStockStatus(item.quantity);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.product.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="font-medium text-gray-700">
                            Price: ₦{item.product.price.toLocaleString()}
                          </span>
                          <span className="font-medium text-gray-700">
                            Stock: {item.quantity} units
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ₦{(item.quantity * item.product.price).toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-500">Total Value</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {inventory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-8 text-center"
              >
                <Box className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Inventory</h3>
                <p className="text-gray-600">You haven't been assigned any products yet.</p>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockistInventoryPage;