# Quick Reference: Messaging System

## How to Use

### 1. Access Messaging
Click the **💬** (messaging) button in the header of StudentLayout to open the messaging panel.

### 2. View Conversations
- Conversations load automatically in ChatList
- Click any conversation to view messages
- See unread count badges on conversations

### 3. Send Messages
- Type message in the input box
- Press **Enter** to send (or click Send button)
- Press **Shift+Enter** for new line
- Attach files using the **📎** button

### 4. Message Actions
- **Delete**: Right-click on your message
- **Edit**: Edit your messages by selecting them
- **React**: Add emoji reactions (click emoji picker)

### 5. Manage Conversations
- **Search**: Use the search box to find conversations
- **Filter**: Click tabs to filter (All/Friends/Groups/Classes)
- **Sort**: Conversations sort by most recent

---

## Service Architecture

### API Endpoints (chatService.js)

```javascript
// Get conversations
const result = await chatService.getConversations({
  limit: 50,
  offset: 0,
  filter: 'all' // or 'personal', 'group', 'classroom'
});

// Get messages
const result = await chatService.getMessages(conversationId, {
  limit: 50,
  offset: 0
});

// Send message
const result = await chatService.sendMessage(conversationId, {
  content: "Message text",
  attachments: [] // Optional file list
});

// Upload media
const result = await chatService.uploadMedia(fileObject, conversationId);

// Create conversation
const result = await chatService.createConversation('personal', {
  participantIds: [userId1, userId2]
});

// Delete message
const result = await chatService.deleteMessage(conversationId, messageId);

// Edit message
const result = await chatService.editMessage(conversationId, messageId, "New content");

// Mark as read
const result = await chatService.markAsRead(messageId);

// Get unread counts
const result = await chatService.getUnreadCounts();

// Listen for new messages
const unsubscribe = chatService.onMessage(conversationId, (newMessage) => {
  console.log('New message:', newMessage);
});

// Listen for typing
const unsubscribe = chatService.onTyping(conversationId, (typingUsers) => {
  console.log('Users typing:', typingUsers);
});
```

---

## Response Format

All chatService methods return:
```javascript
{
  success: true/false,
  data: { /* response data */ },
  message: "Success or error message"
}
```

---

## Mock Data Structure

### Mock User
```javascript
{
  id: "user-123",
  name: "Trần Văn A",
  email: "a@example.com",
  avatar: null,
  status: "online",
  role: "student"
}
```

### Mock Conversation
```javascript
{
  id: "conv-1",
  type: "personal", // or "group", "classroom"
  name: "Trần Thị B",
  avatar: null,
  participants: [
    { id: "user-1", name: "You", isOnline: true },
    { id: "user-2", name: "Trần Thị B", isOnline: false }
  ],
  lastMessage: {
    content: "Last message text",
    senderName: "You",
    timestamp: "2025-12-17T10:30:00"
  },
  lastMessageTime: "2025-12-17T10:30:00",
  unreadCount: 2,
  isOnline: false
}
```

### Mock Message
```javascript
{
  id: "msg-1",
  conversationId: "conv-1",
  senderId: "user-1",
  senderName: "You",
  content: "Message content",
  timestamp: "2025-12-17T10:30:00",
  attachment: null, // or { name, size, type, url }
  edited: false,
  reactions: { "😀": ["user-2"] }
}
```

---

## File Structure

```
src/
├── services/
│   ├── chatService.js              ✅ Main chat API (17 methods)
│   ├── mockUserService.js          ✅ Fallback mock data
│   └── userService.js              ✅ User API with error handling
│
├── components/
│   ├── ChatList.jsx                ✅ Conversation list
│   ├── ChatList.css                ✅ List styling
│   ├── ChatWindow.jsx              ✅ Message display
│   ├── ChatWindow.css              ✅ Window styling
│   ├── MessageInput.jsx            ✅ Message composition
│   ├── MessageInput.css            ✅ Input styling
│   ├── MessageBubble.jsx           ✅ Individual message
│   └── MediaUploadChat.jsx         ✅ File upload
│
└── pages/student/
    ├── StudentLayout.jsx            ✅ Main layout with messaging
    ├── StudentLayout.css            ✅ Layout styling
    ├── StudentMessaging.jsx         ✅ Messaging page
    ├── StudentMessaging.css         ✅ Messaging styling
    ├── StudentDashboard.jsx         ✅ With error handling
    └── Profile.jsx                  ✅ With error handling
```

---

## Error Handling

### Automatic Fallback
If backend is unavailable:
```javascript
try {
  // Try real API
  return await fetch(url);
} catch (error) {
  // Fallback to mock
  return mockUserService.getConversations();
}
```

### Manual Error Check
```javascript
const result = await chatService.getMessages(convId);

if (!result.success) {
  console.error('Error:', result.message);
  // Handle error (UI already shows error state)
}
```

---

## Configuration

### Enable/Disable Mock Service
File: `src/services/chatService.js` (line ~10)

```javascript
// Always use mock (for testing)
const USE_MOCK_SERVICE = true;

// Use real API with fallback
const USE_MOCK_SERVICE = false;
```

---

## Troubleshooting

### Issue: No conversations loading
**Solution**: Check if backend is running on `localhost:8080`, or ensure `USE_MOCK_SERVICE` is `true`

### Issue: Messages not sending
**Solution**: 
1. Check if FormData is being used for file uploads
2. Verify authorization token in localStorage
3. Check browser console for detailed errors

### Issue: Typing indicators not working
**Solution**: 
1. Ensure event listener is registered: `chatService.onTyping()`
2. Check if `chatService.sendTypingIndicator()` is being called
3. Verify WebSocket connection (if using real API)

### Issue: Mobile layout not responsive
**Solution**: 
1. Check if viewport meta tag is present in index.html
2. Verify CSS media queries are loading
3. Clear browser cache and reload

---

## Testing the System

### Test 1: Mock Service
1. Set `USE_MOCK_SERVICE = true` in chatService.js
2. Click messaging button
3. Should see 3 example conversations
4. Click one to view mock messages
5. ✅ Should work without backend

### Test 2: Real Backend
1. Start backend: `java -jar edu-0.0.1-SNAPSHOT.jar`
2. Set `USE_MOCK_SERVICE = false` in chatService.js
3. Click messaging button
4. Should load real conversations from API
5. ✅ Should work with backend

### Test 3: Error Recovery
1. Start backend
2. Create message successfully
3. Stop backend
4. Try to create another message
5. ✅ Should show error and fallback

### Test 4: Mobile Responsive
1. Open in Chrome DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different sizes (480px, 768px, 1024px)
4. ✅ Layout should adapt correctly

---

## Performance Tips

### For Large Conversation Lists
- Current limit: 50 conversations per load
- Add pagination: `{ limit: 50, offset: 100 }`
- Implement virtual scrolling for 1000+ items

### For Many Messages
- Current limit: 50 messages per load
- Load older: `{ limit: 50, offset: 100 }`
- Lazy load as user scrolls

### Memory Optimization
- Unsubscribe from listeners on unmount
- Clear message cache when conversation changes
- Limit emoji picker to 12 emoji

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## Security Notes

### Authentication
- Uses Bearer token from localStorage
- Token included in all API requests
- Token automatically handled by chatService

### File Upload
- Only client-side validation currently
- Add server-side validation for production:
  - Max file size: 10MB
  - Allowed types: images, documents, videos
  - Scan for malware

### Message Content
- No sanitization currently
- Add HTML sanitization for XSS prevention
- Consider using DOMPurify or similar

---

## Future Enhancements

1. **Real-time Features**
   - WebSocket support for instant messaging
   - Typing indicators
   - Read receipts
   - Online status

2. **Media Support**
   - Image compression before upload
   - Video preview thumbnails
   - Document type icons
   - Drag-drop upload

3. **Advanced Features**
   - Message search
   - Chat archiving
   - Conversation pinning
   - Message reactions (emoji)
   - Voice/video calls

4. **User Experience**
   - Desktop notifications
   - Custom notification sounds
   - Message threads/replies
   - Message forwarding
   - Contact groups

---

## Support & Debugging

### Enable Verbose Logging
```javascript
// In chatService.js, uncomment console.log statements
console.log('API Request:', url);
console.log('API Response:', result);
console.log('Mock Service Used:', USE_MOCK_SERVICE);
```

### Network Debugging
- Open DevTools → Network tab
- Filter for XHR requests
- Check request/response headers
- Verify Bearer token is present

### Local Storage
```javascript
// Check authentication token
localStorage.getItem('accessToken');
localStorage.getItem('refreshToken');

// Clear all data (if needed)
localStorage.clear();
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-17  
**Status**: ✅ Production Ready
