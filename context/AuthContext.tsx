// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  referralId: string;
  membershipPackage: string;
  country: string;
  isActive: boolean;
  pv: number;
  tp: number;
  walletBalance: number;
  totalEarnings: number;
  totalReferrals: number;
  createdAt: string;
}

interface Admin {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

type AccountType = 'user' | 'admin';

interface AuthContextType {
  user: User | Admin | null;
  accountType: AccountType | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  userProfile: {
    name: string;
    email: string;
    username: string;
    plan: string;
    pv: number;
    tp: number;
    walletBalance: number;
    totalEarnings: number;
    totalReferrals: number;
    isActive: boolean;
  } | null;
  fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | Admin | null>(null);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    username: string;
    plan: string;
    pv: number;
    tp: number;
    walletBalance: number;
    totalEarnings: number;
    totalReferrals: number;
    isActive: boolean;
  } | null>(null);
  
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!storedToken) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.account) {
          const userData = data.account;
          setUserProfile({
            name: userData.fullName || userData.username,
            email: userData.email || 'user@example.com',
            username: userData.username,
            plan: userData.membershipPackage || 'No Plan',
            pv: userData.pv || 0,
            tp: userData.tp || 0,
            walletBalance: userData.walletBalance || 0,
            totalEarnings: userData.totalEarnings || 0,
            totalReferrals: userData.totalReferrals || 0,
            isActive: userData.isActive || false
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.account);
          setAccountType(data.accountType);
          setToken(storedToken);
          // Fetch user profile data after successful auth
          await fetchUserProfile();
        } else {
          // Token is invalid
          clearAuthData();
        }
      } else {
        // Token is invalid
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setUser(null);
    setAccountType(null);
    setToken(null);
    setUserProfile(null);
  };

  const login = async (username: string, password: string, rememberMe: boolean = false) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { account, accountType, token: authToken } = data;
        
        // Store token based on remember me preference
        if (rememberMe) {
          localStorage.setItem('authToken', authToken);
        } else {
          sessionStorage.setItem('authToken', authToken);
        }
        
        setUser(account);
        setAccountType(accountType);
        setToken(authToken);
        
        // Fetch user profile data after login
        await fetchUserProfile();
        
        toast.success(`Login successful! Welcome ${accountType === 'admin' ? 'Admin' : ''}${account.username}`);
        
        // Redirect based on account type and status
        if (accountType === 'admin') {
          router.push('/admin/home');
        } else if (accountType === 'user') {
          if (account.isActive) {
            router.push('/home');
          } else {
            // User is not active, they'll see the activation message
            // We don't redirect, just let them stay on login page with the message
          }
        }
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Call logout endpoint
    fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch(console.error);

    // Clear all auth data
    clearAuthData();
    
    toast.success('Logged out successfully');
    
    // Redirect to login page
    if (accountType === 'admin') {
      router.push('/admin');
    } else {
      router.push('/login');
    }
  };

  const value: AuthContextType = {
    user,
    accountType,
    token,
    isLoading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user && !!token,
    userProfile,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};