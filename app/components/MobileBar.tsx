// app/components/MobileBar.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, DollarSign, CreditCard, TrendingUp, 
  Package, MessageCircle, Settings, LogOut, X,
  User, Shield, Bell, PersonStanding
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface MobileSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const MobileSidebar = ({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  activeMenu, 
  setActiveMenu 
}: MobileSidebarProps) => {
  const { user, userProfile, logout, accountType } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/home' },
    { id: 'referrals', label: 'My Referrals', icon: Users, href: '/referrals' },
    { id: 'my teams', label: 'My Teams', icon: PersonStanding, href: '/teams' },
    { id: 'earnings', label: 'Earnings & Wallet', icon: DollarSign, href: '/wallet' },
    { id: 'products', label: 'Products', icon: Package, href: '/products' },
    { id: 'upgrade', label: 'Upgrade Plan', icon: TrendingUp, href: '/upgrade' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
  ];

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false);
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header with Logo */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/logo.png" 
                    alt="RIG Global Logo" 
                    width={48} 
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">RIG Global</h3>
                  <p className="text-sm text-gray-500">MLM Platform</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0660D3] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate text-base">
                    {userProfile?.name || user?.username || 'Loading...'}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500 truncate">
                      {userProfile?.plan ? `${userProfile.plan} Plan` : 'Loading Plan'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-medium">
                      PV: {userProfile?.pv || 0}
                    </span>
                    <span className="text-sm bg-green-100 text-green-800 px-3 py-1.5 rounded-lg font-medium">
                      TP: {userProfile?.tp || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-6 overflow-y-auto">
              <ul className="space-y-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  
                  return (
                    <li key={item.id}>
                      <a href={item.href}>
                        <button
                          onClick={() => handleMenuClick(item.id)}
                          className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                            isActive
                              ? 'bg-[#0660D3] text-white shadow-lg shadow-blue-100'
                              : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                          }`}
                        >
                          <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                          <span className="font-semibold text-base">{item.label}</span>
                        </button>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
              >
                <LogOut className="w-6 h-6 flex-shrink-0" />
                <span className="font-semibold text-base">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;