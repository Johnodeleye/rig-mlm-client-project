'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, User, MapPin, Phone, Mail, Home, ArrowRight, CheckCircle, Wallet, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import AuthRedirect from '../components/AuthRedirect';

interface StockistPackage {
  id: string;
  name: string;
  investment: number;
  finderFeePercent: number;
  finderFeeAmount: number;
  currency: string;
}

const BecomeStockistPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('become-stockist');
  const [isLoading, setIsLoading] = useState(false);
  const [packages, setPackages] = useState<StockistPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userCountry, setUserCountry] = useState<string>('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    storeName: '',
    email: '',
    country: '',
    state: '',
    city: '',
    fullAddress: '',
    whatsappNumber: '',
    callNumber: '',
    referrerId: ''
  });

  const { userProfile, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('User Profile in Become Stockist:', userProfile);
    console.log('User Data in Become Stockist:', user);
    
    detectUserLocation();
    
    if (userProfile) {
      const firstName = userProfile.name?.split(' ')[0] || '';
      const email = userProfile.email || '';
      const referralId = user?.referralId || userProfile.referralId || '';
      const country = userProfile.country || '';
      const phoneNumber = userProfile.phoneNumber || '';
      
      console.log('Setting form data with:', {
        firstName,
        email,
        referralId,
        country,
        phoneNumber
      });

      setFormData(prev => ({
        ...prev,
        firstName: firstName,
        email: email,
        referrerId: referralId,
        country: country,
        whatsappNumber: phoneNumber,
        callNumber: phoneNumber
      }));
    }
  }, [userProfile, user]);

  const detectUserLocation = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/detect-location`);
      const data = await response.json();
      
      if (data.country) {
        setUserCountry(data.country);
        setFormData(prev => ({ ...prev, country: data.country }));
        fetchPackages(data.country);
      }
    } catch (error) {
      console.error('Location detection error:', error);
      setUserCountry('Nigeria');
      fetchPackages('Nigeria');
    }
  };

  const fetchPackages = async (country: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist/packages`);
      const data = await response.json();
      
      if (data.success) {
        let filteredPackages = data.packages;
        
        if (country !== 'Nigeria') {
          filteredPackages = data.packages.filter((pkg: StockistPackage) => 
            pkg.id !== 'regional-hub-2'
          );
        }
        
        setPackages(filteredPackages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPackage) {
      toast.error('Please select a package');
      return;
    }

    const requiredFields = ['firstName', 'storeName', 'email', 'country', 'state', 'city', 'fullAddress', 'whatsappNumber', 'callNumber'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setShowConfirmModal(true);
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const payload = {
        ...formData,
        packageId: selectedPackage,
        referrerId: formData.referrerId || user?.referralId || userProfile?.referralId
      };

      console.log('Sending registration payload:', payload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (data.success) {
        toast.success(`Congratulations — you are now a Stockist! Finder fee of ₦${data.referrer?.finderFee?.toLocaleString()} has been credited to ${data.referrer?.name}.`);
        router.push('/home');
      } else {
        if (data.error === 'INSUFFICIENT_FUNDS') {
          toast.error(`Insufficient funds — your balance is ₦${data.balance?.toLocaleString()}. You need ₦${data.difference?.toLocaleString()} more to purchase this package.`);
        } else if (data.error === 'User is already a stockist') {
          toast.error('You are already a registered stockist');
          router.push('/home');
        } else {
          toast.error(data.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Stockist registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
    }
  };

  const selectedPackageData = packages.find(pkg => pkg.id === selectedPackage);

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Become a Stockist</h1>
              </motion.div>
              <p className="text-gray-600">Join our network of stockists and grow your business</p>
              {userCountry && (
                <div className="mt-2 text-sm text-blue-600">
                  Detected Country: {userCountry}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Stockist Information</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                            placeholder="Enter your first name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Name *
                        </label>
                        <div className="relative">
                          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            required
                            value={formData.storeName}
                            onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                            placeholder="Enter store name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            required
                            value={formData.country}
                            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                            placeholder="Enter country"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                          placeholder="Enter state"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                          placeholder="Enter city"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Address *
                        </label>
                        <div className="relative">
                          <Home className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                          <textarea
                            required
                            value={formData.fullAddress}
                            onChange={(e) => setFormData(prev => ({ ...prev, fullAddress: e.target.value }))}
                            rows={3}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200 resize-none"
                            placeholder="Enter full address"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            required
                            value={formData.whatsappNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                            placeholder="WhatsApp number"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Call Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="tel"
                            required
                            value={formData.callNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, callNumber: e.target.value }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                            placeholder="Call number"
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Referrer ID (Auto-filled)
                        </label>
                        <input
                          type="text"
                          value={formData.referrerId}
                          onChange={(e) => setFormData(prev => ({ ...prev, referrerId: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200 bg-gray-50"
                          placeholder="Referrer ID will auto-fill"
                          readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">This field is automatically filled with your referral ID</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Package</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {packages.map((pkg) => (
                          <motion.div
                            key={pkg.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                              selectedPackage === pkg.id
                                ? 'border-[#0660D3] bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedPackage(pkg.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                              {selectedPackage === pkg.id && (
                                <CheckCircle className="w-5 h-5 text-[#0660D3]" />
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Investment:</span>
                                <span className="font-semibold text-gray-900">
                                  ₦{pkg.investment.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Finder Fee:</span>
                                <span className="font-semibold text-green-600">
                                  ₦{pkg.finderFeeAmount.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || !selectedPackage}
                      className="w-full bg-[#0660D3] text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Wallet className="w-5 h-5" />
                          Register & Pay
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 sticky top-24"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  
                  {selectedPackageData ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900">{selectedPackageData.name}</h4>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Investment:</span>
                            <span className="font-bold text-lg text-gray-900">
                              ₦{selectedPackageData.investment.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Finder Fee:</span>
                            <span className="font-semibold text-green-600">
                              ₦{selectedPackageData.finderFeeAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Your Balance</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          ₦{userProfile?.walletBalance?.toLocaleString() || '0'}
                        </p>
                      </div>

                      {userProfile?.walletBalance && selectedPackageData.investment > userProfile.walletBalance && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-700">Insufficient Balance</span>
                          </div>
                          <p className="text-sm text-red-600">
                            You need ₦{(selectedPackageData.investment - userProfile.walletBalance).toLocaleString()} more
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Select a package to see details</p>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      {showConfirmModal && selectedPackageData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Payment</h3>
              <p className="text-gray-600">You are about to pay:</p>
              <p className="text-2xl font-bold text-gray-900 my-3">
                ₦{selectedPackageData.investment.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                for {selectedPackageData.name}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Finder Fee:</span>
                <span className="font-semibold text-green-600">
                  ₦{selectedPackageData.finderFeeAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Your Balance:</span>
                <span className="font-semibold">
                  ₦{userProfile?.walletBalance?.toLocaleString() || '0'}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-[#0660D3] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-blue-700"
              >
                {isLoading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BecomeStockistPage;