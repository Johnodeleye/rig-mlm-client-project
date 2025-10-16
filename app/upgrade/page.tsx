// app/upgrade/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Check, Star, X } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';

const UpgradePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('upgrade');
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  // Fix: Use type annotation to make it a general string
  const currentPlan: string = 'Beginner Plan';

  const plans = [
    {
      id: 'beginner',
      name: 'Beginner Plan',
      level: 1,
      price: '₦9,000',
      usdPrice: '$13.99',
      pv: 5,
      commission: '48% direct referral',
      benefits: ['Direct referral commission', 'Basic support'],
      isCurrent: currentPlan === 'Beginner Plan'
    },
    {
      id: 'junior',
      name: 'Junior Pack',
      level: 3,
      price: '₦32,000',
      usdPrice: '$46.46',
      pv: 20,
      commission: '48% Level 1, 10% Level 2',
      benefits: ['Level 1-2 commissions', 'Priority support', 'Business tools'],
      isCurrent: currentPlan === 'Junior Pack'
    },
    {
      id: 'senior',
      name: 'Senior Pack',
      level: 5,
      price: '₦76,500',
      usdPrice: '$109.00',
      pv: 50,
      commission: 'Up to Level 3 (5%)',
      benefits: ['Level 1-3 commissions', 'Advanced training', 'Marketing materials'],
      isCurrent: currentPlan === 'Senior Pack'
    },
    {
      id: 'business',
      name: 'Business Pack',
      level: 7,
      price: '₦184,000',
      usdPrice: '$265.00',
      pv: 125,
      commission: 'Up to Level 4 (3%)',
      benefits: ['Level 1-4 commissions', 'Business mentorship', 'Team management tools'],
      isCurrent: currentPlan === 'Business Pack'
    },
    {
      id: 'executive',
      name: 'Executive Pack',
      level: 10,
      price: '₦368,000',
      usdPrice: '$525.00',
      pv: 250,
      commission: 'Up to Level 5 (2%)',
      benefits: ['Level 1-5 commissions', 'Executive training', 'Leadership program'],
      isCurrent: currentPlan === 'Executive Pack'
    },
    {
      id: 'chief-executive',
      name: 'Chief Executive Pack',
      level: 12,
      price: '₦736,000',
      usdPrice: '$1,050.00',
      pv: 500,
      commission: 'Up to Level 7 (1%)',
      benefits: ['Level 1-7 commissions', 'Global conference access', 'Luxury rewards'],
      isCurrent: currentPlan === 'Chief Executive Pack'
    },
    {
      id: 'ambassador',
      name: 'Ambassador Pack',
      level: 15,
      price: '₦1,671,000',
      usdPrice: '$2,375.00',
      pv: 1125,
      commission: 'Up to Level 10 (0.5%)',
      benefits: ['Level 1-10 commissions', 'All-expense paid trips', 'Elite status'],
      isCurrent: currentPlan === 'Ambassador Pack'
    }
  ];

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowModal(true);
  };

  const confirmUpgrade = () => {
    // Handle upgrade logic here
    console.log('Upgrading to:', selectedPlan);
    setShowModal(false);
    setSelectedPlan('');
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

          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-md border p-6 ${
                  plan.isCurrent ? 'border-[#0660D3] ring-2 ring-[#0660D3] ring-opacity-20' : 'border-gray-200'
                }`}
              >
                {/* Plan Header */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-[#0660D3]" />
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                    <span>Level {plan.level}</span>
                    <span>•</span>
                    <span>{plan.pv} PV</span>
                  </div>
                  
                  {plan.isCurrent && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#0660D3] text-white rounded-full text-xs font-medium mb-3">
                      <Check className="w-3 h-3" />
                      Current Plan
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-gray-900">{plan.price}</p>
                  <p className="text-sm text-gray-600">{plan.usdPrice}</p>
                </div>

                {/* Commission */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-[#0660D3] text-center">
                    {plan.commission}
                  </p>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {plan.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Upgrade Button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.isCurrent}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    plan.isCurrent
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-[#0660D3] text-white hover:bg-blue-700'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  {plan.isCurrent ? 'Current Plan' : 'Upgrade Now'}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Upgrade Confirmation Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Confirm Upgrade</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to upgrade to{' '}
                    <span className="font-semibold text-gray-900">
                      {plans.find(p => p.id === selectedPlan)?.name}
                    </span>
                    ?
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-900">
                      Amount: {plans.find(p => p.id === selectedPlan)?.price}
                    </p>
                    <p className="text-xs text-gray-600">
                      {plans.find(p => p.id === selectedPlan)?.usdPrice}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmUpgrade}
                    className="flex-1 px-4 py-2 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Confirm Upgrade
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

export default UpgradePage;