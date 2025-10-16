import { Home, Users, DollarSign, CreditCard, TrendingUp, Bell, Settings, LogOut, Package, PersonStanding, User } from "lucide-react"

interface DesktopSidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const DesktopSidebar = ({ activeMenu, setActiveMenu }: DesktopSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/home' },
    { id: 'referrals', label: 'My Referrals', icon: Users, href: '/referrals' },
    { id: 'my teams', label: 'My Teams', icon: PersonStanding, href: '/teams' },
    { id: 'earnings', label: 'Earnings & Wallet', icon: DollarSign, href: '/wallet' },
    { id: 'products', label: 'Products', icon: Package, href: '/products' },
    { id: 'upgrade', label: 'Upgrade Plan', icon: TrendingUp, href: '/upgrade' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ];

  const handleMenuClick = (menuId: string) => {
    if (menuId === 'logout') {
      // Handle logout logic here
      console.log('Logging out...');
      // Add your logout logic
    } else {
      setActiveMenu(menuId);
    }
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
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
      </aside> 
    </div>
  )
}

export default DesktopSidebar