'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, LogOut, Menu, Search, ChevronDown } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 z-40">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="w-10 h-10 object-contain" 
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                RIG GLOBAL
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Business Platform</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions, notifications..."
              className="w-full pl-12 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 hover:bg-white text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <a 
            href='/notifications' 
            className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
          >
            <Bell className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          </a>

          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
            >
              <div className="relative">
                {userProfile?.profilePicture ? (
                  <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-orange-500 transition-colors">
                    <img 
                      src={userProfile.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center border-2 border-gray-200 group-hover:border-orange-500 transition-colors">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="hidden lg:block text-left">
                <p className="text-sm font-bold text-gray-900">
                  {userProfile?.name || 'Loading...'}
                </p>
                <p className="text-xs text-gray-500 -mt-0.5">
                  {userProfile?.plan || 'Plan'}
                </p>
              </div>
              
              <ChevronDown className={`hidden lg:block w-4 h-4 text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  >
                    <div className="p-4 bg-gradient-to-r from-orange-600 to-red-600">
                      <div className="flex items-center gap-3 mb-3">
                        {userProfile?.profilePicture ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/50">
                            <img 
                              src={userProfile.profilePicture} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/50">
                            <User className="w-7 h-7 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">
                            {userProfile?.name || 'Loading...'}
                          </p>
                          <p className="text-xs text-orange-100 truncate">
                            {userProfile?.email || 'user@example.com'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                          <p className="text-xs text-orange-100">PV</p>
                          <p className="text-sm font-bold text-white">{userProfile?.pv || 0}</p>
                        </div>
                        <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                          <p className="text-xs text-orange-100">TP</p>
                          <p className="text-sm font-bold text-white">{userProfile?.tp || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <a 
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                          <User className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="font-medium">My Profile</span>
                      </a>
                      
                      <a 
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-medium">Settings</span>
                      </a>
                      
                      <div className="my-2 border-t border-gray-100"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;