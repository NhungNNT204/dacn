import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Home, TrendingUp, Bookmark, Plus } from 'lucide-react';
import { getPersonalizedFeed, getTrendingFeed, getSavedPosts, addReaction, savePost, unsavePost, sharePost, reportPost, hidePost, deletePost, createPost } from '../../services/feedService';
import { getActivityFeed } from '../../services/activityService';
import FeedPostCard from './components/FeedPostCard';
import CreatePost from './CreatePost';
import CommentSection from './components/CommentSection';
import ShareModal from './components/ShareModal';
import ReportModal from './components/ReportModal';
import './styles/HomeFeed.css';
import ActivityCard from './components/ActivityCard';

/**
 * HomeFeed - Trang chủ với dòng thời gian cá nhân hoá
 * Hiển thị các bài đăng từ bạn bè, pages, groups, courses
 */
export default function HomeFeed() {
    const [feedType, setFeedType] = useState('personalized'); // personalized, trending, saved, activity
    const [posts, setPosts] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPost, setSelectedPost] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [sharePostId, setSharePostId] = useState(null);
    const [reportPostId, setReportPostId] = useState(null);
    const observerTarget = useRef(null);
    
    // Load initial posts
    useEffect(() => {
        loadFeed();
    }, [feedType]);
    
    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                loadMorePosts();
            }
        }, { threshold: 0.1 });
        
        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }
        
        return () => observer.disconnect();
    }, [hasMore, loading]);
    
    const loadFeed = async () => {
        setLoading(true);
        setPage(0);
        setPosts([]);
        setActivities([]);
        
        try {
            let response;
            if (feedType === 'activity') {
                response = await getActivityFeed(0, 10);
                if (response.success) {
                    setActivities(response.data);
                    setHasMore(response.totalPages > 1);
                }
                return;
            } else if (feedType === 'trending') {
                response = await getTrendingFeed(0, 10);
            } else if (feedType === 'saved') {
                response = await getSavedPosts(0, 10);
            } else {
                response = await getPersonalizedFeed(0, 10);
            }
            
            if (response.success) {
                setPosts(response.data);
                setHasMore(response.totalPages > 1);
            }
        } catch (error) {
            console.error('Error loading feed:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const loadMorePosts = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        const nextPage = page + 1;
        
        try {
            let response;
            if (feedType === 'activity') {
                response = await getActivityFeed(nextPage, 10);
                if (response.success) {
                    setActivities([...activities, ...response.data]);
                    setPage(nextPage);
                    setHasMore(nextPage < response.totalPages);
                }
                return;
            } else if (feedType === 'trending') {
                response = await getTrendingFeed(nextPage, 10);
            } else if (feedType === 'saved') {
                response = await getSavedPosts(nextPage, 10);
            } else {
                response = await getPersonalizedFeed(nextPage, 10);
            }
            
            if (response.success) {
                setPosts([...posts, ...response.data]);
                setPage(nextPage);
                setHasMore(nextPage < response.totalPages);
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleReaction = useCallback(async (postId, reactionType) => {
        try {
            const result = await addReaction(postId, reactionType);
            if (result.success) {
                // Update UI
                setPosts(posts.map(p => {
                    if (p.id === postId) {
                        const updatedPost = { ...p };
                        if (result.action === 'removed') {
                            updatedPost.likeCount = Math.max(0, updatedPost.likeCount - 1);
                            updatedPost.userReactionType = null;
                        } else if (result.action === 'added') {
                            updatedPost.likeCount += 1;
                            updatedPost.userReactionType = reactionType;
                        } else {
                            updatedPost.userReactionType = reactionType;
                        }
                        return updatedPost;
                    }
                    return p;
                }));
            }
        } catch (error) {
            console.error('Error handling reaction:', error);
        }
    }, [posts]);
    
    const handleCommentClick = (postId) => {
        setSelectedPost(postId);
        setShowComments(true);
    };
    
    const handleShareClick = (postId) => {
        setSharePostId(postId);
        setShowShareModal(true);
    };
    
    const handleSaveClick = useCallback(async (postId) => {
        try {
            const post = posts.find(p => p.id === postId);
            let result;
            
            if (post.isSaved) {
                result = await unsavePost(postId);
            } else {
                result = await savePost(postId);
            }
            
            if (result.success) {
                setPosts(posts.map(p =>
                    p.id === postId ? { ...p, isSaved: !p.isSaved } : p
                ));
            }
        } catch (error) {
            console.error('Error saving post:', error);
        }
    }, [posts]);
    
    const handleMenuClick = (postId) => {
        setReportPostId(postId);
        setShowReportModal(true);
    };
    
    return (
        <div className="home-feed">
            {/* Header */}
            <div className="feed-header">
                <div className="feed-header-content">
                    <h1>Trang chủ</h1>
                    
                    {/* Search */}
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            
            <div className="feed-container">
                {/* Sidebar */}
                <aside className="feed-sidebar">
                    <nav className="feed-nav">
                        <button
                            className={`nav-item ${feedType === 'personalized' ? 'active' : ''}`}
                            onClick={() => setFeedType('personalized')}
                        >
                            <Home size={20} />
                            <span>Dòng thời gian</span>
                        </button>
                        <button
                            className={`nav-item ${feedType === 'activity' ? 'active' : ''}`}
                            onClick={() => setFeedType('activity')}
                        >
                            <Plus size={20} />
                            <span>Hoạt động học tập</span>
                        </button>
                        <button
                            className={`nav-item ${feedType === 'trending' ? 'active' : ''}`}
                            onClick={() => setFeedType('trending')}
                        >
                            <TrendingUp size={20} />
                            <span>Xu hướng</span>
                        </button>
                        <button
                            className={`nav-item ${feedType === 'saved' ? 'active' : ''}`}
                            onClick={() => setFeedType('saved')}
                        >
                            <Bookmark size={20} />
                            <span>Đã lưu</span>
                        </button>
                    </nav>
                </aside>
                
                {/* Feed */}
                <main className="feed-main">
                    {feedType !== 'activity' && (
                    <CreatePost
                        onPostCreated={async (newPost) => {
                            // optimistic UI: push to top immediately
                            setPosts((prev) => [newPost, ...prev]);
                            try {
                                // map CreatePost shape to backend feedService.createPost
                                const postType = (newPost.type || 'status').toUpperCase();
                                const res = await createPost(
                                    newPost.content,
                                    postType,
                                    newPost.imageUrl || null,
                                    newPost.videoUrl || null
                                );
                                if (res?.success && res?.data) {
                                    setPosts((prev) => prev.map((p) => (p.id === newPost.id ? res.data : p)));
                                }
                            } catch (e) {
                                console.error('Error creating post:', e);
                            }
                        }}
                    />
                    )}
                    {loading && posts.length === 0 ? (
                        <div className="feed-loading">
                            <div className="spinner"></div>
                            <p>{feedType === 'activity' ? 'Đang tải hoạt động...' : 'Đang tải bài viết...'}</p>
                        </div>
                    ) : (feedType === 'activity' ? activities.length === 0 : posts.length === 0) ? (
                        <div className="feed-empty">
                            <p>{feedType === 'activity' ? 'Chưa có hoạt động học tập từ người bạn follow.' : 'Không có bài viết nào'}</p>
                        </div>
                    ) : (
                        <div className="posts-list">
                            {feedType === 'activity'
                              ? activities.map((a) => <ActivityCard key={a.id} activity={a} />)
                              : posts.map(post => (
                                  <FeedPostCard
                                      key={post.id}
                                      post={post}
                                      onReactionClick={handleReaction}
                                      onCommentClick={handleCommentClick}
                                      onShareClick={handleShareClick}
                                      onSaveClick={handleSaveClick}
                                      onMenuClick={handleMenuClick}
                                  />
                                ))}
                            <div ref={observerTarget} className="observer-target">
                                {loading && <p>Đang tải thêm...</p>}
                            </div>
                        </div>
                    )}
                </main>
                
                {/* Right Sidebar */}
                <aside className="feed-right-sidebar">
                    <div className="suggested-content">
                        <h3>Được đề xuất cho bạn</h3>
                        <p>Nội dung sẽ được cập nhật</p>
                    </div>
                </aside>
            </div>
            
            {/* Modals */}
            {showComments && (
                <CommentSection
                    postId={selectedPost}
                    onClose={() => {
                        setShowComments(false);
                        setSelectedPost(null);
                    }}
                />
            )}
            
            {showShareModal && (
                <ShareModal
                    postId={sharePostId}
                    onClose={() => setShowShareModal(false)}
                    onShare={async (postId, message, shareType) => {
                        await sharePost(postId, message, shareType || 'FEED');
                        setShowShareModal(false);
                    }}
                />
            )}
            
            {showReportModal && (
                <ReportModal
                    postId={reportPostId}
                    onClose={() => setShowReportModal(false)}
                    onReport={async (postId, reportType, reason) => {
                        await reportPost(postId, reportType, reason);
                        setShowReportModal(false);
                    }}
                    onHide={async (postId) => {
                        await hidePost(postId);
                        setPosts(posts.filter(p => p.id !== postId));
                        setShowReportModal(false);
                    }}
                    onDelete={async (postId) => {
                        await deletePost(postId);
                        setPosts(posts.filter(p => p.id !== postId));
                        setShowReportModal(false);
                    }}
                />
            )}
        </div>
    );
}
