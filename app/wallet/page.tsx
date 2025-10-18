// app/wallet/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, TrendingUp, Download, Calendar, CreditCard, Clock, CheckCircle, XCircle, Send } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';

const WalletPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('earnings');

  const walletData = {
    totalEarnings: '₦45,670',
    totalEarningsUSD: '$89.34',
    availableBalance: '₦23,450',
    availableBalanceUSD: '$45.78',
    pendingWithdrawals: '₦12,220'
  };

  const transactions = [
    { id: 1, date: '2024-01-15', description: 'Level 1 Commission', amount: '₦1,200', status: 'Paid', type: 'credit' },
    { id: 2, date: '2024-01-14', description: 'Direct Referral Bonus', amount: '₦500', status: 'Paid', type: 'credit' },
    { id: 3, date: '2024-01-13', description: 'Withdrawal', amount: '₦10,000', status: 'Paid', type: 'debit' },
    { id: 4, date: '2024-01-12', description: 'Level 2 Commission', amount: '₦250', status: 'Pending', type: 'credit' },
    { id: 5, date: '2024-01-11', description: 'Product Purchase', amount: '₦9,000', status: 'Paid', type: 'debit' },
    { id: 6, date: '2024-01-10', description: 'Withdrawal', amount: '₦5,000', status: 'Failed', type: 'debit' }
  ];

  // Rewards Data
  const rewardsData = {
    monthlyPV: { current: 320, target: 600 }, // Example current PV
    cumulativePV: { current: 2800, target: 3500 }, // Example current cumulative PV
    cumulativeTP: { current: 12500, target: 30000 } // Example current TP
  };

  // Monthly Salary Bonuses
  const monthlySalaryBonuses = [
    { level: 'SB1', requiredPV: 600, salaryNGN: '₦50,000', salaryUSD: '$100', maxCappedPV: 270 },
    { level: 'SB2', requiredPV: 1200, salaryNGN: '₦100,000', salaryUSD: '$200', maxCappedPV: 540 },
    { level: 'SB3', requiredPV: 2500, salaryNGN: '₦200,000', salaryUSD: '$300', maxCappedPV: 1125 },
    { level: 'SB4', requiredPV: 4000, salaryNGN: '₦300,000', salaryUSD: '$400', maxCappedPV: 1800 },
    { level: 'SB5', requiredPV: 6000, salaryNGN: '₦400,000', salaryUSD: '$500', maxCappedPV: 2700 },
    { level: 'SB6', requiredPV: 10000, salaryNGN: '₦600,000', salaryUSD: '$1,000', maxCappedPV: 4500 },
    { level: 'SB7', requiredPV: 17000, salaryNGN: '₦1,000,000', salaryUSD: '$1,500', maxCappedPV: 7650 }
  ];

  // Rank Awards
  const rankAwards = [
    { rank: 'Sapphire', cumulativePV: 3500, awardNGN: '₦100,000', awardUSD: '$250', maxCappedPV: 1575 },
    { rank: 'Pearl', cumulativePV: 9000, awardNGN: '₦250,000', awardUSD: '$600', maxCappedPV: 4050 },
    { rank: 'Ruby', cumulativePV: 25000, awardNGN: '₦800,000', awardUSD: '$2,000', maxCappedPV: 11250 },
    { rank: 'Emerald', cumulativePV: 60000, awardNGN: '₦3,000,000', awardUSD: '$4,000', maxCappedPV: 27000 },
    { rank: 'Diamond', cumulativePV: 150000, awardNGN: '₦6,000,000', awardUSD: '$8,000', maxCappedPV: 67500 },
    { rank: 'Blue Diamond', cumulativePV: 350000, awardNGN: '₦12,000,000', awardUSD: '$20,000', maxCappedPV: 157500 },
    { rank: 'Black Diamond', cumulativePV: 700000, awardNGN: '₦25,000,000', awardUSD: '$40,000', maxCappedPV: 315000 },
    { rank: 'Crown Diamond', cumulativePV: 1500000, awardNGN: '₦50,000,000', awardUSD: '$100,000', maxCappedPV: 675000 },
    { rank: 'Ambassador', cumulativePV: 5000000, awardNGN: '₦150,000,000', awardUSD: '$250,000', maxCappedPV: 2250000 },
    { rank: 'Crown Ambassador', cumulativePV: 15000000, awardNGN: '₦300,000,000', awardUSD: '$500,000', maxCappedPV: 6750000 }
  ];

  // Travel Awards
  const travelAwards = [
    { title: 'One (1) Person Trip', requiredTP: 30000, maxCappedTP: 13500 },
    { title: 'Two (2) Person Trip', requiredTP: 45000, maxCappedTP: 22500 }
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  type CircularProgressProps = {
    progress: number;
    size?: number;
    strokeWidth?: number;
  };

  const CircularProgress = ({ progress, size = 80, strokeWidth = 8 }: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0660D3"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
      </div>
    );
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
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Wallet & Earnings
            </h1>
            <p className="text-gray-600">Manage your earnings and withdrawals</p>
          </motion.div>

          {/* Wallet Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{walletData.totalEarnings}</p>
                  <p className="text-sm text-gray-500">{walletData.totalEarningsUSD}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
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
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{walletData.availableBalance}</p>
                  <p className="text-sm text-gray-500">{walletData.availableBalanceUSD}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
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
                  <p className="text-sm text-gray-600 mb-1">Pending Withdrawals</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{walletData.pendingWithdrawals}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              <button className="flex-1 px-4 lg:px-6 py-3 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4 lg:w-5 lg:h-5" />
                Withdraw Funds
              </button>
              <button className="flex-1 px-4 lg:px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                Send Money
              </button>
              <button className="flex-1 px-4 lg:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                View Transactions
              </button>
            </div>
          </motion.div>

          {/* Rewards Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Rewards & Incentives</h2>
            
            {/* Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <CircularProgress 
                    progress={calculateProgress(rewardsData.monthlyPV.current, rewardsData.monthlyPV.target)} 
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Monthly PV Progress</h3>
                <p className="text-sm text-gray-600">
                  {rewardsData.monthlyPV.current} / {rewardsData.monthlyPV.target} PV
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <CircularProgress 
                    progress={calculateProgress(rewardsData.cumulativePV.current, rewardsData.cumulativePV.target)} 
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Cumulative PV Progress</h3>
                <p className="text-sm text-gray-600">
                  {rewardsData.cumulativePV.current} / {rewardsData.cumulativePV.target} PV
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <CircularProgress 
                    progress={calculateProgress(rewardsData.cumulativeTP.current, rewardsData.cumulativeTP.target)} 
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Travel Points Progress</h3>
                <p className="text-sm text-gray-600">
                  {rewardsData.cumulativeTP.current} / {rewardsData.cumulativeTP.target} TP
                </p>
              </div>
            </div>

            {/* Monthly Salary Bonuses */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Salary Bonuses</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Level</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Required PV</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Salary (₦)</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Salary ($)</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Max Capped PV</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySalaryBonuses.map((bonus, index) => {
                      const progress = calculateProgress(rewardsData.monthlyPV.current, bonus.requiredPV);
                      return (
                        <tr key={index} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 text-sm font-medium text-gray-900">{bonus.level}</td>
                          <td className="py-3 text-sm text-gray-600">{bonus.requiredPV.toLocaleString()} PV</td>
                          <td className="py-3 text-sm text-gray-600">{bonus.salaryNGN}</td>
                          <td className="py-3 text-sm text-gray-600">{bonus.salaryUSD}</td>
                          <td className="py-3 text-sm text-gray-600">{bonus.maxCappedPV.toLocaleString()} PV</td>
                          <td className="py-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#0660D3] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rank Awards */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rank Award Incentives</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Rank</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Cumulative PV</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Award (₦)</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Award ($)</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Max Capped PV</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankAwards.map((rank, index) => {
                      const progress = calculateProgress(rewardsData.cumulativePV.current, rank.cumulativePV);
                      return (
                        <tr key={index} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 text-sm font-medium text-gray-900">{rank.rank}</td>
                          <td className="py-3 text-sm text-gray-600">{rank.cumulativePV.toLocaleString()} PV</td>
                          <td className="py-3 text-sm text-gray-600">{rank.awardNGN}</td>
                          <td className="py-3 text-sm text-gray-600">{rank.awardUSD}</td>
                          <td className="py-3 text-sm text-gray-600">{rank.maxCappedPV.toLocaleString()} PV</td>
                          <td className="py-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#0660D3] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Travel Awards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Award Incentives</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Award Title</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Required TP</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Max Capped TP</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {travelAwards.map((award, index) => {
                      const progress = calculateProgress(rewardsData.cumulativeTP.current, award.requiredTP);
                      return (
                        <tr key={index} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 text-sm font-medium text-gray-900">{award.title}</td>
                          <td className="py-3 text-sm text-gray-600">{award.requiredTP.toLocaleString()} TP</td>
                          <td className="py-3 text-sm text-gray-600">{award.maxCappedTP.toLocaleString()} TP</td>
                          <td className="py-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#0660D3] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
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
                  {transactions.map((transaction, index) => (
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
                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                      </td>
                      <td className="py-2 lg:py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                            transaction.status === 'Paid'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.status === 'Paid' && <CheckCircle className="w-3 h-3" />}
                          {transaction.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {transaction.status === 'Failed' && <XCircle className="w-3 h-3" />}
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-8">
                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default WalletPage;