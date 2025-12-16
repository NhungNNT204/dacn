import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

/**
 * Component: Navigation
 * Thanh điều hướng chính
 */
export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <a href={isAuthenticated ? '/dashboard' : '/login'}>
            <span className="logo-icon">🎓</span>
            <span className="logo-text">UpNestEdu</span>
          </a>
        </div>

        {/* Menu */}
        {isAuthenticated ? (
          <div className="navbar-menu">
            <a href="/dashboard" className="nav-link">
              Trang chủ
            </a>
            <a href="/dashboard" className="nav-link">
              Khóa học
            </a>
            <a href="/dashboard" className="nav-link">
              Cộng đồng
            </a>

            {/* User Dropdown */}
            <div className="navbar-user">
              <button
                className="user-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src="https://via.placeholder.com/35"
                  alt={user?.username}
                  className="user-avatar"
                />
                <span className="user-name">{user?.username}</span>
                <span className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </button>

              {isDropdownOpen && (
                <div className="user-dropdown">
                  <a
                    href="/profile"
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('/profile');
                    }}
                  >
                    👤 Hồ sơ của tôi
                  </a>
                  <a
                    href="/privacy-settings"
                    className="dropdown-item"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigate('/privacy-settings');
                    }}
                  >
                    🔒 Cài đặt quyền riêng tư
                  </a>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="navbar-menu">
            <a href="/login" className="nav-link">
              Đăng nhập
            </a>
            <a href="/register" className="nav-link register-link">
              Đăng ký
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
