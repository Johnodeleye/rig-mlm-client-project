'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, User, Mail, Phone, MapPin, Shield, ArrowRight, 
  UserPlus, Lock, Loader2, CheckCircle, XCircle, Sparkles, 
  Package, TrendingUp, Award, Star, Gift, Globe, Check,
  Wallet, LogIn
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AuthRedirect from './AuthRedirect';
import { useSearchParams } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';
import Image from 'next/image';

interface MembershipPackage {
  id: string;
  name: string;
  level: number;
  price: string;
  usdPrice: string;
  pv: number;
  tp: number;
  productContents: string;
}

interface ReferralUser {
  fullName: string;
  username: string;
  isValid: boolean;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);
  const [referralUser, setReferralUser] = useState<ReferralUser | null>(null);
  const [showWalletPayment, setShowWalletPayment] = useState(false);
  const [walletLoginData, setWalletLoginData] = useState({
    username: '',
    password: ''
  });
  const [isWalletLoggingIn, setIsWalletLoggingIn] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState('');

  const searchParams = useSearchParams();
  const referralParam = searchParams.get('ref');
  const { currency, detectedCountry, isDetecting } = useCurrency();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralId: referralParam || '',
    membershipPackage: ''
  });

  const [membershipPackages, setMembershipPackages] = useState<MembershipPackage[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/packages`);
        const data = await response.json();
        if (data.success) {
          const transformedPackages = data.packages.map((pkg: any) => ({
            id: pkg.packageId,
            name: pkg.name,
            level: pkg.level,
            price: currency === 'NGN' ? `₦${pkg.priceNGN.toLocaleString()}` : `$${pkg.priceUSD.toFixed(2)}`,
            usdPrice: `$${pkg.priceUSD.toFixed(2)}`,
            pv: pkg.pv,
            tp: pkg.tp,
            productContents: pkg.productContents
          }));
          setMembershipPackages(transformedPackages);
        }
      } catch (error) {
        toast.error('Failed to load membership packages');
      }
    };

    fetchPackages();
  }, [currency]);

  useEffect(() => {
    const validateReferralId = async (referralId: string) => {
      if (!referralId || referralId === 'REF123456') {
        setReferralUser(null);
        return;
      }

      try {
        setIsValidatingReferral(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/users/validate-referral?referralId=${encodeURIComponent(referralId)}`
        );
        const data = await response.json();
        
        if (data.success && data.user) {
          setReferralUser({
            fullName: data.user.fullName,
            username: data.user.username,
            isValid: true
          });
        } else {
          setReferralUser({
            fullName: 'Invalid Referral ID',
            username: '',
            isValid: false
          });
        }
      } catch (error) {
        setReferralUser({
          fullName: 'Error validating referral',
          username: '',
          isValid: false
        });
      } finally {
        setIsValidatingReferral(false);
      }
    };

    if (formData.referralId) {
      validateReferralId(formData.referralId);
    }
  }, [formData.referralId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!formData.membershipPackage) {
      toast.error('Please select a membership package');
      return;
    }

    if (formData.referralId && formData.referralId !== 'REF123456' && referralUser && !referralUser.isValid) {
      toast.error('Please enter a valid referral ID');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          country: detectedCountry || 'Nigeria'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRegisteredUserId(data.user.id);
        setSuccess(true);
        toast.success('Registration successful!');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWalletLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletLoginData.username || !walletLoginData.password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsWalletLoggingIn(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: walletLoginData.username,
          password: walletLoginData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Login successful! Redirecting to payment...');
        setTimeout(() => {
          window.location.href = `/payment/${registeredUserId}`;
        }, 1500);
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsWalletLoggingIn(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
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
            className="relative w-24 h-24 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Registration Successful!
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Welcome to RIG Global! Please contact your upline to activate your account.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Next Steps</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Contact your upline for account activation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Check your email for registration details
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Login once your account is activated
                </li>
              </ul>
            </div>

            {!showWalletPayment ? (
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  Proceed to Login
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowWalletPayment(true)}
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 group"
                >
                  <Wallet className="w-5 h-5" />
                  Or Pay with Wallet
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Wallet className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Pay with Wallet</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Enter login details of the account you want to pay with
                </p>

                <form onSubmit={handleWalletLogin} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Username or Email"
                      value={walletLoginData.username}
                      onChange={(e) => setWalletLoginData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white font-medium"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={walletLoginData.password}
                      onChange={(e) => setWalletLoginData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white font-medium"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isWalletLoggingIn}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isWalletLoggingIn ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <LogIn className="w-5 h-5" />
                    )}
                    {isWalletLoggingIn ? 'Logging In...' : 'Login & Pay Now'}
                  </motion.button>
                </form>

                <button
                  onClick={() => setShowWalletPayment(false)}
                  className="w-full mt-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors py-2"
                >
                  ← Back to options
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect requireAuth={false} />
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl relative z-10"
        >
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

  <div className="flex flex-col justify-center">
    <h1 className="text-4xl font-bold text-white mb-1 leading-none whitespace-nowrap">
      Join RIG Global
    </h1>
    <p className="text-blue-100 text-sm flex items-center gap-1">
      <Sparkles className="w-4 h-4" />
      Start your journey to success today
    </p>
  </div>
</div>

            
            <AnimatePresence>
              {referralParam && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-yellow-300" />
                    <p className="text-sm font-bold text-white">
                      Special Invitation!
                    </p>
                  </div>
                  <p className="text-sm text-blue-100">
                    You were referred by someone! Their referral ID has been auto-filled below.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    Detected Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="text"
                      value={
                        isDetecting 
                          ? 'Detecting location...' 
                          : `${detectedCountry} ${currency === 'NGN' ? '🇳🇬' : '🇺🇸'}`
                      }
                      disabled
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 cursor-not-allowed font-medium"
                    />
                    {isDetecting && (
                      <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-blue-600" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Referral ID
                  </label>
                  <input
                    type="text"
                    name="referralId"
                    value={formData.referralId}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium"
                    placeholder="Enter referral ID"
                  />
                  
                  {isValidatingReferral && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validating referral ID...
                    </motion.div>
                  )}
                  
                  <AnimatePresence>
                    {referralUser && !isValidatingReferral && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-center gap-2 mt-2 text-sm px-3 py-2 rounded-lg ${
                          referralUser.isValid 
                            ? 'text-green-700 bg-green-50 border border-green-200' 
                            : 'text-red-700 bg-red-50 border border-red-200'
                        }`}
                      >
                        {referralUser.isValid ? (
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="font-medium">
                          {referralUser.isValid 
                            ? `✨ Referred by: ${referralUser.fullName} (@${referralUser.username})`
                            : referralUser.fullName
                          }
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {formData.referralId === '' && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      💡 No referral ID
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t-2 border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium hover:border-gray-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium hover:border-gray-300"
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium hover:border-gray-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium hover:border-gray-300"
                        placeholder="+234 000 000 0000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Security
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium hover:border-gray-300"
                        placeholder="Min. 6 characters"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium hover:border-gray-300"
                        placeholder="Re-enter password"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Membership Package
                </h3>
                <div>
                  <label htmlFor="membershipPackage" className="block text-sm font-bold text-gray-700 mb-2">
                    Select Your Package
                  </label>
                  <select
                    id="membershipPackage"
                    name="membershipPackage"
                    required
                    value={formData.membershipPackage}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white font-medium hover:border-gray-300 cursor-pointer"
                  >
                    <option value="">Choose a membership package</option>
                    {membershipPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - {pkg.price} ({pkg.usdPrice}) • PV: {pkg.pv} | TP: {pkg.tp}
                      </option>
                    ))}
                  </select>
                  
                  <AnimatePresence>
                    {formData.membershipPackage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        {membershipPackages
                          .filter(pkg => pkg.id === formData.membershipPackage)
                          .map(selectedPkg => (
                            <div 
                              key={selectedPkg.id} 
                              className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6"
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5 text-purple-600" />
                                <h4 className="font-bold text-gray-900">Package Details</h4>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs text-gray-600 font-semibold">PV Points</span>
                                  </div>
                                  <p className="text-2xl font-bold text-blue-700">{selectedPkg.pv}</p>
                                </div>
                                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-green-200">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Award className="w-4 h-4 text-green-600" />
                                    <span className="text-xs text-gray-600 font-semibold">TP Points</span>
                                  </div>
                                  <p className="text-2xl font-bold text-green-700">{selectedPkg.tp}</p>
                                </div>
                              </div>
                              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <Gift className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm font-bold text-gray-900">Package Contents</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{selectedPkg.productContents}</p>
                              </div>
                            </div>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="pt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-5 px-6 rounded-xl font-bold text-lg hover:shadow-2xl focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Creating Your Account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-6 h-6" />
                        Create Account
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </motion.button>

                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      href="/login" 
                      className="text-blue-600 hover:text-blue-700 font-bold transition-colors inline-flex items-center gap-1 group"
                    >
                      Sign in here
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8 text-white/80 text-sm"
          >
            <p>© 2025 RIG Global. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;