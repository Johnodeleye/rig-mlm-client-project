// components/NotFound.tsx
'use client';

import { motion } from 'framer-motion';
import { Home, ArrowLeft, Shield, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Custom404 = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute -top-20 -left-20 w-40 h-40 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-rose-600 rounded-full mix-blend-multiply filter blur-xl opacity-5"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">RIG Global</h1>
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-9xl font-bold bg-gradient-to-br from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">404</h1>
            <div className="w-24 h-2 bg-gradient-to-r from-orange-600 to-red-500 rounded-full mx-auto mb-6"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              Oops! The page you're looking for seems to have wandered off into the digital void. 
              It might have been moved, deleted, or never existed in the first place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Search className="w-16 h-16 text-orange-600" />
                </motion.div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-sm font-bold">?</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="flex items-center gap-3 px-6 py-3 bg-white text-orange-600 border border-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-lg"
            >
              <Link href="/" className="flex items-center gap-3">
                <Home className="w-5 h-5" />
                Go Home
              </Link>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 max-w-md mx-auto"
          >
            <h3 className="font-semibold text-gray-900 mb-3">What you can do:</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                Check the URL for typos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                Navigate to our homepage
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                Contact support if the problem persists
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8"
          >
            <p className="text-sm text-gray-500">
              Error code: 404 •{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent font-medium">RIG Global</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Custom404;