'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Star, Zap, Users, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Header from '@/app/components/Header';
import DesktopSidebar from '@/app/components/DesktopSidebar';
import MobileSidebar from '@/app/components/MobileBar';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  commissionPercentage: number;
  image?: string;
  stock: number;
  pv: number;
  tp: number;
  uplinePv: number;
  uplineTp: number;
  levelPercentages: any;
  
}

const ProductsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated, accountType, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || accountType !== 'user') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, accountType, authLoading, router]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/products/products`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accountType === 'user') {
      fetchProducts();
    }
  }, [isAuthenticated, accountType]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePurchase = async () => {
    if (!selectedProduct) return;

    setIsPurchasing(true);
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/products/products/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity: parseInt(quantity) || 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Product purchased successfully!');
          setShowPurchaseModal(false);
          setSelectedProduct(null);
          setQuantity('1');
          await fetchProducts();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Purchase failed');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Error processing purchase');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleQuantityChange = (value: string) => {
    if (value === '') {
      setQuantity('');
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      if (selectedProduct && numValue > selectedProduct.stock) {
        setQuantity(selectedProduct.stock.toString());
      } else {
        setQuantity(numValue.toString());
      }
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || accountType !== 'user') {
    return null;
  }

  const numericQuantity = parseInt(quantity) || 1;
  const totalPrice = selectedProduct ? selectedProduct.price * numericQuantity : 0;
  const totalPv = selectedProduct ? selectedProduct.pv * numericQuantity : 0;
  const totalTp = selectedProduct ? selectedProduct.tp * numericQuantity : 0;

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
                  Products
                </h1>
                <p className="text-gray-600">Browse and purchase products</p>
              </div>
              
              <div className="flex-1 max-w-md mt-3 lg:mt-0 lg:ml-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-8 h-8 object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">₦{product.price.toLocaleString()}</div>
                      <div className="text-sm text-green-600 font-medium">{product.commissionPercentage}% commission</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">PV:</span>
                      <span className="font-medium text-blue-600">{product.pv}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">TP:</span>
                      <span className="font-medium text-purple-600">{product.tp}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setQuantity('1');
                      setShowPurchaseModal(true);
                    }}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? 'Out of Stock' : 'Purchase Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200"
            >
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No products found matching your search</p>
            </motion.div>
          )}

          {showPurchaseModal && selectedProduct && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md shadow-red-500 shadow-lg border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Purchase Product</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                      {selectedProduct.image ? (
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                      <p className="text-lg font-bold text-red-600">₦{selectedProduct.price.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedProduct.stock}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Available stock: {selectedProduct.stock}
                    </p>
                  </div>

                  <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Unit Price:</span>
                      <span>₦{selectedProduct.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quantity:</span>
                      <span>{numericQuantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">PV Earned:</span>
                      <span className="text-blue-600">{totalPv}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">TP Earned:</span>
                      <span className="text-purple-600">{totalTp}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total Amount:</span>
                        <span className="text-red-600">₦{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing || numericQuantity < 1 || numericQuantity > selectedProduct.stock}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors font-medium"
                  >
                    {isPurchasing ? 'Processing...' : 'Confirm Purchase'}
                  </button>
                  <button
                    onClick={() => {
                      setShowPurchaseModal(false);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;