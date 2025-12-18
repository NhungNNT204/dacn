/**
 * Component: PostCard
 * Purpose: Hiển thị bài đăng với Like/Reaction, Comments, Media
 * Features: Full interaction support, teacher moderation indicators
 */

import React, { useState, useCallback } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, Image, Video } from 'lucide-react';
import postInteractionService, { REACTION_EMOJIS } from '../../../services/postInteractionService';
import PostReactions from './PostReactions';
import PostComments from './PostComments';
import '../styles/PostCard.css';

const PostCard = ({ post, groupId, onPostDelete, isTeacher = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLoadingReaction, setIsLoadingReaction] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [postData, setPost] = useState(post);
  const [error, setError] = useState(null);

  // Tổng reactions
  const totalReactions = Object.values(postData.reactions).reduce((a, b) => a + b, 0);

  /**
   * Xử lý thêm reaction
   */
  const handleReaction = useCallback(async (reactionType) => {
    setIsLoadingReaction(true);
    try {
      let result;
      if (postData.userReaction === reactionType) {
        // Xóa reaction nếu click vào reaction đã có
        result = await postInteractionService.removePostReaction(postData.id);
      } else {
        // Thêm reaction mới
        result = await postInteractionService.addPostReaction(postData.id, reactionType);
      }

      if (result.success) {
        setPost(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi khi thêm reaction');
      console.error(err);
    } finally {
      setIsLoadingReaction(false);
    }
  }, [postData.id, postData.userReaction]);

  /**
   * Xử lý xóa bài đăng
   */
  const handleDeletePost = useCallback(async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) {
      try {
        const result = await postInteractionService.deletePost(postData.id);
        if (result.success) {
          onPostDelete?.(postData.id);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Lỗi khi xóa bài đăng');
        console.error(err);
      }
    }
  }, [postData.id, onPostDelete]);

  /**
   * Xử lý duyệt bài đăng (teacher)
   */
  const handleApprovePost = useCallback(async () => {
    try {
      const result = await postInteractionService.approvePost(postData.id);
      if (result.success) {
        setPost(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi khi duyệt bài đăng');
      console.error(err);
    }
  }, [postData.id]);

  /**
   * Xử lý từ chối bài đăng (teacher)
   */
  const handleRejectPost = useCallback(async () => {
    const reason = prompt('Lý do từ chối:');
    if (reason) {
      try {
        const result = await postInteractionService.rejectPost(postData.id, reason);
        if (result.success) {
          setPost(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Lỗi khi từ chối bài đăng');
        console.error(err);
      }
    }
  }, [postData.id]);

  /**
   * Xử lý chia sẻ bài đăng
   */
  const handleSharePost = useCallback(async () => {
    try {
      const result = await postInteractionService.sharePost(postData.id, groupId);
      if (result.success) {
        setPost(result.data);
        alert('Chia sẻ bài đăng thành công!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi khi chia sẻ bài đăng');
      console.error(err);
    }
  }, [postData.id, groupId]);

  return (
    <div className="post-card">
      {error && (
        <div className="post-error">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Header */}
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {postData.authorAvatar ? (
              <img src={postData.authorAvatar} alt={postData.authorName} />
            ) : (
              <div className="avatar-placeholder">{postData.authorName.charAt(0)}</div>
            )}
          </div>
          <div className="author-info">
            <h4>{postData.authorName}</h4>
            <time>{new Date(postData.createdAt).toLocaleString('vi-VN')}</time>
          </div>
        </div>

        {/* Moderation Status Badge */}
        {postData.isModerationPending && (
          <span className="moderation-badge pending">⏳ Chờ duyệt</span>
        )}
        {postData.status === 'rejected' && (
          <span className="moderation-badge rejected">❌ Bị từ chối</span>
        )}

        <button
          className="post-menu-btn"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="Post menu"
        >
          <MoreVertical size={20} />
        </button>

        {showMenu && (
          <div className="post-menu">
            {isTeacher && postData.isModerationPending && (
              <>
                <button onClick={handleApprovePost} className="menu-approve">
                  ✓ Duyệt
                </button>
                <button onClick={handleRejectPost} className="menu-reject">
                  ✕ Từ chối
                </button>
                <hr />
              </>
            )}
            {postData.authorId === 'current-user' && (
              <button onClick={handleDeletePost} className="menu-delete">
                🗑 Xóa
              </button>
            )}
          </div>
        )}
      </div>

      {/* Title and Content */}
      <div className="post-content">
        {postData.title && <h3>{postData.title}</h3>}
        <p>{postData.content}</p>
      </div>

      {/* Media Gallery */}
      {(postData.images?.length > 0 || postData.videos?.length > 0) && (
        <div className="post-media">
          {postData.images && postData.images.map((img) => (
            <div key={img.id} className="media-item image-item">
              <img
                src={img.url}
                alt={img.name}
                onClick={() => window.open(img.url, '_blank')}
              />
              <Image size={16} className="media-icon" />
            </div>
          ))}
          {postData.videos && postData.videos.map((vid) => (
            <div key={vid.id} className="media-item video-item">
              <div className="video-preview">
                <img
                  src={vid.thumbnail}
                  alt={vid.name}
                  onClick={() => window.open(vid.url, '_blank')}
                />
                <Video size={40} className="play-icon" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reactions Summary */}
      {totalReactions > 0 && (
        <div className="post-reactions-summary">
          <div className="reactions-icons">
            {Object.entries(postData.reactions).map(([type, count]) =>
              count > 0 && <span key={type} title={type}>{REACTION_EMOJIS[type]}</span>
            )}
          </div>
          <span className="reactions-count">{totalReactions} người</span>
        </div>
      )}

      {/* Stats */}
      <div className="post-stats">
        <span>{postData.commentCount} bình luận</span>
        <span>{postData.shareCount} lần chia sẻ</span>
      </div>

      {/* Actions */}
      <div className="post-actions">
        <PostReactions
          postId={postData.id}
          userReaction={postData.userReaction}
          onReaction={handleReaction}
          isLoading={isLoadingReaction}
        />

        <button
          className={`action-btn ${showComments ? 'active' : ''}`}
          onClick={() => setShowComments(!showComments)}
          title="Bình luận"
        >
          <MessageCircle size={20} />
          <span>Bình luận</span>
        </button>

        <button
          className="action-btn"
          onClick={handleSharePost}
          title="Chia sẻ"
        >
          <Share2 size={20} />
          <span>Chia sẻ</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <PostComments
          postId={postData.id}
          isTeacher={isTeacher}
          onCommentAdded={() => {
            // Cập nhật comment count
            setPost({ ...postData, commentCount: postData.commentCount + 1 });
          }}
        />
      )}
    </div>
  );
};

export default PostCard;
