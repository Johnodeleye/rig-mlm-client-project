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

  // Fetch referral data
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
              {/* Header Skeleton */}
              <div className="bg-white rounded-xl p-6 h-32"></div>
              
              {/* Summary Cards Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 h-40"></div>
                ))}
              </div>
              
              {/* Content Skeleton */}
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              My Referrals
            </h1>
            <p className="text-gray-600">Manage and track your referral network</p>
            
            {/* Referral ID Display */}
            {referralData && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Your Referral ID:</strong> {referralData.referralId}
                </p>
              </div>
            )}
          </motion.div>

          {/* Summary Cards */}
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
                    {referralData?.totalCommission || '₦0'}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Referral Link */}
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

              {/* Quick Stats */}
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

            {/* Referrals List */}
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
              
              <div className="overflow-x-auto">
                {referralData?.referrals && referralData.referrals.length > 0 ? (
                  <table className="w-full min-w-[400px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Name</th>
                        <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Date</th>
                        <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Level</th>
                        <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Commission</th>
                        <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referralData.referrals.map((referral) => (
                        <tr key={referral.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                          <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{referral.name}</div>
                              <div className="text-xs text-gray-500">@{referral.username}</div>
                            </div>
                          </td>
                          <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(referral.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-600">
                            Level {referral.level}
                          </td>
                          <td className="py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-900">
                            {referral.commission}
                          </td>
                          <td className="py-2 lg:py-3">
                            <div className="flex flex-col gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
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
                              {referral.status === 'Inactive' && (
                                <a
                                  href={`/activate?user=${referral.id}`}
                                  className="px-2 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-1 text-xs font-medium w-fit"
                                >
                                  <Zap className="w-3 h-3" />
                                  Click to Activate
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Referrals Yet</h3>
                    <p className="text-gray-500 mb-4">Start sharing your referral link to earn commissions</p>
                    <button
                      onClick={shareReferralLink}
                      className="px-4 py-2 bg-[#0660D3] text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Share Referral Link
                    </button>
                  </div>
                )}
              </div>

              {/* Summary Footer */}
              {referralData?.referrals && referralData.referrals.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Commission from Referrals:</span>
                    <span className="font-bold text-green-600">{referralData.totalCommission}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReferralsPage;