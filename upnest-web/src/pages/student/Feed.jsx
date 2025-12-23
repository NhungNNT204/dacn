import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Users, Bookmark, Clock, Camera, Flame,
  Heart, MessageSquare, Share2, MoreHorizontal, ThumbsUp,
  Smile, X, Image as ImageIcon, Video, Send, Trash2,
  EyeOff, Flag, UserPlus, AlertTriangle, Search, Sparkles, Plus
} from 'lucide-react';
import CreatePostModal from './components/CreatePostModal';
import './Feed.css';

/**
 * CẤU HÌNH KIỂM DUYỆT (CONTENT MODERATION)
 */
const BANNED_KEYWORDS = [
  "18+", "máu me", "kích động", "sexy", "bạo lực", "đồi trụy",
  "giết", "chết", "máu", "bạo lực", "đánh nhau", "chiến tranh",
  "sex", "tình dục", "khiêu dâm", "nude", "khỏa thân", "xxx"
];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState(null);
  const [comments, setComments] = useState({});
  const [moderationToast, setModerationToast] = useState(null);
  const [violationDetails, setViolationDetails] = useState(null);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [showReplies, setShowReplies] = useState({});
  const [showReplyInputs, setShowReplyInputs] = useState({});
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const menuRef = useRef(null);

  const currentUser = {
    id: 1,
    name: 'Nguyễn Thị Thùy Nhung',
    shortName: 'Nhung',
    avatar: 'N',
    role: 'Bạn'
  };

  useEffect(() => {
    loadFeed();
    loadOnlineFriends();
    loadTrendingTopics();
    
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowPostMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
          const formattedPosts = (data.data || []).map(post => ({
            ...post,
            isLiked: post.userReaction !== null,
            isSaved: false,
            comments: []
          }));
          setPosts(formattedPosts);
          
          // Load saved status for each post
          formattedPosts.forEach(post => checkIfSaved(post.id));
          
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
        authorColor: 'bg-indigo-600',
        content: 'Chúc mừng bạn Nguyễn nhung đã hoàn thành xuất sắc đồ án cuối khóa Java Spring Boot! Lộ trình tiếp theo của em sẽ là Microservices nhé. 🚀✨',
        postType: 'IMAGE',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        hashtags: ['#JavaExpert', '#SuccessStory'],
        likeCount: 45,
        commentCount: 12,
        shareCount: 5,
        createdAt: '30 PHÚT TRƯỚC',
        privacy: 'CÔNG KHAI',
        userReaction: null,
        isLiked: false
      },
      {
        id: 2,
        authorId: 3,
        authorName: 'TRẦN BÌNH',
        authorAvatar: 'TB',
        authorType: 'STUDENT',
        authorColor: 'bg-rose-500',
        content: 'Mọi người có ai gặp lỗi 401 khi setup Spring Security với JWT không ạ? Mình đã cấu hình Filter nhưng vẫn chưa được...',
        postType: 'TEXT',
        hashtags: ['#HelpMe', '#SpringBoot'],
        likeCount: 12,
        commentCount: 45,
        shareCount: 5,
        createdAt: '2 GIỜ TRƯỚC',
        privacy: 'CÔNG KHAI',
        userReaction: null,
        isLiked: true
      }
    ];
    setPosts(mockPosts);
    setIsLoading(false);
  };

  const loadOnlineFriends = async () => {
    // Mock online friends
    setOnlineFriends([
      { id: 1, name: 'Minh Quân', avatar: 'MQ', status: 'online' },
      { id: 2, name: 'Thanh Hương', avatar: 'TH', status: 'online' },
      { id: 3, name: 'Anh Tuấn', avatar: 'AT', status: 'offline' },
      { id: 4, name: 'Thùy Nhung', avatar: 'TN', status: 'online' }
    ]);
  };

  const loadTrendingTopics = async () => {
    setTrendingTopics([
      { tag: '#ReactJS_Mastery', count: 120 },
      { tag: '#BA_Requirement', count: 89 },
      { tag: '#Figma_Advanced', count: 67 }
    ]);
  };

  const loadComments = async (postId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/comments?page=0&size=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const commentsList = data.data || [];
          
          // Load replies cho mỗi comment (optional - có thể lazy load khi user click "Xem phản hồi")
          // for (const comment of commentsList) {
          //   if (comment.id) {
          //     await loadCommentReplies(postId, comment.id);
          //   }
          // }
          
          setComments(prev => ({ ...prev, [postId]: commentsList }));
          return;
        }
      }
    } catch (error) {
      console.log('Error loading comments');
    }
    
    // Mock comments
    setComments(prev => ({
      ...prev,
      [postId]: [
        {
          id: 1,
          userId: 2,
          userName: 'Anh Tuấn',
          userAvatar: 'AT',
          content: 'Bài giảng rất chi tiết ạ, em thắc mắc về phần deploy...',
          createdAt: '2 GIỜ TRƯỚC',
          likeCount: 5
        },
        {
          id: 2,
          userId: 3,
          userName: 'Thùy Linh',
          userAvatar: 'TL',
          content: 'Tài liệu rất hay, cảm ơn cô Minh Thư!',
          createdAt: 'HÔM QUA',
          likeCount: 3
        }
      ]
    }));
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

  const showModerationAlert = (message, violationData = null) => {
    setModerationToast(message);
    setViolationDetails(violationData);
    setTimeout(() => setModerationToast(null), 5000);
  };

  const checkContentModeration = (content) => {
    const lowerContent = content.toLowerCase();
    const foundViolation = BANNED_KEYWORDS.find(word => lowerContent.includes(word.toLowerCase()));
    return foundViolation;
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedImages.length === 0 && !selectedVideo) return;

    // Kiểm tra moderation ở frontend trước
    const violation = checkContentModeration(postContent);
    if (violation) {
      showModerationAlert(`Nội dung chứa từ khóa vi phạm "${violation}". Bài viết bị từ chối đăng theo tiêu chuẩn cộng đồng.`);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const postType = selectedVideo ? 'VIDEO' : (selectedImages.length > 0 ? 'IMAGE' : 'TEXT');
        
        const response = await fetch('http://localhost:8080/api/v1/social/posts/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: postContent,
            postType: postType.toLowerCase(),
            imageUrl: selectedImages.length > 0 ? URL.createObjectURL(selectedImages[0]) : null,
            videoUrl: selectedVideo ? URL.createObjectURL(selectedVideo) : null
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          // Backend moderation failed - có violation details
          if (data.violationType || data.details) {
            showModerationAlert(
              data.message || 'Nội dung vi phạm tiêu chuẩn cộng đồng. Vui lòng kiểm tra lại!',
              {
                message: data.message,
                violationType: data.violationType,
                foundKeywords: data.foundKeywords,
                details: data.details
              }
            );
          } else {
            showModerationAlert(data.message || 'Nội dung vi phạm tiêu chuẩn cộng đồng. Vui lòng kiểm tra lại!');
          }
          return;
        }

        // Success - Add to top of feed
        const newPost = {
          ...data.data,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorType: 'USER',
          authorColor: 'bg-indigo-700',
          isLiked: false,
          comments: [],
          createdAt: 'VỪA XONG'
        };
        setPosts([newPost, ...posts]);
        setPostContent('');
        setSelectedImages([]);
        setSelectedVideo(null);
      }
    } catch (error) {
      console.log('Error creating post');
      if (error.message && (error.message.includes('vi phạm') || error.message.includes('violation'))) {
        showModerationAlert('Nội dung vi phạm tiêu chuẩn cộng đồng. Vui lòng kiểm tra lại!');
      }
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
          const data = await response.json();
          // Update local state
          setPosts(posts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                isLiked: data.action === 'added',
                likeCount: data.action === 'added' ? p.likeCount + 1 : Math.max(0, p.likeCount - 1)
              };
            }
            return p;
          }));
        }
      }
    } catch (error) {
      console.log('Error adding reaction');
    }
  };

  const loadCommentReplies = async (postId, commentId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/comments/${commentId}/replies`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setComments(prev => {
            const newComments = { ...prev };
            if (newComments[postId]) {
              newComments[postId] = newComments[postId].map(comment => {
                if (comment.id === commentId) {
                  return { ...comment, replies: data.data || [] };
                }
                return comment;
              });
            }
            return newComments;
          });
        }
      }
    } catch (error) {
      console.log('Error loading comment replies');
    }
  };

  const handleComment = async (postId, parentCommentId = null) => {
    const inputKey = parentCommentId ? `${postId}_${parentCommentId}` : postId;
    const commentContent = commentInputs[inputKey];
    if (!commentContent?.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        let response;
        if (parentCommentId) {
          // Reply to comment
          response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/comments/${parentCommentId}/reply`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: commentContent })
          });
        } else {
          // New comment
          response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: commentContent })
          });
        }

        if (response.ok) {
          setCommentInputs(prev => ({ ...prev, [inputKey]: '' }));
          loadComments(postId);
          if (parentCommentId) {
            loadCommentReplies(parentCommentId);
          }
          loadFeed();
        }
      }
    } catch (error) {
      console.log('Error adding comment');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/comments/${commentId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setComments(prev => ({
            ...prev,
            [postId]: (prev[postId] || []).filter(c => c.id !== commentId)
          }));
          loadFeed();
        }
      }
    } catch (error) {
      console.log('Error deleting comment');
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

  const handleHidePost = async (postId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/hide`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setPosts(prev => prev.filter(p => p.id !== postId));
          setShowPostMenu(null);
        }
      }
    } catch (error) {
      console.log('Error hiding post');
    }
  };

  const handleReportPost = async (postId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/report`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reportType: 'INAPPROPRIATE',
            reason: 'Nội dung vi phạm tiêu chuẩn cộng đồng'
          })
        });

        if (response.ok) {
          alert('Đã báo cáo bài viết. Cảm ơn bạn đã giúp cải thiện cộng đồng!');
          setShowPostMenu(null);
        }
      }
    } catch (error) {
      console.log('Error reporting post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setPosts(prev => prev.filter(p => p.id !== postId));
          setShowPostMenu(null);
        }
      }
    } catch (error) {
      console.log('Error deleting post');
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const post = posts.find(p => p.id === postId);
        const isSaved = post?.isSaved;
        
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/save`, {
          method: isSaved ? 'DELETE' : 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setPosts(prev => prev.map(p => 
            p.id === postId ? { ...p, isSaved: !isSaved } : p
          ));
          setShowPostMenu(null);
        }
      }
    } catch (error) {
      console.log('Error saving post');
    }
  };

  const checkIfSaved = async (postId) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch(`http://localhost:8080/api/v1/social/posts/${postId}/is-saved`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(prev => prev.map(p => 
            p.id === postId ? { ...p, isSaved: data.isSaved } : p
          ));
        }
      }
    } catch (error) {
      console.log('Error checking if post is saved');
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => {
      const isExpanded = prev[postId];
      if (!isExpanded) {
        loadComments(postId);
      }
      return { ...prev, [postId]: !isExpanded };
    });
  };

  const getAuthorTypeLabel = (type) => {
    const labels = {
      'INSTRUCTOR': 'GIẢNG VIÊN',
      'STUDENT': 'HỌC VIÊN',
      'USER': 'NGƯỜI DÙNG'
    };
    return labels[type] || '';
  };

  const getAuthorColor = (type, defaultColor) => {
    if (defaultColor) return defaultColor;
    const colors = {
      'INSTRUCTOR': 'bg-indigo-600',
      'STUDENT': 'bg-rose-500',
      'USER': 'bg-indigo-700'
    };
    return colors[type] || 'bg-slate-600';
  };

  return (
    <div className="feed-page">
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        currentUser={currentUser}
        onPostCreated={() => {
          loadFeed();
          setPostContent('');
          setSelectedImages([]);
          setSelectedVideo(null);
        }}
        showModerationAlert={showModerationAlert}
      />

      {/* Moderation Toast */}
      {moderationToast && (
        <div className="moderation-toast">
          <div className="toast-icon-wrapper">
            <AlertTriangle size={24} strokeWidth={3} />
          </div>
          <div className="toast-content">
            <h4 className="toast-title">Cảnh báo tiêu chuẩn cộng đồng</h4>
            <p className="toast-message">{moderationToast}</p>
            <div className="toast-actions">
              <button onClick={() => setModerationToast(null)} className="toast-btn-understand">
                Đã hiểu
              </button>
              {violationDetails && (
                <button 
                  className="toast-btn-rules" 
                  onClick={() => {
                    setShowViolationModal(true);
                  }}
                >
                  Xem chi tiết
                </button>
              )}
            </div>
          </div>
          <button onClick={() => setModerationToast(null)} className="toast-close">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Violation Details Modal */}
      {showViolationModal && violationDetails && (
        <div className="modal-overlay" onClick={() => setShowViolationModal(false)}>
          <div className="modal-content violation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết vi phạm tiêu chuẩn cộng đồng</h3>
              <button className="modal-close" onClick={() => setShowViolationModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body violation-details">
              {violationDetails.foundKeywords && (
                <div className="violation-item">
                  <strong>Từ khóa vi phạm:</strong>
                  <span className="violation-keyword">{violationDetails.foundKeywords}</span>
                </div>
              )}
              {violationDetails.violationType && (
                <div className="violation-item">
                  <strong>Loại vi phạm:</strong>
                  <span className="violation-type">
                    {violationDetails.violationType === 'ADULT_CONTENT' && 'Nội dung 18+'}
                    {violationDetails.violationType === 'VIOLENCE' && 'Bạo lực/Kích động'}
                    {violationDetails.violationType === 'SPAM' && 'Spam/Quảng cáo'}
                    {violationDetails.violationType === 'HARASSMENT' && 'Quấy rối'}
                    {violationDetails.violationType === 'FRAUD' && 'Lừa đảo'}
                  </span>
                </div>
              )}
              {violationDetails.details && (
                <div className="violation-item full-width">
                  <strong>Mô tả chi tiết:</strong>
                  <div className="violation-description">
                    {violationDetails.details.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowViolationModal(false)}>
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

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
          {/* Create Post Button */}
          <section className="create-post-card">
            <button 
              className="create-post-trigger-btn"
              onClick={() => setShowCreatePostModal(true)}
            >
              <div className="create-post-trigger-content">
                <div className="user-avatar-small">{currentUser.avatar}</div>
                <span className="create-post-trigger-text">Nhung ơi, bạn muốn chia sẻ kiến thức gì hôm nay?</span>
                <Plus size={24} className="create-post-trigger-icon" />
              </div>
            </button>
          </section>

          {/* Posts Feed */}
          {isLoading ? (
            <div className="feed-loading">Đang tải...</div>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  {/* Header */}
                  <div className="post-header">
                    <div className="post-author">
                      <div className={`author-avatar ${getAuthorColor(post.authorType, post.authorColor)}`}>
                        {post.authorAvatar}
                      </div>
                      <div className="author-info">
                        <div className="author-name-row">
                          <h4 className="author-name">{post.authorName}</h4>
                          {post.authorType && post.authorType !== 'USER' && (
                            <span className="author-type-badge">{getAuthorTypeLabel(post.authorType)}</span>
                          )}
                        </div>
                        <div className="post-meta">
                          <Clock size={12} />
                          <span>{post.createdAt}</span>
                          <span className="separator">•</span>
                          <Globe size={12} />
                          <span>{post.privacy || 'CÔNG KHAI'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="post-menu-wrapper" ref={menuRef}>
                      <button 
                        className="post-more-btn"
                        onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                      >
                        <MoreHorizontal size={24} />
                      </button>
                      {showPostMenu === post.id && (
                        <div className="post-menu">
                          {post.authorId === currentUser.id ? (
                            <button className="menu-item danger" onClick={() => handleDeletePost(post.id)}>
                              <Trash2 size={16} />
                              <span>Xóa bài đăng</span>
                            </button>
                          ) : (
                            <>
                              <button className="menu-item" onClick={() => handleSavePost(post.id)}>
                                <Bookmark size={16} fill={post.isSaved ? 'currentColor' : 'none'} />
                                <span>{post.isSaved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}</span>
                              </button>
                              <button className="menu-item" onClick={() => handleHidePost(post.id)}>
                                <EyeOff size={16} />
                                <span>Ẩn bài viết</span>
                              </button>
                              <button className="menu-item danger" onClick={() => handleReportPost(post.id)}>
                                <Flag size={16} />
                                <span>Báo cáo vi phạm</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
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

                  {/* Media */}
                  {post.imageUrl && (
                    <div className="post-media">
                      <img src={post.imageUrl} alt="Post content" />
                    </div>
                  )}

                  {/* Stats */}
                  <div className="post-stats">
                    <div className="reaction-icons">
                      <div className="reaction-icon" style={{ background: '#ef4444' }}>❤️</div>
                      <div className="reaction-icon" style={{ background: '#3b82f6' }}>👍</div>
                      <span>{post.likeCount} người yêu thích</span>
                    </div>
                    <p className="engagement-count">{post.commentCount} bình luận</p>
                  </div>

                  {/* Actions */}
                  <div className="post-actions">
                    <button
                      className={`action-btn ${post.isLiked ? 'active' : ''}`}
                      onClick={() => handleReaction(post.id)}
                    >
                      <Heart size={22} fill={post.isLiked ? 'currentColor' : 'none'} />
                      <span>{post.isLiked ? 'Đã thích' : 'Thích'}</span>
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageSquare size={22} />
                      <span>Bình luận</span>
                    </button>
                    <button className="action-btn" onClick={() => handleShare(post.id)}>
                      <Share2 size={22} />
                      <span>Chia sẻ</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments[post.id] && (
                    <div className="post-comments">
                      <div className="comments-list">
                        {(comments[post.id] || []).map((comment) => {
                          const hasReplies = comment.replies && comment.replies.length > 0;
                          const replyKey = `${post.id}_${comment.id}`;
                          const isShowingReplies = showReplies[replyKey] || false;
                          const isShowingReplyInput = showReplyInputs[replyKey] || false;
                          const replyInputKey = `${post.id}_${comment.id}`;
                          
                          return (
                            <div key={comment.id} className="comment-item">
                              <div className="comment-avatar-small">{comment.userAvatar}</div>
                              <div className="comment-content-wrapper">
                                <div className="comment-content">
                                  <p className="comment-author">{comment.userName}</p>
                                  <p className="comment-text">{comment.content}</p>
                                  <div className="comment-actions">
                                    <button 
                                      className="comment-reply-btn"
                                      onClick={() => setShowReplyInputs(prev => ({ ...prev, [replyKey]: !prev[replyKey] }))}
                                    >
                                      Trả lời
                                    </button>
                                    {hasReplies && (
                                      <button 
                                        className="comment-view-replies-btn"
                                        onClick={() => {
                                          const newShowState = !isShowingReplies;
                                          setShowReplies(prev => ({ ...prev, [replyKey]: newShowState }));
                                          if (newShowState && (!comment.replies || comment.replies.length === 0)) {
                                            loadCommentReplies(post.id, comment.id);
                                          }
                                        }}
                                      >
                                        {isShowingReplies ? 'Ẩn' : 'Xem'} {comment.replies?.length || 0} phản hồi
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {comment.userId === currentUser.id && (
                                  <button 
                                    className="comment-delete-btn"
                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                              
                              {/* Reply Input */}
                              {isShowingReplyInput && (
                                <div className="comment-reply-input-wrapper">
                                  <div className="comment-avatar-small">{currentUser.avatar}</div>
                                  <div className="comment-reply-input-container">
                                    <input
                                      type="text"
                                      placeholder="Viết phản hồi..."
                                      value={commentInputs[replyInputKey] || ''}
                                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [replyInputKey]: e.target.value }))}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleComment(post.id, comment.id);
                                          setShowReplyInputs(prev => ({ ...prev, [replyKey]: false }));
                                        }
                                      }}
                                    />
                                    <button 
                                      className="comment-send-btn" 
                                      onClick={() => {
                                        handleComment(post.id, comment.id);
                                        setShowReplyInputs(prev => ({ ...prev, [replyKey]: false }));
                                      }}
                                    >
                                      <Send size={14} />
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              {/* Replies List */}
                              {isShowingReplies && hasReplies && (
                                <div className="comment-replies">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="comment-item reply-item">
                                      <div className="comment-avatar-small">{reply.userAvatar}</div>
                                      <div className="comment-content-wrapper">
                                        <div className="comment-content">
                                          <p className="comment-author">{reply.userName}</p>
                                          <p className="comment-text">{reply.content}</p>
                                        </div>
                                        {reply.userId === currentUser.id && (
                                          <button 
                                            className="comment-delete-btn"
                                            onClick={() => handleDeleteComment(post.id, reply.id)}
                                          >
                                            <X size={14} />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Comment Input */}
                      <div className="comment-input-wrapper">
                        <div className="comment-avatar">{currentUser.avatar}</div>
                        <div className="comment-input-container">
                          <input
                            type="text"
                            className="comment-input"
                            placeholder="Viết phản hồi..."
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                          />
                          <button className="comment-send-btn" onClick={() => handleComment(post.id)}>
                            <Send size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="feed-sidebar-right">
          {/* Online Friends */}
          <section className="online-friends-widget">
            <div className="widget-header">
              <h3 className="widget-title">
                <span>🤝 Đồng đội trực tuyến</span>
                <span className="online-indicator-large"></span>
              </h3>
            </div>
            <div className="online-friends-list">
              {onlineFriends.map((friend) => (
                <div key={friend.id} className="online-friend-item">
                  <div className="friend-avatar-wrapper">
                    <div className="friend-avatar">{friend.avatar}</div>
                    {friend.status === 'online' && <div className="online-indicator"></div>}
                  </div>
                  <div className="friend-info">
                    <p className="friend-name">{friend.name}</p>
                    <p className="friend-status">{friend.status === 'online' ? 'Đang học tập' : 'Vừa mới rời đi'}</p>
                  </div>
                  <button className="friend-message-btn">
                    <MessageSquare size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button className="view-all-friends-btn">Xem tất cả bạn bè →</button>
          </section>

          {/* Trending Topics */}
          <section className="trending-topics-widget">
            <h3 className="trending-title">Chủ đề thảo luận sôi nổi</h3>
            <div className="trending-topics-list">
              {trendingTopics.map((topic, idx) => (
                <div key={idx} className="trending-topic-item">
                  <p className="topic-tag">{topic.tag}</p>
                  <span className="topic-count">{topic.count} bài viết</span>
                </div>
              ))}
            </div>
          </section>

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
                  <div className="user-name">Nguyễn nhung</div>
                  <div className="user-xp">1.4K XP</div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
