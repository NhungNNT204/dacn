# Community Interactions Components

## 📦 Tổng Quan

Bộ components cho hệ thống tương tác cộng đồng UpNest Education. Gồm 3 components chính + CSS files.

---

## 🎨 Components

### 1. PostInteraction.jsx

**Vị trí**: `src/components/PostInteraction.jsx`  
**CSS**: `src/components/PostInteraction.css`  
**Kích thước**: 200+ lines

**Chức năng**:
- Hiển thị reaction picker (8 emoji)
- Nút like nhanh
- Menu tương tác (comment, share, delete)
- Teacher control menu
- Thống kê reactions

**Props**:
```javascript
<PostInteraction
  post={{
    id: 'post_1',
    reactions: {
      LIKE: ['user1'],
      LOVE: [],
      // ... other reactions
    },
    userReaction: null,
  }}
  onReactionChange={(type, isRemoving) => {}}
  onCommentClick={() => {}}
  onShareClick={() => {}}
  onDeletePost={() => {}}
  isTeacher={true}
  canInteract={true}
  onTogglePin={() => {}}
  onToggleLockComments={() => {}}
/>
```

**Reactions Supported**:
- 👍 LIKE
- ❤️ LOVE
- 😂 HAHA
- 😮 WOW
- 😢 SAD
- 😠 ANGRY
- 👏 CLAP
- 🤔 THINKING

---

### 2. CommentSection.jsx

**Vị trí**: `src/components/CommentSection.jsx`  
**CSS**: `src/components/CommentSection.css`  
**Kích thước**: 330+ lines

**Chức năng**:
- Hiển thị danh sách comments
- Thêm comment mới
- Edit comment (owner/teacher)
- Xóa comment (owner/teacher)
- Like comments
- Nested replies
- Edit tracking badge

**Props**:
```javascript
<CommentSection
  comments={[
    {
      id: 'comment_1',
      author: { id, name, role, avatar },
      content: 'Great post!',
      timestamp: new Date(),
      likes: ['user1'],
      userLiked: false,
      replies: [],
      mediaIds: [],
      isEdited: false,
    }
  ]}
  onAddComment={(content, mediaIds) => {}}
  onDeleteComment={(commentId) => {}}
  onEditComment={(commentId, content) => {}}
  onLikeComment={(commentId) => {}}
  onAddReply={(commentId, content, mediaIds) => {}}
  currentUserRole="TEACHER"
/>
```

**Features**:
- Inline edit form
- Reply threading
- Timestamp tracking
- Edit history
- Permission checks
- File attachment support

---

### 3. MediaUpload.jsx

**Vị trí**: `src/components/MediaUpload.jsx`  
**CSS**: `src/components/MediaUpload.css`  
**Kích thước**: 350+ lines

**Chức năng**:
- Drag & drop upload
- Click to browse
- File validation
- Progress tracking
- File preview
- Multi-file support

**Props**:
```javascript
<MediaUpload
  onMediaSelect={(files) => {}}
  maxFiles={5}
  maxFileSize={10485760} // 10MB
  allowedTypes={[
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/webm',
  ]}
/>
```

**Features**:
- Progress bars
- File preview (thumbnail/placeholder)
- Error messages
- Format info
- Multi-file support

---

## 🔧 Installation & Setup

### 1. Copy Files
```bash
# Copy components
cp -r components/* src/components/

# Copy CSS
# CSS files in src/components/
```

### 2. Install Dependencies
```bash
# Already installed (Lucide React required)
npm install lucide-react
```

### 3. Import in Your Component
```javascript
import PostInteraction from './components/PostInteraction';
import CommentSection from './components/CommentSection';
import MediaUpload from './components/MediaUpload';
```

---

## 🚀 Quick Start Example

```javascript
import React, { useState } from 'react';
import PostInteraction from './components/PostInteraction';
import CommentSection from './components/CommentSection';

function MyPost() {
  const [post, setPost] = useState({
    id: 'post_1',
    reactions: { LIKE: [], LOVE: [], /* ... */ },
    comments: [],
    // ...
  });

  const handleReactionChange = (type, removing) => {
    // Handle reaction logic
  };

  const handleAddComment = (content, mediaIds) => {
    // Handle add comment
  };

  return (
    <div>
      <div className="post-content">
        <h3>My Post Title</h3>
        <p>Post content here...</p>
      </div>

      <PostInteraction
        post={post}
        onReactionChange={handleReactionChange}
        isTeacher={false}
      />

      <CommentSection
        comments={post.comments}
        onAddComment={handleAddComment}
        currentUserRole="STUDENT"
      />
    </div>
  );
}
```

---

## 🎨 Styling

### CSS Classes

**PostInteraction**:
- `.post-interaction` - Main container
- `.reaction-stats` - Reaction statistics
- `.interaction-actions` - Action buttons
- `.reaction-picker` - Emoji picker
- `.teacher-controls` - Teacher menu

**CommentSection**:
- `.comment-section` - Main container
- `.comment-input-wrapper` - Comment input form
- `.comments-list` - Comments list
- `.comment-item` - Single comment
- `.replies-section` - Nested replies
- `.reply-form` - Reply input form

**MediaUpload**:
- `.media-upload-container` - Main container
- `.upload-zone` - Drag-drop zone
- `.files-list` - Uploaded files list
- `.file-item` - Single file
- `.error-container` - Error messages

---

## 📱 Responsive Design

All components are fully responsive:
- **Desktop** (1024px+): Full features, side-by-side layout
- **Tablet** (768px-1023px): Adjusted spacing, responsive grid
- **Mobile** (<768px): Single column, touch-friendly buttons

### Media Queries
```css
@media (max-width: 768px) {
  /* Tablet styles */
}

@media (max-width: 480px) {
  /* Mobile styles */
}
```

---

## 🔐 Permission Integration

Components work with `usePermissions` hook:

```javascript
import { usePermissions } from '../utils/rolePermissions';

const MyComponent = ({ userRole, userId }) => {
  const permissions = usePermissions(userRole, userId);

  if (!permissions.canComment()) {
    return <div>You don't have permission to comment</div>;
  }

  return <CommentSection />;
};
```

---

## 🧪 Testing

### Mock Component Example
```javascript
// Demo with mock data
import AnnouncementFeedDemo from './pages/classroom/AnnouncementFeedDemo';

// Use in your routes:
<Route path="/demo" element={<AnnouncementFeedDemo />} />
```

### Test Scenarios
1. **Reaction Toggle**: Click emoji picker
2. **Add Comment**: Type comment + send
3. **Edit Comment**: Double-click comment
4. **Delete Comment**: Click trash icon
5. **Reply**: Click "Trả lời" button
6. **Like Comment**: Click heart icon

---

## 🚨 Common Issues & Solutions

### Issue: Icons not showing
**Solution**: 
```bash
npm install lucide-react
```
Verify import: `import { Heart, MessageCircle } from 'lucide-react';`

### Issue: Styles not applying
**Solution**: 
- Check CSS file import
- Verify class names match
- Check CSS specificity

### Issue: Component not rendering
**Solution**:
- Check props are passed correctly
- Verify data structure
- Check console for errors

---

## 📊 Component API

### PostInteraction Props
| Prop | Type | Required | Default |
|------|------|----------|---------|
| post | Object | Yes | - |
| onReactionChange | Function | Yes | - |
| onCommentClick | Function | No | - |
| onShareClick | Function | No | - |
| onDeletePost | Function | No | - |
| isTeacher | Boolean | No | false |
| canInteract | Boolean | No | true |
| onTogglePin | Function | No | - |
| onToggleLockComments | Function | No | - |

### CommentSection Props
| Prop | Type | Required | Default |
|------|------|----------|---------|
| comments | Array | Yes | [] |
| onAddComment | Function | Yes | - |
| onDeleteComment | Function | No | - |
| onEditComment | Function | No | - |
| onLikeComment | Function | No | - |
| onAddReply | Function | No | - |
| currentUserRole | String | No | 'GUEST' |

### MediaUpload Props
| Prop | Type | Required | Default |
|------|------|----------|---------|
| onMediaSelect | Function | Yes | - |
| maxFiles | Number | No | 5 |
| maxFileSize | Number | No | 10485760 |
| allowedTypes | Array | No | [JPG, PNG, GIF, MP4, WebM] |

---

## 🎯 Performance Tips

1. **Memoize Handlers**: Use `useCallback` for event handlers
2. **Lazy Load**: Load comments in batches
3. **Optimize Re-renders**: Avoid unnecessary state updates
4. **Debounce**: Debounce edit/delete actions
5. **Cache**: Cache posts to reduce API calls

---

## 📚 Related Documentation

- **Full Guide**: See `COMMUNITY_INTERACTIONS_GUIDE.md`
- **Integration**: See `INTEGRATION_MIGRATION_GUIDE.md`
- **Implementation**: See `IMPLEMENTATION_SUMMARY.md`
- **Hooks**: See `src/hooks/usePostInteractions.js`
- **Permissions**: See `src/utils/rolePermissions.js`
- **Services**: See `src/services/postInteractionService.js`

---

## 🤝 Contributing

To extend these components:

1. **Add new reaction type**:
   - Update `REACTIONS_MAP` in `PostInteraction.jsx`
   - Add emoji to picker

2. **Add new permission**:
   - Update `PERMISSION_MATRIX` in `rolePermissions.js`
   - Add method to `PermissionChecker` class

3. **Add new feature**:
   - Create new component in `src/components/`
   - Add CSS file
   - Update hooks/services
   - Add tests

---

## 📞 Support

For questions or issues:
1. Check this README
2. Review component code comments
3. See full documentation
4. Contact: support@upnest.edu

---

## 📝 Version

**v1.0.0** - Initial release  
All components production-ready ✅

---

*Last Updated: 2024*
