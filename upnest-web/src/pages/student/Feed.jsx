import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Users, Bookmark, Clock, Camera, Flame,
  Heart, MessageSquare, Share2, MoreVertical, ThumbsUp,
  Smile, X, Image as ImageIcon, Video, Send
} from 'lucide-react';
import './Feed.css';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('http://localhost:8080/api/v1/social/posts/feed?page=0&size=20', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data.data || []);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.log('Backend unavailable, using mock data');
    }

    // Mock data
    const mockPosts = [
      {
        id: 1,
        authorId: 2,
        authorName: 'GIẢNG VIÊN MINH THƯ',
        authorAvatar: 'MT',
        authorType: 'INSTRUCTOR',
        content: 'Chúc mừng bạn Nguyễn Huy đã hoàn thành xuất sắc đồ án cuối khóa Java Spring Boot! Lộ trình tiếp theo của em sẽ là Microservices nhé. 🚀✨',
        postType: 'IMAGE',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        hashtags: ['#JavaExpert', '#SuccessStory'],
        likeCount: 45,
        commentCount: 12,
        shareCount: 5,
        createdAt: '30 PHÚT TRƯỚC',
        privacy: 'CÔNG KHAI',
        userReaction: null
      },
      {
        id: 2,
        authorId: 3,
        authorName: 'TRẦN BÌNH',
        authorAvatar: 'TB',
        authorType: 'STUDENT',
        content: 'Mọi người có ai gặp lỗi 401 khi setup Spring Security với JWT không ạ? Mình đã cấu hình Filter nhưng vẫn chưa được...',
        postType: 'TEXT',
        hashtags: ['#HelpMe', '#SpringBoot'],
        likeCount: 12,
        commentCount: 45,
        shareCount: 5,
        createdAt: '2 GIỜ TRƯỚC',
        privacy: 'CÔNG KHAI',
        userReaction: null
      }
    ];
    setPosts(mockPosts);
    setIsLoading(false);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));

    if (imageFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...imageFiles]);
    }
    if (videoFiles.length > 0) {
      setSelectedVideo(videoFiles[0]);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedImages.length === 0 && !selectedVideo) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const postType = selectedVideo ? 'VIDEO' : (selectedImages.length > 0 ? 'IMAGE' : 'TEXT');
        const formData = new FormData();
        formData.append('content', postContent);
        formData.append('postType', postType);

        // TODO: Upload images/video to server and get URLs
        // For now, just create post with text
        const response = await fetch('http://localhost:8080/api/v1/social/posts/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: postContent,
            postType: postType.toLowerCase()
          })
        });

        if (response.ok) {
          setPostContent('');
          setSelectedImages([]);
          setSelectedVideo(null);
          loadFeed();
        }
      }
    } catch (error) {
      console.log('Error creating post');
    }
  };

  const handleReaction = async (postId, reactionType = 'LIKE') => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/react`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reactionType })
        });

        if (response.ok) {
          loadFeed();
        }
      }
    } catch (error) {
      console.log('Error adding reaction');
    }
  };

  const handleComment = async (postId) => {
    const commentContent = commentInputs[postId];
    if (!commentContent?.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/comments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: commentContent })
        });

        if (response.ok) {
          setCommentInputs(prev => ({ ...prev, [postId]: '' }));
          loadFeed();
        }
      }
    } catch (error) {
      console.log('Error adding comment');
    }
  };

  const handleShare = async (postId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/share`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ shareType: 'FEED', shareMessage: '' })
        });

        if (response.ok) {
          loadFeed();
        }
      }
    } catch (error) {
      console.log('Error sharing post');
    }
  };

  const getAuthorTypeLabel = (type) => {
    const labels = {
      'INSTRUCTOR': 'GIẢNG VIÊN',
      'STUDENT': 'HỌC VIÊN',
      'USER': 'NGƯỜI DÙNG'
    };
    return labels[type] || '';
  };

  const currentUser = {
    name: 'Huy',
    avatar: 'H'
  };

  return (
    <div className="feed-page">
      <div className="feed-container">
        {/* Left Sidebar */}
        <aside className="feed-sidebar-left">
          <nav className="sidebar-nav">
            <a href="#feed" className="nav-item active">
              <Globe size={20} />
              <span>Bảng tin chính</span>
            </a>
            <a href="#groups" className="nav-item">
              <Users size={20} />
              <span>Nhóm của tôi</span>
            </a>
            <a href="#saved" className="nav-item">
              <Bookmark size={20} />
              <span>Tài liệu đã lưu</span>
            </a>
            <a href="#events" className="nav-item">
              <Clock size={20} />
              <span>Sự kiện sắp tới</span>
            </a>
          </nav>

          <div className="group-shortcuts">
            <h3>LỐI TẮT NHÓM</h3>
            <div className="group-card">
              <div className="group-icon" style={{ background: '#6366f1' }}>⚛</div>
              <div className="group-info">
                <div className="group-name">Cộng đồng Reac...</div>
                <div className="group-members">1.2K THÀNH VIÊN</div>
              </div>
            </div>
            <div className="group-card">
              <div className="group-icon" style={{ background: '#ec4899' }}>🧠</div>
              <div className="group-info">
                <div className="group-name">UI/UX Design M...</div>
                <div className="group-members">850 THÀNH VIÊN</div>
              </div>
            </div>
            <div className="group-card">
              <div className="group-icon" style={{ background: '#ec4899' }}>⚙️</div>
              <div className="group-info">
                <div className="group-name">Luyện thuật toá...</div>
                <div className="group-members">2.4K THÀNH VIÊN</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="feed-main">
          {/* Create Post */}
          <div className="create-post-card">
            <div className="create-post-header">
              <div className="user-avatar">{currentUser.avatar}</div>
              <input
                type="text"
                className="create-post-input"
                placeholder={`${currentUser.name} ơi, bạn muốn chia sẻ kiến thức gì hôm nay?`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            {(selectedImages.length > 0 || selectedVideo) && (
              <div className="selected-media-preview">
                {selectedImages.map((img, idx) => (
                  <div key={idx} className="media-preview-item">
                    <img src={URL.createObjectURL(img)} alt="Preview" />
                    <button onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {selectedVideo && (
                  <div className="media-preview-item">
                    <video src={URL.createObjectURL(selectedVideo)} controls />
                    <button onClick={() => setSelectedVideo(null)}>
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="create-post-actions">
              <div className="media-options">
                <label className="media-option">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <ImageIcon size={18} color="#10b981" />
                  <span>ẢNH/VIDEO</span>
                </label>
                <label className="media-option">
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <Flame size={18} color="#ef4444" />
                  <span>THỬ THÁCH</span>
                </label>
              </div>
              <button className="post-btn" onClick={handleCreatePost}>
                ĐĂNG BÀI
              </button>
            </div>
          </div>

          {/* Posts Feed */}
          {isLoading ? (
            <div className="feed-loading">Đang tải...</div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-author">
                      <div className="author-avatar">{post.authorAvatar}</div>
                      <div className="author-info">
                        <div className="author-name-row">
                          <span className="author-name">{post.authorName}</span>
                          {post.authorType && (
                            <span className="author-type-badge">{getAuthorTypeLabel(post.authorType)}</span>
                          )}
                        </div>
                        <div className="post-meta">
                          <span>{post.createdAt}</span>
                          <span className="separator">·</span>
                          <Globe size={12} />
                          <span>{post.privacy}</span>
                        </div>
                      </div>
                    </div>
                    <button className="post-more-btn">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="post-content">
                    <p>{post.content}</p>
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="post-hashtags">
                        {post.hashtags.map((tag, idx) => (
                          <span key={idx} className="hashtag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {post.imageUrl && (
                    <div className="post-media">
                      <img src={post.imageUrl} alt="Post content" />
                    </div>
                  )}

                  <div className="post-stats">
                    <div className="reaction-icons">
                      <div className="reaction-icon" style={{ background: '#3b82f6' }}>👍</div>
                      <div className="reaction-icon" style={{ background: '#ef4444' }}>❤️</div>
                      <span>{post.likeCount} NGƯỜI ĐÃ THÍCH</span>
                    </div>
                    <div className="engagement-counts">
                      <span>{post.commentCount} BÌNH LUẬN</span>
                      <span className="separator">-</span>
                      <span>{post.shareCount} CHIA SẺ</span>
                    </div>
                  </div>

                  <div className="post-actions">
                    <div className="reaction-wrapper">
                      <button
                        className={`action-btn ${post.userReaction ? 'active' : ''}`}
                        onClick={() => handleReaction(post.id)}
                        onMouseEnter={() => setShowReactionPicker(post.id)}
                        onMouseLeave={() => setShowReactionPicker(null)}
                      >
                        <ThumbsUp size={18} />
                        <span>THÍCH</span>
                      </button>
                      {showReactionPicker === post.id && (
                        <div className="reaction-picker">
                          <button onClick={() => handleReaction(post.id, 'LIKE')}>👍</button>
                          <button onClick={() => handleReaction(post.id, 'LOVE')}>❤️</button>
                          <button onClick={() => handleReaction(post.id, 'HAHA')}>😂</button>
                          <button onClick={() => handleReaction(post.id, 'WOW')}>😮</button>
                          <button onClick={() => handleReaction(post.id, 'SAD')}>😢</button>
                          <button onClick={() => handleReaction(post.id, 'ANGRY')}>😡</button>
                        </div>
                      )}
                    </div>
                    <button
                      className="action-btn"
                      onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                    >
                      <MessageSquare size={18} />
                      <span>BÌNH LUẬN</span>
                    </button>
                    <button className="action-btn" onClick={() => handleShare(post.id)}>
                      <Share2 size={18} />
                      <span>CHIA SẺ</span>
                    </button>
                  </div>

                  {expandedComments[post.id] && (
                    <div className="post-comments">
                      <div className="comment-input-wrapper">
                        <div className="comment-avatar">{currentUser.avatar}</div>
                        <input
                          type="text"
                          className="comment-input"
                          placeholder="Viết bình luận..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                        />
                        <button className="comment-send-btn" onClick={() => handleComment(post.id)}>
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="feed-sidebar-right">
          {/* Leaderboard */}
          <div className="leaderboard-widget">
            <div className="widget-header">
              <div className="widget-title">
                <span>VINH DANH TUẦN</span>
                <div className="widget-icons">
                  <span>🏆</span>
                  <span>🔥</span>
                </div>
              </div>
            </div>
            <div className="leaderboard-list">
              <div className="leaderboard-item">
                <span className="rank">#1</span>
                <div className="user-avatar-small">M</div>
                <div className="user-info">
                  <div className="user-name">Minh Quân</div>
                  <div className="user-xp">4.2K XP</div>
                </div>
              </div>
              <div className="leaderboard-item">
                <span className="rank">#2</span>
                <div className="user-avatar-small">T</div>
                <div className="user-info">
                  <div className="user-name">Thanh Hương</div>
                  <div className="user-xp">3.8K XP</div>
                </div>
              </div>
              <div className="leaderboard-item highlighted">
                <span className="rank">#12</span>
                <div className="user-avatar-small">N</div>
                <div className="user-info">
                  <div className="user-name">Nguyễn Huy</div>
                  <div className="user-xp">1.4K XP</div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Connections */}
          <div className="suggestions-widget">
            <div className="widget-header">
              <div className="widget-title">
                <span>GỢI Ý KẾT NỐI</span>
                <span>🤝</span>
              </div>
            </div>
            <div className="suggestion-list">
              <div className="suggestion-item">
                <div className="user-avatar-small">P</div>
                <div className="user-info">
                  <div className="user-name">Phạm Th...</div>
                </div>
                <button className="connect-btn">Kết nối</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
