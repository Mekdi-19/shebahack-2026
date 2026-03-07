import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [userType, setUserType] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    skills: '',
    businessName: '',
    organizationType: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // TEMPORARY AUTHENTICATION - Accept any data for testing
    // Create temporary user
    const tempUser = {
      _id: 'temp_' + Date.now(),
      id: 'temp_' + Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: userType,
      location: formData.location ? { city: formData.location } : null,
      skills: userType === 'vendor' && formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
      businessName: userType === 'organization' ? formData.businessName : null,
      organizationType: userType === 'organization' ? formData.organizationType : null,
      isApproved: true
    };

    // Store in localStorage
    localStorage.setItem('tempUser', JSON.stringify(tempUser));
    localStorage.setItem('token', 'temp_token_' + Date.now());
    localStorage.setItem('user', JSON.stringify(tempUser));

    // Redirect based on role
    setTimeout(() => {
      if (userType === 'vendor') {
        navigate('/dashboard');
      } else if (userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }, 500);

    /* FUTURE: Replace with real authentication
    // Prepare data based on user type
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: userType,
      language: 'english'
    };

    if (formData.location) {
      userData.location = { city: formData.location };
    }

    if (userType === 'vendor' && formData.skills) {
      userData.skills = formData.skills.split(',').map(s => s.trim());
    }

    if (userType === 'organization') {
      userData.businessName = formData.businessName;
      userData.organizationType = formData.organizationType;
    }

    const result = await signup(userData);

    if (result.success) {
      // Redirect based on role
      if (result.user.role === 'vendor') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
    */
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-text mb-2">Create Account</h2>
          <p className="text-gray-600">Join EmpowerHer Market today</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Temporary Mode Notice */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-600 font-semibold">
              ⚠️ Temporary Mode: Registration works without backend for testing
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">I am a:</label>
            <div className="grid grid-cols-3 gap-2">
              {['customer', 'vendor', 'organization'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    userType === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                  disabled={loading}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="••••••••"
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="+251912345678"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="City, Ethiopia"
                disabled={loading}
              />
            </div>

            {userType === 'vendor' && (
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                  placeholder="e.g., Baking, Catering, Crafts"
                  disabled={loading}
                />
              </div>
            )}

            {userType === 'organization' && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="Your business name"
                    disabled={loading}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Organization Type</label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
                    className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                    disabled={loading}
                  >
                    <option value="">Select type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="office">Office</option>
                    <option value="shop">Shop</option>
                    <option value="hotel">Hotel</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-secondary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account (Temporary Mode)'}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
