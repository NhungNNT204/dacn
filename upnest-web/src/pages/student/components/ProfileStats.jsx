import React from 'react';
import { Users, UserCheck, Heart } from 'lucide-react';

/**
 * ProfileStats - Thống kê hồ sơ
 */
const ProfileStats = ({ profile }) => {
  return (
    <div className="profile-stats">
      <div className="stat-item">
        <span className="stat-number">{profile.postsCount}</span>
        <span className="stat-label">Bài viết</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{profile.followersCount}</span>
        <span className="stat-label">Người theo dõi</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{profile.followingCount}</span>
        <span className="stat-label">Đang theo dõi</span>
      </div>
      <div className="stat-item">
        <span className="stat-number">{profile.friendsCount}</span>
        <span className="stat-label">Bạn bè</span>
      </div>
    </div>
  );
};

export default ProfileStats;
