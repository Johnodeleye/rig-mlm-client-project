'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, User, Settings, LogOut, Home, Users,
  DollarSign, CreditCard, TrendingUp, Package, Shield,
  Copy, Share2, ChevronDown, Search, BarChart3, MessageCircle,
  Wallet, History, Zap, UserCheck, UserX, Calendar,
  CheckCircle, Clock, XCircle, ArrowUpRight, ArrowDownRight,
  TrendingDown, Award, Target, Activity, Plus
} from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import PointsSystem from '../components/PointsSystem';
import { useAuth } from '@/context/AuthContext';
import AuthRedirect from './AuthRedirect';
import { useCurrency } from '@/context/CurrencyContext';

interface PointsData {
  monthlyPV: { personal: number; team: number };
  cumulativePV: { personal: number; team: number; total: number };
  monthlyTP: { personal: number; team: number };
  cumulativeTP: { personal: number; team: number; total: number };
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
  type: string;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
}

interface ReferralData {
  totalReferrals: number;
  activeReferrals: number;
  inactiveReferrals: number;
  referralLink: string;
  referralId: string;
}

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [copied, setCopied] = useState(false);

  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]);
  const [rawNotifications, setRawNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const dataFetchedRef = useRef(false);

  const { userProfile, user, token } = useAuth();
  const { currency, convertAmount, formatAmount, exchangeRate } = useCurrency();

  const getCurrentMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[new Date().getMonth()];
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        dataFetchedRef.current = true;

        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!token) {
          setIsLoading(false);
          return;
        }

        const [pointsRes, referralsRes, transactionsRes, notificationsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/points/my-points`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/referrals/my-referrals`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/transactions/my-transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/notifications/my-notifications`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (pointsRes.ok) {
          const pointsData = await pointsRes.json();
          setPointsData(pointsData.pointsData);
        }

        if (referralsRes.ok) {
          const referralData = await referralsRes.json();
          setReferralData(referralData.referralData);
        }

        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setRawTransactions(transactionsData.transactions || []);
        }

        if (notificationsRes.ok) {
          const notificationsData = await notificationsRes.json();
          setRawNotifications(notificationsData.notifications || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processNotifications = (notifications: Notification[]) => {
    return notifications.map(notification => {
      let processedMessage = notification.message;

      if (currency === 'USD') {
        const nairaMatch = processedMessage.match(/₦([\d,]+(\.\d{2})?)/);
        if (nairaMatch) {
          const nairaAmount = parseFloat(nairaMatch[1].replace(/,/g, ''));
          const usdAmount = nairaAmount / exchangeRate;
          processedMessage = processedMessage.replace(
            `₦${nairaMatch[1]}`,
            `$${usdAmount.toFixed(2)}`
          );
        }
      }

      return {
        ...notification,
        message: processedMessage
      };
    });
  };

  const processTransactionAmount = (amount: string, type: string): string => {
    if (currency === 'NGN') {
      return type === 'credit' ? amount : amount;
    } else {
      const nairaMatch = amount.match(/₦([\d,]+(\.\d{2})?)/);
      if (nairaMatch) {
        const nairaAmount = parseFloat(nairaMatch[1].replace(/,/g, ''));
        const usdAmount = nairaAmount / exchangeRate;
        return type === 'credit' ? 
          `$${usdAmount.toFixed(2)}` : `-$${usdAmount.toFixed(2)}`;
      }
      return amount;
    }
  };

  const copyReferralLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareReferralLink = async () => {
    if (referralData?.referralLink) {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join RIG Global',
            text: 'Join me on RIG Global and start earning!',
            url: referralData.referralLink,
          });
        } catch (error) {
          console.log('Error sharing:', error);
        }
      } else {
        copyReferralLink();
      }
    }
  };

  const processedTransactions = rawTransactions.map(transaction => ({
    ...transaction,
    amount: processTransactionAmount(transaction.amount, transaction.type)
  }));

  const processedNotifications = processNotifications(rawNotifications);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Header 
          setIsSidebarOpen={setIsSidebarOpen}
          isProfileDropdownOpen={isProfileDropdownOpen}
          setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        />
        <div className="flex pt-16">
          <DesktopSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
          <main className="flex-1 w-full lg:ml-64 p-4 lg:p-8">
            <div className="animate-pulse space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-36"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-32"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-80"></div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-80"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AuthRedirect requireAuth={true} requireActive={true} redirectTo="/login" />
      
      <Header 
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <div className="flex pt-16">
        <DesktopSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        
        <MobileSidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main className="flex-1 w-full lg:ml-64 p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-xl border border-blue-400/20 p-6 lg:p-8 mb-6"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                        Welcome back, {userProfile?.name || user?.username}! 👋
                      </h1>
                      <p className="text-blue-100 text-sm">Here's what's happening with your account today</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-4 mt-6">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-blue-200" />
                        <span className="text-xs text-blue-200">Plan</span>
                      </div>
                      <p className="text-white font-semibold">{userProfile?.plan || 'No Plan'}</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-200" />
                        <span className="text-xs text-blue-200">PV</span>
                      </div>
                      <p className="text-white font-semibold">{userProfile?.pv || 0}</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-yellow-300" />
                        <span className="text-xs text-blue-200">TP</span>
                      </div>
                      <p className="text-white font-semibold">{userProfile?.tp || 0}</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-blue-200" />
                        <span className="text-xs text-blue-200">Status</span>
                      </div>
                      <p className={`font-semibold ${userProfile?.isActive ? 'text-green-300' : 'text-red-300'}`}>
                        {userProfile?.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <a 
                  href='/upgrade' 
                  className="group relative overflow-hidden bg-white hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-center"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Upgrade Plan
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          {pointsData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-600" />
                  Points Overview
                </h2>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                  {getCurrentMonth()} {new Date().getFullYear()}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium">
                      {getCurrentMonth()}
                    </span>
                  </div>
                  <h3 className="text-white/80 text-sm font-medium mb-2">Monthly PV</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-xs">Personal</span>
                      <span className="text-white text-xl font-bold">{pointsData.monthlyPV.personal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-xs">Team</span>
                      <span className="text-white text-xl font-bold">{pointsData.monthlyPV.team}</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-xs font-semibold flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Total
                        </span>
                        <span className="text-white text-2xl font-bold">{pointsData.monthlyPV.personal + pointsData.monthlyPV.team}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium">
                      Total
                    </span>
                  </div>
                  <h3 className="text-white/80 text-sm font-medium mb-2">Cumulative PV</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-xs">Personal</span>
                      <span className="text-white text-xl font-bold">{pointsData.cumulativePV.personal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-xs">Team</span>
                      <span className="text-white text-xl font-bold">{pointsData.cumulativePV.team}</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-xs font-semibold flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Total
                        </span>
                        <span className="text-white text-2xl font-bold">{pointsData.cumulativePV.total}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium">
                      {getCurrentMonth()}
                    </span>
                  </div>
                  <h3 className="text-white/80 text-sm font-medium mb-2">Monthly TP</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-xs">Personal</span>
                      <span className="text-white text-xl font-bold">{pointsData.monthlyTP.personal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-xs">Team</span>
                      <span className="text-white text-xl font-bold">{pointsData.monthlyTP.team}</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-xs font-semibold flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Total
                        </span>
                        <span className="text-white text-2xl font-bold">{pointsData.monthlyTP.personal + pointsData.monthlyTP.team}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium">
                      Total
                    </span>
                  </div>
                  <h3 className="text-white/80 text-sm font-medium mb-2">Cumulative TP</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-xs">Personal</span>
                      <span className="text-white text-xl font-bold">{pointsData.cumulativeTP.personal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-xs">Team</span>
                      <span className="text-white text-xl font-bold">{pointsData.cumulativeTP.team}</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-xs font-semibold flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          Total
                        </span>
                        <span className="text-white text-2xl font-bold">{pointsData.cumulativeTP.total}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-2">Total Earnings</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white mb-1">
                      {convertAmount(userProfile?.totalEarnings || 0)}
                    </p>
                    <div className="flex items-center gap-2 text-green-100 text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>All time earnings</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-2">Available Balance</p>
                    <p className="text-3xl lg:text-4xl font-bold text-white mb-1">
                      {convertAmount(userProfile?.walletBalance || 0)}
                    </p>
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <Wallet className="w-4 h-4" />
                      <span>Ready to withdraw</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Referral Program</h2>
                  <p className="text-sm text-gray-500">Invite friends and earn rewards</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Your Referral Link</label>
                <div className="relative">
                  <input
                    type="text"
                    value={referralData?.referralLink || ''}
                    readOnly
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Copy className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <button
                    onClick={copyReferralLink}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-semibold group"
                  >
                    <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={shareReferralLink}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 font-semibold group shadow-lg"
                  >
                    <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Share
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {userProfile?.totalReferrals || 0}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
                  <p className="text-sm text-gray-500">Your performance at a glance</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Current Plan</p>
                      <p className="font-bold text-gray-900">{userProfile?.plan || 'No Plan'}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total PV</p>
                      <p className="font-bold text-gray-900">{userProfile?.pv || 0}</p>
                    </div>
                  </div>
                  <div className="text-green-600 text-sm font-semibold">Active</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total TP</p>
                      <p className="font-bold text-gray-900">{userProfile?.tp || 0}</p>
                    </div>
                  </div>
                  <div className="text-purple-600 text-sm font-semibold">Growing</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Status</p>
                      <p className={`font-bold ${userProfile?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {userProfile?.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${userProfile?.isActive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <History className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                  <p className="text-sm text-gray-500">Track your financial activity</p>
                </div>
              </div>
              <a 
                href="/wallet" 
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="text-left py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="text-left py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                    <th className="text-left py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTransactions.slice(0, 5).map((transaction, index) => (
                    <motion.tr 
                      key={transaction.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {transaction.date}
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-sm font-semibold text-gray-900">{transaction.description}</p>
                      </td>
                      <td className="py-4">
                        <div className={`flex items-center gap-1 font-bold text-sm ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          {transaction.amount}
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                            transaction.status === 'Paid' || transaction.status === 'Completed'
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : transaction.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          {transaction.status === 'Paid' || transaction.status === 'Completed' ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                          {transaction.status === 'Pending' ? <Clock className="w-3.5 h-3.5" /> : null}
                          {transaction.status === 'Failed' ? <XCircle className="w-3.5 h-3.5" /> : null}
                          {transaction.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {processedTransactions.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-500 text-sm">Your transaction history will appear here</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Notifications</h2>
                  <p className="text-sm text-gray-500">Stay updated with latest activities</p>
                </div>
              </div>
              <a 
                href="/notifications" 
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
            
            <div className="space-y-3">
              {processedNotifications.slice(0, 4).map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group flex items-start gap-4 p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                    !notification.read 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200' 
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !notification.read 
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                      : 'bg-gray-300'
                  }`}>
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {processedNotifications.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-500 text-sm">You're all caught up!</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;