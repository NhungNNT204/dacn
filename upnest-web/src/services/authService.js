/**
 * Authentication Service - Quản lý đăng nhập và 2FA
 */

const API_BASE_URL = 'http://localhost:8080/api/v1/auth';

/**
 * Đăng nhập - Bước 1: Xác thực email/password
 * @param {string} email - Email hoặc username
 * @param {string} password - Mật khẩu
 * @returns {Promise<{is2faRequired: boolean, email: string, token?: string}>}
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Đăng nhập thất bại';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Xử lý lỗi kết nối
    if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy tại http://localhost:8080 không?');
    }
    throw error;
  }
};

/**
 * Xác thực mã 2FA - Bước 2: Xác thực OTP
 * @param {string} email - Email của user
 * @param {string|number} code - Mã OTP 6 số
 * @returns {Promise<{token: string, fullName: string, email: string, role: string}>}
 */
export const verify2FA = async (email, code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        code: typeof code === 'string' ? parseInt(code, 10) : code,
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Mã OTP không đúng';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData || errorMessage;
      } catch (e) {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy tại http://localhost:8080 không?');
    }
    throw error;
  }
};

/**
 * Lưu thông tin đăng nhập vào localStorage
 * @param {object} authData - Dữ liệu đăng nhập
 * @param {boolean} rememberMe - Có ghi nhớ không
 */
export const saveAuthData = (authData, rememberMe = false) => {
  if (authData.token) {
    localStorage.setItem('accessToken', authData.token);
  }
  if (authData.fullName) {
    localStorage.setItem('fullName', authData.fullName);
  }
  if (authData.email) {
    localStorage.setItem('email', authData.email);
  }
  if (authData.role) {
    localStorage.setItem('role', authData.role);
  }
  if (rememberMe) {
    localStorage.setItem('rememberMe', 'true');
  }
};

/**
 * Xóa thông tin đăng nhập
 */
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('fullName');
  localStorage.removeItem('email');
  localStorage.removeItem('role');
  localStorage.removeItem('rememberMe');
};

export default {
  login,
  verify2FA,
  saveAuthData,
  clearAuthData,
};

