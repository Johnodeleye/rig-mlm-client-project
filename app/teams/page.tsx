// app/teams/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, ChevronDown, ChevronRight, DollarSign, Calendar } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';

const TeamsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('my teams');
  const [expandedLevels, setExpandedLevels] = useState<number[]>([1]);

  const teamData = {
    totalMembers: 25,
    activeMembers: 18,
    totalEarnings: '₦89,450'
  };

  const teamLevels = [
    {
      level: 1,
      members: [
        { id: 1, name: 'Sarah Johnson', joinDate: '2024-01-15', status: 'Active', earnings: '₦1,200' },
        { id: 2, name: 'Mike Chen', joinDate: '2024-01-14', status: 'Active', earnings: '₦500' },
        { id: 3, name: 'Emily Davis', joinDate: '2024-01-10', status: 'Inactive', earnings: '₦0' }
      ]
    },
    {
      level: 2,
      members: [
        { id: 4, name: 'Alex Rodriguez', joinDate: '2024-01-08', status: 'Active', earnings: '₦250' },
        { id: 5, name: 'Jessica Brown', joinDate: '2024-01-05', status: 'Active', earnings: '₦125' }
      ]
    },
    {
      level: 3,
      members: [
        { id: 6, name: 'David Wilson', joinDate: '2024-01-03', status: 'Active', earnings: '₦75' }
      ]
    },
    {
      level: 4,
      members: []
    },
    {
      level: 5,
      members: []
    }
  ];

  const toggleLevel = (level: number) => {
    setExpandedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
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
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{teamData.totalMembers}</p>
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
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{teamData.activeMembers}</p>
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
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">{teamData.totalEarnings}</p>
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
              {teamLevels.map((levelData, index) => (
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
                      Total Earnings: ₦{levelData.members.reduce((sum, member) => sum + parseInt(member.earnings.replace('₦', '').replace(',', '')), 0).toLocaleString()}
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
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default TeamsPage;