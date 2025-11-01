// app/send/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, Search, User, Send, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import { useCurrency } from '@/context/CurrencyContext';

interface WalletData {
  availableBalance: number;
  totalEarnings: number;
}

interface User {
  id: string;
  username: string;
  fullName: string;
  referralId: string;
}

interface Transaction {
  id: string;
  amount: number;
  recipientName: string;
  recipientUsername: string;
  createdAt: string;
  type: 'sent' | 'received';
}

const SendMoneyPage = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('send');
  
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { currency, convertAmount, formatAmount, exchangeRate } = useCurrency();

  // Fetch wallet data and transaction history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        const [walletRes, transactionsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/wallet/my-wallet`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/transactions/transfer-history`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWalletData(walletData.walletData);
        }

        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData.transactions || []);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search for users
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const convertToNaira = (amount: number): number => {
    if (currency === 'NGN') {
      return amount;
    } else {
      return amount * exchangeRate;
    }
  };

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const sendAmount = parseFloat(amount);
    
    // Validation
    if (!sendAmount || sendAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const nairaAmount = convertToNaira(sendAmount);

    if (!walletData || nairaAmount > walletData.availableBalance) {
      setError('Insufficient balance');
      return;
    }

    if (!selectedUser) {
      setError('Please select a recipient');
      return;
    }

    const minAmount = currency === 'NGN' ? 100 : 1;
    if (sendAmount < minAmount) {
      setError(`Minimum transfer amount is ${currency === 'NGN' ? '₦100' : '$1'}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/transactions/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: selectedUser.id,
          amount: nairaAmount,
          note: note.trim() || `Transfer to ${selectedUser.fullName}`
        })
      });

      const data = await response.json();

      if (data.success) {
        const displayAmount = currency === 'NGN' ? `₦${sendAmount.toLocaleString()}` : `$${sendAmount.toFixed(2)}`;
        setSuccess(`${displayAmount} sent successfully to ${selectedUser.fullName}!`);
        setAmount('');
        setNote('');
        setSelectedUser(null);
        setSearchQuery('');
        
        // Refresh wallet data and transaction history
        const [walletRes, transactionsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/wallet/my-wallet`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/transactions/transfer-history`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWalletData(walletData.walletData);
        }

        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData.transactions || []);
        }
      } else {
        setError(data.error || 'Failed to send money');
      }
    } catch (error) {
      console.error('Send money error:', error);
      setError('Failed to send money. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTransactionAmount = (amount: number, type: 'sent' | 'received'): string => {
    if (currency === 'NGN') {
      return `${type === 'sent' ? '-' : '+'}₦${amount.toLocaleString()}`;
    } else {
      const usdAmount = amount / exchangeRate;
      return `${type === 'sent' ? '-' : '+'}$${usdAmount.toFixed(2)}`;
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
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Send Money</h1>
                <p className="text-gray-600">Transfer money to other RIG Global members</p>
              </div>
            </div>

            {/* Exchange Rate Info */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Info className="w-4 h-4" />
                <span>Current Exchange Rate: 1 USD = ₦{exchangeRate.toLocaleString()}</span>
              </div>
            </div>

            {/* Wallet Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 mb-1">Available Balance</p>
                    <p className="text-xl font-bold text-gray-900">
                      {convertAmount(walletData?.availableBalance || 0)}
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
                      {convertAmount(walletData?.totalEarnings || 0)}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Send Money Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Send Money</h2>

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

              <form onSubmit={handleSendMoney} className="space-y-4">
                {/* Recipient Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Recipient
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value);
                      }}
                      placeholder="Search by username or name..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Search Results */}
                  {searchQuery && searchResults.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setSearchQuery(user.fullName);
                            setSearchResults([]);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.fullName}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {isSearching && (
                    <div className="mt-2 p-3 text-center text-gray-500">
                      <p>Searching...</p>
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && !isSearching && (
                    <div className="mt-2 p-3 text-center text-gray-500">
                      <p>No users found</p>
                    </div>
                  )}
                </div>

                {/* Selected User Display */}
                {selectedUser && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedUser.fullName}</p>
                        <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ({currency === 'NGN' ? '₦' : '$'})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter amount in ${currency}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min={currency === 'NGN' ? '100' : '1'}
                    step={currency === 'NGN' ? '100' : '0.01'}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum transfer: {currency === 'NGN' ? '₦100' : '$1'}
                    {currency === 'USD' && ` (₦${exchangeRate.toLocaleString()})`}
                  </p>
                  {currency === 'USD' && amount && !isNaN(parseFloat(amount)) && (
                    <p className="text-xs text-blue-600 mt-1">
                      Equivalent: ₦{(parseFloat(amount) * exchangeRate).toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note for this transfer..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedUser || !amount || !walletData?.availableBalance}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Send Money'}
                </button>
              </form>
            </motion.div>

            {/* Transaction History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Transfers</h2>

              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Send className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No transfers yet</p>
                  <p className="text-sm mt-1">Your transfer history will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'sent' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          <Send className={`w-5 h-5 ${
                            transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {transaction.type === 'sent' ? 'To: ' : 'From: '}
                            {transaction.recipientName}
                          </p>
                          <p className="text-sm text-gray-500">
                            @{transaction.recipientUsername}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {formatTransactionAmount(transaction.amount, transaction.type)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {transaction.type}
                        </p>
                      </div>
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

export default SendMoneyPage;