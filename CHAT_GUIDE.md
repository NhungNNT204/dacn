# 📱 Chat/Messenger System - Complete Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [API Endpoints](#api-endpoints)
7. [WebSocket Protocol](#websocket-protocol)
8. [Database Schema](#database-schema)
9. [Configuration](#configuration)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Chat/Messenger System is a real-time messaging platform integrated into UpNestEdu, enabling:
- **Text messaging** between users
- **Media sharing** (images, videos, files)
- **Group chats** with role-based management
- **Voice/Video calls** with call history
- **Emoji reactions** and message pinning
- **Real-time notifications** via WebSocket

### Technology Stack

**Backend:**
- Spring Boot 2.7+
- Spring Data JPA / Hibernate
- Spring WebSocket (STOMP)
- MySQL Database
- Lombok for code generation

**Frontend:**
- React 18+
- Vite build tool
- WebSocket client (SockJS)
- Tailwind CSS for styling

---

## Architecture

### System Design

```
┌─────────────┐         WebSocket          ┌──────────────────┐
│             │◄───────(/ws/chat)────────►│                  │
│   React     │                            │  Spring Boot     │
│  Frontend   │         REST API           │   Backend        │
│             │◄──────────────────────────►│                  │
└─────────────┘         (/api/v1/)        └──────────────────┘
                                                   │
                                                   │ JPA
                                                   ▼
                                            ┌──────────────┐
                                            │    MySQL     │
                                            │   Database   │
                                            └──────────────┘
```

### Component Hierarchy

**Backend:**
```
ChatController (REST endpoints)
    ├── ChatService (business logic)
    ├── MessageRepository
    ├── ChatGroupRepository
    ├── ChatMemberRepository
    └── CallRecordRepository
    
WebSocketHandler (real-time events)
    ├── Message handling (/app/chat/*)
    ├── Call handling (/app/call/*)
    └── Status updates (/app/user/*)
```

**Frontend:**
```
ChatPage (main container)
├── ChatList (conversation sidebar)
├── ChatBoxMain (message display)
├── CreateGroupModal (group creation)
├── CallModal (voice/video interface)
└── Services
    ├── chatService.js (API calls)
    └── WebSocket client
```

---

## Features

### 1. Text Messaging
- **Send/receive messages** in real-time
- **Edit messages** (with edit timestamp)
- **Delete messages** (soft delete)
- **Search messages** by keyword
- **Message threading** (replies)

### 2. Media Sharing
- **Image upload** and display
- **Video upload** and streaming
- **File attachments**
- **Media preview** in message bubble
- **Lazy loading** for performance

### 3. Group Chat
- **Create groups** with multiple members
- **Add/remove members**
- **Role-based permissions** (Owner, Admin, Member)
- **Group settings** (name, description, avatar)
- **Member management** interface

### 4. Emoji Reactions
- **Quick reactions** on messages (👍, ❤️, 😂, 😮, 😢, 🔥, 👏, 😱)
- **Reaction counter** display
- **Remove reactions**
- **Real-time reaction updates**

### 5. Message Pinning
- **Pin important messages**
- **View pinned messages** list
- **Unpin functionality**

### 6. Voice/Video Calls
- **Initiate voice calls**
- **Initiate video calls**
- **Call history** tracking
- **Missed calls** indicator
- **Call duration** recording
- **Call states** (ringing, accepted, rejected, ended)

### 7. Notifications
- **Unread message count**
- **Mention notifications** (@user)
- **Call notifications**
- **Muted conversation** option
- **Archive conversation** option

---

## Backend Setup

### 1. Database Setup

**Create database:**
```sql
CREATE DATABASE upnest_edu;
USE upnest_edu;
```

**Run migrations (already in UpNestEdu.sql):**
```bash
mysql -u root -p upnest_edu < UpNestEdu.sql
```

### 2. Entity Classes

**Location:** `edu/src/main/java/com/upnest/edu/modules/social/entity/`

**Files:**
- `Message.java` - Chat message entity
- `ChatGroup.java` - Chat conversation (1-1 or group)
- `ChatMember.java` - Group membership with roles
- `CallRecord.java` - Call history tracking

### 3. Repository Interfaces

**Location:** `edu/src/main/java/com/upnest/edu/modules/social/repository/`

**Files:**
- `MessageRepository.java` - Message queries
- `ChatGroupRepository.java` - Chat group queries
- `ChatMemberRepository.java` - Member queries
- `CallRecordRepository.java` - Call history queries

### 4. Service Layer

**Location:** `edu/src/main/java/com/upnest/edu/modules/social/service/`

**ChatService.java** provides:
- Message CRUD operations
- Chat group management
- Call lifecycle management
- Unread count tracking
- Search functionality

### 5. REST Controller

**Location:** `edu/src/main/java/com/upnest/edu/modules/social/controller/`

**ChatController.java** exposes:
- 12+ REST endpoints
- Request/response mapping
- Error handling

### 6. WebSocket Handler

**Location:** `edu/src/main/java/com/upnest/edu/modules/social/handler/`

**WebSocketHandler.java** manages:
- Real-time message delivery
- Connection/disconnection
- Call signaling
- Status updates

### 7. Configuration

**Location:** `edu/src/main/java/com/upnest/edu/config/`

**WebSocketConfig.java** sets up:
- STOMP endpoints
- Message broker
- SockJS fallback

---

## Frontend Setup

### 1. Component Files

**Location:** `upnest-web/src/pages/student/`

**Components:**
- `ChatPage.jsx` - Main chat container (300+ lines)
- `ChatList.jsx` - Conversation sidebar (150+ lines)
- `ChatBoxMain.jsx` - Message display area (300+ lines)
- `CallModal.jsx` - Voice/video call interface (80+ lines)

### 2. Style Files

**Location:** `upnest-web/src/pages/student/styles/`

**CSS:**
- `ChatPage.css` - Main layout (250+ lines)
- `ChatBox.css` - Message display styling (350+ lines)
- `CallModal.css` - Call interface styling (300+ lines)

### 3. Service Layer

**Location:** `upnest-web/src/services/`

**chatService.js** provides:
- REST API calls via axios
- WebSocket connection management
- Mock data fallback for testing

### 4. Installation

```bash
cd upnest-web
npm install
npm run dev
```

---

## API Endpoints

### Base URL
```
http://localhost:8080/api/v1/social/messages
```

### Message Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/conversations` | Get user's conversations |
| `GET` | `/{chatGroupId}` | Get messages from chat |
| `POST` | `/` | Send text message |
| `POST` | `/media` | Send media message |
| `PUT` | `/{messageId}` | Edit message |
| `DELETE` | `/{messageId}` | Delete message |
| `POST` | `/{messageId}/reactions` | Add emoji reaction |
| `POST` | `/{messageId}/pin` | Pin message |
| `GET` | `/{chatGroupId}/search` | Search messages |
| `GET` | `/{chatGroupId}/pinned` | Get pinned messages |

### Chat Group Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/groups/private` | Create/get private chat |
| `POST` | `/groups` | Create group chat |
| `GET` | `/groups/{chatGroupId}/members` | Get group members |
| `POST` | `/groups/{chatGroupId}/members` | Add member |
| `DELETE` | `/groups/{chatGroupId}/members/{userId}` | Remove member |
| `POST` | `/groups/{chatGroupId}/mute` | Toggle mute |
| `POST` | `/groups/{chatGroupId}/archive` | Toggle archive |

### Call Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/calls/initiate` | Initiate call |
| `POST` | `/calls/{callId}/answer` | Answer call |
| `POST` | `/calls/{callId}/reject` | Reject call |
| `POST` | `/calls/{callId}/end` | End call |
| `GET` | `/calls/history/{userId}` | Get call history |
| `GET` | `/calls/missed/{userId}` | Get missed calls |

### Request/Response Examples

**Send Message:**
```json
POST /api/v1/social/messages
{
  "chatGroupId": 1,
  "senderId": 123,
  "content": "Hello, how are you?",
  "senderName": "John Doe",
  "senderAvatar": "https://..."
}

Response:
{
  "id": 1001,
  "chatGroupId": 1,
  "senderId": 123,
  "content": "Hello, how are you?",
  "messageType": "TEXT",
  "createdAt": "2024-01-15T10:30:00"
}
```

**Create Group Chat:**
```json
POST /api/v1/social/messages/groups
{
  "groupName": "Project Team",
  "groupOwnerId": 123,
  "memberIds": [123, 124, 125],
  "groupDescription": "For project discussion"
}

Response:
{
  "id": 5,
  "isGroup": true,
  "groupName": "Project Team",
  "groupOwnerId": 123,
  "memberCount": 3,
  "createdAt": "2024-01-15T10:30:00"
}
```

**Initiate Call:**
```json
POST /api/v1/social/messages/calls/initiate
{
  "chatGroupId": 1,
  "callerId": 123,
  "receiverId": 124,
  "callType": "VIDEO"
}

Response:
{
  "id": 2001,
  "callerId": 123,
  "receiverId": 124,
  "callType": "VIDEO",
  "callStatus": "RINGING",
  "createdAt": "2024-01-15T10:30:00"
}
```

---

## WebSocket Protocol

### Connection

**URL:**
```
ws://localhost:8080/ws/chat
```

**With SockJS fallback:**
```
ws://localhost:8080/ws/chat/websocket
```

### Message Subscriptions

**Frontend subscribes to:**

```javascript
// Broadcast messages in group
/topic/chat/groups/{chatGroupId}

// Private messages for user
/user/queue/private

// Call notifications
/topic/calls

// Typing indicators
/topic/chat/groups/{chatGroupId}/typing

// User notifications
/user/queue/notifications
```

### Message Publishing

**Frontend publishes to:**

```javascript
// Send group message
/app/chat/send/{chatGroupId}

// Send private message
/app/chat/private/{receiverId}

// Send media message
/app/chat/media/{chatGroupId}

// Add reaction
/app/chat/reaction/{messageId}

// Typing indicator
/app/chat/typing/{chatGroupId}

// Initiate call
/app/call/initiate

// Answer call
/app/call/answer

// Reject call
/app/call/reject

// End call
/app/call/end
```

### WebSocket Message Format

```javascript
{
  "type": "message",           // message, typing, call, reaction, etc.
  "payload": {
    // Dynamic based on type
    "id": 1001,
    "content": "Hello",
    "senderName": "John",
    ...
  },
  "timestamp": "2024-01-15T10:30:00"
}
```

### Example Flow

**1. Connect:**
```javascript
const client = new StompClient();
client.connect({}, () => {
  console.log("Connected");
});
```

**2. Subscribe to group messages:**
```javascript
client.subscribe('/topic/chat/groups/5', (message) => {
  console.log("Received:", JSON.parse(message.body));
});
```

**3. Send message:**
```javascript
client.send('/app/chat/send/5', {}, JSON.stringify({
  chatGroupId: 5,
  senderId: 123,
  content: "Hello everyone!"
}));
```

**4. Disconnect:**
```javascript
client.disconnect(() => {
  console.log("Disconnected");
});
```

---

## Database Schema

### Messages Table
```sql
CREATE TABLE messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  chat_group_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  sender_name VARCHAR(100),
  sender_avatar VARCHAR(255),
  content LONGTEXT,
  message_type VARCHAR(50),           -- TEXT, IMAGE, VIDEO, EMOJI, FILE
  media_url VARCHAR(500),
  media_type VARCHAR(50),
  media_size BIGINT,
  reply_to_id BIGINT,                 -- For message threading
  is_pinned BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP,
  reactions JSON,                     -- {"👍": 1, "❤️": 2}
  mentions JSON,                      -- [123, 124]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (chat_group_id) REFERENCES chat_groups(id),
  FOREIGN KEY (reply_to_id) REFERENCES messages(id),
  INDEX (chat_group_id, created_at DESC),
  INDEX (sender_id),
  INDEX (created_at)
);
```

### Chat Groups Table
```sql
CREATE TABLE chat_groups (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  is_group BOOLEAN DEFAULT FALSE,
  group_name VARCHAR(100),
  group_description VARCHAR(500),
  group_avatar VARCHAR(255),
  group_owner_id BIGINT,
  max_members INT DEFAULT 100,
  allow_members_invite BOOLEAN DEFAULT TRUE,
  allow_members_edit_group BOOLEAN DEFAULT FALSE,
  last_message_at TIMESTAMP,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (group_owner_id) REFERENCES users(id),
  INDEX (last_message_at DESC)
);
```

### Chat Members Table
```sql
CREATE TABLE chat_members (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  chat_group_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  user_name VARCHAR(100),
  user_avatar VARCHAR(255),
  role VARCHAR(50) DEFAULT 'MEMBER',  -- OWNER, ADMIN, MEMBER
  is_muted BOOLEAN DEFAULT FALSE,
  is_blocked BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  unread_count INT DEFAULT 0,
  last_read_at TIMESTAMP,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (chat_group_id) REFERENCES chat_groups(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_member (chat_group_id, user_id)
);
```

### Call Records Table
```sql
CREATE TABLE call_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  chat_group_id BIGINT,
  caller_id BIGINT NOT NULL,
  receiver_id BIGINT,
  message_id BIGINT,
  call_type VARCHAR(50),              -- VOICE, VIDEO, GROUP
  call_status VARCHAR(50),            -- INITIATED, RINGING, ACCEPTED, REJECTED, ENDED, MISSED
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  duration_seconds BIGINT,
  is_missed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (caller_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (message_id) REFERENCES messages(id),
  FOREIGN KEY (chat_group_id) REFERENCES chat_groups(id),
  INDEX (caller_id, created_at DESC),
  INDEX (created_at DESC)
);
```

---

## Configuration

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/upnest_edu
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
        use_sql_comments: true

# WebSocket configuration
server:
  port: 8080
  servlet:
    context-path: /

# CORS configuration
cors:
  allowed-origins: http://localhost:5173
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: Content-Type,Authorization
  max-age: 3600
```

### Frontend Environment

Create `upnest-web/.env`:
```
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080
USE_MOCK_SERVICE=false
```

---

## Troubleshooting

### Issue: WebSocket connection fails

**Solution:**
1. Check server is running: `http://localhost:8080/actuator/health`
2. Verify WebSocket endpoint: `/ws/chat`
3. Check firewall allows WebSocket (port 8080)
4. Verify CORS configuration

### Issue: Messages not appearing in real-time

**Solution:**
1. Check WebSocket connection in browser DevTools
2. Verify subscription to correct topic: `/topic/chat/groups/{id}`
3. Check message broker is enabled in WebSocketConfig
4. Review server logs for errors

### Issue: Group members not syncing

**Solution:**
1. Verify `ChatMember` records in database
2. Check `unique constraint (chat_group_id, user_id)` not violated
3. Review `addMember()` and `removeMember()` logic in ChatService

### Issue: Calls not connecting

**Solution:**
1. Verify `CallRecord` created in database
2. Check call states are transitioning correctly
3. Ensure both users are connected to WebSocket
4. Review call signaling logic in WebSocketHandler

### Issue: Database connection error

**Solution:**
1. Verify MySQL is running
2. Check credentials in `application.yml`
3. Ensure database `upnest_edu` exists
4. Run migrations: `mysql -u root -p upnest_edu < UpNestEdu.sql`

---

## Performance Optimization

### Database Indexes
- `chat_groups(last_message_at DESC)` - For sorting conversations
- `messages(chat_group_id, created_at DESC)` - For message pagination
- `messages(sender_id)` - For user message history
- `call_records(caller_id, created_at DESC)` - For call history

### Frontend Optimization
- Lazy load messages in ChatBoxMain
- Pagination (50 messages per page)
- Debounce typing indicators
- Cache recent conversations

### Backend Optimization
- Connection pooling: HikariCP
- Query optimization: Eager/lazy loading
- Caching: Spring Cache (optional Redis)
- Pagination: Page-based fetching

---

## Deployment

### Docker Setup

**Dockerfile:**
```dockerfile
FROM maven:3.8.1-openjdk-17
COPY . /app
WORKDIR /app
RUN mvn clean package -DskipTests
FROM openjdk:17-slim
COPY --from=0 /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: upnest_edu
    ports:
      - "3306:3306"
  
  backend:
    build: ./edu
    ports:
      - "8080:8080"
    depends_on:
      - mysql
```

---

## Support & Documentation

For more information:
- Backend API docs: `/swagger-ui.html` (if Swagger enabled)
- Database schema: `UpNestEdu.sql`
- Frontend components: `upnest-web/src/pages/student/`

---

**Last Updated:** January 15, 2024
**Version:** 1.0.0
**Status:** Production Ready ✅
