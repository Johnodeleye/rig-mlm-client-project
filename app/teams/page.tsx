// app/teams/page.tsx (updated)
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, ChevronDown, ChevronRight, DollarSign, Calendar } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import { useAuth } from '@/context/AuthContext';

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

    useEffect(() => {
      if (!authLoading) {
        if (!isAuthenticated || accountType !== 'user') {
          router.push('/login');
        }
      }
    }, [isAuthenticated, accountType, authLoading, router]);

  // Fetch team data
  useEffect(() => {
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

    fetchTeamData();
  }, []);

  const toggleLevel = (level: number) => {
    setExpandedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  if (isLoading) {
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
          <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
            <div className="animate-pulse space-y-6">
              {/* Header Skeleton */}
              <div className="bg-white rounded-xl p-6 h-32"></div>
              
              {/* Summary Cards Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 h-24"></div>
                ))}
              </div>
              
              {/* Team Levels Skeleton */}
              <div className="bg-white rounded-xl p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg mb-3 p-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
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
          <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <UserX className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Team Data</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#0660D3] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
              My Teams
            </h1>
            <p className="text-gray-600">View and manage your network team</p>
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
                  <p className="text-sm text-gray-600 mb-1">Total Team Members</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {teamData?.totalMembers || 0}
                  </p>
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
                  <p className="text-sm text-gray-600 mb-1">Active Members</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {teamData?.activeMembers || 0}
                  </p>
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
                  <p className="text-sm text-gray-600 mb-1">Total Team Earnings</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {teamData?.totalEarnings || '₦0'}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Team Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Network</h2>
            
            <div className="space-y-3">
              {teamData?.network && teamData.network.length > 0 ? (
                teamData.network.map((levelData) => (
                  <div key={levelData.level} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleLevel(levelData.level)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {expandedLevels.includes(levelData.level) ? (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-600" />
                        )}
                        <span className="font-semibold text-gray-900">Level {levelData.level}</span>
                        <span className="text-sm text-gray-500">({levelData.members.length} members)</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Earnings: ₦{levelData.members.reduce((sum, member) => {
                          const earningsValue = parseFloat(member.earnings.replace('₦', '').replace(/,/g, '')) || 0;
                          return sum + earningsValue;
                        }, 0).toLocaleString()}
                      </div>
                    </button>

                    {expandedLevels.includes(levelData.level) && (
                      <div className="p-4 border-t border-gray-200">
                        {levelData.members.length > 0 ? (
                          <div className="space-y-3">
                            {levelData.members.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{member.name}</p>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {member.joinDate}
                                    </div>
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        member.status === 'Active'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {member.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Package: {member.membershipPackage}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">{member.earnings}</p>
                                  <p className="text-xs text-gray-500">Earnings</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            No members at this level
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No team members found</p>
                  <p className="text-sm">Start building your team by referring new members!</p>
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