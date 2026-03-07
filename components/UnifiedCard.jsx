import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import RatingStars from './RatingStars';
import { useState } from 'react';

const UnifiedCard = ({ item, type = 'product' }) => {
  const navigate = useNavigate();
  const { user, isCustomer } = useAuth();
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);

  const handleSpecialOffer = () => {
    navigate('/special-offer', { 
      state: { 
        itemName: item.name,
        itemType: type
      } 
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    // Convert service to cart format if needed
    const cartItem = type === 'service' ? {
      id: item.id,
      name: item.name,
      price: item.price,
      seller: item.vendor,
      image: item.image || '',
      type: 'service'
    } : item;

    addToCart(cartItem, 1);
    
    // Show notification
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const getDetailLink = () => {
    return type === 'service' ? `/booking/${item.id}` : `/product/${item.id}`;
  };

  const getVendorLink = () => {
    return `/vendor/${item.vendorId || item.sellerId}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative">
      {/* Notification */}
      {showNotification && (
        <div className="absolute top-2 left-2 right-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold text-center z-10 animate-pulse">
          Item added to cart ✓
        </div>
      )}

      {/* Image */}
      <div className="relative">
        <img 
          src={item.image || 'https://via.placeholder.com/300x200'} 
          alt={item.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Add to Cart Icon - Only for customers */}
        {user && isCustomer() && (
          <button
            onClick={handleAddToCart}
            className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Add to cart"
          >
            <span className="text-xl">🛒</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg text-text mb-2 line-clamp-2">{item.name}</h3>
        
        {/* Vendor */}
        <p className="text-gray-600 text-sm mb-1">
          by{' '}
          <Link 
            to={getVendorLink()}
            className="text-primary hover:underline font-semibold"
          >
            {item.vendor || item.seller}
          </Link>
        </p>
        
        {/* Location */}
        <p className="text-sm text-gray-500 mb-2">📍 {item.location || 'Addis Ababa'}</p>
        
        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={item.rating} size="sm" />
        </div>
        
        {/* Price */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-2xl font-bold text-primary">{item.price} ETB</span>
            {type === 'service' && (
              <p className="text-xs text-gray-500">per service</p>
            )}
          </div>
        </div>
        
        {/* Buttons */}
        <div className="space-y-2">
          {/* View Details Button */}
          <Link 
            to={getDetailLink()}
            className="block w-full bg-secondary text-white text-center px-4 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
          >
            {type === 'service' ? 'Book Service' : 'View Details'}
          </Link>
          
          {/* Special Offer Button - Only for customers */}
          {user && isCustomer() && (
            <button
              onClick={handleSpecialOffer}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              Special Offer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedCard;