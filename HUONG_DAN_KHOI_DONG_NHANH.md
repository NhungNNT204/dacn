# 🚀 HƯỚNG DẪN KHỞI ĐỘNG BACKEND

## ✅ Cách 1: Double-click file .bat (DỄ NHẤT)

1. Mở Windows Explorer
2. Vào thư mục: `N:\DACN\upnestedu\edu\`
3. **Double-click** vào file: `KHOI_DONG_BACKEND.bat`
4. Đợi 30-60 giây
5. ✅ Xong! Backend đã chạy tại `http://localhost:8080`

---

## ✅ Cách 2: Chạy bằng Terminal

### Bước 1: Mở Terminal mới trong Cursor
- Nhấn: `Ctrl + Shift + ~` (hoặc menu Terminal → New Terminal)

### Bước 2: Chạy lệnh
```powershell
cd edu
.\mvnw.cmd spring-boot:run
```

**⚠️ CHÚ Ý:** 
- **KHÔNG** gõ dấu chấm ở cuối: ~~`spring-boot:run.`~~ ❌
- Phải gõ: `spring-boot:run` ✅

---

## 🎯 Kiểm tra Backend đã chạy chưa

Sau khi chạy xong, bạn sẽ thấy:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

[           main] c.u.e.EduApplication : Started EduApplication in 45.123 seconds
```

✅ Nếu thấy dòng `Started EduApplication` → Thành công!

---

## 🔧 Nếu vẫn lỗi

### Lỗi: Port 8080 đã được sử dụng
```powershell
# Tìm process đang chiếm port 8080
netstat -ano | findstr :8080

# Kill process (thay PID bằng số thực tế)
taskkill /PID 12345 /F
```

### Lỗi: Java không tìm thấy
- Cài Java JDK 17+: https://adoptium.net/
- Kiểm tra: `java -version`

---

## 📝 Tổng kết

**Frontend:** `http://localhost:5177` (đã chạy ✅)  
**Backend:** `http://localhost:8080` (cần chạy ⏳)

**Sau khi backend chạy:**
1. Refresh lại trang login
2. Đăng nhập bình thường
3. Lỗi `ERR_CONNECTION_REFUSED` sẽ biến mất! 🎉

