'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, UserX, ChevronDown, ChevronRight, DollarSign, Calendar,
  TrendingUp, Award, Zap, Package, Shield, Network, Activity, 
  Target, Star, ArrowUpRight, User, RefreshCw, Sparkles
} from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  joinDate: string;
  status: string;
  earnings: string;
  username: string;
  membershipPackage: string;
  pv: number;
  tp: number;
  totalEarnings: number;
  walletBalance: number;
}

interface TeamLevel {
  level: number;
  members: TeamMember[];
}

interface TeamData {
  totalMembers: number;
  activeMembers: number;
  totalEarnings: string;
  network: TeamLevel[];
}

const TeamsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('my teams');
  const [expandedLevels, setExpandedLevels] = useState<number[]>([1]);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, accountType, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { currency, convertAmount, formatAmount, exchangeRate } = useCurrency();

  const processEarningsAmount = (earnings: string): string => {
    if (currency === 'NGN') {
      return earnings;
    } else {
      const nairaMatch = earnings.match(/₦([\d,]+(\.\d{2})?)/);
      if (nairaMatch) {
        const nairaAmount = parseFloat(nairaMatch[1].replace(/,/g, ''));
        const usdAmount = nairaAmount / exchangeRate;
        return `$${usdAmount.toFixed(2)}`;
      }
      return earnings;
    }
  };

  const processTotalEarnings = (totalEarnings: string): string => {
    if (currency === 'NGN') {
      return totalEarnings;
    } else {
      const nairaMatch = totalEarnings.match(/₦([\d,]+(\.\d{2})?)/);
      if (nairaMatch) {
        const nairaAmount = parseFloat(nairaMatch[1].replace(/,/g, ''));
        const usdAmount = nairaAmount / exchangeRate;
        return `$${usdAmount.toFixed(2)}`;
      }
      return totalEarnings;
    }
  };

  const calculateLevelEarnings = (members: TeamMember[]): string => {
    const totalNaira = members.reduce((sum, member) => {
      const earningsValue = parseFloat(member.earnings.replace('₦', '').replace(/,/g, '')) || 0;
      return sum + earningsValue;
    }, 0);
    
    if (currency === 'NGN') {
      return `₦${totalNaira.toLocaleString()}`;
    } else {
      const usdAmount = totalNaira / exchangeRate;
      return `$${usdAmount.toFixed(2)}`;
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || accountType !== 'user') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, accountType, authLoading, router]);

  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/teams/my-teams-enhanced`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }

      const data = await response.json();
      
      if (data.success) {
        setTeamData(data.teamData);
      } else {
        throw new Error(data.error || 'Failed to load team data');
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPaginatedTeamData = async (level: number, page: number = 1, limit: number = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/teams/my-teams-paginated?level=${level}&page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch team data');
      }

      const data = await response.json();
      
      if (data.success) {
        const levelData = {
          level: level,
          members: data.teamData.members
        };
        
        if (teamData) {
          const updatedNetwork = [...teamData.network];
          const existingLevelIndex = updatedNetwork.findIndex(l => l.level === level);
          
          if (existingLevelIndex >= 0) {
            updatedNetwork[existingLevelIndex] = levelData;
          } else {
            updatedNetwork.push(levelData);
          }
          
          setTeamData({
            ...teamData,
            network: updatedNetwork
          });
        } else {
          setTeamData({
            totalMembers: data.teamData.pagination.totalMembers,
            activeMembers: data.teamData.members.filter((m: TeamMember) => m.status === 'Active').length,
            totalEarnings: calculateLevelEarnings(data.teamData.members),
            network: [levelData]
          });
        }
      } else {
        throw new Error(data.error || 'Failed to load team data');
      }
    } catch (error) {
      console.error('Error fetching paginated team data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const toggleLevel = async (level: number) => {
    if (expandedLevels.includes(level)) {
      setExpandedLevels(prev => prev.filter(l => l !== level));
    } else {
      setExpandedLevels(prev => [...prev, level]);
      
      const levelData = teamData?.network?.find(l => l.level === level);
      if (!levelData || levelData.members.length === 0) {
        await fetchPaginatedTeamData(level);
      }
    }
  };

  if (isLoading && !teamData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
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
          <main className="flex-1 w-full lg:ml-64 p-4 lg:p-8">
            <div className="animate-pulse space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-36"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-32"></div>
                ))}
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 h-96"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error && !teamData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
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
          <main className="flex-1 w-full lg:ml-64 p-4 lg:p-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 max-w-md w-full text-center"
              >
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserX className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchTeamData}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Again
                </motion.button>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const inactiveMembers = (teamData?.totalMembers || 0) - (teamData?.activeMembers || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
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

        <main className="flex-1 w-full lg:ml-64 p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-700 to-rose-800 rounded-3xl shadow-xl border border-orange-400/20 p-6 lg:p-8 mb-6"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <Network className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    My Team Network
                  </h1>
                  <p className="text-orange-100 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Build, manage and grow your network
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Team Members
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {teamData?.totalMembers || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Activity className="w-4 h-4" />
                <span>All network levels</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Active Members
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {teamData?.activeMembers || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>Earning commissions</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <UserX className="w-4 h-4" />
                    Inactive Members
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {inactiveMembers}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <UserX className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <Target className="w-4 h-4" />
                <span>Pending activation</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Team Earnings
                  </p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    {teamData?.totalEarnings ? processTotalEarnings(teamData.totalEarnings) : currency === 'NGN' ? '₦0' : '$0'}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-rose-600">
                <Award className="w-4 h-4" />
                <span>Total accumulated</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Team Network Levels</h2>
                  <p className="text-sm text-gray-500">
                    {teamData?.network?.length || 0} levels • {teamData?.totalMembers || 0} members
                  </p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchTeamData}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            </div>
            
            <div className="space-y-4">
              {teamData?.network && teamData.network.length > 0 ? (
                teamData.network.map((levelData, index) => (
                  <motion.div
                    key={levelData.level}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-orange-300 transition-colors"
                  >
                    <button
                      onClick={() => toggleLevel(levelData.level)}
                      className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-red-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{ rotate: expandedLevels.includes(levelData.level) ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                        >
                          <ChevronRight className="w-5 h-5 text-orange-600" />
                        </motion.div>
                        <div className="text-left">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-900">Level {levelData.level}</span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                              {levelData.members.length} {levelData.members.length === 1 ? 'member' : 'members'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Total Earnings: <span className="font-semibold text-green-600">{calculateLevelEarnings(levelData.members)}</span>
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </button>

                    <AnimatePresence>
                      {expandedLevels.includes(levelData.level) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 bg-white border-t-2 border-gray-100">
                            {levelData.members.length > 0 ? (
                              <div className="grid grid-cols-1 gap-4">
                                {levelData.members.map((member, memberIndex) => (
                                  <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: memberIndex * 0.05 }}
                                    className="group flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-red-50 rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-all duration-200"
                                  >
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                      <span className="text-white font-bold text-lg">
                                        {member.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-gray-900 truncate">{member.name}</h3>
                                        <span
                                          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                                            member.status === 'Active'
                                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                              : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                                          }`}
                                        >
                                          {member.status === 'Active' ? (
                                            <UserCheck className="w-3 h-3" />
                                          ) : (
                                            <UserX className="w-3 h-3" />
                                          )}
                                          {member.status}
                                        </span>
                                      </div>
                                      
                                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                          <User className="w-3.5 h-3.5" />
                                          <span className="text-xs">@{member.username}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-3.5 h-3.5" />
                                          <span className="text-xs">{member.joinDate}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Package className="w-3.5 h-3.5" />
                                          <span className="text-xs font-semibold">{member.membershipPackage}</span>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-2 mt-3">
                                        <div className="bg-white rounded-lg px-3 py-2 border border-orange-200">
                                          <div className="flex items-center gap-1 mb-1">
                                            <TrendingUp className="w-3 h-3 text-orange-600" />
                                            <span className="text-xs text-gray-600">PV</span>
                                          </div>
                                          <span className="text-sm font-bold text-gray-900">{member.pv}</span>
                                        </div>
                                        <div className="bg-white rounded-lg px-3 py-2 border border-amber-200">
                                          <div className="flex items-center gap-1 mb-1">
                                            <Zap className="w-3 h-3 text-amber-600" />
                                            <span className="text-xs text-gray-600">TP</span>
                                          </div>
                                          <span className="text-sm font-bold text-gray-900">{member.tp}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                      <p className="text-xs text-gray-500 mb-1">Earnings</p>
                                      <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        {processEarningsAmount(member.earnings)}
                                      </p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Users className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium">No members at this level yet</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 rounded-full"></div>
                    <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                      <Users className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Team Members Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start building your team by referring new members!
                  </p>
                  <a
                    href="/referrals"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 font-bold"
                  >
                    <Sparkles className="w-5 h-5" />
                    Share Referral Link
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TeamsPage;