import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();
  const { user, logout, isVendor, isCustomer } = useAuth();

  const translations = {
    en: { home: 'Home', marketplace: 'Marketplace', services: 'Services', specialOffer: 'Special Offer', learning: 'Learning', teams: 'Teams', dashboard: 'Dashboard', login: 'Login', signup: 'Sign Up', logout: 'Logout' },
    am: { home: 'መነሻ', marketplace: 'ገበያ', services: 'አገልግሎቶች', specialOffer: 'ልዩ ቅናሽ', learning: 'ትምህርት', teams: 'ቡድኖች', dashboard: 'ዳሽቦርድ', login: 'ግባ', signup: 'ተመዝገብ', logout: 'ውጣ' },
    om: { home: 'Mana', marketplace: 'Gabaa', services: 'Tajaajila', specialOffer: 'Dhiyeessii Addaa', learning: 'Barnoota', teams: 'Garee', dashboard: 'Daashboordii', login: 'Seeni', signup: 'Galmaa\'i', logout: 'Ba\'i' },
    ti: { home: 'ገጽ', marketplace: 'ዕዳጋ', services: 'ኣገልግሎት', specialOffer: 'ፍሉይ ቅናሽ', learning: 'ትምህርቲ', teams: 'ጉጅለታት', dashboard: 'ዳሽቦርድ', login: 'እቶ', signup: 'ምዝገባ', logout: 'ውጻእ' }
  };

  const t = translations[language];

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => 
    `text-text hover:text-primary transition ${isActive(path) ? 'text-primary font-semibold border-b-2 border-primary' : ''}`;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">EmpowerHer</span>
            <span className="text-secondary">Market</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={navLinkClass('/')}>{t.home}</Link>
            <Link to="/marketplace" className={navLinkClass('/marketplace')}>{t.marketplace}</Link>
            <Link to="/services" className={navLinkClass('/services')}>{t.services}</Link>
            
            {/* Show Special Offer only for customers */}
            {user && isCustomer() && (
              <Link to="/special-offer" className={navLinkClass('/special-offer')}>{t.specialOffer}</Link>
            )}
            
            <Link to="/learning" className={navLinkClass('/learning')}>{t.learning}</Link>
            
            {/* Show Dashboard only for vendors */}
            {user && isVendor() && (
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>{t.dashboard}</Link>
            )}
            
            {/* Show Admin Dashboard only for admins */}
            {user && user.role === 'admin' && (
              <Link to="/admin" className={navLinkClass('/admin')}>Admin</Link>
            )}
            
            {/* Show Cart for logged-in customers only */}
            {user && isCustomer() && (
              <Link to="/cart" className="relative text-text hover:text-primary transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                {/*<span className="text-gray-600">Hi, {user.name}</span>*/}
                <button
                  onClick={handleLogout}
                  className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-text hover:text-primary transition">{t.login}</Link>
                <Link to="/signup" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition">{t.signup}</Link>
              </>
            )}
            
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
              <option value="om">Afaan Oromo</option>
              <option value="ti">ትግርኛ</option>
            </select>
          </div>

          <button 
            className="md:hidden text-text"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/')}`}>{t.home}</Link>
            <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/marketplace')}`}>{t.marketplace}</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/services')}`}>{t.services}</Link>
            
            {user && isCustomer() && (
              <Link to="/special-offer" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/special-offer')}`}>{t.specialOffer}</Link>
            )}
            
            <Link to="/learning" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/learning')}`}>{t.learning}</Link>
            
            {user && isVendor() && (
              <Link to="/teams" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/teams')}`}>{t.teams}</Link>
            )}
            
            {user && isVendor() && (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`block ${navLinkClass('/dashboard')}`}>{t.dashboard}</Link>
            )}
            
            {user && isCustomer() && (
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block text-text hover:text-primary">Cart ({getCartCount()})</Link>
            )}
            
            {user ? (
              <>
                <div className="text-gray-600 py-2">Hi, {user.name}</div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left bg-secondary text-white px-6 py-2 rounded-lg"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-text hover:text-primary">{t.login}</Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block bg-primary text-white px-6 py-2 rounded-lg text-center">{t.signup}</Link>
              </>
            )}
            
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-2"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
              <option value="om">Afaan Oromo</option>
              <option value="ti">ትግርኛ</option>
            </select>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
