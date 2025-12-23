# 🌍 Hệ Thống Cộng Đồng UpNest - Hướng Dẫn Hoàn Chỉnh

## 📋 Tổng Quan

Đây là hệ thống cộng đồng toàn diện cho nền tảng UpNest.EDU với các tính năng:

### ✨ Các Tính Năng Chính

1. **Kết Bạn / Theo Dõi** - Gửi lời mời, chấp nhận, từ chối, hủy kết bạn
2. **Bài Viết** - Đăng bài, chỉnh sửa, xóa bài viết (text, ảnh, video)
3. **Like & Reactions** - Thích bài viết với 6 loại reaction (Like, Love, Haha, Wow, Sad, Angry)
4. **Bình Luận** - Bình luận chính và replies lồng nhau (nested comments)
5. **Chia Sẻ** - Chia sẻ qua tin nhắn, trang cá nhân, nhóm
6. **Lưu Bài Viết** - Lưu vào các danh sách (Đọc lại sau, Công việc, etc.)
7. **Báo Cáo** - Báo cáo bài viết vi phạm
8. **Bảng Tin** - Hiển thị feed được cá nhân hóa
9. **Danh Sách Bạn Bè** - Xem bạn bè, theo dõi, lời mời kết bạn

---

## 🏗️ Cấu Trúc Backend

### Database Entities

#### 1. **Friendship** (Kết Bạn)
```java
- id: Long
- followerId: Long (người gửi yêu cầu)
- followingId: Long (người nhận yêu cầu)
- status: FriendshipStatus (PENDING, ACCEPTED, BLOCKED)
- isMutual: Boolean (kết bạn 2 chiều)
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
```

**FriendshipStatus Enum:**
- `PENDING` - Chờ duyệt
- `ACCEPTED` - Đã kết bạn
- `BLOCKED` - Đã chặn

#### 2. **Post** (Bài Viết)
```java
- id: Long
- authorId: Long
- authorName: String
- authorAvatar: String
- authorType: AuthorType (USER, PAGE, GROUP, COURSE)
- content: String (LONGTEXT)
- postType: PostType (TEXT, IMAGE, VIDEO, POLL)
- imageUrl: String
- videoUrl: String
- videoThumbnail: String
- likeCount: Integer
- commentCount: Integer
- shareCount: Integer
- viewCount: Integer
- isDeleted: Boolean (soft delete)
- isHidden: Boolean
- hiddenByUsers: String (JSON array)
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
- reactions: Set<PostReaction> (OneToMany)
- comments: Set<PostComment> (OneToMany)
- reports: Set<PostReport> (OneToMany)
- savedBy: Set<PostSave> (OneToMany)
- shares: Set<PostShare> (OneToMany)
```

#### 3. **PostReaction** (Like/Emoji)
```java
- id: Long
- post: Post (ManyToOne)
- userId: Long
- userName: String
- userAvatar: String
- reactionType: ReactionType (LIKE, LOVE, HAHA, WOW, SAD, ANGRY)
- createdAt: LocalDateTime
```

**ReactionType Enum:**
- `LIKE` - Thích
- `LOVE` - Yêu
- `HAHA` - Haha
- `WOW` - Wow
- `SAD` - Buồn
- `ANGRY` - Tức giận

#### 4. **PostComment** (Bình Luận)
```java
- id: Long
- post: Post (ManyToOne)
- userId: Long
- userName: String
- userAvatar: String
- content: String (LONGTEXT)
- imageUrl: String
- parentComment: PostComment (ManyToOne - null nếu comment chính)
- replies: Set<PostComment> (OneToMany - các reply)
- likeCount: Integer
- isDeleted: Boolean (soft delete)
- createdAt: LocalDateTime
- updatedAt: LocalDateTime
```

#### 5. **PostSave** (Lưu Bài Viết)
```java
- id: Long
- post: Post (ManyToOne)
- userId: Long
- collectionName: String (danh sách: "Đọc lại sau", "Công việc")
- createdAt: LocalDateTime
```

#### 6. **PostShare** (Chia Sẻ Bài Viết)
```java
- id: Long
- post: Post (ManyToOne)
- userId: Long
- userName: String
- shareType: ShareType (MESSAGE, PROFILE, GROUP)
- targetId: Long (ID người nhận/bài viết/nhóm)
- shareMessage: String
- createdAt: LocalDateTime
```

**ShareType Enum:**
- `MESSAGE` - Chia sẻ qua tin nhắn
- `PROFILE` - Chia sẻ về trang cá nhân
- `GROUP` - Chia sẻ đến nhóm

#### 7. **PostReport** (Báo Cáo Bài Viết)
```java
- id: Long
- post: Post (ManyToOne)
- reporterId: Long
- reporterName: String
- reportType: ReportType (INAPPROPRIATE, SPAM, HARASSMENT, VIOLENCE, MISINFORMATION)
- reason: String
- status: ReportStatus (PENDING, APPROVED, REJECTED)
- adminNotes: String
- createdAt: LocalDateTime
- reviewedAt: LocalDateTime
```

---

## 🛠️ Backend Services

### 1. FriendshipService
```java
// Kết bạn
sendFriendRequest(followerId, followingId)
acceptFriendRequest(requestId)
removeFriendship(followerId, followingId)
blockUser(followerId, followingId)
unblockUser(followerId, followingId)

// Kiểm tra
areFriends(userId1, userId2): Boolean
isBlocked(userId1, userId2): Boolean

// Lấy danh sách
getFriends(userId): List
getFollowers(userId): List
getPendingRequests(userId): List
```

### 2. PostService
```java
createPost(post): Post
updatePost(postId, post): Post
deletePost(postId, userId): void
getPostById(postId): Post
getUserPosts(authorId): List
getFeed(userId, pageable): Page
getSavedPosts(userId): List
incrementViewCount(postId): void
```

### 3. PostReactionService
```java
addOrUpdateReaction(postId, userId, reactionType): PostReaction
removeReaction(postId, userId): void
getUserReaction(postId, userId): Optional
getPostReactions(postId): List
countReactionsByType(postId, reactionType): Long
```

### 4. PostCommentService
```java
createComment(postId, userId, content): PostComment
createReply(postId, parentCommentId, userId, content): PostComment
updateComment(commentId, userId, content): PostComment
deleteComment(commentId, userId): void
getPostComments(postId): List
getReplies(parentCommentId): List
likeComment(commentId): PostComment
unlikeComment(commentId): PostComment
```

### 5. PostSaveService
```java
savePost(postId, userId, collectionName): PostSave
unsavePost(postId, userId): void
isSaved(postId, userId): Boolean
getUserSavedPosts(userId): List
getUserSavedPostsByCollection(userId, collectionName): List
countSaves(postId): Long
```

### 6. PostShareService
```java
sharePost(postId, userId, shareType, targetId, message): PostShare
getPostShares(postId): List
getUserShares(userId): List
getSharesByType(postId, shareType): List
countShares(postId): Long
```

### 7. PostReportService
```java
reportPost(postId, userId, reportType, reason): PostReport
getReportById(reportId): PostReport
approveReport(reportId, adminNotes): PostReport
rejectReport(reportId, adminNotes): PostReport
getPostReports(postId): List
getPendingReports(): List
getReportsByType(reportType): List
```

---

## 🔌 API Endpoints

### Base URL: `/api/v1/community`

### Kết Bạn
```
POST    /friends/request?targetUserId={id}          - Gửi lời mời
POST    /friends/accept/{requestId}                 - Chấp nhận
DELETE  /friends/{targetUserId}                     - Hủy kết bạn
GET     /friends/{userId}                           - Lấy danh sách bạn bè
GET     /friends/pending                            - Lời mời chưa xử lý
```

### Bài Viết
```
POST    /posts                                      - Tạo bài viết
GET     /feed?page=0&size=10                        - Lấy feed
GET     /posts/{postId}                             - Chi tiết bài viết
DELETE  /posts/{postId}                             - Xóa bài viết
```

### Like/Reaction
```
POST    /posts/{postId}/like?reactionType=LIKE      - Like bài viết
DELETE  /posts/{postId}/unlike                      - Unlike bài viết
GET     /posts/{postId}/reactions                   - Danh sách reactions
```

### Bình Luận
```
POST    /posts/{postId}/comments                    - Thêm bình luận
GET     /posts/{postId}/comments                    - Lấy bình luận
POST    /comments/{commentId}/reply?postId={id}    - Reply bình luận
GET     /comments/{commentId}/replies               - Lấy replies
DELETE  /comments/{commentId}                       - Xóa bình luận
```

### Lưu Bài Viết
```
POST    /posts/{postId}/save?collectionName=...     - Lưu bài viết
DELETE  /posts/{postId}/unsave                      - Hủy lưu
GET     /saved-posts?collectionName=...             - Lấy bài đã lưu
```

### Chia Sẻ
```
POST    /posts/{postId}/share?shareType=MESSAGE&targetId=...
GET     /posts/{postId}/shares                      - Danh sách chia sẻ
```

### Báo Cáo
```
POST    /posts/{postId}/report?reportType=INAPPROPRIATE
GET     /posts/{postId}/reports                     - Danh sách báo cáo (admin)
```

---

## 💻 Frontend Components

### 1. **CommunityFeed** (`CommunityFeed.jsx`)
Bảng tin chính với danh sách bài viết

**Props:**
- Không cần props, sử dụng Authentication từ context

**Features:**
- Hiển thị danh sách bài viết
- Tạo bài viết mới
- Load more pagination

**Sub-components:**
- `PostCard` - Thẻ hiển thị bài viết
- `CommentSection` - Phần bình luận
- `ShareMenu` - Menu chia sẻ
- `CreatePostModal` - Modal tạo bài
- `ReportModal` - Modal báo cáo

### 2. **FriendshipButton** (`FriendshipButton.jsx`)
Nút quản lý kết bạn

**Props:**
```jsx
<FriendshipButton 
  userId={id}
  onStatusChange={(status) => {}}
/>
```

**Sub-components:**
- `FriendsList` - Danh sách bạn bè
- `FriendCard` - Thẻ bạn bè
- `PendingFriendRequests` - Lời mời chờ

### 3. **CommunityPage** (`CommunityPage.jsx`)
Trang cộng đồng chính

**Features:**
- Sidebar navigation
- Tab view (Feed, Friends, Saved)
- Suggested users
- Right sidebar

### 4. **SavedPostsSection**
Hiển thị bài viết đã lưu với collection filter

---

## 🔗 Frontend Services

### socialService (social.service.js)

```javascript
// Posts
createPost(post)
getFeed(page, size)
getPost(postId)
deletePost(postId)
updatePost(postId, post)

// Reactions
likePost(postId, reactionType)
unlikePost(postId)
getReactions(postId)

// Comments
addComment(postId, comment)
getComments(postId)
deleteComment(commentId)
addReply(commentId, postId, reply)
getReplies(commentId)

// Saves
savePost(postId, collectionName)
unsavePost(postId)
getSavedPosts(collectionName)

// Shares
sharePost(postId, shareData)
getShares(postId)

// Reports
reportPost(postId, reportData)
getReports(postId)

// Friendships
sendFriendRequest(userId)
acceptFriendRequest(requestId)
rejectFriendRequest(requestId)
removeFriend(userId)
getFriends(userId)
getPendingRequests()
checkFriendshipStatus(userId)
blockUser(userId)
unblockUser(userId)
```

---

## 🎨 CSS Styling

### Key CSS Classes

```css
/* Post */
.post-card { ... }
.post-header { ... }
.post-content { ... }
.post-actions { ... }

/* Comments */
.comment-section { ... }
.comment-item { ... }
.reply-item { ... }

/* Friendship */
.friendship-btn { ... }
.friends-list { ... }
.friend-card { ... }

/* Community Page */
.community-page { ... }
.community-sidebar { ... }
.community-main { ... }
```

---

## 🚀 Cách Sử Dụng

### 1. Import Components

```jsx
import CommunityPage from './pages/CommunityPage';
import { FriendshipButton } from './components/FriendshipButton';
import CommunityFeed from './components/CommunityFeed';
```

### 2. Sử Dụng trong App

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Sử Dụng FriendshipButton trong Profile

```jsx
import { FriendshipButton } from './components/FriendshipButton';

function UserProfile({ userId }) {
  return (
    <div>
      <h1>Trang cá nhân</h1>
      <FriendshipButton 
        userId={userId}
        onStatusChange={(status) => console.log(status)}
      />
    </div>
  );
}
```

---

## 🔐 Authentication

Tất cả các requests cần token JWT trong header:

```javascript
headers: {
  'Authorization': 'Bearer {token}',
  'Content-Type': 'application/json'
}
```

Token được tự động thêm vào bởi interceptor trong `social.service.js`

---

## 📦 Dependencies

### Backend
- Spring Boot 3.5
- Spring Data JPA
- Lombok
- Jackson

### Frontend
- React 18.2
- Lucide Icons
- Axios

---

## 🧪 Testing

### Backend Testing
```bash
# Run tests
mvn test

# Specific test
mvn test -Dtest=CommunityControllerTest
```

### Frontend Testing
```bash
# Run tests
npm test

# Watch mode
npm test -- --watch
```

---

## 📝 Ghi Chú Quan Trọng

1. **Soft Delete**: Bài viết và bình luận sử dụng soft delete (set `isDeleted=true`)
2. **Nested Comments**: Bình luận hỗ trợ replies lồng nhau (1 level)
3. **Feed Personalization**: Feed hiển thị bài từ bạn bè, pages, groups, courses
4. **Reaction Unique**: Mỗi user chỉ có 1 reaction trên 1 bài viết
5. **Share Types**: 3 loại chia sẻ: MESSAGE (tin nhắn), PROFILE (cá nhân), GROUP (nhóm)
6. **Report Status**: PENDING → APPROVED/REJECTED (bởi admin)

---

## 🐛 Troubleshooting

### Backend không nhận được userId
- Kiểm tra authentication middleware
- Kiểm tra token có hợp lệ không
- Đảm bảo `Authentication` object chứa userId

### Frontend không hiển thị comments
- Kiểm tra API endpoint `/posts/{postId}/comments`
- Kiểm tra cors configuration
- Kiểm tra browser console cho errors

### Bài viết không hiển thị trên feed
- Kiểm tra user có kết bạn với người đăng không
- Kiểm tra bài viết không bị xóa (isDeleted=false)
- Kiểm tra feed query

---

## 📞 Support

Liên hệ: upnestedu@example.com

---

**Phiên bản:** 1.0.0  
**Cập nhật:** Tháng 12, 2024
