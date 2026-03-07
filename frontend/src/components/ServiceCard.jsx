import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RatingStars from './RatingStars';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const { user, isCustomer } = useAuth();

  const handleSpecialOffer = () => {
    navigate('/special-offer', { 
      state: { 
        itemName: service.name,
        itemType: 'service'
      } 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-xl text-text mb-2">{service.name}</h3>
          <p className="text-gray-600 mb-1">
            by{' '}
            <Link 
              to={`/vendor/${service.vendorId}`}
              className="text-primary hover:underline font-semibold"
            >
              {service.vendor}
            </Link>
          </p>
          <p className="text-sm text-gray-500 mb-2">📍 {service.location}</p>
          <RatingStars rating={service.rating} size="sm" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{service.price} ETB</p>
          <p className="text-sm text-gray-500">per service</p>
        </div>
      </div>
      
      <Link 
        to={`/booking/${service.id}`}
        className="block w-full bg-secondary text-white text-center px-4 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold mb-3"
      >
        Book Service
      </Link>

      {/* Special Offer Button - Only for customers */}
      {user && isCustomer() && (
        <button
          onClick={handleSpecialOffer}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-lg transition font-semibold"
        >
          Special Offer
        </button>
      )}
    </div>
  );
};

export default ServiceCard;
