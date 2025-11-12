'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, DollarSign, CreditCard, TrendingUp, 
  Package, MessageCircle, Settings, LogOut, X,
  User, Shield, Bell, PersonStanding, Send, Wallet, Store, ShoppingCart,
  Package2, Clock10, ChevronRight, Award, Sparkles, ArrowRight
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
  const { user, userProfile, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/home', color: 'from-orange-500 to-orange-600' },
    { id: 'referrals', label: 'My Referrals', icon: Users, href: '/referrals', color: 'from-red-500 to-red-600' },
    { id: 'my teams', label: 'My Teams', icon: PersonStanding, href: '/teams', color: 'from-rose-500 to-rose-600' },
    { id: 'earnings', label: 'Wallet', icon: Wallet, href: '/wallet', color: 'from-emerald-500 to-emerald-600' },
    { id: 'send', label: 'Send Money', icon: Send, href: '/send', color: 'from-cyan-500 to-cyan-600' },
    { id: 'withdraw', label: 'Withdraw', icon: CreditCard, href: '/withdraw', color: 'from-amber-500 to-amber-600' },
    { id: 'products', label: 'Products', icon: Package, href: '/products', color: 'from-pink-500 to-pink-600' },
    { id: 'upgrade', label: 'Upgrade', icon: TrendingUp, href: '/upgrade', color: 'from-yellow-500 to-yellow-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications', color: 'from-red-500 to-red-600' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile', color: 'from-gray-500 to-gray-600' },
    { id: 'claim-products', label: 'Claim Products', icon: Package, href: '/products/claim', color: 'from-teal-500 to-teal-600' }
  ];

  if (userProfile?.isStockist === true) {
    menuItems.push(
      { id: 'orders', label: 'See Orders', icon: ShoppingCart, href: '/stockist/orders', color: 'from-violet-500 to-violet-600' },
      { id: 'inventory', label: 'Inventory', icon: Package2, href: '/stockist/inventory', color: 'from-emerald-500 to-emerald-600' },
      { id: 'requests', label: 'Requests', icon: Clock10, href: '/stockist/requests', color: 'from-amber-500 to-amber-600' }
    );
  } else {
    menuItems.push({
      id: 'become-stockist',
      label: 'Become a Stockist',
      icon: Store,
      href: '/become-stockist',
      color: 'from-red-500 to-red-600'
    });
  }

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
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-md z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300,
              opacity: { duration: 0.2 }
            }}
            className="lg:hidden fixed left-0 top-0 h-full w-[85%] max-w-sm bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl z-50 flex flex-col"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-rose-700 px-5 py-6">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
              <div className="absolute top-1/2 right-0 w-24 h-24 bg-rose-400/20 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="w-11 h-11 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-lg"
                    >
                      <Image 
                        src="/logo.png" 
                        alt="RIG" 
                        width={26} 
                        height={26}
                        className="object-contain brightness-0 invert"
                      />
                    </motion.div>
                    <div>
                      <h2 className="font-bold text-white text-base tracking-wide">RIG Global</h2>
                      <p className="text-xs text-orange-100 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Business Platform
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      {userProfile?.profilePicture ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border-3 border-white/50 shadow-xl">
                          <img 
                            src={userProfile.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-3 border-white/50 shadow-xl">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full shadow-lg"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-base truncate mb-0.5">
                        {userProfile?.name || user?.username || 'Loading...'}
                      </h4>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Shield className="w-3.5 h-3.5 text-orange-200" />
                        <p className="text-xs text-orange-100 font-medium">
                          {userProfile?.plan || 'Basic'} Plan
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-bold ${
                          userProfile?.isStockist 
                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' 
                            : 'bg-white/20 text-white border border-white/30'
                        }`}>
                          <Award className="w-3 h-3" />
                          {userProfile?.isStockist ? 'Stockist' : 'Member'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-orange-500/30 to-orange-600/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/30">
                      <div className="flex items-center gap-1 mb-0.5">
                        <TrendingUp className="w-3 h-3 text-orange-100" />
                        <span className="text-[10px] text-orange-100 font-medium">PV Points</span>
                      </div>
                      <span className="text-lg font-bold text-white block">{userProfile?.pv || 0}</span>
                    </div>
                    <div className="bg-gradient-to-br from-rose-500/30 to-rose-600/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/30">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3 h-3 text-rose-100" />
                        <span className="text-[10px] text-rose-100 font-medium">TP Points</span>
                      </div>
                      <span className="text-lg font-bold text-white block">{userProfile?.tp || 0}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <nav className="flex-1 px-3 py-4 overflow-y-auto">
              <div className="mb-2 px-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</p>
              </div>
              <ul className="space-y-1">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.id;
                  
                  return (
                    <motion.li 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <a href={item.href}>
                        <motion.button
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMenuClick(item.id)}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/30'
                              : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100'
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          )}
                          
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 rounded-xl transition-all relative ${
                              isActive 
                                ? 'bg-white/20 backdrop-blur-sm shadow-lg' 
                                : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'
                            }`}>
                              <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                                isActive ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <span className={`text-sm font-semibold ${
                              isActive ? 'text-white' : 'text-gray-700'
                            }`}>
                              {item.label}
                            </span>
                          </div>
                          
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                          
                          <ChevronRight className={`w-4 h-4 transition-all ${
                            isActive 
                              ? 'text-white opacity-100' 
                              : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                          }`} />
                        </motion.button>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-4 border-t-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-red-600 bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white rounded-xl transition-all duration-300 font-bold group shadow-md hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <div className="p-2 bg-red-100 group-hover:bg-white/20 rounded-lg transition-all">
                    <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm">Logout</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.button>
              
              <p className="text-center text-xs text-gray-400 mt-3">
                Version 2.0 • © 2025 RIG Global
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;