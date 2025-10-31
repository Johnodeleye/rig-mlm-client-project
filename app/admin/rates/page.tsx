'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminDesktopSidebar from '../../components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '../../components/admin/AdminMobileSidebar';
import { useAuth } from '@/context/AuthContext';

interface Rate {
  id: string;
  currency: string;
  rate: number;
  isActive: boolean;
  createdAt: string;
}

const AdminRatesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('rates');
  const [rates, setRates] = useState<Rate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRate, setNewRate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { isAuthenticated, accountType, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || accountType !== 'admin') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, accountType, authLoading, router]);

  const fetchRates = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/rates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRates(data.rates);
        }
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accountType === 'admin') {
      fetchRates();
    }
  }, [isAuthenticated, accountType]);

  const handleAddRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRate || parseFloat(newRate) <= 0) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rate: parseFloat(newRate) })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNewRate('');
          setShowAddForm(false);
          fetchRates();
        }
      }
    } catch (error) {
      console.error('Error adding rate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetActive = async (rateId: string) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/rates/${rateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: true })
      });

      if (response.ok) {
        fetchRates();
      }
    } catch (error) {
      console.error('Error setting active rate:', error);
    }
  };

  const handleDeleteRate = async (rateId: string, isActive: boolean) => {
    if (isActive) {
      alert('Cannot delete active rate');
      return;
    }

    if (!confirm('Are you sure you want to delete this rate?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/rates/${rateId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchRates();
      }
    } catch (error) {
      console.error('Error deleting rate:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rates...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || accountType !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <div className="flex pt-16">
        <AdminDesktopSidebar 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <AdminMobileSidebar 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                  Dollar Rate Management
                </h1>
                <p className="text-gray-600">Manage USD to NGN exchange rates</p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-3 lg:mt-0 flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Rate
              </button>
            </div>
          </motion.div>

          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add New Rate</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddRate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    USD to NGN Rate
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      placeholder="Enter rate (e.g., 1500)"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Current rate: 1 USD = {newRate ? `₦${parseFloat(newRate).toLocaleString()}` : '₦0'}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Rate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rate (NGN)
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rates.map((rate, index) => (
                    <motion.tr
                      key={rate.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                          </div>
                          <div className="ml-3 lg:ml-4">
                            <div className="text-sm font-medium text-gray-900">{rate.currency}</div>
                            <div className="text-sm text-gray-500">to NGN</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-semibold text-gray-900">
                          ₦{rate.rate.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rate.isActive 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rate.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(rate.createdAt)}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {!rate.isActive && (
                            <button
                              onClick={() => handleSetActive(rate.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Set as Active"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteRate(rate.id, rate.isActive)}
                            disabled={rate.isActive}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title={rate.isActive ? "Cannot delete active rate" : "Delete rate"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {rates.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No rates found</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-3 text-red-600 hover:text-red-700 font-medium"
                >
                  Add your first rate
                </button>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminRatesPage;