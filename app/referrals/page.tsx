// app/referrals/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Share2, UserCheck, UserX, Calendar, DollarSign, Loader2, Zap } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import AuthRedirect from '../components/AuthRedirect';
import { useCurrency } from '@/context/CurrencyContext';

interface Referral {
  id: string;
  name: string;
  date: string;
  level: number;
  commission: string;
  status: string;
  username: string;
  membershipPackage: string;
  totalCommission: number;
}

interface ReferralData {
  totalReferrals: number;
  activeReferrals: number;
  inactiveReferrals: number;
  totalCommission: string;
  totalCommissionAmount: number;
  referralLink: string;
  referralId: string;
  referrals: Referral[];
}

const ReferralsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('referrals');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);

  const { user, token } = useAuth();
  const { currency, convertAmount, formatAmount, exchangeRate } = useCurrency();

  const processCommissionAmount = (commission: string): string => {
    if (currency === 'NGN') {
      return commission;
    } else {
      const nairaMatch = commission.match(/₦([\d,]+(\.\d{2})?)/);
      if (nairaMatch) {
        const nairaAmount = parseFloat(nairaMatch[1].replace(/,/g, ''));
        const usdAmount = nairaAmount / exchangeRate;
        return `$${usdAmount.toFixed(2)}`;
      }
      return commission;
    }
  };

  const processTotalCommission = (totalCommission: string): string => {
    if (currency === 'NGN') {
      return totalCommission;
    } else {
      const nairaMatch = totalCommission.match(/₦([\d,]+(\.\d{2})?)/);
      if (nairaMatch) {
        const nairaAmount = parseFloat(nairaMatch[1].replace(/,/g, ''));
        const usdAmount = nairaAmount / exchangeRate;
        return `$${usdAmount.toFixed(2)}`;
      }
      return totalCommission;
    }
  };

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setIsLoading(true);
        const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (!storedToken) {
          toast.error('Please login to view referrals');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/referrals/my-referrals`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setReferralData(data.referralData);
          } else {
            toast.error(data.error || 'Failed to fetch referral data');
          }
        } else {
          toast.error('Failed to fetch referral data');
        }
      } catch (error) {
        console.error('Error fetching referral data:', error);
        toast.error('Error fetching referral data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralData();
  }, []);

  const copyReferralLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = async () => {
    if (referralData?.referralLink) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join RIG Global',
            text: 'Join me on RIG Global and start earning! Use my referral link to get started.',
            url: referralData.referralLink,
          });
          toast.success('Referral link shared!');
        } catch (error) {
          console.log('Error sharing:', error);
          copyReferralLink();
        }
      } else {
        copyReferralLink();
      }
    }
  };

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
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 h-40"></div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 h-96"></div>
                <div className="bg-white rounded-xl p-6 h-96"></div>
              </div>
            </div>
          </main>
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

        <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              My Referrals
            </h1>
            <p className="text-gray-600">Manage and track your referral network</p>
            
            {referralData && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Your Referral ID:</strong> {referralData.referralId}
                </p>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {referralData?.totalReferrals || 0}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Referrals</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {referralData?.activeReferrals || 0}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Commission</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {referralData?.totalCommission ? processTotalCommission(referralData.totalCommission) : currency === 'NGN' ? '₦0' : '$0'}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Referral Link</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Share this link to earn commissions</p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={referralData?.referralLink || 'Loading...'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={copyReferralLink}
                      disabled={!referralData?.referralLink}
                      className="flex-1 px-3 lg:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
                      <span className="hidden lg:inline">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={shareReferralLink}
                      disabled={!referralData?.referralLink}
                      className="flex-1 px-3 lg:px-4 py-2 bg-[#0660D3] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden lg:inline">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{referralData?.totalReferrals || 0}</p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{referralData?.activeReferrals || 0}</p>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Referrals</h2>
                <span className="text-sm text-gray-500">
                  {referralData?.referrals.length || 0} total
                </span>
              </div>
              
              {referralData?.referrals && referralData.referrals.length > 0 ? (
                <>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {referralData.referrals.map((referral) => (
                      <motion.div
                        key={referral.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm lg:text-base">
                              {referral.name}
                            </h3>
                            <p className="text-xs text-gray-500">@{referral.username}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                referral.status === 'Active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {referral.status === 'Active' ? (
                                <UserCheck className="w-3 h-3" />
                              ) : (
                                <UserX className="w-3 h-3" />
                              )}
                              {referral.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="bg-white rounded-md p-2">
                            <p className="text-xs text-gray-500 mb-1">Date</p>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-xs font-medium text-gray-700">
                                {new Date(referral.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-md p-2">
                            <p className="text-xs text-gray-500 mb-1">Level</p>
                            <span className="text-xs font-medium text-gray-700">
                              Level {referral.level}
                            </span>
                          </div>
                          
                          <div className="bg-white rounded-md p-2">
                            <p className="text-xs text-gray-500 mb-1">Commission</p>
                            <span className="text-xs font-bold text-green-600">
                              {processCommissionAmount(referral.commission)}
                            </span>
                          </div>
                        </div>

                        {referral.status === 'Inactive' && (
                          <a
                            href={`/payment/${referral.id}`}
                            className="w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
                          >
                            <Zap className="w-4 h-4" />
                            Activate This Referral
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Commission:</span>
                      <span className="text-lg font-bold text-green-600">
                        {referralData.totalCommission ? processTotalCommission(referralData.totalCommission) : currency === 'NGN' ? '₦0' : '$0'}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Referrals Yet</h3>
                  <p className="text-gray-500 mb-4 text-sm px-4">
                    Start sharing your referral link to earn commissions
                  </p>
                  <button
                    onClick={shareReferralLink}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#0660D3] to-blue-600 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Referral Link
                  </button>
                </div>
              )}
            </motion.div>
          </div>
          <AuthRedirect requireAuth={true} requireActive={true} redirectTo="/login" />
        </main>
      </div>
    </div>
  );
};

export default ReferralsPage;