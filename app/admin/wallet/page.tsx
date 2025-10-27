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
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/admin');
    }
  }, [router]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers([]);
    } else {
      searchUsers(searchTerm);
    }
  }, [searchTerm]);

  const searchUsers = async (query: string) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/users/search?search=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFilteredUsers(data.users);
        }
      }
    } catch (error) {
      console.error('Search users error:', error);
    }
  };

  const handleUserSelect = async (user: any) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/user/${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedUser(data.user);
          fetchUserTransactions(data.user.id);
        }
      }
    } catch (error) {
      console.error('Fetch user details error:', error);
    } finally {
      setIsLoading(false);
      setShowUserDropdown(false);
      setSearchTerm(user.fullName);
    }
  };

  const fetchUserTransactions = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/transactions/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTransactions(data.transactions);
        }
      }
    } catch (error) {
      console.error('Fetch transactions error:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowUserDropdown(true);
    if (e.target.value === '') {
      setSelectedUser(null);
      setTransactions([]);
    }
  };

  const handleAddFunds = async () => {
    if (!selectedUser) return;
    
    const amount = parseFloat(prompt('Enter amount to add:') || '0');
    if (amount <= 0 || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    const description = prompt('Enter description (optional):') || `Admin added funds`;

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/add-funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount,
          description
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Funds added successfully!');
          setSelectedUser({
            ...selectedUser,
            walletBalance: data.newBalance
          });
          fetchUserTransactions(selectedUser.id);
        }
      } else {
        alert('Error adding funds');
      }
    } catch (error) {
      console.error('Add funds error:', error);
      alert('Error adding funds');
    }
  };

  const handleDeductFunds = async () => {
    if (!selectedUser) return;
    
    const amount = parseFloat(prompt('Enter amount to deduct:') || '0');
    if (amount <= 0 || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount > selectedUser.walletBalance) {
      alert('Deduction amount exceeds wallet balance');
      return;
    }

    const description = prompt('Enter description (optional):') || `Admin deducted funds`;

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/deduct-funds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount,
          description
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Funds deducted successfully!');
          setSelectedUser({
            ...selectedUser,
            walletBalance: data.newBalance
          });
          fetchUserTransactions(selectedUser.id);
        }
      } else {
        alert('Error deducting funds');
      }
    } catch (error) {
      console.error('Deduct funds error:', error);
      alert('Error deducting funds');
    }
  };

  const handleAddPoints = async () => {
    if (!selectedUser) return;
    
    const pvAmount = parseInt(prompt('Enter PV amount to add (0 for none):') || '0');
    const tpAmount = parseInt(prompt('Enter TP amount to add (0 for none):') || '0');

    if (pvAmount <= 0 && tpAmount <= 0) {
      alert('Please enter at least one valid point amount');
      return;
    }

    const description = prompt('Enter description (optional):') || `Admin added points`;

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/add-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          pvAmount,
          tpAmount,
          description
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Points added successfully!');
          setSelectedUser({
            ...selectedUser,
            pv: data.newPV,
            tp: data.newTP
          });
        }
      } else {
        alert('Error adding points');
      }
    } catch (error) {
      console.error('Add points error:', error);
      alert('Error adding points');
    }
  };

  const handleDeductPoints = async () => {
    if (!selectedUser) return;
    
    const pvAmount = parseInt(prompt('Enter PV amount to deduct (0 for none):') || '0');
    const tpAmount = parseInt(prompt('Enter TP amount to deduct (0 for none):') || '0');

    if (pvAmount <= 0 && tpAmount <= 0) {
      alert('Please enter at least one valid point amount');
      return;
    }

    if ((pvAmount > 0 && pvAmount > selectedUser.pv) || (tpAmount > 0 && tpAmount > selectedUser.tp)) {
      alert('Deduction amount exceeds available points');
      return;
    }

    const description = prompt('Enter description (optional):') || `Admin deducted points`;

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/deduct-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          pvAmount,
          tpAmount,
          description
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Points deducted successfully!');
          setSelectedUser({
            ...selectedUser,
            pv: data.newPV,
            tp: data.newTP
          });
        }
      } else {
        alert('Error deducting points');
      }
    } catch (error) {
      console.error('Deduct points error:', error);
      alert('Error deducting points');
    }
  };

  const handleViewTransactions = () => {
    if (!selectedUser) return;
    fetchUserTransactions(selectedUser.id);
  };

  const handleUserHistory = () => {
    if (!selectedUser) return;
    alert(`View history for user: ${selectedUser.fullName}`);
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
                  
                  {showUserDropdown && filteredUsers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredUsers.map(user => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phoneNumber}</div>
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
                      <p className="text-green-700">{selectedUser.fullName} • {selectedUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser(null);
                        setSearchTerm('');
                        setTransactions([]);
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

          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4 lg:mb-6"
            >
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Wallet Balance</h3>
                  <DollarSign className="w-8 h-8 text-green-600 bg-green-100 p-2 rounded-lg" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">₦{selectedUser.walletBalance?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Available balance</p>
              </div>

              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">PV Balance</h3>
                  <TrendingUp className="w-8 h-8 text-blue-600 bg-blue-100 p-2 rounded-lg" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.pv?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Point Value</p>
              </div>

              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Travel Points</h3>
                  <Plane className="w-8 h-8 text-purple-600 bg-purple-100 p-2 rounded-lg" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.tp?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Travel Points Balance</p>
              </div>

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
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">{transaction.date}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{transaction.type}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{transaction.description}</td>
                          <td className={`py-3 px-4 text-sm font-medium ${
                            transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-blue-600">{transaction.pv}</td>
                          <td className="py-3 px-4 text-sm font-medium text-purple-600">{transaction.tp}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              transaction.status === 'Completed' 
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
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