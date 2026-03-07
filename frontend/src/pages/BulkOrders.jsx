import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BulkOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bulkOrders, setBulkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    items: [{ itemType: 'product', itemName: '', quantity: 1, requestedPrice: '' }],
    deliverySchedule: { frequency: 'once', startDate: '', endDate: '' },
    deliveryAddress: { city: '', subcity: '', specificLocation: '', phone: '' },
    notes: '',
    paymentTerms: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchBulkOrders();
    }
  }, [user, navigate]);

  const fetchBulkOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getBulkOrders();
      setBulkOrders(data);
    } catch (err) {
      setError('Failed to load bulk orders');
      console.error('Error fetching bulk orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('deliverySchedule.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deliverySchedule: { ...prev.deliverySchedule, [field]: value }
      }));
    } else if (name.startsWith('deliveryAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deliveryAddress: { ...prev.deliveryAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemType: 'product', itemName: '', quantity: 1, requestedPrice: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert string values to numbers
      const bulkOrderData = {
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          quantity: parseInt(item.quantity),
          requestedPrice: item.requestedPrice ? parseFloat(item.requestedPrice) : undefined
        }))
      };

      await api.createBulkOrder(bulkOrderData);
      alert('Bulk order created successfully!');
      setShowForm(false);
      setFormData({
        items: [{ itemType: 'product', itemName: '', quantity: 1, requestedPrice: '' }],
        deliverySchedule: { frequency: 'once', startDate: '', endDate: '' },
        deliveryAddress: { city: '', subcity: '', specificLocation: '', phone: '' },
        notes: '',
        paymentTerms: ''
      });
      fetchBulkOrders();
    } catch (err) {
      alert('Failed to create bulk order: ' + err.message);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateBulkOrder(id, { status: newStatus });
      alert('Bulk order status updated successfully!');
      fetchBulkOrders();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      requested: 'bg-yellow-100 text-yellow-800',
      quoted: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Loading bulk orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-text">Bulk Orders</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            + Create Bulk Order
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Bulk Order Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Create Bulk Order</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Items */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Order Items *</label>
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                      <select
                        value={item.itemType}
                        onChange={(e) => handleItemChange(index, 'itemType', e.target.value)}
                        className="col-span-2 px-2 py-2 border rounded-lg"
                        required
                      >
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Item name"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        className="col-span-4 px-4 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="col-span-2 px-4 py-2 border rounded-lg"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price (optional)"
                        value={item.requestedPrice}
                        onChange={(e) => handleItemChange(index, 'requestedPrice', e.target.value)}
                        className="col-span-3 px-4 py-2 border rounded-lg"
                        step="0.01"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="col-span-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        disabled={formData.items.length === 1}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-primary hover:underline font-semibold"
                  >
                    + Add Item
                  </button>
                </div>

                {/* Delivery Schedule */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Schedule</label>
                  <div className="grid grid-cols-3 gap-4">
                    <select
                      name="deliverySchedule.frequency"
                      value={formData.deliverySchedule.frequency}
                      onChange={handleInputChange}
                      className="px-4 py-2 border rounded-lg"
                    >
                      <option value="once">Once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <input
                      type="date"
                      name="deliverySchedule.startDate"
                      value={formData.deliverySchedule.startDate}
                      onChange={handleInputChange}
                      className="px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="date"
                      name="deliverySchedule.endDate"
                      value={formData.deliverySchedule.endDate}
                      onChange={handleInputChange}
                      className="px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Address *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="deliveryAddress.city"
                      placeholder="City"
                      value={formData.deliveryAddress.city}
                      onChange={handleInputChange}
                      className="px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      name="deliveryAddress.subcity"
                      placeholder="Subcity"
                      value={formData.deliveryAddress.subcity}
                      onChange={handleInputChange}
                      className="px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      name="deliveryAddress.specificLocation"
                      placeholder="Specific location"
                      value={formData.deliveryAddress.specificLocation}
                      onChange={handleInputChange}
                      className="col-span-2 px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      type="tel"
                      name="deliveryAddress.phone"
                      placeholder="Phone number"
                      value={formData.deliveryAddress.phone}
                      onChange={handleInputChange}
                      className="px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Payment Terms */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Payment Terms</label>
                  <input
                    type="text"
                    name="paymentTerms"
                    placeholder="e.g., 50% upfront, 50% on delivery"
                    value={formData.paymentTerms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Additional information..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
                  >
                    Create Bulk Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Bulk Orders List */}
        {bulkOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg mb-4">No bulk orders yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-primary hover:underline font-semibold"
            >
              Create your first bulk order
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bulkOrders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Bulk Order #{order._id.slice(-8)}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Items</p>
                    <p className="font-semibold">{order.items?.length || 0} items</p>
                  </div>
                  {order.totalAmount && (
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-semibold text-primary text-xl">{order.totalAmount} ETB</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Delivery Frequency</p>
                    <p className="font-semibold capitalize">{order.deliverySchedule?.frequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{order.deliveryAddress?.city}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Items</p>
                  <div className="space-y-2">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{item.itemName} ({item.itemType}) x {item.quantity}</span>
                        {item.quotedPrice && (
                          <span className="font-semibold">{item.quotedPrice} ETB</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {user?.role === 'vendor' && order.status === 'requested' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'quoted')}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold"
                    >
                      Send Quote
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkOrders;
