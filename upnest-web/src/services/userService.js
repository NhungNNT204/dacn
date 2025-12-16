/**
 * API Service - User Management
 * Quản lý tất cả các call API liên quan đến User
 */

const API_BASE_URL = 'http://localhost:8080/api';

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
 * Xử lý response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API Error');
  }
  return response.json();
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
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: 'GET',
    headers: getHeaders(true),
  });
  return handleResponse(response);
};

/**
 * Lấy hồ sơ của user khác
 */
export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
    method: 'GET',
    headers: getHeaders(false),
  });
  return handleResponse(response);
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
