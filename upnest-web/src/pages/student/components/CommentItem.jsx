/**
 * Component: CommentItem
 * Purpose: Hiển thị từng comment với reactions và moderation controls
 * Features: Reactions, delete, approve/reject, attachment preview
 */

import React, { useState, useRef, useEffect } from 'react';
import { Heart, Trash2, CheckCircle, XCircle, SmilePlus } from 'lucide-react';
import postInteractionService, { REACTION_EMOJIS, COMMENT_STATUS } from '../../../services/postInteractionService';
import '../styles/CommentItem.css';

const CommentItem = ({
  comment,
  postId,
  isTeacher = false,
  onDelete,
  onApprove,
  onReject
}) => {
  const [isLoadingReaction, setIsLoadingReaction] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [commentData, setCommentData] = useState(comment);
  const pickerRef = useRef(null);

  /**
   * Tổng reactions
   */
  const totalReactions = Object.values(commentData.reactions).reduce((a, b) => a + b, 0);

  /**
   * Xử lý thêm reaction cho comment
   */
  const handleReaction = async (reactionType) => {
    setIsLoadingReaction(true);
    try {
      const result = await postInteractionService.addCommentReaction(
        postId,
        commentData.id,
        reactionType
      );

      if (result.success) {
        setCommentData(result.data);
      }
    } catch (err) {
      console.error('Error adding reaction:', err);
    } finally {
      setIsLoadingReaction(false);
      setShowReactionPicker(false);
    }
  };

  /**
   * Đóng picker khi click bên ngoài
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowReactionPicker(false);
      }
    };

    if (showReactionPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showReactionPicker]);

  return (
    <div className="comment-item">
      {/* Comment Header */}
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar">
            {commentData.authorAvatar ? (
              <img src={commentData.authorAvatar} alt={commentData.authorName} />
            ) : (
              <div className="avatar-placeholder">
                {commentData.authorName.charAt(0)}
              </div>
            )}
          </div>
          <div className="author-meta">
            <strong>{commentData.authorName}</strong>
            <time>{new Date(commentData.createdAt).toLocaleString('vi-VN')}</time>
          </div>
        </div>

        {/* Status Badge */}
        {commentData.status === COMMENT_STATUS.PENDING && (
          <span className="status-badge pending">⏳ Chờ duyệt</span>
        )}
        {commentData.status === COMMENT_STATUS.REJECTED && (
          <span className="status-badge rejected">❌ Từ chối</span>
        )}
      </div>

      {/* Comment Content */}
      <div className="comment-body">
        <p>{commentData.content}</p>

        {/* Attachments */}
        {commentData.attachments && commentData.attachments.length > 0 && (
          <div className="comment-attachments">
            {commentData.attachments.map((attachment, idx) => (
              <div key={idx} className="attachment-item">
                {attachment.type?.startsWith('image') ? (
                  <img
                    src={attachment.url}
                    alt="attachment"
                    onClick={() => window.open(attachment.url, '_blank')}
                  />
                ) : (
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                    📎 {attachment.name}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment Reactions */}
      {totalReactions > 0 && (
        <div className="comment-reactions-summary">
          <span>
            {Object.entries(commentData.reactions).map(([type, count]) =>
              count > 0 && (
                <span key={type} className="reaction-tag" title={type}>
                  {REACTION_EMOJIS[type]} {count}
                </span>
              )
            )}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="comment-actions">
        {/* Reaction Button */}
        <div className="reaction-picker-wrapper" ref={pickerRef}>
          <button
            className="action-btn reaction-btn"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            disabled={isLoadingReaction}
            title="Thêm cảm xúc"
          >
            <SmilePlus size={16} />
          </button>

          {showReactionPicker && (
            <div className="reaction-picker-popup">
              {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
                <button
                  key={type}
                  className="reaction-option"
                  onClick={() => handleReaction(type)}
                  disabled={isLoadingReaction}
                  title={type}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete Button */}
        {commentData.authorId === 'current-user' && (
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(commentData.id)}
            title="Xóa bình luận"
          >
            <Trash2 size={16} />
          </button>
        )}

        {/* Teacher Moderation */}
        {isTeacher && commentData.status === COMMENT_STATUS.PENDING && (
          <>
            <button
              className="action-btn approve-btn"
              onClick={() => onApprove(commentData.id)}
              title="Duyệt"
            >
              <CheckCircle size={16} />
            </button>
            <button
              className="action-btn reject-btn"
              onClick={() => onReject(commentData.id)}
              title="Từ chối"
            >
              <XCircle size={16} />
            </button>
          </>
        )}
      </div>

      {/* Rejection Reason */}
      {commentData.status === COMMENT_STATUS.REJECTED && commentData.rejectionReason && (
        <div className="rejection-reason">
          <strong>Lý do từ chối:</strong> {commentData.rejectionReason}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
