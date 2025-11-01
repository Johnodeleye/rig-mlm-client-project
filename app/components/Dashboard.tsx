'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, User, Settings, LogOut, Home, Users, 
  DollarSign, CreditCard, TrendingUp, Package, Shield,
  Copy, Share2, ChevronDown, Search, BarChart3, MessageCircle,
  Wallet, History, Zap, UserCheck, UserX, Calendar,
  CheckCircle,
  Clock,
  XCircle
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
  cumulativePV: { personal: number; team: number };
  monthlyTP: { personal: number; team: number };
  cumulativeTP: { personal: number; team: number };
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
        return type === 'credit' ? `$${usdAmount.toFixed(2)}` : `-$${usdAmount.toFixed(2)}`;
      }
      return amount;
    }
  };

  const commissionData = [
    { level: 1, totalMembers: 1, commission: '48%', commissionableAmount: convertAmount(2500) },
    { level: 3, totalMembers: 3, commission: '48%', commissionableAmount: convertAmount(5000) },
    { level: 5, totalMembers: 5, commission: '48%', commissionableAmount: convertAmount(10000) },
    { level: 7, totalMembers: 7, commission: '48%', commissionableAmount: convertAmount(15000) },
    { level: 10, totalMembers: 10, commission: '48%', commissionableAmount: convertAmount(30000) },
    { level: 12, totalMembers: 12, commission: '48%', commissionableAmount: convertAmount(60000) },
    { level: 15, totalMembers: 15, commission: '48%', commissionableAmount: convertAmount(150000) }
  ];

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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 h-40"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 h-64"></div>
                <div className="bg-white rounded-xl p-6 h-64"></div>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-3 lg:mb-0">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {userProfile?.name || user?.username}!
                </h1>
                <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2 lg:gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>Plan: {userProfile?.plan || 'No Plan'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>PV: {userProfile?.pv || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>TP: {userProfile?.tp || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className={`font-medium ${userProfile?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {userProfile?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <a href='/upgrade' className="w-full lg:w-auto px-4 lg:px-6 py-2 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm lg:text-base text-center">
                Upgrade Plan
              </a>
            </div>
          </motion.div>

          {pointsData && <PointsSystem pointsData={pointsData} />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-4 lg:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {convertAmount(userProfile?.totalEarnings || 0)}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
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
                  <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {convertAmount(userProfile?.walletBalance || 0)}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Referral Program</h2>
              
              <div className="mb-4 lg:mb-6">
                <p className="text-sm text-gray-600 mb-2">Your Referral Link</p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={referralData?.referralLink || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={copyReferralLink}
                      className="flex-1 px-3 lg:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      {copied ? 'Copied!' : <><Copy className="w-4 h-4" /><span className="hidden lg:inline">Copy</span></>}
                    </button>
                    <button
                      onClick={shareReferralLink}
                      className="flex-1 px-3 lg:px-4 py-2 bg-[#0660D3] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden lg:inline">Share</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-[#0660D3] mx-auto mb-2" />
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {userProfile?.totalReferrals || 0}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600">Total Referrals</p>
                </div>
              </div>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Commission Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[280px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Level</th>
                      <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Members</th>
                      <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Your earning</th>
                      <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Comm.Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-900">Level {row.level}</td>
                        <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-600">{row.totalMembers}</td>
                        <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-600">{row.commission}</td>
                        <td className="py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-900">{row.commissionableAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div> */}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mt-4 lg:mt-6"
            id='txt'
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Description</th>
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTransactions.map((transaction, index) => (
                    <tr key={transaction.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {transaction.date}
                        </div>
                      </td>
                      <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-900">{transaction.description}</td>
                      <td className={`py-2 lg:py-3 text-xs lg:text-sm font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </td>
                      <td className="py-2 lg:py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                            transaction.status === 'Paid' || transaction.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.status === 'Paid' || transaction.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : null}
                          {transaction.status === 'Pending' ? <Clock className="w-3 h-3" /> : null}
                          {transaction.status === 'Failed' ? <XCircle className="w-3 h-3" /> : null}
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {processedTransactions.length === 0 && (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mt-4 lg:mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
              <a 
                href="/notifications" 
                className="text-sm text-[#0660D3] hover:text-blue-700 font-medium"
              >
                View All
              </a>
            </div>
            <div className="space-y-3">
              {processedNotifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    !notification.read ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                  }`}
                >
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-[#0660D3] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-[#0660D3] rounded-full flex-shrink-0"></div>
                  )}
                </div>
              ))}
            </div>
            {processedNotifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;