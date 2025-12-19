/**
 * Learning Roadmap Service
 * Service để quản lý lộ trình học tập cá nhân hóa với AI insights
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api/v1';

/**
 * Lấy lộ trình học tập cá nhân hóa của học viên
 * @param {string} userId - ID của học viên
 * @param {string} trackId - Career track ID (optional)
 * @returns {Promise<Object>} Learning roadmap data
 */
export const getLearningRoadmap = async (userId, trackId = null) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token');
    }

    // Get current track from localStorage or use default
    const savedTrackId = trackId || localStorage.getItem('userCareerTrack') || 'fullstack-java';

    // TODO: Replace with real API endpoint when backend is ready
    // const response = await fetch(`${API_BASE}/learning/roadmap/${userId}?track=${savedTrackId}`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // if (!response.ok) throw new Error('Failed to fetch roadmap');
    // const data = await response.json();
    // return generateRoadmapForTrack(data.trackId || savedTrackId, userId, data);

    // Mock data với logic thông minh
    const currentProgress = JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
    return generateRoadmapForTrack(savedTrackId, userId, currentProgress);
  } catch (error) {
    console.error('Error fetching learning roadmap:', error);
    // Fallback to mock data
    return generateMockRoadmap(userId);
  }
};

/**
 * Cập nhật career track cho user
 * @param {string} userId - ID của học viên
 * @param {string} trackId - Career track ID
 * @returns {Promise<Object>} Updated roadmap
 */
export const updateCareerTrack = async (userId, trackId) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    // TODO: Replace with real API
    // const response = await fetch(`${API_BASE}/learning/roadmap/${userId}/track`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ trackId })
    // });
    // if (!response.ok) throw new Error('Failed to update track');
    // return await response.json();

    // Save to localStorage for mock
    localStorage.setItem('userCareerTrack', trackId);
    const currentProgress = JSON.parse(localStorage.getItem('roadmapProgress') || '{}');
    
    // Simulate AI regeneration delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return generateRoadmapForTrack(trackId, userId, currentProgress);
  } catch (error) {
    console.error('Error updating career track:', error);
    throw error;
  }
};

/**
 * Lấy thông tin exam results để tính toán AI insights
 * @param {string} userId - ID của học viên
 * @returns {Promise<Array>} Exam results
 */
export const getExamResults = async (userId) => {
  try {
    const token = localStorage.getItem('accessToken');
    // TODO: Replace with real API
    // const response = await fetch(`${API_BASE}/learning/exams/${userId}`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // return await response.json();

    // Mock exam results
    return [
      { testName: 'Java Core', score: 9.5, maxScore: 10, date: '2024-01-15', topic: 'Java Fundamentals' },
      { testName: 'OOP Concepts', score: 8.5, maxScore: 10, date: '2024-01-20', topic: 'Object-Oriented Programming' },
      { testName: 'Spring Boot Basics', score: 7.0, maxScore: 10, date: '2024-02-01', topic: 'Spring Framework' }
    ];
  } catch (error) {
    console.error('Error fetching exam results:', error);
    return [];
  }
};

/**
 * Lấy thống kê cộng đồng để so sánh
 * @returns {Promise<Object>} Community statistics
 */
export const getCommunityStats = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    // TODO: Replace with real API
    // const response = await fetch(`${API_BASE}/learning/community-stats`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // return await response.json();

    // Mock community stats
    return {
      averageCompletionTime: {
        'Java Core': 4.5, // weeks
        'Spring Boot': 6.2,
        'React': 5.1,
        'Microservices': 8.5
      },
      averageXP: {
        'Java Core': 450,
        'Spring Boot': 750,
        'React': 680,
        'Microservices': 1150
      },
      completionRate: {
        'Java Core': 0.85,
        'Spring Boot': 0.72,
        'React': 0.78,
        'Microservices': 0.58
      }
    };
  } catch (error) {
    console.error('Error fetching community stats:', error);
    return {};
  }
};

/**
 * Tính toán AI insights dựa trên exam results
 * @param {Array} examResults - Kết quả thi
 * @returns {Object} AI insights
 */
export const calculateAIInsights = (examResults) => {
  if (!examResults || examResults.length === 0) {
    return {
      testResult: 'Java Core',
      score: '8.0/10',
      recommendation: 'Full-stack Development',
      strength: 'Fundamentals',
      suggestion: 'Tiếp tục xây dựng nền tảng vững chắc'
    };
  }

  // Tìm bài thi điểm cao nhất
  const bestResult = examResults.reduce((prev, current) => 
    (current.score / current.maxScore) > (prev.score / prev.maxScore) ? current : prev
  );

  const bestPercentage = (bestResult.score / bestResult.maxScore) * 100;
  
  // Logic đề xuất dựa trên điểm số
  let recommendation = 'Full-stack Development';
  let suggestion = '';

  if (bestPercentage >= 90) {
    if (bestResult.topic.includes('Java') || bestResult.topic.includes('Core')) {
      recommendation = 'Microservices';
      suggestion = 'Với điểm số xuất sắc, bạn nên tập trung vào Microservices để tối ưu hóa lộ trình sự nghiệp.';
    } else if (bestResult.topic.includes('React') || bestResult.topic.includes('Frontend')) {
      recommendation = 'Advanced Frontend Architecture';
      suggestion = 'Kỹ năng Frontend của bạn rất tốt, hãy phát triển sang kiến trúc nâng cao.';
    }
  } else if (bestPercentage >= 75) {
    recommendation = 'REST API Development';
    suggestion = 'Bạn đang đi đúng hướng, tiếp tục phát triển kỹ năng Backend.';
  } else {
    recommendation = 'Fundamentals Mastery';
    suggestion = 'Hãy củng cố kiến thức nền tảng trước khi chuyển sang phần nâng cao.';
  }

  return {
    testResult: bestResult.testName,
    score: `${bestResult.score}/${bestResult.maxScore}`,
    recommendation,
    strength: bestResult.topic,
    suggestion,
    percentage: bestPercentage
  };
};

/**
 * Kiểm tra prerequisites cho milestone
 * @param {Array} milestones - Danh sách milestones
 * @param {number} milestoneId - ID milestone cần kiểm tra
 * @returns {boolean} True nếu đủ điều kiện
 */
export const checkPrerequisites = (milestones, milestoneId) => {
  if (!milestones || milestones.length === 0) return false;
  
  const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
  if (milestoneIndex < 0) return false;
  if (milestoneIndex === 0) return true; // Milestone đầu tiên luôn mở

  // Kiểm tra milestone trước đó đã hoàn thành (sequential prerequisites)
  const previousMilestone = milestones[milestoneIndex - 1];
  if (previousMilestone && previousMilestone.status === 'completed') {
    return true;
  }

  // Nếu milestone có prerequisites cụ thể, kiểm tra từng cái
  const currentMilestone = milestones[milestoneIndex];
  if (currentMilestone.prerequisites && Array.isArray(currentMilestone.prerequisites)) {
    return currentMilestone.prerequisites.every(prereqId => {
      const prereq = milestones.find(m => m.id === prereqId);
      return prereq && prereq.status === 'completed';
    });
  }

  return false;
};

/**
 * So sánh tiến độ với cộng đồng
 * @param {Object} studentProgress - Tiến độ của học viên
 * @param {Object} communityStats - Thống kê cộng đồng
 * @returns {Object} Comparison results
 */
export const compareWithCommunity = (studentProgress, communityStats) => {
  if (!studentProgress || !communityStats || !communityStats.averageCompletionTime) {
    return null;
  }

  const currentMilestone = studentProgress.currentMilestone || {};
  const milestoneName = currentMilestone.title || '';
  
  // Tìm milestone tương ứng trong stats
  const avgTime = communityStats.averageCompletionTime[milestoneName] || 0;
  const studentTime = currentMilestone.actualDuration || currentMilestone.duration || 0;
  
  if (!avgTime || !studentTime) return null;

  const timeDiff = ((avgTime - studentTime) / avgTime) * 100;
  
  return {
    isFaster: timeDiff > 0,
    percentage: Math.abs(timeDiff),
    message: timeDiff > 10 
      ? `Bạn đang học nhanh hơn ${Math.round(timeDiff)}% so với trung bình cộng đồng! 🚀`
      : timeDiff < -10
      ? `Hãy tập trung thêm vào phần này, bạn đang chậm hơn ${Math.round(Math.abs(timeDiff))}% so với trung bình.`
      : 'Tiến độ của bạn phù hợp với trung bình cộng đồng. Tiếp tục phát huy! 👍'
  };
};

/**
 * Tính toán XP reward cho milestone
 * @param {Object} milestone - Milestone object
 * @param {Object} communityStats - Community statistics
 * @returns {number} XP points
 */
export const calculateXPReward = (milestone, communityStats) => {
  const baseXP = milestone.baseXP || 500;
  const difficultyMultiplier = {
    'Beginner': 1.0,
    'Intermediate': 1.5,
    'Advanced': 2.0,
    'Expert': 2.5
  };

  const multiplier = difficultyMultiplier[milestone.difficulty] || 1.0;
  return Math.round(baseXP * multiplier);
};

/**
 * Career Tracks Definitions
 */
export const CAREER_TRACKS = {
  'fullstack-java': {
    id: 'fullstack-java',
    name: 'Full-stack Developer (Java & React)',
    description: 'Xây dựng ứng dụng web hoàn chỉnh từ Backend đến Frontend',
    icon: 'Code',
    color: '#6366f1',
    milestones: [
      {
        id: 1,
        title: 'Nền tảng Java Core',
        duration: 4,
        baseXP: 500,
        icon: 'CheckCircle2',
        difficulty: 'Beginner',
        description: 'Làm chủ các khái niệm OOP, Collections, Exception Handling'
      },
      {
        id: 2,
        title: 'Xây dựng REST API với Spring Boot',
        duration: 6,
        baseXP: 800,
        icon: 'Rocket',
        difficulty: 'Intermediate',
        description: 'Thiết kế và xây dựng RESTful APIs, JPA, Security'
      },
      {
        id: 3,
        title: 'Frontend Master với React & Tailwind',
        duration: 5,
        baseXP: 700,
        icon: 'Code',
        difficulty: 'Intermediate',
        description: 'React Hooks, State Management, Responsive Design'
      },
      {
        id: 4,
        title: 'Triển khai hệ thống Microservices',
        duration: 8,
        baseXP: 1200,
        icon: 'Cloud',
        difficulty: 'Expert',
        description: 'Spring Cloud, Docker, Kubernetes, CI/CD'
      }
    ]
  },
  'ai-data-science': {
    id: 'ai-data-science',
    name: 'AI & Data Science Engineer',
    description: 'Phát triển hệ thống AI/ML và phân tích dữ liệu chuyên sâu',
    icon: 'BrainCircuit',
    color: '#8b5cf6',
    milestones: [
      {
        id: 1,
        title: 'Python Fundamentals & Data Structures',
        duration: 4,
        baseXP: 500,
        icon: 'CheckCircle2',
        difficulty: 'Beginner',
        description: 'Numpy, Pandas, Matplotlib, Basic Algorithms'
      },
      {
        id: 2,
        title: 'Machine Learning Essentials',
        duration: 6,
        baseXP: 900,
        icon: 'Rocket',
        difficulty: 'Intermediate',
        description: 'Scikit-learn, Model Training, Evaluation Metrics'
      },
      {
        id: 3,
        title: 'Deep Learning với TensorFlow/Keras',
        duration: 7,
        baseXP: 1000,
        icon: 'BrainCircuit',
        difficulty: 'Advanced',
        description: 'Neural Networks, CNN, RNN, Transfer Learning'
      },
      {
        id: 4,
        title: 'Production AI Systems & MLOps',
        duration: 8,
        baseXP: 1300,
        icon: 'Cloud',
        difficulty: 'Expert',
        description: 'Model Deployment, MLflow, A/B Testing, Scalability'
      }
    ]
  },
  'mobile-developer': {
    id: 'mobile-developer',
    name: 'Mobile App Developer',
    description: 'Xây dựng ứng dụng di động cross-platform với React Native',
    icon: 'Smartphone',
    color: '#10b981',
    milestones: [
      {
        id: 1,
        title: 'React Fundamentals & JSX',
        duration: 3,
        baseXP: 400,
        icon: 'CheckCircle2',
        difficulty: 'Beginner',
        description: 'Components, Props, State, Hooks cơ bản'
      },
      {
        id: 2,
        title: 'React Native Development',
        duration: 6,
        baseXP: 800,
        icon: 'Rocket',
        difficulty: 'Intermediate',
        description: 'Navigation, API Integration, State Management'
      },
      {
        id: 3,
        title: 'Native Modules & Performance',
        duration: 5,
        baseXP: 750,
        icon: 'Code',
        difficulty: 'Advanced',
        description: 'Bridge Native Code, Optimization, Testing'
      },
      {
        id: 4,
        title: 'App Store Deployment & CI/CD',
        duration: 4,
        baseXP: 600,
        icon: 'Cloud',
        difficulty: 'Expert',
        description: 'Build & Release, App Store Guidelines, Automation'
      }
    ]
  },
  'devops-engineer': {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Tự động hóa và quản lý hạ tầng cloud với best practices',
    icon: 'Cloud',
    color: '#f59e0b',
    milestones: [
      {
        id: 1,
        title: 'Linux & Shell Scripting',
        duration: 3,
        baseXP: 400,
        icon: 'CheckCircle2',
        difficulty: 'Beginner',
        description: 'Command Line, File Systems, Process Management'
      },
      {
        id: 2,
        title: 'Docker & Containerization',
        duration: 4,
        baseXP: 600,
        icon: 'Rocket',
        difficulty: 'Intermediate',
        description: 'Container Lifecycle, Docker Compose, Image Optimization'
      },
      {
        id: 3,
        title: 'Kubernetes & Orchestration',
        duration: 6,
        baseXP: 900,
        icon: 'Code',
        difficulty: 'Advanced',
        description: 'Pods, Services, Deployments, Helm Charts'
      },
      {
        id: 4,
        title: 'CI/CD & Infrastructure as Code',
        duration: 7,
        baseXP: 1100,
        icon: 'Cloud',
        difficulty: 'Expert',
        description: 'Jenkins/GitLab CI, Terraform, Ansible, Monitoring'
      }
    ]
  }
};

/**
 * Generate roadmap based on career track
 */
export const generateRoadmapForTrack = (trackId, userId, currentProgress = {}) => {
  const track = CAREER_TRACKS[trackId];
  if (!track) {
    return generateMockRoadmap(userId); // Fallback to default
  }

  // Map current progress to new milestones
  const milestones = track.milestones.map((milestone, index) => {
    const existingProgress = currentProgress.milestones?.[index];
    let status = 'locked';
    let progress = 0;

    // Determine status based on index and existing progress
    if (index === 0) {
      status = existingProgress?.status || 'completed';
      progress = existingProgress?.progress || 100;
    } else if (index === 1 && existingProgress?.status === 'active') {
      status = 'active';
      progress = existingProgress?.progress || 0;
    } else if (index === 1 && milestones[index - 1]?.status === 'completed') {
      status = 'active';
    } else if (index > 0 && track.milestones[index - 1].status === 'completed') {
      status = 'locked';
    }

    return {
      ...milestone,
      xp: milestone.baseXP,
      status,
      progress,
      prerequisites: index > 0 ? [track.milestones[index - 1].id] : []
    };
  });

  return {
    studentName: currentProgress.studentName || 'Huy',
    targetCareer: track.name,
    careerTrackId: trackId,
    milestones
  };
};

/**
 * Generate mock roadmap với logic thông minh (default track)
 */
const generateMockRoadmap = (userId) => {
  return generateRoadmapForTrack('fullstack-java', userId, {
    studentName: 'Huy',
    milestones: [
      { status: 'completed', progress: 100 },
      { status: 'active', progress: 35 },
      { status: 'locked', progress: 0 },
      { status: 'locked', progress: 0 }
    ]
  });
};

/**
 * Cập nhật trạng thái milestone
 */
export const updateMilestoneStatus = async (milestoneId, status, progress) => {
  try {
    const token = localStorage.getItem('accessToken');
    // TODO: Replace with real API
    // const response = await fetch(`${API_BASE}/learning/milestones/${milestoneId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ status, progress })
    // });
    // return await response.json();

    return { success: true, milestoneId, status, progress };
  } catch (error) {
    console.error('Error updating milestone:', error);
    throw error;
  }
};

