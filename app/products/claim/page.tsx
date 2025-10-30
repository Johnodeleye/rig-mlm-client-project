'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Phone, MessageCircle, Truck, User } from 'lucide-react';
import Header from '@/app/components/Header';
import DesktopSidebar from '@/app/components/DesktopSidebar';
import MobileSidebar from '@/app/components/MobileBar';
import { useAuth } from '@/context/AuthContext';

interface Stockist {
  id: string;
  name: string;
  owner: string;
  country: string;
  state: string;
  city: string;
  address: string;
  whatsapp: string;
  call: string;
  availableProducts: number;
  totalInventory: number;
}

interface Purchase {
  id: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  claimedQuantity: number;
  remainingQuantity: number;
  product: {
    id: string;
    name: string;
    description: string;
    image: string | null;
    price: number;
  };
}

const ClaimProductPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('claim-products');
  const [stockists, setStockists] = useState<Stockist[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedStockist, setSelectedStockist] = useState<Stockist | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getStoredToken, userProfile } = useAuth();

  useEffect(() => {
    fetchStockists();
    fetchPurchasesWithClaims();
  }, []);

  const fetchStockists = async () => {
    try {
      const token = getStoredToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/nearby-stockists`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStockists(data.stockists || []);
      }
    } catch (error) {
      console.error('Error fetching stockists:', error);
    }
  };

  const fetchPurchasesWithClaims = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        console.error('No token found');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/products/my-purchases`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Purchases data:', data.purchases);
          const purchasesWithClaims = data.purchases.map((purchase: any) => ({
            ...purchase,
            claimedQuantity: 0,
            remainingQuantity: purchase.quantity
          }));
          setPurchases(purchasesWithClaims);
        }
      } else {
        console.error('Failed to fetch purchases:', response.status);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestProduct = async () => {
    if (!selectedStockist || !selectedPurchase || !address) {
      alert('Please select a stockist, product, and provide delivery address');
      return;
    }

    console.log('Selected Purchase:', selectedPurchase);
    console.log('Selected Purchase ID:', selectedPurchase.id);
    console.log('Selected Purchase Product ID:', selectedPurchase.productId);
    console.log('Selected Purchase Product Object:', selectedPurchase.product);

    const requestData = {
      stockistId: selectedStockist.id,
      productId: selectedPurchase.productId,
      quantity: selectedPurchase.remainingQuantity,
      address: address,
      notes: notes
    };

    console.log('Submitting request with data:', requestData);

    setIsSubmitting(true);
    try {
      const token = getStoredToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/request-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (data.success) {
        alert('Product request submitted successfully! The stockist will contact you soon.');
        setSelectedStockist(null);
        setSelectedPurchase(null);
        setAddress('');
        setNotes('');
        fetchPurchasesWithClaims();
      } else {
        alert(data.error || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error requesting product:', error);
      alert('Error submitting request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading your purchases...</div>
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
                  Claim Products
                </h1>
                <p className="text-gray-600">Find nearby stockists to claim your purchased products</p>
              </div>
              <div className="mt-3 lg:mt-0">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-800">
                    <strong>{purchases.length}</strong> purchased product{purchases.length !== 1 ? 's' : ''} available to claim
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Purchased Products</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {purchases.map((purchase, index) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPurchase?.id === purchase.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        console.log('Selected purchase:', purchase);
                        setSelectedPurchase(purchase);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{purchase.product.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{purchase.product.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Purchased: {purchase.quantity}</span>
                            <span>Claimed: {purchase.claimedQuantity}</span>
                            <span>Available: {purchase.remainingQuantity}</span>
                            <span>Price: ₦{purchase.product.price.toLocaleString()}</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-400">
                            Purchase ID: {purchase.id}
                          </div>
                          <div className="text-xs text-gray-400">
                            Product ID: {purchase.productId}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 font-medium">
                              {purchase.remainingQuantity} available
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Total: ₦{purchase.totalAmount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {purchases.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No purchased products found</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Products you purchase will appear here for claiming.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Stockists</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {stockists.map((stockist, index) => (
                    <motion.div
                      key={stockist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedStockist?.id === stockist.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedStockist(stockist)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{stockist.name}</h3>
                          <p className="text-sm text-gray-600">Owner: {stockist.owner}</p>
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{stockist.city}, {stockist.state}, {stockist.country}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{stockist.address}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">
                              {stockist.availableProducts} products
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {stockist.totalInventory} items in stock
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <a
                          href={`https://wa.me/${stockist.whatsapp}`}
                          className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </a>
                        <a
                          href={`tel:${stockist.call}`}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>
                      </div>
                    </motion.div>
                  ))}

                  {stockists.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No stockists found in your area</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              {selectedPurchase && selectedStockist && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Claim {selectedPurchase.product.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Requesting delivery from {selectedStockist.name}
                  </p>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        {selectedPurchase.product.image ? (
                          <img
                            src={selectedPurchase.product.image}
                            alt={selectedPurchase.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900">{selectedPurchase.product.name}</h4>
                          <p className="text-sm text-gray-600">
                            Available: {selectedPurchase.remainingQuantity} / {selectedPurchase.quantity}
                          </p>
                          <p className="text-xs text-gray-500">
                            Product ID: {selectedPurchase.productId}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity to Claim
                      </label>
                      <input
                        type="number"
                        value={selectedPurchase.remainingQuantity}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This is the total available quantity from your purchase
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        placeholder="Enter your complete delivery address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Any special delivery instructions..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-800">Stockist Contact:</span>
                        <div className="flex gap-2">
                          <a
                            href={`https://wa.me/${selectedStockist.whatsapp}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            WhatsApp
                          </a>
                          <span className="text-blue-300">|</span>
                          <a
                            href={`tel:${selectedStockist.call}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Call
                          </a>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleRequestProduct}
                      disabled={isSubmitting || !address.trim()}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting Request...' : 'Submit Claim Request'}
                    </button>
                  </div>
                </motion.div>
              )}

              {(!selectedPurchase || !selectedStockist) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-6 text-center"
                >
                  <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {!selectedPurchase ? 'Select a Product' : 'Select a Stockist'}
                  </h3>
                  <p className="text-gray-600">
                    {!selectedPurchase 
                      ? 'Choose a purchased product from the list to claim it'
                      : 'Choose a stockist from the list to handle your delivery'
                    }
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClaimProductPage;