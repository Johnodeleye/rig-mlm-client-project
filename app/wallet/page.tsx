// app/wallet/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, TrendingUp, Download, Calendar, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
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
              <button className="flex-1 px-4 lg:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                View Transactions
              </button>
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