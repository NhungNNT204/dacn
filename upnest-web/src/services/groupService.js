/**
 * groupService.js - API integration for Groups
 * Handles all group-related API calls
 */

const API_BASE_URL = 'http://localhost:8080/api/v1/groups';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API Error');
  }
  return response.json();
};

/**
 * Group API Methods
 */
const groupService = {
  // ==================== GROUP ENDPOINTS ====================

  /**
   * Lấy danh sách nhóm công khai
   */
  getAllGroups: async (page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching groups:', error);
      return getMockGroups();
    }
  },

  /**
   * Lấy nhóm trending
   */
  getTrendingGroups: async (page = 0, size = 5) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/trending?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching trending groups:', error);
      return { content: [] };
    }
  },

  /**
   * Lấy nhóm gợi ý
   */
  getSuggestedGroups: async (page = 0, size = 5) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/suggested?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching suggested groups:', error);
      return { content: [] };
    }
  },

  /**
   * Tìm kiếm nhóm
   */
  searchGroups: async (keyword, page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error searching groups:', error);
      return { results: [] };
    }
  },

  /**
   * Lấy nhóm theo danh mục
   */
  getGroupsByCategory: async (category, page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/category/${category}?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching groups by category:', error);
      return { content: [] };
    }
  },

  /**
   * Lấy nhóm mà user tham gia
   */
  getUserGroups: async (page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/my-groups?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return { content: [] };
    }
  },

  /**
   * Lấy nhóm mà user là owner
   */
  getUserOwnedGroups: async (page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/owned?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching owned groups:', error);
      return { content: [] };
    }
  },

  /**
   * Lấy chi tiết nhóm
   */
  getGroupDetail: async (groupId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching group detail:', error);
      throw error;
    }
  },

  /**
   * Tạo nhóm mới
   */
  createGroup: async (groupData) => {
    try {
      const response = await fetch(
        API_BASE_URL,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(groupData)
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  /**
   * Cập nhật nhóm
   */
  updateGroup: async (groupId, groupData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(groupData)
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  /**
   * Xóa nhóm
   */
  deleteGroup: async (groupId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },

  // ==================== MEMBER ENDPOINTS ====================

  /**
   * Tham gia nhóm
   */
  joinGroup: async (groupId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/join`,
        {
          method: 'POST',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  },

  /**
   * Rời nhóm
   */
  leaveGroup: async (groupId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/leave`,
        {
          method: 'POST',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  },

  /**
   * Kiểm tra membership
   */
  checkMembership: async (groupId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/is-member`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error checking membership:', error);
      return { isMember: false, isAdmin: false };
    }
  },

  /**
   * Lấy danh sách member
   */
  getGroupMembers: async (groupId, page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/members?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching members:', error);
      return { members: [] };
    }
  },

  /**
   * Tìm member
   */
  searchMembers: async (groupId, keyword, page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/members/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error searching members:', error);
      return { content: [] };
    }
  },

  /**
   * Cập nhật vai trò member
   */
  updateMemberRole: async (groupId, userId, role) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/members/${userId}/role`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ role })
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating member role:', error);
      throw error;
    }
  },

  /**
   * Mute/Unmute nhóm
   */
  muteGroup: async (groupId, isMuted) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/mute?isMuted=${isMuted}`,
        {
          method: 'POST',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error muting group:', error);
      throw error;
    }
  },

  // ==================== POST ENDPOINTS ====================

  /**
   * Lấy posts của nhóm
   */
  getGroupPosts: async (groupId, page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { posts: [] };
    }
  },

  /**
   * Tìm posts
   */
  searchPosts: async (groupId, keyword, page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error searching posts:', error);
      return { content: [] };
    }
  },

  /**
   * Tạo post trong nhóm
   */
  createGroupPost: async (groupId, postData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(postData)
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  /**
   * Cập nhật post
   */
  updateGroupPost: async (groupId, postId, postData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(postData)
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  /**
   * Xóa post
   */
  deleteGroupPost: async (groupId, postId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  /**
   * Like post
   */
  likePost: async (groupId, postId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}/like`,
        {
          method: 'POST',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  /**
   * Unlike post
   */
  unlikePost: async (groupId, postId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}/unlike`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  },

  // ==================== COMMENT ENDPOINTS ====================

  /**
   * Lấy comments của post
   */
  getPostComments: async (groupId, postId, page = 0, size = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}/comments?page=${page}&size=${size}`,
        { headers: getAuthHeaders() }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { comments: [] };
    }
  },

  /**
   * Tạo comment
   */
  createComment: async (groupId, postId, commentData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(commentData)
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  /**
   * Cập nhật comment
   */
  updateComment: async (groupId, postId, commentId, commentData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}/comments/${commentId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(commentData)
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  /**
   * Xóa comment
   */
  deleteComment: async (groupId, postId, commentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  /**
   * Like comment
   */
  likeComment: async (groupId, postId, commentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}/comments/${commentId}/like`,
        {
          method: 'POST',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  },

  /**
   * Unlike comment
   */
  unlikeComment: async (groupId, postId, commentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/${groupId}/posts/${postId}/comments/${commentId}/unlike`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error unliking comment:', error);
      throw error;
    }
  }
};

/**
 * Mock data generators
 */
const getMockGroups = () => {
  const categories = ['Education', 'Technology', 'Business', 'Health'];
  const groups = [];
  
  for (let i = 0; i < 12; i++) {
    groups.push({
      id: `group_${i}`,
      name: `Nhóm ${categories[i % categories.length]} ${i + 1}`,
      description: 'Mô tả nhóm chia sẻ kiến thức',
      coverImage: `https://api.dicebear.com/7.x/shapes/svg?seed=group${i}`,
      groupType: ['PUBLIC', 'PRIVATE', 'CLOSED'][i % 3],
      category: categories[i % categories.length],
      memberCount: Math.floor(Math.random() * 100) + 10,
      postCount: Math.floor(Math.random() * 50) + 5
    });
  }
  
  return { content: groups };
};

export default groupService;
