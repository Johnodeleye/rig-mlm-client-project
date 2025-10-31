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
  exchangeRate: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [userType, setUserType] = useState<UserType>('user');
  const [detectedCountry, setDetectedCountry] = useState('');
  const [isDetecting, setIsDetecting] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1500);

  useEffect(() => {
    const detectLocationAndCurrency = async () => {
      try {
        setIsDetecting(true);
        
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;
        
        let country = 'NG';
        let countryName = 'Nigeria';

        try {
          const countryResponse = await fetch(`https://ipapi.co/${userIP}/country/`);
          country = await countryResponse.text();
          
          const countryNameResponse = await fetch(`https://ipapi.co/${userIP}/country_name/`);
          countryName = await countryNameResponse.text();
        } catch (ipError) {
          console.log('ipapi.co failed, using defaults');
        }

        if (country === 'NG') {
          setCurrency('NGN');
          setDetectedCountry('Nigeria');
        } else {
          setCurrency('USD');
          setDetectedCountry(countryName);
        }

        try {
          const rateResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/rates/active`);
          const rateData = await rateResponse.json();
          
          if (rateData.success && rateData.rate) {
            setExchangeRate(rateData.rate.rate);
          }
        } catch (rateError) {
          console.log('Failed to fetch exchange rate, using default');
        }

      } catch (error) {
        console.log('Error detecting location, defaulting to NGN');
        setCurrency('NGN');
        setDetectedCountry('Nigeria');
      } finally {
        setIsDetecting(false);
      }
    };

    detectLocationAndCurrency();
  }, []);

  const convertAmount = (amount: number): string => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`;
    } else {
      const usdAmount = amount / exchangeRate;
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
      isDetecting,
      exchangeRate
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