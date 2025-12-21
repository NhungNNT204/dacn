# 🚀 HƯỚNG DẪN NHANH - CHẠY PROJECT UPNEST.EDU

## ⚡ BƯỚC 1: CÀI ĐẶT CÔNG CỤ CẦN THIẾT

### 1.1. Cài Node.js
- Tải từ: https://nodejs.org
- Chọn phiên bản LTS (v18 hoặc cao hơn)
- Cài đặt và kiểm tra: `node --version`

### 1.2. Cài Java JDK
- Tải JDK 17 từ: https://adoptium.net
- Cài đặt và kiểm tra: `java --version`

### 1.3. Cài Maven (cho Java)
- Tải từ: https://maven.apache.org
- Hoặc dùng: `choco install maven` (Windows) hoặc `brew install maven` (Mac)

### 1.4. Cài Database
- **MySQL**: https://dev.mysql.com/downloads/
- Hoặc **PostgreSQL**: https://www.postgresql.org/download/

---

## ⚙️ BƯỚC 2: CẤU HÌNH DATABASE

### 2.1. Tạo Database
```sql
-- Mở MySQL/PostgreSQL
CREATE DATABASE upnestedu;
```

### 2.2. Cấu hình trong Backend
Mở file: `edu/src/main/resources/application.properties`

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/upnestedu
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 🔧 BƯỚC 3: CHẠY BACKEND

```bash
# Di cnhungển vào thư mục backend
cd edu

# Build project (lần đầu tiên)
mvn clean install

# Chạy ứng dụng
mvn spring-boot:run
```

**Kết quả**: Backend chạy ở `http://localhost:8080`

**Kiểm tra**: Mở browser, vào `http://localhost:8080/api/v1/auth/login` (sẽ báo lỗi nhưng chứng tỏ server đã chạy)

---

## 📱 BƯỚC 4: CHẠY FRONTEND

```bash
# Mở terminal mới, di cnhungển vào thư mục frontend
cd upnest-web

# Cài đặt thư viện (chỉ cần chạy 1 lần)
npm install

# Chạy ứng dụng
npm run dev
```

**Kết quả**: Frontend chạy ở `http://localhost:5173`

**Kiểm tra**: Mở browser, vào `http://localhost:5173` → Sẽ thấy trang đăng nhập

---

## 🎯 BƯỚC 5: ĐĂNG NHẬP VÀ SỬ DỤNG

### 5.1. Tạo tài khoản
- Vào `/register`
- Điền thông tin và đăng ký

### 5.2. Đăng nhập
- Vào `/login`
- Nhập email và password
- Sau khi đăng nhập thành công, sẽ cnhungển đến `/dashboard`

### 5.3. Khám phá các tính năng
- **Góc học tập**: Xem lộ trình học tập cá nhân hóa
- **Khóa học của tôi**: Xem các khóa học đã đăng ký
- **Thư viện số**: Xem tài liệu, video
- **Cộng đồng**: Đăng bài, like, comment
- **Tin nhắn**: Chat với bạn bè
- **Thành tích**: Xem hồ sơ năng lực số
- **Định hướng sự nghiệp**: Chọn và xem lộ trình nghề nghiệp

---

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### ❌ Lỗi: "Cannot connect to database"
**Giải pháp:**
- Kiểm tra MySQL/PostgreSQL đã chạy chưa
- Kiểm tra username/password trong `application.properties`
- Kiểm tra database đã tạo chưa

### ❌ Lỗi: "Port 8080 already in use"
**Giải pháp:**
- Đổi port trong `application.properties`: `server.port=8081`
- Hoặc tắt ứng dụng đang dùng port 8080

### ❌ Lỗi: "Port 5173 already in use"
**Giải pháp:**
- Vite sẽ tự động đổi sang port khác (5174, 5175...)
- Hoặc đổi port trong `vite.config.js`

### ❌ Lỗi: "npm install failed"
**Giải pháp:**
- Xóa folder `node_modules` và file `package-lock.json`
- Chạy lại: `npm install`
- Hoặc dùng: `npm install --legacy-peer-deps`

### ❌ Lỗi: "Maven build failed"
**Giải pháp:**
- Kiểm tra Java version: `java --version` (phải >= 17)
- Xóa folder `target` và chạy lại: `mvn clean install`

---

## 📊 KIỂM TRA HỆ THỐNG ĐÃ CHẠY ĐÚNG

### ✅ Backend hoạt động:
- Terminal hiển thị: "Started Application in X seconds"
- Có thể truy cập: `http://localhost:8080`

### ✅ Frontend hoạt động:
- Terminal hiển thị: "Local: http://localhost:5173"
- Browser hiển thị trang đăng nhập

### ✅ Database kết nối:
- Backend log không có lỗi database
- Các bảng tự động được tạo khi chạy lần đầu

---

## 🎓 CÁC LỆNH HỮU ÍCH

### Frontend:
```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Xem production build
```

### Backend:
```bash
mvn spring-boot:run           # Chạy ứng dụng
mvn clean install              # Build project
mvn test                       # Chạy tests
```

---

## 🔍 DEBUG VÀ KIỂM TRA

### Xem logs Backend:
- Logs hiển thị trong terminal nơi chạy `mvn spring-boot:run`
- Tìm các dòng có "ERROR" hoặc "WARN"

### Xem logs Frontend:
- Mở Developer Tools trong browser (F12)
- Tab "Console" để xem lỗi JavaScript
- Tab "Network" để xem các API calls

### Kiểm tra API:
- Dùng Postman hoặc browser
- Test API: `GET http://localhost:8080/api/v1/career/paths`
- Cần thêm header: `Authorization: Bearer {token}`

---

## 📝 GHI CHÚ QUAN TRỌNG

1. **Luôn chạy Backend trước** khi chạy Frontend
2. **Database phải được tạo** trước khi chạy Backend
3. **Token JWT** được lưu trong localStorage của browser
4. **Hot reload**: Khi sửa code Frontend, browser tự động refresh
5. **Backend restart**: Khi sửa code Backend, cần restart server

---

## 🎉 HOÀN TẤT!

Bây giờ bạn đã có thể:
- ✅ Chạy được project
- ✅ Đăng nhập và sử dụng
- ✅ Khám phá các tính năng
- ✅ Bắt đầu phát triển tính năng mới

**Chúc bạn thành công!** 🚀
