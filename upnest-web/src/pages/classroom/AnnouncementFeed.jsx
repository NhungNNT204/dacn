import React, { useState } from 'react';
import './AnnouncementFeed.css';

/**
 * AnnouncementFeed - Feed thông báo từ giáo viên
 * Hiển thị các thông báo, bài đăng từ giáo viên và học sinh
 */
export default function AnnouncementFeed({ classroom }) {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      author: {
        name: 'Nguyễn Minh Tuấn',
        role: 'Giáo viên',
        avatar: 'N',
        isTeacher: true
      },
      content: 'Thông báo: Buổi học chiều nay sẽ được dời sang 2:00 PM do sự cố kỹ thuật. Mong các em chuẩn bị sẵn sàng.',
      timestamp: '2 giờ trước',
      type: 'announcement',
      priority: 'high',
      icon: '📣',
      likes: 5,
      comments: 2
    },
    {
      id: 2,
      author: {
        name: 'Nguyễn Minh Tuấn',
        role: 'Giáo viên',
        avatar: 'N',
        isTeacher: true
      },
      content: '📚 Nội dung bài học hôm nay:\n\n✓ CSS Grid Layout\n✓ Flexbox Review\n✓ Responsive Design Project\n\nTài liệu đã upload trong mục "Tài liệu".',
      timestamp: '1 ngày trước',
      type: 'lesson',
      priority: 'normal',
      icon: '📚',
      likes: 12,
      comments: 4
    },
    {
      id: 3,
      author: {
        name: 'Trần Văn An',
        role: 'Học sinh',
        avatar: 'T',
        isTeacher: false
      },
      content: 'Em có câu hỏi: Làm thế nào để center một element bằng CSS Grid? Có nhiều cách không ạ?',
      timestamp: '3 giờ trước',
      type: 'question',
      priority: 'normal',
      icon: '❓',
      likes: 2,
      comments: 3
    },
    {
      id: 4,
      author: {
        name: 'Nguyễn Minh Tuấn',
        role: 'Giáo viên',
        avatar: 'N',
        isTeacher: true
      },
      content: 'Tuyệt vời! Có 4 cách phổ biến:\n\n1. place-items: center (đơn giản nhất)\n2. justify-items & align-items\n3. margin: auto\n4. inset: 0 & position absolute\n\nCác em có thể thử từng cách để hiểu hơn.',
      timestamp: '2 giờ 45 phút trước',
      type: 'reply',
      priority: 'normal',
      icon: '💬',
      likes: 8,
      comments: 1,
      isReply: true,
      replyTo: 3
    }
  ]);

  const [newAnnouncement, setNewAnnouncement] = useState('');

  const handlePostAnnouncement = (e) => {
    e.preventDefault();
    if (newAnnouncement.trim()) {
      const announcement = {
        id: announcements.length + 1,
        author: {
          name: 'Bạn',
          role: 'Học sinh',
          avatar: '👤',
          isTeacher: false
        },
        content: newAnnouncement,
        timestamp: 'Vừa xong',
        type: 'post',
        priority: 'normal',
        icon: '💬',
        likes: 0,
        comments: 0
      };
      setAnnouncements([announcement, ...announcements]);
      setNewAnnouncement('');
    }
  };

  const handleLike = (id) => {
    setAnnouncements(announcements.map(ann => {
      if (ann.id === id) {
        return { ...ann, likes: ann.likes + 1 };
      }
      return ann;
    }));
  };

  return (
    <div className="announcement-feed">
      {/* Create Announcement Section (for students) */}
      <div className="create-announcement">
        <div className="create-header">
          <div className="user-avatar">👤</div>
          <textarea
            className="announcement-textarea"
            placeholder="Bạn muốn nói gì với lớp...?"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            rows="3"
          />
        </div>
        <div className="create-actions">
          <button className="action-icon">📎</button>
          <button className="action-icon">😊</button>
          <button
            className="btn-post-announcement"
            onClick={handlePostAnnouncement}
            disabled={!newAnnouncement.trim()}
          >
            Đăng
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="announcements-list">
        {announcements.map(announcement => (
          <div
            key={announcement.id}
            className={`announcement-card ${announcement.type} ${announcement.priority}`}
          >
            {/* Priority Badge */}
            {announcement.priority === 'high' && (
              <div className="priority-badge">⚠️ Quan trọng</div>
            )}

            {/* Announcement Header */}
            <div className="announcement-header">
              <div className="author-info">
                <div className={`author-avatar ${announcement.author.isTeacher ? 'teacher' : ''}`}>
                  {announcement.author.avatar}
                </div>
                <div className="author-details">
                  <h4 className="author-name">
                    {announcement.author.name}
                    {announcement.author.isTeacher && <span className="teacher-badge">👨‍🏫</span>}
                  </h4>
                  <p className="author-role">{announcement.author.role}</p>
                  <p className="timestamp">{announcement.timestamp}</p>
                </div>
              </div>
              <div className="announcement-type-icon">{announcement.icon}</div>
            </div>

            {/* Announcement Content */}
            <div className="announcement-content">
              <p className="content-text">{announcement.content}</p>
            </div>

            {/* Announcement Stats */}
            <div className="announcement-stats">
              <span className="stat">👍 {announcement.likes} thích</span>
              <span className="stat">💬 {announcement.comments} bình luận</span>
            </div>

            {/* Announcement Actions */}
            <div className="announcement-actions">
              <button
                className="action-btn"
                onClick={() => handleLike(announcement.id)}
              >
                <span>👍</span>
                <span>Thích</span>
              </button>
              <button className="action-btn">
                <span>💬</span>
                <span>Bình luận</span>
              </button>
              {announcement.author.isTeacher && (
                <button className="action-btn">
                  <span>📌</span>
                  <span>Ghim</span>
                </button>
              )}
            </div>

            {/* Reply Section (if is reply) */}
            {announcement.isReply && (
              <div className="reply-indicator">
                ↳ Trả lời câu hỏi
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="load-more">
        <button className="btn-load-more">Xem thêm thông báo</button>
      </div>
    </div>
  );
}
