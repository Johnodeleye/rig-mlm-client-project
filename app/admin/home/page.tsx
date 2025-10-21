// app/admin/home/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, DollarSign, TrendingUp, Wallet, Download, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminDesktopSidebar from '../../components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '../../components/admin/AdminMobileSidebar';
import { useAuth } from '@/context/AuthContext';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('home');
    const router = useRouter();
  const { user, accountType, isAuthenticated, isLoading } = useAuth();

  // Check authentication and admin role
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || accountType !== 'admin') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, accountType, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || accountType !== 'admin') {
    return null; // Will redirect due to useEffect
  }

  const statsData = {
    totalUsers: 1250,
    activeUsers: 890,
    totalProducts: 15,
    pendingWithdrawals: 23,
    totalEarnings: '₦2,450,670',
    monthlyRevenue: '₦450,230'
  };

  const recentActivities = [
    { id: 1, user: 'John Ayomide', action: 'Upgraded to Business Pack', time: '2 mins ago' },
    { id: 2, user: 'Sarah Johnson', action: 'Requested withdrawal', time: '5 mins ago' },
    { id: 3, user: 'Mike Chen', action: 'Joined platform', time: '10 mins ago' },
    { id: 4, user: 'Emily Davis', action: 'Added new referral', time: '15 mins ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <div className="flex pt-16">
        <AdminDesktopSidebar 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <AdminMobileSidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Good Morning, Admin Michael!
                </h1>
                <p className="text-gray-600">Here's what's happening with your platform today.</p>
              </div>
              <div className="mt-3 lg:mt-0 text-sm text-gray-500">
                Last login: Today at 08:30 AM
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
            {/* Total Users */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{statsData.totalUsers}</p>
                  <p className="text-sm text-green-600">{statsData.activeUsers} active</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            {/* Total Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{statsData.totalProducts}</p>
                  <p className="text-sm text-gray-500">Active products</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            {/* Pending Withdrawals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Withdrawals</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{statsData.pendingWithdrawals}</p>
                  <p className="text-sm text-yellow-600">Requires attention</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>

            {/* Total Earnings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{statsData.totalEarnings}</p>
                  <p className="text-sm text-gray-500">All time</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>

            {/* Monthly Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{statsData.monthlyRevenue}</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Quick Actions</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">Manage</p>
                  <p className="text-sm text-gray-500">Platform tools</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/admin/users"
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
                >
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Manage Users</p>
                </a>
                <a
                  href="/admin/products"
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
                >
                  <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Products</p>
                </a>
                <a
                  href="/admin/wallet"
                  className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
                >
                  <Wallet className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Wallet</p>
                </a>
                <a
                  href="/admin/withdrawals"
                  className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center"
                >
                  <Download className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Withdrawals</p>
                </a>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;