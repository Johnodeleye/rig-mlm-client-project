'use client';

import { 
  Home, Users, DollarSign, CreditCard, TrendingUp, 
  Package, MessageCircle, Settings, LogOut, 
  PersonStanding, Bell, User, Store, ShoppingCart,
  Package2,
  Clock10
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useEffect } from 'react';

interface DesktopSidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const DesktopSidebar = ({ activeMenu, setActiveMenu }: DesktopSidebarProps) => {
  const { userProfile, logout } = useAuth();

  // useEffect(() => {
  //   console.log('DesktopSidebar - userProfile:', userProfile);
  //   console.log('DesktopSidebar - isStockist:', userProfile?.isStockist);
  // }, [userProfile]);

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
   
    menuItems.push({
      id: 'orders',
      label: 'See Orders',
      icon: ShoppingCart,
      href: '/stockist/orders'
    });
    menuItems.push({
      id: 'inventory',
      label: 'Inventory',
      icon: Package2,
      href: '/stockist/inventory'
    });
    menuItems.push({
      id: 'requests',
      label: 'Requests',
      icon: Clock10,
      href: '/stockist/requests'
    });
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
    <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex-col z-30 pt-16">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-lg">RIG GLOBAL</h2>
            <p className="text-xs text-gray-500">Business Platform</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold text-gray-900 truncate">
            {userProfile?.name || 'Loading...'}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {userProfile?.plan ? `${userProfile.plan} Plan` : 'Loading Plan'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              PV: {userProfile?.pv || 0}
            </span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              TP: {userProfile?.tp || 0}
            </span>
          </div>
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded ${
              userProfile?.isStockist 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {userProfile?.isStockist ? 'Stockist' : 'Member'}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <li key={item.id}>
                <a href={item.href}>
                  <button
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-[#0660D3] text-white shadow-sm transform scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-sm"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DesktopSidebar;