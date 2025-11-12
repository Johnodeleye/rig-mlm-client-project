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
  const referralParam = searchParams?.get('ref') || '';
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
        const { token } = data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('fromRegister', 'true');
        localStorage.setItem('registeredUserId', registeredUserId);
        
        toast.success('Login successful! Redirecting to payment...');
        
        setTimeout(() => {
          window.location.href = `/payment/${registeredUserId}`;
        }, 1000);
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
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-rose-700 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-rose-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative w-20 h-20 mx-auto mb-4"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Welcome to RIG Global! Please contact your upline to activate your account.
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-gray-900 text-sm">Next Steps</h3>
            </div>
            <ul className="text-xs text-gray-700 space-y-1.5">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span>Contact your upline for account activation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span>Check your email for registration details</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-orange-600 mt-0.5 flex-shrink-0" />
                <span>Login once your account is activated</span>
              </li>
            </ul>
          </div>

          {!showWalletPayment ? (
            <div className="space-y-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                Proceed to Login
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => setShowWalletPayment(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-orange-600 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all duration-300 group"
              >
                <Wallet className="w-4 h-4" />
                Pay with Wallet
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-200"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Wallet className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-gray-900">Pay with Wallet</h3>
              </div>
              <p className="text-xs text-gray-600 mb-3 text-center">
                Enter login details of the account you want to pay with
              </p>

              <form onSubmit={handleWalletLogin} className="space-y-3">
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={walletLoginData.username}
                  onChange={(e) => setWalletLoginData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-white text-sm"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={walletLoginData.password}
                  onChange={(e) => setWalletLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-white text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={isWalletLoggingIn}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isWalletLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  {isWalletLoggingIn ? 'Logging In...' : 'Login & Pay Now'}
                </button>
              </form>

              <button
                onClick={() => setShowWalletPayment(false)}
                className="w-full mt-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors py-2 text-sm"
              >
                ← Back
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect requireAuth={false} />
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-rose-700 flex items-center justify-center p-4 py-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-3xl relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 mb-3"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30 shadow-xl"
              >
                <Image 
                  src="/logo.png" 
                  alt="RIG Global" 
                  width={28} 
                  height={28}
                  className="object-contain brightness-0 invert"
                />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white leading-none">
                  Join RIG Global
                </h1>
                <p className="text-orange-100 text-xs flex items-center justify-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3" />
                  Start your success journey
                </p>
              </div>
            </motion.div>

            {referralParam && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-lg inline-block"
              >
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-yellow-300" />
                  <p className="text-xs font-bold text-white">
                    You have a special invitation!
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Location & Referral */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-orange-600" />
                    Detected Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={isDetecting ? 'Detecting...' : `${detectedCountry} ${currency === 'NGN' ? '🇳🇬' : '🇺🇸'}`}
                      disabled
                      className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    />
                    {isDetecting && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-orange-600" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-rose-600" />
                    Referral ID
                  </label>
                  <input
                    type="text"
                    name="referralId"
                    value={formData.referralId}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm"
                    placeholder="Enter referral ID"
                  />
                  
                  {isValidatingReferral && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-orange-600">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Validating...
                    </div>
                  )}
                  
                  {referralUser && !isValidatingReferral && (
                    <div className={`flex items-center gap-1.5 mt-1.5 text-xs px-2 py-1 rounded ${
                      referralUser.isValid 
                        ? 'text-emerald-700 bg-emerald-50' 
                        : 'text-red-700 bg-red-50'
                    }`}>
                      {referralUser.isValid ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>
                        {referralUser.isValid 
                          ? `${referralUser.fullName}`
                          : referralUser.fullName
                        }
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-orange-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm"
                        placeholder="Choose username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        name="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm"
                        placeholder="+234 000 000 0000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm"
                        placeholder="Min. 6 characters"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm"
                        placeholder="Re-enter password"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Package */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-rose-600" />
                  Membership Package
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Select Package</label>
                  <select
                    name="membershipPackage"
                    required
                    value={formData.membershipPackage}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm cursor-pointer"
                  >
                    <option value="">Choose a package</option>
                    {membershipPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - {pkg.price} • PV: {pkg.pv} | TP: {pkg.tp}
                      </option>
                    ))}
                  </select>
                  
                  <AnimatePresence>
                    {formData.membershipPackage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3"
                      >
                        {membershipPackages
                          .filter(pkg => pkg.id === formData.membershipPackage)
                          .map(pkg => (
                            <div key={pkg.id} className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-200 rounded-xl p-4">
                              <div className="flex items-center gap-1.5 mb-3">
                                <Star className="w-4 h-4 text-rose-600" />
                                <h4 className="font-bold text-gray-900 text-sm">Package Details</h4>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="bg-white/80 rounded-lg p-3 border border-orange-200">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-orange-600" />
                                    <span className="text-xs text-gray-600 font-semibold">PV Points</span>
                                  </div>
                                  <p className="text-xl font-bold text-orange-700">{pkg.pv}</p>
                                </div>
                                <div className="bg-white/80 rounded-lg p-3 border border-emerald-200">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-xs text-gray-600 font-semibold">TP Points</span>
                                  </div>
                                  <p className="text-xl font-bold text-emerald-700">{pkg.tp}</p>
                                </div>
                              </div>
                              <div className="bg-white/80 rounded-lg p-3 border border-rose-200">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <Gift className="w-3.5 h-3.5 text-rose-600" />
                                  <span className="text-xs font-bold text-gray-900">Package Contents</span>
                                </div>
                                <p className="text-xs text-gray-700 leading-relaxed">{pkg.productContents}</p>
                              </div>
                            </div>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 text-white py-3.5 px-6 rounded-xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>

                <p className="text-center mt-4 text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-orange-600 hover:text-orange-700 font-bold transition-colors inline-flex items-center gap-1"
                  >
                    Sign in
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>

          <p className="text-center mt-6 text-white/70 text-xs">
            © 2025 RIG Global. All rights reserved.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Register;