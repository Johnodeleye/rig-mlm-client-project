'use client';

import {
  Home, Users, DollarSign, CreditCard, TrendingUp,
  Package, MessageCircle, Settings, LogOut,
  PersonStanding, Bell, User, Store, ShoppingCart,
  Package2, Clock10, ChevronRight, Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface DesktopSidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const DesktopSidebar = ({ activeMenu, setActiveMenu }: DesktopSidebarProps) => {
  const { userProfile, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/home' },
    { id: 'referrals', label: 'My Referrals', icon: Users, href: '/referrals' },
    { id: 'my teams', label: 'My Teams', icon: PersonStanding, href: '/teams' },
    { id: 'earnings', label: 'Earnings & Wallet', icon: DollarSign, href: '/wallet' },
    { id: 'send', label: 'Send Money', icon: DollarSign, href: '/send' },
    { id: 'withdraw', label: 'Withdraw', icon: CreditCard, href: '/withdraw' },
    { id: 'products', label: 'Products', icon: Package, href: '/products' },
    { id: 'upgrade', label: 'Upgrade Plan', icon: TrendingUp, href: '/upgrade' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
    { id: 'claim-products', label: 'Claim Products', icon: Package, href: '/products/claim' }
  ];

  if (userProfile?.isStockist === true) {
    menuItems.push(
      { id: 'orders', label: 'See Orders', icon: ShoppingCart, href: '/stockist/orders' },
      { id: 'inventory', label: 'Inventory', icon: Package2, href: '/stockist/inventory' },
      { id: 'requests', label: 'Requests', icon: Clock10, href: '/stockist/requests' }
    );
  } else {
    menuItems.push({
      id: 'become-stockist',
      label: 'Become a Stockist',
      icon: Store,
      href: '/become-stockist'
    });
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="hidden lg:flex fixed left-0 top-0 h-full w-68 bg-white shadow-xl border-r border-gray-200 flex-col z-30 pt-16">
      {/* Profile Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 m-4 mt-6 rounded-2xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                width={28} 
                height={28} 
                className="rounded-lg object-contain brightness-0 invert" 
              />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">RIG GLOBAL</h2>
              <p className="text-xs text-blue-100">Business Platform</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <h3 className="font-bold text-white truncate text-base mb-1">
              {userProfile?.name || 'Loading...'}
            </h3>
            <p className="text-sm text-blue-100 truncate mb-3">
              {userProfile?.plan ? `${userProfile.plan} Plan` : 'Loading Plan'}
            </p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                <p className="text-xs text-blue-100">PV</p>
                <p className="text-sm font-bold text-white">{userProfile?.pv || 0}</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                <p className="text-xs text-blue-100">TP</p>
                <p className="text-sm font-bold text-white">{userProfile?.tp || 0}</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold ${
              userProfile?.isStockist 
                ? 'bg-purple-500/20 text-purple-100 border border-purple-400/30' 
                : 'bg-white/20 text-white border border-white/30'
            }`}>
              <Award className="w-3.5 h-3.5" />
              {userProfile?.isStockist ? 'Stockist Member' : 'Member'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <li key={item.id}>
                <a href={item.href}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="w-5 h-5 text-white" />
                    )}
                  </button>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t-2 border-gray-100 bg-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-semibold group hover:shadow-md"
        >
          <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DesktopSidebar;