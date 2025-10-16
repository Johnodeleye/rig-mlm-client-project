// app/payment/[userId]/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Lock, User, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { useCurrency } from '../../../context/CurrencyContext';
import { useParams, useRouter } from 'next/navigation';

const PaymentPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { convertAmount } = useCurrency();
  const params = useParams();
  const router = useRouter();

  // Mock data - in real app, this would come from API
  const newUserData = {
    name: 'John Doe',
    package: 'Beginner Plan',
    amount: 9000,
    pv: 20,
    tp: 10
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (paymentSuccess) {
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
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            You have successfully activated {newUserData.name}'s account.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-[#0660D3] rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Activate User Account</h1>
          </motion.div>
          <p className="text-gray-600">Pay for new user activation using your wallet balance</p>
        </div>

        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activation Summary</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User:</span>
              <span className="font-semibold">{newUserData.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Package:</span>
              <span className="font-semibold">{newUserData.package}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">PV/TP:</span>
              <span className="font-semibold">+{newUserData.pv}PV +{newUserData.tp}TP</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-[#0660D3]">
                  {convertAmount(newUserData.amount)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Your Username
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Your Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0660D3] text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Pay & Activate Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure payment processed by RIG Global</span>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;