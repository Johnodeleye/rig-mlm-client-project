// app/components/Header.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  setIsSidebarOpen: (open: boolean) => void;
  isProfileDropdownOpen: boolean;
  setIsProfileDropdownOpen: (open: boolean) => void;
}

const Header = ({ 
  setIsSidebarOpen, 
  isProfileDropdownOpen, 
  setIsProfileDropdownOpen 
}: HeaderProps) => {
  const { userProfile, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold text-gray-900">RIG GLOBAL</h1>
          </div>
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        </div>

        <div className="hidden lg:block flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {userProfile?.profilePicture ? (
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  <img 
                    src={userProfile.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-[#0660D3] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {userProfile?.name || 'Loading...'}
                </p>
                <p className="text-xs text-gray-500">
                  {userProfile?.plan || 'Plan'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                    PV: {userProfile?.pv || 0}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-1 rounded">
                    TP: {userProfile?.tp || 0}
                  </span>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 lg:w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      {userProfile?.profilePicture ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                          <img 
                            src={userProfile.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-[#0660D3] rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {userProfile?.name || 'Loading...'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {userProfile?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        PV: {userProfile?.pv || 0}
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        TP: {userProfile?.tp || 0}
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;