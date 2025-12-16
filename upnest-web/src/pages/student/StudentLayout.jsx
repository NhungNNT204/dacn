import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentLayout.css';
import Feed from './Feed';

/**
 * StudentLayout - Layout chính cho trang sinh viên (kiểu Facebook/Instagram)
 */
export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const navItems = [
    { icon: '🏠', label: 'Trang chủ', path: '/dashboard' },
    { icon: '�', label: 'Mạng xã hội', path: '/news-feed' },
    { icon: '📝', label: 'Blogs', path: '/blog' },
    { icon: '🎓', label: 'Lớp học', path: '/classroom' },
    { icon: '�👥', label: 'Bạn bè', path: '/friends' },
    { icon: '💬', label: 'Diễn đàn', path: '/forum' },
    { icon: '📚', label: 'Khóa học', path: '/courses' },
    { icon: '👤', label: 'Hồ sơ', path: '/profile' },
    { icon: '⚙️', label: 'Cài đặt', path: '/settings' },
  ];

  return (
    <div className="student-layout">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="logo">UpNest</h1>
        </div>
        <div className="header-search">
          <input type="text" placeholder="🔍 Tìm kiếm..." className="search-input" />
        </div>
        <div className="header-right">
          <button className="icon-btn">🔔</button>
          <button className="icon-btn">💬</button>
          <button className="logout-btn" onClick={handleLogout}>Đăng Xuất</button>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="nav-menu">
            {navItems.map((item, idx) => (
              <a 
                key={idx}
                href="#"
                className="nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="sidebar-footer">
            <p className="footer-text">© 2025 UpNest Education</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="content-area">
          {children || <Feed />}
        </main>

        {/* Right Sidebar (Suggestions/Widget) */}
        <aside className="right-sidebar">
          <div className="widget trending">
            <h3>🔥 Xu hướng</h3>
            <div className="trending-item">
              <p className="trend-title">#ReactJS</p>
              <p className="trend-count">1.2K bài viết</p>
            </div>
            <div className="trending-item">
              <p className="trend-title">#WebDevelopment</p>
              <p className="trend-count">856 bài viết</p>
            </div>
            <div className="trending-item">
              <p className="trend-title">#Python</p>
              <p className="trend-count">2.3K bài viết</p>
            </div>
          </div>

          <div className="widget suggestions">
            <h3>👥 Gợi ý bạn bè</h3>
            <div className="suggestion-item">
              <p>Nguyễn Văn A</p>
              <button className="btn-small btn-primary">Theo dõi</button>
            </div>
            <div className="suggestion-item">
              <p>Trần Thị B</p>
              <button className="btn-small btn-primary">Theo dõi</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
