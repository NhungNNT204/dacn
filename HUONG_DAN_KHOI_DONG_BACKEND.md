# 🚀 HƯỚNG DẪN KHỞI ĐỘNG BACKEND

## ⚡ CÁCH NHANH NHẤT

### Cách 1: Dùng Script Có Sẵn (Khuyên dùng)

1. **Double-click** vào file: `KHOI_DONG_BACKEND.bat`
2. Đợi backend khởi động (khoảng 30-60 giây)
3. Khi thấy log `Started EduApplication` → Backend đã sẵn sàng! ✅

---

### Cách 2: Dùng Terminal/PowerShell

Mở **PowerShell** hoặc **Command Prompt**:

```powershell
cd edu
.\mvnw.cmd spring-boot:run
```

**Hoặc dùng script có sẵn:**
```powershell
cd edu
.\run.bat
```

---

## ✅ KIỂM TRA BACKEND ĐÃ CHẠY

### Cách 1: Kiểm tra trong Browser

Mở trình duyệt và truy cập:
```
http://localhost:8080/actuator/health
```

**Nếu thấy:**
- ✅ `{"status":"UP"}` → Backend đang chạy!
- ❌ `ERR_CONNECTION_REFUSED` → Backend chưa chạy

### Cách 2: Kiểm tra Port 8080

Trong PowerShell:
```powershell
netstat -ano | findstr :8080
```

**Nếu thấy kết quả** → Port đang được sử dụng (backend đang chạy)
**Nếu không thấy gì** → Backend chưa chạy

---

## 🔍 DẤU HIỆU BACKEND ĐÃ KHỞI ĐỘNG THÀNH CÔNG

Sau khi chạy lệnh khởi động, bạn sẽ thấy log như sau:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.x.x)

>>> Starting EduApplication...
>>> Hibernate: select ... (các câu lệnh SQL)
>>> Started EduApplication in X.XXX seconds
```

**Quan trọng:** Phải thấy dòng `Started EduApplication` → Backend đã sẵn sàng!

---

## ❌ XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi 1: Port 8080 đã được sử dụng

```
Port 8080 is already in use
```

**Giải pháp:**
1. Tìm process đang dùng port 8080:
   ```powershell
   netstat -ano | findstr :8080
   ```
2. Tắt process đó hoặc đổi port trong `application.yml`:
   ```yaml
   server:
     port: 8081
   ```

### Lỗi 2: Database connection failed

```
Could not connect to database
```

**Giải pháp:**
1. Kiểm tra SQL Server đang chạy
2. Kiểm tra thông tin trong `edu/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       username: your_username
       password: your_password
   ```
3. Đảm bảo database `UpNestEdu` đã được tạo

### Lỗi 3: Maven không tìm thấy

```
'mvn' is not recognized
```

**Giải pháp:**
- Dùng Maven Wrapper: `.\mvnw.cmd` thay vì `mvn`
- Script `KHOI_DONG_BACKEND.bat` sẽ tự động dùng Maven Wrapper

---

## 📝 LƯU Ý QUAN TRỌNG

1. **Backend phải chạy TRƯỚC khi mở frontend** để đăng nhập
2. **Để Terminal/PowerShell chạy backend MỞ** - Nếu đóng terminal, backend sẽ dừng
3. **Nếu muốn chạy backend ở background**, dùng IDE (IntelliJ IDEA) để chạy

---

## 🎯 SAU KHI BACKEND CHẠY

1. ✅ Backend chạy tại: `http://localhost:8080`
2. ✅ Frontend chạy tại: `http://localhost:5173`
3. ✅ Thử đăng nhập lại trong frontend

