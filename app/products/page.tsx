// app/products/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';

const ProductsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('products');
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  // Products data
  const products = [
    {
      id: '1',
      name: 'Baobab Powder',
      description: 'Premium organic baobab powder rich in vitamin C and antioxidants',
      image: '/images/baobab-powder.jpg',
      amount: '₦4,500',
      pv: 2,
      tp: 1,
      uplineLevel: 1,
      commissionableAmount: '₦3,800',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Dates Powder',
      description: 'Natural dates powder perfect for smoothies and baking',
      image: '/images/dates-powder.jpg',
      amount: '₦3,200',
      pv: 1,
      tp: 1,
      uplineLevel: 1,
      commissionableAmount: '₦2,700',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      name: 'Dates Seed Coffee',
      description: 'Healthy coffee alternative made from date seeds',
      image: '/images/date-seed-coffee.jpg',
      amount: '₦6,800',
      pv: 3,
      tp: 2,
      uplineLevel: 2,
      commissionableAmount: '₦5,900',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: '4',
      name: 'Potato Powder',
      description: 'Versatile potato powder for cooking and baking',
      image: '/images/potato-powder.jpg',
      amount: '₦5,500',
      pv: 2,
      tp: 1,
      uplineLevel: 1,
      commissionableAmount: '₦4,800',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: '5',
      name: 'Dates Syrup',
      description: 'Natural sweetener made from fresh dates',
      image: '/images/dates-syrup.jpg',
      amount: '₦4,200',
      pv: 2,
      tp: 1,
      uplineLevel: 1,
      commissionableAmount: '₦3,500',
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: '6',
      name: 'Superfood Bundle',
      description: 'Complete health package with all our premium products',
      image: '/images/superfood-bundle.jpg',
      amount: '₦18,000',
      pv: 8,
      tp: 4,
      uplineLevel: 3,
      commissionableAmount: '₦15,200',
      isActive: true,
      createdAt: '2024-01-01'
    }
  ];

  const increaseQuantity = (productId: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const decreaseQuantity = (productId: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0)
    }));
  };

  const getQuantity = (productId: string) => {
    return quantities[productId] || 0;
  };

  const addToCart = (product: any) => {
    const quantity = getQuantity(product.id);
    if (quantity > 0) {
      // Here you would typically add to cart context or send to API
      console.log(`Added ${quantity} of ${product.name} to cart`);
      alert(`Added ${quantity} ${product.name}(s) to cart!`);
      setQuantities(prev => ({ ...prev, [product.id]: 0 }));
    } else {
      alert('Please select quantity first');
    }
  };

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Our Products
                </h1>
                <p className="text-gray-600">Discover our range of premium health products</p>
              </div>
              
              <div className="mt-3 lg:mt-0 flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Total Items: {Object.values(quantities).reduce((sum, qty) => sum + qty, 0)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
              >
                {/* Product Image */}
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>

                {/* Product Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                    <div>
                      <span className="font-medium">PV:</span> {product.pv}
                    </div>
                    <div>
                      <span className="font-medium">TP:</span> {product.tp}
                    </div>
                    <div>
                      <span className="font-medium">Level:</span> {product.uplineLevel}
                    </div>
                    <div>
                      <span className="font-medium">Commission:</span> {product.commissionableAmount}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-gray-900">{product.amount}</p>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(product.id)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{getQuantity(product.id)}</span>
                    <button
                      onClick={() => increaseQuantity(product.id)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-3 px-4 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </div>

          {/* Mobile Horizontal Scroll Fallback */}
          <div className="block lg:hidden mt-6">
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-3 px-3">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-md border border-gray-200 p-6"
                >
                  {/* Product Image */}
                  <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>

                  {/* Product Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-3">
                      <div>
                        <span className="font-medium">PV:</span> {product.pv}
                      </div>
                      <div>
                        <span className="font-medium">TP:</span> {product.tp}
                      </div>
                      <div>
                        <span className="font-medium">Level:</span> {product.uplineLevel}
                      </div>
                      <div>
                        <span className="font-medium">Commission:</span> {product.commissionableAmount}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <p className="text-xl font-bold text-gray-900">{product.amount}</p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Qty:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(product.id)}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-medium text-sm">{getQuantity(product.id)}</span>
                      <button
                        onClick={() => increaseQuantity(product.id)}
                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2 px-4 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary (Optional) */}
          {Object.values(quantities).some(qty => qty > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4 lg:p-6 max-w-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cart Summary</h3>
              <div className="space-y-2 mb-4">
                {products
                  .filter(product => getQuantity(product.id) > 0)
                  .map(product => (
                    <div key={product.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">
                        {product.name} × {getQuantity(product.id)}
                      </span>
                      <span className="font-medium text-gray-900">
                        ₦{(parseInt(product.amount.replace(/[^\d]/g, '')) * getQuantity(product.id) / 100).toLocaleString()}
                      </span>
                    </div>
                  ))}
              </div>
              <button className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Checkout
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;