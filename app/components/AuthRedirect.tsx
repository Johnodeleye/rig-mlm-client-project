"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  Shield, ArrowRight, UserX, LogOut, AlertCircle, 
  Lock, User, Crown, Info, CheckCircle,
  XCircle, Sparkles
} from "lucide-react";
import Image from "next/image";

interface AuthRedirectProps {
  requireAuth?: boolean;
  requireActive?: boolean;
  redirectTo?: string;
}

export default function AuthRedirect({ 
  requireAuth = false, 
  requireActive = true,
  redirectTo = "/login" 
}: AuthRedirectProps) {
  const { user, accountType, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true); 
  // test

  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
      
      const currentPath = pathname || '';

      if (requireAuth) {
        if (!isAuthenticated) {
          router.push(redirectTo);
          return;
        }

        if (isAuthenticated && accountType) {
          if (accountType === 'admin' && !currentPath.includes('/admin')) {
            router.push('/admin/home');
            return;
          }

          if (accountType === 'user' && currentPath.includes('/admin')) {
            router.push('/home');
            return;
          }
        }

        if (requireActive && accountType === 'user' && user && !user.isActive) {
          return;
        }

        if ((currentPath === '/login' || currentPath === '/register' || currentPath === '/') && isAuthenticated) {
          if (accountType === 'admin') {
            router.push('/admin/home');
          } else if (accountType === 'user' && user?.isActive) {
            router.push('/home');
          }
        }
      } else {
        if (isAuthenticated && accountType) {
          if (currentPath === '/login' || currentPath === '/register' || currentPath === '/') {
            if (accountType === 'admin') {
              router.push('/admin/home');
            } else if (accountType === 'user' && user?.isActive) {
              router.push('/home');
            }
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, user, accountType, requireAuth, requireActive, router, redirectTo, pathname]);

  if (isLoading || isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-orange-600 via-red-600 to-rose-700 z-50 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="relative w-24 h-24 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="RIG Global" 
                width={56} 
                height={56}
                className="object-contain brightness-0 invert"
              />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-white/30 border-t-white rounded-2xl"
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Shield className="w-6 h-6" />
              Verifying Access
            </h2>
            <p className="text-orange-100 mb-6">Please wait while we check your credentials...</p>
            
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-white rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const currentPath = pathname || '';

  if (requireAuth && requireActive && accountType === 'user' && user && !user.isActive && currentPath !== '/login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-rose-700 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <UserX className="w-12 h-12 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
              Account Pending Activation
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Your account is registered but not yet active. Please contact your upline to activate your account.
            </p>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Info className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900">What to do next?</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                  Contact your upline for account activation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                  Check your email for further instructions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                  Once activated, you can access all features
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Back to Login
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated && accountType === 'user' && currentPath.includes('/admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-rose-600 to-pink-700 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-rose-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Lock className="w-12 h-12 text-red-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              You don't have permission to access the admin dashboard. This area is restricted to administrators only.
            </p>

            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 mb-8 border border-red-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-gray-900">Why am I seeing this?</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  You're logged in as a regular user
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  Admin dashboard requires administrator privileges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  You can access your user dashboard instead
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/home')}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <User className="w-5 h-5" />
                Go to User Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated && accountType === 'admin' && !currentPath.includes('/admin') && currentPath !== '/login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-600 via-red-600 to-orange-700 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl"></div>
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
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-red-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <Crown className="w-12 h-12 text-rose-600" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-4 border-rose-400 border-t-transparent rounded-full"
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-red-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-2">
              <Sparkles className="w-7 h-7 text-rose-600" />
              Admin Access Detected
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              You are logged in as an administrator. Redirecting you to the admin dashboard for enhanced controls.
            </p>

            <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl p-6 mb-8 border border-rose-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-gray-900">Admin Privileges</h3>
              </div>
              <ul className="text-sm text-gray-700 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  Full system management access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  User and transaction oversight
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  Advanced analytics and reports
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/admin/home')}
                className="w-full bg-gradient-to-r from-rose-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Go to Admin Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Logout
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return null;
}