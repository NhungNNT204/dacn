import React, { useState, useEffect } from 'react';
import './NotificationItem.css';

/**
 * NotificationItem Component
 * Hiển thị item thông báo đơn lẻ
 */
const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete, 
  onNavigate 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleItemClick = () => {
    if (!notification.isRead) {
      onMarkAsRead?.(notification.id);
    }
    onNavigate?.(notification);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(notification.id);
  };

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    onMarkAsRead?.(notification.id);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      LIKE: '❤️',
      COMMENT: '💬',
      TAG: '🏷️',
      FOLLOW_REQUEST: '👥',
      FOLLOW: '👤',
      MENTION: '@',
      REMINDER: '⏰',
      MESSAGE: '✉️',
      GROUP_INVITE: '👫',
      DISCUSSION_REPLY: '🗨️',
      STORY_VIEW: '👁️',
      ACHIEVEMENT: '🏆'
    };
    return icons[type] || '📢';
  };

  const getNotificationColor = (type) => {
    const colors = {
      LIKE: '#ff4458',
      COMMENT: '#5865f2',
      TAG: '#faa61a',
      FOLLOW_REQUEST: '#43b581',
      FOLLOW: '#43b581',
      MENTION: '#9368e6',
      REMINDER: '#f26522',
      MESSAGE: '#00b894',
      GROUP_INVITE: '#6c5ce7',
      DISCUSSION_REPLY: '#5865f2',
      STORY_VIEW: '#fab1a0',
      ACHIEVEMENT: '#ffd700'
    };
    return colors[type] || '#5865f2';
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
    
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div
      className={`notification-item-wrapper ${!notification.isRead ? 'unread' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleItemClick}
    >
      {/* Avatar */}
      <div className="notification-item-avatar">
        {notification.senderAvatar ? (
          <img 
            src={notification.senderAvatar}
            alt={notification.senderName}
            className="avatar-img"
          />
        ) : (
          <div className="avatar-placeholder">
            {notification.senderName?.charAt(0) || 'N'}
          </div>
        )}
        <span 
          className="notification-type-badge"
          style={{ backgroundColor: getNotificationColor(notification.type) }}
        >
          {getNotificationIcon(notification.type)}
        </span>
      </div>

      {/* Content */}
      <div className="notification-item-content">
        <div className="notification-item-header">
          <h4 className="notification-item-title">
            {notification.title}
          </h4>
          <span className="notification-item-time">
            {formatTime(notification.createdAt)}
          </span>
        </div>

        {notification.message && (
          <p className="notification-item-message">
            {notification.message}
          </p>
        )}

        {notification.relatedImage && (
          <div className="notification-item-image">
            <img 
              src={notification.relatedImage}
              alt="Related content"
              className="related-img"
            />
          </div>
        )}

        <div className="notification-item-meta">
          <span className="notification-type-label">
            {notification.type}
          </span>
          {notification.relatedType && (
            <span className="notification-related-type">
              {notification.relatedType}
            </span>
          )}
        </div>
      </div>

      {/* Unread indicator */}
      {!notification.isRead && (
        <div className="unread-dot"></div>
      )}

      {/* Actions (show on hover) */}
      {isHovered && (
        <div className="notification-item-actions">
          {!notification.isRead && (
            <button 
              className="action-btn read-btn"
              title="Đánh dấu đã đọc"
              onClick={handleMarkAsRead}
            >
              ✓
            </button>
          )}
          <button 
            className="action-btn delete-btn"
            title="Xóa"
            onClick={handleDelete}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
