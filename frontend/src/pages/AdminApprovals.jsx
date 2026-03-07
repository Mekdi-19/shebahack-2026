import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AdminApprovals = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vendors');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  // Filter states
  const [vendorFilter, setVendorFilter] = useState('pending');
  const [productFilter, setProductFilter] = useState('pending');
  const [serviceFilter, setServiceFilter] = useState('pending');

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isAdmin()) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  // Fetch data based on active tab
  useEffect(() => {
    if (user && isAdmin()) {
      fetchData();
    }
  }, [activeTab, vendorFilter, productFilter, serviceFilter, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'vendors') {
        const data = await api.getVendors(vendorFilter);
        setVendors(data);
      } else if (activeTab === 'products') {
        const data = await api.getAdminProducts(productFilter);
        setProducts(data);
      } else if (activeTab === 'services') {
        const data = await api.getAdminServices(serviceFilter);
        setServices(data);
      }
    } catch (err) {
      setError('Failed to load data: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId, vendorName) => {
    if (!confirm(`Approve vendor: ${vendorName}?`)) return;

    try {
      await api.approveVendor(vendorId);
      alert('Vendor approved successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to approve vendor: ' + err.message);
    }
  };

  const handleApproveProduct = async (productId, productName) => {
    if (!confirm(`Approve product: ${productName}?`)) return;

    try {
      await api.approveProduct(productId);
      alert('Product approved successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to approve product: ' + err.message);
    }
  };

  const handleApproveService = async (serviceId, serviceName) => {
    if (!confirm(`Approve service: ${serviceName}?`)) return;

    try {
      await api.approveService(serviceId);
      alert('Service approved successfully!');
      fetchData();
    } catch (err) {
      alert('Failed to approve service: ' + err.message);
    }
  };

  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Approval Management</h1>
          <p className="text-gray-600">Review and approve vendors, products, and services</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Pending Vendors</p>
            <p className="text-4xl font-bold text-yellow-600">
              {vendors.filter(v => !v.isVerified).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Pending Products</p>
            <p className="text-4xl font-bold text-orange-600">
              {products.filter(p => !p.isApproved).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-2">Pending Services</p>
            <p className="text-4xl font-bold text-blue-600">
              {services.filter(s => !s.isApproved).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('vendors')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === 'vendors' ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                }`}
              >
                Vendors
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === 'services' ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                }`}
              >
                Services
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Filter Buttons */}
            <div className="mb-6 flex gap-3">
              {activeTab === 'vendors' && (
                <>
                  <button
                    onClick={() => setVendorFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      vendorFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setVendorFilter('approved')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      vendorFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setVendorFilter(null)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      vendorFilter === null ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    All
                  </button>
                </>
              )}
              {activeTab === 'products' && (
                <>
                  <button
                    onClick={() => setProductFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      productFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setProductFilter('approved')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      productFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setProductFilter(null)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      productFilter === null ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    All
                  </button>
                </>
              )}
              {activeTab === 'services' && (
                <>
                  <button
                    onClick={() => setServiceFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      serviceFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setServiceFilter('approved')}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      serviceFilter === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setServiceFilter(null)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      serviceFilter === null ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    All
                  </button>
                </>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-gray-500 text-lg">Loading...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Vendors Tab */}
            {!loading && activeTab === 'vendors' && (
              <div>
                {vendors.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👤</div>
                    <p className="text-gray-600">No vendors found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vendors.map(vendor => (
                      <div key={vendor._id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{vendor.name}</h3>
                            <p className="text-gray-600">{vendor.email}</p>
                            {vendor.phone && <p className="text-sm text-gray-500">📞 {vendor.phone}</p>}
                            {vendor.location && <p className="text-sm text-gray-500">📍 {vendor.location}</p>}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            vendor.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {vendor.isVerified ? 'Approved' : 'Pending'}
                          </span>
                        </div>

                        {vendor.skills && vendor.skills.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-semibold mb-2">Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {vendor.skills.map((skill, idx) => (
                                <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {!vendor.isVerified && (
                          <button
                            onClick={() => handleApproveVendor(vendor._id, vendor.name)}
                            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
                          >
                            ✓ Approve Vendor
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Products Tab */}
            {!loading && activeTab === 'products' && (
              <div>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-600">No products found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                      <div key={product._id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition">
                        <img
                          src={product.images?.[0] || 'https://via.placeholder.com/300x200'}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold">{product.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              product.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xl font-bold text-primary">{product.price} ETB</span>
                            <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                          </div>
                          {product.vendor && (
                            <p className="text-sm text-gray-600 mb-3">
                              Vendor: <span className="font-semibold">{product.vendor.name}</span>
                            </p>
                          )}
                          {!product.isApproved && (
                            <button
                              onClick={() => handleApproveProduct(product._id, product.name)}
                              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                            >
                              ✓ Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Services Tab */}
            {!loading && activeTab === 'services' && (
              <div>
                {services.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛠️</div>
                    <p className="text-gray-600">No services found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map(service => (
                      <div key={service._id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{service.name}</h3>
                            <p className="text-gray-600 mt-2">{service.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            service.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {service.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Price</p>
                            <p className="font-semibold text-lg">{service.price} ETB</p>
                          </div>
                          {service.vendor && (
                            <div>
                              <p className="text-sm text-gray-600">Vendor</p>
                              <p className="font-semibold">{service.vendor.name}</p>
                            </div>
                          )}
                        </div>

                        {!service.isApproved && (
                          <button
                            onClick={() => handleApproveService(service._id, service.name)}
                            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
                          >
                            ✓ Approve Service
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApprovals;
