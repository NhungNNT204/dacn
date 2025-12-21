// src/pages/classroom/AnnouncementFeedDemo.jsx
// Demo Component - Để test hệ thống interactions trước khi integrate với backend

import React, { useState, useCallback } from 'react';
import PostInteraction from '../../components/PostInteraction';
import CommentSection from '../../components/CommentSection';
import './AnnouncementFeedDemo.css';

/**
 * Demo component với mock data để test hệ thống interactions
 * Không cần backend - dùng state local
 * 
 * Usage: Import vào route để test
 * <Route path="/demo" element={<AnnouncementFeedDemo />} />
 */
const AnnouncementFeedDemo = () => {
  // Mock current user
  const currentUser = {
    id: 'user_demo',
    name: 'Demo User',
    role: 'TEACHER', // Change to 'STUDENT' để test student permissions
    avatar: 'DU',
  };

  // Mock posts data
  const [posts, setPosts] = useState([
    {
      id: 'post_1',
      author: {
        id: 'teacher_1',
        name: 'Thầy Trần Văn A',
        role: 'TEACHER',
        avatar: 'TA',
      },
      title: '📚 Thông báo: Kỳ thi giữa kỳ',
      content: 'Kỳ thi giữa kỳ sẽ diễn ra vào ngày 15 tháng 10. Tất cả học sinh cần chuẩn bị tốt. Đây là kỳ thi quan trọng đánh giá kiến thức từ đầu học kỳ.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reactions: {
        LIKE: ['student_1', 'student_2'],
        LOVE: ['student_3'],
        HAHA: [],
        WOW: ['student_4'],
        SAD: [],
        ANGRY: [],
        CLAP: ['teacher_1'],
        THINKING: ['student_5'],
      },
      userReaction: null,
      comments: [
        {
          id: 'comment_1',
          author: {
            id: 'student_1',
            name: 'Nguyễn Văn B',
            role: 'STUDENT',
            avatar: 'NB',
          },
          content: 'Cảm ơn thầy vì thông báo này. Tôi sẽ chuẩn bị kỹ lưỡng.',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          likes: ['student_2', 'teacher_1'],
          userLiked: false,
          replies: [
            {
              id: 'reply_1',
              author: {
                id: 'teacher_1',
                name: 'Thầy Trần Văn A',
                role: 'TEACHER',
                avatar: 'TA',
              },
              content: 'Rất tốt! Hãy chú ý ôn tập phần lý tnhungết đặc biệt.',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
              likes: ['student_1'],
              userLiked: false,
            },
          ],
          mediaIds: [],
          isEdited: false,
        },
        {
          id: 'comment_2',
          author: {
            id: 'student_2',
            name: 'Phạm Thị C',
            role: 'STUDENT',
            avatar: 'PC',
          },
          content: 'Bài thi sẽ bao gồm những phần nào thầy?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          likes: [],
          userLiked: false,
          replies: [],
          mediaIds: [],
          isEdited: false,
        },
      ],
      mediaIds: [],
      isPinned: true,
      isCommentLocked: false,
      disabledInteractions: false,
    },
    {
      id: 'post_2',
      author: {
        id: 'student_3',
        name: 'Trần Thị D',
        role: 'STUDENT',
        avatar: 'TD',
      },
      title: '❓ Câu hỏi về bài học hôm nay',
      content: 'Ai có thể giúp tôi hiểu phần này? Em không hiểu lắm về cách giải quyết bài toán này.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      reactions: {
        LIKE: ['student_1'],
        LOVE: [],
        HAHA: [],
        WOW: [],
        SAD: ['student_2'],
        ANGRY: [],
        CLAP: [],
        THINKING: ['student_5', 'student_6'],
      },
      userReaction: null,
      comments: [],
      mediaIds: [],
      isPinned: false,
      isCommentLocked: false,
      disabledInteractions: false,
    },
  ]);

  /**
   * Test: Toggle reaction
   */
  const handleReactionChange = useCallback((postId, reactionType, isRemoving) => {
    console.log(`Reaction toggle: ${postId}, type: ${reactionType}, removing: ${isRemoving}`);

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const updated = { ...post };
          const newReactions = { ...post.reactions };

          if (isRemoving && updated.userReaction) {
            // Remove reaction
            const reactionArray = newReactions[updated.userReaction] || [];
            newReactions[updated.userReaction] = reactionArray.filter(
              id => id !== currentUser.id
            );
            updated.userReaction = null;
          } else {
            // Add reaction
            if (updated.userReaction) {
              const prevArray = newReactions[updated.userReaction] || [];
              newReactions[updated.userReaction] = prevArray.filter(
                id => id !== currentUser.id
              );
            }

            const newReactionArray = newReactions[reactionType] || [];
            newReactions[reactionType] = [...newReactionArray, currentUser.id];
            updated.userReaction = reactionType;
          }

          updated.reactions = newReactions;
          return updated;
        }
        return post;
      })
    );
  }, []);

  /**
   * Test: Add comment
   */
  const handleAddComment = useCallback((postId, content) => {
    console.log(`Add comment: ${postId}, content: ${content}`);

    const newComment = {
      id: `comment_${Date.now()}`,
      author: currentUser,
      content,
      timestamp: new Date(),
      likes: [],
      userLiked: false,
      replies: [],
      mediaIds: [],
      isEdited: false,
    };

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  }, [currentUser]);

  /**
   * Test: Delete comment
   */
  const handleDeleteComment = useCallback((postId, commentId) => {
    console.log(`Delete comment: ${postId}, commentId: ${commentId}`);

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(c => c.id !== commentId),
            }
          : post
      )
    );
  }, []);

  /**
   * Test: Edit comment
   */
  const handleEditComment = useCallback((postId, commentId, newContent) => {
    console.log(`Edit comment: ${postId}, commentId: ${commentId}, new content: ${newContent}`);

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map(c =>
                c.id === commentId
                  ? {
                      ...c,
                      content: newContent,
                      isEdited: true,
                      editedAt: new Date(),
                    }
                  : c
              ),
            }
          : post
      )
    );
  }, []);

  /**
   * Test: Like comment
   */
  const handleLikeComment = useCallback((postId, commentId) => {
    console.log(`Like comment: ${postId}, commentId: ${commentId}`);

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map(c =>
                c.id === commentId
                  ? {
                      ...c,
                      userLiked: !c.userLiked,
                      likes: c.userLiked
                        ? c.likes.filter(id => id !== currentUser.id)
                        : [...c.likes, currentUser.id],
                    }
                  : c
              ),
            }
          : post
      )
    );
  }, [currentUser.id]);

  /**
   * Test: Add reply
   */
  const handleAddReply = useCallback((postId, commentId, content) => {
    console.log(`Add reply: ${postId}, commentId: ${commentId}, content: ${content}`);

    const newReply = {
      id: `reply_${Date.now()}`,
      author: currentUser,
      content,
      timestamp: new Date(),
      likes: [],
      userLiked: false,
    };

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.map(c =>
                c.id === commentId
                  ? {
                      ...c,
                      replies: [...(c.replies || []), newReply],
                    }
                  : c
              ),
            }
          : post
      )
    );
  }, [currentUser]);

  /**
   * Test: Toggle pin post
   */
  const handleTogglePin = useCallback((postId) => {
    console.log(`Toggle pin: ${postId}`);

    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, isPinned: !post.isPinned } : post
      )
    );
  }, []);

  /**
   * Test: Toggle lock comments
   */
  const handleToggleLockComments = useCallback((postId) => {
    console.log(`Toggle lock comments: ${postId}`);

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isCommentLocked: !post.isCommentLocked }
          : post
      )
    );
  }, []);

  /**
   * Test: Delete post
   */
  const handleDeletePost = useCallback((postId) => {
    console.log(`Delete post: ${postId}`);

    if (window.confirm('Bạn chắc chắn muốn xóa bài viết này?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));
    }
  }, []);

  return (
    <div className="announcement-feed-demo">
      <div className="demo-header">
        <h1>🎉 Demo: Hệ Thống Tương Tác Cộng Đồng</h1>
        <p>Hiện tại đăng nhập dưới: <strong>{currentUser.role} - {currentUser.name}</strong></p>
        <p className="demo-info">
          💡 Tip: Mở Developer Console (F12) để xem logs của tất cả actions
        </p>
      </div>

      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            {/* Post Header */}
            <div className="post-header">
              <div className="author-info">
                <div className="avatar">{post.author.avatar}</div>
                <div className="author-details">
                  <div className="author-name">{post.author.name}</div>
                  <div className="author-role">{post.author.role}</div>
                  <div className="post-time">
                    {post.timestamp.toLocaleString('vi-VN')}
                  </div>
                </div>
              </div>
              {post.isPinned && <div className="pinned-badge">📌 Ghim</div>}
            </div>

            {/* Post Title & Content */}
            {post.title && <div className="post-title">{post.title}</div>}
            <div className="post-content">{post.content}</div>

            {/* Interactions */}
            <PostInteraction
              post={post}
              onReactionChange={(type, removing) =>
                handleReactionChange(post.id, type, removing)
              }
              onCommentClick={() => {
                console.log('Comment button clicked');
              }}
              onShareClick={() => {
                console.log('Share button clicked');
              }}
              onDeletePost={() => handleDeletePost(post.id)}
              isTeacher={currentUser.role === 'TEACHER'}
              canInteract={!post.disabledInteractions}
              onTogglePin={() => handleTogglePin(post.id)}
              onToggleLockComments={() => handleToggleLockComments(post.id)}
            />

            {/* Lock Comment Info */}
            {post.isCommentLocked && (
              <div className="comment-locked-info">
                🔒 Bài viết này đã khóa bình luận
              </div>
            )}

            {/* Comments Section */}
            {!post.isCommentLocked && (
              <CommentSection
                comments={post.comments}
                onAddComment={(content) =>
                  handleAddComment(post.id, content)
                }
                onDeleteComment={(commentId) =>
                  handleDeleteComment(post.id, commentId)
                }
                onEditComment={(commentId, content) =>
                  handleEditComment(post.id, commentId, content)
                }
                onLikeComment={(commentId) =>
                  handleLikeComment(post.id, commentId)
                }
                onAddReply={(commentId, content) =>
                  handleAddReply(post.id, commentId, content)
                }
                currentUserRole={currentUser.role}
              />
            )}
          </div>
        ))}
      </div>

      {/* Test Instructions */}
      <div className="demo-instructions">
        <h2>🧪 Test Instructions</h2>
        <ul>
          <li><strong>Like/Reaction</strong>: Click emoji picker button, chọn emoji</li>
          <li><strong>Comment</strong>: Type in comment box, click Send</li>
          <li><strong>Edit Comment</strong>: Double-click comment to edit</li>
          <li><strong>Delete Comment</strong>: Click trash icon (owner/teacher only)</li>
          <li><strong>Reply</strong>: Click "Trả lời" button dưới comment</li>
          <li><strong>Like Comment</strong>: Click heart icon trên comment</li>
          <li><strong>Teacher Only</strong>: Click ⋮ menu → Pin/Lock/Delete</li>
          <li><strong>Console</strong>: Open DevTools (F12) to see all logs</li>
        </ul>
      </div>
    </div>
  );
};

export default AnnouncementFeedDemo;
