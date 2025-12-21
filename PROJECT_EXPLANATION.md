# 📚 HƯỚNG DẪN DỰ ÁN UPNEST.EDU - DÀNH CHO NGƯỜI MỚI BẮT ĐẦU

## 🎯 TỔNG QUAN DỰ ÁN

**UPNEST.EDU** là một nền tảng học tập trực tuyến (E-Learning Platform) được xây dựng để giúp sinh viên học tập, kết nối và phát triển kỹ năng. Hệ thống này giống như một "Facebook cho giáo dục" với nhiều tính năng thông minh.

### 🌟 Điểm nổi bật:
- **Học tập cá nhân hóa**: AI tạo lộ trình học tập riêng cho từng sinh viên
- **Gamification**: Hệ thống điểm XP, level, streak để knhungến khích học tập
- **Cộng đồng học tập**: Kết nối, chia sẻ, thảo luận với bạn bè
- **Thư viện số**: Tài liệu, video, ebooks phong phú
- **Tin nhắn real-time**: Chat với bạn bè và giảng viên

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

Dự án được chia thành **2 phần chính**:

```
UPNEST.EDU
├── 📱 Frontend (React.js)     → Giao diện người dùng
└── ⚙️ Backend (Java Spring Boot) → Xử lý logic và dữ liệu
```

### 📱 Frontend (upnest-web/)
- **Ngôn ngữ**: JavaScript (React.js)
- **Vai trò**: Hiển thị giao diện, tương tác với người dùng
- **Vị trí**: `upnest-web/` folder

### ⚙️ Backend (edu/)
- **Ngôn ngữ**: Java (Spring Boot)
- **Vai trò**: Xử lý logic nghiệp vụ, lưu trữ dữ liệu, cung cấp API
- **Vị trí**: `edu/` folder

---

## 📂 CẤU TRÚC THƯ MỤC CHI TIẾT

### 📱 Frontend Structure (`upnest-web/`)

```
upnest-web/
├── src/
│   ├── pages/              # Các trang chính của ứng dụng
│   │   ├── auth/           # Đăng nhập, đăng ký
│   │   ├── student/        # Trang dành cho sinh viên
│   │   │   ├── StudentDashboard.jsx      # Trang chủ (Góc học tập)
│   │   │   ├── MyCourses.jsx             # Khóa học của tôi
│   │   │   ├── Library.jsx               # Thư viện số
│   │   │   ├── CoursePlayer.jsx          # Xem bài học
│   │   │   ├── Feed.jsx                  # Cộng đồng (bảng tin)
│   │   │   ├── Messaging.jsx             # Tin nhắn
│   │   │   ├── Achievements.jsx          # Hồ sơ năng lực số
│   │   │   ├── CareerOrientation.jsx     # Định hướng sự nghiệp
│   │   │   └── StudentLayout.jsx         # Layout chung (sidebar, header)
│   │   └── ...
│   ├── services/           # Kết nối với Backend API
│   │   ├── learningRoadmapService.js
│   │   ├── courseService.js
│   │   ├── libraryService.js
│   │   └── ...
│   ├── routes/             # Định nghĩa các đường dẫn (URL)
│   │   └── AppRoutes.jsx   # Tất cả routes của app
│   └── components/         # Các component tái sử dụng
├── package.json            # Danh sách thư viện cần thiết
└── vite.config.js          # Cấu hình build tool
```

### ⚙️ Backend Structure (`edu/`)

```
edu/
└── src/main/java/com/upnest/edu/
    ├── modules/
    │   ├── auth/           # Xác thực người dùng (đăng nhập)
    │   │   ├── entity/     # User.java - Bảng users trong database
    │   │   ├── repository/ # UserRepository - Truy vấn database
    │   │   ├── service/    # AuthService - Logic xử lý
    │   │   └── controller/ # AuthController - API endpoints
    │   │
    │   ├── learning/       # Lộ trình học tập cá nhân hóa
    │   │   ├── entity/     # CareerTrack, RoadmapStep, LearningRoadmap
    │   │   ├── service/    # RoadmapService - Tính toán lộ trình
    │   │   └── controller/ # RoadmapController - API
    │   │
    │   ├── course/         # Khóa học và bài học
    │   │   ├── entity/     # Course, Lesson, CourseEnrollment
    │   │   ├── service/    # MyCoursesService, CoursePlayerService
    │   │   └── controller/ # MyCoursesController
    │   │
    │   ├── library/        # Thư viện số
    │   │   ├── entity/     # LibraryItem
    │   │   └── service/    # LibraryService
    │   │
    │   ├── social/         # Cộng đồng (bài viết, like, comment)
    │   │   ├── entity/     # Post, PostReaction, PostComment
    │   │   └── service/    # FeedService
    │   │
    │   ├── messaging/      # Tin nhắn
    │   │   ├── entity/     # Conversation, Message
    │   │   └── service/    # MessagingService
    │   │
    │   ├── career/         # Định hướng sự nghiệp
    │   │   ├── entity/     # CareerPath, RoadmapStep
    │   │   └── service/    # CareerService
    │   │
    │   └── profile/       # Hồ sơ người dùng
    │       ├── entity/     # UserProfile, Certification
    │       └── service/    # ProfileService
    │
    └── config/            # Cấu hình (Database, Security)
        └── CareerDataSeeder.java  # Dữ liệu mẫu
```

---

## 🔄 LUỒNG HOẠT ĐỘNG CỦA HỆ THỐNG

### 1️⃣ **Người dùng truy cập website**
```
Browser → Frontend (React) → Hiển thị giao diện
```

### 2️⃣ **Người dùng đăng nhập**
```
Frontend gửi email/password 
  → Backend API (/api/v1/auth/login)
  → Backend kiểm tra database
  → Trả về token (JWT)
  → Frontend lưu token
  → Cnhungển đến Dashboard
```

### 3️⃣ **Người dùng xem Dashboard**
```
Frontend gọi API: GET /api/v1/dashboard
  → Backend lấy dữ liệu từ database:
    - Thông tin user
    - Lộ trình học tập
    - Thống kê (XP, level, streak)
    - Hoạt động gần đây
  → Trả về JSON
  → Frontend hiển thị lên màn hình
```

### 4️⃣ **Người dùng chọn lộ trình nghề nghiệp**
```
1. Click "Tùy chỉnh mục tiêu" 
   → Navigate đến /career

2. Frontend gọi API: GET /api/v1/career/paths
   → Backend trả về danh sách career paths (BA, UI/UX, Data Analyst)

3. User chọn một path
   → Frontend gọi API: POST /api/v1/career/select
   → Backend lưu lựa chọn vào database

4. Navigate đến /career/{pathCode}
   → Frontend gọi API: GET /api/v1/career/roadmap/{pathCode}
   → Backend tính toán và trả về roadmap chi tiết
   → Frontend hiển thị roadmap với các chặng (completed, active, locked)
```

---

## 🎨 CÁC TÍNH NĂNG CHÍNH

### 1. 📊 **Góc học tập (Dashboard)**
- **Vị trí**: `/dashboard`
- **Chức năng**:
  - Hiển thị lời chào cá nhân hóa
  - Streak (số ngày học liên tiếp)
  - Level và XP hiện tại
  - Lộ trình học tập với AI Insights
  - Thống kê nhanh (khóa học, bạn bè, bài viết)
  - Hoạt động gần đây

### 2. 📚 **Khóa học của tôi**
- **Vị trí**: `/my-courses`
- **Chức năng**:
  - Xem danh sách khóa học đã đăng ký
  - Tiến độ học tập
  - Nút "Học tiếp" → Cnhungển đến Course Player

### 3. 🎥 **Course Player (Xem bài học)**
- **Vị trí**: `/courses/{courseId}/lessons/{lessonId}`
- **Chức năng**:
  - Xem video bài giảng
  - Danh sách bài học bên phải
  - Thảo luận (comment, hỏi đáp)
  - Ghi chú cá nhân
  - Đánh dấu hoàn thành

### 4. 📖 **Thư viện số**
- **Vị trí**: `/library`
- **Chức năng**:
  - Xem tài liệu (PDF, EPUB)
  - Xem video học tập
  - Tải xuống tài liệu
  - Đọc trực tuyến

### 5. 👥 **Cộng đồng (Feed)**
- **Vị trí**: `/community`
- **Chức năng**:
  - Đăng bài viết (text, ảnh, video)
  - Like, comment, share
  - Xem bảng tin của bạn bè
  - Leaderboard (bảng xếp hạng)

### 6. 💬 **Tin nhắn**
- **Vị trí**: `/messages`
- **Chức năng**:
  - Chat real-time với bạn bè
  - Gửi file đính kèm
  - Gọi video, gọi thoại (UI ready)
  - Nhóm chat

### 7. 🏆 **Hồ sơ năng lực số**
- **Vị trí**: `/achievements`
- **Chức năng**:
  - Hiển thị hồ sơ đầy đủ
  - Chứng chỉ, kỹ năng
  - Phân tích từ AI
  - Xuất PDF CV

### 8. 🧭 **Định hướng sự nghiệp**
- **Vị trí**: `/career`
- **Chức năng**:
  - Chọn lộ trình nghề nghiệp (BA, UI/UX, Data Analyst)
  - Xem roadmap chi tiết với các chặng
  - Theo dõi tiến độ
  - AI phân tích sự phù hợp

---

## 🗄️ DATABASE (Cơ sở dữ liệu)

Hệ thống sử dụng **MySQL/PostgreSQL** để lưu trữ dữ liệu. Các bảng chính:

### 👤 **Bảng Users**
- Lưu thông tin người dùng (email, password, tên, avatar...)

### 📚 **Bảng Courses & Lessons**
- `courses`: Thông tin khóa học
- `lessons`: Các bài học trong khóa học
- `course_enrollments`: User đăng ký khóa học nào
- `course_progress`: Tiến độ học tập

### 🗺️ **Bảng Learning Roadmap**
- `career_tracks`: Các định hướng nghề nghiệp
- `roadmap_steps`: Các chặng trong lộ trình
- `learning_roadmaps`: Lộ trình của từng user
- `user_career_paths`: User đã chọn career path nào

### 📖 **Bảng Library**
- `library_items`: Tài liệu, video, ebooks

### 👥 **Bảng Social**
- `posts`: Bài viết
- `post_reactions`: Like, love...
- `post_comments`: Bình luận
- `post_shares`: Chia sẻ

### 💬 **Bảng Messaging**
- `conversations`: Cuộc trò cnhungện
- `messages`: Tin nhắn
- `message_attachments`: File đính kèm

---

## 🔌 API ENDPOINTS (Cách Frontend và Backend giao tiếp)

### 🔐 **Authentication**
```
POST /api/v1/auth/login      → Đăng nhập
POST /api/v1/auth/register   → Đăng ký
```

### 📊 **Dashboard**
```
GET /api/v1/dashboard        → Lấy dữ liệu dashboard
```

### 🗺️ **Learning Roadmap**
```
GET /api/v1/roadmap          → Lấy lộ trình học tập
PUT /api/v1/roadmap/goal     → Cập nhật mục tiêu
```

### 📚 **Courses**
```
GET /api/v1/courses          → Danh sách khóa học
GET /api/v1/courses/my       → Khóa học của tôi
GET /api/v1/courses/{id}/lessons/{lessonId} → Chi tiết bài học
POST /api/v1/courses/{id}/lessons/{lessonId}/complete → Hoàn thành bài học
```

### 📖 **Library**
```
GET /api/v1/library          → Danh sách tài liệu
GET /api/v1/library/{id}/download → Tải tài liệu
```

### 👥 **Social Feed**
```
GET /api/v1/posts/feed       → Bảng tin
POST /api/v1/posts           → Đăng bài
POST /api/v1/posts/{id}/react → Like bài
POST /api/v1/posts/{id}/comment → Bình luận
```

### 💬 **Messaging**
```
GET /api/v1/messaging/conversations → Danh sách cuộc trò cnhungện
GET /api/v1/messaging/conversations/{id}/messages → Tin nhắn
POST /api/v1/messaging/messages → Gửi tin nhắn
```

### 🧭 **Career Orientation**
```
GET /api/v1/career/paths     → Danh sách career paths
GET /api/v1/career/roadmap/{code} → Chi tiết roadmap
POST /api/v1/career/select   → Chọn career path
```

### 🏆 **Profile**
```
GET /api/v1/profile/achievements → Hồ sơ năng lực số
```

---

## 🚀 CÁCH CHẠY PROJECT

### 📋 **Yêu cầu hệ thống:**
- Node.js (v18+)
- Java JDK 17+
- MySQL/PostgreSQL
- Maven (để build Java)

### 🔧 **Bước 1: Cài đặt Frontend**

```bash
# Di cnhungển vào thư mục frontend
cd upnest-web

# Cài đặt các thư viện cần thiết
npm install

# Chạy ứng dụng (sẽ chạy ở http://localhost:5173)
npm run dev
```

### ⚙️ **Bước 2: Cài đặt Backend**

```bash
# Di cnhungển vào thư mục backend
cd edu

# Cấu hình database trong file application.properties
# (Sửa thông tin kết nối database)

# Build và chạy (sẽ chạy ở http://localhost:8080)
mvn spring-boot:run
```

### 🗄️ **Bước 3: Cấu hình Database**

1. Tạo database mới trong MySQL/PostgreSQL
2. Spring Boot sẽ tự động tạo các bảng khi chạy lần đầu
3. DataSeeder sẽ tự động thêm dữ liệu mẫu

---

## 🎯 CÁC KHÁI NIỆM QUAN TRỌNG

### 🔑 **JWT Token (JSON Web Token)**
- Khi đăng nhập thành công, Backend trả về một token
- Frontend lưu token này vào localStorage
- Mỗi lần gọi API, Frontend gửi token trong header để Backend biết user là ai

### 🎮 **Gamification (Game hóa)**
- **XP (Experience Points)**: Điểm kinh nghiệm khi hoàn thành bài học
- **Level**: Cấp độ (tính từ XP)
- **Streak**: Số ngày học liên tiếp
- **Badges**: nhung hiệu khi đạt thành tích

### 🤖 **AI Insights**
- Hệ thống phân tích dữ liệu học tập của user
- Đưa ra lời knhungên và đề xuất lộ trình phù hợp
- Tính toán độ phù hợp với các career paths

### 📊 **Roadmap Steps Status**
- **Completed** (Đã hoàn thành): Chặng đã học xong (màu xanh)
- **Active** (Đang học): Chặng hiện tại (màu tím, có hiệu ứng)
- **Locked** (Đang khóa): Chặng chưa mở (màu xám, cần hoàn thành chặng trước)

---

## 🔍 VÍ DỤ LUỒNG HOẠT ĐỘNG CỤ THỂ

### Ví dụ: User muốn xem khóa học

```
1. User click vào "Khóa học của tôi" trong sidebar
   → Frontend: navigate('/my-courses')

2. Component MyCourses.jsx được render
   → useEffect() chạy khi component mount

3. Frontend gọi API:
   fetch('http://localhost:8080/api/v1/courses/my', {
     headers: { 'Authorization': 'Bearer {token}' }
   })

4. Backend nhận request:
   - MyCoursesController.getMyCourses()
   - Lấy userId từ token
   - MyCoursesService.getMyCourses(userId)
   - Query database: SELECT * FROM course_enrollments WHERE user_id = ?
   - Trả về danh sách khóa học dưới dạng JSON

5. Frontend nhận response:
   - setCourses(data)
   - Render danh sách khóa học lên màn hình

6. User click "Học tiếp"
   → navigate(`/courses/${courseId}/lessons/1`)
   → Component CoursePlayer.jsx được render
   → Hiển thị video và nội dung bài học
```

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### Frontend:
- **React.js**: Framework JavaScript để xây dựng UI
- **React Router**: Điều hướng giữa các trang
- **Lucide React**: Thư viện icon
- **CSS**: Styling (không dùng framework như Tailwind trong code này)
- **Vite**: Build tool nhanh

### Backend:
- **Spring Boot**: Framework Java để xây dựng REST API
- **Spring Data JPA**: Truy vấn database dễ dàng
- **MySQL/PostgreSQL**: Database
- **Lombok**: Giảm code boilerplate
- **Jackson**: Cnhungển đổi JSON

---

## 📝 CÁC FILE QUAN TRỌNG CẦN BIẾT

### Frontend:
1. **`AppRoutes.jsx`**: Định nghĩa tất cả các đường dẫn (URL) của app
2. **`StudentLayout.jsx`**: Layout chung (sidebar, header) cho tất cả trang student
3. **`StudentDashboard.jsx`**: Trang chủ, nơi hiển thị lộ trình học tập
4. **`CareerOrientation.jsx`**: Trang định hướng sự nghiệp

### Backend:
1. **`Application.java`**: File chính để chạy Spring Boot app
2. **`application.properties`**: Cấu hình database, port...
3. **`*Controller.java`**: Các file định nghĩa API endpoints
4. **`*Service.java`**: Các file chứa logic xử lý
5. **`*Repository.java`**: Các file truy vấn database
6. **`*Entity.java`**: Các file định nghĩa bảng database

---

## 🎓 TÓM TẮT CHO NGƯỜI MỚI

**UPNEST.EDU** là một website học tập trực tuyến với:

1. **Frontend (React)**: Hiển thị giao diện đẹp, người dùng tương tác
2. **Backend (Java)**: Xử lý logic, lưu trữ dữ liệu, cung cấp API
3. **Database**: Lưu trữ thông tin user, khóa học, bài viết...

**Luồng hoạt động đơn giản:**
```
User click button 
  → Frontend gọi API 
  → Backend xử lý 
  → Trả về dữ liệu 
  → Frontend hiển thị
```

**Ví dụ thực tế:**
- User click "Khóa học của tôi"
- Frontend gọi API `/api/v1/courses/my`
- Backend lấy danh sách từ database
- Trả về JSON
- Frontend hiển thị danh sách khóa học

---

## ❓ CÂU HỎI THƯỜNG GẶP

### Q: Làm sao để thêm một tính năng mới?

**A:** 
1. Tạo Entity trong Backend (nếu cần bảng mới)
2. Tạo Repository để truy vấn database
3. Tạo Service để xử lý logic
4. Tạo Controller để tạo API endpoint
5. Tạo Component trong Frontend
6. Tạo Service trong Frontend để gọi API
7. Thêm route trong AppRoutes.jsx

### Q: Làm sao để sửa một bug?

**A:**
1. Xác định bug ở Frontend hay Backend
2. Tìm file liên quan
3. Đọc code và tìm nguyên nhân
4. Sửa code
5. Test lại

### Q: Làm sao để chạy project lần đầu?

**A:**
1. Cài Node.js và Java
2. Clone project về máy
3. Chạy `npm install` trong thư mục `upnest-web`
4. Cấu hình database trong `edu/src/main/resources/application.properties`
5. Chạy Backend: `mvn spring-boot:run` trong thư mục `edu`
6. Chạy Frontend: `npm run dev` trong thư mục `upnest-web`
7. Mở browser: `http://localhost:5173`

---

## 📚 TÀI LIỆU THAM KHẢO

- **React.js**: https://react.dev
- **Spring Boot**: https://spring.io/projects/spring-boot
- **React Router**: https://reactrouter.com
- **JPA/Hibernate**: https://hibernate.org

---

## 🎉 KẾT LUẬN

Dự án **UPNEST.EDU** là một hệ thống học tập trực tuyến hoàn chỉnh với nhiều tính năng hiện đại. Nếu bạn là người mới, hãy:

1. **Bắt đầu từ Frontend**: Xem các component trong `upnest-web/src/pages/student/`
2. **Hiểu luồng dữ liệu**: Xem cách Frontend gọi API và Backend xử lý
3. **Thử nghiệm**: Chạy project và click vào các tính năng để hiểu cách hoạt động
4. **Đọc code**: Đọc từng file một cách cẩn thận, có comment giải thích

Chúc bạn học tập vui vẻ! 🚀

