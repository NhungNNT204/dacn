# 🔧 QUICK FIX - Lỗi Đăng Nhập

## ❌ Lỗi: `ERR_CONNECTION_REFUSED`

**Nguyên nhân:** Backend chưa chạy

---

## ✅ SỬA NGAY (3 bước):

### Bước 1: Khởi động Backend

**Option A - Dễ nhất:**
- Double-click: `KHOI_DONG_BACKEND.bat`

**Option B - Dùng Terminal:**
```powershell
cd edu
.\mvnw.cmd spring-boot:run
```

### Bước 2: Đợi Backend khởi động

Tìm dòng này trong Terminal:
```
Started EduApplication in X.XXX seconds
```

### Bước 3: Thử đăng nhập lại

Quay lại browser và đăng nhập lại ✅

---

**💡 TIP:** Giữ cửa sổ Terminal MỞ để backend tiếp tục chạy!

