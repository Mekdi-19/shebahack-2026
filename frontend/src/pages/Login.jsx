import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'customer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create simple user object
    const user = {
      _id: 'temp_' + Date.now(),
      id: 'temp_' + Date.now(),
      name: formData.email.split('@')[0] || 'User',
      email: formData.email,
      role: formData.userType,
      isApproved: true
    };

    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('tempUser', JSON.stringify(user));
    localStorage.setItem('token', 'temp_token_' + Date.now());

    // Force page reload to update AuthContext
    window.location.href = getRedirectPath(formData.userType);
  };

  const getRedirectPath = (userType) => {
    if (userType === 'admin') {
      // Admin goes directly to admin dashboard - NO authentication needed
      return '/admin';
    } else if (userType === 'vendor') {
      // Vendor goes to vendor dashboard where they can:
      // - Add products (/vendor-products)
      // - Add services (/vendor-services)
      // - Accept invitations
      // - Manage orders
      return '/dashboard';
    } else {
      // Customer goes to marketplace
      return '/marketplace';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-text mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Login As</label>
              <select
                value={formData.userType}
                onChange={(e) => setFormData({...formData, userType: e.target.value})}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:border-primary focus:outline-none"
              >
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition mb-4"
            >
              Sign In
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Role Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Quick Guide:</strong>
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>Customer:</strong> Browse and buy products/services</li>
            <li>• <strong>Vendor:</strong> Add products, services, manage orders</li>
            <li>• <strong>Admin:</strong> Approve vendors, products, services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
