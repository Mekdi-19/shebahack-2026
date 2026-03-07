import { useState } from 'react';
import UnifiedCard from '../components/UnifiedCard';
import SearchBar from '../components/SearchBar';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const allServices = [
    { id: 1, name: 'Professional Laundry Service', vendor: 'Almaz Tesfaye', vendorId: 1, price: 150, rating: 4.8, location: 'Addis Ababa', type: 'Laundry', image: 'https://via.placeholder.com/300x200' },
    { id: 2, name: 'Babysitting & Childcare', vendor: 'Tigist Bekele', vendorId: 2, price: 200, rating: 4.9, location: 'Bahir Dar', type: 'Babysitting', image: 'https://via.placeholder.com/300x200' },
    { id: 3, name: 'Event Catering', vendor: 'Hanna Girma', vendorId: 3, price: 5000, rating: 4.7, location: 'Addis Ababa', type: 'Catering', image: 'https://via.placeholder.com/300x200' },
    { id: 4, name: 'House Cleaning', vendor: 'Marta Assefa', vendorId: 4, price: 300, rating: 4.6, location: 'Mekelle', type: 'Cleaning', image: 'https://via.placeholder.com/300x200' },
    { id: 5, name: 'Sewing & Alterations', vendor: 'Sara Mulugeta', vendorId: 5, price: 250, rating: 4.9, location: 'Hawassa', type: 'Sewing', image: 'https://via.placeholder.com/300x200' },
    { id: 6, name: 'Hair Braiding', vendor: 'Bethlehem Tadesse', vendorId: 6, price: 180, rating: 4.8, location: 'Addis Ababa', type: 'Beauty', image: 'https://via.placeholder.com/300x200' },
    { id: 7, name: 'Home Cooking Service', vendor: 'Almaz Tesfaye', vendorId: 1, price: 400, rating: 4.7, location: 'Addis Ababa', type: 'Catering', image: 'https://via.placeholder.com/300x200' },
    { id: 8, name: 'Ironing Service', vendor: 'Tigist Bekele', vendorId: 2, price: 100, rating: 4.8, location: 'Bahir Dar', type: 'Laundry', image: 'https://via.placeholder.com/300x200' },
    { id: 9, name: 'Deep Cleaning Service', vendor: 'Marta Assefa', vendorId: 4, price: 500, rating: 4.7, location: 'Mekelle', type: 'Cleaning', image: 'https://via.placeholder.com/300x200' },
    { id: 10, name: 'Makeup & Beauty', vendor: 'Bethlehem Tadesse', vendorId: 6, price: 350, rating: 4.9, location: 'Addis Ababa', type: 'Beauty', image: 'https://via.placeholder.com/300x200' },
    { id: 11, name: 'Tailoring Service', vendor: 'Sara Mulugeta', vendorId: 5, price: 400, rating: 4.8, location: 'Hawassa', type: 'Sewing', image: 'https://via.placeholder.com/300x200' },
    { id: 12, name: 'Nanny Service', vendor: 'Tigist Bekele', vendorId: 2, price: 250, rating: 4.9, location: 'Bahir Dar', type: 'Babysitting', image: 'https://via.placeholder.com/300x200' }
  ];

  const serviceTypes = ['Laundry', 'Babysitting', 'Catering', 'Cleaning', 'Sewing', 'Beauty'];

  const filteredServices = allServices.filter(service => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || service.type === selectedType;

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
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
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

        {/* Results Info */}
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
      </div>
    </div>
  );
};

export default Services;
