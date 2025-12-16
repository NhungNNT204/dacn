import React, { useState, useEffect } from 'react';
import './Profile.css';

/**
 * Component: ProfileView
 * Xem thông tin hồ sơ
 */
export default function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/v1/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể tải hồ sơ');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="profile-loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!profile) {
    return <div className="profile-error">Không tìm thấy hồ sơ</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button
          className="edit-btn"
          onClick={() => setIsEditing(true)}
        >
          ✏️ Chỉnh sửa
        </button>
      </div>

      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar-section">
          <img
            src={profile.avatarUrl || 'https://via.placeholder.com/150'}
            alt={profile.fullName}
            className="profile-avatar"
          />
          <div className="avatar-info">
            <h2>{profile.fullName}</h2>
            <p className="username">@{profile.username}</p>
            <p className="email">{profile.email}</p>
          </div>
        </div>

        {/* Thông tin cơ bản */}
        <div className="profile-section">
          <h3>Thông Tin Cá Nhân</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Số điện thoại</label>
              <p>{profile.phoneNumber || 'Chưa cập nhật'}</p>
            </div>
            <div className="profile-item">
              <label>Giới tính</label>
              <p>{getGenderText(profile.gender)}</p>
            </div>
            <div className="profile-item">
              <label>Ngày sinh</label>
              <p>{profile.dateOfBirth || 'Chưa cập nhật'}</p>
            </div>
            <div className="profile-item">
              <label>Địa chỉ</label>
              <p>{profile.address || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>

        {/* Thông tin học tập */}
        <div className="profile-section">
          <h3>Thông Tin Học Tập</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Chuyên ngành</label>
              <p>{profile.specialization || 'Chưa cập nhật'}</p>
            </div>
            <div className="profile-item">
              <label>Tên trường</label>
              <p>{profile.institution || 'Chưa cập nhật'}</p>
            </div>
            <div className="profile-item">
              <label>Năm học</label>
              <p>{profile.academicYear || 'Chưa cập nhật'}</p>
            </div>
          </div>
        </div>

        {/* Giới thiệu */}
        <div className="profile-section">
          <h3>Giới Thiệu</h3>
          <p className="bio">{profile.bio || 'Chưa có giới thiệu'}</p>
        </div>

        {/* Liên kết xã hội */}
        <div className="profile-section">
          <h3>Liên Kết Xã Hội</h3>
          <div className="social-links">
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                <span>GitHub</span>
              </a>
            )}
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Thông tin khác */}
        <div className="profile-section profile-footer">
          <p className="created-date">
            Tham gia: {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      {isEditing && <ProfileEditModal profile={profile} onClose={() => {
        setIsEditing(false);
        fetchProfile();
      }} />}
    </div>
  );
}

/**
 * Component: ProfileEditModal
 * Modal chỉnh sửa hồ sơ
 */
function ProfileEditModal({ profile, onClose }) {
  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    phoneNumber: profile.phoneNumber || '',
    gender: profile.gender || 'MALE',
    dateOfBirth: profile.dateOfBirth || '',
    address: profile.address || '',
    specialization: profile.specialization || '',
    institution: profile.institution || '',
    academicYear: profile.academicYear || '',
    bio: profile.bio || '',
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    avatarUrl: profile.avatarUrl || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(profile.avatarUrl || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        setPreview(dataUrl);
        setFormData((prev) => ({
          ...prev,
          avatarUrl: dataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');

      // Cập nhật hồ sơ
      const response = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          specialization: formData.specialization,
          institution: formData.institution,
          academicYear: formData.academicYear,
          bio: formData.bio,
          githubUrl: formData.githubUrl,
          linkedinUrl: formData.linkedinUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Cập nhật thất bại');
      }

      // Cập nhật avatar nếu có
      if (formData.avatarUrl && formData.avatarUrl.startsWith('data:')) {
        await fetch('http://localhost:8080/api/v1/users/profile/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            avatarUrl: formData.avatarUrl,
          }),
        });
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh Sửa Hồ Sơ</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-form">
          {/* Avatar */}
          <div className="form-group">
            <label>Ảnh đại diện</label>
            <div className="avatar-upload">
              <img src={preview} alt="Preview" className="avatar-preview" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Họ tên */}
          <div className="form-group">
            <label htmlFor="fullName">Họ tên đầy đủ</label>
            <input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Thông tin cá nhân */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Ngày sinh</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Thông tin học tập */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="specialization">Chuyên ngành</label>
              <input
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="institution">Tên trường</label>
              <input
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="academicYear">Năm học</label>
            <input
              id="academicYear"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          {/* Giới thiệu */}
          <div className="form-group">
            <label htmlFor="bio">Giới thiệu</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              disabled={isLoading}
            />
          </div>

          {/* Liên kết xã hội */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="githubUrl">GitHub</label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="linkedinUrl">LinkedIn</label>
              <input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/..."
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper function
function getGenderText(gender) {
  const genders = {
    MALE: 'Nam',
    FEMALE: 'Nữ',
    OTHER: 'Khác',
  };
  return genders[gender] || 'Không xác định';
}
