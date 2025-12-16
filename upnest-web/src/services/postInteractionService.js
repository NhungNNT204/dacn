// src/services/postInteractionService.js
// API Service layer cho Post Interactions - Mock API cho development

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
