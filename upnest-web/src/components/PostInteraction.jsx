import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import './PostInteraction.css';

/**
 * Component: PostInteraction
 * Xử lý Like, Reactions, Comments, Share cho các bài đăng
 * Hỗ trợ kiểm soát từ giáo viên
 */
export default function PostInteraction({
  post = {},
  onReactionChange = () => {},
  onCommentClick = () => {},
  onShareClick = () => {},
  onDeletePost = () => {},
  isTeacher = false,
  canInteract = true
}) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const reactionPickerRef = useRef(null);
  const menuRef = useRef(null);

  const reactionEmojis = {
    like: { emoji: '👍', label: 'Thích', color: '#0084ff' },
    love: { emoji: '❤️', label: 'Yêu', color: '#f63e7e' },
    haha: { emoji: '😂', label: 'Haha', color: '#f7b731' },
    wow: { emoji: '😮', label: 'Wow', color: '#f7b731' },
    sad: { emoji: '😢', label: 'Buồn', color: '#f7b731' },
    angry: { emoji: '😠', label: 'Tức giận', color: '#e74c3c' },
    clap: { emoji: '👏', label: 'Tuyệt vời', color: '#0084ff' },
    thinking: { emoji: '🤔', label: 'Suy nghĩ', color: '#95a5a6' }
  };

  // Đóng reaction picker khi click ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target)) {
        setShowReactionPicker(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tính tổng reactions
  const totalReactions = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);

  // Lấy reaction top 3
  const topReactions = Object.entries(post.reactions || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => type);

  // Xử lý reaction
  const handleReactionClick = (reactionType) => {
    if (!canInteract) {
      return;
    }
    onReactionChange(post.id, reactionType);
    setShowReactionPicker(false);
  };

  // Xử lý like (shortcut)
  const handleLikeClick = () => {
    if (!canInteract) {
      return;
    }
    const isAlreadyLiked = post.userReaction === 'like';
    onReactionChange(post.id, isAlreadyLiked ? null : 'like');
  };

  return (
    <div className="post-interaction">
      {/* Reaction Stats */}
      {totalReactions > 0 && (
        <div className="reaction-stats">
          <div className="reaction-icons">
            {topReactions.map(type => (
              <span
                key={type}
                className="reaction-emoji"
                title={reactionEmojis[type]?.label}
              >
                {reactionEmojis[type]?.emoji}
              </span>
            ))}
          </div>
          <span className="reaction-count">{totalReactions} Phản ứng</span>
        </div>
      )}

      {/* Comments and Shares Count */}
      {(post.comments?.length > 0 || post.shares > 0) && (
        <div className="interaction-counts">
          {post.comments?.length > 0 && (
            <span className="count-item">
              💬 {post.comments.length} Bình luận
            </span>
          )}
          {post.shares > 0 && (
            <span className="count-item">
              🔗 {post.shares} Chia sẻ
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {canInteract && (
        <div className="interaction-actions">
          {/* Like/Reaction Button */}
          <div className="action-group" ref={reactionPickerRef}>
            <button
              className={`action-button like-button ${post.userReaction === 'like' ? 'active' : ''}`}
              onClick={handleLikeClick}
              title="Thích bài viết"
            >
              <Heart
                size={18}
                fill={post.userReaction === 'like' ? 'currentColor' : 'none'}
              />
              <span>Thích</span>
            </button>

            {/* Reaction Picker */}
            <div
              className={`reaction-picker ${showReactionPicker ? 'show' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="reaction-options">
                {Object.entries(reactionEmojis).map(([type, { emoji, label }]) => (
                  <button
                    key={type}
                    className={`reaction-option ${post.userReaction === type ? 'selected' : ''}`}
                    onClick={() => handleReactionClick(type)}
                    title={label}
                  >
                    <span className="reaction-emoji-large">{emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reaction Picker Toggle */}
            <button
              className="reaction-toggle"
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              title="Chọn cảm xúc"
            >
              <span className="emoji-hint">😊</span>
            </button>
          </div>

          {/* Comment Button */}
          <button
            className="action-button comment-button"
            onClick={() => onCommentClick(post.id)}
            title="Bình luận bài viết"
          >
            <MessageCircle size={18} />
            <span>Bình luận</span>
          </button>

          {/* Share Button */}
          <button
            className="action-button share-button"
            onClick={() => onShareClick(post.id)}
            title="Chia sẻ bài viết"
          >
            <Share2 size={18} />
            <span>Chia sẻ</span>
          </button>
        </div>
      )}

      {/* Teacher Controls */}
      {isTeacher && (
        <div className="teacher-controls" ref={menuRef}>
          <button
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
            title="Tùy chọn giáo viên"
          >
            <MoreHorizontal size={18} />
          </button>

          {showMenu && (
            <div className="teacher-menu">
              <button className="menu-item pin-button" title="Ghim bài viết">
                📌 Ghim bài viết
              </button>
              <button className="menu-item lock-button" title="Khóa bình luận">
                🔒 Khóa bình luận
              </button>
              <button
                className="menu-item delete-button"
                onClick={() => {
                  onDeletePost(post.id);
                  setShowMenu(false);
                }}
                title="Xóa bài viết"
              >
                🗑️ Xóa bài viết
              </button>
            </div>
          )}
        </div>
      )}

      {/* Disabled State Message */}
      {!canInteract && (
        <div className="interaction-disabled">
          <p>⛔ Tương tác bị vô hiệu hóa bởi giáo viên</p>
        </div>
      )}
    </div>
  );
}
