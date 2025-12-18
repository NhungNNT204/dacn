/**
 * SuggestedContent.jsx
 * Sidebar showing suggested materials, similar resources, and events
 * Features: Learning materials, similar courses, upcoming webinars/events
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Bookmark, Calendar, TrendingUp, ExternalLink, Loader, AlertCircle } from 'lucide-react';
import postInteractionService from '../../services/postInteractionService';
import '../styles/SuggestedContent.css';

export default function SuggestedContent({ userId, friendIds, groupIds }) {
  // State
  const [suggestedMaterials, setSuggestedMaterials] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [activeTab, setActiveTab] = useState('materials');
  const [error, setError] = useState(null);
  const [savedItems, setSavedItems] = useState(new Set());

  // Load suggested content
  useEffect(() => {
    const loadSuggestions = async () => {
      setIsLoadingSuggestions(true);
      setError(null);

      try {
        // Fetch suggested materials
        const materialsResult = await postInteractionService.getSuggestedMaterials({
          userId,
          limit: 5
        });

        if (materialsResult.success) {
          setSuggestedMaterials(materialsResult.data);
        }

        // Fetch upcoming events
        const eventsResult = await postInteractionService.getUpcomingEvents({
          groupIds,
          limit: 5
        });

        if (eventsResult.success) {
          setUpcomingEvents(eventsResult.data);
        }

        // Fetch trending posts
        const trendingResult = await postInteractionService.getTrendingPosts({
          userId,
          limit: 3
        });

        if (trendingResult.success) {
          setTrendingPosts(trendingResult.data);
        }
      } catch (err) {
        setError('Failed to load suggestions');
        console.error('Suggestions loading error:', err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    loadSuggestions();
  }, [userId, groupIds]);

  // Handle save material
  const handleSaveMaterial = useCallback((materialId) => {
    setSavedItems(prev => {
      const updated = new Set(prev);
      if (updated.has(materialId)) {
        updated.delete(materialId);
      } else {
        updated.add(materialId);
      }
      return updated;
    });
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Hôm nay ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Ngày mai ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('vi-VN');
  };

  // Render loading state
  if (isLoadingSuggestions) {
    return (
      <div className="suggested-content loading">
        <Loader className="spinner" size={24} />
        <p>Loading suggestions...</p>
      </div>
    );
  }

  return (
    <div className="suggested-content">
      {/* Error message */}
      {error && (
        <div className="suggestion-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="suggestion-tabs">
        <button
          className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          <Bookmark size={16} />
          <span>Tài liệu</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={16} />
          <span>Sự kiện</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          <TrendingUp size={16} />
          <span>Xu hướng</span>
        </button>
      </div>

      {/* Content Sections */}
      <div className="suggestion-content">
        {/* Suggested Materials Tab */}
        {activeTab === 'materials' && (
          <div className="materials-section">
            <h3>Tài liệu gợi ý</h3>
            {suggestedMaterials.length === 0 ? (
              <div className="empty-suggestion">
                <p>Không có tài liệu gợi ý</p>
              </div>
            ) : (
              <div className="materials-list">
                {suggestedMaterials.map(material => (
                  <div key={material.id} className="material-card">
                    <div className="material-header">
                      <h4>{material.title}</h4>
                      <button
                        className={`save-button ${savedItems.has(material.id) ? 'saved' : ''}`}
                        onClick={() => handleSaveMaterial(material.id)}
                        title={savedItems.has(material.id) ? 'Remove from saved' : 'Save'}
                      >
                        <Bookmark size={16} fill={savedItems.has(material.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                    
                    <p className="material-description">{material.description}</p>
                    
                    <div className="material-meta">
                      <span className="subject-tag">{material.subject}</span>
                      <span className="level-tag">{material.level}</span>
                    </div>

                    <div className="material-stats">
                      <span>👁️ {material.views || 0} views</span>
                      <span>⭐ {material.rating || 0}/5</span>
                    </div>

                    <a href={material.url} target="_blank" rel="noopener noreferrer" className="material-link">
                      Xem chi tiết <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="events-section">
            <h3>Sự kiện & Webinar</h3>
            {upcomingEvents.length === 0 ? (
              <div className="empty-suggestion">
                <p>Không có sự kiện sắp tới</p>
              </div>
            ) : (
              <div className="events-list">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-date">
                      <span className="date-day">
                        {new Date(event.startDate).getDate()}
                      </span>
                      <span className="date-month">
                        {new Date(event.startDate).toLocaleString('vi-VN', { month: 'short' })}
                      </span>
                    </div>

                    <div className="event-info">
                      <h4>{event.title}</h4>
                      <p className="event-description">{event.description}</p>
                      
                      <div className="event-details">
                        <span className="event-time">
                          🕐 {formatDate(event.startDate)}
                        </span>
                        <span className="event-location">
                          📍 {event.location || 'Online'}
                        </span>
                      </div>

                      {event.speakers && event.speakers.length > 0 && (
                        <div className="event-speakers">
                          <span className="speakers-label">Diễn giả:</span>
                          {event.speakers.map((speaker, idx) => (
                            <span key={idx} className="speaker-badge">
                              {speaker}
                            </span>
                          ))}
                        </div>
                      )}

                      <button className="event-register-btn">
                        Đăng ký {event.attendees && `(${event.attendees} tham gia)`}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Trending Posts Tab */}
        {activeTab === 'trending' && (
          <div className="trending-section">
            <h3>Bài viết xu hướng</h3>
            {trendingPosts.length === 0 ? (
              <div className="empty-suggestion">
                <p>Không có bài viết xu hướng</p>
              </div>
            ) : (
              <div className="trending-list">
                {trendingPosts.map((post, index) => (
                  <div key={post.id} className="trending-item">
                    <div className="trending-rank">#{index + 1}</div>
                    
                    <div className="trending-info">
                      <h4>{post.title || post.content.substring(0, 50)}</h4>
                      
                      <p className="trending-author">
                        By <strong>{post.authorName}</strong>
                      </p>

                      <div className="trending-stats">
                        <span>❤️ {post.reactions?.like || 0}</span>
                        <span>💬 {post.commentCount || 0}</span>
                        <span>↗️ {post.shares || 0}</span>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="trending-tags">
                          {post.tags.map((tag, idx) => (
                            <span key={idx} className="tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <a href={`/post/${post.id}`} className="trending-link">
                      Xem →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="suggestion-footer">
        <p>💡 Nội dung được gợi ý dựa trên sở thích học tập của bạn</p>
      </div>
    </div>
  );
}
