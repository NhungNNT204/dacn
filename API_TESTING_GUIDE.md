# 🧪 API Testing Guide - Hệ Thống Cộng Đồng

## 📌 Giới Thiệu

Hướng dẫn này cung cấp các test case cho tất cả các API endpoints của hệ thống cộng đồng UpNest.

---

## 🔐 Chuẩn Bị

### 1. Postman Setup
```
1. Tải Postman: https://www.postman.com/downloads/
2. Import collection từ file `postman-collection.json`
3. Set up environment variables:
   - BASE_URL: http://localhost:8080/api/v1/community
   - TOKEN: your-jwt-token-here
   - USER_ID: your-user-id
```

### 2. cURL Setup (hoặc sử dụng trực tiếp)
```bash
# Export token
export TOKEN="your-jwt-token"
export BASE_URL="http://localhost:8080/api/v1/community"
export USER_ID="1"
```

### 3. Environment Check
```bash
# Backend running
curl http://localhost:8080/api/v1/community/health

# Frontend running
curl http://localhost:3000

# Database connected
# Check SQL Server connection from backend logs
```

---

## 👥 1. Friendship Endpoints

### 1.1 Send Friend Request
**Endpoint:** `POST /friends/request?targetUserId={id}`  
**Description:** Gửi lời mời kết bạn

**cURL:**
```bash
curl -X POST "http://localhost:8080/api/v1/community/friends/request?targetUserId=2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Friend request sent",
  "data": {
    "id": 1,
    "followerId": 1,
    "followingId": 2,
    "status": "PENDING",
    "isMutual": false
  }
}
```

**Test Cases:**
- [ ] Valid request - Returns 200 with friendship data
- [ ] Duplicate request - Returns error (already pending/friends)
- [ ] Invalid userId - Returns 404
- [ ] No authentication - Returns 401

---

### 1.2 Accept Friend Request
**Endpoint:** `POST /friends/accept/{requestId}`  
**Description:** Chấp nhận lời mời kết bạn

**cURL:**
```bash
curl -X POST "http://localhost:8080/api/v1/community/friends/accept/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Friend request accepted",
  "data": {
    "id": 1,
    "followerId": 1,
    "followingId": 2,
    "status": "ACCEPTED",
    "isMutual": true
  }
}
```

**Test Cases:**
- [ ] Valid request - Returns 200, status becomes ACCEPTED
- [ ] Not found request - Returns 404
- [ ] Already accepted - Returns error
- [ ] Unauthorized user - Returns 403

---

### 1.3 Remove Friend
**Endpoint:** `DELETE /friends/{targetUserId}`  
**Description:** Hủy kết bạn

**cURL:**
```bash
curl -X DELETE "http://localhost:8080/api/v1/community/friends/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Friendship removed"
}
```

**Test Cases:**
- [ ] Valid request - Returns 200, friendship deleted
- [ ] Non-existent friendship - Returns 404
- [ ] Invalid userId - Returns 400
- [ ] No authentication - Returns 401

---

### 1.4 Get Friends List
**Endpoint:** `GET /friends/{userId}`  
**Description:** Lấy danh sách bạn bè

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/friends/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Friends retrieved",
  "data": [
    {
      "id": 2,
      "name": "User 2",
      "avatar": "url",
      "status": "online"
    },
    {
      "id": 3,
      "name": "User 3",
      "avatar": "url",
      "status": "offline"
    }
  ]
}
```

**Test Cases:**
- [ ] Valid userId - Returns 200 with list
- [ ] User with no friends - Returns empty list
- [ ] Invalid userId - Returns 404
- [ ] No authentication - Returns 401

---

### 1.5 Get Pending Requests
**Endpoint:** `GET /friends/pending`  
**Description:** Lấy lời mời kết bạn chờ duyệt

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/friends/pending" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Pending requests retrieved",
  "data": [
    {
      "id": 1,
      "followerId": 2,
      "followingId": 1,
      "status": "PENDING",
      "createdAt": "2024-12-01T10:00:00"
    }
  ]
}
```

**Test Cases:**
- [ ] Valid authentication - Returns 200 with pending requests
- [ ] No pending requests - Returns empty list
- [ ] No authentication - Returns 401

---

## 📝 2. Post Endpoints

### 2.1 Create Post
**Endpoint:** `POST /posts`  
**Description:** Tạo bài viết mới

**cURL:**
```bash
curl -X POST "http://localhost:8080/api/v1/community/posts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello community!",
    "postType": "TEXT"
  }'
```

**With Image:**
```bash
curl -X POST "http://localhost:8080/api/v1/community/posts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Check this image!",
    "postType": "IMAGE",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Post created",
  "data": {
    "id": 1,
    "content": "Hello community!",
    "authorId": 1,
    "postType": "TEXT",
    "likeCount": 0,
    "commentCount": 0,
    "shareCount": 0,
    "viewCount": 0,
    "createdAt": "2024-12-01T10:00:00"
  }
}
```

**Test Cases:**
- [ ] Text post - Returns 200 with post data
- [ ] Post with image - Returns 200, image stored
- [ ] Post with video - Returns 200, video stored
- [ ] Empty content - Returns 400
- [ ] No authentication - Returns 401

---

### 2.2 Get Feed
**Endpoint:** `GET /feed?page=0&size=10`  
**Description:** Lấy bảng tin

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/feed?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Feed retrieved",
  "data": {
    "content": [
      {
        "id": 1,
        "content": "Post content",
        "authorId": 2,
        "likeCount": 5,
        "commentCount": 2,
        "shareCount": 1,
        "createdAt": "2024-12-01T10:00:00"
      }
    ],
    "page": 0,
    "size": 10,
    "totalElements": 25,
    "totalPages": 3
  }
}
```

**Test Cases:**
- [ ] First page - Returns 200 with posts
- [ ] Valid pagination - Returns correct posts per page
- [ ] Last page - Returns 200, may have fewer items
- [ ] No posts - Returns empty content array
- [ ] No authentication - Returns 401

---

### 2.3 Get Post Details
**Endpoint:** `GET /posts/{postId}`  
**Description:** Lấy chi tiết bài viết

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/posts/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Post retrieved",
  "data": {
    "id": 1,
    "content": "Post content",
    "authorId": 2,
    "postType": "TEXT",
    "likeCount": 5,
    "commentCount": 2,
    "shareCount": 1,
    "viewCount": 101,
    "createdAt": "2024-12-01T10:00:00"
  }
}
```

**Test Cases:**
- [ ] Valid postId - Returns 200 with post data
- [ ] View count incremented - viewCount increases
- [ ] Deleted post - Returns 404
- [ ] Invalid postId - Returns 404

---

### 2.4 Delete Post
**Endpoint:** `DELETE /posts/{postId}`  
**Description:** Xóa bài viết

**cURL:**
```bash
curl -X DELETE "http://localhost:8080/api/v1/community/posts/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Post deleted"
}
```

**Test Cases:**
- [ ] Owner deletes own post - Returns 200, post soft deleted
- [ ] Non-owner deletes - Returns 403
- [ ] Already deleted - Returns 404
- [ ] Invalid postId - Returns 404

---

## ❤️ 3. Reaction Endpoints

### 3.1 Like Post
**Endpoint:** `POST /posts/{postId}/like?reactionType=LIKE`  
**Description:** Like bài viết

**cURL:**
```bash
curl -X POST "http://localhost:8080/api/v1/community/posts/1/like?reactionType=LIKE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**With Different Reaction:**
```bash
# Love
curl -X POST "http://localhost:8080/api/v1/community/posts/1/like?reactionType=LOVE" \
  -H "Authorization: Bearer $TOKEN"

# Haha
curl -X POST "http://localhost:8080/api/v1/community/posts/1/like?reactionType=HAHA" \
  -H "Authorization: Bearer $TOKEN"

# Wow
curl -X POST "http://localhost:8080/api/v1/community/posts/1/like?reactionType=WOW" \
  -H "Authorization: Bearer $TOKEN"

# Sad
curl -X POST "http://localhost:8080/api/v1/community/posts/1/like?reactionType=SAD" \
  -H "Authorization: Bearer $TOKEN"

# Angry
curl -X POST "http://localhost:8080/api/v1/community/posts/1/like?reactionType=ANGRY" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Reaction added",
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "reactionType": "LIKE"
  }
}
```

**Test Cases:**
- [ ] First like - Returns 200, creates reaction
- [ ] Change reaction type - Returns 200, updates reaction type
- [ ] Like count updated - Post.likeCount increments
- [ ] Invalid reactionType - Returns 400
- [ ] Post not found - Returns 404

---

### 3.2 Unlike Post
**Endpoint:** `DELETE /posts/{postId}/unlike`  
**Description:** Bỏ like bài viết

**cURL:**
```bash
curl -X DELETE "http://localhost:8080/api/v1/community/posts/1/unlike" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Reaction removed"
}
```

**Test Cases:**
- [ ] Valid like exists - Returns 200, reaction deleted
- [ ] Like count decremented - Post.likeCount decreases
- [ ] No existing like - Returns 404
- [ ] Post not found - Returns 404

---

### 3.3 Get Reactions
**Endpoint:** `GET /posts/{postId}/reactions`  
**Description:** Lấy danh sách reactions

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/posts/1/reactions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Reactions retrieved",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "userName": "User 1",
      "reactionType": "LIKE"
    },
    {
      "id": 2,
      "userId": 2,
      "userName": "User 2",
      "reactionType": "LOVE"
    }
  ]
}
```

**Test Cases:**
- [ ] Post with reactions - Returns all reactions
- [ ] Post with no reactions - Returns empty list
- [ ] Group by type - Check distribution
- [ ] Post not found - Returns 404

---

## 💬 4. Comment Endpoints

### 4.1 Add Comment
**Endpoint:** `POST /posts/{postId}/comments`  
**Description:** Thêm bình luận

**cURL:**
```bash
curl -X POST "http://localhost:8080/api/v1/community/posts/1/comments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Comment created",
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "content": "Great post!",
    "parentCommentId": null,
    "createdAt": "2024-12-01T10:00:00"
  }
}
```

**Test Cases:**
- [ ] Valid comment - Returns 200
- [ ] Comment count incremented - Post.commentCount increases
- [ ] Empty content - Returns 400
- [ ] Post not found - Returns 404

---

### 4.2 Reply Comment
**Endpoint:** `POST /comments/{commentId}/reply?postId={postId}`  
**Description:** Trả lời bình luận

**cURL:**
```bash
curl -X POST "http://localhost:8080/api/v1/community/comments/1/reply?postId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Thanks!"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Reply created",
  "data": {
    "id": 2,
    "postId": 1,
    "userId": 1,
    "content": "Thanks!",
    "parentCommentId": 1,
    "createdAt": "2024-12-01T10:00:00"
  }
}
```

**Test Cases:**
- [ ] Valid reply - Returns 200, parentCommentId set
- [ ] Nested structure - Parent remains null, child references parent
- [ ] Empty content - Returns 400
- [ ] Invalid parentCommentId - Returns 404

---

### 4.3 Get Comments
**Endpoint:** `GET /posts/{postId}/comments`  
**Description:** Lấy bình luận của bài viết

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/posts/1/comments" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Comments retrieved",
  "data": [
    {
      "id": 1,
      "content": "Great post!",
      "userId": 1,
      "parentCommentId": null,
      "replies": [
        {
          "id": 2,
          "content": "Thanks!",
          "parentCommentId": 1
        }
      ]
    }
  ]
}
```

**Test Cases:**
- [ ] Post with comments - Returns all main comments
- [ ] Main vs replies - Only top-level comments returned
- [ ] Nested replies - Structure preserved
- [ ] Post not found - Returns 404

---

### 4.4 Get Replies
**Endpoint:** `GET /comments/{commentId}/replies`  
**Description:** Lấy replies của bình luận

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/comments/1/replies" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Replies retrieved",
  "data": [
    {
      "id": 2,
      "content": "Thanks!",
      "userId": 2,
      "parentCommentId": 1
    }
  ]
}
```

**Test Cases:**
- [ ] Comment with replies - Returns all replies
- [ ] No replies - Returns empty list
- [ ] Invalid commentId - Returns 404

---

### 4.5 Delete Comment
**Endpoint:** `DELETE /comments/{commentId}`  
**Description:** Xóa bình luận

**cURL:**
```bash
curl -X DELETE "http://localhost:8080/api/v1/community/comments/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Comment deleted"
}
```

**Test Cases:**
- [ ] Owner deletes - Returns 200, soft deleted
- [ ] Non-owner deletes - Returns 403
- [ ] With replies - Soft delete, replies cascade?
- [ ] Invalid commentId - Returns 404

---

## 💾 5. Save Endpoints

### 5.1 Save Post
**Endpoint:** `POST /posts/{postId}/save?collectionName=ReadLater`  
**Description:** Lưu bài viết

**cURL:**
```bash
curl -X POST "http://localhost:8080/api/v1/community/posts/1/save?collectionName=ReadLater" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Post saved",
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "collectionName": "ReadLater"
  }
}
```

**Test Cases:**
- [ ] Save to collection - Returns 200
- [ ] Save without collection - Returns 200, default collection
- [ ] Duplicate save - Returns error or updates
- [ ] Post not found - Returns 404

---

### 5.2 Unsave Post
**Endpoint:** `DELETE /posts/{postId}/unsave`  
**Description:** Bỏ lưu bài viết

**cURL:**
```bash
curl -X DELETE "http://localhost:8080/api/v1/community/posts/1/unsave" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Post unsaved"
}
```

**Test Cases:**
- [ ] Valid save exists - Returns 200
- [ ] Not saved before - Returns 404
- [ ] Post not found - Returns 404

---

### 5.3 Get Saved Posts
**Endpoint:** `GET /saved-posts?collectionName=ReadLater`  
**Description:** Lấy bài đã lưu

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/saved-posts?collectionName=ReadLater" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Saved posts retrieved",
  "data": [
    {
      "id": 1,
      "content": "Post content",
      "collectionName": "ReadLater",
      "savedAt": "2024-12-01T10:00:00"
    }
  ]
}
```

**Test Cases:**
- [ ] With collection filter - Returns specific collection
- [ ] Without filter - Returns all saved posts
- [ ] No saves - Returns empty list
- [ ] Invalid collection - Returns empty list

---

## 🔗 6. Share Endpoints

### 6.1 Share Post
**Endpoint:** `POST /posts/{postId}/share?shareType=MESSAGE&targetId={id}`  
**Description:** Chia sẻ bài viết

**cURL (Message):**
```bash
curl -X POST "http://localhost:8080/api/v1/community/posts/1/share?shareType=MESSAGE&targetId=2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shareMessage": "Check this out!"
  }'
```

**cURL (Profile):**
```bash
curl -X POST "http://localhost:8080/api/v1/community/posts/1/share?shareType=PROFILE&targetId=2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**cURL (Group):**
```bash
curl -X POST "http://localhost:8080/api/v1/community/posts/1/share?shareType=GROUP&targetId=5" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Post shared",
  "data": {
    "id": 1,
    "postId": 1,
    "userId": 1,
    "shareType": "MESSAGE",
    "targetId": 2,
    "shareMessage": "Check this out!"
  }
}
```

**Test Cases:**
- [ ] Share to MESSAGE - Returns 200
- [ ] Share to PROFILE - Returns 200
- [ ] Share to GROUP - Returns 200
- [ ] With message - Message included
- [ ] Invalid shareType - Returns 400
- [ ] Share count incremented - Post.shareCount increases

---

### 6.2 Get Shares
**Endpoint:** `GET /posts/{postId}/shares`  
**Description:** Lấy danh sách shares

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/posts/1/shares" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Shares retrieved",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "shareType": "MESSAGE",
      "targetId": 2,
      "sharedAt": "2024-12-01T10:00:00"
    }
  ]
}
```

**Test Cases:**
- [ ] Post with shares - Returns all shares
- [ ] No shares - Returns empty list
- [ ] Count matches - Number of shares equals shareCount
- [ ] Post not found - Returns 404

---

## 🚨 7. Report Endpoints

### 7.1 Report Post
**Endpoint:** `POST /posts/{postId}/report?reportType=INAPPROPRIATE`  
**Description:** Báo cáo bài viết

**cURL:**
```bash
curl -X POST "http://localhost:8080/api/v1/community/posts/1/report?reportType=INAPPROPRIATE" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "This post contains inappropriate content"
  }'
```

**cURL (Other types):**
```bash
# SPAM
curl -X POST "http://localhost:8080/api/v1/community/posts/1/report?reportType=SPAM" \
  -H "Authorization: Bearer $TOKEN"

# HARASSMENT
curl -X POST "http://localhost:8080/api/v1/community/posts/1/report?reportType=HARASSMENT" \
  -H "Authorization: Bearer $TOKEN"

# VIOLENCE
curl -X POST "http://localhost:8080/api/v1/community/posts/1/report?reportType=VIOLENCE" \
  -H "Authorization: Bearer $TOKEN"

# MISINFORMATION
curl -X POST "http://localhost:8080/api/v1/community/posts/1/report?reportType=MISINFORMATION" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Post reported",
  "data": {
    "id": 1,
    "postId": 1,
    "reporterId": 1,
    "reportType": "INAPPROPRIATE",
    "reason": "This post contains inappropriate content",
    "status": "PENDING",
    "createdAt": "2024-12-01T10:00:00"
  }
}
```

**Test Cases:**
- [ ] INAPPROPRIATE - Returns 200
- [ ] SPAM - Returns 200
- [ ] HARASSMENT - Returns 200
- [ ] VIOLENCE - Returns 200
- [ ] MISINFORMATION - Returns 200
- [ ] Invalid reportType - Returns 400
- [ ] Duplicate report - Returns error or updates
- [ ] Post not found - Returns 404

---

### 7.2 Get Reports (Admin)
**Endpoint:** `GET /posts/{postId}/reports`  
**Description:** Lấy báo cáo của bài viết

**cURL:**
```bash
curl -X GET "http://localhost:8080/api/v1/community/posts/1/reports" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Reports retrieved",
  "data": [
    {
      "id": 1,
      "postId": 1,
      "reporterId": 1,
      "reportType": "INAPPROPRIATE",
      "reason": "...",
      "status": "PENDING",
      "createdAt": "2024-12-01T10:00:00"
    }
  ]
}
```

**Test Cases:**
- [ ] Admin access - Returns 200
- [ ] Non-admin access - Returns 403
- [ ] Post with reports - Returns all reports
- [ ] No reports - Returns empty list
- [ ] Post not found - Returns 404

---

## 🧪 Test Scenarios

### Scenario 1: Complete Friendship Flow
```
1. User A sends friend request to User B
   POST /friends/request?targetUserId=B

2. User B accepts request
   POST /friends/accept/{requestId}

3. Both verify friendship
   GET /friends/{userId}
   Verify both see each other

4. User A unfriends User B
   DELETE /friends/B

5. Verify friendship removed
   GET /friends/A
   Verify B not in list
```

### Scenario 2: Complete Post & Comment Flow
```
1. User A creates post
   POST /posts

2. User B likes post
   POST /posts/{id}/like

3. User B adds comment
   POST /posts/{id}/comments

4. User A replies to comment
   POST /comments/{id}/reply

5. Verify structure
   GET /posts/{id}/comments
   GET /comments/{id}/replies

6. User A deletes post
   DELETE /posts/{id}
```

### Scenario 3: Save & Share Flow
```
1. User A creates post
   POST /posts

2. User B saves post
   POST /posts/{id}/save?collectionName=ReadLater

3. User C shares post
   POST /posts/{id}/share?shareType=MESSAGE

4. Verify counts updated
   GET /posts/{id}
   Check saveCount, shareCount

5. User B views saved posts
   GET /saved-posts?collectionName=ReadLater
```

### Scenario 4: Complete Report Flow
```
1. User A creates inappropriate post
   POST /posts

2. User B reports post
   POST /posts/{id}/report?reportType=INAPPROPRIATE

3. Admin reviews report
   GET /posts/{id}/reports

4. Admin takes action
   (Implementation depends on approval endpoint)
```

---

## 📊 Test Results Template

### Test Case Template
```
Test Name: [Name]
Endpoint: [Method] [Path]
Expected: [Expected Response]
Actual: [Actual Response]
Status: [ ] PASS [ ] FAIL
Notes: [Any issues]
```

### Sample Results
```
Test Name: Send Friend Request
Endpoint: POST /friends/request?targetUserId=2
Expected: 200 OK with friendship data
Actual: 200 OK with friendship data
Status: [X] PASS [ ] FAIL
Notes: Working correctly

Test Name: Like Post with Invalid Type
Endpoint: POST /posts/1/like?reactionType=INVALID
Expected: 400 Bad Request
Actual: 400 Bad Request
Status: [X] PASS [ ] FAIL
Notes: Proper validation
```

---

## 🔍 Common Issues & Solutions

### Issue: 401 Unauthorized
```bash
# Check token
echo $TOKEN

# Generate new token
# Login through frontend or use auth endpoint

# Test with Postman Authorization tab
# Set type to Bearer Token
# Paste token value
```

### Issue: CORS Error
```bash
# Check backend CORS config
# Verify preflight request is allowed

# Test with curl (no CORS issue)
curl -X OPTIONS "http://localhost:8080/api/v1/community/posts" \
  -H "Origin: http://localhost:3000"
```

### Issue: 404 Not Found
```bash
# Verify endpoint path is correct
# Check HTTP method (POST vs GET)
# Verify resource exists in database

# Test base URL
curl http://localhost:8080/health
```

### Issue: 500 Internal Server Error
```bash
# Check backend logs
# Verify database connection
# Check for null pointer exceptions
# Verify all required fields are provided
```

---

## ✅ Testing Checklist

### Before Testing
- [ ] Backend is running (port 8080)
- [ ] Frontend is running (port 3000)
- [ ] Database is running
- [ ] Authentication token available
- [ ] Postman installed or curl available

### Test Execution
- [ ] All friendship endpoints tested
- [ ] All post endpoints tested
- [ ] All reaction endpoints tested
- [ ] All comment endpoints tested
- [ ] All save endpoints tested
- [ ] All share endpoints tested
- [ ] All report endpoints tested
- [ ] Error cases tested
- [ ] Authorization tested
- [ ] Pagination tested

### Post-Testing
- [ ] Document results
- [ ] Report issues
- [ ] Verify fixes
- [ ] Performance acceptable
- [ ] Ready for production

---

**API Testing Guide v1.0**  
**Created:** December 2024  
**For:** UpNest Community System

---

*Hướng dẫn này cung cấp các test case chi tiết để xác minh tất cả các API endpoints.* ✅
