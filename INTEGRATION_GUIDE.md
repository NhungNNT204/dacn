# 🔗 Hướng Dẫn Tích Hợp - Hệ Thống Cộng Đồng

## 📌 Bước 1: Tích Hợp Backend

### 1.1 Sao Chép Entity Classes

Sao chép tất cả các files từ `src/main/java/com/upnest/edu/modules/social/entity/` vào dự án:

```
edu/src/main/java/com/upnest/edu/modules/social/entity/
├── Friendship.java
├── FriendshipStatus.java
├── PostSave.java
├── PostShare.java
├── Post.java (đã tồn tại, cần update relationships)
├── PostComment.java (đã tồn tại)
├── PostReaction.java (đã tồn tại)
├── ReactionType.java
├── PostReport.java (đã tồn tại)
└── ReportType.java
```

### 1.2 Sao Chép Repository Interfaces

Sao chép tất cả các files từ `src/main/java/com/upnest/edu/modules/social/repository/`:

```
edu/src/main/java/com/upnest/edu/modules/social/repository/
├── FriendshipRepository.java
├── PostRepository.java
├── PostCommentRepository.java
├── PostReactionRepository.java
├── PostSaveRepository.java
├── PostShareRepository.java
└── PostReportRepository.java
```

### 1.3 Sao Chép Service Classes

Sao chép tất cả các files từ `src/main/java/com/upnest/edu/modules/social/service/`:

```
edu/src/main/java/com/upnest/edu/modules/social/service/
├── FriendshipService.java
├── PostService.java
├── PostCommentService.java
├── PostReactionService.java
├── PostSaveService.java
├── PostShareService.java
└── PostReportService.java
```

### 1.4 Sao Chép Controller

Sao chép file từ `src/main/java/com/upnest/edu/modules/social/controller/`:

```
edu/src/main/java/com/upnest/edu/modules/social/controller/
└── CommunityController.java
```

### 1.5 Update `application.properties` hoặc `application.yml`

```yaml
# Nếu sử dụng YAML
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # hoặc update nếu tự động migration
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.SQLServerDialect
        format_sql: true
        
# Nếu sử dụng Properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.database-platform=org.hibernate.dialect.SQLServerDialect
```

### 1.6 Kiểm Tra Dependencies trong `pom.xml`

```xml
<!-- Đảm bảo đã có -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>
```

### 1.7 Chạy Build để Kiểm Tra

```bash
cd edu
mvn clean compile
```

Không nên có lỗi compilation.

---

## 📌 Bước 2: Tích Hợp Frontend

### 2.1 Sao Chép React Components

Sao chép tất cả từ `src/components/`:

```
upnest-web/src/components/
├── CommunityFeed.jsx
├── CommunityFeed.css
├── FriendshipButton.jsx
├── FriendshipButton.css
```

### 2.2 Sao Chép Pages

Sao chép từ `src/pages/`:

```
upnest-web/src/pages/
├── CommunityPage.jsx
└── CommunityPage.css
```

### 2.3 Sao Chép Service

Sao chép từ `src/services/`:

```
upnest-web/src/services/
└── social.service.js
```

### 2.4 Update `App.jsx`

Thêm route cho trang cộng đồng:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CommunityPage from './pages/CommunityPage';
import MainLayout from './layouts/MainLayout'; // hoặc layout của bạn

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các routes khác */}
        
        {/* Community Routes */}
        <Route path="/community" element={
          <MainLayout>
            <CommunityPage />
          </MainLayout>
        } />
        
        {/* Thêm route khác nếu cần */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### 2.5 Update Navigation/Sidebar

Thêm link đến trang cộng đồng trong navigation:

```jsx
// Trong header hoặc sidebar
<nav>
  {/* Links khác */}
  <Link to="/community">
    <i className="icon-community"></i>
    Cộng đồng
  </Link>
</nav>
```

### 2.6 Kiểm Tra Dependencies trong `package.json`

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x.x",
    "axios": "^1.x.x",
    "lucide-react": "^0.x.x"
  }
}
```

### 2.7 Chạy Frontend Dev Server

```bash
cd upnest-web
npm start
```

---

## 📌 Bước 3: Database Configuration

### 3.1 Tạo SQL Server Database Schema

Chạy script sau trên SQL Server:

```sql
-- Friendship Table
CREATE TABLE friendships (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'PENDING',
    is_mutual BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME,
    UNIQUE(follower_id, following_id),
    INDEX idx_follower_id (follower_id),
    INDEX idx_following_id (following_id),
    INDEX idx_status (status),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PostSave Table
CREATE TABLE post_saves (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    collection_name NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    UNIQUE(post_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_collection (collection_name),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PostShare Table
CREATE TABLE post_shares (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    post_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    user_name NVARCHAR(255),
    share_type NVARCHAR(20) NOT NULL,
    target_id BIGINT,
    share_message NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    INDEX idx_post_id (post_id),
    INDEX idx_user_id (user_id),
    INDEX idx_share_type (share_type),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Nếu các bảng khác chưa tồn tại, thêm:
-- posts, post_comments, post_reactions, post_reports
```

### 3.2 Tạo Indexes để Tối Ưu Performance

```sql
-- Indexes cho queries thường xuyên
CREATE INDEX idx_posts_author_deleted ON posts(author_id, is_deleted);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_deleted ON post_comments(post_id, is_deleted);
CREATE INDEX idx_reactions_post_type ON post_reactions(post_id, reaction_type);
CREATE INDEX idx_shares_type ON post_shares(post_id, share_type);
CREATE INDEX idx_saves_collection ON post_saves(user_id, collection_name);
```

---

## 📌 Bước 4: Environment Configuration

### 4.1 Backend Environment Variables

Tạo file `.env` hoặc update `application.properties`:

```properties
# Database
SPRING_DATASOURCE_URL=jdbc:sqlserver://localhost:1433;databaseName=UpNestEdu
SPRING_DATASOURCE_USERNAME=sa
SPRING_DATASOURCE_PASSWORD=YourPassword

# JWT (nếu sử dụng)
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000

# Server
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api/v1
```

### 4.2 Frontend Environment Variables

Tạo file `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
REACT_APP_API_TIMEOUT=30000
```

---

## 📌 Bước 5: Testing

### 5.1 Test Backend Endpoints

Sử dụng Postman hoặc cURL:

```bash
# Test Friendship
curl -X POST http://localhost:8080/api/v1/community/friends/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetUserId": 2}'

# Test Create Post
curl -X POST http://localhost:8080/api/v1/community/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello Community!",
    "postType": "TEXT"
  }'

# Test Get Feed
curl -X GET "http://localhost:8080/api/v1/community/feed?page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5.2 Test Frontend Components

```bash
cd upnest-web
npm test
```

### 5.3 Integration Test

1. Đăng nhập vào ứng dụng
2. Điều hướng đến `/community`
3. Test các tính năng:
   - [ ] Xem bảng tin
   - [ ] Đăng bài viết
   - [ ] Like bài viết
   - [ ] Bình luận
   - [ ] Kết bạn
   - [ ] Lưu bài viết
   - [ ] Chia sẻ bài viết
   - [ ] Báo cáo bài viết

---

## 📌 Bước 6: Deployment

### 6.1 Build Backend

```bash
cd edu
mvn clean package -DskipTests
```

Output: `target/edu-1.0.0.jar`

### 6.2 Build Frontend

```bash
cd upnest-web
npm run build
```

Output: `build/` folder

### 6.3 Deploy to Server

**Với Docker (Recommended):**

```dockerfile
# Backend Dockerfile
FROM openjdk:21-jdk-slim
COPY target/edu-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

# Frontend Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

**Hoặc Deploy Trực Tiếp:**

```bash
# Backend
java -jar target/edu-1.0.0.jar --spring.profiles.active=prod

# Frontend
serve -s build -l 3000
```

---

## 🐛 Troubleshooting

### Issue 1: Spring Boot không tìm thấy CommunityController

**Giải pháp:**
```java
// Kiểm tra package name
package com.upnest.edu.modules.social.controller;

// Component scan trong main application
@SpringBootApplication(scanBasePackages = "com.upnest.edu")
```

### Issue 2: Frontend không kết nối API

**Giải pháp:**
```javascript
// Kiểm tra trong social.service.js
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';
console.log('API Base URL:', baseURL);
```

### Issue 3: CORS Error

**Giải pháp trong Backend:**
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000", "http://localhost:8080")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowCredentials(true);
    }
}
```

### Issue 4: Token Authorization

**Kiểm tra:**
1. Token được lưu trong localStorage
2. Token được gửi trong Authorization header
3. Backend khả năng xác thực token

```javascript
// Debug trong browser console
console.log('Token:', localStorage.getItem('token'));
```

### Issue 5: Database Connection

**Kiểm tra:**
```bash
# SQL Server
sqlcmd -S localhost -U sa -P YourPassword -Q "SELECT @@VERSION"

# Connection string
jdbc:sqlserver://localhost:1433;databaseName=UpNestEdu;encrypt=true;trustServerCertificate=true
```

---

## 📊 Performance Optimization

### 1. Add Database Indexes

```sql
CREATE INDEX idx_feed_query ON posts(is_deleted, created_at DESC);
CREATE INDEX idx_comment_thread ON post_comments(post_id, parent_comment_id, is_deleted);
CREATE INDEX idx_friendship_bidirectional ON friendships(follower_id, following_id, status);
```

### 2. Enable Pagination

Tất cả list endpoints đã hỗ trợ pagination:

```javascript
// Frontend
socialService.getFeed(page, size)

// Backend
Page<Post> getFeed(userId, Pageable pageable)
```

### 3. Caching (Optional)

```java
@Cacheable(value = "posts", key = "#postId")
public Post getPostById(Long postId) { ... }

@CacheEvict(value = "posts", key = "#postId")
public void deletePost(Long postId) { ... }
```

### 4. Lazy Loading

Tất cả @ManyToOne đã sử dụng lazy loading:

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "post_id")
private Post post;
```

---

## ✅ Verification Checklist

- [ ] Backend code compiled without errors
- [ ] Frontend components render without errors
- [ ] Database schema created successfully
- [ ] All API endpoints responding (200 status)
- [ ] Authentication working (JWT token)
- [ ] CORS configured properly
- [ ] Database connections established
- [ ] Can create post
- [ ] Can add comment
- [ ] Can like post
- [ ] Can send friend request
- [ ] Can save post
- [ ] Can share post
- [ ] Can report post

---

## 📞 Support & Documentation

- Backend Docs: `COMMUNITY_SYSTEM_GUIDE.md`
- API Reference: `COMMUNITY_SYSTEM_GUIDE.md` (API Endpoints section)
- Checklist: `COMMUNITY_SYSTEM_CHECKLIST.md`

---

**Version:** 1.0.0  
**Last Updated:** December 2024
