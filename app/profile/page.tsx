'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Calendar, Package, Edit, Save, Camera, X, Store, MapPin, PhoneCall, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import DesktopSidebar from '../components/DesktopSidebar';
import MobileSidebar from '../components/MobileBar';
import { useAuth } from '@/context/AuthContext';

interface ProfileData {
  name: string;
  email: string;
  username: string;
  phone: string;
  currentPlan: string;
  joinDate: string;
  status: string;
  referralId: string;
  profilePicture?: string;
}

interface StockistData {
  firstName: string;
  storeName: string;
  email: string;
  country: string;
  state: string;
  city: string;
  fullAddress: string;
  whatsappNumber: string;
  callNumber: string;
  package: string;
  investmentAmount: number;
  finderFeeAmount: number;
  isActive: boolean;
  createdAt: string;
}

const ProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stockistData, setStockistData] = useState<StockistData | null>(null);

  const { user, userProfile, token, updateProfilePicture } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    username: '',
    phone: '',
    currentPlan: '',
    joinDate: '',
    status: '',
    referralId: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getStockistInitial = (storeName: string) => {
    return storeName ? storeName.charAt(0).toUpperCase() : 'S';
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        if (userProfile) {
          setProfileData({
            name: userProfile.name || '',
            email: userProfile.email || '',
            username: userProfile.username || '',
            phone: user?.phoneNumber || '',
            currentPlan: userProfile.plan || '',
            joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2025-01-01',
            status: userProfile.isActive ? 'Active' : 'Inactive',
            referralId: user?.referralId || '',
            profilePicture: userProfile.profilePicture || ''
          });

          setFormData(prev => ({
            ...prev,
            name: userProfile.name || '',
            phone: user?.phoneNumber || ''
          }));

          if (userProfile.profilePicture) {
            setProfilePicture(userProfile.profilePicture);
          }
        }

        if (token) {
          if (!userProfile?.profilePicture) {
            const pictureResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/profile-picture`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (pictureResponse.ok) {
              const pictureData = await pictureResponse.json();
              if (pictureData.profilePicture) {
                setProfilePicture(pictureData.profilePicture);
              }
            }
          }

          if (userProfile?.isStockist) {
            const stockistResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist/profile`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (stockistResponse.ok) {
              const stockistData = await stockistResponse.json();
              if (stockistData.success) {
                setStockistData(stockistData.stockist);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, userProfile, token]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          await updateProfilePicture(base64String);
        };
        reader.readAsDataURL(imageFile);
      }

      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: formData.name,
          phoneNumber: formData.phone
        })
      });

      if (updateResponse.ok) {
        if (formData.newPassword && formData.currentPassword) {
          if (formData.newPassword !== formData.confirmPassword) {
            alert('New passwords do not match');
            return;
          }

          const passwordResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/users/change-password`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              currentPassword: formData.currentPassword,
              newPassword: formData.newPassword
            })
          });

          if (!passwordResponse.ok) {
            const errorData = await passwordResponse.json();
            alert(errorData.error || 'Failed to change password');
            return;
          }
        }

        setProfileData(prev => ({
          ...prev,
          name: formData.name,
          phone: formData.phone
        }));

        setIsEditing(false);
        setIsModalOpen(false);
        
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        setImageFile(null);
        
        alert('Profile updated successfully!');
      } else {
        const errorData = await updateResponse.json();
        alert(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditModal = () => {
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setImageFile(null);
    
    setFormData(prev => ({
      ...prev,
      name: profileData.name,
      phone: profileData.phone,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    if (userProfile?.profilePicture) {
      setProfilePicture(userProfile.profilePicture);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          setIsSidebarOpen={setIsSidebarOpen}
          isProfileDropdownOpen={isProfileDropdownOpen}
          setIsProfileDropdownOpen={setIsProfileDropdownOpen}
        />
        <div className="flex pt-16">
          <DesktopSidebar 
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
          <main className="flex-1 w-full lg:ml-64 p-3 lg:p-6">
            <div className="animate-pulse space-y-6">
              <div className="bg-white rounded-xl p-6 h-32"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 h-96"></div>
                <div className="bg-white rounded-xl p-6 h-96"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <div className="flex pt-16">
        <DesktopSidebar 
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <MobileSidebar 
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
                  Profile Settings
                </h1>
                <p className="text-gray-600">Manage your account information and preferences</p>
              </div>
              
              <button
                onClick={openEditModal}
                className="mt-3 lg:mt-0 px-4 lg:px-6 py-2 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm lg:text-base flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h2>
              
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                    {profilePicture ? (
                      <img 
                        src={profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0660D3] flex items-center justify-center">
                        <User className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{profileData.name}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{profileData.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{profileData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Username / Referral ID</p>
                    <p className="font-medium text-gray-900">{profileData.referralId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{profileData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Current Plan</p>
                    <p className="font-medium text-gray-900">{profileData.currentPlan}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="font-medium text-gray-900">{profileData.joinDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profileData.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profileData.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral ID
                  </label>
                  <input
                    type="text"
                    value={profileData.referralId}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              {userProfile?.isStockist && stockistData && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Store className="w-5 h-5 text-green-600" />
                    Stockist Information
                  </h3>
                  
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2">
                      {getStockistInitial(stockistData.storeName)}
                    </div>
                    <p className="text-sm text-gray-600">{stockistData.storeName}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Store className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Store Name</p>
                        <p className="font-medium text-gray-900">{stockistData.storeName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <User className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">First Name</p>
                        <p className="font-medium text-gray-900">{stockistData.firstName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium text-gray-900">{stockistData.city}, {stockistData.state}, {stockistData.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">WhatsApp</p>
                        <p className="font-medium text-gray-900">{stockistData.whatsappNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <PhoneCall className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Call Number</p>
                        <p className="font-medium text-gray-900">{stockistData.callNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Package className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Stockist Package</p>
                        <p className="font-medium text-gray-900">{stockistData.package}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Shield className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Stockist Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stockistData.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {stockistData.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl lg:rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200">
                      {profilePicture ? (
                        <img 
                          src={profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#0660D3] flex items-center justify-center">
                          <User className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-[#0660D3] text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">Click camera icon to change photo</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Change Password</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0660D3] focus:border-[#0660D3] transition-all duration-200"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeEditModal}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-[#0660D3] text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;