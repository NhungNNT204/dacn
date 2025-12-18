import React, { useState } from 'react';
import { X, UserPlus, UserMinus } from 'lucide-react';

/**
 * FriendsModal - Modal hiển thị danh sách bạn bè
 */
const FriendsModal = ({ profile, type, onClose, onTypeChange }) => {
  const [friends] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://via.placeholder.com/50',
      mutualFriends: 5,
      isFollowing: true
    },
    {
      id: 2,
      name: 'Trần Thị B',
      avatar: 'https://via.placeholder.com/50',
      mutualFriends: 3,
      isFollowing: false
    },
    // Thêm bạn bè khác...
  ]);

  return (
    <div className="friends-modal-overlay" onClick={onClose}>
      <div className="friends-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>{type === 'followers' ? 'Người theo dõi' : 'Đang theo dõi'}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="friends-tabs">
          <button
            className={`tab ${type === 'followers' ? 'active' : ''}`}
            onClick={() => onTypeChange('followers')}
          >
            Người theo dõi ({profile.followersCount})
          </button>
          <button
            className={`tab ${type === 'following' ? 'active' : ''}`}
            onClick={() => onTypeChange('following')}
          >
            Đang theo dõi ({profile.followingCount})
          </button>
        </div>

        {/* Friends List */}
        <div className="friends-list">
          {friends.map(friend => (
            <div key={friend.id} className="friend-item">
              <img src={friend.avatar} alt={friend.name} />
              <div className="friend-info">
                <h4>{friend.name}</h4>
                <p>{friend.mutualFriends} bạn chung</p>
              </div>
              <button className="friend-action">
                {friend.isFollowing ? (
                  <>
                    <UserMinus size={20} /> Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={20} /> Follow
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
