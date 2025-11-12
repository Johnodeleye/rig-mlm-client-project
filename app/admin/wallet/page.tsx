'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Minus, DollarSign, CreditCard, TrendingUp, Users, Plane, Zap, Calendar, Target, Users as UsersIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminDesktopSidebar from '@/app/components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '@/app/components/admin/AdminMobileSidebar';
import { useAuth } from '@/context/AuthContext';

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
  const [userPoints, setUserPoints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pointsType, setPointsType] = useState<'PERSONAL' | 'TEAM'>('PERSONAL');
  const [pointsPeriod, setPointsPeriod] = useState<'MONTHLY' | 'CUMULATIVE'>('MONTHLY');
  const router = useRouter();
  const { isAuthenticated, accountType, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || accountType !== 'admin') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, accountType, authLoading, router]);

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
          fetchUserPoints(data.user.id);
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

  const fetchUserPoints = async (userId: string) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/points/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserPoints(data.points);
        }
      }
    } catch (error) {
      console.error('Fetch points error:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowUserDropdown(true);
    if (e.target.value === '') {
      setSelectedUser(null);
      setTransactions([]);
      setUserPoints([]);
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
          pointsType,
          pointsPeriod,
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
          fetchUserPoints(selectedUser.id);
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
          pointsType,
          pointsPeriod,
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
          fetchUserPoints(selectedUser.id);
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

  const getTotalPoints = (type: 'PERSONAL' | 'TEAM', period: 'MONTHLY' | 'CUMULATIVE') => {
    const points = userPoints.find(p => p.type === type && p.period === period);
    return points ? { pv: points.pv, tp: points.tp } : { pv: 0, tp: 0 };
  };

  const personalMonthly = getTotalPoints('PERSONAL', 'MONTHLY');
  const personalCumulative = getTotalPoints('PERSONAL', 'CUMULATIVE');
  const teamMonthly = getTotalPoints('TEAM', 'MONTHLY');
  const teamCumulative = getTotalPoints('TEAM', 'CUMULATIVE');

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
                        setUserPoints([]);
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
            <>
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
                    <h3 className="text-lg font-semibold text-gray-900">Current PV</h3>
                    <TrendingUp className="w-8 h-8 text-blue-600 bg-blue-100 p-2 rounded-lg" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.pv?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Latest Point Value</p>
                </div>

                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current TP</h3>
                    <Plane className="w-8 h-8 text-purple-600 bg-purple-100 p-2 rounded-lg" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.tp?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Latest Travel Points</p>
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Points Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points Type</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPointsType('PERSONAL')}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          pointsType === 'PERSONAL'
                            ? 'bg-blue-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Target className="w-4 h-4 inline mr-2" />
                        Personal
                      </button>
                      <button
                        onClick={() => setPointsType('TEAM')}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          pointsType === 'TEAM'
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <UsersIcon className="w-4 h-4 inline mr-2" />
                        Team
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points Period</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPointsPeriod('MONTHLY')}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          pointsPeriod === 'MONTHLY'
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Monthly
                      </button>
                      <button
                        onClick={() => setPointsPeriod('CUMULATIVE')}
                        className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                          pointsPeriod === 'CUMULATIVE'
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 inline mr-2" />
                        Cumulative
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Wallet Actions</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddFunds}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Funds
                      </button>
                      <button
                        onClick={handleDeductFunds}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4 mr-2" />
                        Deduct Funds
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Points Actions</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddPoints}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Points
                      </button>
                      <button
                        onClick={handleDeductPoints}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4 mr-2" />
                        Deduct Points
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Points Overview</h3>
                  <button
                    onClick={handleViewTransactions}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Refresh Points
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Personal Monthly</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-900">{personalMonthly.pv}</span>
                      <span className="text-sm text-blue-700">PV</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-2xl font-bold text-blue-900">{personalMonthly.tp}</span>
                      <span className="text-sm text-blue-700">TP</span>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-purple-900 mb-2">Personal Cumulative</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-900">{personalCumulative.pv}</span>
                      <span className="text-sm text-purple-700">PV</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-2xl font-bold text-purple-900">{personalCumulative.tp}</span>
                      <span className="text-sm text-purple-700">TP</span>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-900 mb-2">Team Monthly</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-900">{teamMonthly.pv}</span>
                      <span className="text-sm text-green-700">PV</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-2xl font-bold text-green-900">{teamMonthly.tp}</span>
                      <span className="text-sm text-green-700">TP</span>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-orange-900 mb-2">Team Cumulative</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-900">{teamCumulative.pv}</span>
                      <span className="text-sm text-orange-700">PV</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-2xl font-bold text-orange-900">{teamCumulative.tp}</span>
                      <span className="text-sm text-orange-700">TP</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                  <button
                    onClick={handleViewTransactions}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Refresh Transactions
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Description</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{transaction.date}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.type === 'Credit' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">{transaction.description}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{transaction.amount}</td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 px-4 text-center text-sm text-gray-500">
                            No transactions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminWalletPage;