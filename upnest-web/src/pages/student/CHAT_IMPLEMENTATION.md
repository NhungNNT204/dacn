# 📱 Chat System Implementation Guide

## Overview

Complete real-time messaging system supporting:
- ✅ 1:1 Direct Messages
- ✅ Group Chats
- ✅ Broadcast Channels
- ✅ File/Image/Video Sharing
- ✅ Real-time Updates (WebSocket)
- ✅ Typing Indicators
- ✅ Online Status
- ✅ Message History with Pagination
- ✅ Emoji Support
- ✅ Responsive Design (Mobile/Tablet/Desktop)

---

## File Structure

```
src/
├── pages/student/
│   ├── StudentChat.jsx          # Main chat page component
│   ├── components/
│   │   ├── ChatSidebar.jsx      # Conversation list sidebar
│   │   ├── ChatWindow.jsx       # Main chat interface
│   │   ├── MessageBox.jsx       # Message display
│   │   └── MessageInput.jsx     # Message input area
│   └── styles/
│       ├── StudentChat.css      # Main layout styling
│       ├── ChatSidebar.css      # Sidebar styling
│       ├── ChatWindow.css       # Chat window styling
│       ├── MessageBox.css       # Messages styling
│       └── MessageInput.css     # Input area styling
└── services/
    └── chatService.js           # Chat business logic & WebSocket
```

---

## Component Architecture

### 1. StudentChat (Main Container)
**Purpose**: Orchestrates the entire chat system
**Responsibilities**:
- Manage selected conversation state
- Handle WebSocket initialization
- Load conversations on mount
- Create new chats/groups
- Display mobile sidebar on small screens

**Key Props**: None (standalone page component)

**Key State**:
```javascript
{
  selectedConversation: Object,
  conversations: Array,
  isMobileMenuOpen: Boolean,
  isInitializing: Boolean,
  error: String,
  showNewChatModal: Boolean,
  newChatType: '1:1' | 'group'
}
```

**Key Methods**:
- `initializeChat()` - Init WebSocket and load conversations
- `handleSelectConversation(conv)` - Set active conversation
- `handleNewChat(type)` - Open new chat modal
- `handleCreateNewChat(userIds, groupName)` - Create conversation

---

### 2. ChatSidebar
**Purpose**: Display and manage conversation list
**Responsibilities**:
- Show all conversations (1:1, group, broadcast)
- Filter by type and search
- Display unread counts
- Show online status for 1:1 chats
- Handle conversation selection

**Props**:
```javascript
{
  activeConversationId: String,
  onSelectConversation: Function,
  onNewChat: Function(type)
}
```

**Key Features**:
- Search conversations in real-time
- Filter tabs: All, Private, Group, Broadcast
- Auto-load on mount
- Avatar with online indicator
- Unread badge
- Last message preview with timestamp
- Participant count for groups

---

### 3. ChatWindow
**Purpose**: Main chat interface
**Responsibilities**:
- Display messages
- Handle typing indicators
- Show conversation header
- Load and subscribe to new messages

**Props**:
```javascript
{
  conversation: Object,
  onClose: Function
}
```

**Key Features**:
- Auto-scroll to latest message
- Typing indicators
- Message status (sending/sent/delivered/read)
- Error handling with banner
- Loading states
- Header with online status

---

### 4. MessageBox
**Purpose**: Display messages grouped by date
**Responsibilities**:
- Render messages with proper styling
- Group messages by date
- Support multiple content types
- Show sender info for group messages
- Format timestamps

**Props**:
```javascript
{
  messages: Array<Message>
}
```

**Supported Message Types**:
- `text` - Plain text
- `image` - Image attachment
- `video` - Video with player
- `file` - File download
- `mixed` - Text + attachments

---

### 5. MessageInput
**Purpose**: Compose and send messages
**Responsibilities**:
- Handle text input with auto-resize
- Manage file uploads
- Support emoji picker
- Validate message length
- Show attachments preview

**Props**:
```javascript
{
  onSend: Function(content, attachments),
  onTyping: Function()
}
```

**Key Features**:
- Auto-resize textarea
- Emoji picker (16 emojis)
- File attachment (max 5 files, 50MB each)
- Image/Video/File upload
- Character count warning
- Ctrl+Enter to send
- Attachment preview with remove
- Loading state

---

## Service Layer (chatService.js)

### Configuration
```javascript
const USE_MOCK_SERVICE = true;        // Toggle mock data
const WS_URL = 'ws://localhost:8080'; // WebSocket URL
const API_BASE_URL = 'http://localhost:8080/api'; // API base
```

### Core Methods

#### 1. `initWebSocket(userId, token)`
Initialize real-time connection
```javascript
await chatService.initWebSocket(userId, token);
// Returns: Promise<boolean>
```

#### 2. `getConversations()`
Fetch all conversations
```javascript
const result = await chatService.getConversations();
// Returns: { success: true, data: [], total: 0 }
```

#### 3. `getMessages(conversationId, page, limit)`
Fetch messages for conversation
```javascript
const result = await chatService.getMessages('conv-1', 1, 50);
// Returns: { success: true, data: [], hasMore: false, total: 0 }
```

#### 4. `sendMessage(conversationId, content, attachments)`
Send a message
```javascript
const result = await chatService.sendMessage('conv-1', 'Hello', []);
// Returns: { success: true, data: messageObject }
```

#### 5. `createPrivateChat(participantId)`
Create 1:1 conversation
```javascript
const result = await chatService.createPrivateChat('user-2');
// Returns: { success: true, data: conversationObject }
```

#### 6. `createGroupChat(groupName, participantIds)`
Create group chat
```javascript
const result = await chatService.createGroupChat('Team Project', ['user-2', 'user-3']);
// Returns: { success: true, data: conversationObject }
```

#### 7. `onMessage(callback)`
Subscribe to new messages
```javascript
const unsubscribe = chatService.onMessage((newMessage) => {
  console.log('New message:', newMessage);
});

// Cleanup
unsubscribe();
```

#### 8. `onTyping(callback)`
Subscribe to typing indicators
```javascript
const unsubscribe = chatService.onTyping((typingData) => {
  console.log('User typing:', typingData);
});
```

#### 9. `sendTypingIndicator(conversationId)`
Send typing indicator
```javascript
chatService.sendTypingIndicator('conv-1');
```

---

## Data Models

### Conversation Object
```javascript
{
  // Common
  id: String,
  type: '1:1' | 'group' | 'broadcast',
  lastMessage: String,
  lastMessageTime: Date,
  unreadCount: Number,

  // For 1:1
  participantId: String,
  participantName: String,
  participantAvatar: String,
  isOnline: Boolean,
  status: 'online' | 'offline' | 'away',

  // For group
  groupName: String,
  groupAvatar: String,
  participantCount: Number,
  participants: Array,

  // For broadcast
  channelName: String,
  channelAvatar: String,
  description: String
}
```

### Message Object
```javascript
{
  id: String,
  conversationId: String,
  senderId: String,
  senderName: String,
  senderAvatar: String,
  content: String,
  type: 'text' | 'image' | 'video' | 'file' | 'mixed',
  timestamp: Date,
  status: 'sending' | 'sent' | 'delivered' | 'read',
  edited: Boolean,
  attachments: Array<{
    id: String,
    type: String,
    name: String,
    size: Number,
    url: String
  }>
}
```

---

## Integration Steps

### Step 1: Add Route
```javascript
// In your main routing file
import StudentChat from './pages/student/StudentChat';

<Route path="/chat" element={<StudentChat />} />
```

### Step 2: Add Link to Navigation
```javascript
import { MessageCircle } from 'lucide-react';

<NavLink to="/chat">
  <MessageCircle className="w-5 h-5" />
  Chat
</NavLink>
```

### Step 3: Configure Environment
```bash
# .env file
REACT_APP_WS_URL=ws://localhost:8080/ws
REACT_APP_API_URL=http://localhost:8080/api
```

### Step 4: Initialize on App Load
```javascript
useEffect(() => {
  // In your main App component
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  if (token && userId) {
    chatService.initWebSocket(userId, token)
      .catch(err => console.error('WebSocket init failed:', err));
  }
}, []);
```

---

## API Endpoints Required (Backend)

### Conversations
- `GET /api/conversations` - Get all conversations
- `POST /api/conversations/private` - Create 1:1 chat
- `POST /api/conversations/group` - Create group chat
- `DELETE /api/conversations/:id` - Delete conversation
- `GET /api/conversations/search` - Search conversations

### Messages
- `GET /api/conversations/:id/messages` - Get messages
- `POST /api/conversations/:id/messages` - Send message
- `PUT /api/conversations/:id/messages/:msgId/read` - Mark as read
- `PUT /api/conversations/:id/messages/:msgId` - Edit message
- `DELETE /api/conversations/:id/messages/:msgId` - Delete message

### WebSocket Events
- `message` - New message received
- `typing` - User typing indicator
- `status` - User status change
- `read` - Message read receipt

---

## Testing Checklist

### Features
- [ ] View all conversations (1:1, group, broadcast)
- [ ] Search conversations by name
- [ ] Filter by conversation type
- [ ] Select conversation and load messages
- [ ] Send text message
- [ ] Send with emoji
- [ ] Attach and send image
- [ ] Attach and send video
- [ ] Attach and send file
- [ ] View message attachments
- [ ] Create 1:1 chat
- [ ] Create group chat
- [ ] See unread badge
- [ ] Mark messages as read
- [ ] See online status
- [ ] See typing indicator

### Responsive
- [ ] Desktop (1024px+) - Side-by-side layout
- [ ] Tablet (768-1023px) - Collapsible sidebar
- [ ] Mobile (480-767px) - Full-width with toggle
- [ ] Small (< 480px) - Optimized layout
- [ ] Mobile menu toggle works
- [ ] Sidebar closes on selection

### Error Handling
- [ ] Show error for failed message send
- [ ] Show error for failed conversation load
- [ ] Retry functionality
- [ ] Handle network disconnection
- [ ] Handle WebSocket failure

### Performance
- [ ] Messages scroll smoothly
- [ ] Attachments load correctly
- [ ] No memory leaks on unmount
- [ ] Emoji picker responsive
- [ ] Search works smoothly

---

## Customization

### Change Colors
Edit `src/pages/student/styles/StudentChat.css`:
```css
/* Primary color: #4F46E5 to your color */
background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
```

### Add More Emojis
In `MessageInput.jsx`:
```javascript
const EMOJI_LIST = [
  '😀', '😂', '😍', '🥰', '😢', '😡', '🤔', '👍',
  '👏', '🎉', '🎊', '❤️', '💯', '🔥', '⭐', '✨'
  // Add more here
];
```

### Change File Size Limit
In `MessageInput.jsx`:
```javascript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB → your size
```

### Change Max Attachments
In `MessageInput.jsx`:
```javascript
const MAX_ATTACHMENTS = 5; // Change to your limit
```

---

## Troubleshooting

### WebSocket Connection Failed
```javascript
// Check in browser console
// If using mock service, set USE_MOCK_SERVICE = true
// Enable mock data for development
```

### Messages Not Loading
```javascript
// Check chatService.js
// Verify getMessages() method returns proper data
// Check message timestamp format
```

### Styling Issues
```css
/* If styles don't apply, check import order */
/* CSS files should be imported after component imports */
import './styles/StudentChat.css';
```

### Mobile Layout Issues
```javascript
// Debug with Chrome DevTools
// Toggle device toolbar to test responsive breakpoints
// Check window resize listeners in components
```

---

## Performance Tips

1. **Message Pagination**: Fetch messages in batches
2. **Virtual Scrolling**: Use for large message lists
3. **Image Optimization**: Compress images before upload
4. **Lazy Loading**: Load conversations on demand
5. **Connection Pooling**: Reuse WebSocket connection

---

## Security Considerations

1. **Sanitize**: Clean user input to prevent XSS
2. **Validate**: Validate file types and sizes
3. **Encrypt**: Use HTTPS/WSS for production
4. **Rate Limit**: Limit message sending rate
5. **Permissions**: Check user access to conversations

---

## Dependencies

- React 18+
- lucide-react (icons)
- Modern CSS (no extra libraries needed)

---

## Support

For issues or questions:
1. Check browser console for errors
2. Review mock data in chatService.js
3. Verify component imports
4. Check CSS file imports
5. Debug WebSocket connection

---

## Future Enhancements

- [ ] Message search
- [ ] Message reactions
- [ ] Voice messages
- [ ] Message pinning
- [ ] Admin features
- [ ] User blocking
- [ ] Message encryption
- [ ] Call recording
- [ ] Screen sharing
- [ ] Message threading
