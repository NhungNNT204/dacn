# 🚀 QUICK START - Hệ Thống Q&A

## ✅ Đã triển khai xong

### Backend
- ✅ 7 tables (questions, answers, votes, comments, reactions)
- ✅ REST APIs đầy đủ
- ✅ WebSocket realtime
- ✅ Content moderation tự động
- ✅ Vote system
- ✅ Phân quyền

### Frontend
- ✅ UI component đầy đủ
- ✅ WebSocket integration
- ✅ Realtime updates
- ✅ Modern responsive design

## 🏃 Chạy ngay

### 1. Cài dependencies

```bash
# Backend đã có sẵn dependencies trong pom.xml
cd edu
.\mvnw.cmd clean install -DskipTests

# Frontend cần cài thêm WebSocket libs
cd upnest-web
npm install sockjs-client @stomp/stompjs
```

### 2. Import SQL seed data (Optional)

Chạy file `edu/QA_SEED_DATA.sql` trong SQL Server để có dữ liệu mẫu.

### 3. Khởi động

**Terminal 1 - Backend:**
```bash
cd edu
.\mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd upnest-web
npm run dev
```

### 4. Thêm route vào navigation

Sửa file `StudentLayout.jsx` để thêm link đến Q&A:

```jsx
<Link to="/qa" className="nav-item">
  <MessageSquare size={20} />
  <span>Hỏi Đáp</span>
</Link>
```

Thêm route vào `AppRoutes.jsx`:

```jsx
import QAPage from './pages/student/QAPage';

// Trong routes:
<Route path="/qa" element={<QAPage />} />
```

### 5. Test

1. Truy cập `http://localhost:5173`
2. Đăng nhập
3. Vào "Hỏi Đáp"
4. Tạo câu hỏi, vote, trả lời
5. Mở 2 tab để test realtime

## 📊 API Endpoints

**Base URL:** `http://localhost:8080/api/v1/qa`

### Questions
- `POST /questions` - Tạo câu hỏi
- `GET /questions` - Danh sách
- `GET /questions/{id}` - Chi tiết
- `POST /questions/{id}/upvote` - Upvote
- `POST /questions/{id}/downvote` - Downvote

### Answers
- `POST /answers` - Tạo trả lời
- `POST /answers/{id}/upvote` - Upvote
- `POST /answers/{id}/downvote` - Downvote

## 🌐 WebSocket

- Endpoint: `ws://localhost:8080/ws-qa`
- Topics: `/topic/questions/{id}`, `/topic/qa/new`

## 📖 Documentation

- `QA_IMPLEMENTATION_COMPLETE.md` - Chi tiết đầy đủ
- `QA_DATABASE_SCHEMA.md` - Database schema
- `QA_SEED_DATA.sql` - Dữ liệu mẫu

---

**Done!** Hệ thống Q&A đã sẵn sàng sử dụng 🎉

