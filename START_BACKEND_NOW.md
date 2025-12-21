# ⚡ KHỞI ĐỘNG BACKEND NGAY BÂY GIỜ

## 🚨 LỖI HIỆN TẠI
```
ERR_CONNECTION_REFUSED
```
**Nguyên nhân:** Backend chưa được khởi động

---

## ✅ GIẢI PHÁP - CHỌN 1 CÁCH:

### ⭐ CÁCH 1: Double-click Script (Dễ nhất)

1. **Double-click** vào file: `KHOI_DONG_BACKEND.bat`
2. Đợi cửa sổ Terminal hiện ra
3. Đợi thấy dòng: `Started EduApplication` (30-60 giây)
4. **GIỮ cửa sổ Terminal MỞ** (đừng đóng!)
5. Quay lại browser và thử đăng nhập lại ✅

---

### 📝 CÁCH 2: Dùng PowerShell/Terminal

1. **Mở PowerShell mới** (không đóng cửa sổ hiện tại)
2. Gõ các lệnh sau:

```powershell
cd N:\DACN\upnestedu\edu
.\mvnw.cmd spring-boot:run
```

3. Đợi thấy: `Started EduApplication`
4. **GIỮ cửa sổ PowerShell MỞ**
5. Quay lại browser và thử đăng nhập lại ✅

---

## ✅ KIỂM TRA BACKEND ĐÃ CHẠY

Mở browser và truy cập:
```
http://localhost:8080/api/v1/auth/login
```

**Nếu thấy:**
- ✅ Lỗi `405 Method Not Allowed` hoặc response JSON → Backend đang chạy!
- ❌ `ERR_CONNECTION_REFUSED` → Backend chưa chạy, kiểm tra lại Terminal

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Backend phải chạy TRƯỚC khi đăng nhập**
2. **KHÔNG ĐÓNG cửa sổ Terminal** - Nếu đóng, backend sẽ dừng
3. **Nếu muốn chạy background:** Dùng IntelliJ IDEA để chạy `EduApplication.java`

---

## 🎯 SAU KHI BACKEND CHẠY

1. ✅ Quay lại trang đăng nhập
2. ✅ Thử đăng nhập lại
3. ✅ Lỗi sẽ biến mất!

---

## ❓ VẪN GẶP LỖI?

Xem file `HUONG_DAN_KHOI_DONG_BACKEND.md` để biết cách xử lý các lỗi khác.

