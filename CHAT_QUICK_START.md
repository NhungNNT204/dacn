# ⚡ Chat System - Quick Start Guide

Get the Chat/Messenger system up and running in 5 minutes!

## Prerequisites

- Java 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.8+
- Git

## Quick Setup (5 Minutes)

### Step 1: Backend Setup (2 min)

```bash
# Navigate to backend
cd upnestedu/edu

# Build project
./mvnw clean package -DskipTests

# Run the application
./mvnw spring-boot:run
```

**Expected output:**
```
Started EduApplication in XX seconds
Tomcat started on port 8080
```

**Verify backend is running:**
```bash
curl http://localhost:8080/actuator/health
# Response: {"status":"UP"}
```

### Step 2: Frontend Setup (2 min)

```bash
# Navigate to frontend
cd upnest-web

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

### Step 3: Access the App (1 min)

1. Open browser: `http://localhost:5173`
2. Login with test account
3. Navigate to "Chat" or "Messenger"
4. Start sending messages!

---

## Testing the Chat

### Test 1: Send Text Message
1. Open Chat page
2. Select a conversation (or create new)
3. Type a message in input field
4. Press Enter or click Send
5. Message appears in real-time ✅

### Test 2: Send Media
1. Click attachment icon (📎)
2. Select an image or video
3. Message appears with media preview ✅

### Test 3: Create Group Chat
1. Click "New Group" button
2. Enter group name
3. Select members to add
4. Click Create
5. Group chat created ✅

### Test 4: Voice/Video Call
1. Open a 1-1 conversation
2. Click phone (☎️) or video (📹) icon
3. Other user receives call notification
4. They accept/reject call ✅

### Test 5: Emoji Reactions
1. Hover over a message
2. Click on emoji (👍, ❤️, etc.)
3. Reaction appears on message ✅

### Test 6: Search Messages
1. Type in search field
2. Results appear in real-time ✅

---

## API Quick Reference

### Base URL
```
http://localhost:8080/api/v1/social/messages
```

### Common Endpoints

**Get conversations:**
```bash
curl "http://localhost:8080/api/v1/social/messages/conversations?userId=1"
```

**Send message:**
```bash
curl -X POST http://localhost:8080/api/v1/social/messages \
  -H "Content-Type: application/json" \
  -d '{
    "chatGroupId": 1,
    "senderId": 1,
    "content": "Hello!",
    "senderName": "John"
  }'
```

**Create group:**
```bash
curl -X POST http://localhost:8080/api/v1/social/messages/groups \
  -H "Content-Type: application/json" \
  -d '{
    "groupName": "Team Chat",
    "groupOwnerId": 1,
    "memberIds": [1, 2, 3]
  }'
```

**Get messages:**
```bash
curl "http://localhost:8080/api/v1/social/messages/1?page=0&limit=50"
```

---

## WebSocket Connection

### Test WebSocket with Postman/curl

```bash
# Using wscat (npm install -g wscat)
wscat -c ws://localhost:8080/ws/chat

# Then send:
> {"type":"CONNECT"}
< {"type":"CONNECTED"}

# Subscribe to messages
> {"destination":"/topic/chat/groups/1"}

# Send message
> {"destination":"/app/chat/send/1","payload":{"content":"Hi!"}}
```

---

## File Locations

### Backend Files
```
edu/src/main/java/com/upnest/edu/modules/social/
├── entity/
│   ├── Message.java
│   ├── ChatGroup.java
│   ├── ChatMember.java
│   └── CallRecord.java
├── repository/
│   ├── MessageRepository.java
│   ├── ChatGroupRepository.java
│   ├── ChatMemberRepository.java
│   └── CallRecordRepository.java
├── service/
│   └── ChatService.java (550+ lines)
├── controller/
│   └── ChatController.java (300+ lines)
├── handler/
│   └── WebSocketHandler.java (400+ lines)
└── payload/
    └── ChatPayload.java (DTOs)

config/
├── WebSocketConfig.java
└── SecurityConfig.java
```

### Frontend Files
```
upnest-web/src/pages/student/
├── ChatPage.jsx (300+ lines)
├── ChatList.jsx (150+ lines)
├── ChatBoxMain.jsx (300+ lines)
├── CallModal.jsx (80+ lines)
└── styles/
    ├── ChatPage.css (250+ lines)
    ├── ChatBox.css (350+ lines)
    └── CallModal.css (300+ lines)

services/
└── chatService.js (mock + real API)
```

---

## Database

### Check Database Connection

```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE upnest_edu;

# View tables
SHOW TABLES;

# Check messages
SELECT * FROM messages LIMIT 5;

# Check chat groups
SELECT * FROM chat_groups;

# Check call records
SELECT * FROM call_records;
```

---

## Troubleshooting Quick Fixes

### Issue: Backend won't start
```bash
# Check port 8080 is available
lsof -i :8080

# Kill process if needed
kill -9 <PID>

# Or change port in application.yml
server:
  port: 8081
```

### Issue: WebSocket connection fails
```bash
# Check WebSocket endpoint
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  http://localhost:8080/ws/chat

# Should return 101 Switching Protocols
```

### Issue: Frontend can't connect to backend
```bash
# Check CORS is enabled
curl -H "Origin: http://localhost:5173" \
  http://localhost:8080/actuator/health

# Should have Access-Control-Allow-Origin header
```

### Issue: Messages not saving to database
```bash
# Check database connection
curl http://localhost:8080/actuator/db

# Verify tables exist
mysql -u root -p upnest_edu -e "SHOW TABLES;"

# Check table structure
mysql -u root -p upnest_edu -e "DESCRIBE messages;"
```

---

## Configuration Files

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/upnest_edu
    username: root
    password: your_password
  jpa:
    hibernate:
      ddl-auto: validate
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
USE_MOCK_SERVICE=false
```

---

## Development Tips

### Enable Mock Data (for testing without backend)
In `upnest-web/src/services/chatService.js`:
```javascript
const USE_MOCK_SERVICE = true; // Set to true for mock data
```

### Debug WebSocket
In browser console:
```javascript
// See all WebSocket messages
const socket = new WebSocket('ws://localhost:8080/ws/chat');
socket.onmessage = (event) => console.log('WS:', event.data);
```

### Check Real-time Updates
Open 2 browser tabs, send message in one and see it appear in the other.

---

## Next Steps

1. **Customize UI:** Edit `ChatPage.css` and component styles
2. **Add Features:** Update `ChatService.java` for new functionality
3. **Deploy:** Use Docker Compose in deployment section of CHAT_GUIDE.md
4. **Scale:** Implement Redis caching and horizontal scaling

---

## Resources

- **Full Guide:** See `CHAT_GUIDE.md`
- **API Docs:** See `CHAT_SUMMARY.md`
- **Database:** See `UpNestEdu.sql`

---

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review logs in console
3. Check database connection
4. Verify all services are running
5. See CHAT_GUIDE.md for detailed documentation

---

**Quick Start Complete! 🎉**

Your Chat System is now ready to use!
