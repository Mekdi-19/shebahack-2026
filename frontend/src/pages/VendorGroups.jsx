import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const VendorGroups = () => {
  const { user, isVendor } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);

  // Redirect if not vendor
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!isVendor()) {
      navigate('/');
    }
  }, [user, isVendor, navigate]);

  // Fetch data
  useEffect(() => {
    if (user && isVendor()) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'available') {
        const data = await api.getVendorGroups();
        setAllGroups(data);
      } else {
        const data = await api.getMyVendorGroups();
        setMyGroups(data);
      }
    } catch (err) {
      setError('Failed to load groups: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId, groupName) => {
    if (!confirm(`Join "${groupName}" group?`)) return;

    try {
      await api.joinVendorGroup(groupId);
      alert('Successfully joined the group!');
      fetchData();
    } catch (err) {
      alert('Failed to join group: ' + err.message);
    }
  };

  const handleLeaveGroup = async (groupId, groupName) => {
    if (!confirm(`Leave "${groupName}" group?`)) return;

    try {
      await api.leaveVendorGroup(groupId);
      alert('Successfully left the group');
      fetchData();
    } catch (err) {
      alert('Failed to leave group: ' + err.message);
    }
  };

  const handleViewMembers = async (group) => {
    try {
      setSelectedGroup(group);
      const members = await api.getVendorGroupMembers(group._id);
      setGroupMembers(members);
      setShowMembersModal(true);
    } catch (err) {
      alert('Failed to load members: ' + err.message);
    }
  };

  const isAlreadyMember = (group) => {
    return group.members.some(member => member._id === user?.id || member._id === user?._id);
  };

  if (!user || !isVendor()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">Vendor Groups</h1>
          <p className="text-gray-600">Collaborate with other vendors on large orders</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('available')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === 'available' ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                }`}
              >
                Available Groups
              </button>
              <button
                onClick={() => setActiveTab('my-groups')}
                className={`py-4 px-2 border-b-2 font-semibold transition ${
                  activeTab === 'my-groups' ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                }`}
              >
                My Groups
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-gray-500 text-lg">Loading groups...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Available Groups Tab */}
            {!loading && activeTab === 'available' && (
              <div>
                {allGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👥</div>
                    <p className="text-gray-600">No vendor groups available at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allGroups.map(group => (
                      <div key={group._id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{group.name}</h3>
                            {group.nameAmharic && (
                              <p className="text-sm text-gray-600">{group.nameAmharic}</p>
                            )}
                          </div>
                          <span className="px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm font-semibold capitalize">
                            {group.category.replace('_', ' ')}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4">{group.description}</p>

                        <div className="space-y-2 mb-4">
                          {group.location?.city && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📍</span>
                              <span>{group.location.city}</span>
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">👥</span>
                            <span>{group.members.length} members</span>
                          </div>
                          {group.admin && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">👤</span>
                              <span>Admin: {group.admin.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {isAlreadyMember(group) ? (
                            <button
                              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold cursor-not-allowed"
                              disabled
                            >
                              Already Joined
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinGroup(group._id, group.name)}
                              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                            >
                              Join Group
                            </button>
                          )}
                          <button
                            onClick={() => handleViewMembers(group)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                          >
                            View Members
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* My Groups Tab */}
            {!loading && activeTab === 'my-groups' && (
              <div>
                {myGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-600 mb-4">You haven't joined any groups yet</p>
                    <button
                      onClick={() => setActiveTab('available')}
                      className="text-primary hover:underline font-semibold"
                    >
                      Browse available groups
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myGroups.map(group => (
                      <div key={group._id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{group.name}</h3>
                            {group.nameAmharic && (
                              <p className="text-sm text-gray-600">{group.nameAmharic}</p>
                            )}
                            <span className="inline-block mt-2 px-3 py-1 bg-primary bg-opacity-20 text-primary rounded-full text-sm font-semibold capitalize">
                              {group.category.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4">{group.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {group.location?.city && (
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="font-semibold">{group.location.city}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-600">Members</p>
                            <p className="font-semibold">{group.members.length} vendors</p>
                          </div>
                          {group.admin && (
                            <div>
                              <p className="text-sm text-gray-600">Admin</p>
                              <p className="font-semibold">{group.admin.name}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewMembers(group)}
                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
                          >
                            View Members
                          </button>
                          <button
                            onClick={() => handleLeaveGroup(group._id, group.name)}
                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                          >
                            Leave Group
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Members Modal */}
      {showMembersModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              Members of "{selectedGroup.name}"
            </h2>

            {groupMembers.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No members yet</p>
            ) : (
              <div className="space-y-4">
                {groupMembers.map(member => (
                  <div key={member._id} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-gray-600">{member.email}</p>
                    {member.phone && <p className="text-sm text-gray-500">📞 {member.phone}</p>}
                    {member.location?.city && (
                      <p className="text-sm text-gray-500">📍 {member.location.city}</p>
                    )}
                    {member.skills && member.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {member.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-white rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    {member.rating > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        ⭐ {member.rating.toFixed(1)} ({member.totalReviews} reviews)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowMembersModal(false)}
              className="w-full mt-6 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorGroups;
