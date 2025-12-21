# 🎓 UPNEST.EDU - Nền Tảng Học Tập Trực Tuyến

> **Hệ thống học tập trực tuyến thông minh với AI, gamification và cộng đồng học tập**

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)](https://spring.io)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)

---

## 📋 MỤC LỤC

- [Tổng quan](#-tổng-quan)
- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Cài đặt](#-cài-đặt)
- [Cấu trúc Project](#-cấu-trúc-project)
- [Tài liệu](#-tài-liệu)

---

## 🎯 TỔNG QUAN

**UPNEST.EDU** là một nền tảng học tập trực tuyến hiện đại, kết hợp:

- 🤖 **AI cá nhân hóa**: Tạo lộ trình học tập riêng cho từng sinh viên
- 🎮 **Gamification**: Hệ thống điểm XP, level, streak để knhungến khích học tập
- 👥 **Cộng đồng**: Kết nối, chia sẻ và học tập cùng nhau
- 📚 **Nội dung phong phú**: Khóa học, thư viện số, video bài giảng
- 💬 **Tin nhắn real-time**: Chat với bạn bè và giảng viên

---

## ✨ TÍNH NĂNG

### 📊 Góc học tập (Dashboard)
- Lộ trình học tập cá nhân hóa với AI Insights
- Thống kê học tập (XP, Level, Streak)
- Hoạt động gần đây
- Quick Actions

### 📚 Khóa học
- Đăng ký và theo dõi khóa học
- Xem video bài giảng
- Thảo luận và ghi chú
- Theo dõi tiến độ

### 📖 Thư viện số
- Tài liệu PDF, EPUB
- Video học tập
- Đọc trực tuyến và tải xuống

### 👥 Cộng đồng
- Đăng bài viết (text, ảnh, video)
- Like, comment, share
- Bảng tin cộng đồng
- Leaderboard

### 💬 Tin nhắn
- Chat real-time
- Gửi file đính kèm
- Nhóm chat
- Gọi video/thoại (UI ready)

### 🏆 Hồ sơ năng lực số
- Hiển thị hồ sơ đầy đủ
- Chứng chỉ và kỹ năng
- Phân tích từ AI
- Xuất PDF CV

### 🧭 Định hướng sự nghiệp
- Chọn lộ trình nghề nghiệp (BA, UI/UX, Data Analyst)
- Roadmap chi tiết với các chặng
- Theo dõi tiến độ
- AI phân tích sự phù hợp

---

## 🛠️ CÔNG NGHỆ

### Frontend
- **React.js 18.2** - UI Framework
- **React Router 6** - Routing
- **Lucide React** - Icons
- **Vite** - Build Tool
- **CSS3** - Styling

### Backend
- **Java 17** - Programming Language
- **Spring Boot 3.x** - Framework
- **Spring Data JPA** - Database Access
- **MySQL/PostgreSQL** - Database
- **Lombok** - Code Generation
- **Jackson** - JSON Processing

---

## 🚀 CÀI ĐẶT

### Yêu cầu
- Node.js 18+
- Java JDK 17+
- Maven 3.6+
- MySQL 8+ hoặc PostgreSQL 14+

### Bước 1: Clone Repository
```bash
git clone <repository-url>
cd upnestedu
```

### Bước 2: Cấu hình Database
1. Tạo database:
```sql
CREATE DATABASE upnestedu;
```

2. Cấu hình trong `edu/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/upnestedu
spring.datasource.username=root
spring.datasource.password=your_password
```

### Bước 3: Chạy Backend
```bash
cd edu
mvn clean install
mvn spring-boot:run
```
Backend chạy ở: `http://localhost:8080`

### Bước 4: Chạy Frontend
```bash
cd upnest-web
npm install
npm run dev
```
Frontend chạy ở: `http://localhost:5173`

---

## 📂 CẤU TRÚC PROJECT

```
upnestedu/
├── 📱 upnest-web/          # Frontend (React)
│   ├── src/
│   │   ├── pages/         # Các trang
│   │   ├── services/      # API services
│   │   ├── routes/        # Routing
│   │   └── components/    # Components
│   └── package.json
│
└── ⚙️ edu/                 # Backend (Spring Boot)
    └── src/main/java/com/upnest/edu/
        ├── modules/       # Các module chức năng
        │   ├── auth/      # Authentication
        │   ├── learning/   # Learning Roadmap
        │   ├── course/     # Courses
        │   ├── library/    # Digital Library
        │   ├── social/      # Social Feed
        │   ├── messaging/  # Messaging
        │   ├── career/      # Career Orientation
        │   └── profile/    # User Profile
        └── config/         # Configuration
```

---

## 📚 TÀI LIỆU

### 📖 Tài liệu chi tiết
- **[PROJECT_EXPLANATION.md](./PROJECT_EXPLANATION.md)** - Giải thích toàn bộ project
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)** - Hướng dẫn nhanh chạy project

### 🔗 API Documentation
- Backend API: `http://localhost:8080/api/v1/`
- Swagger UI: (nếu có) `http://localhost:8080/swagger-ui.html`

---

## 🎯 LUỒNG HOẠT ĐỘNG

```
User → Frontend (React) → API Call → Backend (Spring Boot) → Database
                                    ↓
                              Response (JSON)
                                    ↓
                              Frontend hiển thị
```

### Ví dụ: User xem khóa học
1. User click "Khóa học của tôi"
2. Frontend gọi: `GET /api/v1/courses/my`
3. Backend lấy dữ liệu từ database
4. Trả về JSON
5. Frontend hiển thị danh sách khóa học

---

## 🔐 AUTHENTICATION

Hệ thống sử dụng **JWT (JSON Web Token)**:

1. User đăng nhập → Backend trả về token
2. Frontend lưu token vào `localStorage`
3. Mỗi API call gửi token trong header: `Authorization: Bearer {token}`
4. Backend verify token để xác định user

---

## 🎮 GAMIFICATION

- **XP (Experience Points)**: Điểm khi hoàn thành bài học
- **Level**: Cấp độ (tính từ XP)
- **Streak**: Số ngày học liên tiếp
- **Badges**: nhung hiệu thành tích

---

## 🤖 AI FEATURES

- **Personalized Learning Roadmap**: Lộ trình học tập cá nhân hóa
- **Career Path Matching**: Phân tích độ phù hợp với nghề nghiệp
- **AI Insights**: Đưa ra lời knhungên dựa trên dữ liệu học tập

---

## 📝 CÁC API CHÍNH

### Authentication
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/register` - Đăng ký

### Dashboard
- `GET /api/v1/dashboard` - Dữ liệu dashboard

### Courses
- `GET /api/v1/courses/my` - Khóa học của tôi
- `GET /api/v1/courses/{id}/lessons/{lessonId}` - Chi tiết bài học

### Career
- `GET /api/v1/career/paths` - Danh sách career paths
- `GET /api/v1/career/roadmap/{code}` - Chi tiết roadmap
- `POST /api/v1/career/select` - Chọn career path

### Profile
- `GET /api/v1/profile/achievements` - Hồ sơ năng lực số

---

## 🐛 XỬ LÝ LỖI

### Backend không chạy
- Kiểm tra Java version (>= 17)
- Kiểm tra database connection
- Xem logs trong terminal

### Frontend không chạy
- Chạy `npm install` lại
- Xóa `node_modules` và cài lại
- Kiểm tra port 5173 có bị chiếm không

### API lỗi 401/403
- Kiểm tra token trong localStorage
- Đăng nhập lại để lấy token mới

---

## 🤝 ĐÓNG GÓP

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

---

## 📄 LICENSE

This project is licensed under the MIT License.

---

## 👥 TÁC GIẢ

**UPNEST.EDU Team**

---

## 🙏 CẢM ƠN

Cảm ơn bạn đã sử dụng UPNEST.EDU! 

Nếu có câu hỏi, vui lòng tạo issue hoặc liên hệ team.

**Happy Learning! 🚀**

