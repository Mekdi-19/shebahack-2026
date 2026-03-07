import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMyOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const orderDetails = await api.getOrderById(orderId);
      setSelectedOrder(orderDetails);
      setShowDetails(true);
    } catch (err) {
      alert('Failed to load order details: ' + err.message);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      alert('Order status updated successfully!');
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = await api.getOrderById(orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      alert('Failed to update order status: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-4">My Orders</h1>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold capitalize transition ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg mb-4">
              {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Order #{order._id.slice(-8)}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Vendor</p>
                    <p className="font-semibold">{order.vendor?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-primary text-xl">{order.totalAmount} ETB</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold capitalize">{order.paymentMethod?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className="font-semibold capitalize">{order.paymentStatus}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Items ({order.items?.length || 0})</p>
                  <div className="space-y-2">
                    {order.items?.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.itemName} x {item.quantity}</span>
                        <span className="font-semibold">{item.subtotal} ETB</span>
                      </div>
                    ))}
                    {order.items?.length > 2 && (
                      <p className="text-sm text-gray-500">+ {order.items.length - 2} more items</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(order._id)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold"
                  >
                    View Details
                  </button>
                  {user?.role === 'vendor' && order.status !== 'completed' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        const nextStatus = order.status === 'pending' ? 'confirmed' : 
                                         order.status === 'confirmed' ? 'in_progress' : 'completed';
                        handleUpdateStatus(order._id, nextStatus);
                      }}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-semibold"
                    >
                      Update Status
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-semibold">#{selectedOrder._id.slice(-8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold">
                        {new Date(selectedOrder.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order Type</p>
                      <p className="font-semibold capitalize">{selectedOrder.orderType}</p>
                    </div>
                  </div>
                </div>

                {/* Customer/Vendor Info */}
                <div>
                  <h3 className="font-bold text-lg mb-3">
                    {user?.role === 'vendor' ? 'Customer' : 'Vendor'} Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">
                      {user?.role === 'vendor' ? selectedOrder.customer?.name : selectedOrder.vendor?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {user?.role === 'vendor' ? selectedOrder.customer?.phone : selectedOrder.vendor?.phone}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="font-semibold">{item.itemName}</p>
                          <p className="text-sm text-gray-600">
                            {item.itemType} • Quantity: {item.quantity} • {item.price} ETB each
                          </p>
                        </div>
                        <p className="font-bold text-primary">{item.subtotal} ETB</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                {selectedOrder.deliveryAddress && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">Delivery Address</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.subcity}</p>
                      <p>{selectedOrder.deliveryAddress.specificLocation}</p>
                      <p className="text-sm text-gray-600 mt-2">Phone: {selectedOrder.deliveryAddress.phone}</p>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-semibold capitalize">{selectedOrder.paymentMethod?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className="font-semibold capitalize">{selectedOrder.paymentStatus}</span>
                    </div>
                    {selectedOrder.transactionId && (
                      <div className="flex justify-between">
                        <span>Transaction ID:</span>
                        <span className="font-semibold">{selectedOrder.transactionId}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                      <span>Total Amount:</span>
                      <span className="text-primary">{selectedOrder.totalAmount} ETB</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">Notes</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* Update Status (Vendor Only) */}
                {user?.role === 'vendor' && selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                  <div>
                    <h3 className="font-bold text-lg mb-3">Update Order Status</h3>
                    <div className="flex gap-2">
                      {selectedOrder.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, 'confirmed')}
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold"
                          >
                            Confirm Order
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(selectedOrder._id, 'cancelled')}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-semibold"
                          >
                            Cancel Order
                          </button>
                        </>
                      )}
                      {selectedOrder.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder._id, 'in_progress')}
                          className="flex-1 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition font-semibold"
                        >
                          Start Processing
                        </button>
                      )}
                      {selectedOrder.status === 'in_progress' && (
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder._id, 'completed')}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition font-semibold"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="w-full mt-6 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
