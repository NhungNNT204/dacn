/**
 * API Service - User Management with Error Handling & Mock Fallback
 * Quản lý tất cả các call API liên quan đến User
 */

import mockUserService from './mockUserService';

const API_BASE_URL = 'http://localhost:8080/api';
const USE_MOCK_SERVICE = true; // Set to false when backend is ready

/**
 * Lấy token từ localStorage
 */
const getToken = () => {
  return localStorage.getItem('accessToken');
};

/**
 * Tạo headers cho request
 */
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Xử lý response với null check
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Check for null data
  if (!data) {
    throw new Error('Received null response from server');
  }
  
  return data;
};

/**
 * Wrapper để gọi API với fallback to mock service
 */
const fetchWithFallback = async (endpoint, options = {}, mockFallback = null) => {
  try {
    // Nếu USE_MOCK_SERVICE bật, dùng mock service
    if (USE_MOCK_SERVICE) {
      console.log('Using mock service for:', endpoint);
      if (mockFallback && typeof mockFallback === 'function') {
        return await mockFallback();
      }
      throw new Error('No mock fallback available');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(!endpoint.includes('public')),
      ...options
    });

    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    
    // Fallback to mock service
    if (mockFallback && typeof mockFallback === 'function') {
      try {
        console.log('Falling back to mock service');
        return await mockFallback();
      } catch (mockError) {
        console.error('Mock service error:', mockError);
        return { success: false, data: null, message: error.message };
      }
    }

    return { success: false, data: null, message: error.message };
  }
};

// ============ AUTHENTICATION ============

/**
 * Đăng ký tài khoản
 */
export const registerUser = async (data) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * Đăng nhập
 */
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

/**
 * Kiểm tra tên đăng nhập có sẵn
 */
export const checkUsernameAvailability = async (username) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/check-username?username=${encodeURIComponent(username)}`,
    {
      method: 'GET',
      headers: getHeaders(false),
    }
  );
  return handleResponse(response);
};

/**
 * Kiểm tra email có sẵn
 */
export const checkEmailAvailability = async (email) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: getHeaders(false),
    }
  );
  return handleResponse(response);
};

// ============ PROFILE ============

/**
 * Lấy hồ sơ của user hiện tại
 */
export const getMyProfile = async () => {
  try {
    if (USE_MOCK_SERVICE) {
      return await mockUserService.getProfile();
    }
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching profile:', error);
    try {
      return await mockUserService.getProfile();
    } catch (mockError) {
      return { success: false, data: null, message: error.message };
    }
  }
};

/**
 * Lấy hồ sơ của user khác
 */
export const getUserProfile = async (userId) => {
  try {
    if (USE_MOCK_SERVICE) {
      return await mockUserService.getProfile();
    }
    const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    try {
      return await mockUserService.getProfile();
    } catch (mockError) {
      return { success: false, data: null, message: error.message };
    }
  }
};

/**
 * Cập nhật hồ sơ
 */
export const updateProfile = async (data) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * Cập nhật avatar
 */
export const updateAvatar = async (avatarUrl) => {
  const response = await fetch(`${API_BASE_URL}/users/profile/avatar`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ avatarUrl }),
  });
  return handleResponse(response);
};

// ============ PRIVACY SETTINGS ============

/**
 * Lấy cài đặt quyền riêng tư
 */
export const getPrivacySettings = async () => {
  const response = await fetch(`${API_BASE_URL}/users/privacy-settings`, {
    method: 'GET',
    headers: getHeaders(true),
  });
  return handleResponse(response);
};

/**
 * Cập nhật cài đặt quyền riêng tư
 */
export const updatePrivacySettings = async (data) => {
  const response = await fetch(`${API_BASE_URL}/users/privacy-settings`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

/**
 * Đặt lại cài đặt quyền riêng tư về mặc định
 */
export const resetPrivacySettings = async () => {
  const response = await fetch(`${API_BASE_URL}/users/privacy-settings/reset`, {
    method: 'POST',
    headers: getHeaders(true),
  });
  return handleResponse(response);
};

// ============ UTILITIES ============

/**
 * Logout - Xóa token
 */
export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('rememberMe');
};

/**
 * Kiểm tra user đã đăng nhập
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Lấy thông tin user hiện tại từ localStorage
 */
export const getCurrentUser = () => {
  return {
    userId: localStorage.getItem('userId'),
    username: localStorage.getItem('username'),
    accessToken: getToken(),
  };
};

// Default export for compatibility
export default {
  registerUser,
  loginUser,
  checkUsernameAvailability,
  checkEmailAvailability,
  getMyProfile,
  getUserProfile,
  updateProfile,
  updateAvatar,
  getPrivacySettings,
  updatePrivacySettings,
  resetPrivacySettings,
  logoutUser,
  isAuthenticated,
  getCurrentUser,
};

