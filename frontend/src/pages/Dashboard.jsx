import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isVendor } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not logged in (but allow vendors and admins)
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'customer') {
      // Customers should go to marketplace instead
      navigate('/marketplace');
    }
    // Allow vendors and admins to access dashboard
  }, [user, navigate]);

  // Mock data for vendor dashboard
  const stats = {
    totalOrders: 156,
    totalEarnings: 45600,
    activeListings: 12
  };

  const mockProducts = [
    { id: 1, name: 'Traditional Coffee Set', price: 850, stock: 15, status: 'active', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Handwoven Basket', price: 450, stock: 8, status: 'active', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Spice Mix Collection', price: 280, stock: 25, status: 'active', image: 'https://via.placeholder.com/100' },
    { id: 4, name: 'Handmade Jewelry', price: 380, stock: 12, status: 'active', image: 'https://via.placeholder.com/100' }
  ];

  const mockServices = [
    { id: 1, name: 'Professional Laundry Service', price: 150, bookings: 45, status: 'active' },
    { id: 2, name: 'Event Catering', price: 5000, bookings: 12, status: 'active' },
    { id: 3, name: 'Home Cooking Service', price: 400, bookings: 28, status: 'active' }
  ];

  const orders = [
    { id: '001', productName: 'Traditional Coffee Set', customer: 'Dawit Kebede', quantity: 2, total: 1700, status: 'pending', date: '2024-03-05' },
    { id: '002', productName: 'Handwoven Basket', customer: 'Meron Haile', quantity: 1, total: 450, status: 'completed', date: '2024-03-04' },
    { id: '003', productName: 'Spice Mix Collection', customer: 'Sara Mulugeta', quantity: 3, total: 840, status: 'pending', date: '2024-03-03' },
    { id: '004', productName: 'Handmade Jewelry', customer: 'Bethlehem Tadesse', quantity: 1, total: 380, status: 'completed', date: '2024-03-02' }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Orders</p>
              <span className="text-3xl">📦</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Total Earnings</p>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats.totalEarnings} ETB</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600">Active Listings</p>
              <span className="text-3xl">📋</span>
            </div>
            <p className="text-4xl font-bold text-primary">{stats.activeListings}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => navigate('/vendor-products')}
            className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-xl font-bold mb-2">Manage Products</h3>
            <p className="text-sm opacity-90">Add, edit, or remove your products</p>
          </button>

          <button
            onClick={() => navigate('/vendor-services')}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">🛠️</div>
            <h3 className="text-xl font-bold mb-2">Manage Services</h3>
            <p className="text-sm opacity-90">Add, edit, or remove your services</p>
          </button>
          
          <button
            onClick={() => navigate('/vendor-groups')}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-xl font-bold mb-2">Vendor Groups</h3>
            <p className="text-sm opacity-90">Join collaboration groups</p>
          </button>

          <button
            onClick={() => navigate('/venture-opportunities')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-xl font-bold mb-2">Venture Opportunities</h3>
            <p className="text-sm opacity-90">Explore new opportunities</p>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {['overview', 'products', 'services', 'orders', 'venture-opportunities', 'my-ventures'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-semibold transition whitespace-nowrap ${
                    activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-primary'
                  }`}
                >
                  {tab === 'venture-opportunities' ? 'Venture Opportunities' : 
                   tab === 'my-ventures' ? 'My Ventures' : 
                   tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                <div className="space-y-4">
                  {orders.slice(0, 3).map(order => (
                    <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{order.productName}</h3>
                          <p className="text-sm text-gray-600">Customer: {order.customer}</p>
                          <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{order.total} ETB</p>
                          <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Manage Products</h2>
                  <button 
                    onClick={() => navigate('/vendor-products')}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Go to Product Management
                  </button>
                </div>
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold mb-2">Product Management</h3>
                  <p className="text-gray-600 mb-6">Add, edit, and manage all your products</p>
                  <button
                    onClick={() => navigate('/vendor-products')}
                    className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Manage Products
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Manage Services</h2>
                  <button 
                    onClick={() => navigate('/vendor-services')}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Go to Service Management
                  </button>
                </div>
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">🛠️</div>
                  <h3 className="text-xl font-semibold mb-2">Service Management</h3>
                  <p className="text-gray-600 mb-6">Add, edit, and manage all your services</p>
                  <button
                    onClick={() => navigate('/vendor-services')}
                    className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Manage Services
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Order Management</h2>
                  <button 
                    onClick={() => navigate('/orders')}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Go to Order Management
                  </button>
                </div>
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold mb-2">Order Management</h3>
                  <p className="text-gray-600 mb-6">View and manage all your orders</p>
                  <button
                    onClick={() => navigate('/orders')}
                    className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Manage Orders
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'venture-opportunities' && (
              <div>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤝</div>
                  <h2 className="text-2xl font-bold text-text mb-4">Venture Opportunities</h2>
                  <p className="text-gray-600 mb-6">Collaborate with other vendors on large orders</p>
                  <button
                    onClick={() => navigate('/venture-opportunities')}
                    className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    View All Opportunities
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'my-ventures' && (
              <div>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚀</div>
                  <h2 className="text-2xl font-bold text-text mb-4">My Ventures</h2>
                  <p className="text-gray-600 mb-6">Your active and completed venture collaborations</p>
                  <button
                    onClick={() => navigate('/my-ventures')}
                    className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    View My Ventures
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
