'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, Users, Plus, Minus, Target, Calendar, Users as UsersIcon, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminDesktopSidebar from '@/app/components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '@/app/components/admin/AdminMobileSidebar';
import { useAuth } from '@/context/AuthContext';

const AdminPointsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('points');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [tpAmount, setTpAmount] = useState('');
  const [pvAmount, setPvAmount] = useState('');
  const [pointsType, setPointsType] = useState('add');
  const [pointsCategory, setPointsCategory] = useState<'PERSONAL' | 'TEAM'>('PERSONAL');
  const [pointsPeriod, setPointsPeriod] = useState<'MONTHLY' | 'CUMULATIVE'>('MONTHLY');
  const [description, setDescription] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userPoints, setUserPoints] = useState<any[]>([]);
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
    setSelectedUser(user);
    setShowUserDropdown(false);
    setSearchTerm(user.fullName);
    await fetchUserPoints(user.id);
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
      setUserPoints([]);
    }
  };

  const handlePointsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }

    const pvValue = parseInt(pvAmount) || 0;
    const tpValue = parseInt(tpAmount) || 0;

    if (pvValue <= 0 && tpValue <= 0) {
      alert('Please enter at least one valid point amount');
      return;
    }

    if (pointsType === 'deduct') {
      const currentPoints = getCurrentPoints();
      if ((pvValue > 0 && pvValue > currentPoints.pv) || (tpValue > 0 && tpValue > currentPoints.tp)) {
        alert('Deduction amount exceeds available points');
        return;
      }
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const endpoint = pointsType === 'add' 
        ? `${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/add-points`
        : `${process.env.NEXT_PUBLIC_BACKEND}/api/admin/wallet/deduct-points`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          pvAmount: pvValue,
          tpAmount: tpValue,
          pointsType: pointsCategory,
          pointsPeriod: pointsPeriod,
          description: description || `Admin ${pointsType === 'add' ? 'added' : 'deducted'} ${pointsCategory.toLowerCase()} ${pointsPeriod.toLowerCase()} points`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(`Points ${pointsType === 'add' ? 'added' : 'deducted'} successfully!`);
          setSelectedUser({
            ...selectedUser,
            pv: data.newPV,
            tp: data.newTP
          });
          setTpAmount('');
          setPvAmount('');
          setDescription('');
          await fetchUserPoints(selectedUser.id);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || `Error ${pointsType === 'add' ? 'adding' : 'deducting'} points`);
      }
    } catch (error) {
      console.error('Points update error:', error);
      alert(`Error ${pointsType === 'add' ? 'adding' : 'deducting'} points`);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPoints = () => {
    const points = userPoints.find(p => p.type === pointsCategory && p.period === pointsPeriod);
    return points ? { pv: points.pv, tp: points.tp } : { pv: 0, tp: 0 };
  };

  const getTotalPoints = (type: 'PERSONAL' | 'TEAM', period: 'MONTHLY' | 'CUMULATIVE') => {
    const points = userPoints.find(p => p.type === type && p.period === period);
    return points ? { pv: points.pv, tp: points.tp } : { pv: 0, tp: 0 };
  };

  const personalMonthly = getTotalPoints('PERSONAL', 'MONTHLY');
  const personalCumulative = getTotalPoints('PERSONAL', 'CUMULATIVE');
  const teamMonthly = getTotalPoints('TEAM', 'MONTHLY');
  const teamCumulative = getTotalPoints('TEAM', 'CUMULATIVE');

  const allUsers = searchTerm ? filteredUsers : users;

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
                  Points Management
                </h1>
                <p className="text-gray-600">Manage TP and PV points for users</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {pointsType === 'add' ? 'Add Points' : 'Deduct Points'}
              </h2>

              <form onSubmit={handlePointsUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPointsType('add')}
                      className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                        pointsType === 'add'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Plus className="w-5 h-5 mx-auto mb-1" />
                      Add Points
                    </button>
                    <button
                      type="button"
                      onClick={() => setPointsType('deduct')}
                      className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                        pointsType === 'deduct'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Minus className="w-5 h-5 mx-auto mb-1" />
                      Deduct Points
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPointsCategory('PERSONAL')}
                      className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                        pointsCategory === 'PERSONAL'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Target className="w-5 h-5 mx-auto mb-1" />
                      Personal
                    </button>
                    <button
                      type="button"
                      onClick={() => setPointsCategory('TEAM')}
                      className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                        pointsCategory === 'TEAM'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <UsersIcon className="w-5 h-5 mx-auto mb-1" />
                      Team
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points Period
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPointsPeriod('MONTHLY')}
                      className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                        pointsPeriod === 'MONTHLY'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Calendar className="w-5 h-5 mx-auto mb-1" />
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setPointsPeriod('CUMULATIVE')}
                      className={`p-3 border rounded-lg text-center transition-all duration-200 ${
                        pointsPeriod === 'CUMULATIVE'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <Zap className="w-5 h-5 mx-auto mb-1" />
                      Cumulative
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <div className="relative">
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

                  {selectedUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-900">Selected: {selectedUser.fullName}</p>
                          <p className="text-sm text-green-700">
                            Current {pointsCategory} {pointsPeriod}: PV: {getCurrentPoints().pv} | TP: {getCurrentPoints().tp}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(null);
                            setSearchTerm('');
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TP Points
                  </label>
                  <input
                    type="number"
                    value={tpAmount}
                    onChange={(e) => setTpAmount(e.target.value)}
                    placeholder="Enter TP points"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PV Points
                  </label>
                  <input
                    type="number"
                    value={pvAmount}
                    onChange={(e) => setPvAmount(e.target.value)}
                    placeholder="Enter PV points"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Enter points update description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !selectedUser}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                    pointsType === 'add'
                      ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                      : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                  }`}
                >
                  {isLoading ? 'Processing...' : pointsType === 'add' ? 'Add Points' : 'Deduct Points'}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedUser ? `${selectedUser.fullName}'s Points` : 'Users Points'}
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              {selectedUser && userPoints.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-blue-900 mb-2">Personal Monthly</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-blue-900">{personalMonthly.pv}</span>
                        <span className="text-sm text-blue-700">PV</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-blue-900">{personalMonthly.tp}</span>
                        <span className="text-sm text-blue-700">TP</span>
                      </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-purple-900 mb-2">Personal Cumulative</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-purple-900">{personalCumulative.pv}</span>
                        <span className="text-sm text-purple-700">PV</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-purple-900">{personalCumulative.tp}</span>
                        <span className="text-sm text-purple-700">TP</span>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-green-900 mb-2">Team Monthly</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-green-900">{teamMonthly.pv}</span>
                        <span className="text-sm text-green-700">PV</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-900">{teamMonthly.tp}</span>
                        <span className="text-sm text-green-700">TP</span>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-orange-900 mb-2">Team Cumulative</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-orange-900">{teamCumulative.pv}</span>
                        <span className="text-sm text-orange-700">PV</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-orange-900">{teamCumulative.tp}</span>
                        <span className="text-sm text-orange-700">TP</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-gray-900 mb-3">Points History</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {userPoints.map((point, index) => (
                        <div key={point.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-sm font-medium ${
                              point.type === 'PERSONAL' ? 'text-blue-600' : 'text-green-600'
                            }`}>
                              {point.type} {point.period}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(point.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>PV: {point.pv}</span>
                            <span>TP: {point.tp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {allUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.fullName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          {user.membershipPackage}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-blue-600">{user.tp}</p>
                          <p className="text-xs text-blue-600">TP Points</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <TrendingDown className="w-6 h-6 text-green-600 mx-auto mb-1" />
                          <p className="text-lg font-bold text-green-600">{user.pv}</p>
                          <p className="text-xs text-green-600">PV Points</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {allUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No users found</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPointsPage;