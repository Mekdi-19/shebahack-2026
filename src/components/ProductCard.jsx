import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RatingStars from './RatingStars';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user, isCustomer } = useAuth();

  const handleSpecialOffer = () => {
    navigate('/special-offer', { 
      state: { 
        itemName: product.name,
        itemType: 'product'
      } 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img 
        src={product.image || 'https://via.placeholder.com/300x200'} 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-text mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">by {product.seller}</p>
        <RatingStars rating={product.rating} size="sm" />
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-primary">{product.price} ETB</span>
          <Link 
            to={`/product/${product.id}`}
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            View Details
          </Link>
        </div>
        
        {/* Special Offer Button - Only for customers */}
        {user && isCustomer() && (
          <button
            onClick={handleSpecialOffer}
            className="w-full mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition font-semibold"
          >
            Special Offer
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
