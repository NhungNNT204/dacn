/**
 * Component: TeacherModerationDashboard
 * Purpose: Bảng điều khiển duyệt bài đăng và comments cho giáo viên
 * Features: Pending posts/comments list, approve/reject, stats
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, FileText, MessageSquare, RefreshCw } from 'lucide-react';
import postInteractionService from '../../../services/postInteractionService';
import '../styles/TeacherModerationDashboard.css';

const TeacherModerationDashboard = ({ groupId }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [pendingPosts, setPendingPosts] = useState([]);
  const [pendingComments, setPendingComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pendingPosts: 0,
    pendingComments: 0,
    approvedToday: 0,
    rejectedToday: 0
  });

  /**
   * Load pending posts and comments
   */
  useEffect(() => {
    loadModerationQueue();
    const interval = setInterval(loadModerationQueue, 30000); // Refresh mỗi 30s
    return () => clearInterval(interval);
  }, [groupId]);

  const loadModerationQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      const [postsResult, commentsResult] = await Promise.all([
        postInteractionService.getPendingPosts(groupId),
        postInteractionService.getPendingComments(groupId)
      ]);

      if (postsResult.success) {
        setPendingPosts(postsResult.data);
        setStats(s => ({ ...s, pendingPosts: postsResult.data.length }));
      }

      if (commentsResult.success) {
        setPendingComments(commentsResult.data);
        setStats(s => ({ ...s, pendingComments: commentsResult.data.length }));
      }
    } catch (err) {
      setError('Lỗi khi tải queue duyệt');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  /**
   * Duyệt bài đăng
   */
  const handleApprovePost = useCallback(async (postId) => {
    try {
      const result = await postInteractionService.approvePost(postId);
      if (result.success) {
        setPendingPosts(pendingPosts.filter(p => p.id !== postId));
        setStats(s => ({ ...s, pendingPosts: s.pendingPosts - 1, approvedToday: s.approvedToday + 1 }));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi khi duyệt bài đăng');
      console.error(err);
    }
  }, [pendingPosts]);

  /**
   * Từ chối bài đăng
   */
  const handleRejectPost = useCallback(async (postId) => {
    const reason = prompt('Lý do từ chối:');
    if (reason) {
      try {
        const result = await postInteractionService.rejectPost(postId, reason);
        if (result.success) {
          setPendingPosts(pendingPosts.filter(p => p.id !== postId));
          setStats(s => ({ ...s, pendingPosts: s.pendingPosts - 1, rejectedToday: s.rejectedToday + 1 }));
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Lỗi khi từ chối bài đăng');
        console.error(err);
      }
    }
  }, [pendingPosts]);

  /**
   * Duyệt comment
   */
  const handleApproveComment = useCallback(async (postId, commentId) => {
    try {
      const result = await postInteractionService.approveComment(postId, commentId);
      if (result.success) {
        setPendingComments(pendingComments.filter(c => c.id !== commentId));
        setStats(s => ({ ...s, pendingComments: s.pendingComments - 1, approvedToday: s.approvedToday + 1 }));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi khi duyệt bình luận');
      console.error(err);
    }
  }, [pendingComments]);

  /**
   * Từ chối comment
   */
  const handleRejectComment = useCallback(async (postId, commentId) => {
    const reason = prompt('Lý do từ chối:');
    if (reason) {
      try {
        const result = await postInteractionService.rejectComment(postId, commentId, reason);
        if (result.success) {
          setPendingComments(pendingComments.filter(c => c.id !== commentId));
          setStats(s => ({ ...s, pendingComments: s.pendingComments - 1, rejectedToday: s.rejectedToday + 1 }));
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Lỗi khi từ chối bình luận');
        console.error(err);
      }
    }
  }, [pendingComments]);

  return (
    <div className="moderation-dashboard">
      <div className="moderation-header">
        <h2>🛡 Bảng Điều Khiển Duyệt Nội Dung</h2>
        <button
          className="refresh-btn"
          onClick={loadModerationQueue}
          disabled={isLoading}
          title="Làm mới"
        >
          <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
        </button>
      </div>

      {error && (
        <div className="moderation-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingPosts}</div>
            <div className="stat-label">Bài chờ duyệt</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pendingComments}</div>
            <div className="stat-label">Bình luận chờ</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon approved">✓</div>
          <div className="stat-content">
            <div className="stat-value">{stats.approvedToday}</div>
            <div className="stat-label">Đã duyệt hôm nay</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rejected">✕</div>
          <div className="stat-content">
            <div className="stat-value">{stats.rejectedToday}</div>
            <div className="stat-label">Đã từ chối</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="moderation-tabs">
        <button
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          <FileText size={18} />
          <span>Bài Đăng ({stats.pendingPosts})</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
          <MessageSquare size={18} />
          <span>Bình Luận ({stats.pendingComments})</span>
        </button>
      </div>

      {/* Content */}
      <div className="moderation-content">
        {isLoading ? (
          <div className="moderation-loading">Đang tải...</div>
        ) : activeTab === 'posts' ? (
          <div className="pending-posts-list">
            {pendingPosts.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} />
                <p>Không có bài đăng nào chờ duyệt</p>
              </div>
            ) : (
              pendingPosts.map(post => (
                <div key={post.id} className="pending-item post-item">
                  <div className="pending-item-header">
                    <div className="pending-item-meta">
                      <h4>{post.authorName}</h4>
                      <time>{new Date(post.createdAt).toLocaleString('vi-VN')}</time>
                    </div>
                    {post.title && <h5 className="post-title">{post.title}</h5>}
                  </div>

                  <div className="pending-item-body">
                    <p className="post-content">{post.content}</p>

                    {/* Media Preview */}
                    {(post.images?.length > 0 || post.videos?.length > 0) && (
                      <div className="media-thumbnail-grid">
                        {post.images?.map(img => (
                          <img
                            key={img.id}
                            src={img.url}
                            alt="preview"
                            className="media-thumbnail"
                          />
                        ))}
                        {post.videos?.map(vid => (
                          <div key={vid.id} className="video-thumbnail">
                            <video src={vid.url} muted />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pending-item-actions">
                    <button
                      className="action-approve"
                      onClick={() => handleApprovePost(post.id)}
                      title="Duyệt"
                    >
                      <CheckCircle size={18} />
                      <span>Duyệt</span>
                    </button>
                    <button
                      className="action-reject"
                      onClick={() => handleRejectPost(post.id)}
                      title="Từ chối"
                    >
                      <XCircle size={18} />
                      <span>Từ chối</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="pending-comments-list">
            {pendingComments.length === 0 ? (
              <div className="empty-state">
                <MessageSquare size={48} />
                <p>Không có bình luận nào chờ duyệt</p>
              </div>
            ) : (
              pendingComments.map(comment => (
                <div key={comment.id} className="pending-item comment-item">
                  <div className="pending-item-header">
                    <div className="pending-item-meta">
                      <h4>{comment.authorName}</h4>
                      <time>{new Date(comment.createdAt).toLocaleString('vi-VN')}</time>
                      <span className="post-id">Bài: {comment.postId}</span>
                    </div>
                  </div>

                  <div className="pending-item-body">
                    <p className="comment-content">{comment.content}</p>
                  </div>

                  <div className="pending-item-actions">
                    <button
                      className="action-approve"
                      onClick={() => handleApproveComment(comment.postId, comment.id)}
                      title="Duyệt"
                    >
                      <CheckCircle size={18} />
                      <span>Duyệt</span>
                    </button>
                    <button
                      className="action-reject"
                      onClick={() => handleRejectComment(comment.postId, comment.id)}
                      title="Từ chối"
                    >
                      <XCircle size={18} />
                      <span>Từ chối</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherModerationDashboard;
