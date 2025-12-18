import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, X, Edit, Settings, UserPlus, UserMinus } from 'lucide-react';
import profileService from '../../services/profileService';
import '../styles/ProfilePage.css';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import StoryHighlights from './StoryHighlights';
import PostsList from './PostsList';
import FriendsModal from './FriendsModal';
import EditProfileModal from './EditProfileModal';
import PrivacySettingsModal from './PrivacySettingsModal';

/**
 * ProfilePage - Trang cá nhân người dùng
 * Hiển thị thông tin profile, posts, stories, bạn bè
 */
const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [stories, setStories] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [posts, setPosts] = useState([]);
  const [privacySettings, setPrivacySettings] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friendsType, setFriendsType] = useState('followers'); // followers, following
  const [activeTab, setActiveTab] = useState('posts'); // posts, photos, videos

  // Load dữ liệu profile
  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const profileData = await profileService.getProfile(userId);
      const storiesData = await profileService.getUserStories(userId);
      const highlightsData = await profileService.getUserHighlights(userId);
      const privacyData = await profileService.getPrivacySettings(userId);
      const postsData = await profileService.getUserPosts(userId);

      setProfile(profileData);
      setStories(storiesData);
      setHighlights(highlightsData);
      setPrivacySettings(privacyData);
      setPosts(postsData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await profileService.unfollowUser(userId);
      } else {
        await profileService.followUser(userId);
      }
      setIsFollowing(!isFollowing);
      setProfile(prev => ({
        ...prev,
        followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      }));
    } catch (error) {
      console.error('Lỗi:', error);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const updated = await profileService.updateProfile(userId, updatedData);
      setProfile(updated);
      setShowEditModal(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
    }
  };

  const handleUpdatePrivacy = async (settings) => {
    try {
      const updated = await profileService.updatePrivacySettings(userId, settings);
      setPrivacySettings(updated);
      setShowPrivacyModal(false);
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
    }
  };

  const handleUploadAvatar = async (avatarUrl) => {
    try {
      const updated = await profileService.uploadAvatar(userId, avatarUrl);
      setProfile(updated);
    } catch (error) {
      console.error('Lỗi khi upload:', error);
    }
  };

  const handleUploadCover = async (coverUrl) => {
    try {
      const updated = await profileService.uploadCover(userId, coverUrl);
      setProfile(updated);
    } catch (error) {
      console.error('Lỗi khi upload:', error);
    }
  };

  const handleAddStory = async () => {
    // Mở file picker cho hình ảnh/video
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        // Upload file (sử dụng URL giả trong demo)
        const mediaUrl = URL.createObjectURL(file);
        try {
          await profileService.addStory(userId, mediaUrl, file.type.startsWith('image') ? 'IMAGE' : 'VIDEO', '');
          const storiesData = await profileService.getUserStories(userId);
          setStories(storiesData);
        } catch (error) {
          console.error('Lỗi:', error);
        }
      }
    };
    input.click();
  };

  if (loading) {
    return <div className="profile-loading">Đang tải...</div>;
  }

  if (!profile) {
    return <div className="profile-error">Không tìm thấy hồ sơ</div>;
  }

  const isOwnProfile = userId === 1; // TODO: So với current user

  return (
    <div className="profile-page">
      {/* Cover & Avatar */}
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onUploadCover={handleUploadCover}
        onUploadAvatar={handleUploadAvatar}
      />

      {/* Profile Info & Actions */}
      <div className="profile-container">
        <div className="profile-main">
          {/* Thông tin cơ bản */}
          <div className="profile-info">
            <div className="profile-info-content">
              <h1>{profile.firstName} {profile.lastName}</h1>
              {profile.isVerified && <span className="verified-badge">✓</span>}
              
              <div className="profile-meta">
                {profile.location && <p>📍 {profile.location}</p>}
                {profile.website && <p>🔗 {profile.website}</p>}
                {profile.bio && <p>{profile.bio}</p>}
              </div>

              {/* Thống kê */}
              <ProfileStats profile={profile} />

              {/* Actions */}
              <div className="profile-actions">
                {isOwnProfile ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowEditModal(true)}
                    >
                      <Edit size={20} /> Chỉnh sửa hồ sơ
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowPrivacyModal(true)}
                    >
                      <Settings size={20} /> Quyền riêng tư
                    </button>
                  </>
                ) : (
                  <button
                    className={`btn ${isFollowing ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleFollow}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus size={20} /> Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus size={20} /> Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stories & Highlights */}
          {highlights.length > 0 && (
            <StoryHighlights
              highlights={highlights}
              onAddStory={handleAddStory}
              isOwnProfile={isOwnProfile}
            />
          )}

          {/* Tabs */}
          <div className="profile-tabs">
            <button
              className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              Bài viết
            </button>
            <button
              className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('friends');
                setShowFriendsModal(true);
              }}
            >
              Bạn bè ({profile.friendsCount})
            </button>
            <button
              className={`tab ${activeTab === 'photos' ? 'active' : ''}`}
              onClick={() => setActiveTab('photos')}
            >
              Ảnh
            </button>
          </div>

          {/* Posts List */}
          {activeTab === 'posts' && (
            <PostsList
              posts={posts}
              isOwnProfile={isOwnProfile}
            />
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="photos-grid">
              {posts.filter(p => p.imageUrl).map(post => (
                <div key={post.id} className="photo-item">
                  <img src={post.imageUrl} alt="photo" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="profile-sidebar">
          {/* Gợi ý bạn bè */}
          <div className="sidebar-card">
            <h3>Gợi ý bạn bè</h3>
            {/* Hiển thị gợi ý */}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateProfile}
        />
      )}

      {showPrivacyModal && (
        <PrivacySettingsModal
          settings={privacySettings}
          onClose={() => setShowPrivacyModal(false)}
          onSave={handleUpdatePrivacy}
        />
      )}

      {showFriendsModal && (
        <FriendsModal
          profile={profile}
          type={friendsType}
          onClose={() => setShowFriendsModal(false)}
          onTypeChange={setFriendsType}
        />
      )}
    </div>
  );
};

export default ProfilePage;
