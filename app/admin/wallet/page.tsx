// app/admin/wallet/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Minus, DollarSign, CreditCard, TrendingUp, Users, Plane, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminDesktopSidebar from '@/app/components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '@/app/components/admin/AdminMobileSidebar';

const AdminWalletPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('wallet');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const router = useRouter();

  // Mock users data
  useEffect(() => {
    const mockUsers = [
      { 
        id: '1', 
        name: 'John Doe', 
        email: 'john@example.com', 
        phone: '+2348012345678',
        walletBalance: 25000,
        pvBalance: 1250,
        tpBalance: 300,
        totalTransactions: 47
      },
      { 
        id: '2', 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        phone: '+2348023456789',
        walletBalance: 18000,
        pvBalance: 890,
        tpBalance: 150,
        totalTransactions: 32
      },
      { 
        id: '3', 
        name: 'Mike Johnson', 
        email: 'mike@example.com', 
        phone: '+2348034567890',
        walletBalance: 32000,
        pvBalance: 2100,
        tpBalance: 450,
        totalTransactions: 65
      },
      { 
        id: '4', 
        name: 'Sarah Wilson', 
        email: 'sarah@example.com', 
        phone: '+2348045678901',
        walletBalance: 15000,
        pvBalance: 750,
        tpBalance: 120,
        totalTransactions: 28
      },
      { 
        id: '5', 
        name: 'David Brown', 
        email: 'david@example.com', 
        phone: '+2348056789012',
        walletBalance: 42000,
        pvBalance: 3100,
        tpBalance: 600,
        totalTransactions: 89
      },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [router]);

  // Filter users based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setShowUserDropdown(false);
    setSearchTerm(user.name);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowUserDropdown(true);
    if (e.target.value === '') {
      setSelectedUser(null);
    }
  };

  const handleAddFunds = () => {
    if (!selectedUser) return;
    // Implementation for adding funds
    console.log('Adding funds to user:', selectedUser.id);
    // You would typically open a modal or form here
  };

  const handleDeductFunds = () => {
    if (!selectedUser) return;
    // Implementation for deducting funds
    console.log('Deducting funds from user:', selectedUser.id);
    // You would typically open a modal or form here
  };

  const handleAddPoints = () => {
    if (!selectedUser) return;
    // Implementation for adding points
    console.log('Adding points to user:', selectedUser.id);
    // You would typically open a modal or form here
  };

  const handleDeductPoints = () => {
    if (!selectedUser) return;
    // Implementation for deducting points
    console.log('Deducting points from user:', selectedUser.id);
    // You would typically open a modal or form here
  };

  const handleViewTransactions = () => {
    if (!selectedUser) return;
    // Implementation for viewing transactions
    console.log('Viewing transactions for user:', selectedUser.id);
  };

  const handleUserHistory = () => {
    if (!selectedUser) return;
    // Implementation for viewing user history
    console.log('Viewing history for user:', selectedUser.id);
  };

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Wallet & Points Management
                </h1>
                <p className="text-gray-600">Manage user wallets, points, and transactions</p>
              </div>
            </div>
          </motion.div>

          {/* User Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select User</h2>
            
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onFocus={() => setShowUserDropdown(true)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                  />
                  
                  {/* User Dropdown */}
                  {showUserDropdown && filteredUsers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredUsers.map(user => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {selectedUser && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-green-900">Selected User</h3>
                      <p className="text-green-700">{selectedUser.name} • {selectedUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setSearchTerm('');
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Wallet Information */}
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-6"
            >
              {/* Wallet Balance */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Wallet Balance</h3>
                  <DollarSign className="w-8 h-8 text-green-600 bg-green-100 p-2 rounded-lg" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">₦{selectedUser.walletBalance?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Available balance</p>
              </div>

              {/* PV Balance */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">PV Balance</h3>
                  <TrendingUp className="w-8 h-8 text-blue-600 bg-blue-100 p-2 rounded-lg" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.pvBalance?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Point Value</p>
              </div>

              {/* Travel Points Balance */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Travel Points</h3>
                  <Plane className="w-8 h-8 text-purple-600 bg-purple-100 p-2 rounded-lg" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.tpBalance?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Travel Points Balance</p>
              </div>

              {/* Total Transactions */}
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Total Transactions</h3>
                  <CreditCard className="w-8 h-8 text-orange-600 bg-orange-100 p-2 rounded-lg" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.totalTransactions}</p>
                <p className="text-sm text-gray-600">All-time transactions</p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleAddFunds}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Funds
                </button>
                <button 
                  onClick={handleDeductFunds}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                  Deduct Funds
                </button>
                <button 
                  onClick={handleAddPoints}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Points
                </button>
                <button 
                  onClick={handleDeductPoints}
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                  Deduct Points
                </button>
                <button 
                  onClick={handleViewTransactions}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <CreditCard className="w-5 h-5" />
                  View Transactions
                </button>
                <button 
                  onClick={handleUserHistory}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  User History
                </button>
              </div>
            </motion.div>
          )}

          {/* Transaction History */}
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <Filter className="w-5 h-5 text-gray-400" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">PV</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">TP</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">2024-01-15</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Credit</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Package Purchase</td>
                      <td className="py-3 px-4 text-sm font-medium text-green-600">+₦9,000</td>
                      <td className="py-3 px-4 text-sm font-medium text-blue-600">+5</td>
                      <td className="py-3 px-4 text-sm font-medium text-purple-600">+10</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">2024-01-14</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Debit</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Product Purchase</td>
                      <td className="py-3 px-4 text-sm font-medium text-red-600">-₦4,500</td>
                      <td className="py-3 px-4 text-sm font-medium text-blue-600">+2</td>
                      <td className="py-3 px-4 text-sm font-medium text-purple-600">+5</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">2024-01-13</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Credit</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Commission</td>
                      <td className="py-3 px-4 text-sm font-medium text-green-600">+₦1,200</td>
                      <td className="py-3 px-4 text-sm font-medium text-blue-600">-</td>
                      <td className="py-3 px-4 text-sm font-medium text-purple-600">-</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-600">2024-01-12</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Debit</td>
                      <td className="py-3 px-4 text-sm text-gray-600">Withdrawal</td>
                      <td className="py-3 px-4 text-sm font-medium text-red-600">-₦10,000</td>
                      <td className="py-3 px-4 text-sm font-medium text-blue-600">-</td>
                      <td className="py-3 px-4 text-sm font-medium text-purple-600">-</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {!selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200"
            >
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a user to view wallet and points information</p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminWalletPage;