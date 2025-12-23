# 🔧 GIẢI THÍCH LỖI DEV TOOL - UPNEST EDU

## 🔴 LỖI CHÍNH: `ERR_CONNECTION_REFUSED`

### Lỗi hiển thị:
```
POST http://localhost:8080/api/v1/auth/login net::ERR_CONNECTION_REFUSED
Login error: Error: Không thể kết nối đến server...
```

### ✅ Nguyên nhân:
**Backend Spring Boot chưa chạy** trên `http://localhost:8080`

### ✅ Cách fix:

#### **Cách 1: Double-click file .bat (NHANH NHẤT)**
1. Vào thư mục: `N:\DACN\upnestedu\edu\`
2. **Double-click**: `KHOI_DONG_BACKEND.bat`
3. Đợi thấy dòng: `Started EduApplication`
4. ✅ Xong!

#### **Cách 2: Chạy bằng Terminal**
```powershell
cd edu
.\mvnw.cmd spring-boot:run
```

⚠️ **CHÚ Ý:** Không gõ dấu chấm ở cuối!
- ❌ SAI: `spring-boot:run.`
- ✅ ĐÚNG: `spring-boot:run`

---

## ⚠️ LỖI PHỤ: `content.js` Error (KHÔNG QUAN TRỌNG)

### Lỗi hiển thị:
```
content.js:2 http:error TypeError: Cannot read properties of null (reading 'data')
content.js:2 content/content.js -> error:: TypeError...
```

### ✅ Nguyên nhân:
Đây là lỗi từ **extension trình duyệt** (React DevTools, Grammarly, hoặc extension khác), **KHÔNG PHẢI** từ code của bạn.

### ✅ Cách fix:
**KHÔNG CẦN FIX!** Lỗi này không ảnh hưởng gì đến app của bạn.

Nếu muốn tắt:
1. Mở Chrome Extensions: `chrome://extensions/`
2. Tắt từng extension để tìm thủ phạm
3. (Thường là React DevTools hoặc Grammarly)

---

## 📊 BẢNG TỔNG HỢP LỖI DEV TOOL

| Lỗi | Nguyên nhân | Mức độ | Cách fix |
|-----|-------------|--------|----------|
| `ERR_CONNECTION_REFUSED` | Backend chưa chạy | 🔴 Nghiêm trọng | Chạy backend |
| `content.js error` | Extension trình duyệt | ⚠️ Không quan trọng | Bỏ qua |
| `Download React DevTools` | Chưa cài DevTools | ℹ️ Gợi ý | Cài hoặc bỏ qua |
| `404 Not Found` | API endpoint sai | 🔴 Nghiêm trọng | Kiểm tra URL |
| `401 Unauthorized` | Token hết hạn | 🟡 Cần fix | Đăng nhập lại |
| `CORS error` | Backend chưa config CORS | 🔴 Nghiêm trọng | Thêm `@CrossOrigin` |

---

## 🎯 CHECKLIST TRƯỚC KHI ĐĂNG NHẬP

- [ ] Backend đã chạy? (Terminal có dòng `Started EduApplication`)
- [ ] Frontend đã chạy? (Vite dev server đang chạy)
- [ ] Đã refresh lại trang login?
- [ ] Email/Password đúng?

---

## 🚀 TRẠNG THÁI HIỆN TẠI

### ✅ Đã khởi động:
- **Frontend:** `http://localhost:5177` (hoặc 5173/5174/...)
- **Backend:** `http://localhost:8080` (đang khởi động...)

### 🔄 Đợi backend khởi động:
```
⏳ Đang tải Spring Boot dependencies...
⏳ Khởi tạo database connections...
⏳ Khởi động Tomcat server...

✅ Started EduApplication in XX.XXX seconds  ← TÌM DÒNG NÀY!
```

**Thời gian chờ:** Thường 30-60 giây (lần đầu có thể đến 2-3 phút)

---

## 🆘 NẾU VẪN LỖI

### 1. Kiểm tra Port 8080 có bị chiếm không?
```powershell
netstat -ano | findstr :8080
```

Nếu có kết quả → Kill process:
```powershell
taskkill /PID [PID_NUMBER] /F
```

### 2. Kiểm tra Java đã cài chưa?
```powershell
java -version
```

Nếu chưa có → Cài Java 17+: https://adoptium.net/

### 3. Kiểm tra MySQL đã chạy chưa?
- Mở Services: `services.msc`
- Tìm "MySQL" → Start

### 4. Xem log chi tiết trong Terminal 3
- File: `c:\Users\Admin\.cursor\projects\n-DACN-upnestedu\terminals\3.txt`
- Tìm dòng `[ERROR]` để biết lỗi cụ thể

---

## 📞 HỖ TRỢ

**Nếu backend không khởi động được:**
1. Chụp màn hình Terminal 3
2. Tìm dòng `[ERROR]` cuối cùng
3. Share lỗi để được hỗ trợ

**Files hỗ trợ:**
- `HUONG_DAN_KHOI_DONG_NHANH.md` - Hướng dẫn chi tiết
- `KHAC_PHUC_LOI_MAVEN.md` - Fix lỗi Maven
- `ROADMAP_CHAT_COMPLETE.md` - Tổng kết tính năng

---

## 🎉 KẾT QUẢ MONG ĐỢI

**Sau khi backend khởi động xong:**

1. Terminal 3 hiển thị:
```
Started EduApplication in 45.123 seconds (JVM running for 48.567)
```

2. Refresh trang login

3. Nhập:
   - Email: `student@upnest.edu`
   - Password: `password123`

4. ✅ Đăng nhập thành công!

5. Lỗi `ERR_CONNECTION_REFUSED` **BIẾN MẤT**! 🎊

---

**Tạo bởi:** UpNest Edu Team  
**Ngày:** 2025-12-23  
**Version:** 1.0

