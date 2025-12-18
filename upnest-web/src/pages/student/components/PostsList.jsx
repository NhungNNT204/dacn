import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from 'lucide-react';

/**
 * PostsList - Danh sách bài viết trong profile
 */
const PostsList = ({ posts, isOwnProfile }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="posts-empty">
        <p>Chưa có bài viết nào</p>
      </div>
    );
  }

  return (
    <div className="posts-list">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          {/* Header */}
          <div className="post-header">
            <div className="post-author-info">
              <img src={post.userAvatar} alt={post.userName} />
              <div>
                <h4>{post.userName}</h4>
                <span className="post-time">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
            {isOwnProfile && (
              <button className="post-menu-btn">
                <MoreHorizontal size={20} />
              </button>
            )}
          </div>

          {/* Content */}
          <p className="post-content">{post.content}</p>

          {/* Media */}
          {post.imageUrl && (
            <img src={post.imageUrl} alt="post" className="post-image" />
          )}

          {/* Stats */}
          <div className="post-stats">
            <span>{post.likeCount} lượt thích</span>
            <span>{post.commentCount} bình luận</span>
          </div>

          {/* Actions */}
          <div className="post-actions">
            <button className="action-btn">
              <Heart size={20} /> Thích
            </button>
            <button className="action-btn">
              <MessageCircle size={20} /> Bình luận
            </button>
            <button className="action-btn">
              <Share2 size={20} /> Chia sẻ
            </button>
            {isOwnProfile && (
              <button className="action-btn delete">
                <Trash2 size={20} /> Xóa
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
