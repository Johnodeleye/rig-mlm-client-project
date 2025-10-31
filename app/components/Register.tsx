'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Shield, ArrowRight, UserPlus, Lock, Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AuthRedirect from './AuthRedirect';
import { useSearchParams } from 'next/navigation';
import { useCurrency } from '@/context/CurrencyContext';

interface MembershipPackage {
  id: string;
  name: string;
  level: number;
  price: string;
  usdPrice: string;
  pv: number;
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
  const [isGeneratingUsername, setIsGeneratingUsername] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidatingReferral, setIsValidatingReferral] = useState(false);
  const [referralUser, setReferralUser] = useState<ReferralUser | null>(null);

  const searchParams = useSearchParams();
  const referralParam = searchParams.get('ref');
  const { currency, detectedCountry, isDetecting, convertAmount } = useCurrency();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralId: referralParam || 'REF123456',
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
            productContents: pkg.productContents
          }));
          setMembershipPackages(transformedPackages);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
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
        console.error('Error validating referral:', error);
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

  const generateUsername = useCallback(async (fullName: string) => {
    if (fullName.trim().length < 2) return;

    try {
      setIsGeneratingUsername(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/generate-username?fullName=${encodeURIComponent(fullName)}`);
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          username: data.username
        }));
      }
    } catch (error) {
      console.error('Error generating username:', error);
      toast.error('Failed to generate username');
    } finally {
      setIsGeneratingUsername(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.fullName.trim()) {
        generateUsername(formData.fullName);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.fullName, generateUsername]);

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
        setSuccess(true);
        toast.success('Registration successful!');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
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

  if (success) {
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
            <Shield className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Please contact your upline to activate your account.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-[#0660D3] hover:text-blue-700 font-semibold transition-colors"
          >
            Proceed to Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect requireAuth={false} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#0660D3] rounded-xl flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Join RIG Global</h1>
            </div>
            <p className="text-gray-600">Create your account and start your journey</p>
            
            {referralParam && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p className="text-sm text-blue-700">
                  You were referred by someone! Their referral ID has been auto-filled below.
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detected Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={
                        isDetecting 
                          ? 'Detecting location...' 
                          : `${detectedCountry} ${currency === 'NGN' ? '🇳🇬' : '🇺🇸'}`
                      }
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    {isDetecting && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral ID
                  </label>
                  <input
                    type="text"
                    name="referralId"
                    value={formData.referralId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                    placeholder="Enter referral ID"
                  />
                  
                  {isValidatingReferral && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validating referral ID...
                    </div>
                  )}
                  
                  {referralUser && !isValidatingReferral && (
                    <div className={`flex items-center gap-2 mt-2 text-sm ${
                      referralUser.isValid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {referralUser.isValid ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>
                        {referralUser.isValid 
                          ? `Referred by: ${referralUser.fullName} (@${referralUser.username})`
                          : referralUser.fullName
                        }
                      </span>
                    </div>
                  )}
                  
                  {formData.referralId === 'REF123456' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Leave as REF123456 if you don't have a referral ID
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                      placeholder="Generating username..."
                      readOnly={isGeneratingUsername}
                    />
                    {isGeneratingUsername && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Username is automatically generated from your full name
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                      placeholder="Create password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                      placeholder="Confirm password"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="membershipPackage" className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Package
                  </label>
                  <select
                    id="membershipPackage"
                    name="membershipPackage"
                    required
                    value={formData.membershipPackage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200 bg-white"
                  >
                    <option value="">Select a package</option>
                    {membershipPackages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - {pkg.price} ({pkg.usdPrice})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0660D3] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#0660D3] hover:text-blue-700 font-semibold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;