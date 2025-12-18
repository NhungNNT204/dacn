/**
 * StudentFeed.jsx
 * Main Feed Page - Display posts, filter content, and show suggestions
 * Features: Content filtering, post creation, suggested materials/events
 */

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle, Loader } from 'lucide-react';
import PostCreator from './PostCreator';
import PostCard from './PostCard';
import FeedFilter from './FeedFilter';
import SuggestedContent from './SuggestedContent';
import postInteractionService from '../../services/postInteractionService';
import '../styles/StudentFeed.css';

const FILTER_TABS = {
  ALL: 'all',
  LESSONS: 'lessons',
  GROUPS: 'groups',
  FRIENDS: 'friends'
};

export default function StudentFeed() {
  // State management
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState(FILTER_TABS.ALL);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    hasMore: true,
    total: 0
  });

  // Get current user (from auth context or localStorage)
  const getCurrentUserId = useCallback(() => {
    return localStorage.getItem('userId') || 'user-1';
  }, []);

  const getCurrentUserFriends = useCallback(() => {
    // This would come from your user service
    return ['user-2', 'user-3', 'user-4', 'user-5'];
  }, []);

  const getCurrentUserGroups = useCallback(() => {
    // This would come from your user service
    return ['group-1', 'group-2', 'group-3'];
  }, []);

  // Load feed posts
  const loadFeed = useCallback(async (filterType = activeFilter, page = 1) => {
    setIsLoadingPosts(true);
    setError(null);

    try {
      const result = await postInteractionService.getFeed({
        filterType,
        page,
        limit: 10,
        userId: getCurrentUserId(),
        friendIds: getCurrentUserFriends(),
        groupIds: getCurrentUserGroups()
      });

      if (result.success) {
        if (page === 1) {
          setPosts(result.data);
          setFilteredPosts(result.data);
        } else {
          setPosts([...posts, ...result.data]);
          setFilteredPosts([...filteredPosts, ...result.data]);
        }

        setPageInfo({
          page,
          hasMore: result.hasMore || false,
          total: result.total || 0
        });
      } else {
        setError(result.message || 'Failed to load feed');
      }
    } catch (err) {
      setError('Error loading feed: ' + err.message);
      console.error('Feed loading error:', err);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [activeFilter, getCurrentUserId, getCurrentUserFriends, getCurrentUserGroups, posts, filteredPosts]);

  // Handle filter change
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
    setPageInfo({ page: 1, hasMore: true, total: 0 });
  }, []);

  // Refresh feed
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeed(activeFilter, 1);
    setRefreshing(false);
  }, [loadFeed, activeFilter]);

  // Load more posts
  const handleLoadMore = useCallback(() => {
    if (pageInfo.hasMore && !isLoadingPosts) {
      loadFeed(activeFilter, pageInfo.page + 1);
    }
  }, [pageInfo, isLoadingPosts, loadFeed, activeFilter]);

  // Handle post creation
  const handlePostCreated = useCallback((newPost) => {
    setPosts([newPost, ...posts]);
    setFilteredPosts([newPost, ...filteredPosts]);
  }, [posts, filteredPosts]);

  // Handle post deletion
  const handlePostDeleted = useCallback((postId) => {
    setPosts(posts.filter(p => p.id !== postId));
    setFilteredPosts(filteredPosts.filter(p => p.id !== postId));
  }, [posts, filteredPosts]);

  // Handle post update
  const handlePostUpdated = useCallback((updatedPost) => {
    const updatedPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    setPosts(updatedPosts);
    setFilteredPosts(updatedPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
  }, [posts, filteredPosts]);

  // Detect mobile layout
  useEffect(() => {
    const checkMobileLayout = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileLayout(isMobile);
      setShowSuggestions(!isMobile);
    };

    checkMobileLayout();
    window.addEventListener('resize', checkMobileLayout);

    return () => window.removeEventListener('resize', checkMobileLayout);
  }, []);

  // Load initial feed
  useEffect(() => {
    loadFeed(activeFilter, 1);
  }, [activeFilter, loadFeed]);

  // Render empty state
  if (isLoadingPosts && posts.length === 0) {
    return (
      <div className="student-feed empty-state">
        <div className="loading-container">
          <Loader className="spinner" />
          <p>Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-feed">
      {/* Error Banner */}
      {error && (
        <div className="feed-error-banner">
          <AlertCircle className="error-icon" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      <div className="feed-container">
        {/* Main Feed Area */}
        <div className="feed-main">
          {/* Header with Filter and Refresh */}
          <div className="feed-header">
            <div className="header-content">
              <h1>Bảng tin học tập</h1>
              <p>Khám phá hoạt động, bài học và nội dung từ bạn bè</p>
            </div>
            <button 
              className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh feed"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Filter Bar */}
          <FeedFilter 
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />

          {/* Post Creator */}
          <PostCreator 
            onPostCreated={handlePostCreated}
            placeholder="Chia sẻ suy nghĩ học tập của bạn..."
          />

          {/* Posts Feed */}
          <div className="posts-container">
            {filteredPosts.length === 0 ? (
              <div className="empty-feed">
                <div className="empty-state-icon">📭</div>
                <h3>Không có bài viết nào</h3>
                <p>
                  {activeFilter === FILTER_TABS.FRIENDS
                    ? 'Hãy kết bạn để xem hoạt động của họ'
                    : activeFilter === FILTER_TABS.GROUPS
                    ? 'Hãy tham gia nhóm để xem bài viết'
                    : activeFilter === FILTER_TABS.LESSONS
                    ? 'Hãy đăng ký khóa học để xem bài viết từ giảng viên'
                    : 'Hãy tạo bài viết đầu tiên!'}
                </p>
              </div>
            ) : (
              <>
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handlePostDeleted}
                    onUpdate={handlePostUpdated}
                  />
                ))}

                {/* Load More Button */}
                {pageInfo.hasMore && (
                  <div className="load-more-container">
                    <button
                      className="load-more-button"
                      onClick={handleLoadMore}
                      disabled={isLoadingPosts}
                    >
                      {isLoadingPosts ? (
                        <>
                          <Loader size={16} className="spinner" />
                          Loading...
                        </>
                      ) : (
                        `Load more posts (${pageInfo.total - filteredPosts.length} remaining)`
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Loading indicator at bottom */}
          {isLoadingPosts && posts.length > 0 && (
            <div className="posts-loading">
              <Loader className="spinner" size={20} />
              <span>Loading more posts...</span>
            </div>
          )}
        </div>

        {/* Sidebar with Suggestions */}
        {showSuggestions && (
          <aside className="feed-sidebar">
            <SuggestedContent 
              userId={getCurrentUserId()}
              friendIds={getCurrentUserFriends()}
              groupIds={getCurrentUserGroups()}
            />
          </aside>
        )}
      </div>

      {/* Mobile Suggestions Toggle */}
      {isMobileLayout && !showSuggestions && (
        <button 
          className="mobile-suggestions-toggle"
          onClick={() => setShowSuggestions(true)}
        >
          💡 Gợi ý & Sự kiện
        </button>
      )}

      {/* Mobile Suggestions Overlay */}
      {isMobileLayout && showSuggestions && (
        <div className="mobile-suggestions-overlay">
          <div className="suggestions-header">
            <h3>Gợi ý & Sự kiện</h3>
            <button
              className="close-suggestions"
              onClick={() => setShowSuggestions(false)}
            >
              ✕
            </button>
          </div>
          <SuggestedContent 
            userId={getCurrentUserId()}
            friendIds={getCurrentUserFriends()}
            groupIds={getCurrentUserGroups()}
          />
        </div>
      )}
    </div>
  );
}
