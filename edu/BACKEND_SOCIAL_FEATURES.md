# Backend Social Features - Tổng hợp các API endpoints

## ✅ Đã implement đầy đủ các tính năng

### 1. **Tạo bài đăng với Content Moderation** ✅
- **Endpoint:** `POST /api/v1/social/posts/create`
- **Service:** `FeedService.createPost()` 
- **Moderation:** `ContentModerationService.checkPostContent()` 
- **Từ khóa vi phạm:** "18+", "máu me", "kích động", "bạo lực", "sex", "tình dục", etc.
- **Xử lý:** Nếu vi phạm → throw RuntimeException → Frontend nhận được message và hiển thị toast

### 2. **Like/Unlike bài viết** ✅
- **Endpoint Like:** `POST /api/v1/social/posts/{postId}/react`
- **Endpoint Unlike:** `DELETE /api/v1/social/posts/{postId}/react`
- **Service:** `FeedService.addReaction()`, `FeedService.unlikePost()`
- **Xử lý:** Tăng/giảm likeCount, lưu vào `post_reactions` table

### 3. **Bình luận** ✅
- **Endpoint Comment:** `POST /api/v1/social/posts/{postId}/comments`
- **Endpoint Get Comments:** `GET /api/v1/social/posts/{postId}/comments`
- **Endpoint Delete Comment:** `DELETE /api/v1/social/posts/{postId}/comments/{commentId}`
- **Service:** `FeedService.addComment()`, `FeedService.deleteComment()`
- **Quyền xóa:** Chỉ author của comment hoặc author của post mới được xóa
- **Xử lý:** Tăng commentCount, lưu vào `post_comments` table

### 4. **Chia sẻ bài viết** ✅
- **Endpoint:** `POST /api/v1/social/posts/{postId}/share`
- **Service:** `FeedService.sharePost()`
- **Xử lý:** Tăng shareCount, lưu vào `post_shares` table

### 5. **Ẩn bài viết** ✅
- **Endpoint:** `POST /api/v1/social/posts/{postId}/hide`
- **Service:** `FeedService.hidePost()`
- **Xử lý:** Lưu userId vào `hiddenByUsers` JSON field trong `posts` table

### 6. **Xóa bài viết** ✅
- **Endpoint:** `DELETE /api/v1/social/posts/{postId}`
- **Service:** `FeedService.deletePost()`
- **Quyền:** Chỉ author mới được xóa
- **Xử lý:** Soft delete (set `isDeleted = true`)

### 7. **Báo cáo vi phạm** ✅
- **Endpoint:** `POST /api/v1/social/posts/{postId}/report`
- **Service:** `FeedService.reportPost()`
- **Xử lý:** Lưu vào `post_reports` table với status PENDING

## 📋 Các Entities và Repositories

### Entities đã có:
- ✅ `Post` - Bài đăng
- ✅ `PostComment` - Bình luận
- ✅ `PostReaction` - Like/Reaction
- ✅ `PostReport` - Báo cáo
- ✅ `PostShare` - Chia sẻ
- ✅ `PostSave` - Lưu bài viết

### Repositories đã có:
- ✅ `PostRepository`
- ✅ `PostCommentRepository`
- ✅ `PostReactionRepository`
- ✅ `PostReportRepository`
- ✅ `PostShareRepository`
- ✅ `PostSaveRepository`

## 🔍 Content Moderation Service

**File:** `ContentModerationService.java`

**Các từ khóa vi phạm:**
- **18+:** "sex", "tình dục", "khiêu dâm", "nude", "khỏa thân", "18+", "xxx", "porn", "adult", "mature", "explicit"
- **Bạo lực:** "giết", "chết", "máu", "bạo lực", "đánh nhau", "chiến tranh", "súng", "dao", "bom", "nổ", "kích động"
- **Spam:** "click here", "free money", "get rich", "miễn phí ngay", "quảng cáo", "spam", "scam", "lừa đảo"

**Cách hoạt động:**
1. Frontend gửi request tạo post
2. Backend gọi `ContentModerationService.checkPostContent()`
3. Nếu vi phạm → throw RuntimeException với message
4. Controller catch exception và trả về BAD_REQUEST với message
5. Frontend nhận được và hiển thị moderation toast

## 🧪 Test các tính năng

### Test Content Moderation:
```bash
POST http://localhost:8080/api/v1/social/posts/create
Body: {
  "content": "Đây là nội dung có 18+ vi phạm",
  "postType": "text"
}
→ Kết quả: 400 Bad Request với message vi phạm
```

### Test Tạo bài bình thường:
```bash
POST http://localhost:8080/api/v1/social/posts/create
Body: {
  "content": "Chia sẻ kiến thức học tập",
  "postType": "text",
  "imageUrl": "https://example.com/image.jpg"
}
→ Kết quả: 201 Created với post data
```

### Test Like:
```bash
POST http://localhost:8080/api/v1/social/posts/1/react
Body: {
  "reactionType": "LIKE"
}
→ Kết quả: 200 OK với action: "added" hoặc "removed"
```

### Test Comment:
```bash
POST http://localhost:8080/api/v1/social/posts/1/comments
Body: {
  "content": "Bình luận của tôi"
}
→ Kết quả: 201 Created với comment data
```

### Test Share:
```bash
POST http://localhost:8080/api/v1/social/posts/1/share
Body: {
  "shareType": "FEED",
  "shareMessage": ""
}
→ Kết quả: 201 Created với share data
```

### Test Hide:
```bash
POST http://localhost:8080/api/v1/social/posts/1/hide
→ Kết quả: 200 OK với message "Post hidden successfully"
```

### Test Delete Post:
```bash
DELETE http://localhost:8080/api/v1/social/posts/1
→ Kết quả: 200 OK với message "Post deleted successfully"
```

### Test Report:
```bash
POST http://localhost:8080/api/v1/social/posts/1/report
Body: {
  "reportType": "INAPPROPRIATE",
  "reason": "Nội dung vi phạm"
}
→ Kết quả: 201 Created với report data
```

## ⚠️ Lưu ý

1. **Authentication:** Tất cả endpoints yêu cầu JWT token trong header:
   ```
   Authorization: Bearer <token>
   ```

2. **User Info:** Hiện tại `getCurrentUserName()` và `getCurrentUserAvatar()` đang dùng placeholder. 
   Cần cập nhật để lấy từ UserService hoặc JWT claims.

3. **Database:** Đảm bảo database đã có các tables được tạo bởi JPA/Hibernate.

## ✅ Kết luận

**TẤT CẢ CÁC TÍNH NĂNG ĐÃ ĐƯỢC IMPLEMENT ĐẦY ĐỦ TRONG BACKEND!**

Nếu gặp vấn đề khi test, có thể do:
1. Backend chưa được start
2. Database chưa được tạo tables
3. Authentication token không hợp lệ
4. Frontend chưa kết nối đúng với backend endpoints

