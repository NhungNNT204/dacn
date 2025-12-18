import React from 'react';
import { Upload, Camera } from 'lucide-react';

/**
 * ProfileHeader - Header của profile gồm cover và avatar
 */
const ProfileHeader = ({ profile, isOwnProfile, onUploadCover, onUploadAvatar }) => {
  const handleCoverUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onUploadCover(url);
      }
    };
    input.click();
  };

  const handleAvatarUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onUploadAvatar(url);
      }
    };
    input.click();
  };

  return (
    <div className="profile-header">
      {/* Cover */}
      <div className="profile-cover">
        <img
          src={profile.coverUrl || 'https://via.placeholder.com/1200x300?text=Cover'}
          alt="cover"
        />
        {isOwnProfile && (
          <button className="cover-upload-btn" onClick={handleCoverUpload}>
            <Camera size={20} />
          </button>
        )}
      </div>

      {/* Avatar & Basic Info */}
      <div className="profile-header-content">
        <div className="profile-avatar-container">
          <img
            src={profile.avatarUrl || 'https://via.placeholder.com/150?text=Avatar'}
            alt="avatar"
            className="profile-avatar"
          />
          {isOwnProfile && (
            <button
              className="avatar-upload-btn"
              onClick={handleAvatarUpload}
              title="Đổi ảnh đại diện"
            >
              <Camera size={16} />
            </button>
          )}
        </div>

        <div className="profile-name-info">
          <h2>{profile.firstName} {profile.lastName}</h2>
          {profile.isVerified && <span className="badge-verified">✓ Verified</span>}
          <p className="profile-username">@username_{profile.userId}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
