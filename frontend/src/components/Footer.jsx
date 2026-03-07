import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">EmpowerHer Market</h3>
            <p className="text-gray-400">Empowering Ethiopian women through digital marketplaces</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-primary">Home</Link></li>
              <li><Link to="/marketplace" className="text-gray-400 hover:text-primary">Marketplace</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-primary">Services</Link></li>
              <li><Link to="/learning" className="text-gray-400 hover:text-primary">Learning Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary">How It Works</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@empowerher.et</li>
              <li>Phone: +251 11 123 4567</li>
              <li>Addis Ababa, Ethiopia</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 EmpowerHer Market. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
