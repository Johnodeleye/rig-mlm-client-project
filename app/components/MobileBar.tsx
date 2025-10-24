// app/components/MobileBar.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, DollarSign, CreditCard, TrendingUp, 
  Package, MessageCircle, Settings, LogOut, X,
  User, Shield, Bell, PersonStanding, Send, Wallet
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
    { id: 'earnings', label: 'Wallet', icon: Wallet, href: '/wallet' },
    { id: 'send', label: 'Send Money', icon: Send, href: '/send' },
    { id: 'withdraw', label: 'Withdraw', icon: CreditCard, href: '/withdraw' },
    { id: 'products', label: 'Products', icon: Package, href: '/products' },
    { id: 'upgrade', label: 'Upgrade', icon: TrendingUp, href: '/upgrade' },
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
            className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="lg:hidden fixed left-0 top-0 h-full w-64 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Compact Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#0660D3] to-blue-600 rounded-lg flex items-center justify-center">
                  <Image 
                    src="/logo.png" 
                    alt="RIG" 
                    width={24} 
                    height={24}
                    className="object-contain brightness-0 invert"
                  />
                </div>
                <span className="font-bold text-gray-900 text-sm">RIG Global</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

{/* Compact User nfo */}
<div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
  <div className="flex items-center gap-3">
    {userProfile?.profilePicture ? (
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-md">
        <img 
          src={userProfile.profilePicture} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div className="w-10 h-10 bg-gradient-to-br from-[#0660D3] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
        <User className="w-5 h-5 text-white" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <h4 className="font-semibold text-gray-900 text-sm truncate">
        {userProfile?.name || user?.username || 'Loading...'}
      </h4>
      <div className="flex items-center gap-1 mt-0.5">
        <Shield className="w-3 h-3 text-blue-600" />
        <p className="text-xs text-gray-600">
          {userProfile?.plan || 'Basic'} Plan
        </p>
      </div>
    </div>
  </div>
  
  {/* Compact Stats */}
  <div className="flex items-center gap-2 mt-2">
    <div className="flex-1 bg-white/70 backdrop-blur px-2 py-1 rounded-md border border-blue-100">
      <span className="text-[10px] text-gray-500 block">PV</span>
      <span className="text-xs font-bold text-gray-900">{userProfile?.pv || 0}</span>
    </div>
    <div className="flex-1 bg-white/70 backdrop-blur px-2 py-1 rounded-md border border-green-100">
      <span className="text-[10px] text-gray-500 block">TP</span>
      <span className="text-xs font-bold text-gray-900">{userProfile?.tp || 0}</span>
    </div>
  </div>
</div>

            {/* Compact Navigation Menu */}
            <nav className="flex-1 px-3 py-2 overflow-y-auto">
              <ul className="space-y-0.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  
                  return (
                    <li key={item.id}>
                      <a href={item.href}>
                        <button
                          onClick={() => handleMenuClick(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                            isActive
                              ? 'bg-gradient-to-r from-[#0660D3] to-blue-600 text-white shadow-md'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`p-1 rounded-md ${
                            isActive 
                              ? 'bg-white/20' 
                              : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}>
                            <Icon className={`w-4 h-4 flex-shrink-0 ${
                              isActive ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <span className={`text-sm ${
                            isActive ? 'font-semibold' : 'font-medium'
                          }`}>
                            {item.label}
                          </span>
                        </button>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Compact Logout Button */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
              >
                <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;