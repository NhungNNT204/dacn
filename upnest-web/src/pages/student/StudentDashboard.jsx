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
  TrendingUp
} from 'lucide-react';
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
        fullName: "Nguyễn Văn Huy",
        email: "huy.nguyen@upnest.edu",
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
    };
    loadData();
  }, []);

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
            <h1>Hi, {user?.fullName?.split(' ').pop() || 'Huy'}!</h1>
            <div className="welcome-badges">
              <span className="badge-level">LVL {stats.level || 4}</span>
              <span className="badge-pro">STUDENT PRO</span>
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
          <h4>HUY HIỆU</h4>
          <p className="stat-number">{stats.badges || 12}</p>
          <p className="stat-subtitle">THÀNH TỰU ĐẠT ĐƯỢC</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-left">
          {/* Roadmap Section */}
          <div className="roadmap-section">
            <div className="section-header">
              <h2>
                <Book size={20} />
                Lộ trình của bạn
              </h2>
            </div>
            <div className="roadmap-grid">
              <div className="roadmap-card roadmap-active">
                <Video size={28} />
                <h3>Lớp học trực tuyến</h3>
                <p>ĐANG DIỄN RA 2 BUỔI HỌC</p>
              </div>
              <div className="roadmap-card">
                <MessageCircle size={28} />
                <h3>Thảo luận nhóm</h3>
                <p>CÓ 5 TIN NHẮN THẢO LUẬN MỚI</p>
              </div>
              <div className="roadmap-card">
                <Book size={28} />
                <h3>Kho tài liệu số</h3>
                <p>100+ TÀI LIỆU CHUYÊN MÔN</p>
              </div>
              <div className="roadmap-card">
                <Sparkles size={28} />
                <h3>Hỏi đáp AI</h3>
                <p>HỖ TRỢ GIẢI BÀI TẬP 24/7</p>
              </div>
            </div>
          </div>

          {/* Community Activity */}
          <div className="activity-section">
            <div className="section-header">
              <h2>
                <TrendingUp size={20} />
                Hoạt động cộng đồng
              </h2>
              <a href="/news-feed" className="link-full-feed">BẢNG TIN ĐẦY ĐỦ</a>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-avatar">MT</div>
                <div className="activity-content">
                  <p>Thầy Minh vừa đăng tài liệu mới vào nhóm Java Expert</p>
                  <a href="#" className="activity-link">TẢI XUỐNG NGAY →</a>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">HG</div>
                <div className="activity-content">
                  <p>Hương Giang và 12 người khác vừa nhận huy hiệu "Mọt sách"</p>
                  <a href="#" className="activity-link">GỬI LỜI CHÚC →</a>
                </div>
              </div>
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
    </div>
  );
}