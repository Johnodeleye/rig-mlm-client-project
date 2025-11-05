'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Lock, User, Shield, ArrowRight, CheckCircle, Wallet, 
  AlertCircle, Loader2, Package, TrendingUp, Award, Sparkles, 
  CreditCard, Info, XCircle, ArrowLeft, Check, Star
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface ReferralUser {
  id: string;
  fullName: string;
  username: string;
  membershipPackage: string;
 isActive: boolean | null;
}

interface WalletData {
  availableBalance: number;
  totalEarnings: number;
}

interface PackageData {
  name: string;
  priceNGN: number;
  pv: number;
  tp: number;
}

const PaymentPage = () => {
  const [referralUser, setReferralUser] = useState<ReferralUser | null>(null);
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const userId = params.userId as string;

  useEffect(() => {
    fetchPaymentData();
  }, [userId]);

  const fetchPaymentData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!token) {
        setError('Please login first');
        return;
      }

      const [userRes, packagesRes, walletRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/search?q=${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/packages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/wallet/my-wallet`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (userRes.ok && packagesRes.ok && walletRes.ok) {
        const userData = await userRes.json();
        const packagesData = await packagesRes.json();
        const walletDataRes = await walletRes.json();

        const foundUser = userData.users?.find((u: any) => u.id === userId);
        if (!foundUser) {
          setError('User not found');
          return;
        }

        if (foundUser.isActive) {
          setError('User is already active');
          return;
        }

        setReferralUser(foundUser);
        setWalletData(walletDataRes.walletData);

        const userPackage = packagesData.packages?.find(
          (pkg: any) => pkg.packageId === foundUser.membershipPackage
        );
        
        if (userPackage) {
          setPackageData({
            name: userPackage.name,
            priceNGN: userPackage.priceNGN,
            pv: userPackage.pv,
            tp: userPackage.tp
          });
        }
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError('Failed to load payment data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!referralUser || !packageData || !walletData) return;

    if (walletData.availableBalance < packageData.priceNGN) {
      setError('Insufficient funds in your wallet');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

      const activateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/commissions/activate-user/${referralUser.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!activateResponse.ok) {
        const errorData = await activateResponse.json();
        throw new Error(errorData.error || 'Failed to activate user');
      }

      setPaymentSuccess(true);

      setTimeout(() => {
        router.push('/referrals');
      }, 3000);

    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 max-w-md w-full text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Payment Details</h3>
          <p className="text-gray-600">Please wait while we fetch the information...</p>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-pink-700 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative w-24 h-24 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border border-red-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Info className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-gray-900">What to do next?</h3>
            </div>
            <ul className="text-sm text-gray-700 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                Check your wallet balance
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                Verify the user details
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                Contact support if issue persists
              </li>
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/referrals')}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-6 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Referrals
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Success State
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative w-28 h-28 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-14 h-14 text-green-600" />
            </div>
            {/* Confetti Effect */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-4 border-green-400 rounded-full"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-2 text-lg">
              You have successfully activated
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-8">
              {referralUser?.fullName}'s account 🎉
            </p>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-gray-900">Transaction Summary</h3>
              </div>
              <div className="space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-bold text-gray-900">@{referralUser?.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-bold text-gray-900">{packageData?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-600">₦{packageData?.priceNGN.toLocaleString()}</span>
                </div>
                <div className="border-t border-green-200 pt-3 flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="flex items-center gap-1 text-green-600 font-bold">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to referrals in a moment...</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/referrals')}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Go to Referrals Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Main Payment Interface
  const hasInsufficientBalance = walletData && packageData ? walletData.availableBalance < packageData.priceNGN : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl"
            >
              <Image 
                src="/logo.png" 
                alt="RIG Global" 
                width={40} 
                height={40}
                className="object-contain brightness-0 invert"
              />
            </motion.div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white mb-1">Activate Account</h1>
              <p className="text-blue-100 text-sm flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                Secure wallet payment
              </p>
            </div>
          </div>
          <p className="text-blue-100 text-lg">Review and confirm the activation details below</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">User Information</h3>
                <p className="text-sm text-gray-500">Account to be activated</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Full Name</p>
                <p className="font-bold text-gray-900 text-lg">{referralUser?.fullName}</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Username</p>
                <p className="font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  @{referralUser?.username}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <p className="font-bold text-orange-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Pending Activation
                </p>
              </div>
            </div>
          </motion.div>

          {/* Package Details Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Package Details</h3>
                <p className="text-sm text-gray-500">Membership benefits</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Package Name</p>
                <p className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-600" />
                  {packageData?.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-gray-600">PV Points</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">+{packageData?.pv}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-green-600" />
                    <p className="text-xs text-gray-600">TP Points</p>
                  </div>
                  <p className="text-2xl font-bold text-green-700">+{packageData?.tp}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-300">
                <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  ₦{packageData?.priceNGN.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your Wallet</h3>
              <p className="text-sm text-gray-500">Available balance</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 border-2 border-green-400 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Available Balance
                </p>
                <p className="text-4xl font-bold text-white mb-2">
                  ₦{walletData?.availableBalance.toLocaleString()}
                </p>
                {packageData && walletData && (
                  <p className="text-green-100 text-sm">
                    {hasInsufficientBalance 
                      ? `Need ₦${(packageData.priceNGN - walletData.availableBalance).toLocaleString()} more`
                      : `After payment: ₦${(walletData.availableBalance - packageData.priceNGN).toLocaleString()}`
                    }
                  </p>
                )}
              </div>
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <AnimatePresence>
            {hasInsufficientBalance && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900 mb-1">Insufficient Balance</p>
                    <p className="text-red-700 text-sm">
                      You need ₦{packageData && walletData ? (packageData.priceNGN - walletData.availableBalance).toLocaleString() : '0'} more to complete this transaction. Please add funds to your wallet.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Payment Button Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"
        >
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900 mb-1">Payment Error</p>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: hasInsufficientBalance || isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: hasInsufficientBalance || isProcessing ? 1 : 0.98 }}
            onClick={handlePayment}
            disabled={isProcessing || hasInsufficientBalance}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-5 px-6 rounded-xl font-bold text-lg hover:shadow-2xl focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 flex items-center gap-3">
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing Payment...
                </>
              ) : hasInsufficientBalance ? (
                <>
                  <AlertCircle className="w-6 h-6" />
                  Insufficient Balance
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Pay & Activate Account
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </motion.button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Secure payment processed by RIG Global</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/referrals')}
            className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Cancel & Go Back
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;