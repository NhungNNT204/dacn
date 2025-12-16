// src/pages/classroom/AnnouncementFeedWithInteractions.jsx
// Announcement Feed với tích hợp đầy đủ hệ thống tương tác cộng đồng

import React, { useState, useCallback, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import PostInteraction from '../../components/PostInteraction';
import CommentSection from '../../components/CommentSection';
import MediaUpload from '../../components/MediaUpload';
import { usePermissions } from '../../utils/rolePermissions';
import { usePostInteractions } from '../../hooks/usePostInteractions';
import postInteractionService from '../../services/postInteractionService';
import './AnnouncementFeedWithInteractions.css';

/**
 * Hiển thị danh sách bài viết/thông báo lớp học
 * Với đầy đủ hệ thống reactions, comments, media sharing và teacher controls
 */
const AnnouncementFeedWithInteractions = ({ classId, currentUser }) => {
  // State management
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPostForMedia, setSelectedPostForMedia] = useState(null);

  // Permission checker
  const permissions = usePermissions(currentUser?.role, currentUser?.id);

  // Load mock data
  useEffect(() => {
    loadAnnouncements();
  }, [classId]);

  const loadAnnouncements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data - replace with actual API call
      const mockAnnouncements = [
        {
          id: '1',
          author: {
            id: 'teacher1',
            name: 'Thầy Trần Văn A',
            role: 'TEACHER',
            avatar: 'TA',
          },
          title: 'Thông báo về kỳ thi giữa kỳ',
          content: 'Kỳ thi giữa kỳ sẽ diễn ra vào ngày 15 tháng 10. Tất cả học sinh cần chuẩn bị tốt.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          reactions: {
            LIKE: ['student1', 'student2'],
            LOVE: ['student3'],
            WOW: [],
            HAHA: [],
            SAD: [],
            ANGRY: [],
            CLAP: ['teacher1'],
            THINKING: [],
          },
          userReaction: null,
          comments: [
            {
              id: 'comment1',
              author: {
                id: 'student1',
                name: 'Nguyễn Văn B',
                role: 'STUDENT',
                avatar: 'NB',
              },
              content: 'Cảm ơn thầy vì thông báo này',
              timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
              likes: ['student2'],
              userLiked: false,
              replies: [
                {
                  id: 'reply1',
                  author: {
                    id: 'teacher1',
                    name: 'Thầy Trần Văn A',
                    role: 'TEACHER',
                    avatar: 'TA',
                  },
                  content: 'Không có gì. Hãy chuẩn bị kỹ lưỡng nhé!',
                  timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                  likes: ['student1', 'student2'],
                  userLiked: false,
                },
              ],
              mediaIds: [],
              isEdited: false,
            },
          ],
          mediaIds: [],
          isPinned: false,
          isCommentLocked: false,
          disabledInteractions: false,
          classId,
        },
        {
          id: '2',
          author: {
            id: 'student2',
            name: 'Phạm Thị C',
            role: 'STUDENT',
            avatar: 'PC',
          },
          title: 'Câu hỏi về bài học hôm nay',
          content: 'Ai có thể giúp tôi hiểu phần này?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          reactions: {
            LIKE: ['student1'],
            LOVE: [],
            WOW: [],
            HAHA: [],
            SAD: [],
            ANGRY: [],
            CLAP: [],
            THINKING: ['student3'],
          },
          userReaction: null,
          comments: [],
          mediaIds: [],
          isPinned: false,
          isCommentLocked: false,
          disabledInteractions: false,
          classId,
        },
      ];

      setAnnouncements(mockAnnouncements);
    } catch (err) {
      console.error('Error loading announcements:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  /**
   * Xử lý toggle reaction trên post
   */
  const handleReactionChange = useCallback(async (postId, reactionType, isRemoving) => {
    try {
      // Check permission
      if (!permissions.canLike()) {
        alert('Bạn không có quyền thích bài viết này');
        return;
      }

      // Update UI optimistically
      setAnnouncements(prev =>
        prev.map(post => {
          if (post.id === postId) {
            const updatedPost = { ...post };
            const newReactions = { ...post.reactions };

            if (isRemoving && updatedPost.userReaction) {
              // Remove reaction
              const reactionArray = newReactions[updatedPost.userReaction] || [];
              newReactions[updatedPost.userReaction] = reactionArray.filter(
                id => id !== currentUser.id
              );
              updatedPost.userReaction = null;
            } else {
              // Add reaction
              if (updatedPost.userReaction) {
                const prevArray = newReactions[updatedPost.userReaction] || [];
                newReactions[updatedPost.userReaction] = prevArray.filter(
                  id => id !== currentUser.id
                );
              }

              const newReactionArray = newReactions[reactionType] || [];
              newReactions[reactionType] = [...newReactionArray, currentUser.id];
              updatedPost.userReaction = reactionType;
            }

            updatedPost.reactions = newReactions;
            return updatedPost;
          }
          return post;
        })
      );

      // Call API
      await postInteractionService.toggleReaction(postId, reactionType, currentUser.id);
    } catch (err) {
      console.error('Error changing reaction:', err);
      setError('Lỗi khi cập nhật reaction');
      loadAnnouncements(); // Reload on error
    }
  }, [currentUser, permissions, loadAnnouncements]);

  /**
   * Xử lý thêm comment
   */
  const handleAddComment = useCallback(async (postId, content, mediaIds = []) => {
    try {
      if (!permissions.canComment()) {
        alert('Bạn không có quyền bình luận');
        return;
      }

      const newComment = {
        id: `comment_${Date.now()}`,
        author: currentUser,
        content,
        timestamp: new Date(),
        likes: [],
        userLiked: false,
        replies: [],
        mediaIds,
        isEdited: false,
      };

      // Update UI optimistically
      setAnnouncements(prev =>
        prev.map(post =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );

      // Call API
      await postInteractionService.addComment(postId, {
        content,
        userId: currentUser.id,
        mediaIds,
        authorRole: currentUser.role,
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Lỗi khi thêm comment');
      loadAnnouncements();
    }
  }, [currentUser, permissions, loadAnnouncements]);

  /**
   * Xử lý edit comment
   */
  const handleEditComment = useCallback(async (postId, commentId, newContent) => {
    try {
      if (!permissions.canEditComment()) {
        alert('Bạn không có quyền chỉnh sửa comment');
        return;
      }

      // Update UI optimistically
      setAnnouncements(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        content: newContent,
                        isEdited: true,
                        editedAt: new Date(),
                      }
                    : comment
                ),
              }
            : post
        )
      );

      // Call API
      await postInteractionService.editComment(postId, commentId, {
        content: newContent,
      });
    } catch (err) {
      console.error('Error editing comment:', err);
      setError('Lỗi khi chỉnh sửa comment');
      loadAnnouncements();
    }
  }, [currentUser, permissions, loadAnnouncements]);

  /**
   * Xử lý xóa comment
   */
  const handleDeleteComment = useCallback(async (postId, commentId) => {
    try {
      if (!permissions.canDeleteComment()) {
        alert('Bạn không có quyền xóa comment');
        return;
      }

      // Update UI optimistically
      setAnnouncements(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(comment => comment.id !== commentId),
              }
            : post
        )
      );

      // Call API
      await postInteractionService.deleteComment(postId, commentId);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Lỗi khi xóa comment');
      loadAnnouncements();
    }
  }, [currentUser, permissions, loadAnnouncements]);

  /**
   * Xử lý like comment
   */
  const handleLikeComment = useCallback(async (postId, commentId) => {
    try {
      if (!permissions.canLike()) {
        alert('Bạn không có quyền thích comment');
        return;
      }

      // Update UI optimistically
      setAnnouncements(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        userLiked: !comment.userLiked,
                        likes: comment.userLiked
                          ? comment.likes.filter(id => id !== currentUser.id)
                          : [...comment.likes, currentUser.id],
                      }
                    : comment
                ),
              }
            : post
        )
      );

      // Call API
      await postInteractionService.toggleCommentLike(postId, commentId, currentUser.id);
    } catch (err) {
      console.error('Error liking comment:', err);
      setError('Lỗi khi thích comment');
      loadAnnouncements();
    }
  }, [currentUser, permissions, loadAnnouncements]);

  /**
   * Xử lý thêm reply
   */
  const handleAddReply = useCallback(async (postId, commentId, content, mediaIds = []) => {
    try {
      if (!permissions.canComment()) {
        alert('Bạn không có quyền trả lời');
        return;
      }

      const newReply = {
        id: `reply_${Date.now()}`,
        author: currentUser,
        content,
        timestamp: new Date(),
        likes: [],
        userLiked: false,
        mediaIds,
      };

      // Update UI optimistically
      setAnnouncements(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map(comment =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        replies: [...(comment.replies || []), newReply],
                      }
                    : comment
                ),
              }
            : post
        )
      );

      // Call API
      await postInteractionService.addReply(postId, commentId, {
        content,
        userId: currentUser.id,
        mediaIds,
        authorRole: currentUser.role,
      });
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Lỗi khi thêm reply');
      loadAnnouncements();
    }
  }, [currentUser, permissions, loadAnnouncements]);

  /**
   * Xử lý pin/unpin post (Teacher only)
   */
  const handleTogglePin = useCallback(async (postId, isPinned) => {
    try {
      if (!permissions.canPinPost()) {
        alert('Bạn không có quyền ghim bài viết');
        return;
      }

      // Update UI optimistically
      setAnnouncements(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, isPinned: !isPinned } : post
        )
      );

      // Call API
      await postInteractionService.togglePinPost(postId, !isPinned);
    } catch (err) {
      console.error('Error toggling pin:', err);
      setError('Lỗi khi cập nhật trạng thái ghim');
      loadAnnouncements();
    }
  }, [permissions, loadAnnouncements]);

  /**
   * Xử lý lock/unlock comments (Teacher only)
   */
  const handleToggleLockComments = useCallback(async (postId, isLocked) => {
    try {
      if (!permissions.canLockComments()) {
        alert('Bạn không có quyền khóa bình luận');
        return;
      }

      // Update UI optimistically
      setAnnouncements(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, isCommentLocked: !isLocked } : post
        )
      );

      // Call API
      await postInteractionService.toggleLockComments(postId, !isLocked);
    } catch (err) {
      console.error('Error toggling lock comments:', err);
      setError('Lỗi khi cập nhật trạng thái khóa');
      loadAnnouncements();
    }
  }, [permissions, loadAnnouncements]);

  /**
   * Xử lý xóa post (Teacher only)
   */
  const handleDeletePost = useCallback(async (postId) => {
    try {
      if (!permissions.canDeleteComment()) {
        alert('Bạn không có quyền xóa bài viết');
        return;
      }

      if (window.confirm('Bạn chắc chắn muốn xóa bài viết này?')) {
        // Update UI optimistically
        setAnnouncements(prev => prev.filter(post => post.id !== postId));

        // Call API
        await postInteractionService.deletePost(postId);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Lỗi khi xóa bài viết');
      loadAnnouncements();
    }
  }, [permissions, loadAnnouncements]);

  /**
   * Xử lý share post
   */
  const handleShare = useCallback((postId) => {
    const post = announcements.find(p => p.id === postId);
    if (!post) return;

    const text = `${post.author.name}: ${post.content}`;

    if (navigator.share) {
      navigator.share({
        title: post.title || 'Chia sẻ',
        text: text,
      });
    } else {
      alert('Link chia sẻ: ' + window.location.href);
    }
  }, [announcements]);

  /**
   * Xử lý upload media
   */
  const handleMediaUpload = useCallback(async (files, postId) => {
    try {
      if (!permissions.canUploadMedia()) {
        alert('Bạn không có quyền upload media');
        return;
      }

      const uploadedMedia = await postInteractionService.uploadMedia(files, {
        postId,
        classId,
      });

      // Trả về media IDs cho comment
      return uploadedMedia;
    } catch (err) {
      console.error('Error uploading media:', err);
      setError('Lỗi khi upload media');
      return [];
    }
  }, [classId, permissions]);

  // Render loading state
  if (loading) {
    return (
      <div className="announcement-feed-loading">
        <div className="spinner"></div>
        <p>Đang tải bài viết...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="announcement-feed-error">
        <p>{error}</p>
        <button onClick={loadAnnouncements}>Thử lại</button>
      </div>
    );
  }

  // Render empty state
  if (announcements.length === 0) {
    return (
      <div className="announcement-feed-empty">
        <p>Chưa có bài viết nào</p>
      </div>
    );
  }

  // Render announcements
  return (
    <div className="announcement-feed">
      {announcements.map(post => (
        <div key={post.id} className="announcement-card">
          {/* Post Header */}
          <div className="post-header">
            <div className="author-info">
              <div className="avatar">{post.author.avatar}</div>
              <div className="author-details">
                <div className="author-name">{post.author.name}</div>
                <div className="author-role">{post.author.role}</div>
                <div className="post-time">
                  {new Date(post.timestamp).toLocaleString('vi-VN')}
                </div>
              </div>
            </div>
            {post.isPinned && <div className="pinned-badge">📌 Ghim</div>}
          </div>

          {/* Post Title */}
          {post.title && <div className="post-title">{post.title}</div>}

          {/* Post Content */}
          <div className="post-content">{post.content}</div>

          {/* Post Media */}
          {post.mediaIds && post.mediaIds.length > 0 && (
            <div className="post-media">
              {post.mediaIds.map(mediaId => (
                <div key={mediaId} className="media-item">
                  {/* Media rendering */}
                </div>
              ))}
            </div>
          )}

          {/* Interactions */}
          <PostInteraction
            post={post}
            onReactionChange={(reactionType, isRemoving) =>
              handleReactionChange(post.id, reactionType, isRemoving)
            }
            onCommentClick={() => {
              // Focus comment section
              document.querySelector(`#comments-${post.id}`)?.scrollIntoView();
            }}
            onShareClick={() => handleShare(post.id)}
            onDeletePost={() => handleDeletePost(post.id)}
            isTeacher={currentUser?.role === 'TEACHER'}
            canInteract={!post.disabledInteractions}
            onTogglePin={() => handleTogglePin(post.id, post.isPinned)}
            onToggleLockComments={() =>
              handleToggleLockComments(post.id, post.isCommentLocked)
            }
          />

          {/* Comment Locked Warning */}
          {post.isCommentLocked && (
            <div className="comment-locked-info">
              💬 Bài viết này đã khóa bình luận
            </div>
          )}

          {/* Comments Section */}
          {!post.isCommentLocked && (
            <div id={`comments-${post.id}`} className="comments-container">
              <CommentSection
                comments={post.comments}
                onAddComment={(content, mediaIds) =>
                  handleAddComment(post.id, content, mediaIds)
                }
                onDeleteComment={commentId =>
                  handleDeleteComment(post.id, commentId)
                }
                onEditComment={(commentId, content) =>
                  handleEditComment(post.id, commentId, content)
                }
                onLikeComment={commentId => handleLikeComment(post.id, commentId)}
                onAddReply={(commentId, content, mediaIds) =>
                  handleAddReply(post.id, commentId, content, mediaIds)
                }
                currentUserRole={currentUser?.role}
                canUploadMedia={() => permissions.canUploadMedia()}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnnouncementFeedWithInteractions;
