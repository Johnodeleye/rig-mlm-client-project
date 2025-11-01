'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Box, TrendingUp, AlertTriangle, ImageIcon } from 'lucide-react';
import Header from '@/app/components/Header';
import DesktopSidebar from '@/app/components/DesktopSidebar';
import MobileSidebar from '@/app/components/MobileBar';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';

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
  const { currency, convertAmount, formatAmount, exchangeRate } = useCurrency();

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

  const processAmount = (amount: number): string => {
    return convertAmount(amount);
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
          <div className="text-lg text-gray-700">Loading inventory...</div>
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
                  Stockist Inventory
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage your product stock and availability</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-blue-100 rounded-lg">
                  <Box className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{inventory.length}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-green-100 rounded-lg">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalItems}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Inventory Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{processAmount(totalValue)}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {lowStockItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-50 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-800 text-sm">Low Stock Alert</p>
                  <p className="text-xs sm:text-sm text-orange-700">
                    {lowStockItems} product{lowStockItems !== 1 ? 's are' : ' is'} running low on stock
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            {inventory.map((item, index) => {
              const status = getStockStatus(item.quantity);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Product Info with Image */}
                      <div className="flex items-start gap-4 md:items-center flex-1">
                        <div className="flex-shrink-0">
                          {item.product.image ? (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
                            {item.product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.product.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-700">Price:</span>
                              <span>{processAmount(item.product.price)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-700">Stock:</span>
                              <span>{item.quantity} units</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Value Section */}
                      <div className="md:text-right md:w-32 lg:w-40 flex-shrink-0 mt-4 md:mt-0">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-xs font-medium text-blue-800 mb-1">Total Value</div>
                          <div className="text-lg sm:text-xl font-bold text-blue-600">
                            {processAmount(item.quantity * item.product.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {inventory.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Box className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Inventory</h3>
                <p className="text-gray-600 max-w-md mx-auto">You haven't been assigned any products yet. Contact admin to add products to your inventory.</p>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockistInventoryPage;