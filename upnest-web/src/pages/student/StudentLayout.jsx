import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Search, 
  Rss, 
  BookOpen, 
  Library, 
  Bell, 
  MessageSquare,
  ChevronDown,
  User,
  Award,
  Settings,
  LogOut,
  LayoutGrid,
  Users,
  Trophy,
  Flame,
  ArrowRight,
  UserPlus,
  TrendingUp,
  Coffee,
  Palette,
  Atom
} from 'lucide-react';
import './StudentLayout.css';
import Feed from './Feed';
import StudentMessaging from './StudentMessaging';

/**
 * StudentLayout - Layout chính cho trang sinh viên (kiểu Facebook/Instagram)
 */
export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showMessaging, setShowMessaging] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Chỉ hiển thị rightbar ở trang dashboard
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    // Load user profile
    const loadUser = async () => {
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
              return;
            }
          }
        }
      } catch (e) {
        console.log('Backend unavailable, using mock');
      }
      // Mock user
      setUser({
        fullName: "Nguyễn Thị Thùy Nhung",
        level: 4,
        avatarUrl: null
      });
    };
    loadUser();

    // Load unread notifications count
    const loadUnreadCount = async () => {
      try {
        const { getUnreadCount } = await import('../../services/notificationService');
        const count = await getUnreadCount();
        setUnreadNotifications(count);
      } catch (e) {
        console.log('Error loading unread count:', e);
      }
    };
    loadUnreadCount();

    // Keyboard shortcut CTRL+K for search
    const handleKeyDown = (e) => {
      // Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };
    
    // Add event listener to window to catch all keydown events
    window.addEventListener('keydown', handleKeyDown, true);

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const learningItems = [
    { icon: LayoutGrid, label: 'Góc học tập', path: '/learning-corner' },
    { icon: BookOpen, label: 'Khóa học của tôi', path: '/my-courses' },
    { icon: Library, label: 'Thư viện số', path: '/library' },
  ];

  const communityItems = [
    { icon: Users, label: 'Cộng đồng', path: '/community' },
    { icon: MessageSquare, label: 'Tin nhắn', path: '/messages', badge: 3 },
    { icon: Trophy, label: 'Thành tích', path: '/achievements' },
  ];

  const systemItems = [
    { icon: Settings, label: 'Cài đặt', path: '/settings' },
  ];

  return (
    <div className="student-layout">
      {/* Global Navigation Bar */}
      <header className="global-nav">
        {/* Logo Section */}
        <div className="nav-logo">
          <div className="logo-icon">
            <GraduationCap size={24} />
          </div>
          <div className="logo-text">
            <h1 className="logo-title">UPNEST.EDU</h1>
            <p className="logo-tagline">
              <span className="tagline-part">CỘNG ĐỒNG HỌC TẬP</span>
              <span className="tagline-dot">•</span>
              <span className="tagline-social">SOCIAL NET</span>
            </p>
          </div>
          </div>

    

        {/* Navigation Icons */}
        <div className="nav-icons">
          <button 
            className="nav-icon-btn nav-feed"
            onClick={() => navigate('/news-feed')}
            title="Feed"
          >
            <Rss size={20} />
          </button>
          <button 
            className="nav-icon-btn nav-classroom"
            onClick={() => navigate('/classroom')}
            title="Lớp học"
          >
            <BookOpen size={20} />
          </button>
          <button 
            className="nav-icon-btn nav-library"
            onClick={() => navigate('/library')}
            title="Thư viện"
          >
            <Library size={20} />
          </button>
          <button 
            className="nav-icon-btn nav-notifications"
            onClick={() => navigate('/notifications')}
            title="Thông báo"
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </button>
          <button 
            className="nav-icon-btn nav-chat"
            onClick={() => setShowMessaging(!showMessaging)}
            title="Chat"
          >
            <MessageSquare size={20} />
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="nav-user" ref={dropdownRef}>
          <button 
            className="user-profile-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          >
            <div className="user-avatar">
              <img 
                src="https://drive.google.com/uc?export=view&id=1wsXqMnwZgSdVrJUkygYagjb3Le0aXKGC"
                alt="Avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <span style={{ display: 'none' }}>{user?.fullName?.charAt(0) || 'N'}</span>
            </div>
            <div className="user-info">
              <span className="user-name">{user?.fullName || 'Nguyễn Thị Thùy Nhung'}</span>
              <span className="user-level">LVL {user?.level || 4}</span>
            </div>
            <ChevronDown size={16} className={`dropdown-chevron ${userDropdownOpen ? 'open' : ''}`} />
          </button>
          
          {userDropdownOpen && (
            <div className="user-dropdown">
              <a href="/profile" className="dropdown-item" onClick={(e) => { e.preventDefault(); navigate('/profile'); setUserDropdownOpen(false); }}>
                <User size={18} />
                <span>Hồ sơ cá nhân</span>
              </a>
              <a href="/certificates" className="dropdown-item" onClick={(e) => { e.preventDefault(); navigate('/certificates'); setUserDropdownOpen(false); }}>
                <Award size={18} />
                <span>Chứng chỉ đạt được</span>
              </a>
              <a href="/settings" className="dropdown-item" onClick={(e) => { e.preventDefault(); navigate('/settings'); setUserDropdownOpen(false); }}>
                <Settings size={18} />
                <span>Cài đặt</span>
              </a>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item logout-item" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          {/* HỌC TẬP Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">HỌC TẬP</h3>
            <nav className="nav-menu">
              {learningItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <a 
                    key={idx}
                    href="#"
                    className="nav-item"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                  >
                    <div className="nav-icon-wrapper">
                      <IconComponent size={20} className="nav-icon" />
                    </div>
                    <span className="nav-label">{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* CỘNG ĐỒNG Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">CỘNG ĐỒNG</h3>
            <nav className="nav-menu">
              {communityItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <a 
                    key={idx}
                    href="#"
                    className="nav-item"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                  >
                    <div className="nav-icon-wrapper">
                      <IconComponent size={20} className="nav-icon" />
                    </div>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* HỆ THỐNG Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">HỆ THỐNG</h3>
            <nav className="nav-menu">
              {systemItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <a 
                    key={idx}
                    href="#"
                    className="nav-item"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                  >
                    <div className="nav-icon-wrapper">
                      <IconComponent size={20} className="nav-icon" />
                    </div>
                    <span className="nav-label">{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* User Profile Card */}
          <div className="sidebar-user-card">
            <div className="user-card-avatar">
              <img 
                src="https://drive.google.com/uc?export=view&id=1wsXqMnwZgSdVrJUkygYagjb3Le0aXKGC"
                alt="Avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <span style={{ display: 'none' }}>{user?.fullName?.charAt(0) || 'U'}</span>
            </div>
            <div className="user-card-info">
              <span className="user-card-role">Học viên</span>
              <span className="user-card-level">CẤP ĐỘ {user?.level || 4}</span>
            </div>
            <button 
              className="user-card-action"
              onClick={() => navigate('/profile')}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        {showMessaging ? (
          <StudentMessaging onClose={() => setShowMessaging(false)} />
        ) : (
          <main className="content-area">
            {children || <Feed />}
          </main>
        )}

        {/* Right Sidebar - Enhanced Design - Chỉ hiển thị ở dashboard */}
        {isDashboard && (
        <aside className="right-sidebar">
          {/* 🔥 Xu hướng học thuật */}
          <div className="widget-trending">
            <h3 className="widget-title">🔥 Xu hướng học thuật</h3>
            <div className="trending-list">
              <div className="trending-card trending-blue">
                <div className="trending-header">
                  <Atom size={20} className="trending-icon" />
                  <span className="trending-tag">#ReactJS</span>
                </div>
                <div className="trending-stats">
                  <span className="trending-count">1.2K</span>
                  <span className="trending-label">bài viết</span>
                </div>
              </div>
              <div className="trending-card trending-orange">
                <div className="trending-header">
                  <Coffee size={20} className="trending-icon" />
                  <span className="trending-tag">#Java</span>
                </div>
                <div className="trending-stats">
                  <span className="trending-count">856</span>
                  <span className="trending-label">bài viết</span>
                </div>
              </div>
              <div className="trending-card trending-pink">
                <div className="trending-header">
                  <Palette size={20} className="trending-icon" />
                  <span className="trending-tag">#UI/UX</span>
                </div>
                <div className="trending-stats">
                  <span className="trending-count">2.3K</span>
                  <span className="trending-label">bài viết</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🤝 Gợi ý kết nối */}
          <div className="widget-suggestions">
            <h3 className="widget-title">🤝 Gợi ý kết nối</h3>
            <div className="suggestions-list">
              <div className="suggestion-card">
                <div className="suggestion-avatar">NA</div>
                <div className="suggestion-info">
                  <span className="suggestion-name">Nguyễn Văn A</span>
                  <span className="suggestion-badge badge-expert">Expert</span>
                </div>
                <button className="suggestion-btn">
                  <UserPlus size={16} />
                  Kết bạn
                </button>
              </div>
              <div className="suggestion-card">
                <div className="suggestion-avatar">TB</div>
                <div className="suggestion-info">
                  <span className="suggestion-name">Trần Thị B</span>
                  <span className="suggestion-badge badge-mentor">Mentor</span>
                </div>
                <button className="suggestion-btn">
                  <UserPlus size={16} />
                  Kết bạn
                </button>
              </div>
              <div className="suggestion-card">
                <div className="suggestion-avatar">LC</div>
                <div className="suggestion-info">
                  <span className="suggestion-name">Lê Văn C</span>
                  <span className="suggestion-badge badge-student">Student</span>
                </div>
                <button className="suggestion-btn">
                  <UserPlus size={16} />
                  Kết bạn
                </button>
              </div>
            </div>
          </div>

          {/* 🏆 Bảng vàng tri thức */}
          <div className="widget-leaderboard">
            <div className="leaderboard-header">
              <Trophy size={24} className="leaderboard-icon" />
              <h3 className="leaderboard-title">Bảng vàng tri thức</h3>
            </div>
            <div className="leaderboard-list">
              <div className="leaderboard-item leaderboard-top">
                <div className="leaderboard-rank">1</div>
                <div className="leaderboard-avatar">NV</div>
                <div className="leaderboard-info">
                  <span className="leaderboard-name">Nguyễn Văn</span>
                  <span className="leaderboard-score">2,450 XP</span>
                </div>
              </div>
              <div className="leaderboard-item leaderboard-top">
                <div className="leaderboard-rank">2</div>
                <div className="leaderboard-avatar">TT</div>
                <div className="leaderboard-info">
                  <span className="leaderboard-name">Trần Thị</span>
                  <span className="leaderboard-score">2,120 XP</span>
                </div>
              </div>
              <div className="leaderboard-item leaderboard-current">
                <div className="leaderboard-rank">3</div>
                <div className="leaderboard-avatar current-user">{user?.fullName?.charAt(0) || 'U'}</div>
                <div className="leaderboard-info">
                  <span className="leaderboard-name">Bạn</span>
                  <span className="leaderboard-score">1,450 XP</span>
                </div>
              </div>
              <div className="leaderboard-item">
                <div className="leaderboard-rank">4</div>
                <div className="leaderboard-avatar">LV</div>
                <div className="leaderboard-info">
                  <span className="leaderboard-name">Lê Văn</span>
                  <span className="leaderboard-score">1,200 XP</span>
                </div>
              </div>
            </div>
            <button 
              className="leaderboard-button"
              onClick={() => navigate('/leaderboard')}
            >
              Xem toàn bộ
            </button>
          </div>
        </aside>
        )}
      </div>
    </div>
  );
}
