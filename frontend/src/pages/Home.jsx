import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import HowItWorksCard from '../components/HowItWorksCard';
import VideoModal from '../components/VideoModal';
import heroImage from '../assets/hero.jpg';
import girlImage from '../assets/girl.jpg';
import ceoImage from '../assets/ceo.jpg';
import BenefitsSection from '../components/BenefitsSection';

const Home = () => {
  const [videoModal, setVideoModal] = useState({ isOpen: false, url: '', title: '' });
  const mainContentRef = useRef(null);

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
      icon: '📩',
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

  const openVideoModal = (url, title) => {
    setVideoModal({ isOpen: true, url, title });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, url: '', title: '' });
  };

  return (
    <div>

      <div ref={mainContentRef}>

        {/* Hero Section */}
        <section className="bg-white py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              <div>
                <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-800 via-secondary to-primary bg-clip-text text-transparent">
                  Empowering Ethiopian Women Through Digital Marketplace
                </h1>

                <p className="text-xl mb-8 max-w-xl font-medium bg-gradient-to-r from-gray-700 via-primary to-pink-medium bg-clip-text text-transparent">
                  Connect with talented women entrepreneurs offering homemade products and local services
                </p>
              </div>
              
              {/* Hero Image */}
              <div className="relative flex justify-center">
                <img 
                  src={heroImage} 
                  alt="Ethiopian Women Entrepreneurs" 
                  className="w-[500px] h-[500px] object-cover rounded-full border-8 border-secondary"
                />
              </div>

            </div>

          </div>
        </section>

        {/* Search Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Search Products
            </h2>

            <div className="flex gap-4 max-w-2xl mx-auto">

              <input
                type="text"
                placeholder="Search products"
                className="flex-1 px-6 py-4 rounded-full border-2 border-gray-200"
              />

              <button className="bg-secondary text-white px-8 py-4 rounded-full">
                Search
              </button>

            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <BenefitsSection />

        {/* How It Works */}
        <section className="py-16 bg-white">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              How It Works
            </h2>

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

      </div>

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