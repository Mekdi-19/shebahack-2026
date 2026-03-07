import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import VendorCard from '../components/VendorCard';
import HowItWorksCard from '../components/HowItWorksCard';
import VideoModal from '../components/VideoModal';

const Home = () => {
  const [showTutorial, setShowTutorial] = useState(() => {
    return sessionStorage.getItem('tutorialSkipped') !== 'true';
  });
  const [videoModal, setVideoModal] = useState({ isOpen: false, url: '', title: '' });
  const mainContentRef = useRef(null);

  const popularVendors = [
    { id: 1, name: 'Almaz Tesfaye', location: 'Addis Ababa', rating: 4.8, skills: ['Baking', 'Catering'], image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'Tigist Bekele', location: 'Bahir Dar', rating: 4.9, skills: ['Sewing', 'Embroidery'], image: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Hanna Girma', location: 'Mekelle', rating: 4.7, skills: ['Cleaning', 'Laundry'], image: 'https://via.placeholder.com/80' }
  ];

  const howItWorksSteps = [
    {
      step: 1,
      icon: '👤',
      title: 'Create Profile',
      description: 'Sign up and set up your vendor profile',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      step: 2,
      icon: '📦',
      title: 'List Products or Services',
      description: 'Add your offerings with photos and descriptions',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      step: 3,
      icon: '📬',
      title: 'Receive Orders',
      description: 'Get notified when customers place orders',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      step: 4,
      icon: '💰',
      title: 'Earn Income',
      description: 'Receive payments directly to your account',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const handleSkipTutorial = () => {
    setShowTutorial(false);
    sessionStorage.setItem('tutorialSkipped', 'true');
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openVideoModal = (url, title) => {
    setVideoModal({ isOpen: true, url, title });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, url: '', title: '' });
  };

  return (
    <div>
      
      {/* Main Content */}
      <div ref={mainContentRef}>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-yellow-500 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empowering Ethiopian Women Through Digital Marketplaces
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with talented women entrepreneurs offering homemade products and local services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/marketplace" 
                className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition"
              >
                Browse Products
              </Link>
              <Link 
                to="/signup" 
                className="bg-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition"
              >
                Offer Your Skills
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-text mb-12">Why Choose EmpowerHer Market?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold mb-2">Sell Homemade Products</h3>
                <p className="text-gray-600">Share your crafts and homemade goods with customers nationwide</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-xl font-semibold mb-2">Offer Local Services</h3>
                <p className="text-gray-600">Provide services like catering, cleaning, and childcare</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">💳</div>
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600">Safe and reliable payment processing for all transactions</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Learn Business Skills</h3>
                <p className="text-gray-600">Access free training on entrepreneurship and financial literacy</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-text mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step) => (
                <HowItWorksCard
                  key={step.step}
                  step={step.step}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  onWatchTutorial={() => openVideoModal(step.videoUrl, step.title)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Popular Vendors */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-text mb-12">Popular Vendors</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularVendors.map(vendor => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/marketplace" className="text-primary font-semibold text-lg hover:underline">
                View All Vendors →
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </div>
  );
};

export default Home;
