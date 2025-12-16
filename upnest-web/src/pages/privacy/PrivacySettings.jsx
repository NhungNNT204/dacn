import React, { useState, useEffect } from 'react';
import './PrivacySettings.css';

/**
 * Component: PrivacySettings
 * Trang quản lý cài đặt quyền riêng tư
 */
export default function PrivacySettings() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [changes, setChanges] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/v1/users/privacy-settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải cài đặt');
      }

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (field) => {
    setChanges((prev) => ({
      ...prev,
      [field]: !settings[field],
    }));
  };

  const handleSelectChange = (field, value) => {
    setChanges((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('accessToken');

      const response = await fetch('http://localhost:8080/api/v1/users/privacy-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...settings,
          ...changes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cập nhật thất bại');
      }

      const data = await response.json();
      setSettings(data);
      setChanges({});
      setSuccess('Cài đặt đã được cập nhật');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Bạn có chắc muốn đặt lại cài đặt về mặc định?')) {
      setIsSaving(true);
      setError('');

      try {
        const token = localStorage.getItem('accessToken');

        const response = await fetch('http://localhost:8080/api/v1/users/privacy-settings/reset', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Đặt lại thất bại');
        }

        const data = await response.json();
        setSettings(data);
        setChanges({});
        setSuccess('Cài đặt đã được đặt lại về mặc định');

        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return <div className="privacy-loading">Đang tải...</div>;
  }

  if (!settings) {
    return <div className="privacy-error">{error || 'Không tìm thấy cài đặt'}</div>;
  }

  return (
    <div className="privacy-container">
      <div className="privacy-header">
        <h1>Cài Đặt Quyền Riêng Tư</h1>
        <p>Quản lý ai có thể xem thông tin cá nhân của bạn</p>
      </div>

      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      <div className="privacy-card">
        {/* Profile Visibility */}
        <section className="privacy-section">
          <div className="section-header">
            <h3>Hiển Thị Hồ Sơ</h3>
            <p className="section-desc">Kiểm soát ai có thể xem hồ sơ công khai của bạn</p>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Mức độ hiển thị hồ sơ</span>
              <span className="setting-desc">
                PUBLIC = Mọi người | ANYONE = Người dùng đăng nhập | FRIENDS_ONLY = Bạn bè | PRIVATE = Chỉ mình tôi
              </span>
            </div>
            <select
              value={changes.profileVisibility ?? settings.profileVisibility}
              onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
              disabled={isSaving}
              className="privacy-select"
            >
              <option value="PUBLIC">Công khai</option>
              <option value="ANYONE">Bất cứ ai đăng nhập</option>
              <option value="FRIENDS_ONLY">Chỉ bạn bè</option>
              <option value="PRIVATE">Riêng tư</option>
            </select>
          </div>
        </section>

        {/* Thông tin cá nhân */}
        <section className="privacy-section">
          <div className="section-header">
            <h3>Thông Tin Cá Nhân</h3>
            <p className="section-desc">Quản lý hiển thị thông tin liên hệ của bạn</p>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Hiển thị Email</span>
              <span className="setting-desc">Cho phép người khác xem email của bạn</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={changes.showEmail ?? settings.showEmail}
                onChange={() => handleToggle('showEmail')}
                disabled={isSaving}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Hiển thị Số điện thoại</span>
              <span className="setting-desc">Cho phép người khác xem số điện thoại của bạn</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={changes.showPhoneNumber ?? settings.showPhoneNumber}
                onChange={() => handleToggle('showPhoneNumber')}
                disabled={isSaving}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>

        {/* Liên hệ và kết nối */}
        <section className="privacy-section">
          <div className="section-header">
            <h3>Liên Hệ & Kết Nối</h3>
            <p className="section-desc">Kiểm soát cách người khác có thể tương tác với bạn</p>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Cho phép liên hệ từ</span>
              <span className="setting-desc">PUBLIC = Mọi người | FRIENDS_ONLY = Chỉ bạn bè | PRIVATE = Không ai</span>
            </div>
            <select
              value={changes.allowContactFrom ?? settings.allowContactFrom}
              onChange={(e) => handleSelectChange('allowContactFrom', e.target.value)}
              disabled={isSaving}
              className="privacy-select"
            >
              <option value="PUBLIC">Mọi người</option>
              <option value="FRIENDS_ONLY">Chỉ bạn bè</option>
              <option value="PRIVATE">Không ai</option>
            </select>
          </div>
        </section>

        {/* Hoạt động */}
        <section className="privacy-section">
          <div className="section-header">
            <h3>Hoạt Động</h3>
            <p className="section-desc">Kiểm soát hiển thị hoạt động của bạn</p>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Hiển thị Hoạt động</span>
              <span className="setting-desc">Cho phép người khác xem hoạt động của bạn</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={changes.showActivityStatus ?? settings.showActivityStatus}
                onChange={() => handleToggle('showActivityStatus')}
                disabled={isSaving}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Hiển thị Danh sách bạn bè</span>
              <span className="setting-desc">Cho phép người khác xem danh sách bạn bè của bạn</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={changes.showFriendsList ?? settings.showFriendsList}
                onChange={() => handleToggle('showFriendsList')}
                disabled={isSaving}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Có thể tìm kiếm được</span>
              <span className="setting-desc">Cho phép người khác tìm thấy bạn thông qua tìm kiếm</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={changes.isSearchable ?? settings.isSearchable}
                onChange={() => handleToggle('isSearchable')}
                disabled={isSaving}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>

        {/* Thông báo */}
        <section className="privacy-section">
          <div className="section-header">
            <h3>Thông Báo</h3>
            <p className="section-desc">Quản lý cách bạn nhận được thông báo</p>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Thông báo Email</span>
              <span className="setting-desc">Nhận thông báo qua email</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={changes.emailNotifications ?? settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
                disabled={isSaving}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-name">Thông báo Push</span>
              <span className="setting-desc">Nhận thông báo trên ứng dụng</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={changes.pushNotifications ?? settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
                disabled={isSaving}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="privacy-actions">
          <button
            className="reset-btn"
            onClick={handleReset}
            disabled={isSaving}
          >
            Đặt Lại Về Mặc Định
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={isSaving || Object.keys(changes).length === 0}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}
