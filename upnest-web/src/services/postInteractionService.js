/**
 * Service: Post Interaction
 * Purpose: Quản lý Like/Reaction, Comment, Media Sharing và Teacher Moderation
 * Features: Like/Reaction, Comments, Media Upload, Teacher Control
 */

import mockUserService from './mockUserService';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const USE_MOCK_SERVICE = true;

// Reaction types
export const REACTION_TYPES = {
  LIKE: 'like',
  LOVE: 'love',
  HAHA: 'haha',
  WOW: 'wow',
  SAD: 'sad',
  ANGRY: 'angry'
};

// Reaction emojis
export const REACTION_EMOJIS = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😲',
  sad: '😢',
  angry: '😠'
};

// Comment status
export const COMMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const getToken = () => {
  return localStorage.getItem('accessToken');
};

const getHeaders = (includeAuth = true) => {
  const headers = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  return headers;
};

/**
 * Mock Data cho Post Interactions
 */
const mockPosts = [
  {
    id: 'post-1',
    groupId: 'group-1',
    authorId: 'user-2',
    authorName: 'Trần Thị B',
    authorAvatar: null,
    title: 'Chia sẻ bài tập Tiếng Anh lớp 10',
    content: 'Mọi người có thể giúp mình kiểm tra bài này không?',
    images: [{ id: 'img-1', url: 'https://via.placeholder.com/400', name: 'assignment.png' }],
    videos: [],
    createdAt: '2025-12-17T10:30:00',
    reactions: { like: 5, love: 2, haha: 1, wow: 0, sad: 0, angry: 0 },
    userReaction: null,
    commentCount: 3,
    shareCount: 2,
    isModerationPending: false,
    status: 'approved'
  },
  {
    id: 'post-2',
    groupId: 'group-1',
    authorId: 'user-3',
    authorName: 'Nguyễn Văn A',
    authorAvatar: null,
    title: 'Video hướng dẫn giải toán',
    content: 'Đây là cách giải bài 5 trang 45',
    images: [],
    videos: [{ id: 'vid-1', url: 'https://via.placeholder.com/400', name: 'math_tutorial.mp4', thumbnail: 'https://via.placeholder.com/100' }],
    createdAt: '2025-12-17T14:15:00',
    reactions: { like: 8, love: 3, haha: 0, wow: 5, sad: 0, angry: 0 },
    userReaction: 'like',
    commentCount: 5,
    shareCount: 1,
    isModerationPending: false,
    status: 'approved'
  }
];

const mockComments = {
  'post-1': [
    {
      id: 'comment-1',
      postId: 'post-1',
      authorId: 'user-4',
      authorName: 'Phạm Văn C',
      authorAvatar: null,
      content: 'Bài này dễ, mình làm được đây',
      createdAt: '2025-12-17T11:00:00',
      status: 'approved',
      reactions: { like: 2, love: 0, haha: 1, wow: 0, sad: 0, angry: 0 },
      userReaction: null,
      attachments: []
    },
    {
      id: 'comment-2',
      postId: 'post-1',
      authorId: 'user-5',
      authorName: 'Lê Thị D',
      authorAvatar: null,
      content: 'Bài này khó, mình cũng chưa làm được',
      createdAt: '2025-12-17T11:30:00',
      status: 'approved',
      reactions: { like: 1, love: 0, haha: 0, wow: 0, sad: 1, angry: 0 },
      userReaction: null,
      attachments: []
    }
  ],
  'post-2': [
    {
      id: 'comment-3',
      postId: 'post-2',
      authorId: 'user-6',
      authorName: 'Hoàng Văn E',
      authorAvatar: null,
      content: 'Cảm ơn, video rất hữu ích!',
      createdAt: '2025-12-17T14:45:00',
      status: 'approved',
      reactions: { like: 5, love: 2, haha: 0, wow: 0, sad: 0, angry: 0 },
      userReaction: 'love',
      attachments: []
    }
  ]
};

// ============ POST OPERATIONS ============

/**
 * Lấy danh sách bài đăng trong nhóm/lớp
 */
export const getPosts = async (groupId, filters = {}) => {
  try {
    if (USE_MOCK_SERVICE) {
      return {
        success: true,
        data: mockPosts.filter(p => p.groupId === groupId),
        message: 'Posts loaded from mock service'
      };
    }

    const response = await fetch(`${API_BASE_URL}/posts?groupId=${groupId}`, {
      method: 'GET',
      headers: getHeaders(true)
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      success: true,
      data: mockPosts.filter(p => p.groupId === groupId),
      message: 'Fallback to mock service'
    };
  }
};

/**
 * Tạo bài đăng mới
 */
export const createPost = async (groupId, postData) => {
  try {
    if (USE_MOCK_SERVICE) {
      const newPost = {
        id: `post-${Date.now()}`,
        groupId,
        authorId: 'current-user',
        authorName: localStorage.getItem('username') || 'You',
        authorAvatar: null,
        title: postData.title,
        content: postData.content,
        images: postData.images || [],
        videos: postData.videos || [],
        createdAt: new Date().toISOString(),
        reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        userReaction: null,
        commentCount: 0,
        shareCount: 0,
        isModerationPending: true,
        status: 'pending'
      };
      mockPosts.push(newPost);
      return { success: true, data: newPost, message: 'Post created' };
    }

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ groupId, ...postData })
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Cập nhật bài đăng
 */
export const updatePost = async (postId, postData) => {
  try {
    if (USE_MOCK_SERVICE) {
      const index = mockPosts.findIndex(p => p.id === postId);
      if (index !== -1) {
        mockPosts[index] = { ...mockPosts[index], ...postData };
        return { success: true, data: mockPosts[index], message: 'Post updated' };
      }
      return { success: false, data: null, message: 'Post not found' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(postData)
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Xóa bài đăng
 */
export const deletePost = async (postId) => {
  try {
    if (USE_MOCK_SERVICE) {
      const index = mockPosts.findIndex(p => p.id === postId);
      if (index !== -1) {
        mockPosts.splice(index, 1);
        return { success: true, data: null, message: 'Post deleted' };
      }
      return { success: false, data: null, message: 'Post not found' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, data: null, message: error.message };
  }
};

// ============ REACTION OPERATIONS ============

/**
 * Thêm/cập nhật reaction cho bài đăng
 */
export const addPostReaction = async (postId, reactionType) => {
  try {
    if (USE_MOCK_SERVICE) {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) return { success: false, data: null, message: 'Post not found' };

      // Remove old reaction if exists
      if (post.userReaction && post.reactions[post.userReaction] > 0) {
        post.reactions[post.userReaction]--;
      }

      // Add new reaction
      post.reactions[reactionType] = (post.reactions[reactionType] || 0) + 1;
      post.userReaction = reactionType;

      return { success: true, data: post, message: 'Reaction added' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/reactions`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ reactionType })
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error adding reaction:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Xóa reaction từ bài đăng
 */
export const removePostReaction = async (postId) => {
  try {
    if (USE_MOCK_SERVICE) {
      const post = mockPosts.find(p => p.id === postId);
      if (!post) return { success: false, data: null, message: 'Post not found' };

      if (post.userReaction && post.reactions[post.userReaction] > 0) {
        post.reactions[post.userReaction]--;
        post.userReaction = null;
      }

      return { success: true, data: post, message: 'Reaction removed' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/reactions`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error removing reaction:', error);
    return { success: false, data: null, message: error.message };
  }
};

// ============ COMMENT OPERATIONS ============

/**
 * Lấy comments của bài đăng
 */
export const getPostComments = async (postId) => {
  try {
    if (USE_MOCK_SERVICE) {
      return {
        success: true,
        data: mockComments[postId] || [],
        message: 'Comments loaded'
      };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'GET',
      headers: getHeaders(true)
    });

    const data = await response.json();
    return data || { success: false, data: [], message: 'Invalid response' };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return {
      success: true,
      data: mockComments[postId] || [],
      message: 'Fallback to mock'
    };
  }
};

/**
 * Thêm comment mới
 */
export const addComment = async (postId, commentData) => {
  try {
    if (USE_MOCK_SERVICE) {
      const newComment = {
        id: `comment-${Date.now()}`,
        postId,
        authorId: 'current-user',
        authorName: localStorage.getItem('username') || 'You',
        authorAvatar: null,
        content: commentData.content,
        createdAt: new Date().toISOString(),
        status: 'pending', // Chờ duyệt từ giáo viên
        reactions: { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 },
        userReaction: null,
        attachments: commentData.attachments || []
      };

      if (!mockComments[postId]) {
        mockComments[postId] = [];
      }
      mockComments[postId].push(newComment);

      return { success: true, data: newComment, message: 'Comment added, waiting for approval' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(commentData)
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Cập nhật comment
 */
export const updateComment = async (postId, commentId, commentData) => {
  try {
    if (USE_MOCK_SERVICE) {
      const comments = mockComments[postId] || [];
      const index = comments.findIndex(c => c.id === commentId);
      if (index !== -1) {
        comments[index] = { ...comments[index], ...commentData };
        return { success: true, data: comments[index], message: 'Comment updated' };
      }
      return { success: false, data: null, message: 'Comment not found' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(commentData)
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error updating comment:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Xóa comment
 */
export const deleteComment = async (postId, commentId) => {
  try {
    if (USE_MOCK_SERVICE) {
      const comments = mockComments[postId] || [];
      const index = comments.findIndex(c => c.id === commentId);
      if (index !== -1) {
        comments.splice(index, 1);
        return { success: true, data: null, message: 'Comment deleted' };
      }
      return { success: false, data: null, message: 'Comment not found' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Thêm reaction cho comment
 */
export const addCommentReaction = async (postId, commentId, reactionType) => {
  try {
    if (USE_MOCK_SERVICE) {
      const comments = mockComments[postId] || [];
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return { success: false, data: null, message: 'Comment not found' };

      if (comment.userReaction && comment.reactions[comment.userReaction] > 0) {
        comment.reactions[comment.userReaction]--;
      }

      comment.reactions[reactionType] = (comment.reactions[reactionType] || 0) + 1;
      comment.userReaction = reactionType;

      return { success: true, data: comment, message: 'Reaction added to comment' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}/reactions`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ reactionType })
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error adding reaction to comment:', error);
    return { success: false, data: null, message: error.message };
  }
};

// ============ MEDIA UPLOAD ============

/**
 * Tải lên hình ảnh
 */
export const uploadPostImage = async (file, postId = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (postId) formData.append('postId', postId);

    if (USE_MOCK_SERVICE) {
      return {
        success: true,
        data: {
          id: `img-${Date.now()}`,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size
        },
        message: 'Image uploaded (mock)'
      };
    }

    const response = await fetch(`${API_BASE_URL}/posts/upload/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: true,
      data: {
        id: `img-${Date.now()}`,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      },
      message: 'Image uploaded (mock fallback)'
    };
  }
};

/**
 * Tải lên video
 */
export const uploadPostVideo = async (file, postId = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (postId) formData.append('postId', postId);

    if (USE_MOCK_SERVICE) {
      return {
        success: true,
        data: {
          id: `vid-${Date.now()}`,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          thumbnail: 'https://via.placeholder.com/100'
        },
        message: 'Video uploaded (mock)'
      };
    }

    const response = await fetch(`${API_BASE_URL}/posts/upload/video`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error uploading video:', error);
    return {
      success: true,
      data: {
        id: `vid-${Date.now()}`,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        thumbnail: 'https://via.placeholder.com/100'
      },
      message: 'Video uploaded (mock fallback)'
    };
  }
};

// ============ TEACHER MODERATION ============

/**
 * Lấy danh sách bài đăng chờ duyệt
 */
export const getPendingPosts = async (groupId) => {
  try {
    if (USE_MOCK_SERVICE) {
      return {
        success: true,
        data: mockPosts.filter(p => p.groupId === groupId && p.isModerationPending),
        message: 'Pending posts loaded'
      };
    }

    const response = await fetch(`${API_BASE_URL}/posts/pending?groupId=${groupId}`, {
      method: 'GET',
      headers: getHeaders(true)
    });

    const data = await response.json();
    return data || { success: false, data: [], message: 'Invalid response' };
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    return {
      success: true,
      data: mockPosts.filter(p => p.groupId === groupId && p.isModerationPending),
      message: 'Fallback to mock'
    };
  }
};

/**
 * Duyệt bài đăng
 */
export const approvePost = async (postId) => {
  try {
    if (USE_MOCK_SERVICE) {
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        post.status = 'approved';
        post.isModerationPending = false;
        return { success: true, data: post, message: 'Post approved' };
      }
      return { success: false, data: null, message: 'Post not found' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/approve`, {
      method: 'POST',
      headers: getHeaders(true)
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error approving post:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Từ chối bài đăng
 */
export const rejectPost = async (postId, reason) => {
  try {
    if (USE_MOCK_SERVICE) {
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        post.status = 'rejected';
        post.isModerationPending = false;
        post.rejectionReason = reason;
        return { success: true, data: post, message: 'Post rejected' };
      }
      return { success: false, data: null, message: 'Post not found' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/reject`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ reason })
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error rejecting post:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Duyệt comment
 */
export const approveComment = async (postId, commentId) => {
  try {
    if (USE_MOCK_SERVICE) {
      const comments = mockComments[postId] || [];
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.status = 'approved';
        return { success: true, data: comment, message: 'Comment approved' };
      }
      return { success: false, data: null, message: 'Comment not found' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}/approve`, {
      method: 'POST',
      headers: getHeaders(true)
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error approving comment:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Từ chối comment
 */
export const rejectComment = async (postId, commentId, reason) => {
  try {
    if (USE_MOCK_SERVICE) {
      const comments = mockComments[postId] || [];
      const comment = comments.find(c => c.id === commentId);
      if (comment) {
        comment.status = 'rejected';
        comment.rejectionReason = reason;
        return { success: true, data: comment, message: 'Comment rejected' };
      }
      return { success: false, data: null, message: 'Comment not found' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${commentId}/reject`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ reason })
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error rejecting comment:', error);
    return { success: false, data: null, message: error.message };
  }
};

/**
 * Lấy pending comments
 */
export const getPendingComments = async (groupId) => {
  try {
    if (USE_MOCK_SERVICE) {
      const pending = [];
      Object.keys(mockComments).forEach(postId => {
        mockComments[postId]
          .filter(c => c.status === 'pending')
          .forEach(c => {
            pending.push({ ...c, postId });
          });
      });
      return { success: true, data: pending, message: 'Pending comments loaded' };
    }

    const response = await fetch(`${API_BASE_URL}/comments/pending?groupId=${groupId}`, {
      method: 'GET',
      headers: getHeaders(true)
    });

    const data = await response.json();
    return data || { success: false, data: [], message: 'Invalid response' };
  } catch (error) {
    console.error('Error fetching pending comments:', error);
    return { success: true, data: [], message: 'Fallback to mock' };
  }
};

// ============ SHARING ============

/**
 * Chia sẻ bài đăng
 */
export const sharePost = async (postId, targetGroupId) => {
  try {
    if (USE_MOCK_SERVICE) {
      const post = mockPosts.find(p => p.id === postId);
      if (post) {
        post.shareCount = (post.shareCount || 0) + 1;
        return { success: true, data: post, message: 'Post shared' };
      }
      return { success: false, data: null, message: 'Post not found' };
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/share`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ targetGroupId })
    });

    const data = await response.json();
    return data || { success: false, data: null, message: 'Invalid response' };
  } catch (error) {
    console.error('Error sharing post:', error);
    return { success: false, data: null, message: error.message };
  }
};

class PostInteractionService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
    this.timeout = 5000;
  }

  /**
   * Toggle reaction trên post
   * @param {string} postId - ID của post
   * @param {string} reactionType - Loại reaction (LIKE, LOVE, HAHA, WOW, SAD, ANGRY, CLAP, THINKING)
   * @param {string} userId - ID của user
   * @returns {Promise} - Updated post object
   */
  async toggleReaction(postId, reactionType, userId) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({
          reactionType,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle reaction: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling reaction:', error);
      throw error;
    }
  }

  /**
   * Thêm comment trên post
   * @param {string} postId - ID của post
   * @param {Object} commentData - { content, userId, mediaIds, authorRole }
   * @returns {Promise} - Created comment object
   */
  async addComment(postId, commentData) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  /**
   * Cập nhật comment
   * @param {string} postId - ID của post
   * @param {string} commentId - ID của comment
   * @param {Object} updateData - { content, mediaIds }
   * @returns {Promise} - Updated comment object
   */
  async editComment(postId, commentId, updateData) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit comment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error;
    }
  }

  /**
   * Xóa comment
   * @param {string} postId - ID của post
   * @param {string} commentId - ID của comment
   * @returns {Promise} - Response object
   */
  async deleteComment(postId, commentId) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete comment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  /**
   * Like/Unlike comment
   * @param {string} postId - ID của post
   * @param {string} commentId - ID của comment
   * @param {string} userId - ID của user
   * @returns {Promise} - Updated comment object
   */
  async toggleCommentLike(postId, commentId, userId) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle comment like: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  }

  /**
   * Thêm reply cho comment
   * @param {string} postId - ID của post
   * @param {string} commentId - ID của comment
   * @param {Object} replyData - { content, userId, mediaIds, authorRole }
   * @returns {Promise} - Created reply object
   */
  async addReply(postId, commentId, replyData) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(replyData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add reply: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  }

  /**
   * Upload media file
   * @param {File|File[]} files - File hoặc array of files
   * @param {Object} options - { classId, groupId, courseId }
   * @returns {Promise} - Array of uploaded file objects with IDs
   */
  async uploadMedia(files, options = {}) {
    try {
      const formData = new FormData();

      if (Array.isArray(files)) {
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
      } else {
        formData.append('file', files);
      }

      // Add options to form data
      Object.entries(options).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const response = await fetch(`${this.baseURL}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload media: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  /**
   * Pin/Unpin post (Teacher only)
   * @param {string} postId - ID của post
   * @param {boolean} isPinned - Trạng thái pin
   * @returns {Promise} - Updated post object
   */
  async togglePinPost(postId, isPinned) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/pin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ isPinned }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle pin: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling pin:', error);
      throw error;
    }
  }

  /**
   * Lock/Unlock comments (Teacher only)
   * @param {string} postId - ID của post
   * @param {boolean} isLocked - Trạng thái lock
   * @returns {Promise} - Updated post object
   */
  async toggleLockComments(postId, isLocked) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/lock-comments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ isLocked }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle lock comments: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling lock comments:', error);
      throw error;
    }
  }

  /**
   * Disable/Enable interactions (Teacher only)
   * @param {string} postId - ID của post
   * @param {boolean} disabled - Trạng thái disable
   * @returns {Promise} - Updated post object
   */
  async toggleDisableInteractions(postId, disabled) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}/disable-interactions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ disabled }),
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle disable interactions: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling disable interactions:', error);
      throw error;
    }
  }

  /**
   * Delete post (Teacher/Admin only)
   * @param {string} postId - ID của post
   * @returns {Promise} - Response object
   */
  async deletePost(postId) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết post với tất cả interactions
   * @param {string} postId - ID của post
   * @returns {Promise} - Post object với reactions, comments, replies
   */
  async getPostDetails(postId) {
    try {
      const response = await fetch(`${this.baseURL}/posts/${postId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  /**
   * Lấy comments của post
   * @param {string} postId - ID của post
   * @param {Object} options - { page, limit, sortBy }
   * @returns {Promise} - Array of comments
   */
  async getComments(postId, options = {}) {
    try {
      const queryParams = new URLSearchParams(options);
      const response = await fetch(`${this.baseURL}/posts/${postId}/comments?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  /**
   * Moderation: Lấy danh sách comments/reactions cần review
   * @param {Object} filters - { postId, classId, type, page, limit }
   * @returns {Promise} - Array of content items for moderation
   */
  async getModerationQueue(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await fetch(`${this.baseURL}/moderation/queue?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch moderation queue: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching moderation queue:', error);
      throw error;
    }
  }

  /**
   * Moderation: Reject/Approve content
   * @param {string} contentId - ID của content (post/comment)
   * @param {string} action - 'approve' hoặc 'reject'
   * @param {string} reason - Lý do (nếu reject)
   * @returns {Promise} - Updated content object
   */
  async moderateContent(contentId, action, reason = '') {
    try {
      const response = await fetch(`${this.baseURL}/moderation/${contentId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error(`Failed to moderate content: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error moderating content:', error);
      throw error;
    }
  }

  /**
   * Helper: Lấy JWT token từ localStorage
   * @returns {string} - JWT token
   */
  getToken() {
    return localStorage.getItem('jwtToken') || '';
  }

  /**
   * Get Feed - Lấy bài viết theo filter
   * @param {Object} options - Filter options
   * @returns {Promise<{success, data, hasMore, total, message}>}
   */
  async getFeed(options = {}) {
    const { filterType = 'all', page = 1, limit = 10, userId, friendIds = [], groupIds = [] } = options;
    const delay = USE_MOCK_SERVICE ? 500 : 0;

    try {
      if (USE_MOCK_SERVICE) {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        let filtered = [...mockData.posts];

        // Filter by type
        switch (filterType) {
          case 'friends':
            filtered = filtered.filter(p => friendIds.includes(p.authorId));
            break;
          case 'groups':
            filtered = filtered.filter(p => groupIds.includes(p.groupId));
            break;
          case 'lessons':
            filtered = filtered.filter(p => p.type === 'lesson');
            break;
          default: // 'all'
            break;
        }

        // Sort by date (newest first)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginated = filtered.slice(start, end);

        return {
          success: true,
          data: paginated,
          hasMore: end < filtered.length,
          total: filtered.length,
          page,
          limit
        };
      }

      const response = await fetch(
        `${API_BASE_URL}/feed?type=${filterType}&page=${page}&limit=${limit}&userId=${userId}`,
        {
          method: 'GET',
          headers: getHeaders(true)
        }
      );

      if (!response.ok) throw new Error('Failed to fetch feed');
      return await response.json();
    } catch (error) {
      console.error('Feed error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Get Suggested Materials - Lấy tài liệu gợi ý
   * @param {Object} options - Options
   * @returns {Promise<{success, data, message}>}
   */
  async getSuggestedMaterials(options = {}) {
    const { userId, limit = 5 } = options;
    const delay = USE_MOCK_SERVICE ? 300 : 0;

    try {
      if (USE_MOCK_SERVICE) {
        await new Promise(resolve => setTimeout(resolve, delay));

        const materials = [
          {
            id: 'mat-1',
            title: 'Introduction to React Hooks',
            description: 'Learn how to use React Hooks effectively in your projects',
            subject: 'React',
            level: 'Intermediate',
            url: '#',
            views: 2345,
            rating: 4.8
          },
          {
            id: 'mat-2',
            title: 'Advanced JavaScript ES6+',
            description: 'Master modern JavaScript features and best practices',
            subject: 'JavaScript',
            level: 'Advanced',
            url: '#',
            views: 3456,
            rating: 4.9
          },
          {
            id: 'mat-3',
            title: 'Web Design Fundamentals',
            description: 'Create beautiful and responsive web interfaces',
            subject: 'UI/UX',
            level: 'Beginner',
            url: '#',
            views: 1234,
            rating: 4.7
          },
          {
            id: 'mat-4',
            title: 'Database Design Patterns',
            description: 'Understand database optimization and design principles',
            subject: 'Database',
            level: 'Advanced',
            url: '#',
            views: 890,
            rating: 4.6
          },
          {
            id: 'mat-5',
            title: 'REST API Development',
            description: 'Build robust and scalable REST APIs',
            subject: 'Backend',
            level: 'Intermediate',
            url: '#',
            views: 2100,
            rating: 4.8
          }
        ];

        return {
          success: true,
          data: materials.slice(0, limit)
        };
      }

      const response = await fetch(
        `${API_BASE_URL}/suggestions/materials?userId=${userId}&limit=${limit}`,
        {
          method: 'GET',
          headers: getHeaders(true)
        }
      );

      if (!response.ok) throw new Error('Failed to fetch materials');
      return await response.json();
    } catch (error) {
      console.error('Materials error:', error);
      return { success: false, data: [], message: error.message };
    }
  }

  /**
   * Get Upcoming Events - Lấy sự kiện sắp tới
   * @param {Object} options - Options
   * @returns {Promise<{success, data, message}>}
   */
  async getUpcomingEvents(options = {}) {
    const { groupIds = [], limit = 5 } = options;
    const delay = USE_MOCK_SERVICE ? 300 : 0;

    try {
      if (USE_MOCK_SERVICE) {
        await new Promise(resolve => setTimeout(resolve, delay));

        const today = new Date();
        const events = [
          {
            id: 'evt-1',
            title: 'React Workshop - State Management',
            description: 'Deep dive into React state management with Redux and Context API',
            startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Online',
            speakers: ['Alex Johnson', 'Sarah Smith'],
            attendees: 124,
            groupId: 'group-1'
          },
          {
            id: 'evt-2',
            title: 'JavaScript Best Practices Webinar',
            description: 'Learn industry best practices for writing clean JavaScript code',
            startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Room 301 - Main Campus',
            speakers: ['Mike Chen'],
            attendees: 87,
            groupId: 'group-2'
          },
          {
            id: 'evt-3',
            title: 'Web Performance Optimization',
            description: 'Techniques to make your websites faster and more efficient',
            startDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Online',
            speakers: ['Emma Davis', 'Tom Wilson'],
            attendees: 156,
            groupId: 'group-3'
          },
          {
            id: 'evt-4',
            title: 'CSS Grid & Flexbox Masterclass',
            description: 'Master modern CSS layout techniques',
            startDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Room 205 - Tech Building',
            speakers: ['Lisa Anderson'],
            attendees: 92,
            groupId: 'group-1'
          },
          {
            id: 'evt-5',
            title: 'Career Talk: Tech Industry Insights',
            description: 'Hear from experienced professionals about careers in tech',
            startDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Auditorium',
            speakers: ['Robert Taylor', 'Jessica Lee'],
            attendees: 340,
            groupId: 'group-2'
          }
        ];

        return {
          success: true,
          data: events.slice(0, limit)
        };
      }

      const response = await fetch(
        `${API_BASE_URL}/suggestions/events?groupIds=${groupIds.join(',')}&limit=${limit}`,
        {
          method: 'GET',
          headers: getHeaders(true)
        }
      );

      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Events error:', error);
      return { success: false, data: [], message: error.message };
    }
  }

  /**
   * Get Trending Posts - Lấy bài viết xu hướng
   * @param {Object} options - Options
   * @returns {Promise<{success, data, message}>}
   */
  async getTrendingPosts(options = {}) {
    const { userId, limit = 3 } = options;
    const delay = USE_MOCK_SERVICE ? 300 : 0;

    try {
      if (USE_MOCK_SERVICE) {
        await new Promise(resolve => setTimeout(resolve, delay));

        const trending = [...mockData.posts]
          .sort((a, b) => {
            const aScore = (a.reactions?.like || 0) * 2 + (a.commentCount || 0) + (a.shares || 0) * 3;
            const bScore = (b.reactions?.like || 0) * 2 + (b.commentCount || 0) + (b.shares || 0) * 3;
            return bScore - aScore;
          })
          .slice(0, limit);

        return {
          success: true,
          data: trending
        };
      }

      const response = await fetch(
        `${API_BASE_URL}/posts/trending?userId=${userId}&limit=${limit}`,
        {
          method: 'GET',
          headers: getHeaders(true)
        }
      );

      if (!response.ok) throw new Error('Failed to fetch trending posts');
      return await response.json();
    } catch (error) {
      console.error('Trending error:', error);
      return { success: false, data: [], message: error.message };
    }
  }

  /**
   * Helper: Format file size
   * @param {number} bytes - Số bytes
   * @returns {string} - Formatted file size (KB, MB, etc)
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Helper: Validate file type
   * @param {File} file - File object
   * @param {string[]} allowedTypes - MIME types
   * @returns {boolean}
   */
  static isAllowedFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
  }

  /**
   * Helper: Validate file size
   * @param {number} fileSize - Số bytes
   * @param {number} maxSize - Max bytes
   * @returns {boolean}
   */
  static isFileSizeValid(fileSize, maxSize) {
    return fileSize <= maxSize;
  }
}

// Export singleton instance
export default new PostInteractionService();

// Export class để test hoặc create multiple instances nếu cần
export { PostInteractionService };
