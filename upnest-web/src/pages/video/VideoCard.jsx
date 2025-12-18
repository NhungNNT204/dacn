import React from 'react';
import './VideoCard.css';

const VideoCard = ({ video, compact = false, onClick }) => {
  const formatViews = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const formatDate = (date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffTime = now - videoDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  };

  return (
    <div 
      className={`video-card ${compact ? 'compact' : ''}`}
      onClick={onClick}
    >
      <div className="video-thumbnail">
        <img 
          src={video.thumbnail || '/default-video.png'} 
          alt={video.title}
          className="thumbnail-image"
        />
        <div className="thumbnail-overlay">
          <div className="play-icon">▶</div>
        </div>
        {video.duration && (
          <div className="duration-badge">
            {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      <div className="video-details">
        <h3 className="video-title">{video.title}</h3>
        
        <p className="creator-name">{video.creatorName}</p>
        
        <div className="video-meta">
          <span className="view-count">
            {formatViews(video.viewCount)} lượt xem
          </span>
          <span className="separator">•</span>
          <span className="upload-date">
            {formatDate(video.createdAt)}
          </span>
        </div>

        {!compact && (
          <>
            <div className="category-level">
              <span className="category-tag">{video.category}</span>
              <span className="level-tag">{video.level}</span>
            </div>
            
            <div className="engagement-stats">
              <span className="stat">
                <i className="icon-thumb-up"></i> {formatViews(video.likeCount)}
              </span>
              <span className="stat">
                <i className="icon-comment"></i> {formatViews(video.commentCount)}
              </span>
              {video.rating && (
                <span className="stat">
                  <i className="icon-star"></i> {video.rating.toFixed(1)}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
