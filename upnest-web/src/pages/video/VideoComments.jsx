import React, { useState } from 'react';
import './VideoComments.css';

const VideoComments = ({ comments, onDeleteComment, onLikeComment }) => {
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyForms, setReplyForms] = useState({});

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const toggleReplyForm = (commentId) => {
    setReplyForms(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffTime = now - commentDate;
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return commentDate.toLocaleDateString('vi-VN');
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="comments-empty">
        <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
      </div>
    );
  }

  return (
    <div className="video-comments">
      {comments.map(comment => (
        <div key={comment.id} className="comment-thread">
          <div className="comment">
            <img 
              src={comment.authorAvatar || '/default-avatar.png'}
              alt={comment.authorName}
              className="comment-avatar"
            />
            
            <div className="comment-content">
              <div className="comment-header">
                <h4 className="comment-author">{comment.authorName}</h4>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                {comment.isEdited && (
                  <span className="edited-tag">(đã chỉnh sửa)</span>
                )}
              </div>

              <p className="comment-text">{comment.content}</p>

              <div className="comment-actions">
                <button 
                  className="comment-action-btn"
                  onClick={() => onLikeComment(comment.id)}
                >
                  <i className="icon-thumb-up"></i>
                  {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
                </button>

                <button 
                  className="comment-action-btn"
                  onClick={() => toggleReplyForm(comment.id)}
                >
                  <i className="icon-reply"></i>
                  Trả lời
                </button>

                {comment.parentCommentId === null && (
                  <button 
                    className="comment-action-btn"
                    onClick={() => toggleReplies(comment.id)}
                  >
                    <i className="icon-expand"></i>
                    Xem câu trả lời
                  </button>
                )}

                <button 
                  className="comment-action-btn danger"
                  onClick={() => onDeleteComment(comment.id)}
                  title="Xóa bình luận"
                >
                  <i className="icon-trash"></i>
                </button>
              </div>

              {/* Reply Form */}
              {replyForms[comment.id] && (
                <div className="reply-form">
                  <img 
                    src="/default-avatar.png"
                    alt="Your avatar"
                    className="reply-avatar"
                  />
                  <input
                    type="text"
                    placeholder="Viết trả lời..."
                    className="reply-input"
                  />
                  <button className="btn-post-reply">Đăng</button>
                </div>
              )}

              {/* Replies Section */}
              {expandedReplies[comment.id] && (
                <div className="replies-section">
                  <div className="reply-item">
                    <img 
                      src="/default-avatar.png"
                      alt="Tác giả"
                      className="reply-avatar"
                    />
                    <div className="reply-content">
                      <h5 className="reply-author">Tác giả video</h5>
                      <p className="reply-text">Cảm ơn bạn đã bình luận!</p>
                      <small className="reply-date">2 giờ trước</small>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoComments;
