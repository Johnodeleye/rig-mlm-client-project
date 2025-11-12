// app/admin/packages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit, Trash2, Search, Filter, Users, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminHeader from '@/app/components/admin/AdminHeader';
import AdminDesktopSidebar from '@/app/components/admin/AdminDesktopSidebar';
import AdminMobileSidebar from '@/app/components/admin/AdminMobileSidebar';
import { useAuth } from '@/context/AuthContext';

interface PackageType {
  id: string;
  packageId: string;
  name: string;
  level: number;
  priceNGN: number;
  priceUSD: number;
  tp: number;
  pv: number;
  productContents: string;
  isActive: boolean;
  createdAt: string;
}

const AdminPackagesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('packages');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { isAuthenticated, accountType, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    packageId: '',
    name: '',
    level: '',
    priceNGN: '',
    priceUSD: '',
    tp: '',
    pv: '',
    productContents: '',
    isActive: true
  });

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || accountType !== 'admin') {
        router.push('/login');
      }
    }
  }, [isAuthenticated, accountType, authLoading, router]);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/packages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPackages(data.packages);
        }
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && accountType === 'admin') {
      fetchPackages();
    }
  }, [isAuthenticated, accountType]);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'Active' && pkg.isActive) ||
                         (filterStatus === 'Inactive' && !pkg.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const url = editingPackage 
        ? `${process.env.NEXT_PUBLIC_BACKEND}/api/admin/packages/${editingPackage.packageId}`
        : `${process.env.NEXT_PUBLIC_BACKEND}/api/admin/packages`;
      
      const method = editingPackage ? 'PUT' : 'POST';
      
      const packageData = {
        packageId: formData.packageId,
        name: formData.name,
        level: parseInt(formData.level),
        priceNGN: parseFloat(formData.priceNGN),
        priceUSD: parseFloat(formData.priceUSD),
        tp: parseInt(formData.tp),
        pv: parseInt(formData.pv),
        productContents: formData.productContents,
        isActive: formData.isActive
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(packageData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchPackages();
          resetForm();
          setShowAddPackage(false);
        }
      }
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      packageId: '',
      name: '',
      level: '',
      priceNGN: '',
      priceUSD: '',
      tp: '',
      pv: '',
      productContents: '',
      isActive: true
    });
    setEditingPackage(null);
  };

  const handleEdit = (pkg: PackageType) => {
    setEditingPackage(pkg);
    setFormData({
      packageId: pkg.packageId,
      name: pkg.name,
      level: pkg.level.toString(),
      priceNGN: pkg.priceNGN.toString(),
      priceUSD: pkg.priceUSD.toString(),
      tp: pkg.tp.toString(),
      pv: pkg.pv.toString(),
      productContents: pkg.productContents,
      isActive: pkg.isActive
    });
    setShowAddPackage(true);
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/packages/${packageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchPackages();
        }
      }
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const togglePackageStatus = async (pkg: PackageType) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/admin/packages/${pkg.packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...pkg,
          isActive: !pkg.isActive
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchPackages();
        }
      }
    } catch (error) {
      console.error('Error updating package status:', error);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
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
                  Packages Management
                </h1>
                <p className="text-gray-600">Manage membership packages and plans</p>
              </div>
              <div className="flex gap-3 mt-3 lg:mt-0">
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddPackage(true);
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Package
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-4 lg:mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pkg.isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => togglePackageStatus(pkg)}
                        className={`p-1 rounded ${
                          pkg.isActive 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {pkg.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Level {pkg.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>{pkg.pv} PV</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-green-500" />
                      <span>{pkg.tp} TP</span>
                    </div>
                  </div>

                  <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">₦{pkg.priceNGN.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">${pkg.priceUSD.toLocaleString()}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Includes:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {pkg.productContents.split(',').slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          {item.trim()}
                        </li>
                      ))}
                      {pkg.productContents.split(',').length > 3 && (
                        <li className="text-xs text-gray-500">
                          +{pkg.productContents.split(',').length - 3} more items
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Created: {new Date(pkg.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(pkg.packageId)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredPackages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200"
            >
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No packages found matching your criteria</p>
            </motion.div>
          )}

          {showAddPackage && (
            <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200 shadow-red-500"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingPackage ? 'Edit Package' : 'Add New Package'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package ID *
                      </label>
                      <input
                        type="text"
                        name="packageId"
                        value={formData.packageId}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., beginner"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Beginner Plan"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level *
                      </label>
                      <input
                        type="number"
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 1"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₦) *
                      </label>
                      <input
                        type="number"
                        name="priceNGN"
                        value={formData.priceNGN}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 9000"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        name="priceUSD"
                        value={formData.priceUSD}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 13.99"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PV Points *
                      </label>
                      <input
                        type="number"
                        name="pv"
                        value={formData.pv}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 5"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        TP Points *
                      </label>
                      <input
                        type="number"
                        name="tp"
                        value={formData.tp}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 10"
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Contents *
                    </label>
                    <textarea
                      name="productContents"
                      value={formData.productContents}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter product contents separated by commas: 1x Baobab (250g), 1x Dates Powder (200g)"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Package is active
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddPackage(false);
                        resetForm();
                      }}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {editingPackage ? 'Update Package' : 'Add Package'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPackagesPage;