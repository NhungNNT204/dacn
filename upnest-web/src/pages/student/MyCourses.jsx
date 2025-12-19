import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Star, 
  Clock, 
  Award, 
  CheckCircle2,
  TrendingUp,
  Filter,
  Play,
  MoreVertical
} from 'lucide-react';
import './MyCourses.css';

// Ảnh đại diện cho khóa học
const COURSE_IMAGES = {
  'ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', // AI neural network
  'robot': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', // Robot Pepper
  'code': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', // Code editor
  'default': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
};

export default function MyCourses() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('learning');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    learningTime: 124,
    certificates: 8,
    goalCompletion: 84,
    learningRank: 5
  });
  const [topics, setTopics] = useState([
    'Thiết kế', 'Lập trình', 'Kinh doanh', 'Marketing', 'Data', 'Ngoại ngữ'
  ]);

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const filter = activeTab === 'learning' ? 'learning' : 
                      activeTab === 'completed' ? 'completed' : 
                      activeTab === 'favorites' ? 'favorites' : 'all';
        
        const response = await fetch(`http://localhost:8080/api/v1/my-courses?filter=${filter}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data
    const mockCourses = getMockCourses(activeTab);
    setCourses(mockCourses);
    setIsLoading(false);
  };

  const getMockCourses = (tab) => {
    const allCourses = [
      {
        enrollmentId: 1,
        course: {
          id: 1,
          title: 'UI/UX Design Masterclass 2024',
          instructorName: 'Trần Thế Duyệt',
          category: 'DESIGN',
          durationFormatted: '12 giờ 45 phút',
          totalLessons: 24,
          rating: 4.9,
          thumbnailUrl: COURSE_IMAGES.code
        },
        status: 'IN_PROGRESS',
        isFavorite: true,
        completedLessons: 18,
        totalLessons: 24,
        progressPercentage: 75,
        lastAccessedFormatted: '2 giờ trước'
      },
      {
        enrollmentId: 2,
        course: {
          id: 2,
          title: 'Data Science với Python và SQL',
          instructorName: 'Nguyễn Thị B',
          category: 'DATA',
          durationFormatted: '20 giờ 15 phút',
          totalLessons: 30,
          rating: 4.8,
          thumbnailUrl: COURSE_IMAGES.code
        },
        status: 'IN_PROGRESS',
        isFavorite: false,
        completedLessons: 9,
        totalLessons: 30,
        progressPercentage: 30,
        lastAccessedFormatted: '5 phút trước'
      },
      {
        enrollmentId: 3,
        course: {
          id: 3,
          title: 'Kiến trúc Mạng nơ-ron Nâng cao',
          instructorName: 'TS. Sarah Chen',
          category: 'AI',
          durationFormatted: '12 giờ 45 phút',
          totalLessons: 24,
          rating: 4.9,
          thumbnailUrl: COURSE_IMAGES.ai
        },
        status: 'IN_PROGRESS',
        isFavorite: true,
        completedLessons: 18,
        totalLessons: 24,
        progressPercentage: 75,
        lastAccessedFormatted: '1 ngày trước'
      },
      {
        enrollmentId: 4,
        course: {
          id: 4,
          title: 'Đạo đức học trong Robot',
          instructorName: 'GS. Marcus Thorne',
          category: 'ETHICS',
          durationFormatted: '8 giờ 20 phút',
          totalLessons: 15,
          rating: 4.7,
          thumbnailUrl: COURSE_IMAGES.robot
        },
        status: 'IN_PROGRESS',
        isFavorite: false,
        completedLessons: 4,
        totalLessons: 15,
        progressPercentage: 30,
        lastAccessedFormatted: '3 ngày trước'
      },
      {
        enrollmentId: 5,
        course: {
          id: 5,
          title: 'Thiết kế Hệ thống Full-Stack',
          instructorName: 'Alex Rivera',
          category: 'WEB',
          durationFormatted: '20 giờ 15 phút',
          totalLessons: 42,
          rating: 5.0,
          thumbnailUrl: COURSE_IMAGES.code
        },
        status: 'COMPLETED',
        isFavorite: true,
        completedLessons: 42,
        totalLessons: 42,
        progressPercentage: 100,
        lastAccessedFormatted: '1 tuần trước'
      },
      {
        enrollmentId: 6,
        course: {
          id: 6,
          title: 'Làm chủ Cấu trúc Dữ liệu & Giải thuật',
          instructorName: 'Elena Popova',
          category: 'CS',
          durationFormatted: '15 giờ 30 phút',
          totalLessons: 30,
          rating: 4.8,
          thumbnailUrl: COURSE_IMAGES.code
        },
        status: 'IN_PROGRESS',
        isFavorite: false,
        completedLessons: 13,
        totalLessons: 30,
        progressPercentage: 45,
        lastAccessedFormatted: '2 ngày trước'
      },
      {
        enrollmentId: 7,
        course: {
          id: 7,
          title: 'Marketing Digital cho Startups',
          instructorName: 'Phạm Minh C',
          category: 'BUSINESS',
          durationFormatted: '10 giờ',
          totalLessons: 20,
          rating: 4.6,
          thumbnailUrl: COURSE_IMAGES.default
        },
        status: 'IN_PROGRESS',
        isFavorite: true,
        completedLessons: 2,
        totalLessons: 20,
        progressPercentage: 10,
        lastAccessedFormatted: '3 ngày trước'
      }
    ];

    switch (tab) {
      case 'learning':
        return allCourses.filter(c => c.status === 'IN_PROGRESS');
      case 'completed':
        return allCourses.filter(c => c.status === 'COMPLETED');
      case 'favorites':
        return allCourses.filter(c => c.isFavorite);
      default:
        return allCourses;
    }
  };

  const handleToggleFavorite = async (courseId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`http://localhost:8080/api/v1/my-courses/${courseId}/toggle-favorite`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.log('Error toggling favorite');
    }
    
    // Update local state
    setCourses(courses.map(c => 
      c.course.id === courseId 
        ? { ...c, isFavorite: !c.isFavorite }
        : c
    ));
  };

  const getCategoryTag = (category) => {
    const tags = {
      'DESIGN': { text: 'DESIGN', color: '#3b82f6' },
      'DATA': { text: 'DATA', color: '#10b981' },
      'AI': { text: 'AI & MÁY HỌC', color: '#6366f1' },
      'ETHICS': { text: 'ĐẠO ĐỨC HỌC', color: '#6b7280' },
      'WEB': { text: 'PHÁT TRIỂN WEB', color: '#10b981' },
      'CS': { text: 'KHOA HỌC MÁY TÍNH', color: '#6b7280' },
      'BUSINESS': { text: 'BUSINESS', color: '#3b82f6' }
    };
    return tags[category] || { text: category, color: '#6b7280' };
  };

  return (
    <div className="my-courses-page">
      <div className="my-courses-container">
        {/* Left Column - Main Content */}
        <div className="my-courses-main">
          {/* Header */}
          <div className="courses-header">
            <div>
              <h1>Khóa học của tôi</h1>
              <p className="welcome-message">
                {/* Chào mừng bạn trở lại! Tiếp tục hành trình học tập của mình nhé. */}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="courses-tabs">
            <button 
              className={`tab-btn ${activeTab === 'learning' ? 'active' : ''}`}
              onClick={() => setActiveTab('learning')}
            >
              Đang học
            </button>
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Đã hoàn thành
            </button>
            <button 
              className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              Yêu thích
            </button>
          </div>

          {/* Course Cards Grid */}
          {isLoading ? (
            <div className="courses-loading">
              <div className="spinner"></div>
              <p>Đang tải khóa học...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="courses-empty">
              <BookOpen size={48} />
              <p>Chưa có khóa học nào trong danh mục này.</p>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((enrollment) => {
                const course = enrollment.course;
                const categoryTag = getCategoryTag(course.category);
                
                return (
                  <div key={enrollment.enrollmentId} className="course-card">
                    {/* Course Image */}
                    <div className="course-image-wrapper">
                      <img 
                        src={course.thumbnailUrl || COURSE_IMAGES.default} 
                        alt={course.title}
                        className="course-image"
                      />
                      <div 
                        className="course-category-tag"
                        style={{ backgroundColor: categoryTag.color }}
                      >
                        {categoryTag.text}
                      </div>
                      <button 
                        className={`course-favorite-btn ${enrollment.isFavorite ? 'active' : ''}`}
                        onClick={() => handleToggleFavorite(course.id)}
                      >
                        <Star size={18} fill={enrollment.isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Course Content */}
                    <div className="course-content">
                      <div className="course-header-row">
                        <h3 className="course-title">{course.title}</h3>
                        <button className="course-more-btn">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                      
                      <div className="course-meta">
                        <span className="course-instructor">{course.instructorName}</span>
                        <span className="course-separator">•</span>
                        <span className="course-time">{enrollment.lastAccessedFormatted}</span>
                      </div>

                      <div className="course-duration">
                        <Clock size={14} />
                        <span>{course.durationFormatted}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="course-progress-section">
                        <div className="progress-label">
                          <span>Tiến độ học tập</span>
                          <span className="progress-percentage">{enrollment.progressPercentage}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${enrollment.progressPercentage}%` }}
                          ></div>
                        </div>
                        <div className="progress-lessons">
                          {enrollment.completedLessons}/{enrollment.totalLessons} Bài học
                        </div>
                      </div>

                      {/* Action Button */}
                      <button 
                        className="course-action-btn"
                        onClick={() => navigate(`/courses/${course.id}/lessons`)}
                      >
                        <Play size={16} />
                        {enrollment.status === 'COMPLETED' ? 'Xem lại' : 'Học tiếp'}
                      </button>

                      {/* Rating */}
                      <div className="course-rating">
                        <Star size={14} fill="currentColor" />
                        <span>{course.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="my-courses-sidebar">
          {/* Learning Statistics */}
          <div className="stats-box">
            <h3>THỐNG KÊ HỌC TẬP</h3>
            <div className="stats-list">
              <div className="stat-item">
                <Clock size={20} className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">{stats.learningTime} Giờ</div>
                  <div className="stat-label">Thời gian học tháng này</div>
                </div>
              </div>
              <div className="stat-item">
                <Award size={20} className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">{stats.certificates}</div>
                  <div className="stat-label">Chứng chỉ đã đạt được</div>
                </div>
              </div>
              <div className="stat-item">
                <CheckCircle2 size={20} className="stat-icon" />
                <div className="stat-content">
                  <div className="stat-value">{stats.goalCompletion}%</div>
                  <div className="stat-label">Tỷ lệ hoàn thành mục tiêu</div>
                </div>
              </div>
              <div className="stat-item stat-rank">
                <div className="stat-label">Thứ hạng học tập</div>
                <div className="rank-progress">
                  <div className="rank-bar">
                    <div 
                      className="rank-fill"
                      style={{ width: `${100 - stats.learningRank * 10}%` }}
                    ></div>
                  </div>
                  <span className="rank-text">TOP {stats.learningRank}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="topics-box">
            <div className="topics-header">
              <h3>Chủ đề của bạn</h3>
              <button className="topics-filter-btn">
                <Filter size={16} />
              </button>
            </div>
            <div className="topics-list">
              {topics.map((topic, index) => (
                <span key={index} className="topic-tag">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

