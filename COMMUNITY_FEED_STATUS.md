# 🎉 HỆ THỐNG CỘNG ĐỒNG (SOCIAL FEED) - HOÀN CHỈNH

## ✅ Tính năng đã có sẵn

### Backend
✅ **Post Management**
- Tạo, sửa, xóa bài đăng
- Hỗ trợ text, image, video
- Content moderation tự động
- Ẩn/hiện bài viết

✅ **Interactions**
- Like/React (LIKE, LOVE, HAHA, WOW, SAD, ANGRY)
- Comment nhiều cấp (nested comments)
- Reply comments
- Share bài viết

✅ **Content Moderation**
- Lọc từ khóa bạo lực, kích động
- Lọc nội dung 18+
- Phát hiện spam
- Kiểm tra URL

✅ **Privacy & Safety**
- Save bài viết
- Report bài viết
- Hide bài viết
- Privacy settings

✅ **Feed Algorithm**
- Personalized feed
- Trending posts
- Saved posts
- Search posts

### Database Schema

**Tables:**
```sql
1. posts                 - Bài đăng
2. post_comments        - Bình luận (hỗ trợ nested)
3. post_reactions       - Reactions
4. post_saves           - Lưu bài viết
5. post_shares          - Chia sẻ
6. post_reports         - Báo cáo
7. social_privacy_settings - Cài đặt riêng tư
```

## 🆕 Nâng cấp cần thiết

### 1. Thêm vào Post Entity
- `music_url` - URL nhạc nền
- `music_title` - Tên bài hát
- `location` - Vị trí (JSON)
- `tags` - Tags người dùng (JSON)
- `mentions` - Tag user (JSON)

### 2. Tính năng Upload
- Upload ảnh
- Upload video
- Upload nhạc

### 3. UI Components
- Post Creator (create post form)
- Post Card (display post)
- Comment Section (nested comments)
- Share Modal
- Report Modal

---

## 📡 API Endpoints

### Posts
```
GET    /api/v1/social/posts/feed           - Feed cá nhân
GET    /api/v1/social/posts/trending       - Bài trending
GET    /api/v1/social/posts/saved          - Bài đã lưu
GET    /api/v1/social/posts/search         - Tìm kiếm
POST   /api/v1/social/posts/create         - Tạo bài mới
DELETE /api/v1/social/posts/{id}           - Xóa bài
```

### Interactions
```
POST   /api/v1/social/posts/{id}/react     - Thêm reaction
DELETE /api/v1/social/posts/{id}/react     - Unlike
GET    /api/v1/social/posts/{id}/reactions - Lấy reactions
POST   /api/v1/social/posts/{id}/comments  - Comment
GET    /api/v1/social/posts/{id}/comments  - Lấy comments
POST   /api/v1/social/posts/{id}/comments/{commentId}/reply - Reply comment
GET    /api/v1/social/posts/{id}/comments/{commentId}/replies - Lấy replies
DELETE /api/v1/social/posts/{id}/comments/{commentId} - Xóa comment
```

### Actions
```
POST   /api/v1/social/posts/{id}/save      - Lưu bài
DELETE /api/v1/social/posts/{id}/save      - Bỏ lưu
GET    /api/v1/social/posts/{id}/is-saved  - Kiểm tra đã lưu
POST   /api/v1/social/posts/{id}/share     - Chia sẻ
POST   /api/v1/social/posts/{id}/report    - Báo cáo
POST   /api/v1/social/posts/{id}/hide      - Ẩn bài
GET    /api/v1/social/posts/{id}/stats     - Thống kê
```

---

## 🛡️ Content Moderation

### Từ khóa bị cấm

**Bạo lực/Kích động:**
- giết, chết, máu, bạo lực, đánh nhau
- chiến tranh, súng, dao, bom, nổ
- tấn công, hành hung, tra tấn
- kích động, thù hận, phân biệt đối xử

**18+:**
- sex, tình dục, khiêu dâm
- nude, khỏa thân, xxx, porn
- adult, explicit

**Spam:**
- click here, free money, get rich
- miễn phí ngay, quảng cáo
- lừa đảo, scam

### Auto-moderation Flow
```
1. User tạo bài → 
2. Check text content → 
3. Check image URL → 
4. Check video URL → 
5. If violation → Reject với message chi tiết
6. If safe → Save to database
```

---

## 🎨 UI Components Cần Tạo

### 1. CommunityFeed.jsx
- Main feed component
- Infinite scroll
- Post list
- Filter tabs (All, Following, Trending)

### 2. PostCreator.jsx
- Create post form
- Upload image/video
- Add music
- Add location
- Tag users
- Privacy settings

### 3. PostCard.jsx
- Display post
- Show author info
- Show content (text/image/video)
- Show music player
- Show location
- Show tags
- Reactions bar
- Comment section
- Share/Save/Report buttons

### 4. CommentSection.jsx
- Display comments
- Nested comments (replies)
- Load more
- Add comment input
- Like comment

### 5. ShareModal.jsx
- Share to timeline
- Share to messenger
- Copy link
- Share options

### 6. ReportModal.jsx
- Report reasons
- Description
- Submit

---

## 🚀 Cách Chạy

### Backend đã sẵn sàng
```bash
cd edu
.\mvnw.cmd spring-boot:run
```

### Frontend
```bash
cd upnest-web
npm run dev
```

### Test APIs
```bash
# Tạo bài mới
POST http://localhost:8080/api/v1/social/posts/create
Headers: Authorization: Bearer {token}
Body: {
  "content": "Hello world!",
  "postType": "TEXT"
}

# Lấy feed
GET http://localhost:8080/api/v1/social/posts/feed
Headers: Authorization: Bearer {token}
```

---

## 📝 Roadmap

### Phase 1: Nâng cấp Post Entity ✅
- [x] Basic post (text, image, video)
- [ ] Add music support
- [ ] Add location
- [ ] Add tags/mentions

### Phase 2: UI Components
- [x] Feed display (basic)
- [ ] PostCreator với full features
- [ ] PostCard với reactions/comments
- [ ] Share/Report modals

### Phase 3: Advanced Features
- [ ] Upload service
- [ ] AI image moderation
- [ ] Real-time updates (WebSocket)
- [ ] Notifications

---

## 🎯 Kết luận

Hệ thống Social Feed đã có đầy đủ:
- ✅ Backend APIs hoàn chỉnh
- ✅ Content moderation tự động
- ✅ Nested comments
- ✅ Save/Share/Report
- ✅ Privacy & Safety
- ⏳ UI Components (cần hoàn thiện)

Xem chi tiết trong các file:
- `edu/src/main/java/com/upnest/edu/modules/social/`
- `upnest-web/src/pages/student/Feed.jsx` (đã có sẵn)

