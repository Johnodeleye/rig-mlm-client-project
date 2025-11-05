'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Copy, Share2, UserCheck, UserX, Calendar, DollarSign, Loader2, Zap,
  TrendingUp, Award, Star, Gift, Link as LinkIcon, Sparkles, ArrowRight,
  Target, Activity, CheckCircle, Clock, AlertCircle, ExternalLink
} from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import AuthRedirect from '../components/AuthRedirect';
import { useCurrency } from '@/context/CurrencyContext';
import Image from 'next/image';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
          <main className="flex-1 w-full lg:ml-64 p-4 lg:p-8">
            <div className="animate-pulse space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-36"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-32"></div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-96"></div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-96"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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

        <main className="flex-1 w-full lg:ml-64 p-4 lg:p-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-xl border border-blue-400/20 p-6 lg:p-8 mb-6"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                        My Referrals Network
                      </h1>
                      <p className="text-blue-100 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Build your team and earn commissions
                      </p>
                    </div>
                  </div>
                  
                  {referralData && (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 inline-flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-300" />
                      <span className="text-white font-semibold">Your Referral ID:</span>
                      <span className="text-yellow-300 font-bold">{referralData.referralId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Referrals
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {referralData?.totalReferrals || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>All time referrals</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Active Referrals
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {referralData?.activeReferrals || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Earning commissions</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Total Commission
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {referralData?.totalCommission ? processTotalCommission(referralData.totalCommission) : currency === 'NGN' ? '₦0' : '$0'}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <TrendingUp className="w-4 h-4" />
                <span>Total earnings</span>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referral Link Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Referral Link</h2>
                  <p className="text-sm text-gray-500">Share and earn commissions</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                  <Gift className="w-4 h-4 text-blue-600" />
                  Your unique referral URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={referralData?.referralLink || 'Loading...'}
                    readOnly
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyReferralLink}
                    disabled={!referralData?.referralLink}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-semibold group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Copy Link
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={shareReferralLink}
                    disabled={!referralData?.referralLink}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 font-semibold group shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Share
                  </motion.button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Quick Stats</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                    <Users className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{referralData?.totalReferrals || 0}</p>
                    <p className="text-xs text-gray-600">Total Referrals</p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-green-100">
                    <UserCheck className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{referralData?.activeReferrals || 0}</p>
                    <p className="text-xs text-gray-600">Active Users</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Referrals List Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">My Referrals</h2>
                    <p className="text-sm text-gray-500">{referralData?.referrals.length || 0} team members</p>
                  </div>
                </div>
              </div>
              
              {referralData?.referrals && referralData.referrals.length > 0 ? (
                <>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                    {referralData.referrals.map((referral, index) => (
                      <motion.div
                        key={referral.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">
                                {referral.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-sm truncate">
                                {referral.name}
                              </h3>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span>@{referral.username}</span>
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 flex-shrink-0 ${
                              referral.status === 'Active'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                                : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                            }`}
                          >
                            {referral.status === 'Active' ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {referral.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="bg-white rounded-lg p-2 border border-gray-200">
                            <div className="flex items-center gap-1 mb-1">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <p className="text-[10px] text-gray-500">Joined</p>
                            </div>
                            <span className="text-xs font-bold text-gray-700 block">
                              {new Date(referral.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          
                          <div className="bg-white rounded-lg p-2 border border-gray-200">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <p className="text-[10px] text-gray-500">Level</p>
                            </div>
                            <span className="text-xs font-bold text-gray-700">
                              Level {referral.level}
                            </span>
                          </div>
                          
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2 border border-green-200">
                            <div className="flex items-center gap-1 mb-1">
                              <DollarSign className="w-3 h-3 text-green-600" />
                              <p className="text-[10px] text-gray-500">Earned</p>
                            </div>
                            <span className="text-xs font-bold text-green-700">
                              {processCommissionAmount(referral.commission)}
                            </span>
                          </div>
                        </div>

                        {referral.status === 'Inactive' && (
                          <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href={`/payment/${referral.id}`}
                            className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-bold shadow-lg hover:shadow-xl group"
                          >
                            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Activate This Referral
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </motion.a>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Award className="w-5 h-5 text-green-600" />
                          Total Commission Earned:
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {referralData.totalCommission ? processTotalCommission(referralData.totalCommission) : currency === 'NGN' ? '₦0' : '$0'}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full"></div>
                    <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Referrals Yet</h3>
                  <p className="text-gray-500 mb-6 text-sm px-4">
                    Start building your network by sharing your referral link
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={shareReferralLink}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto font-bold"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Referral Link Now
                    <Sparkles className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>

          <AuthRedirect requireAuth={true} requireActive={true} redirectTo="/login" />
        </main>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
    </div>
  );
};

export default ReferralsPage;