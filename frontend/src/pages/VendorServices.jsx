import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const VendorServices = () => {
  const { user, isVendor } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    priceType: 'per_service',
    duration: '',
    location: { city: '' }
  });

  // Redirect if not vendor
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isVendor()) {
      navigate('/');
    }
  }, [user, isVendor, navigate]);

  // Fetch vendor's services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getServices();
      console.log('Fetched services:', data);
      console.log('Current user:', user);
      
      // Filter to show only current vendor's services
      // Handle both _id and id fields
      const vendorServices = data.filter(s => {
        const providerId = s.provider?._id || s.provider?.id || s.provider;
        const userId = user?._id || user?.id;
        console.log('Comparing:', providerId, 'with', userId);
        return providerId === userId || providerId?.toString() === userId?.toString();
      });
      
      console.log('Filtered vendor services:', vendorServices);
      setServices(vendorServices);
    } catch (err) {
      setError('Failed to load services');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setFormData(prev => ({ ...prev, location: { city: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting service:', formData);
    console.log('User token:', localStorage.getItem('token'));
    
    try {
      // Convert string values to numbers
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      console.log('Service data to send:', serviceData);
      
      if (editingService) {
        const result = await api.updateService(editingService._id, serviceData);
        console.log('Update result:', result);
        alert('Service updated successfully!');
      } else {
        const result = await api.createService(serviceData);
        console.log('Create result:', result);
        alert('Service created successfully!');
      }
      
      setShowForm(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        priceType: 'per_service',
        duration: '',
        location: { city: '' }
      });
      await fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
      alert('Failed to save service: ' + err.message);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      priceType: service.priceType || 'per_service',
      duration: service.duration || '',
      location: service.location || { city: '' }
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await api.deleteService(id);
      fetchServices();
    } catch (err) {
      alert('Failed to delete service: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      priceType: 'per_service',
      duration: '',
      location: { city: '' }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Loading your services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">My Services</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            + Add New Service
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Service Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Service Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Price (ETB) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Price Type *</label>
                    <select
                      name="priceType"
                      value={formData.priceType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="per_service">Per Service</option>
                      <option value="per_hour">Per Hour</option>
                      <option value="per_day">Per Day</option>
                      <option value="per_item">Per Item</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a category</option>
                      <option value="laundry">Laundry</option>
                      <option value="daycare">Daycare</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="cooking">Cooking</option>
                      <option value="catering">Catering</option>
                      <option value="sewing">Sewing</option>
                      <option value="hairdressing">Hairdressing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Duration</label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 2 hours"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Location (City)</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Addis Ababa"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
                  >
                    {editingService ? 'Update Service' : 'Create Service'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services List */}
        {services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🛠️</div>
            <p className="text-gray-500 text-lg mb-4">You haven't added any services yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-primary hover:underline font-semibold"
            >
              Add your first service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{service.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      service.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {service.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  
                  <span className="inline-block px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm font-semibold capitalize mb-3">
                    {service.category}
                  </span>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{service.price} ETB</span>
                      <span className="text-sm text-gray-500 capitalize">{service.priceType?.replace('_', ' ')}</span>
                    </div>
                    
                    {service.duration && (
                      <div className="text-sm text-gray-600">
                        ⏱️ Duration: {service.duration}
                      </div>
                    )}
                    
                    {service.location?.city && (
                      <div className="text-sm text-gray-600">
                        📍 {service.location.city}
                      </div>
                    )}

                    {service.rating > 0 && (
                      <div className="text-sm text-gray-600">
                        ⭐ {service.rating.toFixed(1)} ({service.totalReviews} reviews)
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorServices;
