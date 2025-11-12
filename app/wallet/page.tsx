// app/wallet/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, TrendingUp, Download, Calendar, CreditCard, Clock, CheckCircle, XCircle, Send, Users, History } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import { useCurrency } from '@/context/CurrencyContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface WalletData {
  totalEarnings: number;
  availableBalance: number;
  pendingWithdrawals: number;
}

interface UserData {
  name: string;
  username: string;
  plan: string;
  pv: number;
  tp: number;
  status: string;
  totalEarnings: string;
  availableBalance: string;
  totalReferrals: number;
}

interface PointsData {
  monthlyPV: {
    personal: number;
    team: number;
  };
  cumulativePV: {
    personal: number;
    team: number;
  };
  monthlyTP: {
    personal: number;
    team: number;
  };
  cumulativeTP: {
    personal: number;
    team: number;
  };
}

interface CommissionHistoryItem {
  id: string;
  userId: string;
  referredUserId: string;
  package: string;
  level: number;
  commissionAmount: number;
  type: string;
  status: string;
  createdAt: string;
  referredUser: {
    username: string;
    fullName?: string;
  };
}

interface CommissionSummary {
  totalCommissions: number;
  recentCommissions: CommissionHistoryItem[];
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
  type: string;
}

interface BonusProgress {
  achieved: boolean;
  progress: number;
  usedPV: number;
  requiredPV: number;
  membersUsed: Array<{
    userId: string;
    pvUsed: number;
    originalPV: number;
  }>;
  remainingRequired: number;
}

interface BonusData {
  monthlySalaryBonuses: Array<{
    level: string;
    requiredPV: number;
    maxCapPerMember: number;
    progress: BonusProgress;
  }>;
  rankAwards: Array<{
    rank: string;
    requiredPV: number;
    maxCapPerMember: number;
    progress: BonusProgress;
  }>;
  teamMembersCount: number;
  totalTeamPV: number;
}

const WalletPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('earnings');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [commissionData, setCommissionData] = useState<CommissionSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bonusData, setBonusData] = useState<BonusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { currency, convertAmount, formatAmount, exchangeRate } = useCurrency();
   const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        const [walletRes, pointsRes, commissionRes, transactionsRes, bonusRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/wallet/my-wallet`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/points/my-points`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/commissions/my-commissions`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/transactions/my-transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/bonus/my-bonus-progress`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (walletRes.ok) {
          const walletData = await walletRes.json();
          setWalletData(walletData.walletData);
          setUserData(walletData.userData);
        }

        if (pointsRes.ok) {
          const pointsData = await pointsRes.json();
          setPointsData(pointsData.pointsData);
        }

        if (commissionRes.ok) {
          const commissionData = await commissionRes.json();
          setCommissionData(commissionData);
        }

        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          setTransactions(transactionsData.transactions || []);
        }

        if (bonusRes.ok) {
          const bonusData = await bonusRes.json();
          setBonusData(bonusData.bonusData);
        }

      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTransactionAmount = (amount: string, type: string): string => {
    if (currency === 'NGN') {
      return type === 'credit' ? amount : amount;
    } else {
      const nairaMatch = amount.match(/₦([\d,]+(\.\d{2})?)/);
      if (nairaMatch) {
        const nairaAmount = parseFloat(nairaMatch[1].replace(/,/g, ''));
        const usdAmount = nairaAmount / exchangeRate;
        return type === 'credit' ? `$${usdAmount.toFixed(2)}` : `-$${usdAmount.toFixed(2)}`;
      }
      return amount;
    }
  };

  const processedTransactions = transactions.map(transaction => ({
    ...transaction,
    amount: processTransactionAmount(transaction.amount, transaction.type)
  }));

  const monthlySalaryBonuses = [
    { level: 'SB1', requiredPV: 600, salaryNGN: '₦50,000', salaryUSD: '$100', maxCappedPV: 270 },
    { level: 'SB2', requiredPV: 1200, salaryNGN: '₦100,000', salaryUSD: '$200', maxCappedPV: 540 },
    { level: 'SB3', requiredPV: 2500, salaryNGN: '₦200,000', salaryUSD: '$300', maxCappedPV: 1125 },
    { level: 'SB4', requiredPV: 4000, salaryNGN: '₦300,000', salaryUSD: '$400', maxCappedPV: 1800 },
    { level: 'SB5', requiredPV: 6000, salaryNGN: '₦400,000', salaryUSD: '$500', maxCappedPV: 2700 },
    { level: 'SB6', requiredPV: 10000, salaryNGN: '₦600,000', salaryUSD: '$1,000', maxCappedPV: 4500 },
    { level: 'SB7', requiredPV: 17000, salaryNGN: '₦1,000,000', salaryUSD: '$1,500', maxCappedPV: 7650 }
  ];

  const rankAwards = [
    { rank: 'Sapphire', cumulativePV: 3500, awardNGN: '₦100,000', awardUSD: '$250', maxCappedPV: 1575 },
    { rank: 'Pearl', cumulativePV: 9000, awardNGN: '₦250,000', awardUSD: '$600', maxCappedPV: 4050 },
    { rank: 'Ruby', cumulativePV: 25000, awardNGN: '₦800,000', awardUSD: '$2,000', maxCappedPV: 11250 },
    { rank: 'Emerald', cumulativePV: 60000, awardNGN: '₦3,000,000', awardUSD: '$4,000', maxCappedPV: 27000 },
    { rank: 'Diamond', cumulativePV: 150000, awardNGN: '₦6,000,000', awardUSD: '$8,000', maxCappedPV: 67500 },
    { rank: 'Blue Diamond', cumulativePV: 350000, awardNGN: '₦12,000,000', awardUSD: '$20,000', maxCappedPV: 157500 },
    { rank: 'Black Diamond', cumulativePV: 700000, awardNGN: '₦25,000,000', awardUSD: '$40,000', maxCappedPV: 315000 },
    { rank: 'Crown Diamond', cumulativePV: 1500000, awardNGN: '₦50,000,000', awardUSD: '$100,000', maxCappedPV: 675000 },
    { rank: 'Ambassador', cumulativePV: 5000000, awardNGN: '₦150,000,000', awardUSD: '$250,000', maxCappedPV: 2250000 },
    { rank: 'Crown Ambassador', cumulativePV: 15000000, awardNGN: '₦300,000,000', awardUSD: '$500,000', maxCappedPV: 6750000 }
  ];

  const travelAwards = [
    { title: 'One (1) Person Trip', requiredTP: 30000, maxCappedTP: 13500 },
    { title: 'Two (2) Person Trip', requiredTP: 45000, maxCappedTP: 22500 }
  ];

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getRewardsData = () => {
    if (!pointsData) {
      return {
        monthlyPV: { current: 0, target: 600 },
        cumulativePV: { current: 0, target: 3500 },
        cumulativeTP: { current: 0, target: 30000 }
      };
    }

    return {
      monthlyPV: { 
        current: pointsData.monthlyPV.personal + pointsData.monthlyPV.team, 
        target: 600 
      },
      cumulativePV: { 
        current: pointsData.cumulativePV.personal + pointsData.cumulativePV.team, 
        target: 3500 
      },
      cumulativeTP: { 
        current: pointsData.cumulativeTP.personal + pointsData.cumulativeTP.team, 
        target: 30000 
      }
    };
  };

  const rewardsData = getRewardsData();

  type CircularProgressProps = {
    progress: number;
    size?: number;
    strokeWidth?: number;
  };

  const CircularProgress = ({ progress, size = 80, strokeWidth = 8 }: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0660D3"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
      </div>
    );
  };

    if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Working...</p>
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Wallet & Earnings
            </h1>
            <p className="text-gray-600">Manage your earnings and withdrawals</p>
          </motion.div>

          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Commissions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {convertAmount(commissionData?.totalCommissions || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                Commission History
              </h2>

              {commissionData?.recentCommissions && commissionData.recentCommissions.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Date</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">From</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Level</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Package</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commissionData.recentCommissions.map((commission) => (
                          <tr key={commission.id} className="border-b border-gray-100 last:border-0">
                            <td className="py-3 px-2 text-sm text-gray-600">
                              {new Date(commission.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-900">
                              {commission.referredUser.username}
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-600">
                              Level {commission.level}
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-600 capitalize">
                              {commission.package}
                            </td>
                            <td className="py-3 px-2 text-sm font-medium text-gray-900">
                              {convertAmount(commission.commissionAmount)}
                            </td>
                            <td className="py-3 px-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  commission.status === 'Paid'
                                    ? 'bg-green-100 text-green-800'
                                    : commission.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {commission.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-3">
                    {commissionData.recentCommissions.map((commission) => (
                      <div 
                        key={commission.id} 
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">
                              {convertAmount(commission.commissionAmount)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(commission.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              commission.status === 'Paid'
                                ? 'bg-green-100 text-green-800'
                                : commission.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {commission.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">From:</span>
                            <span className="text-gray-900 font-medium">
                              {commission.referredUser.username}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Level:</span>
                            <span className="text-gray-900">Level {commission.level}</span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Package:</span>
                            <span className="text-gray-900 capitalize">{commission.package}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No commission history yet</p>
                  <p className="text-sm mt-1">Commissions will appear here when your referrals join and get activated</p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {convertAmount(walletData?.totalEarnings || 0)}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {convertAmount(walletData?.availableBalance || 0)}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Withdrawals</p>
                  <p className="text-xl lg:text-2xl font-bold text-gray-900">
                    {convertAmount(walletData?.pendingWithdrawals || 0)}
                  </p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              <a href='/withdraw' className="flex-1 px-4 lg:px-6 py-3 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4 lg:w-5 lg:h-5" />
                Withdraw Funds
              </a>
              <a href='/send' className="flex-1 px-4 lg:px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                Send Money
              </a>
              <a href='#txt' className="flex-1 px-4 lg:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4 lg:w-5 lg:h-5" />
                View Transactions
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Rewards & Incentives</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <CircularProgress 
                    progress={calculateProgress(rewardsData.monthlyPV.current, rewardsData.monthlyPV.target)} 
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Monthly PV Progress</h3>
                <p className="text-sm text-gray-600">
                  {rewardsData.monthlyPV.current} / {rewardsData.monthlyPV.target} PV
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <CircularProgress 
                    progress={calculateProgress(rewardsData.cumulativePV.current, rewardsData.cumulativePV.target)} 
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Cumulative PV Progress</h3>
                <p className="text-sm text-gray-600">
                  {rewardsData.cumulativePV.current} / {rewardsData.cumulativePV.target} PV
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <CircularProgress 
                    progress={calculateProgress(rewardsData.cumulativeTP.current, rewardsData.cumulativeTP.target)} 
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Travel Points Progress</h3>
                <p className="text-sm text-gray-600">
                  {rewardsData.cumulativeTP.current} / {rewardsData.cumulativeTP.target} TP
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Salary Bonuses</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Level</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Required PV</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Salary (₦)</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Salary ($)</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Max Capped PV</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonusData?.monthlySalaryBonuses.map((bonus, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 text-sm font-medium text-gray-900">{bonus.level}</td>
                        <td className="py-3 text-sm text-gray-600">{bonus.requiredPV.toLocaleString()} PV</td>
                        <td className="py-3 text-sm text-gray-600">
                          {monthlySalaryBonuses.find(b => b.level === bonus.level)?.salaryNGN}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {monthlySalaryBonuses.find(b => b.level === bonus.level)?.salaryUSD}
                        </td>
                        <td className="py-3 text-sm text-gray-600">{bonus.maxCapPerMember.toLocaleString()} PV</td>
                        <td className="py-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                bonus.progress.achieved ? 'bg-green-500' : 'bg-[#0660D3]'
                              }`}
                              style={{ width: `${bonus.progress.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{Math.round(bonus.progress.progress)}%</span>
                            <span>{bonus.progress.usedPV.toLocaleString()} / {bonus.requiredPV.toLocaleString()} PV</span>
                          </div>
                          {bonus.progress.achieved && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              ✓ Bonus Achieved
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rank Award Incentives</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Rank</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Cumulative PV</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Award (₦)</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Award ($)</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Max Capped PV</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonusData?.rankAwards.map((rank, index) => (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 text-sm font-medium text-gray-900">{rank.rank}</td>
                        <td className="py-3 text-sm text-gray-600">{rank.requiredPV.toLocaleString()} PV</td>
                        <td className="py-3 text-sm text-gray-600">
                          {rankAwards.find(r => r.rank === rank.rank)?.awardNGN}
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {rankAwards.find(r => r.rank === rank.rank)?.awardUSD}
                        </td>
                        <td className="py-3 text-sm text-gray-600">{rank.maxCapPerMember.toLocaleString()} PV</td>
                        <td className="py-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                rank.progress.achieved ? 'bg-green-500' : 'bg-[#0660D3]'
                              }`}
                              style={{ width: `${rank.progress.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{Math.round(rank.progress.progress)}%</span>
                            <span>{rank.progress.usedPV.toLocaleString()} / {rank.requiredPV.toLocaleString()} PV</span>
                          </div>
                          {rank.progress.achieved && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              ✓ Award Achieved
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Award Incentives</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Award Title</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Required TP</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Max Capped TP</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-600">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {travelAwards.map((award, index) => {
                      const progress = calculateProgress(rewardsData.cumulativeTP.current, award.requiredTP);
                      return (
                        <tr key={index} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 text-sm font-medium text-gray-900">{award.title}</td>
                          <td className="py-3 text-sm text-gray-600">{award.requiredTP.toLocaleString()} TP</td>
                          <td className="py-3 text-sm text-gray-600">{award.maxCappedTP.toLocaleString()} TP</td>
                          <td className="py-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#0660D3] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            id='txt'
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Description</th>
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-2 lg:py-3 text-xs lg:text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedTransactions.map((transaction, index) => (
                    <tr key={transaction.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {transaction.date}
                        </div>
                      </td>
                      <td className="py-2 lg:py-3 text-xs lg:text-sm text-gray-900">{transaction.description}</td>
                      <td className={`py-2 lg:py-3 text-xs lg:text-sm font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </td>
                      <td className="py-2 lg:py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                            transaction.status === 'Paid' || transaction.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : transaction.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {transaction.status === 'Paid' || transaction.status === 'Completed' ? <CheckCircle className="w-3 h-3" /> : null}
                          {transaction.status === 'Failed' ? <XCircle className="w-3 h-3" /> : null}
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {processedTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No transactions yet</p>
                <p className="text-sm mt-1">Your transactions will appear here</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default WalletPage;