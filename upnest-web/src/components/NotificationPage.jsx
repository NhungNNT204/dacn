import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import './NotificationPage.css';

/**
 * NotificationPage Component
 * Hiển thị danh sách thông báo với filter, search, phân trang
 */
const NotificationPage = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [filterType, setFilterType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Fetch notifications
  const fetchNotifications = async (page = 0, type = '', search = '') => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/v1/social/notifications?page=${page}&size=${pageSize}`;
      
      if (type) {
        url = `/api/v1/social/notifications/type/${type}?page=${page}&size=${pageSize}`;
      } else if (search) {
        url = `/api/v1/social/notifications/search?keyword=${encodeURIComponent(search)}&page=${page}&size=${pageSize}`;
      } else if (showUnreadOnly) {
        url = `/api/v1/social/notifications/unread`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications || data);
      setTotalPages(data.totalPages || 1);
      setTotalElements(data.totalElements || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`/api/v1/social/notifications/unread/count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  // Handle filter changes
  const handleTypeFilter = (type) => {
    setFilterType(type);
    setCurrentPage(0);
    fetchNotifications(0, type, '');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchNotifications(0, '', searchQuery);
  };

  const handleClearFilters = () => {
    setFilterType('');
    setSearchQuery('');
    setShowUnreadOnly(false);
    setCurrentPage(0);
    fetchNotifications(0, '', '');
  };

  // Mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch(`/api/v1/social/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      // Update local state
      setNotifications(prevNotifs =>
        prevNotifs.map(notif =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`/api/v1/social/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      // Update local state
      setNotifications(prevNotifs =>
        prevNotifs.map(notif => ({ ...notif, isRead: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/v1/social/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      // Update local state
      setNotifications(prevNotifs =>
        prevNotifs.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Delete all notifications
  const handleDeleteAll = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả thông báo?')) {
      try {
        await fetch(`/api/v1/social/notifications`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        setNotifications([]);
        setUnreadCount(0);
      } catch (error) {
        console.error('Error deleting all notifications:', error);
      }
    }
  };

  // Navigate to related item
  const handleNavigateToNotification = (notification) => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const notificationTypes = [
    'LIKE', 'COMMENT', 'TAG', 'FOLLOW_REQUEST', 'FOLLOW',
    'MENTION', 'REMINDER', 'MESSAGE', 'GROUP_INVITE',
    'DISCUSSION_REPLY', 'STORY_VIEW', 'ACHIEVEMENT'
  ];

  return (
    <div className="notification-page">
      <div className="notification-page-header">
        <h1>Thông báo</h1>
        <div className="header-actions">
          {unreadCount > 0 && (
            <>
              <span className="unread-badge">{unreadCount} chưa đọc</span>
              <button 
                className="btn-primary"
                onClick={handleMarkAllAsRead}
              >
                Đánh dấu tất cả là đã đọc
              </button>
            </>
          )}
          {notifications.length > 0 && (
            <button 
              className="btn-danger"
              onClick={handleDeleteAll}
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="notification-filters">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        <div className="type-filters">
          <button 
            className={`filter-btn ${!filterType ? 'active' : ''}`}
            onClick={() => handleTypeFilter('')}
          >
            Tất cả
          </button>
          {notificationTypes.map(type => (
            <button
              key={type}
              className={`filter-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => handleTypeFilter(type)}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="filter-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => {
                setShowUnreadOnly(e.target.checked);
                setCurrentPage(0);
              }}
            />
            Chỉ thông báo chưa đọc
          </label>

          {(filterType || searchQuery || showUnreadOnly) && (
            <button 
              className="clear-filters-btn"
              onClick={handleClearFilters}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="notification-list-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="notification-list">
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDeleteNotification}
                onNavigate={handleNavigateToNotification}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>Không có thông báo</p>
            {filterType || searchQuery ? (
              <button 
                className="btn-link"
                onClick={handleClearFilters}
              >
                Xóa bộ lọc
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 0}
            onClick={() => fetchNotifications(currentPage - 1, filterType, searchQuery)}
          >
            ← Trước
          </button>

          <div className="page-info">
            Trang {currentPage + 1} / {totalPages}
          </div>

          <button
            className="page-btn"
            disabled={currentPage === totalPages - 1}
            onClick={() => fetchNotifications(currentPage + 1, filterType, searchQuery)}
          >
            Tiếp →
          </button>
        </div>
      )}

      {/* Info Section */}
      <div className="notification-info">
        <p>Tổng số thông báo: <strong>{totalElements}</strong></p>
        {unreadCount > 0 && (
          <p>Chưa đọc: <strong>{unreadCount}</strong></p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
