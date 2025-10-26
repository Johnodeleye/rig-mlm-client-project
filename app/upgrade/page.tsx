// app/upgrade/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Star, Check, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import { useAuth } from '@/context/AuthContext';
import AuthRedirect from '../components/AuthRedirect';

interface Package {
  id: string;
  packageId: string;
  name: string;
  level: number;
  priceNGN: number;
  priceUSD: number;
  pv: number;
  tp: number;
  productContents: string;
}

interface UserData {
  membershipPackage: string;
  walletBalance: number;
}

const UpgradePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('upgrade');
  const [packages, setPackages] = useState<Package[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { user, userProfile, accountType } = useAuth(); // Get userProfile and accountType

  useEffect(() => {
    fetchData();
  }, [userProfile]); // Add userProfile as dependency

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const [packagesRes, walletRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/packages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/wallet/my-wallet`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (packagesRes.ok && walletRes.ok) {
        const packagesData = await packagesRes.json();
        const walletData = await walletRes.json();

        setPackages(packagesData.packages || []);
        
        // Use userProfile.plan which already has the membership package info
        setUserData({
          membershipPackage: userProfile?.plan || 'No Plan', // Use userProfile.plan
          walletBalance: walletData.walletData?.availableBalance || 0
        });
      } else {
        setError('Failed to load data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error loading upgrade options');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPlanName = () => {
    // Handle case where userData.membershipPackage might be "No Plan"
    if (userData?.membershipPackage === 'No Plan') {
      return 'No Plan';
    }
    const currentPackage = packages.find(pkg => pkg.packageId === userData?.membershipPackage);
    return currentPackage?.name || userData?.membershipPackage || 'No Plan';
  };

  const formatProductContents = (contents: string): string[] => {
    return contents.split(',').map(item => item.trim());
  };

  // Redirect if admin tries to access this page
  useEffect(() => {
    if (accountType === 'admin') {
      // Redirect admin to admin dashboard
      window.location.href = '/admin/home';
    }
  }, [accountType]);

  if (isLoading) {
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
          <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
            <div className="animate-pulse space-y-6">
              <div className="bg-white rounded-xl p-6 h-32"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 h-96"></div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
            <AuthRedirect requireAuth={true} requireActive={true} redirectTo="/login" />
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
                Current: {getCurrentPlanName()}
              </div>
            </div>

            {/* Wallet Balance */}
            {userData && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Available Balance</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₦{userData.walletBalance.toLocaleString()}
                    </p>
                  </div>
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            )}
          </motion.div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {packages.map((pkg, index) => {
              const isCurrent = userData?.membershipPackage !== 'No Plan' && pkg.packageId === userData?.membershipPackage;
              const currentPackageLevel = packages.find(p => p.packageId === userData?.membershipPackage)?.level || 0;
              const canUpgrade = userData && pkg.level > currentPackageLevel;
              
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition-all duration-200 ${
                    isCurrent ? 'border-[#0660D3] ring-2 ring-[#0660D3] ring-opacity-20' : 'border-gray-200'
                  }`}
                >
                  {/* Plan Header */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-[#0660D3]" />
                      <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
                      <span>Level {pkg.level}</span>
                      <span>•</span>
                      <span>{pkg.pv} PV</span>
                      <span>•</span>
                      <span>{pkg.tp} TP</span>
                    </div>
                    
                    {isCurrent && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#0660D3] text-white rounded-full text-xs font-medium mb-3">
                        <Check className="w-3 h-3" />
                        Current Plan
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-center mb-4">
                    <p className="text-2xl font-bold text-gray-900">₦{pkg.priceNGN.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">${pkg.priceUSD.toLocaleString()}</p>
                  </div>

                  {/* Product Contents */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Includes:</h4>
                    <ul className="space-y-2">
                      {formatProductContents(pkg.productContents).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <a
                    href={!isCurrent && canUpgrade ? `/payment/upgrade/${user?.id}?package=${pkg.packageId}` : '#'}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : !canUpgrade
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0660D3] text-white hover:bg-blue-700'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isCurrent ? 'Current Plan' : !canUpgrade ? 'Cannot Downgrade' : 'Upgrade Now'}
                  </a>

                  {!canUpgrade && !isCurrent && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      You can only upgrade to higher level packages
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpgradePage;