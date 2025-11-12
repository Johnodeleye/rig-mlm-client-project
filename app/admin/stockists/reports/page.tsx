'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, TrendingUp, Users, BarChart3, Download, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminDesktopSidebar from '@/app/components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '@/app/components/admin/AdminMobileSidebar';
import { useAuth } from '@/context/AuthContext';

interface StockistReport {
  id: string;
  name: string;
  owner: string;
  location: string;
  totalCommission: number;
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  inventoryValue: number;
  inventory: Array<{
    product: string;
    quantity: number;
    value: number;
  }>;
  recentActivity: Array<{
    product: string;
    amount: number;
    date: string;
  }>;
}

const AdminStockistsReportsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('stockists');
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<StockistReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedStockist, setExpandedStockist] = useState<string | null>(null);
  
  const router = useRouter();
  const { isAuthenticated, accountType, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || accountType !== 'admin') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, accountType, authLoading, router]);

  const fetchStockistReports = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/admin/stockists/reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReports(data.reports);
        }
      }
    } catch (error) {
      console.error('Error fetching stockist reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accountType === 'admin') {
      fetchStockistReports();
    }
  }, [isAuthenticated, accountType]);

  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpandStockist = (stockistId: string) => {
    setExpandedStockist(expandedStockist === stockistId ? null : stockistId);
  };

  const exportToCSV = () => {
    const headers = ['Stockist Name', 'Owner', 'Location', 'Total Commission', 'Total Orders', 'Delivered Orders', 'Pending Orders', 'Inventory Value'];
    const csvData = reports.map(report => [
      report.name,
      report.owner,
      report.location,
      report.totalCommission,
      report.totalOrders,
      report.deliveredOrders,
      report.pendingOrders,
      report.inventoryValue
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stockists-report.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stockist reports...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || accountType !== 'admin') {
    return null;
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

        <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Stockists Reports & Analytics
                </h1>
                <p className="text-gray-600">Monitor stockist performance and inventory levels</p>
              </div>
              <div className="flex gap-3 mt-3 lg:mt-0">
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Export CSV
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stockists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 lg:space-y-6"
          >
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="flex items-center gap-4 mb-3 lg:mb-0">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {report.owner} • {report.location}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpandStockist(report.id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      {expandedStockist === report.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Total Commission</p>
                      <p className="text-lg font-bold text-gray-900">₦{report.totalCommission.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-lg font-bold text-gray-900">{report.totalOrders}</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Delivered</p>
                      <p className="text-lg font-bold text-gray-900">{report.deliveredOrders}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Package className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Inventory Value</p>
                      <p className="text-lg font-bold text-gray-900">₦{report.inventoryValue.toLocaleString()}</p>
                    </div>
                  </div>

                  {expandedStockist === report.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="border-t border-gray-200 pt-4 mt-4"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Inventory</h4>
                          <div className="space-y-2">
                            {report.inventory.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{item.product}</p>
                                  <p className="text-sm text-gray-600">Value: ₦{item.value.toLocaleString()}</p>
                                </div>
                                <span className="text-lg font-bold text-red-600">{item.quantity} units</span>
                              </div>
                            ))}
                            {report.inventory.length === 0 && (
                              <p className="text-gray-500 text-center py-4">No inventory data available</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h4>
                          <div className="space-y-2">
                            {report.recentActivity.map((activity, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{activity.product}</p>
                                  <p className="text-sm text-gray-600">
                                    {new Date(activity.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className="text-lg font-bold text-green-600">
                                  ₦{activity.amount.toLocaleString()}
                                </span>
                              </div>
                            ))}
                            {report.recentActivity.length === 0 && (
                              <p className="text-gray-500 text-center py-4">No recent activity</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Order Summary</span>
                          <div className="flex gap-4">
                            <span className="text-sm text-green-600">
                              Delivered: {report.deliveredOrders}
                            </span>
                            <span className="text-sm text-yellow-600">
                              Pending: {report.pendingOrders}
                            </span>
                            <span className="text-sm text-gray-600">
                              Success Rate: {report.totalOrders > 0 ? Math.round((report.deliveredOrders / report.totalOrders) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredReports.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200"
            >
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No stockist reports found</p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminStockistsReportsPage;