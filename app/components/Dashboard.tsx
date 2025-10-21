// app/home/page.tsx (Updated)
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, User, Settings, LogOut, Home, Users, 
  DollarSign, CreditCard, TrendingUp, Package, Shield,
  Copy, Share2, ChevronDown, Search, BarChart3, MessageCircle,
  Wallet, History, Zap, UserCheck, UserX, Calendar
} from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import PointsSystem from '../components/PointsSystem';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [copied, setCopied] = useState(false);

  // Points data with state management
  const [pointsData, setPointsData] = useState({
    monthlyPV: { personal: 20, team: 0 },
    cumulativePV: { personal: 20, team: 0 },
    monthlyTP: { personal: 10, team: 0 },
    cumulativeTP: { personal: 10, team: 0 }
  });

  // Mock user data
  const userData = {
    name: 'John Ayomide',
    username: '@johnayomide',
    plan: 'Beginner Plan',
    pv: 20,
    tp: 10,
    status: 'Active',
    totalEarnings: '₦45,670',
    availableBalance: '₦23,450',
    totalReferrals: 15,
    referralLink: 'https://rigglobal.com/ref/johnayomide'
  };

const commissionData = [
  { level: 1, totalMembers: 1, commission: '48%', commissionableAmount: '₦2,500' }, 
  { level: 3, totalMembers: 3, commission: '48%',  commissionableAmount: '₦5,000' }, 
  { level: 5, totalMembers: 5, commission: '48%',  commissionableAmount: '₦10,000' }, 
  { level: 7, totalMembers: 7, commission: '48%',  commissionableAmount: '₦15,000' }, 
  { level: 10, totalMembers: 10, commission: '48%',  commissionableAmount: '₦30,000' }, 
  { level: 12, totalMembers: 12, commission: '48%',  commissionableAmount: '₦60,000' }, 
  { level: 15, totalMembers: 15, commission: '48%',  commissionableAmount: '₦150,0000' } 
];


  const transactions = [
    { date: '2024-01-15', description: 'Level 1 Commission', amount: '₦1,200', status: 'Paid' },
    { date: '2024-01-14', description: 'Direct Referral Bonus', amount: '₦500', status: 'Paid' },
    { date: '2024-01-13', description: 'Level 2 Commission', amount: '₦250', status: 'Pending' },
    { date: '2024-01-12', description: 'Product Purchase', amount: '₦9,000', status: 'Paid' }
  ];

  const notifications = [
    { id: 1, message: 'New referral joined your network', time: '2 hours ago', read: false },
    { id: 2, message: 'Commission payment processed', time: '1 day ago', read: true },
    { id: 3, message: 'Your account has been upgraded', time: '2 days ago', read: true }
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(userData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join RIG Global',
          text: 'Join me on RIG Global and start earning!',
          url: userData.referralLink,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      copyReferralLink();
    }
  };

  // Simulate points update when team grows
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update team points to simulate growth
      setPointsData(prev => ({
        ...prev,
        monthlyPV: {
          ...prev.monthlyPV,
          team: Math.min(prev.monthlyPV.team + Math.floor(Math.random() * 5), 100)
        },
        cumulativePV: {
          ...prev.cumulativePV,
          team: prev.cumulativePV.team + Math.floor(Math.random() * 3)
        },
        monthlyTP: {
          ...prev.monthlyTP,
          team: Math.min(prev.monthlyTP.team + Math.floor(Math.random() * 2), 50)
        },
        cumulativeTP: {
          ...prev.cumulativeTP,
          team: prev.cumulativeTP.team + Math.floor(Math.random() * 1)
        }
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      {/* Sidebar */}
      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <DesktopSidebar 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        {/* Mobile Sidebar */}
        <MobileSidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        {/* Main Content */}
        <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-3 lg:mb-0">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {userData.name}!
                </h1>
                <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2 lg:gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>Plan: {userData.plan}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>PV: {userData.pv}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>TP: {userData.tp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-green-600 font-medium">{userData.status}</span>
                  </div>
                </div>
              </div>
              <button className="w-full lg:w-auto px-4 lg:px-6 py-2 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm lg:text-base">
                Upgrade Plan
              </button>
            </div>
          </motion.div>

          {/* Points System */}
          <PointsSystem pointsData={pointsData} />

          {/* Earnings Cards */}
          <div className="grid grid-cols-1 gap-4 lg:gap-6 mb-4 lg:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{userData.totalEarnings}</p>
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
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{userData.availableBalance}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Referral Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Referral Program</h2>
              
              {/* Referral Link */}
              <div className="mb-4 lg:mb-6">
                <p className="text-sm text-gray-600 mb-2">Your Referral Link</p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={userData.referralLink}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={copyReferralLink}
                      className="flex-1 px-3 lg:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 text-sm"
                    >
                      {copied ? 'Copied!' : <Copy className="w-4 h-4" />}
                      <span className="hidden lg:inline">{copied ? 'Copied!' : 'Copy'}</span>
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

              {/* Referral Stats */}
              <div className="grid grid-cols-1 gap-3">
                <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-[#0660D3] mx-auto mb-2" />
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{userData.totalReferrals}</p>
                  <p className="text-xs lg:text-sm text-gray-600">Total Referrals</p>
                </div>
              </div>
            </motion.div>

            {/* Commission Breakdown */}
            <motion.div
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
            </motion.div>
          </div>

          {/* Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mt-4 lg:mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] lg:min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Description</th>
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-600">
                        <div className="flex items-center gap-1 lg:gap-2">
                          <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                          {transaction.date}
                        </div>
                      </td>
                      <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-900">{transaction.description}</td>
                      <td className="py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-900">{transaction.amount}</td>
                      <td className="py-2 lg:py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mt-4 lg:mt-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-3">
              {notifications.map((notification) => (
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
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;