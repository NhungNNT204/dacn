import React, { useState } from 'react';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Nguyễn Văn A',
        avatar: 'A',
        time: '2 giờ trước'
      },
      content: 'Vừa hoàn thành bài tập về React Hooks. Cảm thấy tự tin hơn rồi! 🎉',
      image: null,
      likes: 24,
      comments: 5,
      shares: 2,
      liked: false
    },
    {
      id: 2,
      author: {
        name: 'Trần Thị B',
        avatar: 'B',
        time: '4 giờ trước'
      },
      content: 'Ai có thể giúp tôi hiểu về State Management không? Tôi đang lúng túng với Redux.',
      image: null,
      likes: 15,
      comments: 8,
      shares: 1,
      liked: false
    },
    {
      id: 3,
      author: {
        name: 'Lê Minh C',
        avatar: 'L',
        time: '6 giờ trước'
      },
      content: 'Tổ chức thành công buổi học nhóm về JavaScript. Hôm nay chúng tôi làm được 3 bài tập khó! 📚',
      image: null,
      likes: 42,
      comments: 12,
      shares: 5,
      liked: false
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: {
          name: 'Bạn',
          avatar: '👤',
          time: 'Vừa xong'
        },
        content: newPost,
        image: null,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="feed">
      {/* Create Post Section */}
      <div className="create-post">
        <div className="create-post-header">
          <div className="post-avatar">👤</div>
          <input
            type="text"
            className="create-post-input"
            placeholder="Bạn đang nghĩ gì?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onClick={() => {
              const modal = document.getElementById('post-modal');
              if (modal) modal.style.display = 'block';
            }}
          />
        </div>
        <div className="create-post-actions">
          <button className="action-icon" title="Ảnh/Video">📷</button>
          <button className="action-icon" title="Cảm xúc">😊</button>
          <button className="action-icon" title="Địa điểm">📍</button>
          <button
            className="btn-post"
            onClick={handlePostSubmit}
            disabled={!newPost.trim()}
          >
            Đăng
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <div className="post-avatar">{post.author.avatar}</div>
            <div className="post-meta">
              <h4 className="post-author">{post.author.name}</h4>
              <p className="post-time">{post.author.time}</p>
            </div>
            <button className="post-menu-btn">⋯</button>
          </div>

          <div className="post-content">{post.content}</div>

          {post.image && (
            <img src={post.image} alt="Post" className="post-image" />
          )}

          <div className="post-stats">
            <span>👍 {post.likes}</span>
            <span>💬 {post.comments}</span>
            <span>↗️ {post.shares}</span>
          </div>

          <div className="post-actions">
            <button
              className={`action-btn ${post.liked ? 'liked' : ''}`}
              onClick={() => handleLike(post.id)}
            >
              <span className="action-icon">👍</span>
              <span>Thích</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">💬</span>
              <span>Bình luận</span>
            </button>
            <button className="action-btn">
              <span className="action-icon">↗️</span>
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      ))}

      {/* Load More */}
      <div className="load-more-container">
        <button className="btn-load-more">Xem thêm bài viết</button>
      </div>
    </div>
  );
};

export default Feed;
