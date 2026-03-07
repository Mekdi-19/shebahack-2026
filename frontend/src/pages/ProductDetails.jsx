import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import ReviewCard from '../components/ReviewCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isCustomer } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-500 text-lg mb-2">{error || 'Product not found'}</p>
            <button 
              onClick={() => navigate('/marketplace')} 
              className="text-primary hover:underline"
            >
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare product data with defaults
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600x400/CFAF2F/FFFFFF?text=No+Image'];
  
  const productReviews = product.reviews || [];
  const productSpecs = product.specifications || [];

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
                src={productImages[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg mb-4 border-2 border-gray-200"
              />
              <div className="flex gap-2">
                {productImages.map((img, index) => (
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
                {productSpecs.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {productSpecs.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No specifications available</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Seller</h3>
                <Link 
                  to={`/vendor/${product.vendor?._id || product.sellerId}`} 
                  className="text-primary hover:underline text-lg font-semibold"
                >
                  {product.vendor?.name || product.seller} →
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
          <h2 className="text-2xl font-bold text-text mb-6">Customer Reviews ({productReviews.length})</h2>
          {productReviews.length > 0 ? (
            <div className="space-y-4">
              {productReviews.map(review => (
                <ReviewCard key={review.id || review._id} review={review} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
