/**
 * profileService.js - Frontend service cho Profile
 * Quản lý API calls và mock data
 */

// Cài đặt
const USE_MOCK_SERVICE = true;
const API_BASE_URL = 'http://localhost:8080/api/v1/social/profiles';

// Hàm trì hoãn để giả lập delay API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== MOCK DATA ====================

// Mock profile
const mockProfile = {
  id: 1,
  userId: 1,
  firstName: 'Nguyễn',
  lastName: 'Văn A',
  bio: 'Sinh viên ở TP. Hồ Chí Minh 🎓 | Yêu thích lập trình, thiết kế UI/UX',
  phone: '+84 123 456 789',
  email: 'nguyenvana@example.com',
  website: 'https://nguyenvana.com',
  location: 'TP. Hồ Chí Minh, Việt Nam',
  dateOfBirth: '2003-05-15',
  gender: 'MALE',
  avatarUrl: 'https://via.placeholder.com/150/667eea/ffffff?text=Avatar',
  coverUrl: 'https://via.placeholder.com/1200x300/667eea/764ba2',
  followersCount: 1250,
  followingCount: 450,
  postsCount: 45,
  friendsCount: 320,
  isVerified: true,
  isPrivate: false,
  isActive: true,
  createdAt: '2022-01-15T10:00:00'
};

// Mock stories
const mockStories = [
  {
    id: 1,
    userId: 1,
    mediaUrl: 'https://via.placeholder.com/400x600/667eea/ffffff?text=Story+1',
    mediaType: 'IMAGE',
    caption: 'Một ngày đẹp trời 😊',
    viewsCount: 125,
    createdAt: '2025-12-17T08:00:00',
    expiresAt: '2025-12-18T08:00:00'
  },
  {
    id: 2,
    userId: 1,
    mediaUrl: 'https://via.placeholder.com/400x600/764ba2/ffffff?text=Story+2',
    mediaType: 'IMAGE',
    caption: 'Công việc ở nhà 💻',
    viewsCount: 98,
    createdAt: '2025-12-17T10:30:00',
    expiresAt: '2025-12-18T10:30:00'
  }
];

// Mock highlights
const mockHighlights = [
  {
    id: 1,
    userId: 1,
    title: 'Du lịch',
    description: 'Những chuyến du lịch yêu thích',
    thumbnailUrl: 'https://via.placeholder.com/100/667eea/ffffff?text=Travel',
    storyIds: [1, 2],
    viewsCount: 450,
    createdAt: '2025-11-01T00:00:00'
  },
  {
    id: 2,
    userId: 1,
    title: 'Công việc',
    description: 'Dự án và công việc',
    thumbnailUrl: 'https://via.placeholder.com/100/764ba2/ffffff?text=Work',
    storyIds: [],
    viewsCount: 320,
    createdAt: '2025-10-15T00:00:00'
  },
  {
    id: 3,
    userId: 1,
    title: 'Bạn bè',
    description: 'Khoảnh khắc với bạn bè',
    thumbnailUrl: 'https://via.placeholder.com/100/00d4ff/ffffff?text=Friends',
    storyIds: [],
    viewsCount: 280,
    createdAt: '2025-09-20T00:00:00'
  }
];

// Mock posts
const mockPosts = [
  {
    id: 1,
    userId: 1,
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://via.placeholder.com/50/667eea/ffffff?text=A',
    content: 'Hôm nay tôi hoàn thành project mới! 🎉 Cảm ơn mọi người đã hỗ trợ.',
    imageUrl: 'https://via.placeholder.com/500x400/667eea/ffffff?text=Project',
    likeCount: 145,
    commentCount: 23,
    shareCount: 12,
    createdAt: '2025-12-15T14:30:00',
    isLiked: false
  },
  {
    id: 2,
    userId: 1,
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://via.placeholder.com/50/667eea/ffffff?text=A',
    content: 'Học React hooks thực sự rất hay! useState, useEffect, useContext... Tất cả điều đó thật sự giúp ích cho việc phát triển component. #ReactJS',
    imageUrl: null,
    likeCount: 89,
    commentCount: 15,
    shareCount: 8,
    createdAt: '2025-12-14T09:15:00',
    isLiked: true
  },
  {
    id: 3,
    userId: 1,
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://via.placeholder.com/50/667eea/ffffff?text=A',
    content: 'Sáng nay đi tập gym, cảm thấy energized! 💪',
    imageUrl: 'https://via.placeholder.com/500x400/764ba2/ffffff?text=Gym',
    likeCount: 234,
    commentCount: 45,
    shareCount: 20,
    createdAt: '2025-12-13T07:00:00',
    isLiked: true
  },
  {
    id: 4,
    userId: 1,
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://via.placeholder.com/50/667eea/ffffff?text=A',
    content: 'Tham gia webinar về UI/UX Design từ các expert trong ngành. Rất hữu ích! 📚',
    imageUrl: null,
    likeCount: 76,
    commentCount: 12,
    shareCount: 5,
    createdAt: '2025-12-12T16:45:00',
    isLiked: false
  },
  {
    id: 5,
    userId: 1,
    userName: 'Nguyễn Văn A',
    userAvatar: 'https://via.placeholder.com/50/667eea/ffffff?text=A',
    content: 'Ra mắt ứng dụng learning platform - UpNestEdu! Rất tự hào! 🚀',
    imageUrl: 'https://via.placeholder.com/500x400/00d4ff/ffffff?text=App+Launch',
    likeCount: 567,
    commentCount: 89,
    shareCount: 145,
    createdAt: '2025-12-10T12:00:00',
    isLiked: true
  }
];

// Mock privacy settings
const mockPrivacySettings = {
  id: 1,
  userId: 1,
  postVisibility: 'PUBLIC',
  commentPermission: 'EVERYONE',
  reactionPermission: 'EVERYONE',
  allowTag: true,
  allowNotifications: true,
  createdAt: '2022-01-15T10:00:00'
};

// ==================== PROFILE OPERATIONS ====================

/**
 * Lấy hồ sơ của người dùng
 */
export const getProfile = async (userId) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(300);
      return mockProfile;
    }
    const response = await fetch(`${API_BASE_URL}/${userId}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy profile:', error);
    await delay(300);
    return mockProfile;
  }
};

/**
 * Cập nhật hồ sơ
 */
export const updateProfile = async (userId, profileData) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(400);
      return { ...mockProfile, ...profileData };
    }
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật profile:', error);
    await delay(400);
    return { ...mockProfile, ...profileData };
  }
};

/**
 * Upload ảnh đại diện
 */
export const uploadAvatar = async (userId, avatarUrl) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(500);
      return { ...mockProfile, avatarUrl };
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/avatar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatarUrl })
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi upload avatar:', error);
    await delay(500);
    return { ...mockProfile, avatarUrl };
  }
};

/**
 * Upload ảnh bìa
 */
export const uploadCover = async (userId, coverUrl) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(500);
      return { ...mockProfile, coverUrl };
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/cover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverUrl })
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi upload cover:', error);
    await delay(500);
    return { ...mockProfile, coverUrl };
  }
};

// ==================== STORY OPERATIONS ====================

/**
 * Lấy stories của người dùng
 */
export const getUserStories = async (userId) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(300);
      return mockStories;
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/stories`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy stories:', error);
    await delay(300);
    return mockStories;
  }
};

/**
 * Thêm story mới
 */
export const addStory = async (userId, mediaUrl, mediaType, caption) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(400);
      const newStory = {
        id: mockStories.length + 1,
        userId,
        mediaUrl,
        mediaType,
        caption,
        viewsCount: 0,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      mockStories.push(newStory);
      return newStory;
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/stories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaUrl, mediaType, caption })
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi thêm story:', error);
    await delay(400);
    return null;
  }
};

// ==================== HIGHLIGHT OPERATIONS ====================

/**
 * Lấy highlights của người dùng
 */
export const getUserHighlights = async (userId) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(300);
      return mockHighlights;
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/highlights`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy highlights:', error);
    await delay(300);
    return mockHighlights;
  }
};

/**
 * Tạo highlight mới
 */
export const createHighlight = async (userId, title, description, thumbnailUrl) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(400);
      const newHighlight = {
        id: mockHighlights.length + 1,
        userId,
        title,
        description,
        thumbnailUrl,
        storyIds: [],
        viewsCount: 0,
        createdAt: new Date().toISOString()
      };
      mockHighlights.push(newHighlight);
      return newHighlight;
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/highlights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, thumbnailUrl })
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi tạo highlight:', error);
    await delay(400);
    return null;
  }
};

// ==================== FOLLOW OPERATIONS ====================

/**
 * Follow người dùng
 */
export const followUser = async (userId) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(300);
      return { success: true };
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/follow`, {
      method: 'POST'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi follow:', error);
    await delay(300);
    return { success: true };
  }
};

/**
 * Unfollow người dùng
 */
export const unfollowUser = async (userId) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(300);
      return { success: true };
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/follow`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi unfollow:', error);
    await delay(300);
    return { success: true };
  }
};

// ==================== PRIVACY SETTINGS ====================

/**
 * Lấy cài đặt riêng tư
 */
export const getPrivacySettings = async (userId) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(300);
      return mockPrivacySettings;
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/privacy`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy privacy settings:', error);
    await delay(300);
    return mockPrivacySettings;
  }
};

/**
 * Cập nhật cài đặt riêng tư
 */
export const updatePrivacySettings = async (userId, settings) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(400);
      return { ...mockPrivacySettings, ...settings };
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/privacy`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật privacy settings:', error);
    await delay(400);
    return { ...mockPrivacySettings, ...settings };
  }
};

// ==================== POSTS OPERATIONS ====================

/**
 * Lấy posts của người dùng
 */
export const getUserPosts = async (userId) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(400);
      return mockPosts;
    }
    const response = await fetch(`${API_BASE_URL}/${userId}/posts`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi lấy posts:', error);
    await delay(400);
    return mockPosts;
  }
};

// ==================== SEARCH OPERATIONS ====================

/**
 * Tìm kiếm profile
 */
export const searchProfiles = async (keyword) => {
  try {
    if (USE_MOCK_SERVICE) {
      await delay(300);
      return [mockProfile]; // Trả về mock kết quả tìm kiếm
    }
    const response = await fetch(`${API_BASE_URL}/search?keyword=${keyword}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error);
    await delay(300);
    return [mockProfile];
  }
};

export default {
  getProfile,
  updateProfile,
  uploadAvatar,
  uploadCover,
  getUserStories,
  addStory,
  getUserHighlights,
  createHighlight,
  followUser,
  unfollowUser,
  getPrivacySettings,
  updatePrivacySettings,
  getUserPosts,
  searchProfiles
};
