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

interface ProductRequest {
  id: string;
  productId: string;
  quantity: number;
  status: string;
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

      // Fetch purchases
      const purchasesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/products/my-purchases`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!purchasesResponse.ok) {
        console.error('Failed to fetch purchases:', purchasesResponse.status);
        setIsLoading(false);
        return;
      }

      const purchasesData = await purchasesResponse.json();
      
      if (!purchasesData.success) {
        console.error('Failed to fetch purchases:', purchasesData.error);
        setIsLoading(false);
        return;
      }

      // Fetch all product requests to calculate claimed quantities
      const requestsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/stockist-management/member/claimed-products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let claimedQuantities: {[key: string]: number} = {};
      
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        if (requestsData.success && requestsData.claimedProducts) {
          // Calculate total claimed quantity per product
          requestsData.claimedProducts.forEach((request: ProductRequest) => {
            if (!claimedQuantities[request.productId]) {
              claimedQuantities[request.productId] = 0;
            }
            // Only count pending and assigned requests (not delivered/completed)
            if (request.status === 'pending' || request.status === 'assigned') {
              claimedQuantities[request.productId] += request.quantity;
            }
          });
        }
      }

      // Process purchases with claims
      const purchasesWithClaims = purchasesData.purchases.map((purchase: any) => {
        const claimedQuantity = claimedQuantities[purchase.productId] || 0;
        const remainingQuantity = Math.max(0, purchase.quantity - claimedQuantity);
        
        return {
          ...purchase,
          claimedQuantity: claimedQuantity,
          remainingQuantity: remainingQuantity
        };
      }).filter((purchase: Purchase) => purchase.remainingQuantity > 0); // Only show purchases with available quantity
      
      setPurchases(purchasesWithClaims);
      
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

    const requestData = {
      stockistId: selectedStockist.id,
      productId: selectedPurchase.productId,
      quantity: selectedPurchase.remainingQuantity,
      address: address,
      notes: notes
    };

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

      if (data.success) {
        alert('Product request submitted successfully! The stockist will contact you soon.');
        setSelectedStockist(null);
        setSelectedPurchase(null);
        setAddress('');
        setNotes('');
        fetchPurchasesWithClaims(); // Refresh the list
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

        <main className="flex-1 w-full lg:ml-64 p-3 sm:p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Claim Products
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">Find nearby stockists to claim your purchased products</p>
              </div>
              <div className="mt-2 sm:mt-0">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>{purchases.length}</strong> purchased product{purchases.length !== 1 ? 's' : ''} available to claim
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Purchased Products</h2>
                <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-1">
                  {purchases.map((purchase, index) => (
                    <motion.div
                      key={purchase.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPurchase?.id === purchase.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedPurchase(purchase);
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0">
                            {purchase.product.image ? (
                              <img
                                src={purchase.product.image}
                                alt={purchase.product.name}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{purchase.product.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{purchase.product.description}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                              <span>Purchased: {purchase.quantity}</span>
                              <span>Claimed: {purchase.claimedQuantity}</span>
                              <span>Available: {purchase.remainingQuantity}</span>
                              <span>Price: ₦{purchase.product.price.toLocaleString()}</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-400">
                              Purchase ID: {purchase.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right mt-2 sm:mt-0 sm:ml-3">
                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
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
                    <div className="text-center py-6 sm:py-8">
                      <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base">No purchased products available to claim</p>
                      <p className="text-gray-400 text-xs sm:text-sm mt-2">
                        All your purchased products have been claimed or are in process.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Stockists</h2>
                <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-1">
                  {stockists.map((stockist, index) => (
                    <motion.div
                      key={stockist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedStockist?.id === stockist.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedStockist(stockist)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{stockist.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">Owner: {stockist.owner}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs sm:text-sm text-gray-500">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="line-clamp-1">{stockist.city}, {stockist.state}, {stockist.country}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">{stockist.address}</p>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
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
                          className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 bg-green-500 text-white rounded text-xs sm:text-sm hover:bg-green-600"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span className="hidden xs:inline">WhatsApp</span>
                          <span className="xs:hidden">WA</span>
                        </a>
                        <a
                          href={`tel:${stockist.call}`}
                          className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white rounded text-xs sm:text-sm hover:bg-blue-600"
                        >
                          <Phone className="w-3 h-3" />
                          <span className="hidden xs:inline">Call</span>
                        </a>
                      </div>
                    </motion.div>
                  ))}

                  {stockists.length === 0 && (
                    <div className="text-center py-6 sm:py-8">
                      <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                      <p className="text-gray-500 text-sm sm:text-base">No stockists found in your area</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {selectedPurchase && selectedStockist && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Claim {selectedPurchase.product.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Requesting delivery from {selectedStockist.name}
                  </p>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        {selectedPurchase.product.image ? (
                          <img
                            src={selectedPurchase.product.image}
                            alt={selectedPurchase.product.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{selectedPurchase.product.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Available: {selectedPurchase.remainingQuantity} / {selectedPurchase.quantity}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Quantity to Claim
                      </label>
                      <input
                        type="number"
                        value={selectedPurchase.remainingQuantity}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This is the total available quantity from your purchase
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Delivery Address
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        placeholder="Enter your complete delivery address"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Any special delivery instructions..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-2">
                        <span className="text-blue-800 font-medium">Stockist Contact:</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                          <a
                            href={`https://wa.me/${selectedStockist.whatsapp}`}
                            className="text-blue-600 hover:text-blue-800 whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </div>
                          </a>
                          <span className="text-blue-300">|</span>
                          <a
                            href={`tel:${selectedStockist.call}`}
                            className="text-blue-600 hover:text-blue-800 whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>Call</span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleRequestProduct}
                      disabled={isSubmitting || !address.trim()}
                      className="w-full py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-6 text-center"
                >
                  <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {!selectedPurchase ? 'Select a Product' : 'Select a Stockist'}
                  </h3>
                  <p className="text-gray-600 text-sm">
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