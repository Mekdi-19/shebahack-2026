import { useState } from 'react';
import VideoModal from '../components/VideoModal';
import SearchBar from '../components/SearchBar';

const LearningCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [videoModal, setVideoModal] = useState({ isOpen: false, url: '', title: '' });

  const allCourses = [
    { 
      id: 1, 
      title: 'How to Price Your Products', 
      description: 'Learn effective pricing strategies for your homemade products', 
      duration: '15 min', 
      instructor: 'Dr. Abebe Tadesse',
      thumbnail: 'https://via.placeholder.com/300x200/CFAF2F/FFFFFF?text=Pricing',
      price: 0,
      skill: 'Small Business',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 2, 
      title: 'Growing Your Small Business', 
      description: 'Tips and strategies for scaling your business', 
      duration: '20 min', 
      instructor: 'Marta Kebede',
      thumbnail: 'https://via.placeholder.com/300x200/E63946/FFFFFF?text=Business+Growth',
      price: 100,
      skill: 'Small Business',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 3, 
      title: 'Saving and Financial Planning', 
      description: 'Essential financial literacy for entrepreneurs', 
      duration: '18 min', 
      instructor: 'Sara Mulugeta',
      thumbnail: 'https://via.placeholder.com/300x200/CFAF2F/FFFFFF?text=Finance',
      price: 0,
      skill: 'Financial Literacy',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 4, 
      title: 'Marketing on Social Media', 
      description: 'Promote your products effectively online', 
      duration: '25 min', 
      instructor: 'Dawit Haile',
      thumbnail: 'https://via.placeholder.com/300x200/E63946/FFFFFF?text=Marketing',
      price: 150,
      skill: 'Small Business',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 5, 
      title: 'Customer Service Excellence', 
      description: 'Build lasting relationships with customers', 
      duration: '12 min', 
      instructor: 'Tigist Bekele',
      thumbnail: 'https://via.placeholder.com/300x200/CFAF2F/FFFFFF?text=Customer+Service',
      price: 0,
      skill: 'Small Business',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 6, 
      title: 'Managing Your Inventory', 
      description: 'Keep track of your products and supplies', 
      duration: '16 min', 
      instructor: 'Almaz Tesfaye',
      thumbnail: 'https://via.placeholder.com/300x200/E63946/FFFFFF?text=Inventory',
      price: 0,
      skill: 'Small Business',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 7, 
      title: 'Traditional Ethiopian Cooking', 
      description: 'Master authentic Ethiopian recipes', 
      duration: '30 min', 
      instructor: 'Hanna Girma',
      thumbnail: 'https://via.placeholder.com/300x200/CFAF2F/FFFFFF?text=Cooking',
      price: 200,
      skill: 'Cooking',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 8, 
      title: 'Sewing Basics for Beginners', 
      description: 'Learn fundamental sewing techniques', 
      duration: '22 min', 
      instructor: 'Sara Mulugeta',
      thumbnail: 'https://via.placeholder.com/300x200/E63946/FFFFFF?text=Sewing',
      price: 0,
      skill: 'Sewing',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 9, 
      title: 'Handmade Crafts & Jewelry', 
      description: 'Create beautiful handmade items to sell', 
      duration: '28 min', 
      instructor: 'Bethlehem Tadesse',
      thumbnail: 'https://via.placeholder.com/300x200/CFAF2F/FFFFFF?text=Crafts',
      price: 180,
      skill: 'Crafts',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 10, 
      title: 'Advanced Sewing Techniques', 
      description: 'Take your sewing skills to the next level', 
      duration: '35 min', 
      instructor: 'Sara Mulugeta',
      thumbnail: 'https://via.placeholder.com/300x200/E63946/FFFFFF?text=Advanced+Sewing',
      price: 250,
      skill: 'Sewing',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 11, 
      title: 'Budgeting for Entrepreneurs', 
      description: 'Learn how to manage your business finances', 
      duration: '20 min', 
      instructor: 'Dr. Abebe Tadesse',
      thumbnail: 'https://via.placeholder.com/300x200/CFAF2F/FFFFFF?text=Budgeting',
      price: 0,
      skill: 'Financial Literacy',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    { 
      id: 12, 
      title: 'Pottery & Ceramics', 
      description: 'Create beautiful pottery and ceramic pieces', 
      duration: '40 min', 
      instructor: 'Marta Assefa',
      thumbnail: 'https://via.placeholder.com/300x200/E63946/FFFFFF?text=Pottery',
      price: 300,
      skill: 'Crafts',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const skills = ['Cooking', 'Crafts', 'Sewing', 'Small Business', 'Financial Literacy'];

  const filteredCourses = allCourses.filter(course => {
    const matchesSkill = selectedSkill === 'all' || course.skill === selectedSkill;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.skill.toLowerCase().includes(searchLower);

    return matchesSkill && matchesSearch;
  });

  const openVideoModal = (url, title) => {
    setVideoModal({ isOpen: true, url, title });
  };

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, url: '', title: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">Learning Center</h1>
          <p className="text-xl text-gray-600">Build your business skills with free and paid courses</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            placeholder="Search courses by title, description, or skill..." 
            onSearch={setSearchTerm}
          />
        </div>

        {/* Filter by Skill */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text mb-4">Filter by Skill</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedSkill('all')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedSkill === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              All Courses
            </button>
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedSkill === skill
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {allCourses.length} courses
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-500">
              Search results for: <span className="font-semibold">"{searchTerm}"</span>
            </p>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg">No courses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-2 right-2">
                    {course.price === 0 ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Free
                      </span>
                    ) : (
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {course.price} ETB
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-text mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-3">{course.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>👤 {course.instructor}</span>
                    <span>⏱️ {course.duration}</span>
                  </div>
                  <div className="mb-4">
                    <span className="bg-primary bg-opacity-20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                      {course.skill}
                    </span>
                  </div>
                  <button
                    onClick={() => openVideoModal(course.videoUrl, course.title)}
                    className="w-full bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition font-semibold"
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoUrl={videoModal.url}
        title={videoModal.title}
      />
    </div>
  );
};

export default LearningCenter;
