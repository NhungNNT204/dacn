# 🔧 KHẮC PHỤC LỖI MAVEN - SPRING BOOT

## ❌ Lỗi bạn gặp phải

```
[ERROR] Could not find goal 'run.' in plugin org.springframework.boot:spring-boot-maven-plugin:3.5.0
```

## 🎯 Nguyên nhân

Bạn đã chạy lệnh với **dấu chấm (.) thừa** ở cuối:

```powershell
# SAI ❌
.\mvnw.cmd spring-boot:run.
                          ^ dấu chấm thừa

# ĐÚNG ✅
.\mvnw.cmd spring-boot:run
```

---

## ✅ CÁCH SỬA - 3 PHƯƠNG ÁN

### Phương án 1: Chạy file .bat (DỄ NHẤT)

```powershell
# Từ thư mục gốc project (N:\DACN\upnestedu)
.\START_BACKEND.bat
```

### Phương án 2: Chạy lệnh trực tiếp (PowerShell)

```powershell
# Bước 1: Vào thư mục edu
cd edu

# Bước 2: Chạy Spring Boot (KHÔNG CÓ DẤU CHẤM)
.\mvnw.cmd spring-boot:run
```

### Phương án 3: Chạy lệnh trực tiếp (CMD)

```cmd
cd edu
mvnw.cmd spring-boot:run
```

---

## 🚨 Các lỗi phổ biến khác

### Lỗi 1: `mvnw.cmd: command not found`

**Nguyên nhân:** Bạn đang ở sai thư mục

**Giải pháp:**
```powershell
# Kiểm tra thư mục hiện tại
pwd

# Phải thấy: N:\DACN\upnestedu\edu
# Nếu không đúng, cd vào đúng thư mục
cd N:\DACN\upnestedu\edu
```

### Lỗi 2: `Port 8080 already in use`

**Nguyên nhân:** Backend đang chạy rồi

**Giải pháp:**
```powershell
# Tìm process đang chạy trên port 8080
netstat -ano | findstr :8080

# Kill process (thay PID bằng số PID từ lệnh trên)
taskkill /PID <PID> /F

# Hoặc restart máy
```

### Lỗi 3: `Java version mismatch`

**Nguyên nhân:** Java version không đúng (cần Java 17+)

**Giải pháp:**
```powershell
# Kiểm tra Java version
java -version

# Nếu < 17, download Java 17 tại:
# https://www.oracle.com/java/technologies/downloads/#java17
```

### Lỗi 4: `Cannot connect to database`

**Nguyên nhân:** MySQL/PostgreSQL chưa chạy

**Giải pháp:**
```powershell
# MySQL
net start MySQL80

# PostgreSQL
net start postgresql-x64-14

# Hoặc mở XAMPP/MySQL Workbench
```

---

## 📝 Checklist khởi động backend

- [ ] Đã vào đúng thư mục `edu/`
- [ ] File `mvnw.cmd` tồn tại
- [ ] Java 17+ đã cài đặt
- [ ] Database (MySQL/PostgreSQL) đang chạy
- [ ] Port 8080 chưa bị chiếm
- [ ] Lệnh chạy: `.\mvnw.cmd spring-boot:run` (KHÔNG có dấu chấm)

---

## ✅ Khi backend khởi động thành công

Bạn sẽ thấy:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::               (v3.5.0)

...
...
Started UpNestEduApplication in 15.234 seconds
```

**Lúc này:**
- Backend đang chạy tại: `http://localhost:8080`
- API sẵn sàng nhận request
- Frontend có thể kết nối được

---

## 🧪 Test backend đã chạy chưa

### Cách 1: Dùng trình duyệt
Mở: `http://localhost:8080/actuator/health`

Kết quả mong đợi:
```json
{"status":"UP"}
```

### Cách 2: Dùng PowerShell
```powershell
curl http://localhost:8080/actuator/health
```

### Cách 3: Dùng Postman
```
GET http://localhost:8080/api/v1/auth/test
```

---

## 📞 Nếu vẫn bị lỗi

1. Chụp màn hình **toàn bộ lỗi**
2. Copy nội dung trong file `edu/logs/spring-boot.log` (nếu có)
3. Gửi lại để tôi hỗ trợ cụ thể hơn

---

**LƯU Ý:** Sau khi backend chạy thành công, **KHÔNG TẮT** terminal/PowerShell đó. Mở terminal mới để chạy frontend.

```powershell
# Terminal 1: Backend (GIỮ NGUYÊN)
cd edu
.\mvnw.cmd spring-boot:run

# Terminal 2: Frontend (MỞ MỚI)
cd upnest-web
npm run dev
```

---

## 🎉 Tóm tắt

✅ Lỗi của bạn: Dấu chấm thừa trong lệnh  
✅ Sửa: Bỏ dấu chấm → `.\mvnw.cmd spring-boot:run`  
✅ Hoặc chạy: `.\START_BACKEND.bat`  

**Chúc bạn thành công!** 🚀

