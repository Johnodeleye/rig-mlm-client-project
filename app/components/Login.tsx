'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, User, Lock, Mail, ArrowRight, Shield, Loader2, 
  Sparkles, CheckCircle, AlertCircle, LogIn, UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthRedirect from './AuthRedirect';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false
  });

  const router = useRouter();
  const { login, user, accountType, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (accountType === 'admin') {
        router.push('/admin/home');
      } else if (accountType === 'user' && user.isActive) {
        router.push('/home');
      }
    }
  }, [isAuthenticated, user, accountType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData.emailOrUsername, formData.password, formData.rememberMe);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isAuthenticated && accountType === 'user' && user && !user.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-rose-700 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Account Pending Activation
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Your account is not yet active. Please contact your upline to activate your account.
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-orange-600" />
              <h3 className="font-bold text-gray-900 text-sm">What to do next?</h3>
            </div>
            <ul className="text-xs text-gray-700 space-y-1.5">
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 bg-orange-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Contact your upline for account activation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 bg-orange-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Check your email for registration confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 bg-orange-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Once activated, you can access your dashboard</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 group"
            >
              Try Again
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="/register"
              className="block w-full text-center text-gray-600 hover:text-gray-800 font-semibold transition-colors py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50"
            >
              Create New Account
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AuthRedirect requireAuth={false} />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-rose-700 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-orange-400/10 rounded-full blur-2xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
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
                <h1 className="text-3xl font-bold text-white leading-none">RIG Global</h1>
                <p className="text-orange-100 text-xs flex items-center justify-center gap-1 mt-1">
                  <Sparkles className="w-3 h-3" />
                  Welcome back!
                </p>
              </div>
            </motion.div>
            <p className="text-orange-100 text-sm">Sign in to continue your journey</p>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:p-8"
          >
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <LogIn className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
              </div>
              <p className="text-center text-gray-600 text-xs">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="emailOrUsername" className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-orange-600" />
                  Email or Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="emailOrUsername"
                    name="emailOrUsername"
                    type="text"
                    required
                    value={formData.emailOrUsername}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your email or username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white text-sm hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                    Remember me
                  </span>
                </label>
                
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-orange-600 hover:text-orange-700 transition-colors font-bold flex items-center gap-1 group"
                >
                  Forgot Password?
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 text-white py-3.5 px-6 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-semibold">OR</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-xs mb-3">
                Don&apos;t have an account?
              </p>
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 border-2 border-orange-600 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-all duration-300 group"
              >
                <UserCheck className="w-4 h-4" />
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-5 p-3 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-orange-600" />
                <p className="text-xs font-bold text-gray-900">Note for Admins</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Admin accounts will be automatically redirected to the admin dashboard
              </p>
            </motion.div>
          </motion.div>

          <p className="text-center mt-6 text-white/70 text-xs">
            © 2025 RIG Global. All rights reserved.
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;