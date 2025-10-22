// contexts/CurrencyContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Currency = 'NGN' | 'USD';
type UserType = 'user' | 'stockist';

interface CurrencyContextType {
  currency: Currency;
  userType: UserType;
  setUserType: (type: UserType) => void;
  convertAmount: (amount: number) => string;
  detectedCountry: string;
  isDetecting: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [userType, setUserType] = useState<UserType>('user');
  const [detectedCountry, setDetectedCountry] = useState('');
  const [isDetecting, setIsDetecting] = useState(true);

  //
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setIsDetecting(true);
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo, we'll randomly assign Nigeria or International
        const isNigeria = Math.random() > 0.5;
        
        if (isNigeria) {
          setCurrency('NGN');
          setDetectedCountry('Nigeria 🇳🇬');
        } else {
          setCurrency('USD');
          setDetectedCountry('United States 🇺🇸');
        }
      } catch (error) {
        console.log('Error detecting location, defaulting to NGN');
        setCurrency('NGN');
        setDetectedCountry('Nigeria 🇳🇬');
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocation();
  }, []);

  const convertAmount = (amount: number): string => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`;
    } else {
      const usdAmount = amount / 700; // Example conversion rate
      return `$${usdAmount.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      userType, 
      setUserType, 
      convertAmount, 
      detectedCountry,
      isDetecting 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};