'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Lock, User, Shield, ArrowRight, CheckCircle, Wallet, AlertCircle, Package } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface UserData {
  id: string;
  fullName: string;
  username: string;
  membershipPackage: string;
  walletBalance: number;
}

interface PackageData {
  id: string;
  packageId: string;
  name: string;
  level: number;
  priceNGN: number;
  priceUSD: number;
  pv: number;
  tp: number;
  productContents: string;
}

interface WalletData {
  availableBalance: number;
  totalEarnings: number;
}

const UpgradePaymentPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPackage, setCurrentPackage] = useState<PackageData | null>(null);
  const [newPackage, setNewPackage] = useState<PackageData | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const userId = params?.userId as string;
  const packageId = searchParams?.get('package');

  useEffect(() => {
    if (userId && packageId) {
      fetchPaymentData();
    }
  }, [userId, packageId]);

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
        const userDataResponse = await userRes.json();
        const packagesData = await packagesRes.json();
        const walletDataRes = await walletRes.json();

        if (!userDataResponse.users || userDataResponse.users.length === 0) {
          setError('User not found');
          return;
        }

        const foundUser = userDataResponse.users[0];

        setUserData({
          id: foundUser.id,
          fullName: foundUser.fullName,
          username: foundUser.username,
          membershipPackage: foundUser.membershipPackage,
          walletBalance: foundUser.walletBalance
        });

        setWalletData(walletDataRes.walletData);

        const allPackages = packagesData.packages || [];
        
        const currentPkg = allPackages.find(
          (pkg: PackageData) => pkg.packageId === foundUser.membershipPackage
        );
        
        const newPkg = allPackages.find(
          (pkg: PackageData) => pkg.packageId === packageId
        );

        if (!newPkg) {
          setError('Package not found');
          return;
        }

        if (currentPkg && newPkg.level <= currentPkg.level) {
          setError('You can only upgrade to a higher level package');
          return;
        }

        setCurrentPackage(currentPkg || null);
        setNewPackage(newPkg);
      } else {
        setError('Failed to load payment data');
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError('Failed to load payment data');
    } finally {
      setIsLoading(false);
    }
  };

  const getUpgradePrice = (): number => {
    if (!currentPackage || !newPackage) return newPackage?.priceNGN || 0;
    return newPackage.priceNGN - currentPackage.priceNGN;
  };

  const getUpgradePV = (): number => {
    if (!currentPackage || !newPackage) return newPackage?.pv || 0;
    return newPackage.pv - currentPackage.pv;
  };

  const getUpgradeTP = (): number => {
    if (!currentPackage || !newPackage) return newPackage?.tp || 0;
    return newPackage.tp - currentPackage.tp;
  };

  const handlePayment = async () => {
    if (!userData || !newPackage || !walletData) return;

    const upgradePrice = getUpgradePrice();

    if (walletData.availableBalance < upgradePrice) {
      setError('Insufficient funds in your wallet');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

      const upgradeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/api/users/upgrade-package`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            packageId: newPackage.packageId,
            amount: upgradePrice
          })
        }
      );

      if (!upgradeResponse.ok) {
        const errorData = await upgradeResponse.json();
        throw new Error(errorData.error || 'Failed to upgrade package');
      }

      setPaymentSuccess(true);

      setTimeout(() => {
        router.push('/upgrade');
      }, 3000);

    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && !paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/upgrade')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Upgrade
          </button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Successful!</h2>
          <p className="text-gray-600 mb-4">
            You have successfully upgraded to {newPackage?.name} package.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting back to upgrade page...
          </p>
        </motion.div>
      </div>
    );
  }

  const upgradePrice = getUpgradePrice();
  const upgradePV = getUpgradePV();
  const upgradeTP = getUpgradeTP();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Upgrade Package</h1>
          </motion.div>
          <p className="text-gray-600">Upgrade your package using your wallet balance</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upgrade Summary</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User:</span>
              <span className="font-semibold">{userData?.fullName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Username:</span>
              <span className="font-semibold">@{userData?.username}</span>
            </div>
            
            {currentPackage && (
              <div className="flex justify-between items-center py-2 border-y border-gray-100">
                <span className="text-gray-600">Current Package:</span>
                <span className="font-semibold text-sm">{currentPackage.name}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Package:</span>
              <span className="font-semibold">{newPackage?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Level:</span>
              <span className="font-semibold">Level {newPackage?.level}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">PV/TP Gain:</span>
              <span className="font-semibold">+{upgradePV}PV +{upgradeTP}TP</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Upgrade Amount:</span>
                <span className="text-xl font-bold text-blue-600">
                  ₦{upgradePrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Balance</h3>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Available Balance</p>
                <p className="text-xl font-bold text-gray-900">
                  ₦{walletData?.availableBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {walletData && walletData.availableBalance < upgradePrice && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">
                Insufficient balance. You need ₦{(upgradePrice - walletData.availableBalance).toLocaleString()} more.
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={isProcessing || !walletData || !newPackage || walletData.availableBalance < upgradePrice}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Pay & Upgrade Package
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Secure payment processed by RIG Global</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UpgradePaymentPage;