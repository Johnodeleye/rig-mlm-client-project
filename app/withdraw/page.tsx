// app/withdraw/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';

interface WalletData {
  availableBalance: number;
  totalEarnings: number;
  pendingWithdrawals: number;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const WithdrawPage = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('withdraw');
  
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch wallet data and withdrawal history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        const [walletRes, withdrawalsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/wallet/my-wallet`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/withdrawals/my-withdrawals`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWalletData(walletData.walletData);
        }

        if (withdrawalsRes.ok) {
          const withdrawalsData = await withdrawalsRes.json();
          setWithdrawalRequests(withdrawalsData.withdrawals || []);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseFloat(withdrawalAmount);
    
    // Validation
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!walletData || amount > walletData.availableBalance) {
      setError('Insufficient balance');
      return;
    }

    if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      setError('Please fill in all bank details');
      return;
    }

    if (accountNumber.length < 10) {
      setError('Please enter a valid account number');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/withdrawals/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: amount,
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          accountName: accountName.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Withdrawal request submitted successfully! It will be processed within 24 hours.');
        setWithdrawalAmount('');
        setBankName('');
        setAccountNumber('');
        setAccountName('');
        
        // Refresh wallet data and withdrawal history
        const [walletRes, withdrawalsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/wallet/my-wallet`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/withdrawals/my-withdrawals`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWalletData(walletData.walletData);
        }

        if (withdrawalsRes.ok) {
          const withdrawalsData = await withdrawalsRes.json();
          setWithdrawalRequests(withdrawalsData.withdrawals || []);
        }
      } else {
        setError(data.error || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError('Failed to submit withdrawal request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

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
          <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
            <div className="animate-pulse space-y-6">
              <div className="bg-white rounded-xl p-6 h-32"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 h-96"></div>
                <div className="bg-white rounded-xl p-6 h-96"></div>
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

        <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Withdraw Funds</h1>
                <p className="text-gray-600">Withdraw your earnings to your bank account</p>
              </div>
            </div>

            {/* Wallet Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Available Balance</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₦{(walletData?.availableBalance || 0).toLocaleString()}
                    </p>
                  </div>
                  <Wallet className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 mb-1">Total Earnings</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₦{(walletData?.totalEarnings || 0).toLocaleString()}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 mb-1">Pending Withdrawals</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₦{(walletData?.pendingWithdrawals || 0).toLocaleString()}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Withdrawal Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Withdrawal Request</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleWithdrawal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Withdraw (₦)
                  </label>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="100"
                    step="100"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum withdrawal: ₦100
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Enter bank name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter account number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={10}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter account name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !walletData?.availableBalance}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Submit Withdrawal Request'}
                </button>
              </form>
            </motion.div>

            {/* Withdrawal History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Withdrawal History</h2>

              {withdrawalRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No withdrawal requests yet</p>
                  <p className="text-sm mt-1">Your withdrawal history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {withdrawalRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(request.status)}
                        <div>
                          <p className="font-semibold text-gray-900">
                            ₦{request.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WithdrawPage;