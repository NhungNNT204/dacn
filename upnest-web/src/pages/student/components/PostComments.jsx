/**
 * Component: PostComments
 * Purpose: Quản lý comments - hiển thị, thêm, duyệt
 * Features: Comment list, add comment form, teacher moderation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Trash2, CheckCircle, XCircle } from 'lucide-react';
import postInteractionService, { REACTION_EMOJIS, COMMENT_STATUS } from '../../../services/postInteractionService';
import CommentItem from './CommentItem';
import '../styles/PostComments.css';

const PostComments = ({ postId, isTeacher = false, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  /**
   * Load comments
   */
  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await postInteractionService.getPostComments(postId);
      if (result.success) {
        // Filter: show approved comments to everyone, pending/rejected to author and teacher
        const filtered = result.data.filter(c =>
          c.status === COMMENT_STATUS.APPROVED ||
          isTeacher ||
          c.authorId === 'current-user'
        );
        setComments(filtered);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi khi tải bình luận');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [postId, isTeacher]);

  /**
   * Xử lý thêm comment
   */
  const handleAddComment = useCallback(async (e) => {
    e.preventDefault();

    if (!newCommentContent.trim()) {
      setError('Vui lòng nhập nội dung bình luận');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await postInteractionService.addComment(postId, {
        content: newCommentContent,
        attachments
      });

      if (result.success) {
        setComments([...comments, result.data]);
        setNewCommentContent('');
        setAttachments([]);
        setAttachmentPreview(null);
        onCommentAdded?.();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi khi gửi bình luận');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [postId, newCommentContent, attachments, comments, onCommentAdded]);

  /**
   * Xử lý xóa comment
   */
  const handleDeleteComment = useCallback(async (commentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      try {
        const result = await postInteractionService.deleteComment(postId, commentId);
        if (result.success) {
          setComments(comments.filter(c => c.id !== commentId));
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Lỗi khi xóa bình luận');
        console.error(err);
      }
    }
  }, [postId, comments]);

  /**
   * Xử lý duyệt comment (teacher)
   */
  const handleApproveComment = useCallback(async (commentId) => {
    try {
      const result = await postInteractionService.approveComment(postId, commentId);
      if (result.success) {
        setComments(comments.map(c =>
          c.id === commentId ? { ...c, status: COMMENT_STATUS.APPROVED } : c
        ));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Lỗi khi duyệt bình luận');
      console.error(err);
    }
  }, [postId, comments]);

  /**
   * Xử lý từ chối comment (teacher)
   */
  const handleRejectComment = useCallback(async (commentId) => {
    const reason = prompt('Lý do từ chối:');
    if (reason) {
      try {
        const result = await postInteractionService.rejectComment(postId, commentId, reason);
        if (result.success) {
          setComments(comments.map(c =>
            c.id === commentId ? { ...c, status: COMMENT_STATUS.REJECTED } : c
          ));
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Lỗi khi từ chối bình luận');
        console.error(err);
      }
    }
  }, [postId, comments]);

  /**
   * Xử lý đính kèm file
   */
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);

    // Show preview
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttachmentPreview({ type: 'image', url: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        setAttachmentPreview({ type: 'file', name: file.name });
      }
    }
  };

  return (
    <div className="post-comments">
      <div className="comments-header">
        <h4>Bình luận ({comments.filter(c => c.status === COMMENT_STATUS.APPROVED).length})</h4>
        {isTeacher && comments.some(c => c.status === COMMENT_STATUS.PENDING) && (
          <span className="pending-badge">
            {comments.filter(c => c.status === COMMENT_STATUS.PENDING).length} chờ duyệt
          </span>
        )}
      </div>

      {error && (
        <div className="comments-error">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Add Comment Form */}
      <form className="add-comment-form" onSubmit={handleAddComment}>
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          rows="2"
          disabled={isSubmitting}
        />

        {attachmentPreview && (
          <div className="attachment-preview">
            {attachmentPreview.type === 'image' && (
              <img src={attachmentPreview.url} alt="preview" />
            )}
            {attachmentPreview.type === 'file' && (
              <div className="file-preview">📎 {attachmentPreview.name}</div>
            )}
            <button
              type="button"
              onClick={() => {
                setAttachments([]);
                setAttachmentPreview(null);
              }}
              className="remove-attachment"
            >
              ×
            </button>
          </div>
        )}

        <div className="comment-actions">
          <input
            type="file"
            id="comment-attachment"
            onChange={handleAttachmentChange}
            hidden
            accept="image/*,.pdf,.doc,.docx"
          />
          <label htmlFor="comment-attachment" className="attach-btn" title="Đính kèm file">
            📎
          </label>

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || !newCommentContent.trim()}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {isLoading ? (
          <div className="comments-loading">Đang tải bình luận...</div>
        ) : comments.length === 0 ? (
          <div className="comments-empty">Chưa có bình luận nào</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`comment-wrapper ${comment.status}`}>
              <CommentItem
                comment={comment}
                postId={postId}
                isTeacher={isTeacher}
                onDelete={handleDeleteComment}
                onApprove={handleApproveComment}
                onReject={handleRejectComment}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostComments;
