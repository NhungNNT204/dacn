import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Trophy,
  Video,
  MessageCircle,
  Book,
  Sparkles,
  Play,
  Compass,
  TrendingUp,
  BrainCircuit,
  Rocket,
  Code,
  Cloud,
  CheckCircle2,
  Lock,
  Target,
  Settings,
  ArrowRight,
  TrendingDown,
  Award,
  Clock,
  X,
  Smartphone,
  Loader,
  Flame,
  BarChart3,
  FileText,
  Calendar,
  Bell
} from 'lucide-react';
import { 
  getLearningRoadmap, 
  getExamResults, 
  getCommunityStats,
  calculateAIInsights,
  compareWithCommunity,
  checkPrerequisites,
  updateCareerTrack,
  CAREER_TRACKS
} from '../../services/learningRoadmapService';
import './StudentDashboard.css';

/**
 * Dữ liệu Mock
 */
const localMockUserService = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      data: {
        fullName: "Nguyễn Thị Thùy Nhung",
        email: "nhung.nguyen@upnest.edu",
        role: "STUDENT",
        avatarUrl: null,
        stats: {
          courses: 5,
          friends: 124,
          posts: 42,
          badges: 12,
          xp: 1450,
          level: 4,
          nextLevelXp: 2000,
          onlineTeammates: 124
        }
      }
    };
  }
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [communityComparison, setCommunityComparison] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          const response = await fetch('http://localhost:8080/api/v1/users/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            if (data?.data) {
              setUser(data.data);
              setIsLoading(false);
              
              // Load roadmap data
              await loadRoadmapData(data.data.userId || data.data.id);
              // Load dashboard data
              await loadDashboardData(data.data.userId || data.data.id);
              return;
            }
          }
        }
      } catch (e) {
        console.log('Backend unavailable, using mock');
      }
      const result = await localMockUserService.getProfile();
      setUser(result.data);
      setIsLoading(false);
      
      // Load roadmap data with mock userId
      await loadRoadmapData('1');
      // Load dashboard data
      await loadDashboardData('1');
    };
    loadData();
  }, []);

  const loadDashboardData = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/dashboard/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
          setRecentActivities(data.recentActivities || []);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data fallback
    const mockData = {
      streak: 12,
      level: stats.level || 4,
      levelTitle: "Student Pro",
      recentActivities: [
        {
          id: 1,
          type: 'assignment',
          title: 'Nộp bài tập thành công',
          description: 'Bạn đã nộp bài tập "Java Core - Bài tập 5"',
          time: '2 giờ trước',
          icon: 'CheckCircle2',
          color: '#10b981'
        },
        {
          id: 2,
          type: 'post',
          title: 'Bài đăng mới từ Thầy Minh',
          description: 'Thầy Minh vừa đăng tài liệu mới vào nhóm Java Expert',
          time: '5 giờ trước',
          icon: 'FileText',
          color: '#3b82f6'
        },
        {
          id: 3,
          type: 'reminder',
          title: 'Lịch học sắp tới',
          description: 'Lớp "Spring Boot Advanced" bắt đầu sau 1 giờ',
          time: '1 giờ trước',
          icon: 'Calendar',
          color: '#f59e0b'
        }
      ]
    };
    setDashboardData(mockData);
    setRecentActivities(mockData.recentActivities);
  };

  const loadRoadmapData = async (userId) => {
    try {
      // Load roadmap, exam results, and community stats in parallel
      const [roadmap, exams, communityStats] = await Promise.all([
        getLearningRoadmap(userId),
        getExamResults(userId),
        getCommunityStats()
      ]);

      setRoadmapData(roadmap);
      setExamResults(exams);

      // Calculate AI insights from exam results
      const insights = calculateAIInsights(exams);
      setAiInsights(insights);

      // Compare with community
      if (roadmap && roadmap.milestones) {
        const activeMilestone = roadmap.milestones.find(m => m.status === 'active');
        if (activeMilestone) {
          const comparison = compareWithCommunity(
            { currentMilestone: activeMilestone },
            communityStats
          );
          setCommunityComparison(comparison);
        }
      }
    } catch (error) {
      console.error('Error loading roadmap data:', error);
      // Fallback to basic mock data
      const basicRoadmap = await getLearningRoadmap(userId);
      setRoadmapData(basicRoadmap);
      setAiInsights(calculateAIInsights([]));
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="ui-spinner" />
        <p>Đang tải...</p>
      </div>
    );
  }

  const stats = user?.stats || {};
  const xpPercentage = stats.nextLevelXp ? ((stats.xp / stats.nextLevelXp) * 100) : 0;
  const remainingXp = stats.nextLevelXp ? (stats.nextLevelXp - stats.xp) : 550;

  // Prepare roadmap data với icon mapping
  const getIconComponent = (iconName) => {
    const iconMap = {
      'CheckCircle2': CheckCircle2,
      'Rocket': Rocket,
      'Code': Code,
      'Cloud': Cloud
    };
    return iconMap[iconName] || BookOpen;
  };

  // Prepare roadmap với icon mapping và prerequisites check
  const prepareMilestones = (milestones) => {
    if (!milestones || milestones.length === 0) return [];
    
    return milestones.map(m => {
      const hasPrerequisites = checkPrerequisites(milestones, m.id);
      let status = m.status;
      
      // Nếu milestone bị locked nhưng đã đủ prerequisites, giữ nguyên locked để UI hiển thị
      // (Backend sẽ tự động unlock khi prerequisites đủ)
      
      return {
        ...m,
        icon: typeof m.icon === 'string' ? getIconComponent(m.icon) : m.icon || BookOpen,
        duration: typeof m.duration === 'number' ? `${m.duration} TUẦN` : m.duration || '0 TUẦN',
        xp: typeof m.xp === 'number' ? `+${m.xp} XP` : m.xp || '+0 XP',
        hasPrerequisites,
        status
      };
    });
  };

  const learningRoadmap = roadmapData ? {
    studentName: user?.fullName?.split(' ').pop() || roadmapData.studentName || 'nhung',
    targetCareer: roadmapData.targetCareer || "Full-stack Developer (Java & React)",
    milestones: prepareMilestones(roadmapData.milestones)
  } : {
    studentName: user?.fullName?.split(' ').pop() || 'nhung',
    targetCareer: "Full-stack Developer (Java & React)",
    milestones: []
  };

  const aiInsight = aiInsights || {
    testResult: "Java Core",
    score: "9.5/10",
    recommendation: "Microservices",
    suggestion: "Dựa trên kết quả bài thi, AI đề xuất bạn tập trung vào phần Microservices để tối ưu hóa lộ trình sự nghiệp."
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-avatar">
          <div className="avatar-circle">
            {user?.fullName?.charAt(0) || 'N'}
          </div>
          <div className="avatar-status"></div>
        </div>
        <div className="welcome-content">
          <div className="welcome-header">
            <h1>Chào {user?.fullName?.split(' ').pop() || 'nhung'}!</h1>
            <div className="welcome-badges">
              <div className="badge-streak">
                <Flame size={16} />
                <span>{dashboardData?.streak || 12} Ngày liên tiếp</span>
              </div>
              <span className="badge-level">Cấp {dashboardData?.level || stats.level || 4}</span>
              <span className="badge-pro">{dashboardData?.levelTitle || 'STUDENT PRO'}</span>
            </div>
          </div>
          <p className="welcome-message">
            Hôm nay bạn đã sẵn sàng nâng cấp kiến thức cùng <strong>{stats.onlineTeammates || 124} đồng đội</strong> đang học trực tuyến chưa?
          </p>
          <div className="welcome-actions">
            <button className="btn-primary" onClick={() => navigate('/courses')}>
              <Play size={18} />
              Bắt đầu bài học
            </button>
            <button className="btn-secondary" onClick={() => navigate('/news-feed')}>
              <Compass size={18} />
              Khám phá cộng đồng
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-courses">
          <BookOpen size={32} className="stat-icon" />
          <h4>KHÓA HỌC</h4>
          <p className="stat-number">{stats.courses || 5}</p>
          <p className="stat-subtitle">TIẾN ĐỘ HỌC TẬP</p>
        </div>
        <div className="stat-card stat-friends">
          <Users size={32} className="stat-icon" />
          <h4>BẠN BÈ</h4>
          <p className="stat-number">{stats.friends || 124}</p>
          <p className="stat-subtitle">MẠNG LƯỚI KẾT NỐI</p>
        </div>
        <div className="stat-card stat-posts">
          <MessageSquare size={32} className="stat-icon" />
          <h4>BÀI VIẾT</h4>
          <p className="stat-number">{stats.posts || 42}</p>
          <p className="stat-subtitle">ĐÓNG GÓP XÃ HỘI</p>
        </div>
        <div className="stat-card stat-badges">
          <Trophy size={32} className="stat-icon" />
          <h4>nhung HIỆU</h4>
          <p className="stat-number">{stats.badges || 12}</p>
          <p className="stat-subtitle">THÀNH TỰU ĐẠT ĐƯỢC</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Personalized Learning Roadmap Section */}
          <div className="learning-roadmap-section">
            {/* Header */}
            <div className="roadmap-header">
              <div className="roadmap-header-left">
                <BookOpen className="roadmap-header-icon" size={24} />
                <div>
                  <h2 className="roadmap-title">Lộ trình của riêng {learningRoadmap.studentName}</h2>
                  <p className="roadmap-subtitle">AI GENERATED LEARNING PATH</p>
                </div>
              </div>
              <button 
                className="roadmap-customize-link"
                onClick={() => navigate('/career')}
              >
                TÙY CHỈNH MỤC TIÊU <ArrowRight size={16} />
              </button>
            </div>

            {/* Roadmap Content */}
            <div className="roadmap-content">
              {/* AI Analysis Panel */}
              <div className="ai-analysis-panel">
                <div className="ai-analysis-header">
                  <div className="ai-header-left">
                    <Sparkles size={18} className="ai-sparkle-icon" />
                    <span className="ai-analysis-title">PHÂN TÍCH TỪ AI</span>
                  </div>
                  <BrainCircuit size={18} className="ai-brain-icon" />
                </div>
                <p className="ai-insight-text">
                  {aiInsight.suggestion || 
                    `Dựa trên kết quả bài thi '${aiInsight.testResult}' (${aiInsight.score}), 
                    AI đề xuất bạn tập trung vào phần ${aiInsight.recommendation} để tối ưu hóa lộ trình sự nghiệp.`}
                </p>
                {communityComparison && (
                  <div className="ai-community-comparison">
                    <div className="comparison-indicator">
                      {communityComparison.isFaster ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      <span className="comparison-text">{communityComparison.message}</span>
                    </div>
                  </div>
                )}
                <div className="ai-target-section">
                  <span className="ai-target-label">NGÀNH MỤC TIÊU</span>
                  <div className="ai-target-career">
                    <Target size={16} />
                    <span>{learningRoadmap.targetCareer}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="roadmap-timeline">
                {learningRoadmap.milestones.map((milestone, index) => {
                  const IconComponent = milestone.icon;
                  const isCompleted = milestone.status === 'completed';
                  const isActive = milestone.status === 'active';
                  const isLocked = milestone.status === 'locked';

                  return (
                    <React.Fragment key={milestone.id}>
                      <div className={`milestone-card ${milestone.status}`}>
                        <div className={`milestone-icon ${milestone.status}`}>
                          {isCompleted && <IconComponent size={24} color="white" />}
                          {isActive && <IconComponent size={24} color="white" />}
                          {isLocked && <IconComponent size={24} color="#9ca3af" />}
                        </div>
                        <div className="milestone-content">
                          <div className="milestone-header-row">
                            <h3 className="milestone-title">{milestone.title}</h3>
                            {milestone.difficulty && (
                              <span className={`milestone-difficulty-badge difficulty-${milestone.difficulty.toLowerCase()}`}>
                                {milestone.difficulty}
                              </span>
                            )}
                          </div>
                          <div className="milestone-meta">
                            <div className="milestone-meta-item">
                              <Clock size={14} />
                              <span className="milestone-duration">{milestone.duration}</span>
                            </div>
                            <div className="milestone-meta-item">
                              <Award size={14} />
                              <span className="milestone-xp">{milestone.xp}</span>
                            </div>
                          </div>
                          {milestone.progress !== undefined && isActive && (
                            <div className="milestone-progress">
                              <div className="milestone-progress-bar">
                                <div 
                                  className="milestone-progress-fill"
                                  style={{ width: `${milestone.progress}%` }}
                                ></div>
                              </div>
                              <span className="milestone-progress-text">{milestone.progress}% hoàn thành</span>
                            </div>
                          )}
                          {isActive && (
                            <button 
                              className="milestone-continue-btn"
                              onClick={() => navigate('/courses')}
                            >
                              HỌC TIẾP
                            </button>
                          )}
                          {isLocked && !checkPrerequisites(learningRoadmap.milestones, milestone.id) && (
                            <div className="milestone-locked-info">
                              <Lock size={12} />
                              <span>Hoàn thành chặng trước để mở khóa</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < learningRoadmap.milestones.length - 1 && (
                        <div className={`timeline-connector ${
                          isCompleted ? 'completed' : 
                          isActive ? 'active' : 
                          'locked'
                        }`}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <div className="section-header">
              <h2>
                <Sparkles size={20} />
                Hành động nhanh
              </h2>
            </div>
            <div className="quick-actions-grid">
              <button className="quick-action-card" onClick={() => navigate('/courses')}>
                <BookOpen size={28} className="action-icon" />
                <h3>Khóa học</h3>
                <p>Vào ngay danh mục bài giảng</p>
              </button>
              <button className="quick-action-card" onClick={() => navigate('/forum')}>
                <MessageSquare size={28} className="action-icon" />
                <h3>Diễn đàn</h3>
                <p>Tham gia thảo luận cùng cộng đồng</p>
              </button>
              <button className="quick-action-card" onClick={() => navigate('/friends')}>
                <Users size={28} className="action-icon" />
                <h3>Bạn bè</h3>
                <p>Tìm kiếm và kết nối đồng đội</p>
              </button>
              <button className="quick-action-card" onClick={() => navigate('/progress')}>
                <BarChart3 size={28} className="action-icon" />
                <h3>Tiến độ</h3>
                <p>Xem chi tiết bảng điểm và thứ hạng</p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-section">
            <div className="section-header">
              <h2>
                <Bell size={20} />
                Nhật ký hoạt động
              </h2>
              <a href="/notifications" className="link-full-feed">XEM TẤT CẢ</a>
            </div>
            <div className="activity-list">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => {
                  const getIcon = (iconName) => {
                    const iconMap = {
                      'CheckCircle2': CheckCircle2,
                      'FileText': FileText,
                      'Calendar': Calendar,
                      'Bell': Bell
                    };
                    return iconMap[iconName] || Bell;
                  };
                  const IconComponent = getIcon(activity.icon);
                  
                  return (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon-wrapper" style={{ backgroundColor: `${activity.color}15` }}>
                        <IconComponent size={20} color={activity.color} />
                      </div>
                      <div className="activity-content">
                        <p className="activity-title">{activity.title}</p>
                        <p className="activity-description">{activity.description}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="activity-empty">
                  <p>Chưa có hoạt động gần đây</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-right">
          {/* Learning Level Card */}
          <div className="level-card">
            <h3>TRÌNH ĐỘ HỌC TẬP</h3>
            <div className="level-progress">
              <div className="progress-circle">
                <svg className="progress-svg" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" className="progress-bg" />
                  <circle 
                    cx="100" 
                    cy="100" 
                    r="90" 
                    className="progress-fill"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - xpPercentage / 100)}`}
                  />
                </svg>
                <div className="progress-text">
                  <span className="progress-xp">{stats.xp || 1450}</span>
                  <span className="progress-label">EXP POINT</span>
                </div>
              </div>
            </div>
            <p className="level-message">
              Chỉ còn {remainingXp} XP nữa để thăng hạng Level {stats.level + 1 || 5}!
            </p>
            <button className="btn-level-action">THỰC HIỆN NHIỆM VỤ</button>
          </div>

          {/* Learn Together Card */}
          <div className="learn-together-card">
            <Sparkles size={24} className="card-icon" />
            <h3>Cùng học, cùng tiến!</h3>
            <p>Học tập cùng bạn bè giúp tăng hiệu suất ghi nhớ lên đến 40%.</p>
            <button className="btn-invite">MỜI BẠN BÈ NGAY</button>
          </div>
        </div>
      </div>

      {/* Career Track Selector Modal */}
      {showCareerModal && (
        <CareerTrackModal
          currentTrack={roadmapData?.careerTrackId || 'fullstack-java'}
          onClose={() => setShowCareerModal(false)}
          onSelect={async (trackId) => {
            setSelectedTrack(trackId);
            setIsRegenerating(true);
            try {
              const userId = user?.userId || user?.id || '1';
              await updateCareerTrack(userId, trackId);
              await loadRoadmapData(userId);
              setIsRegenerating(false);
              setShowCareerModal(false);
            } catch (error) {
              console.error('Error updating career track:', error);
              setIsRegenerating(false);
            }
          }}
          isRegenerating={isRegenerating}
        />
      )}
    </div>
  );
}

/**
 * Career Track Selector Modal Component
 */
function CareerTrackModal({ currentTrack, onClose, onSelect, isRegenerating }) {
  const getIconComponent = (iconName) => {
    const iconMap = {
      'Code': Code,
      'BrainCircuit': BrainCircuit,
      'Smartphone': Smartphone,
      'Cloud': Cloud
    };
    return iconMap[iconName] || BookOpen;
  };

  const tracks = Object.values(CAREER_TRACKS);

  return (
    <div className="career-track-modal" onClick={(e) => {
      if (e.target.classList.contains('career-track-modal') && !isRegenerating) {
        onClose();
      }
    }}>
      <div className="career-track-modal-overlay"></div>
      <div className="career-track-modal-content" onClick={(e) => e.stopPropagation()}>
        {isRegenerating ? (
          <div className="career-modal-regenerating">
            <Loader className="spinner-icon" size={48} />
            <h3>AI đang tái cấu trúc lộ trình...</h3>
            <p>Hệ thống đang phân tích và tạo lộ trình học tập tối ưu cho bạn</p>
          </div>
        ) : (
          <>
            <div className="career-modal-header">
              <div>
                <h2>Chọn định hướng nghề nghiệp</h2>
                <p>Lựa chọn của bạn sẽ giúp AI tạo lộ trình học tập phù hợp nhất</p>
              </div>
              <button className="career-modal-close" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <div className="career-modal-body">
              <div className="career-modal-intro">
                <Sparkles size={32} className="intro-icon" />
                <h3>Tại sao thiết lập mục tiêu quan trọng?</h3>
                <p>
                  Mục tiêu nghề nghiệp rõ ràng giúp bạn tập trung học tập vào đúng kỹ năng cần thiết. 
                  AI sẽ phân tích và đề xuất lộ trình tối ưu dựa trên định hướng bạn chọn, 
                  giúp tiết kiệm thời gian và đạt được kết quả tốt nhất.
                </p>
              </div>

              <div className="career-tracks-grid">
                {tracks.map((track) => {
                  const IconComponent = getIconComponent(track.icon);
                  const isSelected = currentTrack === track.id;
                  
                  return (
                    <div
                      key={track.id}
                      className={`career-track-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => !isSelected && onSelect(track.id)}
                    >
                      <div className="track-card-header">
                        <div className="track-icon" style={{ backgroundColor: `${track.color}15`, borderColor: track.color }}>
                          <IconComponent size={32} color={track.color} />
                        </div>
                        {isSelected && (
                          <div className="track-selected-badge">
                            <CheckCircle2 size={20} />
                            <span>Đang theo</span>
                          </div>
                        )}
                      </div>
                      <h3 className="track-name">{track.name}</h3>
                      <p className="track-description">{track.description}</p>
                      <div className="track-stats">
                        <div className="track-stat-item">
                          <BookOpen size={14} />
                          <span>{track.milestones.length} chặng học</span>
                        </div>
                        <div className="track-stat-item">
                          <Award size={14} />
                          <span>+{track.milestones.reduce((sum, m) => sum + m.baseXP, 0)} XP</span>
                        </div>
                      </div>
                      {!isSelected && (
                        <button className="track-select-btn">
                          Chọn lộ trình này
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}