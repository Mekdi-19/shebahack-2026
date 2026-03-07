import { useState, useEffect } from 'react';
import UnifiedCard from '../components/UnifiedCard';
import SearchBar from '../components/SearchBar';
import api from '../services/api';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const serviceTypes = ['laundry', 'daycare', 'cleaning', 'cooking', 'catering', 'sewing', 'hairdressing', 'other'];

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getServices();
        setAllServices(data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = allServices.filter(service => {
    const searchLower = searchTerm.toLowerCase();
    const vendorName = service.vendor?.name || '';
    const matchesSearch = (
      service.name?.toLowerCase().includes(searchLower) ||
      vendorName.toLowerCase().includes(searchLower) ||
      service.category?.toLowerCase().includes(searchLower)
    );

    const matchesType = selectedType === 'all' || service.category === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-text mb-8">Services</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            placeholder="Search services by name, vendor, or type..." 
            onSearch={setSearchTerm}
          />
        </div>

        {/* Filter Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text mb-4">Filter by Service Type</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedType === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              All Services
            </button>
            {serviceTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                  selectedType === type
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Loading services...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-500 text-lg mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results Info */}
        {!loading && !error && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredServices.length} of {allServices.length} services
              </p>
              {searchTerm && (
                <p className="text-sm text-gray-500">
                  Search results for: <span className="font-semibold">"{searchTerm}"</span>
                </p>
              )}
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg mb-2">No services found</p>
                <p className="text-gray-400">Try searching with different keywords or change filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredServices.map(service => (
                  <UnifiedCard key={service.id} item={service} type="service" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Services;
