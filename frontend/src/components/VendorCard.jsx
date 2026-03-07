import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';

const VendorCard = ({ vendor }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <img 
          src={vendor.image || 'https://via.placeholder.com/80'} 
          alt={vendor.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-text">{vendor.name}</h3>
          <p className="text-sm text-gray-600">📍 {vendor.location}</p>
          <RatingStars rating={vendor.rating} size="sm" />
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Skills:</p>
        <div className="flex flex-wrap gap-2">
          {vendor.skills.map((skill, index) => (
            <span key={index} className="bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <Link 
        to={`/vendor/${vendor.id}`}
        className="block w-full bg-secondary text-white text-center px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
      >
        View Profile
      </Link>
    </div>
  );
};

export default VendorCard;
