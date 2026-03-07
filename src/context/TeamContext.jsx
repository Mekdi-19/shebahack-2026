import { createContext, useContext, useState, useEffect } from 'react';

const TeamContext = createContext();

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within TeamProvider');
  }
  return context;
};

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('teams');
    return savedTeams ? JSON.parse(savedTeams) : [
      {
        id: 1,
        name: 'Traditional Crafts Collective',
        description: 'Specializing in handmade Ethiopian crafts and pottery',
        category: 'crafts',
        skillsNeeded: ['Pottery', 'Weaving', 'Design'],
        maxMembers: 5,
        leaderId: 3,
        leaderName: 'Almaz Tesfaye',
        members: [
          { id: 3, name: 'Almaz Tesfaye', skills: ['Pottery', 'Design'], role: 'leader' },
          { id: 4, name: 'Tigist Bekele', skills: ['Weaving'], role: 'member' }
        ],
        joinRequests: [],
        jobs: [],
        createdAt: '2024-01-15'
      }
    ];
  });

  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem('teamJobs');
    return savedJobs ? JSON.parse(savedJobs) : [
      {
        id: 1,
        teamId: 1,
        title: 'Wedding Decoration Set',
        description: 'Create traditional Ethiopian wedding decoration items',
        customer: 'Meron Haile',
        totalPayment: 5000,
        status: 'pending',
        contributionAgreement: null,
        confirmedBy: [],
        createdAt: '2024-03-01'
      }
    ];
  });

  const [chatMessages, setChatMessages] = useState(() => {
    const savedMessages = localStorage.getItem('teamChats');
    return savedMessages ? JSON.parse(savedMessages) : {};
  });

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('teamJobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('teamChats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Team Management
  const createTeam = (teamData, userId, userName) => {
    const newTeam = {
      id: teams.length + 1,
      ...teamData,
      leaderId: userId,
      leaderName: userName,
      members: [{ id: userId, name: userName, skills: [], role: 'leader' }],
      joinRequests: [],
      jobs: [],
      createdAt: new Date().toISOString()
    };
    setTeams([...teams, newTeam]);
    return newTeam;
  };

  const addMemberDirectly = (teamId, memberEmail) => {
    // In a real app, this would look up user by email
    // For now, we'll create a mock member
    const mockUsers = [
      { id: 10, email: 'sara@test.et', name: 'Sara Ahmed', skills: ['Design', 'Marketing'] },
      { id: 11, email: 'hana@test.et', name: 'Hana Bekele', skills: ['Weaving', 'Crafts'] },
      { id: 12, email: 'meron@test.et', name: 'Meron Haile', skills: ['Sewing', 'Tailoring'] },
      { id: 13, email: 'tigist@test.et', name: 'Tigist Tesfaye', skills: ['Cooking', 'Food'] },
      { id: 14, email: 'almaz@test.et', name: 'Almaz Girma', skills: ['Pottery', 'Crafts'] }
    ];

    const user = mockUsers.find(u => u.email.toLowerCase() === memberEmail.toLowerCase());
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    setTeams(teams.map(team => {
      if (team.id === teamId) {
        // Check if already a member
        if (team.members.some(m => m.id === user.id)) {
          return team;
        }
        
        return {
          ...team,
          members: [...team.members, { id: user.id, name: user.name, skills: user.skills, role: 'member' }]
        };
      }
      return team;
    }));

    return { success: true, message: 'Member added successfully' };
  };

  const sendJoinRequest = (teamId, userId, userName, skills) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          joinRequests: [...team.joinRequests, { id: userId, name: userName, skills }]
        };
      }
      return team;
    }));
  };

  const handleJoinRequest = (teamId, userId, accept) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        const request = team.joinRequests.find(r => r.id === userId);
        const updatedRequests = team.joinRequests.filter(r => r.id !== userId);
        
        if (accept && request) {
          return {
            ...team,
            members: [...team.members, { ...request, role: 'member' }],
            joinRequests: updatedRequests
          };
        }
        
        return { ...team, joinRequests: updatedRequests };
      }
      return team;
    }));
  };

  // Job Management
  const createJob = (jobData) => {
    const newJob = {
      id: jobs.length + 1,
      ...jobData,
      status: 'pending',
      contributionAgreement: null,
      confirmedBy: [],
      createdAt: new Date().toISOString()
    };
    setJobs([...jobs, newJob]);
    return newJob;
  };

  const updateJobStatus = (jobId, status) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status } : job
    ));
  };

  const setContributionAgreement = (jobId, agreement) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, contributionAgreement: agreement, confirmedBy: [] } : job
    ));
  };

  const updateMemberShare = (jobId, memberId, share, role) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId && job.contributionAgreement) {
        const updatedAgreement = job.contributionAgreement.map(item => 
          item.memberId === memberId ? { ...item, share: Number(share), role } : item
        );
        return { ...job, contributionAgreement: updatedAgreement, confirmedBy: [] };
      }
      return job;
    }));
  };

  const confirmAgreement = (jobId, userId) => {
    setJobs(jobs.map(job => {
      if (job.id === jobId) {
        if (!job.confirmedBy.includes(userId)) {
          return { ...job, confirmedBy: [...job.confirmedBy, userId] };
        }
      }
      return job;
    }));
  };

  // Chat Management
  const sendMessage = (teamId, userId, userName, message) => {
    const teamChat = chatMessages[teamId] || [];
    const newMessage = {
      id: teamChat.length + 1,
      userId,
      userName,
      message,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages({
      ...chatMessages,
      [teamId]: [...teamChat, newMessage]
    });
  };

  const getTeamChat = (teamId) => {
    return chatMessages[teamId] || [];
  };

  // Payment Distribution
  const calculatePaymentSplit = (job) => {
    if (!job.contributionAgreement) return [];
    
    return job.contributionAgreement.map(member => ({
      ...member,
      amount: (job.totalPayment * member.share) / 100
    }));
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        jobs,
        createTeam,
        addMemberDirectly,
        sendJoinRequest,
        handleJoinRequest,
        createJob,
        updateJobStatus,
        setContributionAgreement,
        updateMemberShare,
        confirmAgreement,
        sendMessage,
        getTeamChat,
        calculatePaymentSplit
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
