import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Heart } from 'lucide-react';
import { getPostComments, addComment, addReaction } from '../../../services/feedService';
import '../styles/CommentSection.css';

/**
 * CommentSection - Modal hiển thị bình luận chi tiết
 */
export default function CommentSection({ postId, onClose }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    
    useEffect(() => {
        loadComments();
    }, [postId]);
    
    const loadComments = async () => {
        setLoading(true);
        try {
            const response = await getPostComments(postId, 0, 10);
            if (response.success) {
                setComments(response.data);
                setPage(0);
                setHasMore(response.totalPages > 1);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        try {
            const result = await addComment(postId, newComment.trim());
            if (result.success) {
                setComments([result.data, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };
    
    const handleLoadMore = async () => {
        const nextPage = page + 1;
        try {
            const response = await getPostComments(postId, nextPage, 10);
            if (response.success) {
                setComments([...comments, ...response.data]);
                setPage(nextPage);
                setHasMore(nextPage < response.totalPages);
            }
        } catch (error) {
            console.error('Error loading more comments:', error);
        }
    };
    
    return (
        <div className="comment-section-modal">
            <div className="comment-section-overlay" onClick={onClose}></div>
            <div className="comment-section-content">
                {/* Header */}
                <div className="comment-header">
                    <h2>Bình luận</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                
                {/* Comments List */}
                <div className="comments-list">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="no-comments">
                            <p>Chưa có bình luận nào</p>
                        </div>
                    ) : (
                        <>
                            {comments.map(comment => (
                                <div key={comment.id} className="comment-item">
                                    <img src={comment.userAvatar} alt={comment.userName} className="comment-avatar" />
                                    <div className="comment-body">
                                        <div className="comment-header-info">
                                            <span className="comment-author">{comment.userName}</span>
                                            <span className="comment-time">
                                                {new Date(comment.createdAt).toLocaleTimeString('vi-VN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.content}</p>
                                        {comment.imageUrl && (
                                            <img src={comment.imageUrl} alt="comment" className="comment-image" />
                                        )}
                                        <div className="comment-actions">
                                            <button className="comment-action">
                                                <Heart size={14} /> Thích ({comment.likeCount})
                                            </button>
                                            <button className="comment-action">
                                                <MessageCircle size={14} /> Trả lời
                                            </button>
                                        </div>
                                        {/* Replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="comment-replies">
                                                {comment.replies.map(reply => (
                                                    <div key={reply.id} className="reply-item">
                                                        <img src={reply.userAvatar} alt={reply.userName} className="reply-avatar" />
                                                        <div className="reply-body">
                                                            <div className="reply-header">
                                                                <span className="reply-author">{reply.userName}</span>
                                                                <span className="reply-time">
                                                                    {new Date(reply.createdAt).toLocaleTimeString('vi-VN', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                            <p className="reply-text">{reply.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {hasMore && (
                                <button className="load-more-btn" onClick={handleLoadMore}>
                                    Xem thêm bình luận
                                </button>
                            )}
                        </>
                    )}
                </div>
                
                {/* Input */}
                <div className="comment-input-section">
                    <input
                        type="text"
                        placeholder="Viết bình luận..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleAddComment();
                            }
                        }}
                        className="comment-input"
                    />
                    <button
                        className="comment-submit-btn"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
}
