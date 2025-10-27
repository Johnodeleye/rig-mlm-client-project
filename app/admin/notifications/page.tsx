'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Download, Users, AlertCircle, UserPlus, DollarSign, Package, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminDesktopSidebar from '@/app/components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '@/app/components/admin/AdminMobileSidebar';
import Header from '@/app/components/Header';

interface AdminNotification {
  id: string;
  message: string;
  time: string;
  type: 'withdrawal' | 'user' | 'alert' | 'revenue' | 'system';
  icon: string;
}

const AdminNotificationsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('notifications');
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchAdminNotifications();
    }
  }, [router]);

  const fetchAdminNotifications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/notifications/admin-notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      }
    } catch (error) {
      console.error('Fetch admin notifications error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconProps = { className: "w-5 h-5 text-white" };
    
    switch (iconName) {
      case 'Download':
        return <Download {...iconProps} />;
      case 'Users':
        return <Users {...iconProps} />;
      case 'AlertCircle':
        return <AlertCircle {...iconProps} />;
      case 'UserPlus':
        return <UserPlus {...iconProps} />;
      case 'DollarSign':
        return <DollarSign {...iconProps} />;
      case 'Package':
        return <Package {...iconProps} />;
      case 'TrendingUp':
        return <TrendingUp {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'withdrawal':
        return 'bg-orange-500';
      case 'user':
        return 'bg-green-500';
      case 'alert':
        return 'bg-red-500';
      case 'revenue':
        return 'bg-purple-500';
      case 'system':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader 
          setIsSidebarOpen={setIsSidebarOpen}
          isProfileDropdownOpen={isProfileDropdownOpen}
          setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        />

        <div className="flex pt-16">
          <AdminDesktopSidebar 
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

          <AdminMobileSidebar 
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

          <main className="flex-1 w-full lg:ml-64 p-4 lg:p-6">
            <div className="animate-pulse space-y-6">
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 h-20 lg:h-24"></div>
              <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 mb-3">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <div className="flex pt-16">
        <AdminDesktopSidebar 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <AdminMobileSidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main className="flex-1 w-full lg:ml-64 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Admin Notifications
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  System alerts and activity overview
                </p>
              </div>
              
              <button
                onClick={fetchAdminNotifications}
                className="w-full sm:w-auto px-4 lg:px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm lg:text-base flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    {getIconComponent(notification.icon)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm lg:text-base text-gray-900 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Bell className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <p className="text-xs lg:text-sm text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No system notifications</p>
                <p className="text-gray-400 text-sm">
                  System alerts and activity updates will appear here
                </p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;