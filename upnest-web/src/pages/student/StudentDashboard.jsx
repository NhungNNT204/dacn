import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentDashboard.css';

/**
 * Component: StudentDashboard
 * Trang dashboard chính cho sinh viên - Tích hợp với StudentLayout
 */
export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
      // Try to navigate to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-alert">{error}</div>
        <button onClick={() => navigate('/login')} className="btn-error-back">
          Quay lại đăng nhập
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-banner"></div>
          <div className="profile-info">
            <div className="profile-avatar">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="profile-details">
              <h2 className="profile-name">{user?.fullName || 'Người dùng'}</h2>
              <p className="profile-email">{user?.email}</p>
              <p className="profile-role">
                {user?.role === 'STUDENT' ? '👨‍🎓 Sinh viên' : 
                 user?.role === 'TEACHER' ? '👨‍🏫 Giáo viên' : 
                 user?.role === 'ADMIN' ? '👨‍💼 Quản trị viên' : 'Người dùng'}
              </p>
            </div>
            <button className="btn-edit-profile" onClick={() => navigate('/profile')}>
              ✏️ Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <h4>📚 Khóa học</h4>
            <p className="stat-number">5</p>
            <p className="stat-label">Đang theo học</p>
          </div>
          <div className="stat-card">
            <h4>👥 Bạn bè</h4>
            <p className="stat-number">24</p>
            <p className="stat-label">Người theo dõi</p>
          </div>
          <div className="stat-card">
            <h4>💬 Bài viết</h4>
            <p className="stat-number">12</p>
            <p className="stat-label">Chia sẻ gần đây</p>
          </div>
          <div className="stat-card">
            <h4>🏆 Điểm</h4>
            <p className="stat-number">450</p>
            <p className="stat-label">Tổng cộng</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Hành động nhanh</h3>
          <div className="actions-grid">
            <button 
              className="action-card"
              onClick={() => navigate('/courses')}
            >
              <span className="action-icon">📖</span>
              <span className="action-text">Khóa học</span>
            </button>
            <button 
              className="action-card"
              onClick={() => navigate('/forum')}
            >
              <span className="action-icon">💬</span>
              <span className="action-text">Diễn đàn</span>
            </button>
            <button 
              className="action-card"
              onClick={() => navigate('/friends')}
            >
              <span className="action-icon">👥</span>
              <span className="action-text">Bạn bè</span>
            </button>
            <button 
              className="action-card"
              onClick={() => navigate('/progress')}
            >
              <span className="action-icon">📊</span>
              <span className="action-text">Tiến độ</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h3>📌 Hoạt động gần đây</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-avatar">N</div>
              <div className="activity-content">
                <p className="activity-text"><strong>Bạn</strong> đã đăng bài viết mới</p>
                <p className="activity-time">2 giờ trước</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-avatar">T</div>
              <div className="activity-content">
                <p className="activity-text"><strong>Thầy Minh</strong> đã tạo khóa học mới</p>
                <p className="activity-time">5 giờ trước</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-avatar">H</div>
              <div className="activity-content">
                <p className="activity-text"><strong>Hương</strong> đã theo dõi bạn</p>
                <p className="activity-time">1 ngày trước</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations">
          <h3>💡 Gợi ý cho bạn</h3>
          <div className="recommendation-cards">
            <div className="rec-card">
              <div className="rec-header">JavaScript Advanced</div>
              <p className="rec-description">Học JavaScript nâng cao với React và Node.js</p>
              <button className="btn-explore">Khám phá →</button>
            </div>
            <div className="rec-card">
              <div className="rec-header">Python for Data Science</div>
              <p className="rec-description">Phân tích dữ liệu với Python và Pandas</p>
              <button className="btn-explore">Khám phá →</button>
            </div>
            <div className="rec-card">
              <div className="rec-header">Web Design Basics</div>
              <p className="rec-description">Thiết kế web với HTML, CSS, và UX</p>
              <button className="btn-explore">Khám phá →</button>
            </div>
          </div>
        </div>
      </div>
  );
}
