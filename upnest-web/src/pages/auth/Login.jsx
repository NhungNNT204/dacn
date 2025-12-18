import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

/**
 * Component: Login
 * Trang đăng nhập
 */
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,  // Backend expects 'email', not 'username'
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const data = await response.json();

      // Lưu token
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
