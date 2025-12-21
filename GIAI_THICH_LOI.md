# 🔍 GIẢI THÍCH LỖI - UpNestEdu

## 📋 TÓM TẮT CÁC LỖI

### ❌ Lỗi 1: Extension Trình Duyệt (Weava) - **KHÔNG ẢNH HƯỞNG**

```
TypeError: Cannot read properties of null (reading 'data')
at content.js:2:551216
```

**Giải thích:**
- Đây là lỗi từ **extension trình duyệt Weava**, không phải lỗi của ứng dụng UpNestEdu
- Extension này đang cố đọc dữ liệu từ một object `null`
- Lỗi này **KHÔNG ảnh hưởng** đến chức năng của ứng dụng

**Cách xử lý:**
- ✅ **Bỏ qua** - Lỗi này không ảnh hưởng đến ứng dụng
- Hoặc **tắt extension Weava** trong trình duyệt nếu muốn

---

### ❌ Lỗi 2: Backend Không Chạy - **LỖI CHÍNH**

```
POST http://localhost:8080/api/v1/auth/login net::ERR_CONNECTION_REFUSED
```

**Giải thích:**
- Frontend đang cố gọi API đến `http://localhost:8080/api/v1/auth/login`
- Nhưng **backend Spring Boot không chạy** hoặc không lắng nghe trên port 8080
- Browser không thể kết nối đến server → `ERR_CONNECTION_REFUSED`

**Nguyên nhân có thể:**
1. ❌ Backend chưa được khởi động
2. ❌ Backend đã crash hoặc dừng
3. ❌ Port 8080 đã bị ứng dụng khác sử dụng
4. ❌ Database chưa được cấu hình hoặc không kết nối được

---

## ✅ CÁCH SỬA LỖI

### Bước 1: Kiểm Tra Backend Có Đang Chạy Không

Mở trình duyệt và truy cập:
```
http://localhost:8080/actuator/health
```

**Nếu thấy:**
- ✅ `{"status":"UP"}` → Backend đang chạy
- ❌ `ERR_CONNECTION_REFUSED` → Backend không chạy

---

### Bước 2: Khởi Động Backend

#### Cách 1: Dùng Maven Wrapper (Khuyên dùng)

Mở **Terminal/PowerShell** và chạy:

```powershell
# Di chuyển vào thư mục backend
cd edu

# Chạy backend
.\mvnw.cmd spring-boot:run
```

**Hoặc dùng script có sẵn:**
```powershell
cd edu
.\run.bat
```

#### Cách 2: Dùng Maven (nếu đã cài)

```powershell
cd edu
mvn spring-boot:run
```

#### Cách 3: Dùng IDE (IntelliJ IDEA / Eclipse)

1. Mở project trong IDE
2. Tìm file `EduApplication.java` trong `edu/src/main/java/com/upnest/edu/`
3. Click chuột phải → **Run 'EduApplication'**

---

### Bước 3: Kiểm Tra Log Backend

Sau khi chạy backend, bạn sẽ thấy log như sau:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.x.x)

>>> Starting EduApplication...
>>> Database connection successful
>>> Server started on port 8080
```

**Nếu thấy lỗi:**
- ❌ Database connection failed → Kiểm tra cấu hình database trong `application.yml`
- ❌ Port 8080 already in use → Đổi port hoặc tắt ứng dụng đang dùng port 8080

---

### Bước 4: Kiểm Tra Cấu Hình Database

Mở file: `edu/src/main/resources/application.yml`

Đảm bảo cấu hình đúng:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/upnestedu
    username: root
    password: your_password
```

**Lưu ý:**
- Thay `your_password` bằng mật khẩu MySQL của bạn
- Đảm bảo database `upnestedu` đã được tạo

---

### Bước 5: Kiểm Tra Lại Frontend

Sau khi backend chạy thành công:

1. ✅ Backend chạy tại: `http://localhost:8080`
2. ✅ Frontend chạy tại: `http://localhost:5173`
3. ✅ Thử đăng nhập lại

---

## 🎯 CHECKLIST KHẮC PHỤC

- [ ] Backend đã được khởi động (`mvn spring-boot:run`)
- [ ] Backend chạy thành công (thấy log "Started EduApplication")
- [ ] Database đã được cấu hình đúng
- [ ] Database đã được tạo và kết nối được
- [ ] Port 8080 không bị ứng dụng khác chiếm
- [ ] Frontend đang chạy (`npm run dev`)
- [ ] Thử truy cập `http://localhost:8080/actuator/health` → Thấy `{"status":"UP"}`

---

## 📞 NẾU VẪN GẶP LỖI

### Lỗi Database Connection

```
Could not connect to database
```

**Giải pháp:**
1. Kiểm tra MySQL/PostgreSQL đang chạy
2. Kiểm tra username/password trong `application.yml`
3. Tạo database nếu chưa có: `CREATE DATABASE upnestedu;`

### Lỗi Port Đã Được Sử Dụng

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

### Lỗi Maven Không Tìm Thấy

```
'mvn' is not recognized
```

**Giải pháp:**
1. Dùng Maven Wrapper: `.\mvnw.cmd` thay vì `mvn`
2. Hoặc cài Maven và thêm vào PATH

---

## 📝 TÓM TẮT

**Lỗi chính:** Backend không chạy → Không thể kết nối đến `http://localhost:8080`

**Giải pháp nhanh nhất:**
1. **Double-click** vào file `KHOI_DONG_BACKEND.bat` (ở thư mục gốc)
2. Đợi backend khởi động (30-60 giây)
3. Thấy log `Started EduApplication` → Backend đã sẵn sàng!

**Hoặc dùng lệnh:**
```powershell
cd edu
.\mvnw.cmd spring-boot:run
```

**Kiểm tra:** Truy cập `http://localhost:8080/actuator/health` → Phải thấy `{"status":"UP"}`

**Xem thêm:** File `HUONG_DAN_KHOI_DONG_BACKEND.md` để biết chi tiết

