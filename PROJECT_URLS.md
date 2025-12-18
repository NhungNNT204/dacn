# 📋 Tất cả URL của Project UpNest Edu

## 🌐 Frontend Routes (React Router)

### Public Routes
- `GET /` → Redirect to `/login`
- `GET /login` → Trang đăng nhập
- `GET /register` → Trang đăng ký

### Protected Routes (Cần Authentication)
- `GET /dashboard` → Dashboard học sinh (StudentLayout)
- `GET /news-feed` → News Feed / Dòng thời gian (StudentLayout)
- `GET /blog` → Blog Section (StudentLayout)
- `GET /classroom` → Classroom View (StudentLayout)
- `GET /friends` → Connections Page - Kết bạn/Theo dõi (StudentLayout)
- `GET /profile` → Profile cá nhân
- `GET /privacy` → Privacy Settings

---

## 🔌 Backend API Endpoints

### Base URL: `http://localhost:8080` (hoặc domain production)

---

## 🔐 Authentication (`/api/v1/auth`)

- `POST /api/v1/auth/login` → Đăng nhập (có thể yêu cầu 2FA)
- `POST /api/v1/auth/verify` → Xác thực mã 2FA

---

## 👤 User Management (`/api/v1/users`)

- `GET /api/v1/users/profile` → Lấy hồ sơ cá nhân
- `GET /api/v1/users/{userId}/profile` → Lấy hồ sơ user khác
- `PUT /api/v1/users/profile` → Cập nhật hồ sơ
- `POST /api/v1/users/profile/avatar` → Cập nhật ảnh đại diện
- `GET /api/v1/users/privacy-settings` → Lấy cài đặt quyền riêng tư
- `PUT /api/v1/users/privacy-settings` → Cập nhật cài đặt quyền riêng tư
- `POST /api/v1/users/privacy-settings/reset` → Reset cài đặt về mặc định

---

## 📱 Social - Posts & Feed (`/api/v1/social/posts`)

### Feed
- `GET /api/v1/social/posts/feed?page=0&size=10` → Dòng thời gian cá nhân hoá
- `GET /api/v1/social/posts/trending?page=0&size=10` → Bài đăng trending
- `GET /api/v1/social/posts/saved?page=0&size=10` → Bài đăng đã lưu
- `GET /api/v1/social/posts/search?keyword=...&page=0&size=10` → Tìm kiếm bài đăng

### Post CRUD
- `POST /api/v1/social/posts/create` → Tạo bài đăng mới
- `DELETE /api/v1/social/posts/{postId}` → Xóa bài đăng
- `GET /api/v1/social/posts/{postId}/stats` → Lấy thống kê bài đăng

### Reactions
- `POST /api/v1/social/posts/{postId}/react` → Thêm reaction (LIKE, LOVE, HAHA, WOW, SAD, ANGRY)
- `GET /api/v1/social/posts/{postId}/reactions` → Lấy danh sách reactions

### Comments
- `POST /api/v1/social/posts/{postId}/comments` → Bình luận
- `GET /api/v1/social/posts/{postId}/comments?page=0&size=5` → Lấy bình luận
- `POST /api/v1/social/posts/{postId}/comments/{commentId}/reply` → Reply bình luận
- `GET /api/v1/social/posts/{postId}/comments/{commentId}/replies` → Lấy replies
- `DELETE /api/v1/social/posts/{postId}/comments/{commentId}` → Xóa bình luận

### Share & Save
- `POST /api/v1/social/posts/{postId}/share` → Chia sẻ bài đăng
- `POST /api/v1/social/posts/{postId}/save` → Lưu bài đăng
- `DELETE /api/v1/social/posts/{postId}/save` → Bỏ lưu bài đăng
- `GET /api/v1/social/posts/{postId}/is-saved` → Kiểm tra đã lưu chưa

### Report & Hide
- `POST /api/v1/social/posts/{postId}/report` → Báo cáo bài đăng
- `POST /api/v1/social/posts/{postId}/hide` → Ẩn bài đăng

---

## 👥 Social - Connections (`/api/v1/social/connections`)

- `GET /api/v1/social/connections/search?q=...&course=...` → Tìm kiếm người dùng (theo tên/email/phone, filter theo khóa học)
- `POST /api/v1/social/connections/follow/{targetId}` → Theo dõi người dùng
- `DELETE /api/v1/social/connections/unfollow/{targetId}` → Hủy theo dõi
- `GET /api/v1/social/connections/following` → Danh sách đang theo dõi
- `GET /api/v1/social/connections/followers` → Danh sách người theo dõi
- `GET /api/v1/social/connections/friends` → Danh sách bạn bè (mutual follow)
- `PUT /api/v1/social/connections/presence` → Cập nhật trạng thái online/khóa học đang học

---

## 👥 Social - Friendships (`/api/v1/social/friends`)

- `POST /api/v1/social/friends/follow/{targetId}` → Theo dõi người dùng
- `DELETE /api/v1/social/friends/unfollow/{targetId}` → Hủy theo dõi
- `GET /api/v1/social/friends/following` → Danh sách đang theo dõi

---

## 📚 Social - Learning Activity (`/api/v1/social/activity`)

- `GET /api/v1/social/activity/feed?page=0&size=10` → Feed hoạt động học tập từ người đang theo dõi
- `POST /api/v1/social/activity/create` → Tạo hoạt động học tập (demo/testing)

---

## 💬 Social - Chat/Messages (`/api/v1/social/messages`)

### Conversations
- `GET /api/v1/social/messages/conversations?userId=1` → Danh sách cuộc trò chuyện
- `GET /api/v1/social/messages/{chatGroupId}?page=0&limit=50` → Lấy tin nhắn

### Messages
- `POST /api/v1/social/messages` → Gửi tin nhắn
- `POST /api/v1/social/messages/media` → Gửi tin nhắn với media (ảnh/video)
- `PUT /api/v1/social/messages/{messageId}` → Chỉnh sửa tin nhắn
- `DELETE /api/v1/social/messages/{messageId}` → Xóa tin nhắn
- `POST /api/v1/social/messages/{messageId}/reactions` → Thêm emoji reaction
- `POST /api/v1/social/messages/{messageId}/pin` → Ghim tin nhắn
- `GET /api/v1/social/messages/{chatGroupId}/search?keyword=...` → Tìm kiếm tin nhắn
- `GET /api/v1/social/messages/{chatGroupId}/pinned` → Lấy tin nhắn đã ghim

### Chat Groups
- `POST /api/v1/social/messages/groups/private` → Tạo/lấy cuộc trò chuyện 1-1
- `POST /api/v1/social/messages/groups` → Tạo nhóm chat
- `GET /api/v1/social/messages/groups/{chatGroupId}/members` → Danh sách thành viên
- `POST /api/v1/social/messages/groups/{chatGroupId}/members` → Thêm thành viên
- `DELETE /api/v1/social/messages/groups/{chatGroupId}/members/{userId}` → Xóa thành viên
- `POST /api/v1/social/messages/groups/{chatGroupId}/mute?userId=...&mute=...` → Tắt/bật thông báo
- `POST /api/v1/social/messages/groups/{chatGroupId}/archive?userId=...` → Lưu trữ nhóm

### Calls
- `POST /api/v1/social/messages/calls/initiate` → Bắt đầu cuộc gọi
- `POST /api/v1/social/messages/calls/{callId}/answer` → Trả lời cuộc gọi
- `POST /api/v1/social/messages/calls/{callId}/reject` → Từ chối cuộc gọi
- `POST /api/v1/social/messages/calls/{callId}/end` → Kết thúc cuộc gọi
- `GET /api/v1/social/messages/calls/history/{userId}` → Lịch sử cuộc gọi
- `GET /api/v1/social/messages/calls/missed/{userId}` → Cuộc gọi nhỡ

---

## 👤 Social - Profiles (`/api/v1/social/profiles`)

### Profile
- `GET /api/v1/social/profiles/{userId}` → Lấy hồ sơ
- `POST /api/v1/social/profiles` → Tạo hồ sơ mới
- `PUT /api/v1/social/profiles/{userId}` → Cập nhật hồ sơ
- `POST /api/v1/social/profiles/{userId}/avatar` → Upload ảnh đại diện
- `POST /api/v1/social/profiles/{userId}/cover` → Upload ảnh bìa

### Stories
- `POST /api/v1/social/profiles/{userId}/stories` → Thêm story
- `GET /api/v1/social/profiles/{userId}/stories` → Lấy stories

### Highlights
- `POST /api/v1/social/profiles/{userId}/highlights` → Tạo highlight
- `GET /api/v1/social/profiles/{userId}/highlights` → Lấy highlights
- `POST /api/v1/social/profiles/highlights/{highlightId}/stories` → Thêm story vào highlight
- `DELETE /api/v1/social/profiles/highlights/{highlightId}` → Xóa highlight

### Follow
- `POST /api/v1/social/profiles/{toUserId}/follow` → Follow người dùng
- `DELETE /api/v1/social/profiles/{toUserId}/follow` → Unfollow

### Privacy
- `GET /api/v1/social/profiles/{userId}/privacy` → Lấy cài đặt riêng tư
- `PUT /api/v1/social/profiles/{userId}/privacy` → Cập nhật cài đặt riêng tư

### Search
- `GET /api/v1/social/profiles/search?keyword=...` → Tìm kiếm profile
- `GET /api/v1/social/profiles/top/followers?limit=10` → Top người được follow nhiều nhất

---

## 🔔 Social - Notifications (`/api/v1/social/notifications`)

- `GET /api/v1/social/notifications` → Lấy danh sách thông báo
- `GET /api/v1/social/notifications/{id}` → Lấy chi tiết thông báo
- `GET /api/v1/social/notifications/unread/count` → Số lượng thông báo chưa đọc
- `GET /api/v1/social/notifications/unread` → Danh sách thông báo chưa đọc
- `GET /api/v1/social/notifications/type/{type}` → Lấy theo loại
- `GET /api/v1/social/notifications/search?keyword=...` → Tìm kiếm thông báo
- `GET /api/v1/social/notifications/recent/{limit}` → Thông báo gần đây
- `POST /api/v1/social/notifications` → Tạo thông báo
- `PUT /api/v1/social/notifications/{id}/read` → Đánh dấu đã đọc
- `PUT /api/v1/social/notifications/read-all` → Đánh dấu tất cả đã đọc
- `PUT /api/v1/social/notifications/{id}/unread` → Đánh dấu chưa đọc
- `DELETE /api/v1/social/notifications/{id}` → Xóa thông báo
- `DELETE /api/v1/social/notifications` → Xóa tất cả
- `DELETE /api/v1/social/notifications/cleanup` → Dọn dẹp thông báo cũ

---

## 👥 Groups (`/api/v1/groups`)

### Groups CRUD
- `GET /api/v1/groups?page=0&size=10` → Danh sách nhóm công khai
- `GET /api/v1/groups/trending?page=0&size=10` → Nhóm trending
- `GET /api/v1/groups/search?keyword=...&page=0&size=10` → Tìm kiếm nhóm
- `GET /api/v1/groups/category/{category}?page=0&size=10` → Nhóm theo category
- `GET /api/v1/groups/suggested?page=0&size=10` → Nhóm gợi ý
- `GET /api/v1/groups/my-groups?page=0&size=10` → Nhóm đã tham gia
- `GET /api/v1/groups/owned?page=0&size=10` → Nhóm đã tạo
- `GET /api/v1/groups/{id}` → Chi tiết nhóm
- `POST /api/v1/groups` → Tạo nhóm mới
- `PUT /api/v1/groups/{id}` → Cập nhật nhóm
- `DELETE /api/v1/groups/{id}` → Xóa nhóm

### Members
- `POST /api/v1/groups/{id}/join` → Tham gia nhóm
- `POST /api/v1/groups/{id}/leave` → Rời nhóm
- `GET /api/v1/groups/{id}/members?page=0&size=10` → Danh sách thành viên
- `GET /api/v1/groups/{id}/members/search?keyword=...&page=0&size=10` → Tìm thành viên
- `PUT /api/v1/groups/{groupId}/members/{userId}/role` → Cập nhật vai trò
- `POST /api/v1/groups/{id}/mute?isMuted=...` → Tắt/bật thông báo
- `GET /api/v1/groups/{id}/is-member` → Kiểm tra là thành viên

### Posts
- `GET /api/v1/groups/{id}/posts?page=0&size=10` → Danh sách bài viết
- `GET /api/v1/groups/{id}/posts/search?keyword=...&page=0&size=10` → Tìm bài viết
- `POST /api/v1/groups/{id}/posts` → Đăng bài viết
- `PUT /api/v1/groups/{groupId}/posts/{postId}` → Sửa bài viết
- `DELETE /api/v1/groups/{groupId}/posts/{postId}` → Xóa bài viết
- `POST /api/v1/groups/{groupId}/posts/{postId}/like` → Like bài viết
- `DELETE /api/v1/groups/{groupId}/posts/{postId}/unlike` → Unlike

### Comments
- `GET /api/v1/groups/{groupId}/posts/{postId}/comments?page=0&size=10` → Lấy comments
- `POST /api/v1/groups/{groupId}/posts/{postId}/comments` → Bình luận
- `PUT /api/v1/groups/{groupId}/posts/{postId}/comments/{commentId}` → Sửa comment
- `DELETE /api/v1/groups/{groupId}/posts/{postId}/comments/{commentId}` → Xóa comment
- `POST /api/v1/groups/{groupId}/posts/{postId}/comments/{commentId}/like` → Like comment
- `DELETE /api/v1/groups/{groupId}/posts/{postId}/comments/{commentId}/unlike` → Unlike comment

---

## 🎥 Videos (`/api/v1/videos`)

### Video CRUD
- `POST /api/v1/videos` → Tạo video
- `PUT /api/v1/videos/{videoId}` → Cập nhật video
- `DELETE /api/v1/videos/{videoId}` → Xóa video
- `GET /api/v1/videos?page=0&size=10` → Danh sách video
- `GET /api/v1/videos/{videoId}` → Chi tiết video

### Discovery
- `GET /api/v1/videos/discover/trending?page=0&size=10` → Video trending
- `GET /api/v1/videos/discover/popular?page=0&size=10` → Video phổ biến
- `GET /api/v1/videos/discover/recent?page=0&size=10` → Video gần đây
- `GET /api/v1/videos/category/{category}?page=0&size=10` → Video theo category
- `GET /api/v1/videos/level/{level}?page=0&size=10` → Video theo level
- `GET /api/v1/videos/creator/{creatorId}?page=0&size=10` → Video của creator
- `GET /api/v1/videos/search?keyword=...&page=0&size=10` → Tìm kiếm video
- `GET /api/v1/videos/{videoId}/recommendations?page=0&size=5` → Video gợi ý

### Publish
- `POST /api/v1/videos/{videoId}/publish` → Xuất bản video
- `POST /api/v1/videos/{videoId}/archive` → Lưu trữ video

### Like
- `POST /api/v1/videos/{videoId}/like` → Like video
- `POST /api/v1/videos/{videoId}/unlike` → Unlike video
- `GET /api/v1/videos/{videoId}/is-liked` → Kiểm tra đã like

### Comments
- `POST /api/v1/videos/{videoId}/comments` → Thêm comment
- `GET /api/v1/videos/{videoId}/comments?page=0&size=10` → Lấy comments
- `POST /api/v1/videos/{videoId}/comments/{commentId}/replies` → Reply comment
- `GET /api/v1/videos/comments/{commentId}/replies` → Lấy replies
- `PUT /api/v1/videos/comments/{commentId}` → Cập nhật comment
- `DELETE /api/v1/videos/comments/{commentId}` → Xóa comment
- `POST /api/v1/videos/comments/{commentId}/like` → Like comment
- `POST /api/v1/videos/comments/{commentId}/unlike` → Unlike comment

---

## 📚 Courses (`/api/v1/courses`)

- `GET /api/v1/courses` → Danh sách khóa học
- `GET /api/v1/courses/{id}` → Chi tiết khóa học

---

## ❓ Q&A - Questions (`/api/v1/qa/questions`)

- `POST /api/v1/qa/questions` → Tạo câu hỏi
- `GET /api/v1/qa/questions?page=0&size=10` → Danh sách câu hỏi trending
- `GET /api/v1/qa/questions/course/{courseId}?page=0&size=10` → Câu hỏi theo khóa học
- `GET /api/v1/qa/questions/search?keyword=...&page=0&size=10` → Tìm kiếm câu hỏi
- `GET /api/v1/qa/questions/my-questions?page=0&size=10` → Câu hỏi của tôi
- `GET /api/v1/qa/questions/{questionId}` → Chi tiết câu hỏi
- `PUT /api/v1/qa/questions/{questionId}` → Cập nhật câu hỏi
- `DELETE /api/v1/qa/questions/{questionId}` → Xóa câu hỏi
- `POST /api/v1/qa/questions/{questionId}/best-answer/{answerId}` → Đặt best answer
- `GET /api/v1/qa/questions/{questionId}/answers?page=0&size=10` → Danh sách câu trả lời
- `GET /api/v1/qa/questions/{questionId}/comments?page=0&size=10` → Bình luận trên câu hỏi

---

## 💡 Q&A - Answers (`/api/v1/qa`)

- `POST /api/v1/qa/questions/{questionId}/answers` → Tạo câu trả lời
- `GET /api/v1/qa/answers/{answerId}` → Chi tiết câu trả lời
- `PUT /api/v1/qa/answers/{answerId}` → Cập nhật câu trả lời
- `DELETE /api/v1/qa/answers/{answerId}` → Xóa câu trả lời
- `GET /api/v1/qa/questions/{questionId}/answers/top-rated?page=0&size=10` → Câu trả lời được like nhiều nhất
- `GET /api/v1/qa/user/answers?page=0&size=10` → Câu trả lời của tôi
- `POST /api/v1/qa/answers/{answerId}/react` → Like/Dislike câu trả lời
- `DELETE /api/v1/qa/answers/{answerId}/react` → Hủy reaction
- `GET /api/v1/qa/answers/{answerId}/comments?page=0&size=10` → Bình luận trên câu trả lời
- `POST /api/v1/qa/answers/{answerId}/comments` → Tạo bình luận

---

## 🔍 Search (`/api/v1/search`)

### Global Search
- `GET /api/v1/search?keyword=...&page=0&size=10` → Tìm kiếm toàn cầu

### Type-specific Search
- `GET /api/v1/search/users?keyword=...&limit=20` → Tìm kiếm users
- `GET /api/v1/search/pages?keyword=...&limit=20` → Tìm kiếm pages
- `GET /api/v1/search/groups?keyword=...&limit=20` → Tìm kiếm groups
- `GET /api/v1/search/events?keyword=...&limit=20` → Tìm kiếm events

### Suggestions
- `GET /api/v1/search/suggestions?query=...&type=...` → Gợi ý tìm kiếm (autocomplete)

### Advanced Search
- `POST /api/v1/search/advanced` → Tìm kiếm nâng cao với filters

### Trending & Popular
- `GET /api/v1/search/trending` → Trending searches
- `GET /api/v1/search/popular/{type}?limit=10` → Popular items theo type

### Search History
- `GET /api/v1/search/history` → Lịch sử tìm kiếm
- `DELETE /api/v1/search/history/{id}` → Xóa một item lịch sử
- `DELETE /api/v1/search/history` → Xóa tất cả lịch sử

### Saved Searches
- `GET /api/v1/search/saved` → Danh sách tìm kiếm đã lưu
- `POST /api/v1/search/saved` → Lưu tìm kiếm
- `DELETE /api/v1/search/saved/{id}` → Xóa tìm kiếm đã lưu

---

## 📝 Notes

- Tất cả endpoints cần **JWT token** trong header `Authorization: Bearer <token>` (trừ login/register)
- Frontend chạy tại: `http://localhost:5173` (Vite dev server)
- Backend chạy tại: `http://localhost:8080` (Spring Boot)
- WebSocket endpoint: `/ws/chat` (STOMP protocol) cho real-time messaging

---

## 📊 Tổng kết

- **Frontend Routes**: 9 routes
- **Backend API Endpoints**: ~200+ endpoints
- **Modules chính**:
  - Authentication (2 endpoints)
  - User Management (7 endpoints)
  - Social Posts (20+ endpoints)
  - Connections/Friends (7 endpoints)
  - Learning Activity (2 endpoints)
  - Chat/Messages (20+ endpoints)
  - Profiles (15+ endpoints)
  - Notifications (14 endpoints)
  - Groups (30+ endpoints)
  - Videos (25+ endpoints)
  - Courses (2 endpoints)
  - Q&A Questions (10+ endpoints)
  - Q&A Answers (10+ endpoints)
  - Search (15+ endpoints)


