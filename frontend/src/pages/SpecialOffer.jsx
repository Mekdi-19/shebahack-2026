import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVenture } from '../context/VentureContext';

const SpecialOffer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isCustomer } = useAuth();
  const { addSpecialOfferRequest } = useVenture();

  // Mock data for products and services
  const mockProducts = [
    { id: 1, name: 'Handmade Basket', vendor: 'Almaz Tesfaye' },
    { id: 2, name: 'Traditional Coffee Set', vendor: 'Tigist Bekele' },
    { id: 3, name: 'Embroidered Scarf', vendor: 'Meron Haile' },
    { id: 4, name: 'Pottery Vase', vendor: 'Sara Ahmed' },
    { id: 5, name: 'Woven Table Runner', vendor: 'Hana Bekele' }
  ];

  const mockServices = [
    { id: 1, name: 'House Cleaning', vendor: 'Almaz Tesfaye' },
    { id: 2, name: 'Laundry Service', vendor: 'Tigist Bekele' },
    { id: 3, name: 'Cooking Service', vendor: 'Meron Haile' },
    { id: 4, name: 'Tailoring & Alterations', vendor: 'Sara Ahmed' },
    { id: 5, name: 'Hair Braiding', vendor: 'Hana Bekele' }
  ];

  const [formData, setFormData] = useState({
    itemType: 'product',
    itemName: '',
    quantity: 1,
    minPrice: '',
    maxPrice: '',
    deliveryDate: '',
    customerLocation: '',
    description: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user || !isCustomer()) {
      navigate('/login');
      return;
    }

    // Pre-fill item name if coming from product/service card
    if (location.state?.itemName) {
      setFormData(prev => ({
        ...prev,
        itemName: location.state.itemName,
        itemType: location.state.itemType || 'product'
      }));
    }
  }, [user, isCustomer, navigate, location.state]);

  // Get available items based on selected type
  const getAvailableItems = () => {
    return formData.itemType === 'product' ? mockProducts : mockServices;
  };

  // Reset item name when type changes
  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      itemType: newType,
      itemName: '' // Reset item name when type changes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add to VentureContext
    const newRequest = {
      customerId: user.id,
      customerName: user.name,
      itemType: formData.itemType,
      itemName: formData.itemName,
      quantity: parseInt(formData.quantity),
      minPrice: parseFloat(formData.minPrice),
      maxPrice: parseFloat(formData.maxPrice),
      deliveryDate: formData.deliveryDate,
      description: formData.description
    };
    
    addSpecialOfferRequest(newRequest);
    
    setShowSuccess(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        itemType: 'product',
        itemName: '',
        quantity: 1,
        minPrice: '',
        maxPrice: '',
        deliveryDate: '',
        customerLocation: '',
        description: ''
      });
    }, 2000);
  };

  if (!user || !isCustomer()) {
    return null;
  }

  const availableItems = getAvailableItems();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-text mb-2">Special Offer Request</h1>
          <p className="text-gray-600 mb-8">Request customized products or services tailored to your needs</p>

          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold text-center">
                ✓ Special offer request submitted successfully!
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Item Type */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Item Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.itemType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary focus:outline-none"
                required
              >
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
            </div>

            {/* Item Name Dropdown */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Item Name <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary focus:outline-none"
                required
              >
                <option value="">Select {formData.itemType}</option>
                {availableItems.map(item => (
                  <option key={item.id} value={item.name}>
                    {item.name} (by {item.vendor})
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Choose from available {formData.itemType}s or we'll help you find similar items
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary focus:outline-none"
                min="1"
                required
              />
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Price Range (ETB) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                  <input
                    type="number"
                    value={formData.minPrice}
                    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary focus:outline-none"
                    placeholder="200"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                  <input
                    type="number"
                    value={formData.maxPrice}
                    onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary focus:outline-none"
                    placeholder="500"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Delivery Date */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Delivery Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary focus:outline-none"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Customer Location */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Your Location <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.customerLocation}
                onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary focus:outline-none"
                required
              >
                <option value="">Select your location</option>
                <option value="Addis Ababa">Addis Ababa</option>
                <option value="Bahir Dar">Bahir Dar</option>
                <option value="Hawassa">Hawassa</option>
                <option value="Dire Dawa">Dire Dawa</option>
                <option value="Mekelle">Mekelle</option>
                <option value="Gondar">Gondar</option>
                <option value="Adama">Adama</option>
              </select>
            </div>

            {/* Additional Description */}
            <div className="mb-8">
              <label className="block text-gray-700 font-semibold mb-2 text-lg">
                Additional Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-primary focus:outline-none"
                rows="4"
                placeholder="Add any specific requirements or details..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-lg text-lg transition"
            >
              Submit Special Offer Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
