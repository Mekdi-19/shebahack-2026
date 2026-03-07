import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('favorites');

  // Mock orders with status (in real app, this would come from backend)
  const [orders] = useState(() => {
    const savedOrders = localStorage.getItem('customerOrders');
    return savedOrders ? JSON.parse(savedOrders) : [
      { id: 1, name: 'Handmade Basket', seller: 'Almaz Tesfaye', price: 450, quantity: 1, status: 'ordered', image: '', orderDate: '2024-03-01' },
      { id: 2, name: 'Traditional Coffee Set', seller: 'Tigist Bekele', price: 800, quantity: 1, status: 'on-the-way', image: '', orderDate: '2024-03-03' },
      { id: 3, name: 'Embroidered Scarf', seller: 'Meron Haile', price: 350, quantity: 2, status: 'delivered', image: '', orderDate: '2024-02-28' }
    ];
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Filter items based on active filter
  const getFilteredItems = () => {
    switch (activeFilter) {
      case 'ordered':
        return orders.filter(item => item.status === 'ordered');
      case 'on-the-way':
        return orders.filter(item => item.status === 'on-the-way');
      case 'delivered':
        return orders.filter(item => item.status === 'delivered');
      case 'favorites':
      default:
        return cart; // Cart items are "favorites" (not yet ordered)
    }
  };

  const filteredItems = getFilteredItems();
  const isCartView = activeFilter === 'favorites';

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-text mb-8">My Orders & Cart</h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveFilter('favorites')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeFilter === 'favorites'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Favorites ({cart.length})
          </button>
          <button
            onClick={() => setActiveFilter('ordered')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeFilter === 'ordered'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Ordered ({orders.filter(o => o.status === 'ordered').length})
          </button>
          <button
            onClick={() => setActiveFilter('on-the-way')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeFilter === 'on-the-way'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            On The Way ({orders.filter(o => o.status === 'on-the-way').length})
          </button>
          <button
            onClick={() => setActiveFilter('delivered')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeFilter === 'delivered'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Delivered ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {activeFilter === 'favorites' ? '🛒' : '📦'}
            </div>
            <h2 className="text-3xl font-bold text-text mb-4">
              {activeFilter === 'favorites' ? 'Your cart is empty' : `No ${activeFilter.replace('-', ' ')} orders`}
            </h2>
            <p className="text-gray-600 mb-8">
              {activeFilter === 'favorites' 
                ? 'Start shopping to add items to your cart' 
                : 'You have no orders in this category'}
            </p>
            <Link
              to="/marketplace"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex gap-6">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-text mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">by {item.seller}</p>
                      <p className="text-primary font-bold text-xl">{item.price} ETB</p>
                      {!isCartView && (
                        <div className="mt-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'ordered' ? 'bg-yellow-100 text-yellow-800' :
                            item.status === 'on-the-way' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      {isCartView ? (
                        <>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm">
                            Subtotal: {item.price * item.quantity} ETB
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                          <p className="text-gray-600 text-sm">
                            Total: {item.price * item.quantity} ETB
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            Ordered: {new Date(item.orderDate).toLocaleDateString()}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isCartView && cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Order Summary - Only show for cart view */}
            {isCartView && cart.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-text mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                      <span className="font-semibold">{getCartTotal()} ETB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">Free</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">{getCartTotal()} ETB</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-secondary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition mb-3"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/marketplace"
                    className="block text-center text-primary hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
