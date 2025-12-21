# Hướng dẫn Start Backend Server

## ⚠️ Vấn đề hiện tại
Backend chưa chạy, frontend báo lỗi `ERR_CONNECTION_REFUSED` vì không thể kết nối đến `http://localhost:8080`.

## 🔧 Cách Start Backend

### Bước 1: Dọn dẹp các Java process cũ (nếu cần)

```powershell
# Tìm các Java process
Get-Process | Where-Object { $_.ProcessName -like "*java*" }

# Kill tất cả Java process (cẩn thận!)
Stop-Process -Name "java" -Force
```

### Bước 2: Start Backend

Mở **terminal/PowerShell mới** và chạy:

```powershell
cd N:\DACN\upnestedu\edu
.\mvnw.cmd spring-boot:run
```

### Bước 3: Đợi Backend khởi động

Quan sát log, bạn sẽ thấy:
- ✅ **Thành công:** `Started EduApplication in X.XXX seconds`
- ❌ **Lỗi:** Sẽ có thông báo lỗi chi tiết

Thời gian khởi động thường: **30-60 giây**

### Bước 4: Kiểm tra Backend đã chạy

Sau khi thấy `Started EduApplication`, kiểm tra:

```powershell
# Kiểm tra port 8080
netstat -ano | Select-String ":8080" | Select-String "LISTENING"

# Hoặc mở browser và truy cập:
# http://localhost:8080
```

## 🐛 Các lỗi thường gặp

### Lỗi 1: Port 8080 đã bị chiếm

```powershell
# Tìm process đang dùng port 8080
netstat -ano | findstr :8080

# Kill process đó (thay <PID> bằng số bạn tìm thấy)
taskkill /PID <PID> /F
```

### Lỗi 2: Database connection failed

Kiểm tra file `edu/src/main/resources/application.yml`:
- Đảm bảo database đã được tạo
- Đảm bảo username/password đúng
- Đảm bảo database server đang chạy

### Lỗi 3: Compilation errors

Nếu có lỗi compile, backend sẽ không start được. Cần fix lỗi trước.

## ✅ Sau khi Backend chạy thành công

Frontend sẽ tự động kết nối và các tính năng sẽ hoạt động:
- ✅ Đăng bài với content moderation
- ✅ Like/Comment/Share
- ✅ Hide/Delete/Report
- ✅ Tất cả API endpoints

## 📝 Lưu ý

- Backend phải chạy **trước** khi test frontend
- Backend cần **database đã được tạo và đang chạy**
- Backend cần **compile thành công** (BUILD SUCCESS)

