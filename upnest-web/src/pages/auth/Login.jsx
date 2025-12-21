import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowLeft, Smartphone } from 'lucide-react';
import { login, verify2FA, saveAuthData } from '../../services/authService';
import './Login.css';

/**
 * Component: Login
 * Trang đăng nhập
 */
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [is2faRequired, setIs2faRequired] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await login(username, password);

      // Backend LUÔN yêu cầu 2FA
      if (data.is2faRequired) {
        setIs2faRequired(true);
        setUserEmail(data.email || username);
        return;
      }

      // Nếu có token (trường hợp này không còn xảy ra nữa vì backend luôn yêu cầu 2FA)
      if (data.token) {
        saveAuthData(data, rememberMe);
        navigate('/dashboard');
      } else {
        throw new Error('Không nhận được token từ server');
      }
    } catch (err) {
      // Hiển thị lỗi rõ ràng hơn
      let errorMessage = err.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      // Nếu là lỗi kết nối, thêm hướng dẫn
      if (errorMessage.includes('Không thể kết nối đến server')) {
        errorMessage = `${errorMessage}\n\n💡 Hướng dẫn:\n1. Mở Terminal/PowerShell\n2. Chạy: cd edu\n3. Chạy: .\\mvnw.cmd spring-boot:run\n4. Đợi backend khởi động xong\n5. Thử đăng nhập lại`;
      }
      
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await verify2FA(userEmail, otpCode);

      // Lưu token và thông tin user
      if (data.token) {
        saveAuthData(data, rememberMe);
        navigate('/dashboard');
      } else {
        throw new Error('Không nhận được token từ server');
      }
    } catch (err) {
      setError(err.message || 'Xác thực 2FA thất bại. Vui lòng thử lại.');
      console.error('2FA verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setIs2faRequired(false);
    setOtpCode('');
    setError('');
  };

  // Hiển thị form nhập OTP nếu cần 2FA
  if (is2faRequired) {
    return (
      <div className="login-container">
        <div className="login-box ui-surface ui-card-lg ui-animate-pop">
          <div className="login-header">
            <div className="twofa-icon-wrapper">
              <Shield className="twofa-icon" size={48} />
            </div>
            <h1>Xác Thực 2 Bước</h1>
            <p>Nhập mã 6 số từ ứng dụng xác thực của bạn</p>
            <div className="twofa-hint">
              <Smartphone size={16} />
              <span>Mở ứng dụng Google Authenticator hoặc Microsoft Authenticator</span>
            </div>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="otp">
                <Lock size={16} />
                Mã OTP (6 số)
              </label>
              <div className="otp-input-wrapper">
                <input
                  id="otp"
                  type="text"
                  value={otpCode}
                  onChange={(e) => {
                    // Chỉ cho phép nhập số và tối đa 6 ký tự
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpCode(value);
                  }}
                  placeholder="000000"
                  required
                  disabled={isLoading}
                  className="ui-input otp-input"
                  maxLength={6}
                  autoFocus
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                />
                <div className="otp-dots">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span
                      key={i}
                      className={`otp-dot ${i < otpCode.length ? 'filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="login-btn ui-btn ui-btn-primary"
              disabled={isLoading || otpCode.length !== 6}
            >
              {isLoading ? (
                <>
                  <span className="ui-spinner" aria-hidden="true" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Xác Thực
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBackToLogin}
              className="login-btn ui-btn ui-btn-secondary"
              disabled={isLoading}
            >
              <ArrowLeft size={18} />
              Quay lại
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Form đăng nhập thông thường
  return (
    <div className="login-container">
      <div className="login-box ui-surface ui-card-lg ui-animate-pop">
        <div className="login-header">
          <h1>Đăng Nhập</h1>
          <p>Chào mừng bạn quay trở lại UpNestEdu</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập hoặc Email</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập hoặc email"
              required
              disabled={isLoading}
              className="ui-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
              disabled={isLoading}
              className="ui-input"
            />
          </div>

          <div className="form-remember">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="remember">Ghi nhớ tôi</label>
            <a href="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            className="login-btn ui-btn ui-btn-primary"
            disabled={isLoading || !username || !password}
          >
            {isLoading ? (
              <>
                <span className="ui-spinner" aria-hidden="true" />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Chưa có tài khoản?{' '}
            <a href="/register" className="register-link">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
