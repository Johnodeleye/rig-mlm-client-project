import { AnimatePresence, motion } from "framer-motion"
import { 
  Home, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Shield,
  Wallet,
  Download,
  User,
  X,
  ShoppingCart,
  Gift,
  BarChart3,
  LogOut,
  Bell,
  Store,
  FileText,
  UserPlus
} from "lucide-react"
import { useAuth } from "@/context/AuthContext";

interface AdminMobileSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const AdminMobileSidebar = ({ isSidebarOpen, setIsSidebarOpen, activeMenu, setActiveMenu }: AdminMobileSidebarProps) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: Users, href: '/admin/users' },
    { id: 'admins', label: 'Register New Admin', icon: UserPlus, href: '/admin/admins' },
    { id: 'products', label: 'Products', icon: Package, href: '/admin/products' },
    { id: 'packages', label: 'Packages', icon: Gift, href: '/admin/packages' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, href: '/admin/wallet' },
    { id: 'points', label: 'Points', icon: Wallet, href: '/admin/points' },
    { id: 'withdrawals', label: 'Withdrawals', icon: BarChart3, href: '/admin/withdrawals' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/admin/notifications' },
    { id: 'stockists', label: 'Stockists', icon: Store, href: '/admin/stockists' },
    { id: 'stockist-reports', label: 'Stockist Reports', icon: FileText, href: '/admin/stockists/reports' },
    { id: 'rates', label: 'Rates', icon: DollarSign, href: '/admin/rates' }
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-transparent backdrop-blur-md bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ type: 'spring', damping: 10 }}
            className="fixed left-0 top-0 h-full w-[85vw] max-w-xs bg-white z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900 truncate">RIG Global Admin</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-red-600 hover:text-red-700 transition-colors bg-red-50 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{user?.username || 'Admin'}</p>
                  <p className="text-sm text-gray-500">Super Admin</p>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    href={item.href}
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeMenu === item.id
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium truncate">Logout</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default AdminMobileSidebar