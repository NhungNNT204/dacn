# 📱 Giải thích Tất cả UI Screens & Components

## 📋 Mục lục
1. [Layout & Navigation](#layout--navigation)
2. [Authentication Pages](#authentication-pages)
3. [Student Pages](#student-pages)
4. [Student Components](#student-components)
5. [Classroom Pages](#classroom-pages)
6. [Video Pages](#video-pages)
7. [Profile & Settings](#profile--settings)
8. [Shared Components](#shared-components)
9. [Global Styles](#global-styles)

---

## 🏗️ Layout & Navigation

### `App.jsx`
**Vị trí:** `upnest-web/src/App.jsx`  
**Chức năng:** Component gốc của ứng dụng, quản lý routing và layout chính.

**Tính năng:**
- Wrap toàn bộ app với `AuthProvider` để quản lý authentication state
- Điều kiện hiển thị `Navigation` component: chỉ hiển thị khi KHÔNG phải các route dùng `StudentLayout` (tránh duplicate header)
- Routes dùng `StudentLayout`: `/dashboard`, `/news-feed`, `/blog`, `/classroom`, `/friends`
- Các route khác (login, register, profile, privacy) sẽ hiển thị `Navigation` bar

**CSS:** `App.css` - Định nghĩa `.app-main` với `min-height: 100vh`

---

### `Navigation.jsx`
**Vị trí:** `upnest-web/src/components/Navigation.jsx`  
**Chức năng:** Thanh điều hướng chính (navbar) cho các trang không dùng `StudentLayout`.

**Tính năng:**
- Logo UpNestEdu với link đến dashboard/login
- Menu điều hướng: Trang chủ, Khóa học, Cộng đồng
- User dropdown khi đã đăng nhập:
  - Hồ sơ của tôi
  - Cài đặt quyền riêng tư
  - Đăng xuất
- Menu đăng nhập/đăng ký khi chưa đăng nhập
- Dropdown animation với `ui-animate-pop`

**CSS:** `Navigation.css` - Sử dụng design tokens từ `ui.css`

---

### `StudentLayout.jsx`
**Vị trí:** `upnest-web/src/pages/student/StudentLayout.jsx`  
**Chức năng:** Layout shell chính cho các trang student (kiểu Facebook/Instagram).

**Cấu trúc:**
1. **Header:**
   - Toggle sidebar button
   - Logo "UpNest"
   - Search bar
   - Icons: Thông báo (🔔), Tin nhắn (💬), Đăng xuất

2. **Sidebar (trái):**
   - Navigation menu với các mục:
     - 🏠 Trang chủ (`/dashboard`)
     - 📱 Mạng xã hội (`/news-feed`)
     - 📝 Blogs (`/blog`)
     - 🎓 Lớp học (`/classroom`)
     - 👥 Bạn bè (`/friends`)
     - 💬 Diễn đàn (`/forum`)
     - 📚 Khóa học (`/courses`)
     - 👤 Hồ sơ (`/profile`)
     - ⚙️ Cài đặt (`/settings`)
   - Footer copyright

3. **Main Content:**
   - Render `children` prop (các page components)
   - Hoặc hiển thị `StudentMessaging` nếu `showMessaging = true`

4. **Right Sidebar:**
   - Widget "🔥 Xu hướng" (trending topics)
   - Widget "👥 Gợi ý bạn bè" (friend suggestions)

**CSS:** `StudentLayout.css` - Layout responsive với sidebar có thể đóng/mở

---

## 🔐 Authentication Pages

### `Login.jsx`
**Vị trí:** `upnest-web/src/pages/auth/Login.jsx`  
**Chức năng:** Trang đăng nhập.

**Tính năng:**
- Form đăng nhập với email/username và password
- Checkbox "Ghi nhớ tôi"
- Link "Quên mật khẩu?"
- Link đến trang đăng ký
- Loading spinner khi đang xử lý
- Error alert khi đăng nhập thất bại
- Lưu tokens vào localStorage sau khi đăng nhập thành công
- Redirect đến `/dashboard` sau khi đăng nhập

**API:** `POST /api/v1/auth/login`

**CSS:** `Login.css` - Form styling với design tokens

---

### `Register.jsx`
**Vị trí:** `upnest-web/src/pages/auth/Register.jsx`  
**Chức năng:** Trang đăng ký tài khoản mới.

**Tính năng:**
- Form đăng ký với các trường: username, email, password, confirm password
- Validation form
- Link đến trang đăng nhập
- Loading state

**CSS:** `Register.css`

---

## 👨‍🎓 Student Pages

### `StudentDashboard.jsx`
**Vị trí:** `upnest-web/src/pages/student/StudentDashboard.jsx`  
**Chức năng:** Trang dashboard chính cho sinh viên.

**Các phần:**
1. **Profile Card:**
   - Banner ảnh
   - Avatar với chữ cái đầu
   - Tên, email, role (Sinh viên/Giáo viên/Admin)
   - Button "Chỉnh sửa hồ sơ"

2. **Quick Stats (4 cards):**
   - 📚 Khóa học: Số khóa đang theo học
   - 👥 Bạn bè: Số người theo dõi
   - 💬 Bài viết: Số bài viết đã chia sẻ
   - 🏆 Điểm: Tổng điểm tích lũy

3. **Quick Actions (4 buttons):**
   - 📖 Khóa học → `/courses`
   - 💬 Diễn đàn → `/forum`
   - 👥 Bạn bè → `/friends`
   - 📊 Tiến độ → `/progress`

4. **Recent Activity:**
   - Danh sách hoạt động gần đây (bài viết, khóa học mới, follow)

5. **Recommendations:**
   - Cards gợi ý khóa học (JavaScript Advanced, Python for Data Science, Web Design Basics)

**API:** `GET /api/v1/users/profile` (fallback to mock service)

**CSS:** `StudentDashboard.css` - Card-based layout với hover effects

---

### `StudentNewsFeed.jsx`
**Vị trí:** `upnest-web/src/pages/student/StudentNewsFeed.jsx`  
**Chức năng:** Wrapper component, redirect đến `HomeFeed`.

**Lý do:** Để tái sử dụng `HomeFeed` component với đầy đủ tính năng (reactions, comments, share, save, report, hide, media lightbox).

---

### `HomeFeed.jsx`
**Vị trí:** `upnest-web/src/pages/student/HomeFeed.jsx`  
**Chức năng:** Trang chủ với dòng thời gian cá nhân hoá - **UI chính của News Feed**.

**Cấu trúc:**
1. **Header:**
   - Title "Trang chủ"
   - Search bar để tìm kiếm bài viết

2. **Left Sidebar (Navigation):**
   - 🏠 Dòng thời gian (personalized feed)
   - ➕ Hoạt động học tập (learning activity feed)
   - 📈 Xu hướng (trending feed)
   - 🔖 Đã lưu (saved posts)

3. **Main Feed:**
   - `CreatePost` component (khi không phải tab "Hoạt động học tập")
   - Danh sách posts hoặc activities:
     - `FeedPostCard` cho posts
     - `ActivityCard` cho learning activities
   - Infinite scroll với Intersection Observer
   - Loading spinner
   - Empty state

4. **Right Sidebar:**
   - "Được đề xuất cho bạn" (placeholder)

5. **Modals:**
   - `CommentSection` - Xem/bình luận
   - `ShareModal` - Chia sẻ bài viết
   - `ReportModal` - Báo cáo/ẩn/xóa bài viết

**Tính năng:**
- 4 loại feed: personalized, activity, trending, saved
- Pagination với infinite scroll
- Optimistic UI updates khi tạo post mới
- Handle reactions, comments, share, save, report, hide, delete

**APIs:**
- `GET /api/v1/social/posts/feed` - Personalized feed
- `GET /api/v1/social/posts/trending` - Trending feed
- `GET /api/v1/social/posts/saved` - Saved posts
- `GET /api/v1/social/activity/feed` - Learning activity feed
- `POST /api/v1/social/posts/create` - Create post

**CSS:** `styles/HomeFeed.css`

---

### `CreatePost.jsx`
**Vị trí:** `upnest-web/src/pages/student/CreatePost.jsx`  
**Chức năng:** Component tạo bài đăng mới.

**Tính năng:**
- Textarea để nhập nội dung
- Chọn loại bài đăng:
  - 💭 Trạng thái
  - ❓ Câu hỏi
  - 🏆 Thành tích
  - 📝 Bài viết
  - 📚 Chia sẻ tài liệu
- Upload files (ảnh, video, tài liệu)
- Emoji picker
- Chọn quyền riêng tư (public, friends, specific class)
- Chọn lớp học để chia sẻ
- Preview files đã upload
- Button "Đăng" với gradient blue

**Callback:** `onPostCreated(newPost)` - Gọi khi post được tạo thành công

**CSS:** `CreatePost.css` - Smooth hover/press effects

---

### `ConnectionsPage.jsx`
**Vị trí:** `upnest-web/src/pages/student/ConnectionsPage.jsx`  
**Chức năng:** Trang quản lý kết nối (US-01, US-02).

**Tabs:**
1. **Bạn bè (Friends):**
   - Danh sách mutual friends (cả 2 đều follow nhau)

2. **Đang theo dõi (Following):**
   - Danh sách người dùng mà current user đang follow

3. **Người theo dõi (Followers):**
   - Danh sách người dùng đang follow current user

4. **Tìm kiếm (Search):**
   - Input tìm theo tên/email
   - Input filter theo khóa học đang học
   - Button "Tìm"
   - Kết quả hiển thị:
     - Avatar
     - Tên
     - Badge "Online" nếu đang online
     - Khóa học hiện tại
     - Button "Theo dõi" / "Đang theo dõi"

**Tính năng:**
- Tự động cập nhật presence (online) khi mở trang
- Follow/unfollow ngay tại kết quả tìm kiếm
- Không hiển thị current user trong kết quả

**APIs:**
- `GET /api/v1/social/connections/search?q=...&course=...`
- `POST /api/v1/social/connections/follow/{targetId}`
- `DELETE /api/v1/social/connections/unfollow/{targetId}`
- `GET /api/v1/social/connections/following`
- `GET /api/v1/social/connections/followers`
- `GET /api/v1/social/connections/friends`
- `PUT /api/v1/social/connections/presence`

**CSS:** `Connections.css`

---

### `BlogSection.jsx`
**Vị trí:** `upnest-web/src/pages/student/BlogSection.jsx`  
**Chức năng:** Thế giới viết blog cá nhân.

**Views:**
1. **List View:**
   - Danh sách blog posts với:
     - Title, author, date, category
     - Preview content
     - Likes, comments, views
     - Tags
   - Button "Viết blog mới"

2. **Write View:**
   - Form viết blog:
     - Title
     - Category
     - Content (markdown support)
     - Upload ảnh cover
     - Tags
   - Preview mode
   - Button "Xuất bản"

3. **Read View:**
   - Full blog content
   - Author info
   - Like, comment, share buttons
   - Comments section

**CSS:** `BlogSection.css`

---

### `StudentMessaging.jsx`
**Vị trí:** `upnest-web/src/pages/student/StudentMessaging.jsx`  
**Chức năng:** Hệ thống tin nhắn hoàn chỉnh.

**Tính năng:**
- Chat list (danh sách cuộc trò cnhungện)
- Chat window (cửa sổ chat)
- 1-1 chats, group chats, classroom chats
- File sharing (ảnh, video, documents)
- Typing indicators
- Real-time messaging (WebSocket)
- Responsive (mobile/desktop)

**Components sử dụng:**
- `ChatList` - Danh sách conversations
- `ChatWindow` - Cửa sổ chat

**CSS:** `StudentMessaging.css`

---

## 🧩 Student Components

### `FeedPostCard.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/FeedPostCard.jsx`  
**Chức năng:** Card hiển thị một bài đăng trong feed.

**Cấu trúc:**
1. **Header:**
   - Avatar (hoặc initials)
   - Tên tác giả, thời gian đăng
   - Post type badge
   - View count
   - Save button (🔖)
   - More menu (⋮)

2. **Content:**
   - Text content
   - Media (ảnh/video) - click để mở lightbox
   - Attachments (tài liệu) - click để download/view

3. **Footer:**
   - Reaction picker (6 loại: 👍 Like, ❤️ Love, 😂 Haha, 😲 Wow, 😢 Sad, 😠 Angry)
   - Comment button với count
   - Share button với count
   - Reaction summary (hiển thị top reactions)

**Tính năng:**
- Click ảnh/video → mở `MediaLightbox`
- Click attachment → mở trong tab mới
- Hover effects
- Optimistic UI updates

**Callbacks:**
- `onReactionClick(postId, reactionType)`
- `onCommentClick(postId)`
- `onShareClick(postId)`
- `onSaveClick(postId)`
- `onMenuClick(postId)`

**CSS:** `styles/FeedPostCard.css`

---

### `ActivityCard.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/ActivityCard.jsx`  
**Chức năng:** Card hiển thị một learning activity (US-03).

**Hiển thị:**
- Avatar (hoặc initials)
- Tên người dùng
- Verb: "đã hoàn thành khóa học" / "đã review khóa học" / "đã hoàn thành thử thách"
- Thời gian
- Tên khóa học (nếu có)
- Message (nếu có)

**Activity Types:**
- `COURSE_COMPLETED` - Hoàn thành khóa học
- `REVIEW` - Review khóa học
- `CHALLENGE` - Hoàn thành thử thách

**CSS:** `styles/ActivityCard.css`

---

### `PostCard.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/PostCard.jsx`  
**Chức năng:** Card bài đăng với đầy đủ interactions (dùng trong Groups).

**Tính năng:**
- Like/Reaction với 6 loại reactions
- Comments (expandable)
- Share
- Delete (nếu là author)
- Teacher moderation (approve/reject) nếu `isTeacher = true`
- Post stats (likes, comments, shares)

**Components con:**
- `PostReactions` - Hiển thị reactions
- `PostComments` - Hiển thị comments

**CSS:** `styles/PostCard.css`

---

### `MediaLightbox.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/MediaLightbox.jsx`  
**Chức năng:** Modal hiển thị ảnh/video fullscreen.

**Tính năng:**
- Hiển thị ảnh fullscreen
- Hiển thị video với controls
- Support YouTube embeds (iframe)
- Close button (X)
- Close bằng phím ESC
- Click outside để đóng

**Props:**
- `open` - Boolean
- `type` - 'image' | 'video'
- `src` - URL
- `alt` - Alt text
- `onClose` - Callback

**CSS:** `styles/MediaLightbox.css`

---

### `CommentSection.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/CommentSection.jsx`  
**Chức năng:** Modal hiển thị và quản lý comments của một post.

**Tính năng:**
- Danh sách comments với pagination
- Input để thêm comment mới
- Reply comments
- Delete comment (nếu là author)
- Like comment
- Avatar, tên, thời gian cho mỗi comment

**CSS:** `styles/CommentSection.css`

---

### `ShareModal.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/ShareModal.jsx`  
**Chức năng:** Modal chia sẻ bài viết.

**Tính năng:**
- Chọn nơi chia sẻ: Feed, Group, Message, Copy link
- Thêm message khi chia sẻ
- Preview bài viết được chia sẻ

**CSS:** `styles/ShareModal.css`

---

### `ReportModal.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/ReportModal.jsx`  
**Chức năng:** Modal báo cáo/ẩn/xóa bài viết.

**Tính năng:**
- Báo cáo bài viết (chọn lý do: spam, inappropriate, etc.)
- Ẩn bài viết (không hiển thị trong feed nữa)
- Xóa bài viết (nếu là author)

**CSS:** `styles/ReportModal.css`

---

### `ProfileHeader.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/ProfileHeader.jsx`  
**Chức năng:** Header của trang profile.

**Hiển thị:**
- Cover image
- Avatar
- Tên, username, bio
- Follow/Unfollow button
- Message button
- Stats: Posts, Followers, Following

---

### `ProfileStats.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/ProfileStats.jsx`  
**Chức năng:** Thống kê profile (posts count, followers, following).

---

### `EditProfileModal.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/EditProfileModal.jsx`  
**Chức năng:** Modal chỉnh sửa profile.

**Tính năng:**
- Cập nhật fullName, bio, location, website
- Upload avatar
- Upload cover image
- Save/Cancel buttons

---

### `PrivacySettingsModal.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/PrivacySettingsModal.jsx`  
**Chức năng:** Modal cài đặt quyền riêng tư.

---

### `FriendsModal.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/FriendsModal.jsx`  
**Chức năng:** Modal hiển thị danh sách bạn bè.

---

### `StoryHighlights.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/StoryHighlights.jsx`  
**Chức năng:** Hiển thị story highlights (Instagram-style).

---

### `TeacherModerationDashboard.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/TeacherModerationDashboard.jsx`  
**Chức năng:** Dashboard cho giáo viên để duyệt bài viết.

**Tính năng:**
- Danh sách bài viết chờ duyệt
- Approve/Reject posts
- Filter theo status

**CSS:** `styles/TeacherModerationDashboard.css`

---

### `PostReactions.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/PostReactions.jsx`  
**Chức năng:** Component hiển thị reactions của post.

**Tính năng:**
- Hiển thị tổng số reactions
- Hiển thị top reactions (emoji + count)
- Click để xem chi tiết

**CSS:** `styles/PostReactions.css`

---

### `PostComments.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/PostComments.jsx`  
**Chức năng:** Component hiển thị comments của post (inline, không phải modal).

**CSS:** `styles/PostComments.css`

---

### `PostCreator.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/PostCreator.jsx`  
**Chức năng:** Component hiển thị thông tin người tạo post (avatar, tên, verified badge).

**CSS:** `styles/PostCreator.css`

---

### `CommentItem.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/CommentItem.jsx`  
**Chức năng:** Component hiển thị một comment item.

**CSS:** `styles/CommentItem.css`

---

### `PostsList.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/PostsList.jsx`  
**Chức năng:** Component hiển thị danh sách posts (wrapper).

---

### `ChatBox.jsx`, `ChatBoxMain.jsx`, `ChatSidebar.jsx`, `ChatWindow.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/`  
**Chức năng:** Các components cho chat system.

---

### `MessageBox.jsx`, `MessageInput.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/`  
**Chức năng:** Components cho message bubbles và input.

---

### `CallModal.jsx`
**Vị trí:** `upnest-web/src/pages/student/components/CallModal.jsx`  
**Chức năng:** Modal cho video/voice calls.

**CSS:** `styles/CallModal.css`

---

## 🎓 Classroom Pages

### `ClassroomView.jsx`
**Vị trí:** `upnest-web/src/pages/classroom/ClassroomView.jsx`  
**Chức năng:** Giao diện lớp học kiểu Edmodo.

**Cấu trúc:**
1. **Classroom Selector:**
   - Danh sách lớp học (cards)
   - Mỗi card hiển thị: icon, tên, giáo viên, mã lớp, số học sinh
   - Click để chọn lớp

2. **Tabs:**
   - 📢 Thông báo (Announcements)
   - 📝 Bài tập (Assignments)
   - 👥 Danh sách (Roster)
   - 📊 Tiến độ (Progress)

3. **Tab Content:**
   - Render component tương ứng với tab đã chọn

**CSS:** `ClassroomView.css`

---

### `AnnouncementFeed.jsx`
**Vị trí:** `upnest-web/src/pages/classroom/AnnouncementFeed.jsx`  
**Chức năng:** Feed thông báo của lớp học.

**Tính năng:**
- Danh sách thông báo từ giáo viên
- Post thông báo mới (nếu là giáo viên)
- Like, comment trên thông báo

**CSS:** `AnnouncementFeed.css`

---

### `AssignmentSection.jsx`
**Vị trí:** `upnest-web/src/pages/classroom/AssignmentSection.jsx`  
**Chức năng:** Quản lý bài tập.

**Tính năng:**
- Danh sách bài tập
- Tạo bài tập mới (giáo viên)
- Nộp bài tập (học sinh)
- Xem tiến độ nộp bài

**CSS:** `AssignmentSection.css`

---

### `ClassroomRoster.jsx`
**Vị trí:** `upnest-web/src/pages/classroom/ClassroomRoster.jsx`  
**Chức năng:** Danh sách học sinh trong lớp.

**Tính năng:**
- Grid/list view
- Avatar, tên, email
- Search students
- Filter

**CSS:** `ClassroomRoster.css`

---

### `ProgressTracker.jsx`
**Vị trí:** `upnest-web/src/pages/classroom/ProgressTracker.jsx`  
**Chức năng:** Theo dõi tiến độ học tập.

**Tính năng:**
- Progress bars cho từng học sinh
- Thống kê: hoàn thành, đang làm, chưa bắt đầu
- Charts/graphs

**CSS:** `ProgressTracker.css`

---

## 🎥 Video Pages

### `WatchPage.jsx`
**Vị trí:** `upnest-web/src/pages/video/WatchPage.jsx`  
**Chức năng:** Trang xem video (YouTube-style).

**Cấu trúc:**
1. **Video Player:**
   - `VideoPlayer` component
   - Title, description, views, likes
   - Like/Unlike button
   - Share button

2. **Tabs:**
   - Comments
   - Related videos

3. **Comments Section:**
   - `VideoComments` component
   - Add comment form

4. **Related Videos:**
   - `VideoCard` components
   - Recommendations

5. **Discovery Sidebar:**
   - Trending videos
   - Popular videos
   - Videos by category

**APIs:**
- `GET /api/v1/videos/{videoId}`
- `GET /api/v1/videos/{videoId}/recommendations`
- `GET /api/v1/videos/{videoId}/comments`
- `POST /api/v1/videos/{videoId}/like`

**CSS:** `WatchPage.css`

---

### `VideoPlayer.jsx`
**Vị trí:** `upnest-web/src/pages/video/VideoPlayer.jsx`  
**Chức năng:** Video player component.

**Tính năng:**
- HTML5 video player
- Controls: play/pause, volume, fullscreen
- Progress bar
- Quality selector
- Subtitles support

**CSS:** `VideoPlayer.css`

---

### `VideoCard.jsx`
**Vị trí:** `upnest-web/src/pages/video/VideoCard.jsx`  
**Chức năng:** Card hiển thị video preview.

**Hiển thị:**
- Thumbnail
- Title
- Creator name, avatar
- Views, duration
- Upload date

**CSS:** `VideoCard.css`

---

### `VideoComments.jsx`
**Vị trí:** `upnest-web/src/pages/video/VideoComments.jsx`  
**Chức năng:** Component comments cho video.

**Tính năng:**
- Danh sách comments với pagination
- Add comment
- Reply comment
- Like comment
- Delete comment (author)

**CSS:** `VideoComments.css`

---

## 👤 Profile & Settings

### `Profile.jsx`
**Vị trí:** `upnest-web/src/pages/profile/Profile.jsx`  
**Chức năng:** Trang xem/chỉnh sửa profile.

**Tính năng:**
- Xem thông tin profile
- Edit button → mở `EditProfileModal`
- Avatar, cover image
- Full name, username, email
- Bio, location, website
- Stats: posts, followers, following
- Posts grid

**API:** `GET /api/v1/users/profile`

**CSS:** `Profile.css`

---

### `ProfilePage.jsx`
**Vị trí:** `upnest-web/src/pages/student/ProfilePage.jsx`  
**Chức năng:** Trang profile với đầy đủ tính năng (stories, highlights, posts).

**Components sử dụng:**
- `ProfileHeader`
- `ProfileStats`
- `StoryHighlights`
- `PostsList`

**CSS:** `styles/ProfilePage.css`

---

### `PrivacySettings.jsx`
**Vị trí:** `upnest-web/src/pages/privacy/PrivacySettings.jsx`  
**Chức năng:** Trang cài đặt quyền riêng tư.

**Tính năng:**
- Cài đặt ai có thể xem profile
- Cài đặt ai có thể gửi tin nhắn
- Cài đặt ai có thể follow
- Block users
- Reset về mặc định

**API:**
- `GET /api/v1/users/privacy-settings`
- `PUT /api/v1/users/privacy-settings`

**CSS:** `PrivacySettings.css`

---

## 🔄 Shared Components

### `SearchPage.jsx`
**Vị trí:** `upnest-web/src/components/SearchPage.jsx`  
**Chức năng:** Trang tìm kiếm toàn cầu.

**Tính năng:**
- Global search input
- Suggestions (autocomplete)
- Filter by type: All, Users, Pages, Groups, Events
- Trending searches
- Recent searches
- Search history
- Results hiển thị trong `SearchResults` component

**API:**
- `GET /api/v1/search?keyword=...`
- `GET /api/v1/search/suggestions?query=...`

**CSS:** `SearchPage.css`

---

### `SearchResults.jsx`
**Vị trí:** `upnest-web/src/components/SearchResults.jsx`  
**Chức năng:** Hiển thị kết quả tìm kiếm.

**Tính năng:**
- Tabs: All, Users, Pages, Groups, Events
- Cards cho mỗi kết quả
- Pagination

**CSS:** `SearchResults.css`

---

### `SearchBar.jsx`
**Vị trí:** `upnest-web/src/components/SearchBar.jsx`  
**Chức năng:** Component search bar (có thể dùng ở nhiều nơi).

**CSS:** `SearchBar.css`

---

### `NotificationPage.jsx`
**Vị trí:** `upnest-web/src/components/NotificationPage.jsx`  
**Chức năng:** Trang thông báo.

**Tính năng:**
- Danh sách thông báo với pagination
- Filter by type
- Search notifications
- Show unread only
- Mark as read/unread
- Delete notifications
- Unread count badge

**API:**
- `GET /api/v1/social/notifications`
- `GET /api/v1/social/notifications/unread/count`
- `PUT /api/v1/social/notifications/{id}/read`

**CSS:** `NotificationPage.css`

---

### `NotificationBell.jsx`
**Vị trí:** `upnest-web/src/components/NotificationBell.jsx`  
**Chức năng:** Icon thông báo với badge số lượng chưa đọc.

**CSS:** `NotificationBell.css`

---

### `NotificationItem.jsx`
**Vị trí:** `upnest-web/src/components/NotificationItem.jsx`  
**Chức năng:** Component hiển thị một notification item.

**CSS:** `NotificationItem.css`

---

### `GroupsPage.jsx`
**Vị trí:** `upnest-web/src/components/GroupsPage.jsx`  
**Chức năng:** Trang quản lý nhóm.

**Tính năng:**
- Danh sách nhóm với search, filter
- Filter by category, type
- Tạo nhóm mới
- Xem nhóm của tôi
- Trending groups
- Suggested groups
- Join/Leave group

**API:**
- `GET /api/v1/groups`
- `POST /api/v1/groups`
- `POST /api/v1/groups/{id}/join`

**CSS:** `GroupsPage.css`

---

### `GroupDetail.jsx`
**Vị trí:** `upnest-web/src/components/GroupDetail.jsx`  
**Chức năng:** Trang chi tiết nhóm.

**Tính năng:**
- Group info (name, description, members count)
- Posts trong nhóm
- Members list
- Join/Leave button
- Create post trong nhóm

**CSS:** `GroupDetail.css`

---

### `ChatList.jsx`
**Vị trí:** `upnest-web/src/components/ChatList.jsx`  
**Chức năng:** Danh sách cuộc trò cnhungện.

**Tính năng:**
- List conversations
- Unread count
- Last message preview
- Online status
- Click để mở chat window

**CSS:** `ChatList.css`

---

### `ChatWindow.jsx`
**Vị trí:** `upnest-web/src/components/ChatWindow.jsx`  
**Chức năng:** Cửa sổ chat.

**Tính năng:**
- Messages list
- Message input
- File upload
- Typing indicators
- Read receipts
- Real-time updates (WebSocket)

**CSS:** `ChatWindow.css`

---

### `MessageBubble.jsx`
**Vị trí:** `upnest-web/src/components/MessageBubble.jsx`  
**Chức năng:** Component hiển thị một message bubble.

**CSS:** `MessageBubble.css`

---

### `MessageInput.jsx`
**Vị trí:** `upnest-web/src/components/MessageInput.jsx`  
**Chức năng:** Input để gửi tin nhắn.

**Tính năng:**
- Text input
- Emoji picker
- File upload button
- Send button

**CSS:** `MessageInput.css`

---

### `MediaUpload.jsx`
**Vị trí:** `upnest-web/src/components/MediaUpload.jsx`  
**Chức năng:** Component upload media (ảnh/video).

**CSS:** `MediaUpload.css`

---

### `MediaUploadChat.jsx`
**Vị trí:** `upnest-web/src/components/MediaUploadChat.jsx`  
**Chức năng:** Component upload media cho chat.

**CSS:** `MediaUploadChat.css`

---

### `MediaGallery.jsx`
**Vị trí:** `upnest-web/src/components/MediaGallery.jsx`  
**Chức năng:** Gallery hiển thị nhiều ảnh/video.

**CSS:** `MediaGallery.css`

---

### `FileAttachment.jsx`
**Vị trí:** `upnest-web/src/components/FileAttachment.jsx`  
**Chức năng:** Component hiển thị file attachment.

**CSS:** `FileAttachment.css`

---

### `CommentSection.jsx` (Shared)
**Vị trí:** `upnest-web/src/components/CommentSection.jsx`  
**Chức năng:** Component comments (shared version, khác với student/components/CommentSection.jsx).

**CSS:** `CommentSection.css`

---

### `PostInteraction.jsx`
**Vị trí:** `upnest-web/src/components/PostInteraction.jsx`  
**Chức năng:** Component interactions cho post (like, comment, share).

**CSS:** `PostInteraction.css`

---

### `FeedFilter.jsx`
**Vị trí:** `upnest-web/src/components/FeedFilter.jsx`  
**Chức năng:** Component filter cho feed.

**CSS:** `styles/FeedFilter.css`

---

### `SuggestedContent.jsx`
**Vị trí:** `upnest-web/src/components/SuggestedContent.jsx`  
**Chức năng:** Component gợi ý nội dung.

**CSS:** `styles/SuggestedContent.css`

---

### `StudentFeed.jsx`
**Vị trí:** `upnest-web/src/components/StudentFeed.jsx`  
**Chức năng:** Component feed cho student (legacy?).

**CSS:** `styles/StudentFeed.css`

---

## 🎨 Global Styles

### `ui.css`
**Vị trí:** `upnest-web/src/styles/ui.css`  
**Chức năng:** Design system và theme tokens.

**Nội dung:**
- **Colors:**
  - Brand colors (pastel blue): `--brand-*`
  - Neutrals: `--bg`, `--bg2`, `--surface`, `--surface2`, `--border`, `--text`, `--muted`
  - Page backgrounds: `--page`, `--page2`

- **Spacing:** `--space-*`

- **Shadows:** `--shadow`, `--shadow-soft`

- **Border Radius:** `--radius`, `--radius-sm`

- **Animations:**
  - `--ease-out`, `--ease-in-out`
  - `--dur-fast`, `--dur`
  - Keyframes: `ui-pop`, `ui-fade`, `ui-spin`

- **Component Classes:**
  - `.ui-surface`, `.ui-card`, `.ui-card-lg`
  - `.ui-input`
  - `.ui-btn`, `.ui-btn-primary`, `.ui-btn-danger`, `.ui-btn-ghost`, `.ui-icon-btn`
  - `.ui-spinner`
  - `.ui-animate-pop`, `.ui-animate-fade`

- **Accessibility:** `@media (prefers-reduced-motion: reduce)`

---

### `index.css`
**Vị trí:** `upnest-web/src/index.css`  
**Chức năng:** Global CSS reset và base styles.

**Nội dung:**
- `html { color-scheme: light; }` - Đảm bảo browser UI elements render đúng với light theme
- CSS reset (nếu có)

---

### `App.css`
**Vị trí:** `upnest-web/src/App.css`  
**Chức năng:** Styles cho App component.

**Nội dung:**
- `.app-main` với `min-height: 100vh`

---

## 📊 Tổng kết

### Số lượng Components/Pages:
- **Layout & Navigation:** 3
- **Authentication:** 2
- **Student Pages:** 8
- **Student Components:** 26+
- **Classroom Pages:** 5
- **Video Pages:** 4
- **Profile & Settings:** 3
- **Shared Components:** 20+
- **Total:** ~70+ UI components/pages

### Design System:
- **Theme:** Pastel Blue, Bright, Fresh, Educational
- **Design Tokens:** Centralized trong `ui.css`
- **Animations:** Fade, Pop, Spin
- **Responsive:** Mobile-first approach

### Key Features:
- ✅ Social Feed với reactions, comments, share, save
- ✅ Learning Activity Feed (US-03)
- ✅ Connections/Follow System (US-01, US-02)
- ✅ Real-time Chat/Messaging
- ✅ Video Player & Comments
- ✅ Groups & Communities
- ✅ Search (Global, Users, Groups, etc.)
- ✅ Notifications System
- ✅ Profile Management
- ✅ Privacy Settings
- ✅ Classroom Management
- ✅ Blog System

---

**Lưu ý:** Một số components có thể có nhiều version (ví dụ: `CommentSection` có ở cả `components/` và `pages/student/components/`). Hãy kiểm tra import path để biết version nào đang được sử dụng.


