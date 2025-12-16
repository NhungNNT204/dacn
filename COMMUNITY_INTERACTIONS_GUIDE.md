# Hệ Thống Tương Tác Cộng Đồng - UpNest Education

## 📋 Tổng Quan

Hệ thống tương tác cộng đồng hoàn chỉnh cho nền tảng UpNest Education cho phép:

- **Reactions (Phản ứng)**: 8 loại emoji reaction (👍❤️😂😮😢😠👏🤔)
- **Comments (Bình luận)**: Hệ thống bình luận với nested replies (trả lời lồng nhau)
- **Media Sharing (Chia sẻ media)**: Upload hình ảnh, video với drag-drop UI
- **Teacher Controls (Kiểm soát giáo viên)**: Ghim post, khóa bình luận, xóa nội dung

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│         AnnouncementFeedWithInteractions.jsx            │
│              (Container Component)                       │
└──────────────┬──────────────────────────────────────────┘
               │
       ┌───────┼───────────────────┐
       │       │                   │
       ▼       ▼                   ▼
  ┌─────────┐ ┌─────────┐  ┌─────────────┐
  │ Post    │ │Comments │  │PostInteract │
  │Reaction │ │ Section │  │    ion      │
  └─────────┘ └─────────┘  └─────────────┘
       │         │               │
       │         │               │
       ▼         ▼               ▼
  ┌────────────────────────────────────────┐
  │     Hooks & Services Layer             │
  │  - usePostInteractions                 │
  │  - usePermissions                      │
  │  - postInteractionService              │
  │  - rolePermissions.js                  │
  └────────────────────────────────────────┘
```

---

## 📁 Cấu Trúc File

```
upnest-web/src/
├── components/
│   ├── PostInteraction.jsx            # Reactions & like component
│   ├── PostInteraction.css
│   ├── CommentSection.jsx             # Comments with nested replies
│   ├── CommentSection.css
│   ├── MediaUpload.jsx                # Drag-drop file upload
│   └── MediaUpload.css
├── hooks/
│   └── usePostInteractions.js         # Custom hook for state management
├── pages/
│   └── classroom/
│       ├── AnnouncementFeedWithInteractions.jsx
│       └── AnnouncementFeedWithInteractions.css
├── services/
│   └── postInteractionService.js      # API layer
└── utils/
    └── rolePermissions.js             # Role-based access control
```

---

## 🔧 Components

### 1. PostInteraction Component

**Vị trí**: `src/components/PostInteraction.jsx`

**Chức năng**:
- Hiển thị reaction emoji picker
- Nút like nhanh
- Nút bình luận và chia sẻ
- Menu kiểm soát cho giáo viên (ghim, khóa, xóa)
- Hiển thị thống kê reactions

**Props**:
```javascript
{
  post: {                    // Object bài viết
    id: string,
    reactions: {             // Object reactions theo loại
      LIKE: [],              // Array user IDs
      LOVE: [],
      ...
    },
    userReaction: string,    // Reaction hiện tại của user
  },
  onReactionChange: (type, isRemoving) => {},
  onCommentClick: () => {},
  onShareClick: () => {},
  onDeletePost: () => {},
  isTeacher: boolean,
  canInteract: boolean,
  onTogglePin: () => {},
  onToggleLockComments: () => {},
}
```

**Reactions Được Hỗ Trợ**:
- 👍 LIKE - Thích
- ❤️ LOVE - Yêu thích
- 😂 HAHA - Haha
- 😮 WOW - Wow
- 😢 SAD - Buồn
- 😠 ANGRY - Tức giận
- 👏 CLAP - Vỗ tay
- 🤔 THINKING - Suy nghĩ

---

### 2. CommentSection Component

**Vị trí**: `src/components/CommentSection.jsx`

**Chức năng**:
- Hiển thị danh sách comments
- Thêm comment mới
- Edit comment (owner hoặc teacher)
- Xóa comment (owner hoặc teacher)
- Like comments
- Nested replies (trả lời comment)
- Hiển thị thời gian edit

**Props**:
```javascript
{
  comments: [
    {
      id: string,
      author: { id, name, role, avatar },
      content: string,
      timestamp: Date,
      likes: [string],        // Array user IDs
      userLiked: boolean,
      replies: [],            // Array of reply objects
      mediaIds: [],
      isEdited: boolean,
      editedAt: Date,
    }
  ],
  onAddComment: (content, mediaIds) => {},
  onDeleteComment: (commentId) => {},
  onEditComment: (commentId, content) => {},
  onLikeComment: (commentId) => {},
  onAddReply: (commentId, content, mediaIds) => {},
  currentUserRole: 'TEACHER' | 'STUDENT' | 'ADMIN' | 'GUEST',
}
```

**Features**:
- Reply lồng nhau với indentation
- Inline edit form
- Permission-based controls
- File attachment support
- Timestamp with edit badge

---

### 3. MediaUpload Component

**Vị trí**: `src/components/MediaUpload.jsx`

**Chức năng**:
- Drag-drop file upload
- Click to browse
- File validation (type & size)
- Progress tracking per file
- File preview (image thumbnail, video placeholder)
- Multi-file support (default max 5)
- Error display

**Props**:
```javascript
{
  onMediaSelect: (files) => {},
  maxFiles: number,          // Default: 5
  maxFileSize: number,       // Default: 10MB
  allowedTypes: string[],    // MIME types
}
```

**Supported Formats**:
- Images: JPG, PNG, GIF
- Videos: MP4, WebM
- Default max size: 10MB per file

---

## 🪝 Hooks

### usePostInteractions

**Vị trí**: `src/hooks/usePostInteractions.js`

**Chức năng**: Quản lý state cho tất cả post interactions

**Methods**:
```javascript
const {
  // State
  reactions,                  // Object reactions
  comments,                   // Array comments
  userReaction,              // Current user reaction
  isLiked,                   // Is post liked
  totalReactions,            // Total reaction count
  
  // Methods
  toggleReaction,            // Toggle emoji reaction
  addComment,                // Add new comment
  deleteComment,             // Delete comment
  editComment,               // Edit comment content
  likeComment,               // Like/unlike comment
  addReply,                  // Add nested reply
  setError,                  // Set error message
} = usePostInteractions(postId);
```

---

## 🔐 Permission System

**Vị trí**: `src/utils/rolePermissions.js`

**4 Roles Được Hỗ Trợ**:

1. **ADMIN**: Tất cả permissions
2. **TEACHER**: Tạo, chỉnh sửa, xóa post/comment, kiểm duyệt, ghim, khóa
3. **STUDENT**: Tạo post, like, bình luận, upload media; chỉnh sửa/xóa chỉ nội dung của mình
4. **GUEST**: Không có quyền

**12 Permissions**:
- `CREATE_POST`
- `EDIT_POST`
- `DELETE_POST`
- `LIKE_POST`
- `COMMENT_POST`
- `EDIT_COMMENT`
- `DELETE_COMMENT`
- `SHARE_POST`
- `UPLOAD_MEDIA`
- `PIN_POST`
- `LOCK_COMMENTS`
- `MODERATE_COMMENTS`

**Sử dụng**:
```javascript
import { usePermissions } from '../utils/rolePermissions';

const { 
  canLike, 
  canComment, 
  canEditComment, 
  canDeleteComment,
  canPinPost,
  canLockComments,
  isTeacher,
  isAdmin,
} = usePermissions(userRole, userId);

if (canLike()) {
  // User can like
}
```

---

## 📡 API Service

**Vị trí**: `src/services/postInteractionService.js`

**Endpoints**:

```javascript
// Reactions
toggleReaction(postId, reactionType, userId)

// Comments
addComment(postId, commentData)
editComment(postId, commentId, updateData)
deleteComment(postId, commentId)
toggleCommentLike(postId, commentId, userId)

// Replies
addReply(postId, commentId, replyData)

// Media
uploadMedia(files, options)

// Teacher Controls
togglePinPost(postId, isPinned)
toggleLockComments(postId, isLocked)
toggleDisableInteractions(postId, disabled)
deletePost(postId)

// Queries
getPostDetails(postId)
getComments(postId, options)
getModerationQueue(filters)

// Moderation
moderateContent(contentId, action, reason)
```

---

## 🎨 Styling

### CSS Files

1. **PostInteraction.css** (~200 lines)
   - Reaction picker styling
   - Emoji button styles
   - Teacher menu
   - Responsive design

2. **CommentSection.css** (~350 lines)
   - Comment input form
   - Comments list
   - Nested replies
   - Edit/delete controls
   - Responsive design

3. **MediaUpload.css** (~400 lines)
   - Drag-drop zone
   - Progress bars
   - File preview
   - Error messages
   - Responsive design

4. **AnnouncementFeedWithInteractions.css** (~300 lines)
   - Post card layout
   - Header styling
   - Loading/error states
   - Responsive design

---

## 🔄 Data Flow

```
User Action
    │
    ▼
Component Handler (e.g., handleReactionChange)
    │
    ├─ Check Permission (usePermissions)
    │
    ├─ Update UI Optimistically (setAnnouncements)
    │
    ▼
Call API Service (postInteractionService)
    │
    ├─ Send Request to Backend
    │
    ▼
Update State with Response
    │
    ├─ On Error: Reload from backend
    │
    ▼
Display Updated UI
```

---

## 📱 Responsive Design

Tất cả components được optimize cho:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

**Breakpoints**:
- `@media (max-width: 768px)` - Tablet
- `@media (max-width: 480px)` - Mobile

---

## 🔄 State Management

**Hierarchical State**:

```
AnnouncementFeedWithInteractions (Container)
  ├── announcements[] (Posts + Comments)
  ├── loading
  ├── error
  └── selectedPostForMedia (for media upload)
        │
        └── usePostInteractions (per post)
             ├── reactions{}
             ├── comments[]
             ├── userReaction
             └── isLiked
```

---

## 🧪 Testing Examples

### Test Reaction Toggle
```javascript
const { handleReactionChange } = //...
await handleReactionChange('post_1', 'LIKE', false);
// Verify: reactions.LIKE includes userId
// Verify: userReaction === 'LIKE'
```

### Test Comment Add
```javascript
const { handleAddComment } = //...
await handleAddComment('post_1', 'Great post!', []);
// Verify: comments length increased
// Verify: new comment in list
```

### Test Permission
```javascript
const permissions = usePermissions('STUDENT', 'user_1');
expect(permissions.canDeleteComment()).toBe(false); // Student can't delete others' comments
expect(permissions.canLike()).toBe(true);
```

---

## 🚀 Integration Guide

### 1. Import Components
```javascript
import PostInteraction from './components/PostInteraction';
import CommentSection from './components/CommentSection';
import MediaUpload from './components/MediaUpload';
import { usePermissions } from './utils/rolePermissions';
import postInteractionService from './services/postInteractionService';
```

### 2. Use in Your Component
```javascript
const { canLike, canComment } = usePermissions(userRole, userId);

// In render:
<PostInteraction
  post={post}
  onReactionChange={handleReactionChange}
  isTeacher={isTeacher}
  canInteract={true}
/>

<CommentSection
  comments={comments}
  onAddComment={handleAddComment}
  currentUserRole={userRole}
/>
```

### 3. Connect to Backend
Update `postInteractionService.js`:
```javascript
// Change baseURL to your backend
this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Update endpoints to match your API
// Example: POST /api/posts/{postId}/reactions
```

---

## ⚙️ Configuration

### Environment Variables
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_MAX_FILE_SIZE=10485760  # 10MB
REACT_APP_MAX_FILES=5
```

### Default Settings
```javascript
// In MediaUpload.jsx
const DEFAULT_MAX_FILES = 5;
const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/webm',
];
```

---

## 🐛 Debugging

### Enable Verbose Logging
```javascript
// In postInteractionService.js
const DEBUG = process.env.REACT_APP_DEBUG === 'true';

if (DEBUG) {
  console.log('API Request:', method, endpoint);
  console.log('Response:', response);
}
```

### Common Issues

**Issue**: Comments not showing
- **Fix**: Check `isCommentLocked` flag on post

**Issue**: Media not uploading
- **Fix**: Verify file size < maxFileSize, type in allowedTypes

**Issue**: Permission denied
- **Fix**: Check user role with `usePermissions`, verify in permission matrix

---

## 📚 Reference

- React Hooks: https://reactjs.org/docs/hooks-intro.html
- Lucide Icons: https://lucide.dev/
- FormData API: https://developer.mozilla.org/en-US/docs/Web/API/FormData
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

## 📝 Version History

**v1.0.0** (Current)
- Initial release
- 8 emoji reactions
- Nested comments with replies
- Media upload with validation
- Teacher controls (pin, lock, delete)
- Role-based permissions
- Responsive design

---

## 💡 Future Enhancements

- [ ] Real-time notifications via WebSocket
- [ ] Emoji search/filter in picker
- [ ] Rich text editor for comments
- [ ] Mention system (@username)
- [ ] Hashtag support
- [ ] Comment threading depth limit
- [ ] Analytics dashboard for teachers
- [ ] Offensive content detection (AI)
- [ ] Comment archive/history
- [ ] Batch moderation actions

---

## 📞 Support

Để báo cáo lỗi hoặc yêu cầu tính năng, vui lòng liên hệ:
- Email: support@upnest.edu
- GitHub Issues: https://github.com/upnest/education-platform/issues
