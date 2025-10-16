// app/notifications/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Clock, UserCheck, DollarSign, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';

const NotificationsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('notifications');
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: 'New referral joined your network', 
      time: '2 hours ago', 
      read: false,
      type: 'referral',
      icon: UserCheck
    },
    { 
      id: 2, 
      message: 'Commission payment processed', 
      time: '1 day ago', 
      read: true,
      type: 'commission',
      icon: DollarSign
    },
    { 
      id: 3, 
      message: 'Your account has been upgraded', 
      time: '2 days ago', 
      read: true,
      type: 'upgrade',
      icon: TrendingUp
    },
    { 
      id: 4, 
      message: 'Level 1 commission earned - ₦1,200', 
      time: '3 days ago', 
      read: false,
      type: 'commission',
      icon: DollarSign
    },
    { 
      id: 5, 
      message: 'New team member activated', 
      time: '1 week ago', 
      read: true,
      type: 'team',
      icon: UserCheck
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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

        <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Notifications
                </h1>
                <p className="text-gray-600">
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </p>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mt-3 lg:mt-0 px-4 lg:px-6 py-2 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm lg:text-base flex items-center gap-2"
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
            <div className="space-y-3">
              {notifications.map((notification, index) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                      !notification.read 
                        ? 'bg-blue-50 border-blue-100' 
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !notification.read ? 'bg-[#0660D3]' : 'bg-gray-400'
                    }`}>
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm lg:text-base ${
                        !notification.read ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
                        <p className="text-xs lg:text-sm text-gray-500">{notification.time}</p>
                      </div>
                    </div>

                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="flex-shrink-0 px-3 py-1 text-xs bg-[#0660D3] text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark read
                      </button>
                    )}
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#0660D3] rounded-full flex-shrink-0"></div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default NotificationsPage;