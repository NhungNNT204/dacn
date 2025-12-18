import React, { useState, useEffect, useCallback } from 'react';
import './NotificationBell.css';

/**
 * NotificationBell Component
 * Hiển thị chuông thông báo với số lượng chưa đọc
 * Tích hợp WebSocket cho real-time updates
 */
const NotificationBell = ({ userId, onNotificationClick, notificationCount = 0 }) => {
  const [unreadCount, setUnreadCount] = useState(notificationCount);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
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
  }, []);

  // Fetch recent notifications
  const fetchRecentNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/social/notifications/recent/5`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching recent notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Setup WebSocket for real-time notifications
  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications/${userId}`;
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          // Increment unread count
          setUnreadCount(prev => prev + 1);
          // Show toast notification
          showNotificationToast(notification);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, reconnecting...');
        // Reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      return ws;
    };

    const ws = connectWebSocket();
    return () => ws?.close();
  }, [userId]);

  // Show notification toast
  const showNotificationToast = (notification) => {
    // Implementation tùy thuộc vào notification library bạn sử dụng
    console.log('New notification:', notification.title);
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      fetchRecentNotifications();
    }
  };

  const handleNotificationItemClick = (notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Navigate to related item
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/v1/social/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notification-bell-container">
      <div className="bell-icon-wrapper" onClick={handleBellClick}>
        <svg className="bell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Thông báo</h3>
            <button 
              className="close-btn"
              onClick={() => setShowDropdown(false)}
            >
              ✕
            </button>
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <div className="spinner"></div>
                <p>Đang tải...</p>
              </div>
            ) : recentNotifications.length > 0 ? (
              recentNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationItemClick(notification)}
                >
                  {notification.senderAvatar && (
                    <img 
                      src={notification.senderAvatar}
                      alt={notification.senderName}
                      className="notification-avatar"
                    />
                  )}
                  
                  <div className="notification-content">
                    <p className="notification-title">{notification.title}</p>
                    {notification.message && (
                      <p className="notification-message">{notification.message}</p>
                    )}
                    <span className="notification-time">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>

                  {!notification.isRead && (
                    <span className="unread-indicator"></span>
                  )}
                </div>
              ))
            ) : (
              <div className="notification-empty">
                <p>Không có thông báo</p>
              </div>
            )}
          </div>

          <div className="notification-footer">
            <a href="/notifications" className="view-all-link">
              Xem tất cả thông báo
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  return date.toLocaleDateString('vi-VN');
};

export default NotificationBell;
