// app/referrals/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Share2, UserCheck, UserX, Calendar, DollarSign } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';

const ReferralsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('referrals');
  const [copied, setCopied] = useState(false);

  const userData = {
    totalReferrals: 15,
    activeReferrals: 8,
    totalCommission: '₦45,670',
    referralLink: 'https://rigglobal.com/ref/johnayomide'
  };

  const referrals = [
    { id: 1, name: 'Sarah Johnson', date: '2024-01-15', level: 1, commission: '₦1,200', status: 'Active' },
    { id: 2, name: 'Mike Chen', date: '2024-01-14', level: 1, commission: '₦500', status: 'Active' },
    { id: 3, name: 'Emily Davis', date: '2024-01-10', level: 2, commission: '₦250', status: 'Active' },
    { id: 4, name: 'Alex Rodriguez', date: '2024-01-08', level: 1, commission: '₦0', status: 'Inactive' },
    { id: 5, name: 'Jessica Brown', date: '2024-01-05', level: 3, commission: '₦125', status: 'Active' }
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
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{userData.totalReferrals}</p>
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
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{userData.activeReferrals}</p>
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
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{userData.totalCommission}</p>
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
            </motion.div>

            {/* Referrals List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Referrals</h2>
              <div className="overflow-x-auto">
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
                    {referrals.map((referral, index) => (
                      <tr key={referral.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-900">{referral.name}</td>
                        <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {referral.date}
                          </div>
                        </td>
                        <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-600">Level {referral.level}</td>
                        <td className="py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-900">{referral.commission}</td>
                        <td className="py-2 lg:py-3">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReferralsPage;