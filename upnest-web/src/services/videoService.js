import axiosInstance from '../../utils/axiosInstance';

const API_BASE_URL = '/api/v1/videos';

const videoService = {
  // ==================== VIDEO CRUD ====================

  /**
   * Tạo video mới
   */
  createVideo: async (videoData) => {
    try {
      const response = await axiosInstance.post(API_BASE_URL, videoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Cập nhật video
   */
  updateVideo: async (videoId, videoData) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/${videoId}`, videoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Xóa video
   */
  deleteVideo: async (videoId) => {
    try {
      const response = await axiosInstance.delete(`${API_BASE_URL}/${videoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy chi tiết video
   */
  getVideoDetail: async (videoId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/${videoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy tất cả video
   */
  getAllVideos: async (page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(API_BASE_URL, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== VIDEO DISCOVERY ====================

  /**
   * Lấy video trending
   */
  getTrendingVideos: async (page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/discover/trending`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy video phổ biến
   */
  getPopularVideos: async (page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/discover/popular`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy video mới
   */
  getRecentVideos: async (page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/discover/recent`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy video theo danh mục
   */
  getVideosByCategory: async (category, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/category/${category}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy video theo mức độ
   */
  getVideosByLevel: async (level, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/level/${level}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy video của người tạo
   */
  getVideosByCreator: async (creatorId, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/creator/${creatorId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Tìm kiếm video
   */
  searchVideos: async (keyword, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/search`, {
        params: { keyword, page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy gợi ý video
   */
  getRecommendations: async (videoId, page = 0, size = 5) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/${videoId}/recommendations`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy video khám phá (generic discovery)
   */
  getDiscoveryVideos: async (type, page = 0, size = 10) => {
    try {
      const endpoint = `${API_BASE_URL}/discover/${type}`;
      const response = await axiosInstance.get(endpoint, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== VIDEO PUBLISH ====================

  /**
   * Xuất bản video
   */
  publishVideo: async (videoId) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/${videoId}/publish`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lưu trữ video
   */
  archiveVideo: async (videoId) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/${videoId}/archive`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== LIKE FUNCTIONALITY ====================

  /**
   * Like video
   */
  likeVideo: async (videoId) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/${videoId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Unlike video
   */
  unlikeVideo: async (videoId) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/${videoId}/unlike`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Kiểm tra video đã like chưa
   */
  isVideoLiked: async (videoId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/${videoId}/is-liked`);
      return response.data.isLiked;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== COMMENT FUNCTIONALITY ====================

  /**
   * Thêm bình luận
   */
  addComment: async (videoId, commentData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/${videoId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy bình luận của video
   */
  getVideoComments: async (videoId, page = 0, size = 10) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/${videoId}/comments`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Trả lời bình luận
   */
  replyToComment: async (videoId, commentId, replyData) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/${videoId}/comments/${commentId}/replies`,
        replyData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Lấy câu trả lời
   */
  getCommentReplies: async (commentId) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/comments/${commentId}/replies`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Cập nhật bình luận
   */
  updateComment: async (commentId, commentData) => {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Xóa bình luận
   */
  deleteComment: async (commentId) => {
    try {
      const response = await axiosInstance.delete(`${API_BASE_URL}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== COMMENT LIKES ====================

  /**
   * Like bình luận
   */
  likeComment: async (commentId) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Unlike bình luận
   */
  unlikeComment: async (commentId) => {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/comments/${commentId}/unlike`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default videoService;
