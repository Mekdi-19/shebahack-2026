import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';

const TeamWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teams, jobs, addMemberDirectly, handleJoinRequest, updateJobStatus, setContributionAgreement, updateMemberShare, confirmAgreement, sendMessage, getTeamChat, calculatePaymentSplit } = useTeam();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const chatEndRef = useRef(null);

  const team = teams.find(t => t.id === Number(id));
  const teamJobs = jobs.filter(j => j.teamId === Number(id));
  const teamChat = getTeamChat(Number(id));

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [teamChat]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Team not found</h2>
          <button
            onClick={() => navigate('/teams')}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  const isMember = team.members.some(m => m.id === user.id);
  const isLeader = team.leaderId === user.id;

  if (!isMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You are not a member of this team</p>
          <button
            onClick={() => navigate('/teams')}
            className="bg-primary text-white px-6 py-2 rounded-lg"
          >
            Back to Teams
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(team.id, user.id, user.name, message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">{team.name}</h1>
              <p className="text-gray-600">{team.description}</p>
            </div>
            <button
              onClick={() => navigate('/teams')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Teams
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {['overview', 'chat', 'jobs', 'members'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-semibold capitalize transition ${
                    activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-600'
                  }`}
                >
                  {tab}
                  {tab === 'jobs' && teamJobs.length > 0 && (
                    <span className="ml-2 bg-secondary text-white text-xs px-2 py-1 rounded-full">
                      {teamJobs.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Total Members</p>
                    <p className="text-3xl font-bold text-blue-700">{team.members.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Active Jobs</p>
                    <p className="text-3xl font-bold text-green-700">
                      {teamJobs.filter(j => j.status === 'in-progress').length}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                    <p className="text-gray-600 mb-2">Completed Jobs</p>
                    <p className="text-3xl font-bold text-purple-700">
                      {teamJobs.filter(j => j.status === 'completed').length}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">Team Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-semibold capitalize">{team.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Team Leader</p>
                      <p className="font-semibold">{team.leaderName}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Skills Available</h3>
                  <div className="flex flex-wrap gap-2">
                    {team.skillsNeeded.map((skill, index) => (
                      <span key={index} className="bg-primary bg-opacity-20 text-primary px-4 py-2 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div>
                <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                  {teamChat.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {teamChat.map(msg => (
                        <div key={msg.id} className={`flex ${msg.userId === user.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.userId === user.id 
                              ? 'bg-primary text-white' 
                              : 'bg-white border border-gray-200'
                          }`}>
                            <p className="font-semibold text-sm mb-1">{msg.userName}</p>
                            <p>{msg.message}</p>
                            <p className="text-xs mt-1 opacity-75">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Team Jobs</h3>
                  {isLeader && (
                    <button
                      onClick={() => setShowJobModal(true)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                    >
                      + Add Job
                    </button>
                  )}
                </div>

                {teamJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💼</div>
                    <p className="text-gray-500">No jobs yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teamJobs.map(job => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onViewDetails={setSelectedJob}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Team Members ({team.members.length})</h3>
                  {isLeader && (
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                    >
                      + Add Member
                    </button>
                  )}
                </div>
                
                <div className="space-y-4 mb-8">
                  {team.members.map(member => (
                    <div key={member.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">{member.name}</p>
                        {member.skills.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {member.skills.map((skill, index) => (
                              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className={`px-4 py-2 rounded-full font-semibold ${
                        member.role === 'leader' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {member.role === 'leader' ? 'Team Leader' : 'Member'}
                      </span>
                    </div>
                  ))}
                </div>

                {isLeader && team.joinRequests.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">Join Requests ({team.joinRequests.length})</h3>
                    <div className="space-y-4">
                      {team.joinRequests.map(request => (
                        <div key={request.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{request.name}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleJoinRequest(team.id, request.id, true)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleJoinRequest(team.id, request.id, false)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <JobDetailsModal
            job={selectedJob}
            team={team}
            isLeader={isLeader}
            currentUserId={user.id}
            onClose={() => setSelectedJob(null)}
            onSetAgreement={setContributionAgreement}
            onUpdateMemberShare={updateMemberShare}
            onConfirmAgreement={confirmAgreement}
            onUpdateStatus={updateJobStatus}
            calculatePaymentSplit={calculatePaymentSplit}
          />
        )}

        {/* Add Job Modal */}
        {showJobModal && isLeader && (
          <AddJobModal
            teamId={team.id}
            onClose={() => setShowJobModal(false)}
          />
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && isLeader && (
          <AddMemberModal
            teamId={team.id}
            onClose={() => setShowAddMemberModal(false)}
            onAddMember={addMemberDirectly}
          />
        )}
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, onViewDetails }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800'
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-bold">{job.title}</h4>
          <p className="text-gray-600">{job.description}</p>
          <p className="text-sm text-gray-500 mt-2">Customer: {job.customer}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[job.status]}`}>
          {job.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold text-primary">{job.totalPayment} ETB</p>
        <button
          onClick={() => onViewDetails(job)}
          className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Editable Payment Row Component
const EditablePaymentRow = ({ item, currentUserId, allConfirmed, onUpdateShare }) => {
  const [editMode, setEditMode] = useState(false);
  const [editShare, setEditShare] = useState(item.share);
  const [editRole, setEditRole] = useState(item.role);
  const isCurrentMember = item.memberId === currentUserId;

  return (
    <tr className="border-t">
      <td className="p-3 font-medium">{item.memberName}</td>
      <td className="p-3">
        {editMode && isCurrentMember ? (
          <input
            type="text"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            placeholder="Your role"
          />
        ) : (
          item.role || '-'
        )}
      </td>
      <td className="p-3">
        {editMode && isCurrentMember ? (
          <input
            type="number"
            value={editShare}
            onChange={(e) => setEditShare(e.target.value)}
            className="border rounded px-2 py-1 w-20"
            min="0"
            max="100"
          />
        ) : (
          `${item.share}%`
        )}
      </td>
      <td className="p-3 font-bold text-primary">{item.amount} ETB</td>
      {!allConfirmed && isCurrentMember && (
        <td className="p-3">
          {editMode ? (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onUpdateShare(item.memberId, editShare, editRole);
                  setEditMode(false);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditShare(item.share);
                  setEditRole(item.role);
                  setEditMode(false);
                }}
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </td>
      )}
      {!allConfirmed && !isCurrentMember && <td className="p-3"></td>}
    </tr>
  );
};

// Job Details Modal Component
const JobDetailsModal = ({ job, team, isLeader, currentUserId, onClose, onSetAgreement, onUpdateMemberShare, onConfirmAgreement, onUpdateStatus, calculatePaymentSplit }) => {
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const [agreement, setAgreement] = useState(
    job.contributionAgreement || team.members.map(m => ({ memberId: m.id, memberName: m.name, role: '', share: 0 }))
  );

  const totalShare = agreement.reduce((sum, item) => sum + Number(item.share), 0);
  const isAgreementValid = totalShare === 100;
  const hasConfirmed = job.confirmedBy?.includes(currentUserId);
  const allConfirmed = job.contributionAgreement && job.confirmedBy?.length === team.members.length;
  const currentMember = team.members.find(m => m.id === currentUserId);

  const handleSaveAgreement = () => {
    if (isAgreementValid) {
      onSetAgreement(job.id, agreement);
      setShowAgreementForm(false);
    }
  };

  const handleMemberUpdateShare = (memberId, share, role) => {
    onUpdateMemberShare(job.id, memberId, share, role);
  };

  const paymentSplit = job.contributionAgreement ? calculatePaymentSplit(job) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{job.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">{job.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-semibold">{job.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Payment</p>
              <p className="text-2xl font-bold text-primary">{job.totalPayment} ETB</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold capitalize">{job.status.replace('-', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Contribution Agreement */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Contribution Agreement</h3>
            {!job.contributionAgreement && job.status === 'pending' && (
              <button
                onClick={() => setShowAgreementForm(!showAgreementForm)}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
              >
                {showAgreementForm ? 'Cancel' : 'Set Agreement'}
              </button>
            )}
          </div>

          {showAgreementForm ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Member</th>
                    <th className="text-left py-2">Role</th>
                    <th className="text-left py-2">Share (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {agreement.map((item, index) => (
                    <tr key={item.memberId} className="border-b">
                      <td className="py-2">{item.memberName}</td>
                      <td className="py-2">
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => {
                            const newAgreement = [...agreement];
                            newAgreement[index].role = e.target.value;
                            setAgreement(newAgreement);
                          }}
                          className="border rounded px-2 py-1 w-full"
                          placeholder="e.g., Design"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          value={item.share}
                          onChange={(e) => {
                            const newAgreement = [...agreement];
                            newAgreement[index].share = Number(e.target.value);
                            setAgreement(newAgreement);
                          }}
                          className="border rounded px-2 py-1 w-20"
                          min="0"
                          max="100"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan="2" className="py-2">Total</td>
                    <td className={`py-2 ${isAgreementValid ? 'text-green-600' : 'text-red-600'}`}>
                      {totalShare}%
                    </td>
                  </tr>
                </tfoot>
              </table>
              
              {!isAgreementValid && (
                <p className="text-red-600 text-sm mt-2">Total must equal 100%</p>
              )}

              <button
                onClick={handleSaveAgreement}
                disabled={!isAgreementValid}
                className={`mt-4 w-full px-4 py-2 rounded-lg font-semibold ${
                  isAgreementValid
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Agreement
              </button>
            </div>
          ) : job.contributionAgreement ? (
            <div>
              <table className="w-full bg-gray-50 rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left p-3">Member</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Share</th>
                    <th className="text-left p-3">Amount</th>
                    {!allConfirmed && <th className="text-left p-3">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {paymentSplit.map(item => (
                    <EditablePaymentRow
                      key={item.memberId}
                      item={item}
                      currentUserId={currentUserId}
                      allConfirmed={allConfirmed}
                      onUpdateShare={handleMemberUpdateShare}
                    />
                  ))}
                </tbody>
              </table>

              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Each member can edit their own share percentage and role. Total must equal 100% before confirmation.
                </p>
              </div>

              {!hasConfirmed && (
                <button
                  onClick={() => onConfirmAgreement(job.id, currentUserId)}
                  disabled={!isAgreementValid}
                  className={`mt-4 w-full px-4 py-2 rounded-lg font-semibold ${
                    isAgreementValid
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAgreementValid ? 'Confirm Agreement' : 'Total must equal 100% to confirm'}
                </button>
              )}

              {hasConfirmed && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-green-800 font-semibold">✓ You have confirmed this agreement</p>
                  <p className="text-sm text-green-600 mt-1">
                    {job.confirmedBy.length}/{team.members.length} members confirmed
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">No agreement set yet</p>
          )}
        </div>

        {/* Status Actions */}
        {isLeader && (
          <div className="flex gap-3">
            {job.status === 'pending' && allConfirmed && (
              <button
                onClick={() => onUpdateStatus(job.id, 'accepted')}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Accept Job
              </button>
            )}
            {job.status === 'accepted' && (
              <button
                onClick={() => onUpdateStatus(job.id, 'in-progress')}
                className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-semibold"
              >
                Start Work
              </button>
            )}
            {job.status === 'in-progress' && (
              <button
                onClick={() => onUpdateStatus(job.id, 'completed')}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
              >
                Mark as Completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Add Job Modal Component
const AddJobModal = ({ teamId, onClose }) => {
  const { createJob } = useTeam();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer: '',
    totalPayment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createJob({
      ...formData,
      teamId,
      totalPayment: Number(formData.totalPayment)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Add New Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Job Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
              rows="3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Customer Name</label>
            <input
              type="text"
              value={formData.customer}
              onChange={(e) => setFormData({...formData, customer: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Total Payment (ETB)</label>
            <input
              type="number"
              value={formData.totalPayment}
              onChange={(e) => setFormData({...formData, totalPayment: e.target.value})}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
            >
              Add Job
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Member Modal Component
const AddMemberModal = ({ teamId, onClose, onAddMember }) => {
  const [memberEmail, setMemberEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onAddMember(teamId, memberEmail);
    
    if (result.success) {
      setMessage('Member added successfully!');
      setMessageType('success');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setMessage(result.message);
      setMessageType('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Add Team Member</h2>
        
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Available test users:</strong>
          </p>
          <ul className="text-xs text-blue-700 mt-2 space-y-1">
            <li>• sara@test.et - Sara Ahmed (Design, Marketing)</li>
            <li>• hana@test.et - Hana Bekele (Weaving, Crafts)</li>
            <li>• meron@test.et - Meron Haile (Sewing, Tailoring)</li>
            <li>• tigist@test.et - Tigist Tesfaye (Cooking, Food)</li>
            <li>• almaz@test.et - Almaz Girma (Pottery, Crafts)</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Member Email</label>
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:border-primary focus:outline-none"
              placeholder="member@test.et"
              required
            />
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition font-semibold"
            >
              Add Member
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamWorkspace;
