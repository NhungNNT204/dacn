# Hướng dẫn cấu hình Gemini API

## ✅ API Key đã được cấu hình sẵn

API key đã được tích hợp sẵn trong code: `AIzaSyBhAC6gafl3I-VRiJDy44yxrwXayu0Njho`

Hệ thống sẽ tự động sử dụng API key này, không cần cấu hình thêm.

## Các cách cấu hình API Key (Nếu cần thay đổi)

### Cách 1: Sử dụng Environment Variable (Khuyến nghị cho production)

1. Tạo file `.env` trong thư mục `upnest-web/` (nếu chưa có)
2. Thêm dòng sau:
```env
VITE_GEMINI_API_KEY=AIzaSyBhAC6gafl3I-VRiJDy44yxrwXayu0Njho
```

3. Restart development server:
```bash
npm run dev
```

### Cách 2: Sử dụng localStorage (Tạm thời - Ưu tiên cao nhất)

Mở Developer Console (F12) và chạy:
```javascript
localStorage.setItem('gemini_api_key', 'AIzaSyBhAC6gafl3I-VRiJDy44yxrwXayu0Njho');
```

Sau đó refresh trang.

**Lưu ý:** localStorage có độ ưu tiên cao nhất, nếu set vào localStorage thì sẽ dùng key đó thay vì environment variable.

## Bước 3: Kiểm tra

1. Mở trang Career: http://localhost:5175/#/career/ba
2. Click vào button "Khám phá chặng này" ở chặng đang active
3. Nếu có API key, sẽ thấy loading "AI đang tạo lộ trình học tập cá nhân hóa..."
4. Nếu không có API key, hệ thống sẽ sử dụng fallback data (vẫn hoạt động bình thường)

## Lưu ý

- API key miễn phí có giới hạn requests (60 requests/phút)
- Fallback data vẫn cung cấp đầy đủ thông tin lộ trình học tập
- API key được lưu ở client-side, không gửi lên server

