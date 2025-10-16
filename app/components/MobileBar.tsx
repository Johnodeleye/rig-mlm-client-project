import { AnimatePresence, motion } from "framer-motion"
import { Home, Users, DollarSign, CreditCard, TrendingUp, Bell, Settings, LogOut, Package, PersonStanding, Shield, User, X } from "lucide-react"
import { useState } from "react";

interface MobileSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const MobileSidebar = ({ isSidebarOpen, setIsSidebarOpen, activeMenu, setActiveMenu }: MobileSidebarProps) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const menuItems = [
    { id: 'dashboard', label: 'Home', icon: Home, href: '/home' },
    { id: 'referrals', label: 'My Referrals', icon: Users, href: '/referrals' },
    { id: 'my teams', label: 'My Teams', icon: PersonStanding, href: '/teams' },
    { id: 'earnings', label: 'Earnings & Wallet', icon: DollarSign, href: '/wallet' },
    { id: 'products', label: 'Products', icon: Package, href: '/products' },
    { id: 'upgrade', label: 'Upgrade Plan', icon: TrendingUp, href: '/upgrade' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];
  
  const userData = {
    name: 'John Ayomide',
    username: '@johnayomide',
    plan: 'Beginner Plan',
    pv: 5,
    status: 'Active',
    totalEarnings: '₦45,670',
    availableBalance: '₦23,450',
    totalReferrals: 15,
    referralLink: 'https://rigglobal.com/ref/johnayomide'
  };

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'logout') {
      // Handle logout logic here
      console.log('Logging out...');
      // Add your logout logic
    } else {
      setActiveMenu(menuId);
    }
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
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 10 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
  <div className="w-8 h-8 bg-[#065fd340] rounded-lg flex items-center justify-center">
           <img src="/logo.png" alt="" width={500} height={200}/>
          </div>
                  <span className="text-xl font-bold text-gray-900">RIG Global</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 text-red-600 hover:text-[#0660D3] transition-colors bg-blue-600/30 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-[#0660D3] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{userData.name}</p>
                  <p className="text-sm text-gray-500">{userData.plan}</p>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                  href={item.href}
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeMenu === item.id && item.id !== 'logout'
                        ? 'bg-[#0660D3] text-white'
                        : item.id === 'logout' 
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar