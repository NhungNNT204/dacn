import React, { useState, useEffect } from 'react';
import videoService from '../../services/videoService';
import VideoPlayer from './VideoPlayer';
import VideoCard from './VideoCard';
import VideoComments from './VideoComments';
import './WatchPage.css';

const WatchPage = ({ videoId }) => {
  const [video, setVideo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('comments');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [discoveryVideos, setDiscoveryVideos] = useState([]);
  const [discoveryType, setDiscoveryType] = useState('trending');

  // Load video detail
  useEffect(() => {
    fetchVideoDetail();
  }, [videoId]);

  const fetchVideoDetail = async () => {
    try {
      setLoading(true);
      const data = await videoService.getVideoDetail(videoId);
      setVideo(data);
      setIsLiked(data.isLiked || false);
      await Promise.all([
        fetchRecommendations(),
        fetchComments(),
        fetchDiscoveryVideos('trending')
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const data = await videoService.getRecommendations(videoId, 0, 5);
      setRecommendations(data.content || []);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    }
  };

  const fetchComments = async (page = 0) => {
    try {
      const data = await videoService.getVideoComments(videoId, page, 10);
      setComments(data.content || []);
      setCurrentPage(page);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const fetchDiscoveryVideos = async (type) => {
    try {
      let data;
      if (type === 'category' && selectedCategory) {
        data = await videoService.getVideosByCategory(selectedCategory, 0, 10);
      } else {
        data = await videoService.getDiscoveryVideos(type, 0, 10);
      }
      setDiscoveryVideos(data.content || []);
      setDiscoveryType(type);
    } catch (err) {
      console.error('Error fetching discovery videos:', err);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await videoService.unlikeVideo(videoId);
      } else {
        await videoService.likeVideo(videoId);
      }
      setIsLiked(!isLiked);
      fetchVideoDetail();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await videoService.addComment(videoId, { content: newComment });
      setNewComment('');
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await videoService.deleteComment(commentId);
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await videoService.likeComment(commentId);
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="watch-loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="watch-error">Lỗi: {error}</div>;
  }

  if (!video) {
    return <div className="watch-error">Video không tìm thấy</div>;
  }

  return (
    <div className="watch-page">
      <div className="watch-container">
        {/* Main Video Player */}
        <div className="watch-main">
          <VideoPlayer video={video} />

          {/* Video Info */}
          <div className="video-info">
            <h1 className="video-title">{video.title}</h1>

            <div className="video-stats">
              <span className="stat">
                <i className="icon-eye"></i>
                {video.viewCount?.toLocaleString()} lượt xem
              </span>
              <span className="stat">
                <i className="icon-clock"></i>
                {new Date(video.createdAt).toLocaleDateString('vi-VN')}
              </span>
              <span className="stat category-badge">{video.category}</span>
              <span className="stat level-badge">{video.level}</span>
            </div>

            {/* Creator Info */}
            <div className="creator-info">
              <div className="creator-left">
                <img 
                  src={video.creatorAvatar || '/default-avatar.png'} 
                  alt={video.creatorName}
                  className="creator-avatar"
                />
                <div className="creator-details">
                  <h3 className="creator-name">{video.creatorName}</h3>
                  <p className="creator-bio">{video.creatorBio}</p>
                </div>
              </div>
              <button className="btn-subscribe">Đăng ký</button>
            </div>

            {/* Description */}
            <div className="video-description">
              <h3>Mô tả</h3>
              <p>{video.description}</p>
              {video.tags && video.tags.length > 0 && (
                <div className="tags">
                  {video.tags.map((tag, idx) => (
                    <span key={idx} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className={`btn-action ${isLiked ? 'active' : ''}`}
                onClick={handleLike}
              >
                <i className="icon-thumb-up"></i>
                <span>{video.likeCount || 0}</span>
              </button>
              <button className="btn-action">
                <i className="icon-share"></i>
                <span>Chia sẻ</span>
              </button>
              <button className="btn-action">
                <i className="icon-bookmark"></i>
                <span>Lưu</span>
              </button>
              <button className="btn-action">
                <i className="icon-more"></i>
                <span>Thêm</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Bình luận ({video.commentCount || 0})
              </button>
              <button 
                className={`tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Chi tiết
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'comments' && (
              <div className="comments-section">
                {/* Add Comment Form */}
                <div className="add-comment">
                  <img 
                    src="/default-avatar.png" 
                    alt="Your avatar"
                    className="comment-avatar"
                  />
                  <form onSubmit={handleAddComment} className="comment-form">
                    <input
                      type="text"
                      placeholder="Viết bình luận..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="comment-input"
                    />
                    <button 
                      type="submit" 
                      disabled={!newComment.trim()}
                      className="btn-post-comment"
                    >
                      Đăng
                    </button>
                  </form>
                </div>

                {/* Comments List */}
                <VideoComments
                  comments={comments}
                  onDeleteComment={handleDeleteComment}
                  onLikeComment={handleLikeComment}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      disabled={currentPage === 0}
                      onClick={() => fetchComments(currentPage - 1)}
                    >
                      Trước
                    </button>
                    <span>{currentPage + 1} / {totalPages}</span>
                    <button 
                      disabled={currentPage >= totalPages - 1}
                      onClick={() => fetchComments(currentPage + 1)}
                    >
                      Tiếp
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="details-section">
                <p><strong>Ngôn ngữ:</strong> {video.language}</p>
                <p><strong>Mức độ:</strong> {video.level}</p>
                <p><strong>Đánh giá:</strong> {video.rating?.toFixed(1)} / 5</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Recommendations & Discovery */}
        <aside className="watch-sidebar">
          {/* Recommendations */}
          <div className="recommendations">
            <h3>Gợi ý cho bạn</h3>
            <div className="video-grid">
              {recommendations.map(vid => (
                <VideoCard 
                  key={vid.id} 
                  video={vid}
                  onClick={() => window.location.href = `/watch/${vid.id}`}
                />
              ))}
            </div>
          </div>

          {/* Discovery Tabs */}
          <div className="discovery">
            <div className="discovery-tabs">
              <button 
                className={`tab ${discoveryType === 'trending' ? 'active' : ''}`}
                onClick={() => fetchDiscoveryVideos('trending')}
              >
                Xu hướng
              </button>
              <button 
                className={`tab ${discoveryType === 'popular' ? 'active' : ''}`}
                onClick={() => fetchDiscoveryVideos('popular')}
              >
                Phổ biến
              </button>
              <button 
                className={`tab ${discoveryType === 'recent' ? 'active' : ''}`}
                onClick={() => fetchDiscoveryVideos('recent')}
              >
                Mới
              </button>
            </div>

            <div className="discovery-videos">
              {discoveryVideos.map(vid => (
                <VideoCard 
                  key={vid.id} 
                  video={vid}
                  compact
                  onClick={() => window.location.href = `/watch/${vid.id}`}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WatchPage;
