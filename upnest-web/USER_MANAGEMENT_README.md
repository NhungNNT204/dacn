# 📚 UpNestEdu Frontend - User Management Module

## 📋 Tổng Quan

Frontend module cho quản lý người dùng trong UpNestEdu, được xây dựng bằng **React** + **Vite** + **Tailwind CSS**.

## ✨ Tính Năng Chính

### 1. **Xác thực (Authentication)**
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập bằng username/email
- ✅ Kiểm tra sẵn sàng username và email
- ✅ Ghi nhớ đăng nhập
- ✅ Xác thực Bearer Token

### 2. **Hồ Sơ Người Dùng (Profile)**
- ✅ Xem thông tin hồ sơ cá nhân
- ✅ Chỉnh sửa thông tin
- ✅ Upload ảnh đại diện
- ✅ Thông tin học tập (cnhungên ngành, trường, năm học)
- ✅ Thông tin cnhungên môn (bio, GitHub, LinkedIn)
- ✅ Giới tính, ngày sinh, địa chỉ

### 3. **Cài Đặt Quyền Riêng Tư (Privacy Settings)**
- ✅ Kiểm soát mức độ hiển thị hồ sơ (PUBLIC/ANYONE/FRIENDS_ONLY/PRIVATE)
- ✅ Hiển thị/ẩn email và số điện thoại
- ✅ Kiểm soát liên hệ từ ai (PUBLIC/FRIENDS_ONLY/PRIVATE)
- ✅ Kiểm soát hoạt động (hoạt động, danh sách bạn bè)
- ✅ Khả năng tìm kiếm được
- ✅ Thông báo (Email, Push)
- ✅ Đặt lại về mặc định

## 📁 Cấu Trúc Thư Mục

```
upnest-web/src/
├── pages/
│   ├── auth/
│   │   ├── Login.jsx           # Trang đăng nhập
│   │   ├── Login.css
│   │   ├── Register.jsx        # Trang đăng ký
│   │   └── Register.css
│   ├── profile/
│   │   ├── Profile.jsx         # Xem/chỉnh sửa hồ sơ
│   │   └── Profile.css
│   └── privacy/
│       ├── PrivacySettings.jsx # Cài đặt quyền riêng tư
│       └── PrivacySettings.css
├── components/
│   ├── Navigation.jsx          # Thanh điều hướng
│   └── Navigation.css
├── services/
│   └── userService.js          # API calls
├── context/
│   └── AuthContext.jsx         # Context authentication
├── routes/
│   ├── ProtectedRoute.jsx      # Route bảo vệ
│   └── AppRoutes.jsx           # Routes config
└── App.jsx
```

## 🚀 Installation & Setup

### 1. Cài Đặt Dependencies

```bash
cd upnest-web
npm install
```

### 2. Cấu Hình Backend URL

Mở [userService.js](src/services/userService.js) và cập nhật `API_BASE_URL`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

### 3. Chạy Dev Server

```bash
npm run dev
```

Server sẽ chạy tại `http://localhost:5173`

### 4. Build Production

```bash
npm run build
```

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/register              # Đăng ký
POST   /api/auth/login                 # Đăng nhập
GET    /api/auth/check-username        # Kiểm tra username
GET    /api/auth/check-email           # Kiểm tra email
```

### Profile
```
GET    /api/users/profile              # Lấy hồ sơ hiện tại
GET    /api/users/{userId}/profile     # Lấy hồ sơ user khác
PUT    /api/users/profile              # Cập nhật hồ sơ
POST   /api/users/profile/avatar       # Upload avatar
```

### Privacy Settings
```
GET    /api/users/privacy-settings            # Lấy cài đặt
PUT    /api/users/privacy-settings            # Cập nhật cài đặt
POST   /api/users/privacy-settings/reset      # Đặt lại
```

## 🎨 Styling

### Global Styles
- Font chính: Inter
- Màu chính: #667eea (Purple) + #764ba2 (Dark Purple)
- Responsive: Mobile-first approach

### Components Styling
Mỗi component có file CSS riêng theo chuẩn CSS Module.

## 🔐 Authentication Flow

1. **Register**: User điền form → Gọi API register → Lưu token → Redirect dashboard
2. **Login**: User nhập username + password → Gọi API login → Lưu token → Redirect dashboard
3. **Protected Routes**: Kiểm tra token trước khi render → Nếu không có token → Redirect login
4. **Token Storage**: Lưu `accessToken` và `refreshToken` trong localStorage

## 🛡️ Security Features

- ✅ Bearer Token Authentication
- ✅ Protected Routes (ProtectedRoute component)
- ✅ Automatic token headers
- ✅ CORS ready
- ✅ Password validation (min 6 chars, confirm password)
- ✅ Email validation

## 📦 Dependencies

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x"
}
```

## 🧪 Testing

### Manual Testing Steps

1. **Register**
   - Truy cập `/register`
   - Điền tất cả fields
   - Check username/email availability
   - Submit và check token trong localStorage

2. **Login**
   - Truy cập `/login`
   - Nhập credentials
   - Check token lưu trong localStorage
   - Redirect dashboard

3. **Profile**
   - Truy cập `/profile`
   - Xem thông tin
   - Click "Chỉnh sửa"
   - Update fields
   - Upload avatar
   - Save changes

4. **Privacy Settings**
   - Truy cập `/privacy-settings`
   - Toggle các settings
   - Change dropdowns
   - Click "Lưu Thay Đổi"
   - Click "Đặt Lại Về Mặc Định"

## 🐛 Troubleshooting

### Issue: "Cannot GET /api/users/profile"
**Solution**: Kiểm tra:
1. Backend đang chạy tại `http://localhost:8080`
2. API URL đúng trong `userService.js`
3. Token được gửi trong header

### Issue: "Token expired"
**Solution**: 
1. Login lại
2. Kiểm tra `accessToken` trong localStorage
3. Xóa token cũ: `localStorage.clear()`

### Issue: CORS Error
**Solution**: Kiểm tra Backend CORS config:
```java
// SecurityConfig.java
corsRegistry.addMapping("/api/**")
    .allowedOrigins("http://localhost:5173")
    .allowedMethods("GET", "POST", "PUT", "DELETE")
    .allowedHeaders("*")
    .allowCredentials(true)
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router v6](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [Backend API Docs](../edu/HELP.md)

## 👥 Team

- Frontend: React.js with Vite
- Backend: Spring Boot 3.3.5
- Database: SQL Server

## 📄 License

© 2024 UpNestEdu. All rights reserved.

---

**Last Updated**: $(date)
**Status**: ✅ Production Ready
