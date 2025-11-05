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
  membershipPackage?: string;
  country: string;
  isActive: boolean;
  pv: number;
  tp: number;
  isStockist?: boolean;
  walletBalance: number;
  totalEarnings: number;
  totalReferrals: number;
  profilePicture?: string;
  createdAt: string;
}

interface Admin {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  phoneNumber: string;
  referralId: string;
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
    profilePicture?: string;
    country?: string;
    phoneNumber?: string;
    referralId?: string;
    isStockist?: boolean;
  } | null;
  fetchUserProfile: () => Promise<void>;
  updateProfilePicture: (profilePicture: string) => Promise<void>;
  getStoredToken: () => string | null;
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
    profilePicture?: string;
    referralId?: string;
    isStockist?: boolean;
  } | null>(null);
  
  const router = useRouter();

  const getStoredToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  };

  const fetchUserProfile = async () => {
    try {
      const storedToken = getStoredToken();
      if (!storedToken) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('AuthContext - fetchUserProfile API Response:', data);
        if (data.success && data.account) {
          const userData = data.account;
          const profileData = {
            name: userData.fullName || userData.username,
            email: userData.email || 'user@example.com',
            username: userData.username,
            plan: userData.membershipPackage || 'No Plan',
            pv: userData.pv || 0,
            tp: userData.tp || 0,
            referralId: userData.referralId || '',
            walletBalance: userData.walletBalance || 0,
            totalEarnings: userData.totalEarnings || 0,
            totalReferrals: userData.totalReferrals || 0,
            isActive: userData.isActive || false,
            profilePicture: userData.profilePicture,
            isStockist: userData.isStockist || false
          };
          console.log('AuthContext - fetchUserProfile setting userProfile:', profileData);
          setUserProfile(profileData);
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const updateProfilePicture = async (profilePicture: string) => {
    try {
      const storedToken = getStoredToken();
      if (!storedToken) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/upload-profile-picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        body: JSON.stringify({ profilePicture })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserProfile(prev => prev ? { ...prev, profilePicture } : null);
          toast.success('Profile picture updated successfully');
        }
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const storedToken = getStoredToken();
      
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
        console.log('AuthContext - checkAuth response:', data);
        if (data.success) {
          setUser(data.account);
          setAccountType(data.accountType);
          setToken(storedToken);
          
          if (data.account) {
            const userData = data.account;
            const profileData = {
              name: userData.fullName || userData.username,
              email: userData.email || 'user@example.com',
              username: userData.username,
              plan: userData.membershipPackage || 'No Plan',
              pv: userData.pv || 0,
              tp: userData.tp || 0,
              walletBalance: userData.walletBalance || 0,
              totalEarnings: userData.totalEarnings || 0,
              totalReferrals: userData.totalReferrals || 0,
              isActive: userData.isActive || false,
              profilePicture: userData.profilePicture,
              isStockist: userData.isStockist || false
            };
            console.log('AuthContext - checkAuth setting profile:', profileData);
            setUserProfile(profileData);
          }
        } else {
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthContext - Initial checkAuth');
    checkAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === null) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const clearAuthData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
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
      console.log('AuthContext - Login response:', data);

      if (data.success) {
        const { account, accountType, token: authToken } = data;
        
        if (rememberMe) {
          localStorage.setItem('authToken', authToken);
        } else {
          sessionStorage.setItem('authToken', authToken);
        }
        
        setUser(account);
        setAccountType(accountType);
        setToken(authToken);
        
        // Immediately fetch the full user profile with points data
        if (accountType === 'user') {
          await fetchUserProfile();
        } else {
          // For admin, just set basic profile
          const profileData = {
            name: account.username,
            email: account.email || 'admin@example.com',
            username: account.username,
            plan: 'Admin',
            pv: 0,
            tp: 0,
            walletBalance: 0,
            totalEarnings: 0,
            totalReferrals: 0,
            isActive: account.isActive || false,
            profilePicture: undefined,
            isStockist: false
          };
          console.log('AuthContext - Login setting admin profile:', profileData);
          setUserProfile(profileData);
        }
        
        toast.success(`Login successful! Welcome ${accountType === 'admin' ? 'Admin' : ''}${account.username}`);
        
        if (accountType === 'admin') {
          router.push('/admin/home');
        } else if (accountType === 'user' && account.isActive) {
          router.push('/home');
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
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(console.error);
    }

    clearAuthData();
    toast.success('Logged out successfully');
    
    if (accountType === 'admin') {
      router.push('/login');
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
    updateProfilePicture,
    getStoredToken,
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