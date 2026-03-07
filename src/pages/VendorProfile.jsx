import { useParams } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import ServiceCard from '../components/ServiceCard';
import ReviewCard from '../components/ReviewCard';

const VendorProfile = () => {
  const { id } = useParams();

  const vendor = {
    id: 1,
    name: 'Almaz Tesfaye',
    location: 'Addis Ababa, Ethiopia',
    rating: 4.8,
    image: 'https://via.placeholder.com/150',
    skills: ['Baking', 'Catering', 'Traditional Coffee'],
    bio: 'Passionate baker and caterer with 10 years of experience. I specialize in traditional Ethiopian cuisine and modern fusion dishes.',
    joinedDate: 'January 2023',
    totalOrders: 156,
    responseTime: '2 hours'
  };

  const products = [
    { id: 1, name: 'Traditional Coffee Set', price: 850, rating: 4.8, seller: 'Almaz Tesfaye', image: 'https://via.placeholder.com/300x200' },
    { id: 2, name: 'Spice Mix Collection', price: 280, rating: 4.6, seller: 'Almaz Tesfaye', image: 'https://via.placeholder.com/300x200' }
  ];

  const services = [
    { id: 1, name: 'Event Catering', vendor: 'Almaz Tesfaye', price: 5000, rating: 4.7, location: 'Addis Ababa' }
  ];

  const reviews = [
    { id: 1, userName: 'Dawit Kebede', rating: 5, date: '2 weeks ago', comment: 'Excellent service! The food was delicious and delivery was on time.', userImage: 'https://via.placeholder.com/50' },
    { id: 2, userName: 'Meron Haile', rating: 4, date: '1 month ago', comment: 'Great quality products. Will order again!', userImage: 'https://via.placeholder.com/50' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Vendor Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <img 
              src={vendor.image} 
              alt={vendor.name}
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text mb-2">{vendor.name}</h1>
              <p className="text-gray-600 mb-2">📍 {vendor.location}</p>
              <RatingStars rating={vendor.rating} size="lg" />
              <p className="text-gray-700 mt-4">{vendor.bio}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{vendor.totalOrders}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{vendor.responseTime}</p>
                  <p className="text-sm text-gray-600">Response Time</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{vendor.joinedDate}</p>
                  <p className="text-sm text-gray-600">Member Since</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-3">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {vendor.skills.map((skill, index) => (
                <span key={index} className="bg-primary bg-opacity-20 text-primary px-4 py-2 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text mb-4">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text mb-4">Services Offered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold text-text mb-4">Customer Reviews</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
