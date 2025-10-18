// app/upgrade/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Star, Check } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';

const UpgradePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('upgrade');

  // Change the type of currentPlan to string for correct comparison
  const currentPlan: string = 'Beginner Plan';

  const products = [
    {
      id: 'beginner',
      name: 'Beginner Plan',
      level: 1,
      price: '₦9,000',
      usdPrice: '$13.99',
      pv: 5,
      productContents: ['1x Baobab (250g)'],
      isCurrent: currentPlan === 'Beginner Plan'
    },
    {
      id: 'junior',
      name: 'Junior Pack',
      level: 3,
      price: '₦32,000',
      usdPrice: '$46.46',
      pv: 20,
      productContents: [
        '2x Baobab (250g)',
        '1x Dates Powder (600g)',
        '1x Dates Powder (200g)'
      ],
      isCurrent: currentPlan === 'Junior Pack'
    },
    {
      id: 'senior',
      name: 'Senior Pack',
      level: 5,
      price: '₦76,500',
      usdPrice: '$109.00',
      pv: 50,
      productContents: [
        '4x Baobab (250g)',
        '1x Dates Seed Coffee (200g)',
        '1x Potato Powder (1kg)',
        '2x Dates Syrup (300ml)',
        '1x Dates Powder (600g)',
        '1x Dates Powder (200g)'
      ],
      isCurrent: currentPlan === 'Senior Pack'
    },
    {
      id: 'business',
      name: 'Business Pack',
      level: 7,
      price: '₦184,000',
      usdPrice: '$265.00',
      pv: 125,
      productContents: [
        '6x Baobab (250g)',
        '2x Baobab (500g)',
        '2x Dates Seed Coffee (200g)',
        '2x Potato Powder (1kg)',
        '5x Dates Syrup (300ml)',
        '7x Dates Powder (200g)',
        '2x Dates Powder (600g)'
      ],
      isCurrent: currentPlan === 'Business Pack'
    },
    {
      id: 'executive',
      name: 'Executive Pack',
      level: 10,
      price: '₦368,000',
      usdPrice: '$525.00',
      pv: 250,
      productContents: [
        '12x Baobab (250g)',
        '4x Baobab (500g)',
        '4x Dates Seed Coffee (200g)',
        '4x Potato Powder (1kg)',
        '10x Dates Syrup (300ml)',
        '14x Dates Powder (200g)',
        '4x Dates Powder (600g)'
      ],
      isCurrent: currentPlan === 'Executive Pack'
    },
    {
      id: 'chief-executive',
      name: 'Chief Executive Pack',
      level: 12,
      price: '₦736,000',
      usdPrice: '$1,050.00',
      pv: 500,
      productContents: [
        '24x Baobab (250g)',
        '8x Baobab (500g)',
        '8x Dates Seed Coffee (200g)',
        '8x Potato Powder (1kg)',
        '20x Dates Syrup (300ml)',
        '28x Dates Powder (200g)',
        '8x Dates Powder (600g)'
      ],
      isCurrent: currentPlan === 'Chief Executive Pack'
    },
    {
      id: 'ambassador',
      name: 'Ambassador Pack',
      level: 15,
      price: '₦1,671,000',
      usdPrice: '$2,375.00',
      pv: 1125,
      productContents: [
        '54x Baobab (250g)',
        '18x Baobab (500g)',
        '18x Dates Seed Coffee (200g)',
        '18x Potato Powder (1kg)',
        '45x Dates Syrup (300ml)',
        '63x Dates Powder (200g)',
        '18x Dates Powder (600g)'
      ],
      isCurrent: currentPlan === 'Ambassador Pack'
    }
  ];

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
                  Upgrade Your Plan
                </h1>
                <p className="text-gray-600">Unlock higher commissions and benefits</p>
              </div>
              
              <div className="mt-3 lg:mt-0 px-4 lg:px-6 py-2 bg-green-100 text-green-800 rounded-lg font-semibold text-sm lg:text-base flex items-center gap-2">
                <Star className="w-4 h-4" />
                Current: {currentPlan}
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
                className={`bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition-all duration-200 ${
                  product.isCurrent ? 'border-[#0660D3] ring-2 ring-[#0660D3] ring-opacity-20' : 'border-gray-200'
                }`}
              >
                {/* Plan Header */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-[#0660D3]" />
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                    <span>Level {product.level}</span>
                    <span>•</span>
                    <span>{product.pv} PV</span>
                  </div>
                  
                  {product.isCurrent && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#0660D3] text-white rounded-full text-xs font-medium mb-3">
                      <Check className="w-3 h-3" />
                      Current Plan
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-gray-900">{product.price}</p>
                  <p className="text-sm text-gray-600">{product.usdPrice}</p>
                </div>

                {/* Product Contents */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Includes:</h4>
                  <ul className="space-y-2">
                    {product.productContents.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    product.isCurrent
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-[#0660D3] text-white hover:bg-blue-700'
                  }`}
                  disabled={product.isCurrent}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.isCurrent ? 'Current Plan' : 'Upgrade Now'}
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
                  className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-md border p-6"
                >
                  {/* Same card content as above */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-[#0660D3]" />
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                      <span>Level {product.level}</span>
                      <span>•</span>
                      <span>{product.pv} PV</span>
                    </div>
                    
                    {product.isCurrent && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#0660D3] text-white rounded-full text-xs font-medium mb-3">
                        <Check className="w-3 h-3" />
                        Current Plan
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-2xl font-bold text-gray-900">{product.price}</p>
                    <p className="text-sm text-gray-600">{product.usdPrice}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Includes:</h4>
                    <ul className="space-y-2">
                      {product.productContents.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                      {product.productContents.length > 3 && (
                        <li className="text-sm text-gray-500 text-center">
                          +{product.productContents.length - 3} more items
                        </li>
                      )}
                    </ul>
                  </div>

                  <button
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      product.isCurrent
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0660D3] text-white hover:bg-blue-700'
                    }`}
                    disabled={product.isCurrent}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.isCurrent ? 'Current Plan' : 'Upgrade Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpgradePage;