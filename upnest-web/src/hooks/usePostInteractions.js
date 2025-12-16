import { useState, useCallback, useEffect } from 'react';

/**
 * Custom Hook: usePostInteractions
 * Quản lý tất cả tương tác với bài đăng (reactions, comments, media)
 */
export function usePostInteractions(initialPost = null) {
  const [post, setPost] = useState(initialPost || {
    id: null,
    reactions: {},
    comments: [],
    userReaction: null,
    isLiked: false,
    totalReactions: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  // Reaction types với emoji
  const reactionTypes = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠',
    clap: '👏',
    thinking: '🤔'
  };

  /**
   * Thêm/Xóa reaction
   */
  const toggleReaction = useCallback(async (reactionType) => {
    try {
      setIsLoading(true);
      setError(null);

      const newReactions = { ...post.reactions };
      const currentUserReaction = post.userReaction;

      // Xóa reaction cũ nếu có
      if (currentUserReaction && newReactions[currentUserReaction] > 0) {
        newReactions[currentUserReaction] -= 1;
        if (newReactions[currentUserReaction] === 0) {
          delete newReactions[currentUserReaction];
        }
      }

      // Thêm reaction mới
      if (reactionType !== currentUserReaction) {
        newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
      }

      // Tính tổng reactions
      const totalReactions = Object.values(newReactions).reduce((a, b) => a + b, 0);

      setPost(prevPost => ({
        ...prevPost,
        reactions: newReactions,
        userReaction: reactionType !== currentUserReaction ? reactionType : null,
        totalReactions,
        isLiked: reactionType === 'like' && reactionType !== currentUserReaction
      }));

      // Mock API call
      // await postInteractionService.toggleReaction(post.id, reactionType);

      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [post.id, post.reactions, post.userReaction]);

  /**
   * Thêm bình luận
   */
  const addComment = useCallback(async (content, attachedMediaIds = []) => {
    if (!content.trim() && attachedMediaIds.length === 0) {
      setError('Bình luận không được để trống');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newComment = {
        id: `comment_${Date.now()}`,
        author: {
          id: 'current_user',
          name: 'Bạn',
          avatar: 'CU',
          role: 'Student'
        },
        content: content,
        mediaIds: attachedMediaIds,
        timestamp: new Date().toISOString(),
        likes: 0,
        userLiked: false,
        replies: [],
        isEdited: false,
        createdAt: new Date()
      };

      setPost(prevPost => ({
        ...prevPost,
        comments: [newComment, ...prevPost.comments]
      }));

      setCommentInput('');
      setReplyingTo(null);

      // Mock API call
      // await postInteractionService.addComment(post.id, newComment);

      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [post.id]);

  /**
   * Xóa bình luận
   */
  const deleteComment = useCallback(async (commentId) => {
    try {
      setIsLoading(true);
      setError(null);

      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.filter(c => c.id !== commentId)
      }));

      // Mock API call
      // await postInteractionService.deleteComment(post.id, commentId);

      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [post.id]);

  /**
   * Chỉnh sửa bình luận
   */
  const editComment = useCallback(async (commentId, newContent) => {
    try {
      setIsLoading(true);
      setError(null);

      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              content: newContent,
              isEdited: true,
              editedAt: new Date().toISOString()
            }
            : comment
        )
      }));

      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, [post.id]);

  /**
   * Like bình luận
   */
  const likeComment = useCallback(async (commentId) => {
    try {
      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              likes: comment.userLiked ? comment.likes - 1 : comment.likes + 1,
              userLiked: !comment.userLiked
            }
            : comment
        )
      }));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /**
   * Thêm reply cho bình luận
   */
  const addReply = useCallback(async (commentId, content) => {
    if (!content.trim()) {
      setError('Reply không được để trống');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newReply = {
        id: `reply_${Date.now()}`,
        author: {
          id: 'current_user',
          name: 'Bạn',
          avatar: 'CU',
          role: 'Student'
        },
        content: content,
        timestamp: new Date().toISOString(),
        likes: 0,
        userLiked: false,
        createdAt: new Date()
      };

      setPost(prevPost => ({
        ...prevPost,
        comments: prevPost.comments.map(comment =>
          comment.id === commentId
            ? {
              ...comment,
              replies: [newReply, ...comment.replies]
            }
            : comment
        )
      }));

      setReplyingTo(null);
      setCommentInput('');
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    post,
    isLoading,
    error,
    commentInput,
    replyingTo,
    reactionTypes,

    // Actions
    setPost,
    setError,
    setCommentInput,
    setReplyingTo,

    // Methods
    toggleReaction,
    addComment,
    deleteComment,
    editComment,
    likeComment,
    addReply
  };
}
