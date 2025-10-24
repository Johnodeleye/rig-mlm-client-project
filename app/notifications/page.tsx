// app/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Clock, UserCheck, DollarSign, TrendingUp, Send, Receipt, XCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: 'referral' | 'commission' | 'transfer' | 'withdrawal' | 'upgrade' | 'team';
  icon: string;
}

const NotificationsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingRead, setIsMarkingRead] = useState<string | null>(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/notifications/my-notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications || []);
        } else {
          console.error('Failed to fetch notifications:', data.error);
        }
      } else {
        console.error('HTTP error fetching notifications:', response.status);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/notifications/mark-all-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Refresh notifications to get updated read status
          await fetchNotifications();
        }
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setIsMarkingRead(id);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/notifications/mark-as-read/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state immediately for better UX
          setNotifications(prev => 
            prev.map(notification => 
              notification.id === id ? { ...notification, read: true } : notification
            )
          );
        }
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      setIsMarkingRead(null);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconProps = { className: "w-4 h-4 lg:w-5 lg:h-5 text-white" };
    
    switch (iconName) {
      case 'UserCheck':
        return <UserCheck {...iconProps} />;
      case 'DollarSign':
        return <DollarSign {...iconProps} />;
      case 'TrendingUp':
        return <TrendingUp {...iconProps} />;
      case 'Send':
        return <Send {...iconProps} />;
      case 'Receipt':
        return <Receipt {...iconProps} />;
      case 'Clock':
        return <Clock {...iconProps} />;
      case 'CheckCircle':
        return <CheckCircle {...iconProps} />;
      case 'XCircle':
        return <XCircle {...iconProps} />;
      case 'Bell':
        return <Bell {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          setIsSidebarOpen={setIsSidebarOpen}
          isProfileDropdownOpen={isProfileDropdownOpen}
          setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        />

        <div className="flex pt-16">
          <DesktopSidebar 
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

          <MobileSidebar 
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

          <main className="flex-1 w-full lg:ml-64 p-4 lg:p-6">
            {/* Loading Skeleton */}
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
      <Header 
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <div className="flex pt-16">
        <DesktopSidebar 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <MobileSidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main className="flex-1 w-full lg:ml-64 p-4 lg:p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Notifications
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={isMarkingRead === 'all'}
                  className="w-full sm:w-auto px-4 lg:px-6 py-2 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm lg:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
            </div>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
          >
            <div className="space-y-3 lg:space-y-4">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start gap-3 lg:gap-4 p-3 lg:p-4 rounded-lg border transition-all duration-200 ${
                    !notification.read 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200'
                  } hover:shadow-md hover:border-blue-300`}
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    !notification.read ? 'bg-[#0660D3]' : 'bg-gray-400'
                  }`}>
                    {getIconComponent(notification.icon)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm lg:text-base leading-relaxed ${
                      !notification.read ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 flex-shrink-0" />
                      <p className="text-xs lg:text-sm text-gray-500">{notification.time}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        disabled={isMarkingRead === notification.id}
                        className="px-3 py-1 text-xs bg-[#0660D3] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMarkingRead === notification.id ? (
                          <EyeOff className="w-3 h-3" />
                        ) : (
                          <Eye className="w-3 h-3" />
                        )}
                        Mark read
                      </button>
                    )}
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#0660D3] rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-8 lg:py-12">
                <Bell className="w-16 h-16 lg:w-20 lg:h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg lg:text-xl mb-2">No notifications yet</p>
                <p className="text-gray-400 text-sm lg:text-base">
                  Your notifications will appear here when you have new activity
                </p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;