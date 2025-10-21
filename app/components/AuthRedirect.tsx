// components/AuthRedirect.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Shield, ArrowRight, UserX, LogOut } from "lucide-react";

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

  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
      
      // If authentication check is complete
      if (requireAuth) {
        // User must be authenticated
        if (!isAuthenticated) {
          router.push(redirectTo);
          return;
        }

        // Check account type restrictions
        if (isAuthenticated && accountType) {
          // Prevent admins from accessing user routes
          if (accountType === 'admin' && !pathname.includes('/admin')) {
            router.push('/admin/home');
            return;
          }

          // Prevent users from accessing admin routes
          if (accountType === 'user' && pathname.includes('/admin')) {
            router.push('/home');
            return;
          }
        }

        // If user needs to be active but is not active
        if (requireActive && accountType === 'user' && user && !user.isActive) {
          // Don't redirect, just show the activation message
          return;
        }

        // Redirect authenticated users away from auth pages
        if ((pathname === '/login' || pathname === '/register' || pathname === '/') && isAuthenticated) {
          if (accountType === 'admin') {
            router.push('/admin/home');
          } else if (accountType === 'user' && user?.isActive) {
            router.push('/home');
          }
         
        }
      } else {
        // For non-auth required pages, redirect authenticated users to appropriate dashboard
        if (isAuthenticated && accountType) {
          if (pathname === '/login' || pathname === '/register' || pathname === '/') {
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
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#0660D3] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="text-[#0660D3] font-semibold">Checking authentication...</div>
          <div className="mt-4 w-8 h-8 border-4 border-[#0660D3] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show activation required message for inactive users on protected routes
  if (requireAuth && requireActive && accountType === 'user' && user && !user.isActive && pathname !== '/login') {
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
            <UserX className="w-8 h-8 text-yellow-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Activation</h2>
          <p className="text-gray-600 mb-6">
            Your account is not yet active. Please contact your upline to activate your account.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full inline-flex items-center justify-center gap-2 text-[#0660D3] hover:text-blue-700 font-semibold transition-colors py-2 px-4 border border-[#0660D3] rounded-lg"
            >
              Back to Login
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors py-2 px-4 border border-gray-300 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show access denied message for wrong account type
  if (isAuthenticated && accountType) {
    // Users trying to access admin routes
    if (accountType === 'user' && pathname.includes('/admin')) {
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
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-8 h-8 text-red-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin dashboard. This area is restricted to administrators only.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/home')}
                className="w-full inline-flex items-center justify-center gap-2 text-[#0660D3] hover:text-blue-700 font-semibold transition-colors py-2 px-4 border border-[#0660D3] rounded-lg"
              >
                Go to User Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="w-full inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors py-2 px-4 border border-gray-300 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    // Admins trying to access user routes (when they shouldn't)
    if (accountType === 'admin' && !pathname.includes('/admin') && pathname !== '/login') {
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
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Account Detected</h2>
            <p className="text-gray-600 mb-6">
              You are logged in as an administrator. Redirecting you to the admin dashboard.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/home')}
                className="w-full inline-flex items-center justify-center gap-2 text-[#0660D3] hover:text-blue-700 font-semibold transition-colors py-2 px-4 border border-[#0660D3] rounded-lg"
              >
                Go to Admin Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={logout}
                className="w-full inline-flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors py-2 px-4 border border-gray-300 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      );
    }
  }

  return null;
}