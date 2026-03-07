import { useState } from 'react';
import UnifiedCard from '../components/UnifiedCard';
import SearchBar from '../components/SearchBar';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allProducts = [
    { id: 1, name: 'Traditional Coffee Set', price: 850, rating: 4.8, seller: 'Almaz Tesfaye', sellerId: 1, image: 'https://via.placeholder.com/300x200', category: 'crafts', location: 'Addis Ababa' },
    { id: 2, name: 'Handwoven Basket', price: 450, rating: 4.9, seller: 'Tigist Bekele', sellerId: 2, image: 'https://via.placeholder.com/300x200', category: 'crafts', location: 'Bahir Dar' },
    { id: 3, name: 'Homemade Injera', price: 120, rating: 4.7, seller: 'Hanna Girma', sellerId: 3, image: 'https://via.placeholder.com/300x200', category: 'food', location: 'Mekelle' },
    { id: 4, name: 'Spice Mix Collection', price: 280, rating: 4.6, seller: 'Marta Assefa', sellerId: 4, image: 'https://via.placeholder.com/300x200', category: 'food', location: 'Addis Ababa' },
    { id: 5, name: 'Embroidered Dress', price: 1200, rating: 4.9, seller: 'Sara Mulugeta', sellerId: 5, image: 'https://via.placeholder.com/300x200', category: 'clothing', location: 'Hawassa' },
    { id: 6, name: 'Honey (1kg)', price: 650, rating: 4.8, seller: 'Bethlehem Tadesse', sellerId: 6, image: 'https://via.placeholder.com/300x200', category: 'food', location: 'Addis Ababa' },
    { id: 7, name: 'Handmade Jewelry', price: 380, rating: 4.7, seller: 'Almaz Tesfaye', sellerId: 1, image: 'https://via.placeholder.com/300x200', category: 'beauty', location: 'Addis Ababa' },
    { id: 8, name: 'Traditional Scarf', price: 550, rating: 4.8, seller: 'Tigist Bekele', sellerId: 2, image: 'https://via.placeholder.com/300x200', category: 'clothing', location: 'Bahir Dar' },
    { id: 9, name: 'Berbere Spice', price: 150, rating: 4.9, seller: 'Hanna Girma', sellerId: 3, image: 'https://via.placeholder.com/300x200', category: 'food', location: 'Mekelle' },
    { id: 10, name: 'Clay Pottery Set', price: 720, rating: 4.6, seller: 'Marta Assefa', sellerId: 4, image: 'https://via.placeholder.com/300x200', category: 'crafts', location: 'Addis Ababa' },
    { id: 11, name: 'Woven Table Runner', price: 320, rating: 4.8, seller: 'Sara Mulugeta', sellerId: 5, image: 'https://via.placeholder.com/300x200', category: 'crafts', location: 'Hawassa' },
    { id: 12, name: 'Natural Shea Butter', price: 250, rating: 4.7, seller: 'Bethlehem Tadesse', sellerId: 6, image: 'https://via.placeholder.com/300x200', category: 'beauty', location: 'Addis Ababa' }
  ];

  const categories = ['crafts', 'food', 'clothing', 'beauty'];

  const filteredProducts = allProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      product.name.toLowerCase().includes(searchLower) ||
      product.seller.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
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

        {/* Results Info */}
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
      </div>
    </div>
  );
};

export default Marketplace;
