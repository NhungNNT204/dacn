# 🚀 HƯỚNG DẪN CHẠY THỬ VÀ TEST PROJECT UpNestEdu

## 📋 Mục Lục
1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cài Đặt Database](#cài-đặt-database)
3. [Cấu Hình Backend](#cấu-hình-backend)
4. [Chạy Backend](#chạy-backend)
5. [Chạy Frontend](#chạy-frontend)
6. [Test API với Postman/cURL](#test-api)
7. [Tài Khoản Test](#tài-khoản-test)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Yêu Cầu Hệ Thống

### Backend
- **Java**: JDK 21 hoặc cao hơn
- **Maven**: 3.8+ 
- **SQL Server**: 2019+ hoặc SQL Server Express
- **IDE**: IntelliJ IDEA / Eclipse / VS Code (knhungến nghị)

### Frontend
- **Node.js**: 18+ 
- **npm** hoặc **yarn**

### Kiểm tra cài đặt:
```bash
# Kiểm tra Java
java -version  # Phải >= 21

# Kiểm tra Maven
mvn -version  # Phải >= 3.8

# Kiểm tra Node.js
node -v  # Phải >= 18
npm -v
```

---

## 🗄️ Cài Đặt Database

### Bước 1: Tạo Database

1. Mở **SQL Server Management Studio (SSMS)** hoặc **Azure Data Studio**
2. Kết nối với SQL Server instance của bạn
3. Chạy script tạo database:

```sql
-- File: UpNestEdu.sql
CREATE DATABASE UpNestEdu;
```

Hoặc chạy trực tiếp trong terminal:
```bash
sqlcmd -S localhost -U sa -P "your_password" -Q "CREATE DATABASE UpNestEdu"
```

### Bước 2: Chạy Schema Scripts

Chạy các file schema theo thứ tự:

1. **User Management Schema** (nếu dùng module user riêng):
```bash
sqlcmd -S localhost -U sa -P "your_password" -d UpNestEdu -i UpNestEdu-User-Schema.sql
```

2. **QA Module Schema**:
```bash
sqlcmd -S localhost -U sa -P "your_password" -d UpNestEdu -i UpNestEdu-QA-Schema.sql
```

**Lưu ý**: Nếu bạn dùng `ddl-auto: update` trong `application.yml`, Spring Boot sẽ tự động tạo các bảng khi chạy lần đầu. Tuy nhiên, knhungến nghị chạy schema scripts để đảm bảo đúng cấu trúc.

### Bước 3: Kiểm tra Database

```sql
USE UpNestEdu;
SELECT name FROM sys.tables;
-- Phải thấy các bảng: app_users, courses, forum_categories, study_groups, questions, etc.
```

---

## ⚙️ Cấu Hình Backend

### Bước 1: Cập nhật `application.yml`

Mở file: `edu/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=UpNestEdu;encrypt=true;trustServerCertificate=true;
    username: sa                    # ⚠️ SỬA THÀNH USERNAME SQL CỦA BẠN
    password: your_password         # ⚠️ SỬA THÀNH PASSWORD SQL CỦA BẠN
```

**Lưu ý quan trọng**:
- Nếu SQL Server chạy trên cổng khác, sửa `1433` thành cổng của bạn
- Nếu dùng SQL Server Express, thường là `localhost\SQLEXPRESS`
- Nếu dùng Azure SQL, sửa URL connection string

### Bước 2: Kiểm tra JWT Secret Key

File `application.yml` đã có secret key mặc định, bạn có thể giữ nguyên hoặc thay đổi:

```yaml
application:
  security:
    jwt:
      secret-key: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
      expiration: 86400000  # 1 ngày (milliseconds)
```

---

## 🏃 Chạy Backend

### Cách 1: Chạy bằng Maven (Knhungến nghị)

```bash
# Di cnhungển vào thư mục backend
cd edu

# Build project
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

### Cách 2: Chạy bằng IDE

1. Mở project trong **IntelliJ IDEA**
2. Tìm file `EduApplication.java`
3. Click chuột phải → **Run 'EduApplication'**

### Cách 3: Chạy JAR file

```bash
cd edu
mvn clean package
java -jar target/edu-0.0.1-SNAPSHOT.jar
```

### Kiểm tra Backend đã chạy:

1. Mở browser: `http://localhost:8080`
2. Hoặc test endpoint: `http://localhost:8080/api/v1/courses`
3. Xem console log, phải thấy:
   ```
   >>> Đã tạo tài khoản ADMIN (2FA ON): admin@upnest.edu
   >>> Đã tạo tài khoản STUDENT (2FA OFF): student@upnest.edu
   >>> Đã tạo tài khoản TEACHER: teacher@upnest.edu
   >>> Đã sinh dữ liệu...
   ```

**Backend chạy thành công khi thấy:**
```
Started EduApplication in X.XXX seconds
```

---

## 🎨 Chạy Frontend

### Bước 1: Cài đặt dependencies

```bash
# Di cnhungển vào thư mục frontend
cd upnest-web

# Cài đặt packages
npm install
```

### Bước 2: Chạy development server

```bash
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173**

### Kiểm tra Frontend:

- Mở browser: `http://localhost:5173`
- Phải thấy trang Login

---

## 🧪 Test API

### Tài Khoản Test (Tự động tạo bởi DataSeeder)

| Email | Password | Role | 2FA |
|-------|----------|------|-----|
| `admin@upnest.edu` | `123456` | ADMIN | ✅ ON (Secret: `JBSWY3DPEHPK3PXP`) |
| `student@upnest.edu` | `123456` | STUDENT | ❌ OFF |
| `teacher@upnest.edu` | `123456` | TEACHER | ❌ OFF |
| `alice@upnest.edu` | `123456` | STUDENT | ❌ OFF |
| `bob@upnest.edu` | `123456` | STUDENT | ❌ OFF |

### Test với cURL

#### 1. Test Login (Không 2FA)

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@upnest.edu",
    "password": "123456"
  }'
```

**Response thành công:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "fullName": "Nguyễn Văn nhung",
  "email": "student@upnest.edu",
  "role": "STUDENT",
  "is2faRequired": false
}
```

**Lưu token để dùng cho các request sau:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### 2. Test Login với 2FA (Admin)

```bash
# Bước 1: Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@upnest.edu",
    "password": "123456"
  }'

# Response sẽ có is2faRequired: true
# Lấy mã OTP từ Google Authenticator (Secret: JBSWY3DPEHPK3PXP)

# Bước 2: Verify OTP
curl -X POST http://localhost:8080/api/v1/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@upnest.edu",
    "code": "123456"
  }'
```

#### 3. Test Get Courses (Cần Token)

```bash
curl -X GET http://localhost:8080/api/v1/courses \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. Test Forum APIs

```bash
# Lấy danh mục forum
curl -X GET http://localhost:8080/api/v1/forum/categories \
  -H "Authorization: Bearer $TOKEN"

# Lấy threads theo category
curl -X GET http://localhost:8080/api/v1/forum/categories/1/threads \
  -H "Authorization: Bearer $TOKEN"

# Tạo thread mới
curl -X POST http://localhost:8080/api/v1/forum/threads \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "userId": 2,
    "title": "Câu hỏi test",
    "content": "Nội dung câu hỏi test"
  }'
```

#### 5. Test Study Groups APIs

```bash
# Lấy danh sách nhóm
curl -X GET http://localhost:8080/api/v1/groups \
  -H "Authorization: Bearer $TOKEN"

# Tham gia nhóm
curl -X POST "http://localhost:8080/api/v1/groups/1/join?userId=2" \
  -H "Authorization: Bearer $TOKEN"
```

#### 6. Test Social APIs

```bash
# Theo dõi user
curl -X POST http://localhost:8080/api/v1/social/friends/follow/3 \
  -H "Authorization: Bearer $TOKEN"

# Lấy danh sách đang theo dõi
curl -X GET http://localhost:8080/api/v1/social/friends/following \
  -H "Authorization: Bearer $TOKEN"

# Lấy activity feed
curl -X GET http://localhost:8080/api/v1/social/activities/friends/2 \
  -H "Authorization: Bearer $TOKEN"
```

#### 7. Test Q&A APIs

```bash
# Lấy danh sách câu hỏi
curl -X GET "http://localhost:8080/api/qa/questions?page=0&size=10" \
  -H "Authorization: Bearer $TOKEN"

# Tạo câu hỏi mới
curl -X POST http://localhost:8080/api/qa/questions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Câu hỏi test",
    "content": "Nội dung câu hỏi",
    "courseId": 1,
    "tags": "java,spring"
  }'
```

### Test với Postman

1. **Import Collection**: Tạo collection mới trong Postman
2. **Set Environment Variables**:
   - `base_url`: `http://localhost:8080`
   - `token`: (sẽ được set sau khi login)

3. **Test Flow**:
   - **Request 1**: Login → Lưu token vào variable
   - **Request 2**: Get Courses (dùng token)
   - **Request 3**: Get Forum Categories (dùng token)
   - ...

### Test với Browser (Frontend)

1. Mở `http://localhost:5173`
2. Đăng nhập với:
   - Email: `student@upnest.edu`
   - Password: `123456`
3. Test các tính năng:
   - Xem Profile
   - Cài đặt Privacy
   - Xem Forum
   - Xem Study Groups
   - Xem Activity Feed

---

## 🔍 Kiểm Tra Dữ Liệu Test

### Kiểm tra Users đã được tạo:

```sql
USE UpNestEdu;
SELECT id, email, full_name, role, is_2fa_enabled FROM app_users;
```

### Kiểm tra Study Groups:

```sql
SELECT * FROM study_groups;
SELECT * FROM group_memberships;
```

### Kiểm tra Forum:

```sql
SELECT * FROM forum_categories;
SELECT * FROM forum_threads;
```

### Kiểm tra Activities:

```sql
SELECT * FROM activities;
SELECT * FROM friendships;
```

---

## 🐛 Troubleshooting

### Lỗi 1: Không kết nối được Database

**Lỗi:**
```
com.microsoft.sqlserver.jdbc.SQLServerException: The TCP/IP connection to the host has failed
```

**Giải pháp:**
1. Kiểm tra SQL Server đã chạy chưa:
   ```bash
   # Windows
   services.msc → Tìm "SQL Server (MSSQLSERVER)"
   
   # Hoặc PowerShell
   Get-Service | Where-Object {$_.Name -like "*SQL*"}
   ```

2. Kiểm tra SQL Server Browser đã bật chưa
3. Kiểm tra firewall có chặn cổng 1433 không
4. Kiểm tra connection string trong `application.yml`

### Lỗi 2: "Table doesn't exist"

**Lỗi:**
```
Table 'app_users' doesn't exist
```

**Giải pháp:**
1. Chạy lại schema scripts
2. Hoặc set `ddl-auto: update` trong `application.yml` và restart
3. Kiểm tra database name đúng chưa

### Lỗi 3: "Invalid token" hoặc 403 Forbidden

**Lỗi:**
```
403 Forbidden
```

**Giải pháp:**
1. Kiểm tra token có được gửi trong header:
   ```
   Authorization: Bearer <token>
   ```
2. Token có thể đã hết hạn, login lại để lấy token mới
3. Kiểm tra CORS config trong `SecurityConfig.java`

### Lỗi 4: Port 8080 đã được sử dụng

**Lỗi:**
```
Port 8080 is already in use
```

**Giải pháp:**
1. Tìm process đang dùng port 8080:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   
   # Kill process
   taskkill /PID <PID> /F
   ```

2. Hoặc đổi port trong `application.yml`:
   ```yaml
   server:
     port: 8081
   ```

### Lỗi 5: Frontend không kết nối được Backend

**Lỗi:**
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Giải pháp:**
1. Kiểm tra CORS config trong `SecurityConfig.java`
2. Đảm bảo frontend chạy đúng port (5173)
3. Kiểm tra `CorsConfig.java` nếu có

### Lỗi 6: 2FA không hoạt động

**Lỗi:**
```
Mã OTP không đúng
```

**Giải pháp:**
1. Kiểm tra secret key trong database:
   ```sql
   SELECT email, two_factor_secret FROM app_users WHERE email = 'admin@upnest.edu';
   ```
2. Đảm bảo secret key trong Google Authenticator khớp với database
3. Kiểm tra thời gian server có đúng không (OTP phụ thuộc vào time)

### Lỗi 7: Maven build fail

**Lỗi:**
```
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin
```

**Giải pháp:**
1. Kiểm tra Java version:
   ```bash
   java -version  # Phải >= 21
   ```
2. Set JAVA_HOME:
   ```bash
   # Windows
   set JAVA_HOME=C:\Program Files\Java\jdk-21
   ```
3. Clean và rebuild:
   ```bash
   mvn clean install -U
   ```

---

## 📊 Kiểm Tra Logs

### Backend Logs

Xem logs trong console khi chạy Spring Boot. Các log quan trọng:

```
>>> Đã tạo tài khoản ADMIN (2FA ON): admin@upnest.edu
>>> Đã tạo tài khoản STUDENT (2FA OFF): student@upnest.edu
>>> Đã sinh dữ liệu nhóm học mẫu (Study Groups)
>>> Đã sinh dữ liệu diễn đàn hỏi đáp (Forum)
```

### SQL Logs

Nếu `show-sql: true` trong `application.yml`, bạn sẽ thấy các câu SQL được thực thi.

### Frontend Logs

Mở **Browser DevTools** (F12) → **Console** để xem logs.

---

## ✅ Checklist Test

- [ ] Database đã được tạo và kết nối thành công
- [ ] Backend chạy trên port 8080
- [ ] Frontend chạy trên port 5173
- [ ] Login thành công với student@upnest.edu
- [ ] Login với 2FA thành công (admin@upnest.edu)
- [ ] Get courses API hoạt động
- [ ] Forum APIs hoạt động
- [ ] Study Groups APIs hoạt động
- [ ] Social APIs hoạt động
- [ ] Q&A APIs hoạt động
- [ ] Frontend có thể gọi API thành công

---

## 🎯 Test Scenarios

### Scenario 1: User Flow Cơ Bản
1. Đăng ký tài khoản mới
2. Đăng nhập
3. Xem profile
4. Cập nhật profile
5. Cài đặt privacy

### Scenario 2: Forum Flow
1. Xem danh mục forum
2. Tạo thread mới
3. Trả lời thread
4. Vote câu trả lời
5. Đánh dấu best answer

### Scenario 3: Study Group Flow
1. Xem danh sách nhóm
2. Tham gia nhóm
3. Đăng bài trong nhóm
4. Bình luận bài đăng
5. Like bài đăng

### Scenario 4: Social Flow
1. Theo dõi user khác
2. Xem activity feed
3. Like activity
4. Comment activity

### Scenario 5: Q&A Flow
1. Tạo câu hỏi
2. Trả lời câu hỏi
3. Like/Dislike
4. Bình luận
5. Đặt best answer

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Logs trong console
2. Database connection
3. Port conflicts
4. CORS configuration
5. JWT token validity

**Chúc bạn test thành công! 🎉**
