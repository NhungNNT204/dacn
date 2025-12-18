#!/usr/bin/env bash
# Installation & Integration Guide

## 1️⃣ INSTALL DEPENDENCIES (if not already installed)
npm install lucide-react

## 2️⃣ FILE STRUCTURE
Ensure files are in these locations:
✓ src/services/postInteractionService.js
✓ src/pages/student/components/PostCard.jsx
✓ src/pages/student/components/PostReactions.jsx
✓ src/pages/student/components/PostComments.jsx
✓ src/pages/student/components/CommentItem.jsx
✓ src/pages/student/components/PostCreator.jsx
✓ src/pages/student/components/TeacherModerationDashboard.jsx
✓ src/pages/student/styles/PostCard.css
✓ src/pages/student/styles/PostReactions.css
✓ src/pages/student/styles/PostComments.css
✓ src/pages/student/styles/CommentItem.css
✓ src/pages/student/styles/PostCreator.css
✓ src/pages/student/styles/TeacherModerationDashboard.css

## 3️⃣ USAGE IN YOUR PAGE

### Example 1: Display Posts in Group Page
```jsx
import React, { useState, useEffect } from 'react';
import PostCreator from './components/PostCreator';
import PostCard from './components/PostCard';
import postInteractionService from '../../services/postInteractionService';

export default function GroupForum({ groupId, isTeacher }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [groupId]);

  const loadPosts = async () => {
    const result = await postInteractionService.getPosts(groupId);
    if (result.success) {
      setPosts(result.data);
    }
    setIsLoading(false);
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <div className="forum-page">
      {/* Post Creator Form */}
      <PostCreator groupId={groupId} onPostCreated={handlePostCreated} />

      {/* Posts Feed */}
      <div className="posts-feed">
        {isLoading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              groupId={groupId}
              isTeacher={isTeacher}
              onPostDelete={handlePostDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
}
```

### Example 2: Show Teacher Moderation Dashboard
```jsx
import TeacherModerationDashboard from './components/TeacherModerationDashboard';

export default function TeacherPanel({ groupId }) {
  return (
    <div>
      <TeacherModerationDashboard groupId={groupId} />
    </div>
  );
}
```

## 4️⃣ CONFIGURATION

### Toggle Mock Service
File: `src/services/postInteractionService.js`
Line: ~11

```javascript
// Use mock data (no backend required)
const USE_MOCK_SERVICE = true;

// Use real API
const USE_MOCK_SERVICE = false;
```

### Change API Base URL
File: `src/services/postInteractionService.js`
Line: ~10

```javascript
const API_BASE_URL = 'http://your-api-domain.com/api/v1';
```

## 5️⃣ MOCK DATA STRUCTURE

### Mock Posts
- post-1: English homework with 1 image
- post-2: Math tutorial with 1 video

### Mock Comments
- 2-3 comments per post
- Mixed approval status (pending, approved)

### Access Mock Data
- No backend required
- In-memory data storage
- Resets on page refresh

## 6️⃣ FEATURE CHECKLIST

✅ Like/Reaction with 6 emoji types
✅ Add comments with text
✅ Comment attachments (images, files)
✅ React to comments
✅ Delete own posts/comments
✅ Upload images to posts
✅ Upload videos to posts
✅ Teacher approve/reject posts
✅ Teacher approve/reject comments
✅ Rejection reasons displayed
✅ Moderation dashboard
✅ Auto-refresh moderation queue
✅ Responsive design (desktop/tablet/mobile)
✅ Error handling & recovery
✅ Loading states & spinners
✅ Empty states
✅ Status badges & indicators
✅ Reaction counters
✅ Comment counters
✅ Share functionality

## 7️⃣ STYLING

### CSS Import in Components
Already included in component files:
```jsx
import '../styles/PostCard.css';
import '../styles/PostComments.css';
// etc...
```

### Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: 480px - 767px
- Small Mobile: < 480px

## 8️⃣ AUTHENTICATION

### Token Management
```javascript
// Token stored in localStorage
localStorage.getItem('accessToken');

// Used in all API calls
headers.Authorization = `Bearer ${token}`;
```

## 9️⃣ ERROR HANDLING

### Automatic Fallbacks
1. Try to call backend API
2. If error → Use mock service
3. Display user-friendly error
4. Show retry button

### Common Errors
```
"Lỗi khi tải bài đăng" → Network error
"Lỗi upload ảnh" → File too large or format not supported
"Lỗi khi duyệt bài đăng" → Permission denied
```

## 🔟 PERFORMANCE TIPS

1. **Image Optimization**:
   - Lazy load images
   - Use thumbnails first
   - Compress before upload

2. **Video Optimization**:
   - Show thumbnail instead of video
   - Load on demand
   - Support multiple formats

3. **Comment Loading**:
   - Pagination (show 5, load more)
   - Virtual scrolling for long lists

4. **Refresh Intervals**:
   - Moderation queue: 30s
   - Posts feed: On demand
   - Comments: On expand

## 1️⃣1️⃣ TESTING

### Manual Test Cases
```
POST CREATION
☐ Create post without title
☐ Create post with title
☐ Add single image
☐ Add multiple images
☐ Add single video
☐ Add multiple media
☐ Remove media before submit
☐ Submit post

REACTIONS
☐ Like post (toggles)
☐ Switch between reactions
☐ Remove reaction (click again)
☐ Like comment
☐ Reaction counters update

COMMENTS
☐ Add comment to post
☐ Add comment with image
☐ Add comment with file
☐ Delete own comment
☐ React to comment
☐ See comment count

MODERATION
☐ See pending posts
☐ Approve post
☐ Reject post with reason
☐ See rejection reason
☐ Auto-refresh queue
☐ Approve comment
☐ Reject comment
```

## 1️⃣2️⃣ BACKEND INTEGRATION

When ready to connect real backend:

1. Update `postInteractionService.js`:
   - Change `USE_MOCK_SERVICE = false`
   - Verify API endpoints match your backend

2. Implement backend endpoints:
   - POST /posts
   - GET /posts?groupId={id}
   - PUT /posts/{id}
   - DELETE /posts/{id}
   - POST /posts/{id}/reactions
   - GET /posts/{id}/comments
   - POST /posts/{id}/comments
   - And 10+ more (see COMMUNITY_INTERACTION_SYSTEM.md)

3. Test end-to-end

4. Monitor error logs

## 1️⃣3️⃣ SUPPORT & HELP

- See COMMUNITY_INTERACTION_SYSTEM.md for full documentation
- Check component JSDoc comments for detailed info
- Review mock data structure in postInteractionService.js
- Test with mock service first, then backend

## 1️⃣4️⃣ QUICK START (30 seconds)

```bash
# 1. Ensure lucide-react is installed
npm install lucide-react

# 2. Copy all files to correct locations (already done ✓)

# 3. Import in your page
import PostCreator from './components/PostCreator';
import PostCard from './components/PostCard';
import postInteractionService from '../../services/postInteractionService';

# 4. Use in component (see Example 1 above)

# 5. Run your app
npm run dev

# 6. Test with mock data (USE_MOCK_SERVICE = true)
```

---
**All files created successfully! ✅**
**Ready for use! 🚀**
