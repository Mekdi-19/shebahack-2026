const OrderCard = ({ order }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-text">{order.productName}</h3>
          <p className="text-sm text-gray-600">Order #{order.id}</p>
          <p className="text-sm text-gray-600">{order.date}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600">Customer: {order.customer}</p>
          <p className="text-gray-600">Quantity: {order.quantity}</p>
        </div>
        <p className="text-2xl font-bold text-primary">{order.total} ETB</p>
      </div>
    </div>
  );
};

export default OrderCard;
