// app/register/selection/page.tsx
'use client';

import { motion } from 'framer-motion';
import { User, Store, ArrowRight, Users, Package, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '../../../context/CurrencyContext';

const RegistrationSelection = () => {
  const { setUserType, detectedCountry } = useCurrency();

  const options = [
    {
      id: 'user',
      title: 'Register as User',
      description: 'Join as a regular member to purchase products, build your team, and earn commissions',
      icon: User,
      features: ['Earn referral commissions', 'Build your network', 'Purchase products', 'Receive team bonuses'],
      color: 'blue'
    },
    {
      id: 'stockist',
      title: 'Register as Stockist',
      description: 'Become a product distributor with higher benefits and additional earning opportunities',
      icon: Store,
      features: ['Higher commission rates', 'Product distribution', 'Team leadership', 'Priority support'],
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-[#0660D3] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Join RIG Global</h1>
          </motion.div>
          <p className="text-gray-600 mb-2">Detected Location: {detectedCountry}</p>
          <p className="text-gray-600">Choose your registration type to get started</p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${
                    option.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                  } rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${
                      option.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600">{option.description}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full ${
                          option.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Link
                  href="/register"
                  onClick={() => setUserType(option.id as 'user' | 'stockist')}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    option.color === 'blue' 
                      ? 'bg-[#0660D3] text-white hover:bg-blue-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Continue as {option.id === 'user' ? 'User' : 'Stockist'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0660D3] hover:text-blue-700 font-semibold transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationSelection;