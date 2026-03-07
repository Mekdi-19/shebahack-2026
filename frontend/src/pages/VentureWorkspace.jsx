import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVenture } from '../context/VentureContext';

const VentureWorkspace = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isVendor } = useAuth();
  const { ventureTeams, updateVendorProgress, mockVendors } = useVenture();
  const [activeTab, setActiveTab] = useState('overview');
  const [venture, setVenture] = useState(null);
  const [myProgress, setMyProgress] = useState(0);

  // Redirect if not vendor
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isVendor()) {
      navigate('/');
    }
  }, [user, isVendor, navigate]);

  // Get vendor ID
  const getVendorId = () => {
    const vendor = mockVendors.find(v => v.name === user.name);
    return vendor?.id || 3;
  };

  // Load venture data from context
  useEffect(() => {
    const team = ventureTeams.find(t => t.id === parseInt(id));
    if (team) {
      setVenture(team);
      
      // Get my progress
      const vendorId = getVendorId();
      const myMember = team.members.find(m => m.vendorId === vendorId);
      if (myMember) {
        setMyProgress(myMember.progress);
      }
    }
  }, [id, ventureTeams]);

  const handleUpdateProgress = () => {
    const newProgress = prompt(`Update your production progress (current: ${myProgress}%)`, myProgress);
    if (newProgress && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
      const vendorId = getVendorId();
      updateVendorProgress(venture.id, vendorId, parseInt(newProgress));
      setMyProgress(parseInt(newProgress));
      alert('Progress updated successfully!');
    }
  };

  const handleLeaveVenture = () => {
    alert('Leaving ventures is not allowed once you have accepted. Please contact the admin if you need assistance.');
  };

  if (!user || !isVendor() || !venture) {
    return null;
  }

  const totalProgress = Math.round(
    venture.members.reduce((sum, member) => sum + member.progress, 0) / venture.members.length
  );
  const combinedCapacity = venture.members.reduce((sum, member) => sum + member.assignedQuantity, 0);
  const remainingQuantity = venture.totalQuantity - combinedCapacity;
  const vendorId = getVendorId();
  const myMember = venture.members.find(m => m.vendorId === vendorId);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-ventures')}
            className="text-primary hover:underline mb-4 flex items-center"
          >
            ← Back to My Ventures
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-text mb-2">{venture.product}</h1>
              <p className="text-gray-600">Venture Workspace #{venture.id}</p>
            </div>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
              {venture.status.charAt(0).toUpperCase() + venture.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {['overview', 'team', 'production', 'revenue'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-semibold transition whitespace-nowrap ${
                    activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-primary'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Venture Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Order Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product/Service:</span>
                        <span className="font-semibold">{venture.product}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Quantity:</span>
                        <span className="font-semibold">{venture.totalQuantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Deadline:</span>
                        <span className="font-semibold">{venture.deadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Buyer Location:</span>
                        <span className="font-semibold">{venture.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per Item:</span>
                        <span className="font-semibold">{venture.pricePerItem} ETB</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Production Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team Members:</span>
                        <span className="font-semibold">{venture.members.length} vendors</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Combined Capacity:</span>
                        <span className="font-semibold">{combinedCapacity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className={`font-semibold ${remainingQuantity === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                          {remainingQuantity} units
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overall Progress:</span>
                        <span className="font-semibold text-primary">{totalProgress}%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-primary h-4 rounded-full transition-all"
                          style={{ width: `${totalProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateProgress}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Update My Progress
                  </button>
                  <button
                    onClick={handleLeaveVenture}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold"
                  >
                    Leave Venture
                  </button>
                </div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Team Members</h2>
                <div className="space-y-4">
                  {venture.members.map(member => {
                    const isMe = member.vendorId === vendorId;
                    return (
                      <div key={member.vendorId} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {member.vendorName}
                              {isMe && (
                                <span className="ml-2 text-sm bg-primary text-white px-2 py-1 rounded">You</span>
                              )}
                            </h3>
                            <p className="text-gray-600">Contribution: {member.assignedQuantity} units</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{member.progress}%</p>
                            <p className="text-sm text-gray-600">Progress</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              member.progress === 100 ? 'bg-green-500' : 'bg-primary'
                            }`}
                            style={{ width: `${member.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Production Tab */}
            {activeTab === 'production' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Production Allocation</h2>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Total Order</p>
                    <p className="text-3xl font-bold text-blue-600">{venture.totalQuantity}</p>
                    <p className="text-sm text-gray-500">units</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Combined Capacity</p>
                    <p className="text-3xl font-bold text-green-600">{combinedCapacity}</p>
                    <p className="text-sm text-gray-500">units</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Remaining</p>
                    <p className="text-3xl font-bold text-orange-600">{remainingQuantity}</p>
                    <p className="text-sm text-gray-500">units</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Your Quantity</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {myMember?.assignedQuantity || 0}
                    </p>
                    <p className="text-sm text-gray-500">units</p>
                  </div>
                </div>

                {/* Production Table */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Assigned Quantity</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {venture.members.map(member => {
                        const isMe = member.vendorId === vendorId;
                        return (
                          <tr key={member.vendorId} className={isMe ? 'bg-blue-50' : ''}>
                            <td className="px-6 py-4">
                              <span className="font-semibold">{member.vendorName}</span>
                              {isMe && (
                                <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">You</span>
                              )}
                            </td>
                            <td className="px-6 py-4">{member.assignedQuantity} units</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${member.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold">{member.progress}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                member.progress === 100 
                                  ? 'bg-green-100 text-green-800' 
                                  : member.progress >= 50 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {member.progress === 100 ? 'Completed' : member.progress >= 50 ? 'In Progress' : 'Started'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Update Progress Button */}
                <div className="mt-6">
                  <button
                    onClick={handleUpdateProgress}
                    className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Update My Progress ({myProgress}%)
                  </button>
                </div>
              </div>
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Revenue Information</h2>
                
                {/* Revenue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-green-50 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Price per Item</p>
                    <p className="text-3xl font-bold text-green-600">{venture.pricePerItem} ETB</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Total Order Value</p>
                    <p className="text-3xl font-bold text-blue-600">{(venture.totalQuantity * venture.pricePerItem).toLocaleString()} ETB</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Your Estimated Earnings</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {((myMember?.assignedQuantity || 0) * venture.pricePerItem).toLocaleString()} ETB
                    </p>
                  </div>
                </div>

                {/* Revenue Share Table */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Contribution</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Revenue Share</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {venture.members.map(member => {
                        const isMe = member.vendorId === vendorId;
                        const earnings = member.assignedQuantity * venture.pricePerItem;
                        return (
                          <tr key={member.vendorId} className={isMe ? 'bg-blue-50' : ''}>
                            <td className="px-6 py-4">
                              <span className="font-semibold">{member.vendorName}</span>
                              {isMe && (
                                <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">You</span>
                              )}
                            </td>
                            <td className="px-6 py-4">{member.assignedQuantity} units</td>
                            <td className="px-6 py-4 font-bold text-green-600">
                              {earnings.toLocaleString()} ETB
                            </td>
                            <td className="px-6 py-4">
                              {Math.round((member.assignedQuantity / venture.totalQuantity) * 100)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Payment Info */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-2">💡 Payment Information</h3>
                  <p className="text-gray-700">
                    Payment will be processed after order completion and delivery confirmation. 
                    Each vendor will receive their revenue share based on their contribution percentage.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentureWorkspace;
