/**
 * feedService.js - Frontend service layer cho News Feed
 * Hỗ trợ mock data hoặc API thực
 */

// Default to real API; we still fallback to mock when the API is unreachable.
const USE_MOCK_SERVICE = false;
const API_BASE_URL = 'http://localhost:8080/api/v1/social/posts';

const getToken = () => localStorage.getItem('accessToken');
const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
};

// Mock data
const mockPosts = [
    {
        id: 1,
        authorId: 1,
        authorName: 'Nguyễn Anh',
        authorAvatar: 'https://i.pravatar.cc/150?img=1',
        authorType: 'USER',
        content: 'Vừa hoàn thành project CSS Grid! 🎉 Rất hài lòng với kết quả. Cảm ơn các bạn đã giúp đỡ!',
        postType: 'TEXT',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
        videoUrl: null,
        videoThumbnail: null,
        likeCount: 24,
        commentCount: 5,
        shareCount: 2,
        viewCount: 145,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isSaved: false,
        isLiked: false,
        userReactionType: null,
        recentComments: [
            {
                id: 101,
                userId: 2,
                userName: 'Lê Thảo',
                userAvatar: 'https://i.pravatar.cc/150?img=2',
                content: 'Quá tuyệt vời! 👍',
                imageUrl: null,
                likeCount: 3,
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                isReply: false
            }
        ],
        reactionTypes: ['LIKE', 'LOVE', 'WOW'],
        attachments: []
    },
    {
        id: 2,
        authorId: 2,
        authorName: 'Lê Thảo',
        authorAvatar: 'https://i.pravatar.cc/150?img=2',
        authorType: 'USER',
        content: 'Ai có thể giải thích cách hoạt động của JavaScript async/await? Mình đang bị mắc kẹt 😅',
        postType: 'TEXT',
        imageUrl: null,
        videoUrl: null,
        videoThumbnail: null,
        likeCount: 12,
        commentCount: 8,
        shareCount: 0,
        viewCount: 89,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        isSaved: false,
        isLiked: false,
        userReactionType: null,
        recentComments: [],
        reactionTypes: ['LIKE'],
        attachments: []
    },
    {
        id: 3,
        authorId: 3,
        authorName: 'Trần nhung',
        authorAvatar: 'https://i.pravatar.cc/150?img=3',
        authorType: 'USER',
        content: 'Chúng tôi vừa khởi động một dự án React mới! Rất vui được cộng tác với đội của mình. #ReactJS #WebDevelopment',
        postType: 'IMAGE',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500',
        videoUrl: null,
        videoThumbnail: null,
        likeCount: 58,
        commentCount: 12,
        shareCount: 5,
        viewCount: 234,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        isSaved: false,
        isLiked: false,
        userReactionType: null,
        recentComments: [],
        reactionTypes: ['LIKE', 'LOVE', 'WOW', 'HAHA'],
        attachments: []
    },
    {
        id: 4,
        authorId: 4,
        authorName: 'Phạm Linh',
        authorAvatar: 'https://i.pravatar.cc/150?img=4',
        authorType: 'USER',
        content: 'Video hướng dẫn tạo một ứng dụng todo list với React Hooks. Đây là bước đầu tiên để học React!',
        postType: 'VIDEO',
        imageUrl: null,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f70259b51?w=500',
        likeCount: 89,
        commentCount: 23,
        shareCount: 15,
        viewCount: 456,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        isSaved: false,
        isLiked: false,
        userReactionType: null,
        recentComments: [],
        reactionTypes: ['LIKE', 'LOVE', 'HAHA'],
        attachments: []
    },
    {
        id: 5,
        authorId: 5,
        authorName: 'Đỗ Minh',
        authorAvatar: 'https://i.pravatar.cc/150?img=5',
        authorType: 'USER',
        content: 'Kế hoạch học tập của tôi cho tháng này:\n1. Học HTML5\n2. Học CSS3\n3. Học JavaScript\n4. Học React\n5. Xây dựng portfolio',
        postType: 'TEXT',
        imageUrl: null,
        videoUrl: null,
        videoThumbnail: null,
        likeCount: 42,
        commentCount: 7,
        shareCount: 8,
        viewCount: 178,
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        isSaved: false,
        isLiked: false,
        userReactionType: null,
        recentComments: [],
        reactionTypes: ['LIKE', 'WOW'],
        attachments: []
    }
];

const mockComments = {
    1: [
        {
            id: 101,
            userId: 2,
            userName: 'Lê Thảo',
            userAvatar: 'https://i.pravatar.cc/150?img=2',
            content: 'Quá tuyệt vời! 👍',
            imageUrl: null,
            likeCount: 3,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            isReply: false,
            parentCommentId: null,
            replies: []
        },
        {
            id: 102,
            userId: 3,
            userName: 'Trần nhung',
            userAvatar: 'https://i.pravatar.cc/150?img=3',
            content: 'Xin hỏi bạn dùng công cụ gì? Mình muốn học CSS Grid',
            imageUrl: null,
            likeCount: 1,
            createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            isReply: false,
            parentCommentId: null,
            replies: [
                {
                    id: 103,
                    userId: 1,
                    userName: 'Nguyễn Anh',
                    userAvatar: 'https://i.pravatar.cc/150?img=1',
                    content: 'Mình dùng VS Code + Live Server extension. Rất tiện!',
                    imageUrl: null,
                    likeCount: 2,
                    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    isReply: true,
                    parentCommentId: 102
                }
            ]
        }
    ]
};

// Simulated delay for realistic UX
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Lấy dòng thời gian cá nhân hoá
 */
export const getPersonalizedFeed = async (page = 0, size = 10) => {
    if (USE_MOCK_SERVICE) {
        await delay(500);
        const start = page * size;
        const end = start + size;
        const posts = mockPosts.slice(start, end);
        return {
            success: true,
            data: posts,
            totalPages: Math.ceil(mockPosts.length / size),
            totalElements: mockPosts.length
        };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/feed?page=${page}&size=${size}`, {
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching feed:', error);
        return getPersonalizedFeed(page, size); // Fallback to mock
    }
};

/**
 * Lấy bài đăng trending
 */
export const getTrendingFeed = async (page = 0, size = 10) => {
    if (USE_MOCK_SERVICE) {
        await delay(500);
        const sorted = [...mockPosts].sort((a, b) => b.likeCount - a.likeCount);
        const start = page * size;
        const end = start + size;
        const posts = sorted.slice(start, end);
        return {
            success: true,
            data: posts,
            totalPages: Math.ceil(sorted.length / size),
            totalElements: sorted.length
        };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/trending?page=${page}&size=${size}`, {
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching trending:', error);
        return getTrendingFeed(page, size); // Fallback to mock
    }
};

/**
 * Lấy bài đăng được lưu
 */
export const getSavedPosts = async (page = 0, size = 10) => {
    if (USE_MOCK_SERVICE) {
        await delay(500);
        const saved = mockPosts.filter(p => p.isSaved);
        const start = page * size;
        const end = start + size;
        return {
            success: true,
            data: saved.slice(start, end),
            totalPages: Math.ceil(saved.length / size),
            totalElements: saved.length
        };
    }

    try {
        const response = await fetch(`${API_BASE_URL}/saved?page=${page}&size=${size}`, {
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching saved posts:', error);
        // Fallback: show mock saved
        return getSavedPosts(page, size);
    }
};

/**
 * Tạo bài đăng
 */
export const createPost = async (content, postType = 'TEXT', imageUrl = null, videoUrl = null) => {
    if (USE_MOCK_SERVICE) {
        await delay(800);
        const newPost = {
            id: mockPosts.length + 1,
            authorId: 1,
            authorName: 'Nguyễn Anh',
            authorAvatar: 'https://i.pravatar.cc/150?img=1',
            authorType: 'USER',
            content,
            postType,
            imageUrl,
            videoUrl,
            videoThumbnail: null,
            likeCount: 0,
            commentCount: 0,
            shareCount: 0,
            viewCount: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isSaved: false,
            isLiked: false,
            userReactionType: null,
            recentComments: [],
            reactionTypes: [],
            attachments: []
        };
        mockPosts.unshift(newPost);
        return { success: true, data: newPost };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ content, postType, imageUrl, videoUrl })
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Thêm reaction vào bài đăng
 */
export const addReaction = async (postId, reactionType) => {
    if (USE_MOCK_SERVICE) {
        await delay(300);
        const post = mockPosts.find(p => p.id === postId);
        if (post) {
            if (post.userReactionType === reactionType) {
                post.likeCount = Math.max(0, post.likeCount - 1);
                post.userReactionType = null;
                return { success: true, action: 'removed' };
            } else if (post.userReactionType) {
                post.userReactionType = reactionType;
                return { success: true, action: 'updated' };
            } else {
                post.likeCount += 1;
                post.userReactionType = reactionType;
                if (!post.reactionTypes.includes(reactionType)) {
                    post.reactionTypes.push(reactionType);
                }
                return { success: true, action: 'added' };
            }
        }
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}/react`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ reactionType })
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding reaction:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Thêm bình luận
 */
export const addComment = async (postId, content, imageUrl = null) => {
    if (USE_MOCK_SERVICE) {
        await delay(400);
        const post = mockPosts.find(p => p.id === postId);
        if (post) {
            const newComment = {
                id: Date.now(),
                userId: 1,
                userName: 'Nguyễn Anh',
                userAvatar: 'https://i.pravatar.cc/150?img=1',
                content,
                imageUrl,
                likeCount: 0,
                createdAt: new Date().toISOString(),
                isReply: false,
                parentCommentId: null,
                replies: []
            };
            if (!mockComments[postId]) {
                mockComments[postId] = [];
            }
            mockComments[postId].push(newComment);
            post.commentCount += 1;
            return { success: true, data: newComment };
        }
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}/comments`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ content, imageUrl })
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding comment:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Lấy bình luận của bài đăng
 */
export const getPostComments = async (postId, page = 0, size = 5) => {
    if (USE_MOCK_SERVICE) {
        await delay(300);
        const comments = mockComments[postId] || [];
        const start = page * size;
        const end = start + size;
        return {
            success: true,
            data: comments.slice(start, end),
            totalPages: Math.ceil(comments.length / size),
            totalElements: comments.length
        };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}/comments?page=${page}&size=${size}`, {
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        return getPostComments(postId, page, size); // Fallback to mock
    }
};

/**
 * Lưu bài đăng
 */
export const savePost = async (postId) => {
    if (USE_MOCK_SERVICE) {
        await delay(300);
        const post = mockPosts.find(p => p.id === postId);
        if (post) {
            post.isSaved = true;
            return { success: true, message: 'Post saved' };
        }
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}/save`, {
            method: 'POST',
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving post:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Bỏ lưu bài đăng
 */
export const unsavePost = async (postId) => {
    if (USE_MOCK_SERVICE) {
        await delay(300);
        const post = mockPosts.find(p => p.id === postId);
        if (post) {
            post.isSaved = false;
            return { success: true, message: 'Post unsaved' };
        }
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}/save`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error unsaving post:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Chia sẻ bài đăng
 */
export const sharePost = async (postId, shareMessage = '', shareType = 'FEED') => {
    if (USE_MOCK_SERVICE) {
        await delay(300);
        const post = mockPosts.find(p => p.id === postId);
        if (post) {
            post.shareCount += 1;
            return { success: true, message: 'Post shared' };
        }
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}/share`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ shareMessage, shareType })
        });
        return await response.json();
    } catch (error) {
        console.error('Error sharing post:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Báo cáo bài đăng
 */
export const reportPost = async (postId, reportType, reason) => {
    if (USE_MOCK_SERVICE) {
        await delay(400);
        return { success: true, message: 'Post reported successfully' };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}/report`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ reportType, reason })
        });
        return await response.json();
    } catch (error) {
        console.error('Error reporting post:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Ẩn bài đăng
 */
export const hidePost = async (postId) => {
    if (USE_MOCK_SERVICE) {
        await delay(300);
        return { success: true, message: 'Post hidden' };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}/hide`, {
            method: 'POST',
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error hiding post:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Xóa bài đăng
 */
export const deletePost = async (postId) => {
    if (USE_MOCK_SERVICE) {
        await delay(300);
        const index = mockPosts.findIndex(p => p.id === postId);
        if (index > -1) {
            mockPosts.splice(index, 1);
            return { success: true, message: 'Post deleted' };
        }
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Tìm kiếm bài đăng
 */
export const searchPosts = async (keyword, page = 0, size = 10) => {
    if (USE_MOCK_SERVICE) {
        await delay(500);
        const results = mockPosts.filter(p =>
            p.content.toLowerCase().includes(keyword.toLowerCase()) ||
            p.authorName.toLowerCase().includes(keyword.toLowerCase())
        );
        const start = page * size;
        const end = start + size;
        return {
            success: true,
            data: results.slice(start, end),
            totalPages: Math.ceil(results.length / size),
            totalElements: results.length
        };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/search?keyword=${keyword}&page=${page}&size=${size}`, {
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error searching posts:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Lấy thống kê bài đăng
 */
export const getPostStats = async (postId) => {
    if (USE_MOCK_SERVICE) {
        await delay(200);
        const post = mockPosts.find(p => p.id === postId);
        if (post) {
            return {
                success: true,
                data: {
                    postId,
                    likes: post.likeCount,
                    comments: post.commentCount,
                    shares: post.shareCount,
                    views: post.viewCount,
                    reactionBreakdown: {
                        LIKE: post.userReactionType === 'LIKE' ? 1 : 0,
                        LOVE: post.userReactionType === 'LOVE' ? 1 : 0,
                        HAHA: post.userReactionType === 'HAHA' ? 1 : 0,
                        WOW: post.userReactionType === 'WOW' ? 1 : 0,
                        SAD: post.userReactionType === 'SAD' ? 1 : 0,
                        ANGRY: post.userReactionType === 'ANGRY' ? 1 : 0
                    }
                }
            };
        }
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${postId}/stats`, {
            headers: getHeaders()
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching post stats:', error);
        return { success: false, message: error.message };
    }
};
