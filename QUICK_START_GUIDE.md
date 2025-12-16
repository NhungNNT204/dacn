# Quick Start Guide - Community Interactions

## 🚀 30-Second Quick Start

### Import Components
```javascript
import PostInteraction from './components/PostInteraction';
import CommentSection from './components/CommentSection';
import MediaUpload from './components/MediaUpload';
import { usePermissions } from './utils/rolePermissions';
```

### Basic Usage
```javascript
<PostInteraction
  post={post}
  onReactionChange={handleReaction}
  isTeacher={isTeacher}
/>

<CommentSection
  comments={comments}
  onAddComment={handleAdd}
  currentUserRole={role}
/>
```

---

## 📋 Component Cheat Sheet

| Component | Props | Key Methods |
|-----------|-------|-------------|
| PostInteraction | post, onReactionChange, isTeacher | toggleReaction, pin, lock |
| CommentSection | comments, onAddComment, currentUserRole | add, edit, delete, like, reply |
| MediaUpload | onMediaSelect, maxFiles, maxFileSize | validate, upload, preview |

---

## 🔐 Permission Quick Check

```javascript
// 4 Roles
const roles = ['ADMIN', 'TEACHER', 'STUDENT', 'GUEST'];

// 12 Permissions
const permissions = [
  'CREATE_POST', 'EDIT_POST', 'DELETE_POST',
  'LIKE_POST', 'COMMENT_POST',
  'EDIT_COMMENT', 'DELETE_COMMENT',
  'SHARE_POST', 'UPLOAD_MEDIA',
  'PIN_POST', 'LOCK_COMMENTS', 'MODERATE_COMMENTS'
];

// Check
const { canLike, canComment, canDeleteComment } = usePermissions(role, userId);
```

---

## 🎨 8 Emoji Reactions

```
👍 LIKE      ❤️ LOVE     😂 HAHA
😮 WOW       😢 SAD      😠 ANGRY
👏 CLAP      🤔 THINKING
```

---

## 🗂️ File Structure

```
src/
├── components/
│   ├── PostInteraction.jsx      (200 lines)
│   ├── PostInteraction.css
│   ├── CommentSection.jsx       (330 lines)
│   ├── CommentSection.css
│   ├── MediaUpload.jsx          (350 lines)
│   ├── MediaUpload.css
│   └── README.md
├── hooks/
│   └── usePostInteractions.js   (260 lines)
├── utils/
│   └── rolePermissions.js       (310 lines)
├── services/
│   └── postInteractionService.js (300 lines)
└── pages/
    └── classroom/
        ├── AnnouncementFeedWithInteractions.jsx
        ├── AnnouncementFeedWithInteractions.css
        ├── AnnouncementFeedDemo.jsx
        └── AnnouncementFeedDemo.css
```

---

## 🧪 Test Demo

```javascript
// Route to demo
<Route path="/demo" element={<AnnouncementFeedDemo />} />

// Test interactions without backend
// Open DevTools (F12) to see logs
```

---

## 🔌 API Endpoints Template

```javascript
// Reactions
POST   /api/posts/{postId}/reactions
DELETE /api/posts/{postId}/reactions/{reactionId}

// Comments
POST   /api/posts/{postId}/comments
PUT    /api/posts/{postId}/comments/{commentId}
DELETE /api/posts/{postId}/comments/{commentId}
POST   /api/posts/{postId}/comments/{commentId}/like

// Replies
POST   /api/posts/{postId}/comments/{commentId}/replies

// Media
POST   /api/media/upload

// Controls
PUT    /api/posts/{postId}/pin
PUT    /api/posts/{postId}/lock-comments
DELETE /api/posts/{postId}
```

---

## 💾 Data Models

### Post
```javascript
{
  id, title, content, author,
  timestamp, reactions, comments,
  mediaIds, isPinned, isCommentLocked,
  disabledInteractions
}
```

### Comment
```javascript
{
  id, author, content, timestamp,
  likes, userLiked, replies,
  mediaIds, isEdited, editedAt
}
```

### Reaction
```javascript
{
  postId, userId, type (LIKE|LOVE|...),
  createdAt
}
```

---

## 🎯 Handler Examples

```javascript
// Reaction
const handleReactionChange = (postId, type, removing) => {
  // Toggle emoji reaction
};

// Comment
const handleAddComment = (postId, content, mediaIds) => {
  // Add new comment
};

const handleEditComment = (postId, commentId, content) => {
  // Update comment
};

const handleDeleteComment = (postId, commentId) => {
  // Remove comment
};

// Reply
const handleAddReply = (postId, commentId, content) => {
  // Add nested reply
};

// Teacher
const handleTogglePin = (postId) => {
  // Pin/unpin post
};

const handleToggleLockComments = (postId) => {
  // Lock/unlock comments
};
```

---

## 🎨 CSS Classes

**Main Containers**
- `.post-interaction`
- `.comment-section`
- `.media-upload-container`

**Interactive Elements**
- `.reaction-picker`
- `.action-button`
- `.comment-input-wrapper`
- `.upload-zone`

**States**
- `.active` - Active state
- `.disabled` - Disabled state
- `.drag-over` - Drag over state
- `.editing` - Edit mode

---

## 🧠 State Management Flow

```
User Action
    ↓
Permission Check
    ↓
Optimistic UI Update (setAnnouncements)
    ↓
API Call (postInteractionService)
    ↓
Update State with Response
    ↓
On Error: Reload from backend
```

---

## 📱 Responsive Breakpoints

```css
/* Desktop */
Default: 1024px+

/* Tablet */
@media (max-width: 768px)

/* Mobile */
@media (max-width: 480px)
```

---

## 🔒 Permission Matrix

| Permission | ADMIN | TEACHER | STUDENT | GUEST |
|-----------|-------|---------|---------|-------|
| CREATE_POST | ✅ | ✅ | ✅ | ❌ |
| EDIT_POST | ✅ | ✅ | Own | ❌ |
| DELETE_POST | ✅ | ✅ | Own | ❌ |
| LIKE_POST | ✅ | ✅ | ✅ | ❌ |
| COMMENT_POST | ✅ | ✅ | ✅ | ❌ |
| EDIT_COMMENT | ✅ | ✅ | Own | ❌ |
| DELETE_COMMENT | ✅ | ✅ | Own | ❌ |
| SHARE_POST | ✅ | ✅ | ✅ | ❌ |
| UPLOAD_MEDIA | ✅ | ✅ | ✅ | ❌ |
| PIN_POST | ✅ | ✅ | ❌ | ❌ |
| LOCK_COMMENTS | ✅ | ✅ | ❌ | ❌ |
| MODERATE_COMMENTS | ✅ | ✅ | ❌ | ❌ |

---

## 🚨 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Icons not showing | Lucide not installed | `npm install lucide-react` |
| Styles not applying | CSS not imported | Check import paths |
| Permission denied | Role not set | Pass `userRole` prop |
| File upload fails | File size | Check `maxFileSize` |
| Comments not showing | isCommentLocked | Check post.isCommentLocked |

---

## 📚 Documentation Files

| File | Purpose | Pages |
|------|---------|-------|
| COMMUNITY_INTERACTIONS_GUIDE.md | Complete system guide | 15+ |
| INTEGRATION_MIGRATION_GUIDE.md | Integration instructions | 20+ |
| IMPLEMENTATION_SUMMARY.md | Completion summary | 10+ |
| CHECKLIST_AND_PROGRESS.md | Progress tracking | 10+ |
| src/components/README.md | Component reference | 8+ |
| QUICK_START_GUIDE.md | This file | 1 |

---

## 🎯 Key Methods

### usePostInteractions
```javascript
toggleReaction(reactionType)
addComment(content, mediaIds)
deleteComment(commentId)
editComment(commentId, newContent)
likeComment(commentId)
addReply(commentId, content)
setError(message)
```

### usePermissions
```javascript
canLike()
canComment(isLocked)
canEditComment(authorId)
canDeleteComment(authorId)
canUploadMedia()
canPinPost()
canLockComments()
canModerate()
isTeacher()
isAdmin()
isStudent()
```

### postInteractionService
```javascript
toggleReaction(postId, type, userId)
addComment(postId, commentData)
editComment(postId, commentId, data)
deleteComment(postId, commentId)
uploadMedia(files, options)
togglePinPost(postId, isPinned)
toggleLockComments(postId, isLocked)
deletePost(postId)
getPostDetails(postId)
getComments(postId, options)
```

---

## 🔄 API Call Pattern

```javascript
try {
  // 1. Permission check
  if (!permissions.canLike()) {
    throw new Error('No permission');
  }
  
  // 2. Optimistic update
  updateUI();
  
  // 3. API call
  await postInteractionService.method(...);
  
  // 4. Success
  showSuccess();
} catch (err) {
  // 5. Error recovery
  reloadFromBackend();
  showError(err.message);
}
```

---

## 🧪 Quick Test Checklist

- [ ] Emoji picker shows 8 reactions
- [ ] Click emoji adds reaction
- [ ] Comment input accepts text
- [ ] Send button creates comment
- [ ] Double-click comment enables edit
- [ ] Delete button removes comment
- [ ] Reply button shows reply form
- [ ] Like comment button works
- [ ] Nested replies show correctly
- [ ] Drag-drop zone highlights on drag
- [ ] File upload shows progress
- [ ] Media preview displays
- [ ] Permission checks work
- [ ] Teacher menu appears
- [ ] Pin/lock/delete work
- [ ] Responsive on mobile

---

## 💡 Pro Tips

1. **Use Demo Component**: Test without backend first
2. **Check Console Logs**: Open DevTools (F12) for action logs
3. **Permission Testing**: Change `currentUser.role` to test
4. **Mock Data**: Use provided mock data for development
5. **CSS Override**: Modify CSS files for custom styling
6. **Error Handling**: Always catch API errors and reload
7. **Optimistic Updates**: Update UI before API call
8. **Performance**: Use React.memo for large lists

---

## 🔗 Important Links

- Lucide Icons: https://lucide.dev/
- React Hooks: https://react.dev/reference/react
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- FormData: https://developer.mozilla.org/en-US/docs/Web/API/FormData

---

## 📞 Getting Help

1. **Check Documentation**: See COMMUNITY_INTERACTIONS_GUIDE.md
2. **Review Examples**: See AnnouncementFeedDemo.jsx
3. **Check Code Comments**: Components have detailed comments
4. **Test with Demo**: Run demo component to test
5. **Review Tests**: Check test examples in documentation

---

**Last Updated**: 2024  
**Version**: 1.0  
**Status**: ✅ Complete  

*Print this page for quick reference!*
