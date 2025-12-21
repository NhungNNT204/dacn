# 📖 Hướng Dẫn Test UpNestEdu

## 🎯 Các Bước Chuẩn Bị

### 1. Kiểm Tra Node.js và NPM (cho Frontend)
```bash
node --version
npm --version
```

### 2. Kiểm Tra Maven (cho Backend)
```bash
mvn --version
```

### 3. Kiểm Tra cơ sở dữ liệu
Đảm bảo cơ sở dữ liệu SQL Server đang chạy và có database `UpNestEdu`

---

## 🚀 Chạy Backend

Mở **Terminal 1**:

```bash
cd n:\DACN\upnestedu\edu
mvn spring-boot:run
```

**Chờ cho đến khi thấy:**
```
[INFO] Started EduApplication in X seconds (JVM running for X seconds)
```

✅ Backend chạy tại: **http://localhost:8080**

---

## 🎨 Chạy Frontend

Mở **Terminal 2**:

```bash
cd n:\DACN\upnestedu\upnest-web
npm run dev
```

✅ Frontend chạy tại: **http://localhost:5173**

---

## ✅ Test Các Endpoint

### Cách 1: Sử dụng Script Test (Dễ nhất)

Mở **Terminal 3**:

```bash
# Option A: PowerShell (Knhungên dùng)
cd n:\DACN\upnestedu
pwsh test-api.ps1

# Option B: Batch file
test-api.bat
```

Script sẽ tự động:
1. ✅ Kiểm tra backend có chạy
2. ✅ Đăng ký tài khoản mới
3. ✅ Đăng nhập
4. ✅ Lấy profile
5. ✅ Test Q&A (tạo câu hỏi, lấy danh sách)

### Cách 2: Sử dụng Postman (Để lại cho phát triển)

Nếu có Postman:
1. Import file collection (nếu có)
2. Set up environment variable: `BASE_URL=http://localhost:8080`
3. Test từng endpoint

### Cách 3: Sử dụng cURL (Manual)

```bash
# 1. Đăng ký
curl -X POST "http://localhost:8080/api/users/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"testuser1\", \"email\": \"testuser1@example.com\", \"password\": \"Test@123456\", \"confirmPassword\": \"Test@123456\", \"fullName\": \"Test User\", \"role\": \"STUDENT\"}"

# 2. Đăng nhập (lưu TOKEN từ response)
curl -X POST "http://localhost:8080/api/users/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"testuser1\", \"password\": \"Test@123456\"}"

# 3. Lấy Profile (thay YOUR_TOKEN)
curl -X GET "http://localhost:8080/api/users/profile" ^
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Lấy danh sách câu hỏi
curl -X GET "http://localhost:8080/api/qa/questions"

# 5. Tạo câu hỏi (cần token)
curl -X POST "http://localhost:8080/api/qa/questions" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"title\": \"Java là gì?\", \"description\": \"Giải thích về Java\", \"tags\": \"java,programming\"}"
```

---

## 🧪 Test trực tiếp trên Frontend

### 1. Mở Browser
- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:8080**

### 2. Test Đăng Ký
1. Click "Đăng Ký" / "Register"
2. Nhập thông tin:
   - Email: `testuser@example.com`
   - Username: `testuser1`
   - Password: `Test@123456`
   - Full Name: `Test User`
3. Click "Đăng Ký"
4. Kiểm tra thông báo thành công

### 3. Test Đăng Nhập
1. Click "Đăng Nhập" / "Login"
2. Nhập:
   - Username: `testuser1`
   - Password: `Test@123456`
3. Click "Đăng Nhập"
4. Kiểm tra redirect đến dashboard

### 4. Test các module
- **Q&A**: Đặt câu hỏi, trả lời, bình luận
- **Hồ sơ**: Cập nhật profile, avatar
- **Cộng đồng**: Xem forum, groups
- **Khóa học**: Xem danh sách khóa học

---

## 🐛 Troubleshooting

### Backend không khởi động
```bash
# Check logs
mvn spring-boot:run > backend.log 2>&1

# Check database connection
# Đảm bảo SQL Server chạy: Services > SQL Server (MSSQLSERVER) > Running
```

### Frontend không tải
```bash
# Clear cache
cd upnest-web
del -r node_modules
npm install
npm run dev
```

### CORS Error (Frontend → Backend)
- Backend đã config CORS trong `SecurityConfig.java`
- Nếu vẫn lỗi, check `application.yml` xem có config `cors.allowed-origins`

### Token không valid
- Token hết hạn (default 24 giờ)
- Token không được gửi đúng format: `Authorization: Bearer TOKEN`
- Đăng nhập lại để lấy token mới

---

## 📊 Các Endpoint Chính

### 🔐 Authentication
| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| POST | `/api/users/register` | Đăng ký tài khoản |
| POST | `/api/users/login` | Đăng nhập |
| POST | `/api/users/logout` | Đăng xuất |
| POST | `/api/users/refresh-token` | Làm mới token |

### 👤 User Profile
| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | `/api/users/profile` | Lấy hồ sơ cá nhân |
| PUT | `/api/users/profile` | Cập nhật profile |
| GET | `/api/users/{userId}/profile` | Lấy profile người khác |
| PUT | `/api/users/privacy-settings` | Cập nhật cài đặt quyền riêng tư |

### ❓ Q&A Module
| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | `/api/qa/questions` | Lấy danh sách câu hỏi |
| POST | `/api/qa/questions` | Tạo câu hỏi |
| GET | `/api/qa/questions/{id}` | Lấy chi tiết câu hỏi |
| PUT | `/api/qa/questions/{id}` | Cập nhật câu hỏi |
| DELETE | `/api/qa/questions/{id}` | Xóa câu hỏi |
| POST | `/api/qa/questions/{id}/answers` | Trả lời câu hỏi |
| POST | `/api/qa/answers/{id}/comments` | Bình luận trả lời |

### 💬 Forum Module (tương tự Q&A)
| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | `/api/forum/threads` | Lấy danh sách thread |
| POST | `/api/forum/threads` | Tạo thread mới |

### 👥 Social Module
| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| POST | `/api/users/friends/add` | Thêm bạn |
| GET | `/api/users/friends` | Lấy danh sách bạn |
| GET | `/api/users/{userId}/followers` | Lấy followers |

---

## ✨ Tính năng chính đã test

✅ Backend biên dịch 100% không lỗi
✅ Lombok annotations hoạt động
✅ Dependency injection hoạt động
✅ JWT authentication sẵn sàng
✅ Database schema đã thiết lập
✅ Frontend dev server chạy
✅ CORS configuration done

---

## 📱 Tiếp theo

1. ✅ Test backend API endpoints
2. ✅ Test frontend registration/login
3. ⏳ Test Q&A module (create question, answer, comment)
4. ⏳ Test Real-time WebSocket (notifications)
5. ⏳ Test file upload (avatars, documents)
6. ⏳ Performance testing với nhiều users

---

**Chúc bạn test thành công! 🚀**

Nếu gặp vấn đề, kiểm tra:
- Console logs của backend
- Browser DevTools (F12)
- Network tab để xem API calls
