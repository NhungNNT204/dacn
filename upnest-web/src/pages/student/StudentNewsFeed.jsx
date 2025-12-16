import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import './StudentNewsFeed.css';

/**
 * StudentNewsFeed - Mạng xã hội giáo dục kiểu Facebook
 * Hiển thị các bài đăng, trạng thái, bài viết từ các bạn học
 */
export default function StudentNewsFeed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Nguyễn Anh',
        avatar: 'NA',
        role: 'Student',
        timestamp: '2 giờ trước',
        verified: false
      },
      type: 'status',
      content: 'Vừa hoàn thành project CSS Grid! 🎉 Rất hài lòng với kết quả. Cảm ơn các bạn đã giúp đỡ!',
      image: null,
      likes: 24,
      comments: 5,
      shares: 2,
      liked: false,
      class: 'Web Development 101',
      tags: ['#CSS', '#GridLayout', '#FrontEnd']
    },
    {
      id: 2,
      author: {
        name: 'Lê Thảo',
        avatar: 'LT',
        role: 'Student',
        timestamp: '4 giờ trước',
        verified: false
      },
      type: 'question',
      content: 'Ai có thể giải thích cách hoạt động của JavaScript async/await? Mình đang bị mắc kẹt 😅',
      image: null,
      likes: 12,
      comments: 8,
      shares: 0,
      liked: false,
      class: 'JavaScript Advanced',
      tags: ['#JavaScriptQuestion', '#AsyncAwait']
    },
    {
      id: 3,
      author: {
        name: 'Mạnh Hùng',
        avatar: 'MH',
        role: 'Student',
        timestamp: '6 giờ trước',
        verified: false
      },
      type: 'achievement',
      content: 'Vừa đạt điểm 10 trong bài kiểm tra React! 🏆 Quá vui vì bài học cuối cùng đã hiểu rõ hơn.',
      image: null,
      likes: 45,
      comments: 12,
      shares: 3,
      liked: false,
      class: 'React Fundamentals',
      tags: ['#Achievement', '#React', '#Success']
    },
    {
      id: 4,
      author: {
        name: 'Chị Linh Mentor',
        avatar: 'CL',
        role: 'Mentor',
        timestamp: '8 giờ trước',
        verified: true
      },
      type: 'blog',
      content: 'Bài viết: 5 Thói quen của lập trình viên giỏi 📝\n\n1. Viết code sạch và dễ đọc\n2. Sử dụng version control\n3. Viết unit tests...',
      image: null,
      likes: 89,
      comments: 23,
      shares: 15,
      liked: false,
      class: 'General',
      tags: ['#Blog', '#CareerTips', '#Programming']
    },
    {
      id: 5,
      author: {
        name: 'Trân Hằng',
        avatar: 'TH',
        role: 'Student',
        timestamp: '10 giờ trước',
        verified: false
      },
      type: 'study-resource',
      content: 'Chia sẻ note học tập về Flexbox CSS. Bao gồm các ví dụ thực tế và mẹo hay.',
      image: null,
      likes: 34,
      comments: 7,
      shares: 8,
      liked: false,
      class: 'CSS Mastery',
      tags: ['#StudyMaterial', '#CSS', '#Flexbox', '#Resource']
    }
  ]);

  const [filters, setFilters] = useState('all');

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const getPostIcon = (type) => {
    switch(type) {
      case 'status': return '💭';
      case 'question': return '❓';
      case 'achievement': return '🏆';
      case 'blog': return '📝';
      case 'study-resource': return '📚';
      default: return '📌';
    }
  };

  const getPostLabel = (type) => {
    switch(type) {
      case 'status': return 'Trạng thái';
      case 'question': return 'Câu hỏi';
      case 'achievement': return 'Thành tích';
      case 'blog': return 'Bài viết';
      case 'study-resource': return 'Tài liệu học';
      default: return 'Bài đăng';
    }
  };

  const filteredPosts = filters === 'all' 
    ? posts 
    : posts.filter(post => post.type === filters);

  return (
    <div className="student-news-feed">
      {/* Sidebar - Về bạn */}
      <aside className="feed-sidebar">
        <div className="sidebar-card">
          <div className="user-cover"></div>
          <div className="user-info">
            <div className="user-avatar-large">NH</div>
            <h3>Nguyễn Hồng</h3>
            <p className="user-class">Lớp: Web Development 101</p>
            <p className="user-stats">
              <strong>156</strong> Kết nối | <strong>24</strong> Bài viết
            </p>
          </div>
        </div>

        <div className="sidebar-card">
          <h4>🎓 Các lớp học của bạn</h4>
          <div className="classes-list">
            <div className="class-item">
              <span className="class-badge">WD</span>
              <span>Web Dev 101</span>
            </div>
            <div className="class-item">
              <span className="class-badge">JS</span>
              <span>JavaScript Advanced</span>
            </div>
            <div className="class-item">
              <span className="class-badge">RC</span>
              <span>React Fundamentals</span>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <h4>🔥 Thịnh hành hôm nay</h4>
          <div className="trending-list">
            <div className="trending-item">
              <span className="trending-icon">💡</span>
              <div className="trending-content">
                <p className="trending-title">#WebDevelopment</p>
                <p className="trending-count">2.5K Bài viết</p>
              </div>
            </div>
            <div className="trending-item">
              <span className="trending-icon">⚛️</span>
              <div className="trending-content">
                <p className="trending-title">#React</p>
                <p className="trending-count">1.8K Bài viết</p>
              </div>
            </div>
            <div className="trending-item">
              <span className="trending-icon">🎨</span>
              <div className="trending-content">
                <p className="trending-title">#DesignTips</p>
                <p className="trending-count">956 Bài viết</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="feed-main">
        {/* Filter Tabs */}
        <div className="feed-filters">
          <button 
            className={`filter-tab ${filters === 'all' ? 'active' : ''}`}
            onClick={() => setFilters('all')}
          >
            📰 Tất cả
          </button>
          <button 
            className={`filter-tab ${filters === 'status' ? 'active' : ''}`}
            onClick={() => setFilters('status')}
          >
            💭 Trạng thái
          </button>
          <button 
            className={`filter-tab ${filters === 'question' ? 'active' : ''}`}
            onClick={() => setFilters('question')}
          >
            ❓ Câu hỏi
          </button>
          <button 
            className={`filter-tab ${filters === 'blog' ? 'active' : ''}`}
            onClick={() => setFilters('blog')}
          >
            📝 Bài viết
          </button>
        </div>

        {/* Posts Feed */}
        <div className="posts-container">
          {filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              {/* Post Header */}
              <div className="post-header">
                <div className="post-author">
                  <div className={`post-avatar ${post.author.role.toLowerCase()}`}>
                    {post.author.avatar}
                  </div>
                  <div className="post-author-info">
                    <div className="post-author-name">
                      {post.author.name}
                      {post.author.verified && <span className="verified-badge">✓</span>}
                    </div>
                    <div className="post-meta">
                      <span className="post-role">{post.author.role}</span>
                      <span className="post-timestamp">• {post.author.timestamp}</span>
                    </div>
                  </div>
                </div>
                <button className="post-options">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Post Type Badge */}
              <div className="post-type-badge">
                <span className="post-type-icon">{getPostIcon(post.type)}</span>
                <span className="post-type-label">{getPostLabel(post.type)}</span>
              </div>

              {/* Post Content */}
              <div className="post-content">
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="Post content" />}
              </div>

              {/* Post Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              )}

              {/* Post Stats */}
              <div className="post-stats">
                <span className="stat">👍 {post.likes} Người thích</span>
                <span className="stat">💬 {post.comments} Bình luận</span>
                <span className="stat">🔗 {post.shares} Chia sẻ</span>
              </div>

              {/* Post Class */}
              <div className="post-class">
                <span className="class-tag">📚 {post.class}</span>
              </div>

              {/* Post Actions */}
              <div className="post-actions">
                <button 
                  className={`action-button ${post.liked ? 'liked' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <Heart size={18} />
                  <span>Thích</span>
                </button>
                <button className="action-button">
                  <MessageCircle size={18} />
                  <span>Bình luận</span>
                </button>
                <button className="action-button">
                  <Share2 size={18} />
                  <span>Chia sẻ</span>
                </button>
              </div>

              {/* Comments Preview */}
              {post.comments > 0 && (
                <div className="comments-preview">
                  <div className="comment">
                    <div className="comment-avatar">LT</div>
                    <div className="comment-content">
                      <p><strong>Lê Thảo</strong></p>
                      <p>Quá tuyệt vời! Cộng tác viên tuyệt vời ở đây! 🌟</p>
                    </div>
                  </div>
                  <button className="view-more-comments">Xem tất cả {post.comments} bình luận</button>
                </div>
              )}
            </div>
          ))}

          {/* No Posts Message */}
          {filteredPosts.length === 0 && (
            <div className="no-posts">
              <div className="no-posts-icon">📭</div>
              <p>Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Suggestions */}
      <aside className="feed-suggestions">
        <div className="sidebar-card">
          <h4>👥 Gợi ý bạn bè</h4>
          <div className="suggestions-list">
            <div className="suggestion-item">
              <div className="suggestion-avatar">VP</div>
              <div className="suggestion-info">
                <p className="suggestion-name">Văn Phúc</p>
                <p className="suggestion-mutual">3 bạn chung</p>
              </div>
              <button className="suggest-button">+</button>
            </div>
            <div className="suggestion-item">
              <div className="suggestion-avatar">MN</div>
              <div className="suggestion-info">
                <p className="suggestion-name">Minh Nhi</p>
                <p className="suggestion-mutual">5 bạn chung</p>
              </div>
              <button className="suggest-button">+</button>
            </div>
            <div className="suggestion-item">
              <div className="suggestion-avatar">TT</div>
              <div className="suggestion-info">
                <p className="suggestion-name">Tuấn Tú</p>
                <p className="suggestion-mutual">2 bạn chung</p>
              </div>
              <button className="suggest-button">+</button>
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <h4>📅 Sự kiện sắp tới</h4>
          <div className="events-list">
            <div className="event-item">
              <div className="event-date">20/12</div>
              <p className="event-title">Hội thảo React</p>
            </div>
            <div className="event-item">
              <div className="event-date">25/12</div>
              <p className="event-title">Thi kiểm tra cuối kỳ</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
