'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Search, Filter, CheckCircle, XCircle, Clock, User, Eye, Banknote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminDesktopSidebar from '@/app/components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '@/app/components/admin/AdminMobileSidebar';

interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  user: {
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

const AdminWithdrawalsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('withdrawals');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuth');
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchWithdrawals();
    }
  }, [router]);

  const fetchWithdrawals = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/withdrawals/admin/withdrawals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setWithdrawals(data.withdrawals);
        }
      }
    } catch (error) {
      console.error('Fetch withdrawals error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawalAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/withdrawals/admin/withdrawals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: action })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(`Withdrawal ${action} successfully!`);
          fetchWithdrawals();
        }
      } else {
        alert('Error processing withdrawal');
      }
    } catch (error) {
      console.error('Withdrawal action error:', error);
      alert('Error processing withdrawal');
    }
  };

  const showWithdrawalDetails = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailsModal(true);
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || withdrawal.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

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
                  Withdrawal Requests
                </h1>
                <p className="text-gray-600">Manage and process user withdrawal requests</p>
              </div>
              <div className="mt-3 lg:mt-0 text-sm text-gray-500">
                Pending Requests: {pendingCount}
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
                  placeholder="Search by user name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank Details
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 lg:px-6 py-8 text-center">
                        <div className="flex justify-center">
                          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-2 text-gray-500">Loading withdrawals...</p>
                      </td>
                    </tr>
                  ) : filteredWithdrawals.map((withdrawal, index) => (
                    <motion.tr
                      key={withdrawal.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                          </div>
                          <div className="ml-3 lg:ml-4">
                            <div className="text-sm font-medium text-gray-900">{withdrawal.user.fullName}</div>
                            <div className="text-sm text-gray-500">{withdrawal.user.email}</div>
                            <div className="text-xs text-gray-400">@{withdrawal.user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">₦{withdrawal.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{withdrawal.bankName}</div>
                        <div className="text-xs text-gray-500">{withdrawal.accountName}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                          {getStatusIcon(withdrawal.status)}
                          {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{formatDate(withdrawal.createdAt)}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showWithdrawalDetails(withdrawal)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Details
                          </button>
                          {withdrawal.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleWithdrawalAction(withdrawal.id, 'approved')}
                                className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleWithdrawalAction(withdrawal.id, 'rejected')}
                                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isLoading && filteredWithdrawals.length === 0 && (
              <div className="text-center py-12">
                <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No withdrawal requests found</p>
              </div>
            )}
          </motion.div>

          {showDetailsModal && selectedWithdrawal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Withdrawal Details</h3>
                    <button
                      onClick={() => setShowDetailsModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">User Information</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-900"><strong>Name:</strong> {selectedWithdrawal.user.fullName}</p>
                        <p className="text-sm text-gray-900"><strong>Email:</strong> {selectedWithdrawal.user.email}</p>
                        <p className="text-sm text-gray-900"><strong>Phone:</strong> {selectedWithdrawal.user.phoneNumber}</p>
                        <p className="text-sm text-gray-900"><strong>Username:</strong> @{selectedWithdrawal.user.username}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Bank Details</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Banknote className="w-4 h-4 text-gray-600" />
                          <p className="text-sm text-gray-900"><strong>Bank:</strong> {selectedWithdrawal.bankName}</p>
                        </div>
                        <p className="text-sm text-gray-900"><strong>Account Name:</strong> {selectedWithdrawal.accountName}</p>
                        <p className="text-sm text-gray-900"><strong>Account Number:</strong> {selectedWithdrawal.accountNumber}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Transaction Details</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-900"><strong>Amount:</strong> ₦{selectedWithdrawal.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-900"><strong>Status:</strong> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedWithdrawal.status)}`}>
                            {selectedWithdrawal.status.charAt(0).toUpperCase() + selectedWithdrawal.status.slice(1)}
                          </span>
                        </p>
                        <p className="text-sm text-gray-900"><strong>Requested:</strong> {formatDate(selectedWithdrawal.createdAt)}</p>
                        {selectedWithdrawal.updatedAt !== selectedWithdrawal.createdAt && (
                          <p className="text-sm text-gray-900"><strong>Updated:</strong> {formatDate(selectedWithdrawal.updatedAt)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedWithdrawal.status === 'pending' && (
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => {
                          handleWithdrawalAction(selectedWithdrawal.id, 'approved');
                          setShowDetailsModal(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          handleWithdrawalAction(selectedWithdrawal.id, 'rejected');
                          setShowDetailsModal(false);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminWithdrawalsPage;