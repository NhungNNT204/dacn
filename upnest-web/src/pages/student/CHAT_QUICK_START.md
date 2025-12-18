# 🚀 Chat System - Quick Start Guide

## Installation & Setup (3 Steps)

### Step 1: Add Route
Add this to your main routing file (e.g., `App.jsx` or `Router.jsx`):

```javascript
import StudentChat from './pages/student/StudentChat';

// In your Routes
<Route path="/chat" element={<StudentChat />} />
```

### Step 2: Add Navigation Link
Add this to your navigation component:

```javascript
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

<Link to="/chat" className="nav-link">
  <MessageCircle className="w-5 h-5" />
  <span>Tin nhắn</span>
</Link>
```

### Step 3: Configure Environment (Optional)
Create/update `.env` file:

```bash
# WebSocket URL for real-time messaging
REACT_APP_WS_URL=ws://localhost:8080/ws

# API base URL
REACT_APP_API_URL=http://localhost:8080/api
```

---

## Quick Testing

### With Mock Data (No Backend Needed)
1. Navigate to `/chat`
2. See 5 mock conversations:
   - 2 direct messages (1:1 chats)
   - 2 group chats
   - 1 broadcast channel
3. Click any conversation to view messages
4. Type and send messages
5. Upload files/images/videos

### Features to Test
✅ Send text messages  
✅ Attach images, videos, files  
✅ Use emoji picker  
✅ Search conversations  
✅ Filter by type (All, Private, Group, Broadcast)  
✅ Create new 1:1 chat  
✅ Create new group  
✅ See unread badges  
✅ View online status  
✅ Mobile responsive layout  

---

## Component Usage

### Standalone Chat Page
```javascript
import StudentChat from './pages/student/StudentChat';

<StudentChat />
```

### Inside Modal/Dialog
```javascript
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <button onClick={() => setIsOpen(true)}>Open Chat</button>
    {isOpen && (
      <Modal onClose={() => setIsOpen(false)}>
        <StudentChat />
      </Modal>
    )}
  </>
);
```

---

## API Integration

### When Ready to Connect Real Backend

1. **Disable Mock Data**
```javascript
// In src/services/chatService.js
const USE_MOCK_SERVICE = false; // Change from true
```

2. **Update Environment URLs**
```bash
REACT_APP_WS_URL=ws://your-domain.com/ws
REACT_APP_API_URL=https://your-domain.com/api
```

3. **Implement Backend Endpoints** (See CHAT_IMPLEMENTATION.md for full list)

---

## Debugging Tips

### Check Console
Open DevTools (F12) → Console tab for:
- WebSocket connection logs
- API errors
- Component state logs

### Enable Debug Logs
Add to chatService.js:
```javascript
console.log('Loading conversations...');
console.log('WebSocket connected');
```

### Test with Network Tab
Monitor real-time messages:
1. Open DevTools → Network tab
2. Filter by WebSocket
3. Send a message
4. See real-time data

---

## Customization Examples

### Change Primary Color
In `src/pages/student/styles/StudentChat.css`:

**Find:**
```css
background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
```

**Replace with your color:**
```css
background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
```

---

### Add More Emojis
In `MessageInput.jsx`:

```javascript
const EMOJI_LIST = [
  '😀', '😂', '😍', '🥰', '😢', '😡', '🤔', '👍',
  '👏', '🎉', '🎊', '❤️', '💯', '🔥', '⭐', '✨',
  // Add more:
  '🎈', '🎁', '🏆', '⚡'
];
```

---

### Increase File Size Limit
In `MessageInput.jsx`:

```javascript
// From 50MB to 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;
```

---

### Change Message Batch Size
In `chatService.js`:

```javascript
// Change from 50 to 100 messages per page
export const getMessages = async (conversationId, page = 1, limit = 100) => {
```

---

## Common Issues

### Issue: "Cannot find module 'chatService'"
**Solution**: Verify chatService.js exists in `src/services/`

### Issue: Styles not applying
**Solution**: Check CSS import in StudentChat.jsx:
```javascript
import '../styles/StudentChat.css';
```

### Issue: WebSocket not connecting
**Solution**: Check browser console for errors. If using mock service:
```javascript
const USE_MOCK_SERVICE = true; // Keep true for development
```

### Issue: Images not displaying
**Solution**: Ensure image URLs are correct. Check:
1. API returns valid image URLs
2. CORS headers configured on backend
3. Images are publicly accessible

---

## Performance Tips

1. **Large Message Lists**: Implement virtual scrolling
```javascript
// Using react-window
import { FixedSizeList } from 'react-window';
```

2. **Heavy Images**: Compress before upload
```javascript
// Use image compression library
import imageCompression from 'browser-image-compression';
```

3. **Monitor Memory**: Check DevTools Memory tab
- Unsubscribe from listeners on unmount
- Clear message cache periodically

---

## Production Checklist

Before deploying:
- [ ] Set `USE_MOCK_SERVICE = false`
- [ ] Configure real WebSocket URL
- [ ] Configure real API URL
- [ ] Test with real backend
- [ ] Enable HTTPS/WSS
- [ ] Set proper CORS headers
- [ ] Test file upload limits
- [ ] Monitor WebSocket connections
- [ ] Set up error tracking (Sentry)
- [ ] Configure CDN for images
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Load test with concurrent users

---

## File Sizes

| File | Size | Lines |
|------|------|-------|
| StudentChat.jsx | ~9KB | 355 |
| ChatSidebar.jsx | ~6KB | 220 |
| ChatWindow.jsx | ~5KB | 185 |
| MessageBox.jsx | ~6KB | 240 |
| MessageInput.jsx | ~8KB | 320 |
| StudentChat.css | ~15KB | 700 |
| ChatSidebar.css | ~12KB | 520 |
| ChatWindow.css | ~10KB | 430 |
| MessageBox.css | ~9KB | 380 |
| MessageInput.css | ~10KB | 450 |
| **Total** | **~90KB** | **~3,800 lines** |

---

## Browser Support

✅ Chrome/Edge (latest 2 versions)  
✅ Firefox (latest 2 versions)  
✅ Safari (iOS 13+, macOS 10.13+)  
✅ Mobile browsers  

---

## Dependencies

- React 18.0+
- lucide-react (icons)
- Modern CSS (no build tools needed)

---

## Documentation

For detailed information:
- [Complete Implementation Guide](./CHAT_IMPLEMENTATION.md)
- Component API in each component's JSDoc
- Mock data in `chatService.js`

---

## Support

Questions? Check:
1. Browser console for errors
2. Network tab for API requests
3. WebSocket connections
4. Mock data structure
5. Component props validation

---

## Next Steps

1. ✅ Test with mock data
2. ✅ Customize colors/emojis
3. ✅ Implement backend APIs
4. ✅ Connect real database
5. ✅ Deploy to production
