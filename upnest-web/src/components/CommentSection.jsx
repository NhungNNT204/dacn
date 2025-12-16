import React, { useState, useRef } from 'react';
import { Send, Trash2, Edit2, Heart, MessageCircle, X } from 'lucide-react';
import './CommentSection.css';

/**
 * Component: CommentSection
 * Hiển thị bình luận và xử lý thêm/sửa/xóa bình luận
 */
export default function CommentSection({
  comments = [],
  onAddComment = () => {},
  onDeleteComment = () => {},
  onEditComment = () => {},
  onLikeComment = () => {},
  onAddReply = () => {},
  attachmentOptions = [],
  currentUserRole = 'Student'
}) {
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef(null);

  // Xử lý submit bình luận
  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment({
        content: commentText,
        attachedFiles: attachedFiles
      });
      setCommentText('');
      setAttachedFiles([]);
    }
  };

  // Xử lý thêm file
  const handleFileAttach = (files) => {
    setAttachedFiles([...attachedFiles, ...Array.from(files)]);
  };

  // Xử lý xóa file đính kèm
  const handleRemoveFile = (index) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  // Xử lý lưu chỉnh sửa
  const handleSaveEdit = (commentId) => {
    if (editingText.trim()) {
      onEditComment(commentId, editingText);
      setEditingCommentId(null);
      setEditingText('');
    }
  };

  // Xử lý submit reply
  const handleSubmitReply = (commentId) => {
    if (replyText.trim()) {
      onAddReply(commentId, replyText);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  // Kiểm tra xem user có quyền sửa/xóa không
  const canEditDelete = (comment) => {
    return currentUserRole === 'Teacher' || comment.author?.id === 'current_user';
  };

  return (
    <div className="comment-section">
      {/* Comment Input */}
      <div className="comment-input-area">
        <div className="comment-input-wrapper">
          <input
            type="text"
            className="comment-input"
            placeholder="Viết bình luận của bạn..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />

          {/* Attachment Button */}
          <button
            className="attachment-button"
            onClick={() => setShowAttachments(!showAttachments)}
            title="Đính kèm tệp"
          >
            📎
          </button>

          {/* Submit Button */}
          <button
            className="submit-comment-button"
            onClick={handleSubmitComment}
            disabled={!commentText.trim() && attachedFiles.length === 0}
            title="Gửi bình luận"
          >
            <Send size={16} />
          </button>
        </div>

        {/* Attachment Options */}
        {showAttachments && (
          <div className="attachment-options">
            <button
              className="attachment-option"
              onClick={() => fileInputRef.current?.click()}
            >
              📷 Hình ảnh
            </button>
            <button className="attachment-option">
              🎥 Video
            </button>
            <button className="attachment-option">
              📎 Tệp
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileAttach(e.target.files)}
            />
          </div>
        )}

        {/* Attached Files Preview */}
        {attachedFiles.length > 0 && (
          <div className="attached-files">
            {attachedFiles.map((file, index) => (
              <div key={index} className="file-tag">
                <span>{file.name}</span>
                <button
                  className="remove-file"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>Chưa có bình luận. Hãy là người đầu tiên!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              {/* Comment Header */}
              <div className="comment-header">
                <div className="comment-author">
                  <div className="avatar">{comment.author?.avatar}</div>
                  <div className="author-info">
                    <p className="author-name">{comment.author?.name}</p>
                    <p className="comment-time">
                      {new Date(comment.createdAt).toLocaleString('vi-VN')}
                      {comment.isEdited && <span className="edited-badge">(Đã chỉnh sửa)</span>}
                    </p>
                  </div>
                </div>

                {/* Comment Actions */}
                {canEditDelete(comment) && (
                  <div className="comment-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditingText(comment.content);
                      }}
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDeleteComment(comment.id)}
                      title="Xóa"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              <div className="comment-body">
                {editingCommentId === comment.id ? (
                  <div className="edit-form">
                    <textarea
                      className="edit-textarea"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className="edit-actions">
                      <button
                        className="save-btn"
                        onClick={() => handleSaveEdit(comment.id)}
                      >
                        💾 Lưu
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => setEditingCommentId(null)}
                      >
                        ❌ Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-content">{comment.content}</p>
                )}

                {/* Attached Media */}
                {comment.mediaIds && comment.mediaIds.length > 0 && (
                  <div className="comment-media">
                    {comment.mediaIds.map((mediaId, idx) => (
                      <div key={idx} className="media-item">
                        🖼️ Media: {mediaId}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comment Footer - Like and Reply */}
              <div className="comment-footer">
                <button
                  className={`footer-btn like-btn ${comment.userLiked ? 'liked' : ''}`}
                  onClick={() => onLikeComment(comment.id)}
                >
                  <Heart size={14} fill={comment.userLiked ? 'currentColor' : 'none'} />
                  <span>{comment.likes > 0 ? comment.likes : ''}</span>
                </button>
                <button
                  className="footer-btn reply-btn"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  <MessageCircle size={14} />
                  <span>Trả lời</span>
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="reply-form">
                  <input
                    type="text"
                    className="reply-input"
                    placeholder="Viết trả lời..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitReply(comment.id);
                      }
                    }}
                  />
                  <button
                    className="reply-submit"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyText.trim()}
                  >
                    <Send size={14} />
                  </button>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="replies-section">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="reply-item">
                      <div className="reply-header">
                        <div className="reply-author">
                          <div className="avatar small">{reply.author?.avatar}</div>
                          <div className="author-info">
                            <p className="author-name">{reply.author?.name}</p>
                            <p className="reply-time">
                              {new Date(reply.createdAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="reply-content">{reply.content}</p>
                      <button className="footer-btn reply-like-btn">
                        <Heart size={12} />
                        {reply.likes > 0 && <span>{reply.likes}</span>}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
