# Migration Guide: Tích Hợp Hệ Thống Tương Tác Cộng Đồng

## 🎯 Mục Đích

Hướng dẫn này giúp bạn tích hợp hệ thống tương tác cộng đồng hoàn chỉnh vào các trang hiện tại (AnnouncementFeed, StudentForum, GroupDetail, v.v.)

---

## 📋 Checklist Tích Hợp

### Phase 1: Setup & Dependencies ✅
- [x] Tất cả component đã được tạo
- [x] CSS files đã được tạo
- [x] Hook & Services đã được tạo
- [x] Permission system đã được setup

### Phase 2: Integration (TODO)
- [ ] Cập nhật AnnouncementFeed.jsx
- [ ] Cập nhật StudentForum.jsx
- [ ] Cập nhật GroupDetail.jsx
- [ ] Cập nhật ClassroomView.jsx

### Phase 3: Backend (TODO)
- [ ] Tạo API endpoints trên backend
- [ ] Database schema cho reactions/comments
- [ ] Validation & moderation API

### Phase 4: Testing (TODO)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance tests

---

## 🔧 Step-by-Step Integration

### Step 1: Cập Nhật AnnouncementFeed.jsx

**File**: `src/pages/classroom/AnnouncementFeed.jsx`

```javascript
// 1. Import các components
import PostInteraction from '../../components/PostInteraction';
import CommentSection from '../../components/CommentSection';
import MediaUpload from '../../components/MediaUpload';
import { usePermissions } from '../../utils/rolePermissions';
import { usePostInteractions } from '../../hooks/usePostInteractions';
import postInteractionService from '../../services/postInteractionService';

// 2. Replace existing comment handling với new system
// OLD CODE (remove):
// const handleCommentSubmit = (postId, comment) => { ... }

// NEW CODE:
const handleAddComment = useCallback(async (postId, content, mediaIds = []) => {
  try {
    if (!permissions.canComment()) {
      alert('Bạn không có quyền bình luận');
      return;
    }
    
    // Update UI optimistically
    setAnnouncements(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
    
    // Call API
    await postInteractionService.addComment(postId, {
      content,
      userId: currentUser.id,
      mediaIds,
      authorRole: currentUser.role,
    });
  } catch (err) {
    console.error('Error adding comment:', err);
    loadAnnouncements(); // Reload on error
  }
}, [currentUser, permissions]);

// 3. Update render để sử dụng new components
// OLD:
// <CommentForm onSubmit={handleCommentSubmit} />

// NEW:
<PostInteraction
  post={post}
  onReactionChange={handleReactionChange}
  onCommentClick={...}
  isTeacher={isTeacher}
  canInteract={!post.disabledInteractions}
/>

<CommentSection
  comments={post.comments}
  onAddComment={(content, mediaIds) => 
    handleAddComment(post.id, content, mediaIds)
  }
  onDeleteComment={(commentId) =>
    handleDeleteComment(post.id, commentId)
  }
  currentUserRole={currentUser?.role}
/>
```

---

### Step 2: Setup Permission System

**File**: `src/pages/classroom/AnnouncementFeed.jsx`

```javascript
// At component top level:
const { currentUser } = useAuth(); // Get from your auth provider
const permissions = usePermissions(currentUser?.role, currentUser?.id);

// Use in conditionals:
if (!permissions.canLike()) {
  return <div>Bạn không có quyền thích bài viết</div>;
}

// Check nested in handlers:
const handleReactionChange = useCallback(async (postId, reactionType) => {
  if (!permissions.canLike()) {
    alert('Bạn không có quyền');
    return;
  }
  // ... handler logic
}, [permissions]);
```

---

### Step 3: Cập Nhật Data Model

**Current Announcement Structure**:
```javascript
{
  id: string,
  author: { id, name, role, avatar },
  title: string,
  content: string,
  timestamp: Date,
  
  // NEW FIELDS:
  reactions: {
    LIKE: [],
    LOVE: [],
    // ... other reaction types
  },
  userReaction: null,
  comments: [
    {
      id,
      author,
      content,
      timestamp,
      likes: [],
      userLiked: false,
      replies: [],
      mediaIds: [],
      isEdited: false,
    }
  ],
  mediaIds: [],
  isPinned: false,
  isCommentLocked: false,
  disabledInteractions: false,
}
```

---

### Step 4: Handle Media Upload

**Integration với existing upload**:

```javascript
// When user selects media in MediaUpload component:
const handleMediaUpload = useCallback(async (files, postId) => {
  try {
    if (!permissions.canUploadMedia()) {
      alert('Bạn không có quyền upload media');
      return;
    }
    
    // Call service
    const uploadedMedia = await postInteractionService.uploadMedia(files, {
      postId,
      classId,
    });
    
    // uploadedMedia returns: { id, url, type, size, ... }
    return uploadedMedia;
  } catch (err) {
    console.error('Upload error:', err);
    throw err;
  }
}, [classId, permissions]);
```

---

### Step 5: Teacher Control Panel

**Tạo new file**: `src/components/TeacherControlPanel.jsx`

```javascript
import React from 'react';
import { Pin, Lock, Trash2 } from 'lucide-react';
import './TeacherControlPanel.css';

const TeacherControlPanel = ({
  post,
  onPinPost,
  onLockComments,
  onDeletePost,
  disabled = false,
}) => {
  return (
    <div className="teacher-control-panel">
      <div className="control-actions">
        {/* Pin Control */}
        <button
          onClick={() => onPinPost(!post.isPinned)}
          className={`control-button ${post.isPinned ? 'active' : ''}`}
          disabled={disabled}
          title={post.isPinned ? 'Bỏ ghim' : 'Ghim bài viết'}
        >
          <Pin size={18} />
          {post.isPinned ? 'Bỏ ghim' : 'Ghim'}
        </button>

        {/* Lock Comments */}
        <button
          onClick={() => onLockComments(!post.isCommentLocked)}
          className={`control-button ${post.isCommentLocked ? 'active' : ''}`}
          disabled={disabled}
          title={post.isCommentLocked ? 'Mở khóa bình luận' : 'Khóa bình luận'}
        >
          <Lock size={18} />
          {post.isCommentLocked ? 'Mở khóa' : 'Khóa BL'}
        </button>

        {/* Delete Post */}
        <button
          onClick={() => {
            if (window.confirm('Bạn chắc chắn muốn xóa?')) {
              onDeletePost();
            }
          }}
          className="control-button delete"
          disabled={disabled}
          title="Xóa bài viết"
        >
          <Trash2 size={18} />
          Xóa
        </button>
      </div>

      {/* Status Indicators */}
      <div className="status-indicators">
        {post.isPinned && <span className="badge pinned">📌 Đã ghim</span>}
        {post.isCommentLocked && <span className="badge locked">🔒 Khóa BL</span>}
        {post.disabledInteractions && (
          <span className="badge disabled">❌ Tắt tương tác</span>
        )}
      </div>
    </div>
  );
};

export default TeacherControlPanel;
```

---

### Step 6: Error Handling

```javascript
// Setup error boundary
const [error, setError] = useState(null);

// In each handler:
try {
  // ... operation
} catch (err) {
  console.error('Error:', err);
  setError(err.message || 'Đã xảy ra lỗi');
  
  // Reload on critical error
  if (err.statusCode === 401) {
    redirectToLogin();
  }
}

// Render error:
{error && (
  <div className="error-banner">
    <span>{error}</span>
    <button onClick={() => setError(null)}>×</button>
  </div>
)}
```

---

## 🗄️ Database Schema (Backend)

### Reactions Table
```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY,
  postId UUID NOT NULL,
  userId UUID NOT NULL,
  type ENUM('LIKE', 'LOVE', 'HAHA', 'WOW', 'SAD', 'ANGRY', 'CLAP', 'THINKING'),
  createdAt TIMESTAMP,
  UNIQUE(postId, userId, type)
);
```

### Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  postId UUID NOT NULL,
  userId UUID NOT NULL,
  content TEXT NOT NULL,
  mediaIds JSON,
  isEdited BOOLEAN DEFAULT false,
  editedAt TIMESTAMP,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Comment Replies Table
```sql
CREATE TABLE replies (
  id UUID PRIMARY KEY,
  commentId UUID NOT NULL,
  userId UUID NOT NULL,
  content TEXT NOT NULL,
  mediaIds JSON,
  createdAt TIMESTAMP,
  FOREIGN KEY (commentId) REFERENCES comments(id)
);
```

### Post Control Table
```sql
CREATE TABLE post_controls (
  postId UUID PRIMARY KEY,
  isPinned BOOLEAN DEFAULT false,
  isCommentLocked BOOLEAN DEFAULT false,
  disabledInteractions BOOLEAN DEFAULT false,
  moderationStatus ENUM('PENDING', 'APPROVED', 'REJECTED'),
  updatedAt TIMESTAMP,
  updatedBy UUID
);
```

---

## 🔌 API Endpoints (Backend)

### Reactions
```
POST   /api/posts/{postId}/reactions
       - Toggle reaction

GET    /api/posts/{postId}/reactions
       - Get all reactions
```

### Comments
```
POST   /api/posts/{postId}/comments
       - Add comment

GET    /api/posts/{postId}/comments
       - Get all comments

PUT    /api/posts/{postId}/comments/{commentId}
       - Edit comment

DELETE /api/posts/{postId}/comments/{commentId}
       - Delete comment

POST   /api/posts/{postId}/comments/{commentId}/like
       - Like/unlike comment
```

### Replies
```
POST   /api/posts/{postId}/comments/{commentId}/replies
       - Add reply

DELETE /api/posts/{postId}/comments/{commentId}/replies/{replyId}
       - Delete reply
```

### Teacher Controls
```
PUT    /api/posts/{postId}/pin
       - Pin/unpin post

PUT    /api/posts/{postId}/lock-comments
       - Lock/unlock comments

DELETE /api/posts/{postId}
       - Delete post
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] Permission checks return correct values
- [ ] Reaction toggle works correctly
- [ ] Comment CRUD operations
- [ ] Reply threading logic

### Integration Tests
- [ ] Full workflow: Create post → Add comment → Reply
- [ ] Permission enforcement at UI level
- [ ] Media upload validation
- [ ] Error handling & recovery

### E2E Tests
- [ ] Student can like/comment/reply
- [ ] Teacher can moderate
- [ ] Permissions enforced correctly
- [ ] UI responsive on mobile

---

## 🚀 Deployment Checklist

- [ ] All components tested
- [ ] Backend API deployed
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Error logging setup
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Documentation updated

---

## 📊 Monitoring

### Metrics to Track
- Comment creation rate
- Average reaction per post
- Media upload success rate
- Teacher moderation time
- Performance: API response time < 500ms

### Logging
```javascript
// In postInteractionService.js
const log = (level, message, data) => {
  console.log(`[${level}] ${message}`, data);
  // Send to logging service (e.g., Sentry, LogRocket)
};
```

---

## 🆘 Troubleshooting

### Issue: Comments not showing
**Solution**: 
1. Check `post.comments` has data
2. Verify `CommentSection` component receives correct props
3. Check CSS is loaded

### Issue: Permission denied
**Solution**:
1. Verify `currentUser.role` is set correctly
2. Check `usePermissions` hook receives correct role
3. Verify permission matrix in `rolePermissions.js`

### Issue: Media upload fails
**Solution**:
1. Check file size < `maxFileSize`
2. Verify file type in `allowedTypes`
3. Check CORS configuration on backend
4. Verify `/api/media/upload` endpoint exists

### Issue: Reactions not syncing
**Solution**:
1. Check API call in `toggleReaction`
2. Verify backend stores reaction correctly
3. Check UI update after API response
4. Reload page to verify persistence

---

## 📚 Related Files

- Permission System: `src/utils/rolePermissions.js`
- API Service: `src/services/postInteractionService.js`
- Hook: `src/hooks/usePostInteractions.js`
- Components: `src/components/Post*.jsx`, `src/components/Comment*.jsx`
- Full Documentation: `COMMUNITY_INTERACTIONS_GUIDE.md`

---

## 💬 Example: Full Implementation

```javascript
// src/pages/classroom/AnnouncementFeed.jsx - Complete example

import React, { useState, useCallback, useEffect } from 'react';
import PostInteraction from '../../components/PostInteraction';
import CommentSection from '../../components/CommentSection';
import { usePermissions } from '../../utils/rolePermissions';
import postInteractionService from '../../services/postInteractionService';

const AnnouncementFeed = ({ classId, currentUser }) => {
  const [announcements, setAnnouncements] = useState([]);
  const permissions = usePermissions(currentUser?.role, currentUser?.id);

  // Load announcements on mount
  useEffect(() => {
    loadAnnouncements();
  }, [classId]);

  const loadAnnouncements = useCallback(async () => {
    try {
      const response = await fetch(`/api/classes/${classId}/announcements`);
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    }
  }, [classId]);

  // Handle reaction change
  const handleReactionChange = useCallback(async (postId, reactionType, isRemoving) => {
    if (!permissions.canLike()) {
      alert('Bạn không có quyền thích bài viết');
      return;
    }

    // Optimistic update
    setAnnouncements(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const updated = { ...post };
          updated.reactions[reactionType] = [
            ...updated.reactions[reactionType],
            currentUser.id,
          ];
          return updated;
        }
        return post;
      })
    );

    // API call
    try {
      await postInteractionService.toggleReaction(postId, reactionType, currentUser.id);
    } catch (err) {
      loadAnnouncements(); // Reload on error
    }
  }, [currentUser, permissions, loadAnnouncements]);

  // Handle add comment
  const handleAddComment = useCallback(async (postId, content) => {
    if (!permissions.canComment()) {
      alert('Bạn không có quyền bình luận');
      return;
    }

    const comment = {
      id: `comment_${Date.now()}`,
      author: currentUser,
      content,
      timestamp: new Date(),
      likes: [],
      replies: [],
    };

    // Optimistic update
    setAnnouncements(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, comment] }
          : post
      )
    );

    // API call
    try {
      await postInteractionService.addComment(postId, {
        content,
        userId: currentUser.id,
      });
    } catch (err) {
      loadAnnouncements();
    }
  }, [currentUser, permissions, loadAnnouncements]);

  return (
    <div className="announcement-feed">
      {announcements.map(post => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <h3>{post.author.name}</h3>
            <p>{post.content}</p>
          </div>

          <PostInteraction
            post={post}
            onReactionChange={(type, removing) =>
              handleReactionChange(post.id, type, removing)
            }
            isTeacher={currentUser?.role === 'TEACHER'}
            canInteract={true}
          />

          <CommentSection
            comments={post.comments}
            onAddComment={(content) => handleAddComment(post.id, content)}
            currentUserRole={currentUser?.role}
          />
        </div>
      ))}
    </div>
  );
};

export default AnnouncementFeed;
```

---

## 🎓 Best Practices

1. **Optimistic Updates**: Update UI trước API call để UX tốt
2. **Error Recovery**: Reload từ server nếu API call thất bại
3. **Permission Checks**: Check permission trước mỗi action
4. **Debounce**: Debounce edit/comment để tránh spam API
5. **Caching**: Cache posts để reduce server load
6. **Pagination**: Load comments in batches (20-50)
7. **Rate Limiting**: Limit reactions/comments per user per hour

---

## 📞 Support

Nếu gặp vấn đề:
1. Check logs trên browser console
2. Verify API endpoints running
3. Check database connectivity
4. Review permission matrix
5. Contact: support@upnest.edu
