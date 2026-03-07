import { useState, useEffect } from 'react';
import UnifiedCard from '../components/UnifiedCard';
import SearchBar from '../components/SearchBar';
import api from '../services/api';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['crafts', 'food', 'clothing', 'beauty'];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProducts();
        setAllProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = allProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const vendorName = product.vendor?.name || '';
    const matchesSearch = (
      product.name?.toLowerCase().includes(searchLower) ||
      vendorName.toLowerCase().includes(searchLower) ||
      product.category?.toLowerCase().includes(searchLower)
    );

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-text mb-8">Marketplace</h1>
        
        {/* Search Bar at Top */}
        <div className="mb-8">
          <SearchBar 
            placeholder="Search by product name, category, or seller..." 
            onSearch={setSearchTerm}
          />
        </div>

        {/* Filter Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              All Products
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Loading products...</p>
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
                Showing {filteredProducts.length} of {allProducts.length} products
              </p>
              {searchTerm && (
                <p className="text-sm text-gray-500">
                  Search results for: <span className="font-semibold">"{searchTerm}"</span>
                </p>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <p className="text-gray-400">Try searching with different keywords</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <UnifiedCard key={product.id} item={product} type="product" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
