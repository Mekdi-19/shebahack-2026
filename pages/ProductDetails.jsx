import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isCustomer } = useAuth(); // Allow any logged-in user including vendors
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    id: Number(id),
    name: 'Traditional Coffee Set',
    price: 850,
    rating: 4.8,
    seller: 'Almaz Tesfaye',
    sellerId: 1,
    description: 'Handcrafted traditional Ethiopian coffee set including jebena (coffee pot), cups, and serving tray. Perfect for traditional coffee ceremonies. Made with high-quality materials and traditional craftsmanship passed down through generations.',
    images: [
      'https://via.placeholder.com/600x400/CFAF2F/FFFFFF?text=Coffee+Set+1',
      'https://via.placeholder.com/600x400/E63946/FFFFFF?text=Coffee+Set+2',
      'https://via.placeholder.com/600x400/CFAF2F/FFFFFF?text=Coffee+Set+3'
    ],
    inStock: true,
    category: 'Crafts',
    specifications: [
      'Material: Traditional clay and ceramic',
      'Set includes: 1 Jebena, 6 cups, 1 serving tray',
      'Handmade by skilled artisans',
      'Perfect for 6-8 people'
    ]
  };

  const reviews = [
    { id: 1, userName: 'Dawit Kebede', rating: 5, date: '2 weeks ago', comment: 'Beautiful craftsmanship! Exactly as described. The coffee set is perfect for our family gatherings.', userImage: 'https://via.placeholder.com/50' },
    { id: 2, userName: 'Meron Haile', rating: 4, date: '1 month ago', comment: 'Great quality, fast delivery. Very happy with my purchase!', userImage: 'https://via.placeholder.com/50' },
    { id: 3, userName: 'Sara Mulugeta', rating: 5, date: '2 months ago', comment: 'Absolutely love it! The traditional design is authentic and beautiful.', userImage: 'https://via.placeholder.com/50' }
  ];

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
  };

  const handleOrderNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleSpecialOffer = () => {
    navigate('/special-offer', { 
      state: { 
        itemName: product.name,
        itemType: 'product'
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary">Home</Link>
          {' > '}
          <Link to="/marketplace" className="hover:text-primary">Marketplace</Link>
          {' > '}
          <span className="text-text">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg mb-4 border-2 border-gray-200"
              />
              <div className="flex gap-2">
                {product.images.map((img, index) => (
                  <img 
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition-all hover:scale-105 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-2">
                <span className="bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-text mb-4">{product.name}</h1>
              <RatingStars rating={product.rating} size="lg" />
              
              <div className="my-6">
                <p className="text-4xl font-bold text-primary">{product.price} ETB</p>
                <p className={`text-sm mt-2 font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Specifications</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {product.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Seller</h3>
                <Link 
                  to={`/vendor/${product.sellerId}`} 
                  className="text-primary hover:underline text-lg font-semibold"
                >
                  {product.seller} →
                </Link>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition"
                    disabled={!product.inStock}
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={handleOrderNow}
                    className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition"
                    disabled={!product.inStock}
                  >
                    Order Now
                  </button>
                </div>

                {/* Special Offer Button - Only for customers */}
                {user && isCustomer() && (
                  <button
                    onClick={handleSpecialOffer}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
                  >
                    Request Special Offer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-text mb-6">Customer Reviews ({reviews.length})</h2>
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
