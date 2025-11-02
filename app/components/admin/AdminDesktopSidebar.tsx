'use client';

import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  BarChart3, 
  Settings, 
  LogOut,
  Gift,
  Bell,
  Store,
  FileText,
  DollarSign,
  UserPlus
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AdminDesktopSidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const AdminDesktopSidebar = ({ activeMenu, setActiveMenu }: AdminDesktopSidebarProps) => {
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/admin/home' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'admins', label: 'Register New Admin', icon: UserPlus, path: '/admin/admins' },
    { id: 'products', label: 'Products', icon: Package, path: '/admin/products' },
    { id: 'packages', label: 'Packages', icon: Gift, path: '/admin/packages' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, path: '/admin/wallet' },
    { id: 'points', label: 'Points', icon: Wallet, path: '/admin/points' },
    { id: 'withdrawals', label: 'Withdrawals', icon: BarChart3, path: '/admin/withdrawals' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { id: 'stockists', label: 'Stockists', icon: Store, path: '/admin/stockists' },
    { id: 'stockist-reports', label: 'Stockist Reports', icon: FileText, path: '/admin/stockists/reports' },
    { id: 'rates', label: 'Rates', icon: DollarSign, path: '/admin/rates' }
  ];

  const handleMenuClick = (menuId: string, path: string) => {
    setActiveMenu(menuId);
    router.push(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed left-0 top-16 h-[calc(100vh-4rem)] z-30">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleMenuClick(item.id, item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                {item.label}
              </motion.button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-gray-400" />
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default AdminDesktopSidebar;