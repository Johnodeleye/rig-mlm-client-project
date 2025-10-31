'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, Filter, Users, MapPin, Phone, Mail, Edit3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminDesktopSidebar from '@/app/components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '@/app/components/admin/AdminMobileSidebar';
import { useAuth } from '@/context/AuthContext';

interface Stockist {
  id: string;
  storeName: string;
  firstName: string;
  email: string;
  country: string;
  state: string;
  city: string;
  fullAddress: string;
  whatsappNumber: string;
  callNumber: string;
  package: string;
  investmentAmount: number;
  isActive: boolean;
  createdAt: string;
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  inventory: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
    };
  }>;
  _count: {
    finderFees: number;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
}

const AdminStockistsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('stockists');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stockists, setStockists] = useState<Stockist[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStockist, setSelectedStockist] = useState<Stockist | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [inventoryForm, setInventoryForm] = useState<{productId: string; quantity: string}>({
    productId: '',
    quantity: ''
  });
  
  const router = useRouter();
  const { isAuthenticated, accountType, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || accountType !== 'admin') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, accountType, authLoading, router]);

  const fetchStockists = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/admin/stockists`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStockists(data.stockists);
        }
      }
    } catch (error) {
      console.error('Error fetching stockists:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accountType === 'admin') {
      Promise.all([fetchStockists(), fetchProducts()]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isAuthenticated, accountType]);

  const filteredStockists = stockists.filter(stockist => {
    const matchesSearch = stockist.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stockist.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stockist.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'Active' && stockist.isActive) ||
                         (filterStatus === 'Inactive' && !stockist.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleOpenInventoryModal = (stockist: Stockist) => {
    setSelectedStockist(stockist);
    setInventoryForm({ productId: '', quantity: '' });
    setShowInventoryModal(true);
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStockist || !inventoryForm.productId || !inventoryForm.quantity) {
      alert('Please select a product and enter quantity');
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/admin/stockists/${selectedStockist.id}/inventory`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: inventoryForm.productId,
            quantity: parseInt(inventoryForm.quantity)
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchStockists();
          setShowInventoryModal(false);
          setSelectedStockist(null);
          setInventoryForm({ productId: '', quantity: '' });
        }
      }
    } catch (error) {
      console.error('Error adding inventory:', error);
    }
  };

  const getTotalInventoryValue = (stockist: Stockist) => {
    return stockist.inventory.reduce((total, item) => {
      return total + (item.quantity * item.product.price);
    }, 0);
  };

  const getTotalProducts = (stockist: Stockist) => {
    return stockist.inventory.reduce((total, item) => total + item.quantity, 0);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stockists...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || accountType !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <div className="flex pt-16">
        <AdminDesktopSidebar 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <AdminMobileSidebar 
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
                  Stockists Management
                </h1>
                <p className="text-gray-600">Manage all registered stockists and their inventory</p>
              </div>
              <div className="mt-3 lg:mt-0 text-sm text-gray-500">
                Total Stockists: {stockists.length}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stockists by name, store, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
          >
            {filteredStockists.map((stockist, index) => (
              <motion.div
                key={stockist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stockist.isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {stockist.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {stockist.storeName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Owner: {stockist.user.fullName}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{stockist.city}, {stockist.state}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{stockist.whatsappNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{stockist.user.email}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Package:</span>
                      <span className="font-semibold text-gray-900">{stockist.package}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Investment:</span>
                      <span className="font-semibold text-gray-900">₦{stockist.investmentAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Products:</span>
                      <span className="font-semibold text-gray-900">{getTotalProducts(stockist)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Inventory Value:</span>
                      <span className="font-semibold text-gray-900">₦{getTotalInventoryValue(stockist).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleOpenInventoryModal(stockist)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Manage Inventory
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredStockists.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200"
            >
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No stockists found matching your criteria</p>
            </motion.div>
          )}

          {showInventoryModal && selectedStockist && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-md  flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto  shadow-red-500 shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Manage Inventory - {selectedStockist.storeName}
                  </h2>
                  <button
                    onClick={() => {
                      setShowInventoryModal(false);
                      setSelectedStockist(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Inventory</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedStockist.inventory.length > 0 ? (
                      selectedStockist.inventory.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-900">{item.product.name}</span>
                          <span className="text-sm text-gray-600">{item.quantity} units</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No inventory assigned</p>
                    )}
                  </div>
                </div>

                <form onSubmit={handleAddInventory} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add/Update Inventory</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Product
                    </label>
                    <select
                      value={inventoryForm.productId}
                      onChange={(e) => setInventoryForm(prev => ({ ...prev, productId: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                    >
                      <option value="">Choose a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ₦{product.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={inventoryForm.quantity}
                      onChange={(e) => setInventoryForm(prev => ({ ...prev, quantity: e.target.value }))}
                      required
                      min="1"
                      placeholder="Enter quantity"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowInventoryModal(false);
                        setSelectedStockist(null);
                      }}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Add to Inventory
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminStockistsPage;