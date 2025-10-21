// app/home/page.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthRedirect from '@/app/components/AuthRedirect';
import Dashboard from '@/app/components/Dashboard'; 
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const { user, accountType, isAuthenticated } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && accountType === 'admin') {
     
      router.push('/admin/home');
    }
  }, [isAuthenticated, accountType]);

  return (
    <>
      <AuthRedirect requireAuth={true} requireActive={true} redirectTo="/login" />
      
      {isAuthenticated && accountType === 'user' && user?.isActive && <Dashboard />}
    </>
  );
};

export default HomePage;