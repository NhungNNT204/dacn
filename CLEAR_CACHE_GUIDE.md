# 🔄 HƯỚNG DẪN XÓA CACHE VÀ XEM GIAO DIỆN MỚI

## ⚠️ VẤN ĐỀ: Giao diện vẫn hiển thị cũ sau khi sửa code

Nếu bạn vẫn thấy giao diện cũ sau khi đã sửa code, đây là cách khắc phục:

---

## 🔧 CÁCH 1: Hard Refresh Browser (NHANH NHẤT)

### Windows:
- **Chrome/Edge**: `Ctrl + Shift + R` hoặc `Ctrl + F5`
- **Firefox**: `Ctrl + Shift + R` hoặc `Ctrl + F5`

### Mac:
- **Chrome/Edge**: `Cmd + Shift + R`
- **Firefox**: `Cmd + Shift + R`

---

## 🔧 CÁCH 2: Xóa Cache qua DevTools

1. Mở **Developer Tools** (F12)
2. **Right-click** vào nút **Refresh** (ở góc trên bên trái)
3. Chọn **"Empty Cache and Hard Reload"**

---

## 🔧 CÁCH 3: Xóa Cache thủ công

### Chrome/Edge:
1. Mở DevTools (F12)
2. Tab **Application** (hoặc **Storage**)
3. Click **Clear storage** → **Clear site data**
4. Refresh trang (F5)

### Firefox:
1. Mở DevTools (F12)
2. Tab **Storage**
3. Right-click → **Delete All**
4. Refresh trang (F5)

---

## 🔧 CÁCH 4: Restart Dev Server

Nếu vẫn không được, restart dev server:

```bash
# Dừng server hiện tại (Ctrl + C trong terminal)
# Sau đó chạy lại:
cd upnest-web
npm run dev
```

---

## 🔧 CÁCH 5: Xóa node_modules và cài lại (Nếu cần)

```bash
cd upnest-web
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

---

## ✅ KIỂM TRA THAY ĐỔI ĐÃ ÁP DỤNG

Sau khi refresh, bạn sẽ thấy:

1. **Sidebar**:
   - Gradient background (trắng → xám nhạt)
   - Border radius 20px
   - Shadow đẹp hơn

2. **Icon Wrapper**:
   - Kích thước 44x44px (lớn hơn)
   - Gradient xanh dương → tím
   - Border và shadow

3. **Nav Items**:
   - Active state: gradient tím khi đang ở trang đó
   - Hover: dịch cnhungển sang phải, shadow

4. **Avatar**:
   - 60px (lớn hơn)
   - Border trắng 3px
   - Shadow đẹp
   - Ảnh từ Google Drive

5. **Badge**:
   - Animation pulse
   - Gradient đỏ

---

## 🐛 NẾU VẪN KHÔNG ĐƯỢC

1. Kiểm tra Console (F12) xem có lỗi không
2. Kiểm tra Network tab xem CSS file có được load không
3. Thử mở trang trong **Incognito/Private mode**
4. Thử browser khác (Chrome, Firefox, Edge)

---

## 📝 LƯU Ý

- **Vite** tự động reload khi code thay đổi, nhưng đôi khi cần hard refresh
- **Browser cache** có thể giữ CSS cũ trong vài phút
- **Service Worker** (nếu có) cũng có thể cache, cần clear

---

**Chúc bạn thành công!** 🚀

