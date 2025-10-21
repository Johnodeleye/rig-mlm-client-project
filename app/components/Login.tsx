// components/Login.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, Mail, ArrowRight, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthRedirect from './AuthRedirect';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false
  });

     const router = useRouter();
  const { login, user, accountType, isLoading, isAuthenticated } = useAuth();

  // Redirect if user is already authenticated
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

  // Show activation message if user is authenticated but not active
  if (isAuthenticated && accountType === 'user' && user && !user.isActive) {
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
            className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="w-8 h-8 text-yellow-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Activation</h2>
          <p className="text-gray-600 mb-6">
            Your account is not yet active. Please contact your upline to activate your account.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex items-center justify-center gap-2 text-[#0660D3] hover:text-blue-700 font-semibold transition-colors py-2 px-4 border border-[#0660D3] rounded-lg"
            >
              Try Again
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/register"
              className="block w-full text-center text-gray-600 hover:text-gray-800 font-semibold transition-colors py-2 px-4"
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
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#0660D3] rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">RIG Global</h1>
            </div>
            <p className="text-gray-600">Welcome back to your account</p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Username */}
              <div>
                <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="emailOrUsername"
                    name="emailOrUsername"
                    type="text"
                    required
                    value={formData.emailOrUsername}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                    placeholder="Enter your email or username"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
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
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#0660D3] border-gray-300 rounded focus:ring-[#0660D3]"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-[#0660D3] hover:text-blue-700 transition-colors font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0660D3] text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/" 
                  className="text-[#0660D3] hover:text-blue-700 font-semibold transition-colors"
                >
                  Register now
                </Link>
              </p>
            </div>

            {/* Admin Login Note */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Admin accounts will be automatically redirected to admin dashboard
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;