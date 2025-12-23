# ⚡ Quick Reference - Hệ Thống Cộng Đồng

## 🚀 Khởi Động Nhanh

### Backend Setup (3 phút)
```bash
# 1. Copy files
cp -r modules/social/ edu/src/main/java/com/upnest/edu/modules/

# 2. Build
cd edu
mvn clean compile

# 3. Run
mvn spring-boot:run
```

### Frontend Setup (2 phút)
```bash
# 1. Copy files
cp -r components/* upnest-web/src/components/
cp -r pages/* upnest-web/src/pages/
cp -r services/* upnest-web/src/services/

# 2. Update App.jsx
# Add: import CommunityPage from './pages/CommunityPage'
# Add: <Route path="/community" element={<CommunityPage />} />

# 3. Run
npm start
```

---

## 📍 File Locations

### Backend Files
```
Entity:        edu/src/main/java/com/upnest/edu/modules/social/entity/
Repository:    edu/src/main/java/com/upnest/edu/modules/social/repository/
Service:       edu/src/main/java/com/upnest/edu/modules/social/service/
Controller:    edu/src/main/java/com/upnest/edu/modules/social/controller/
```

### Frontend Files
```
Components:    upnest-web/src/components/
Pages:         upnest-web/src/pages/
Services:      upnest-web/src/services/
Styles:        upnest-web/src/[component].css
```

---

## 🔌 Main API Endpoints

### Quick Calls

| Action | Method | Endpoint |
|--------|--------|----------|
| Send Friend Request | POST | `/friends/request?targetUserId={id}` |
| Accept Friend | POST | `/friends/accept/{id}` |
| Remove Friend | DELETE | `/friends/{id}` |
| Create Post | POST | `/posts` |
| Like Post | POST | `/posts/{id}/like` |
| Add Comment | POST | `/posts/{id}/comments` |
| Reply Comment | POST | `/comments/{id}/reply?postId={id}` |
| Save Post | POST | `/posts/{id}/save` |
| Share Post | POST | `/posts/{id}/share` |
| Report Post | POST | `/posts/{id}/report` |
| Get Feed | GET | `/feed?page=0&size=10` |
| Get Friends | GET | `/friends/{userId}` |
| Get Comments | GET | `/posts/{id}/comments` |
| Get Saved Posts | GET | `/saved-posts` |

---

## 📦 Key Classes

### Services
```java
FriendshipService      // Kết bạn
PostService            // Bài viết
PostCommentService     // Bình luận
PostReactionService    // Like/Emoji
PostSaveService        // Lưu bài
PostShareService       // Chia sẻ
PostReportService      // Báo cáo
```

### Components
```jsx
CommunityPage          // Main page
CommunityFeed          // Feed component
FriendshipButton       // Friend button
CommentSection         // Comments modal
PostCard               // Post display
CreatePostModal        // Create post
ReportModal            // Report dialog
```

---

## 🎨 Component Usage Examples

### Use CommunityFeed
```jsx
import CommunityFeed from './components/CommunityFeed';

function App() {
  return <CommunityFeed />;
}
```

### Use FriendshipButton
```jsx
import { FriendshipButton } from './components/FriendshipButton';

function UserProfile({ userId }) {
  return <FriendshipButton userId={userId} />;
}
```

### Use CommunityPage
```jsx
import CommunityPage from './pages/CommunityPage';

// In Routes
<Route path="/community" element={<CommunityPage />} />
```

---

## 🔑 Authentication

### Bearer Token Usage
```javascript
// Automatically added by interceptor
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}

// Store token
localStorage.setItem('token', 'your_jwt_token');
```

### Get Current User
```java
// In Controller
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
Long userId = (Long) auth.getPrincipal();
```

---

## 💾 Database

### Create Tables
```sql
-- SQL Server script in database-schema.sql
-- Run all CREATE TABLE statements
-- Create indexes for performance
```

### Connection String
```
jdbc:sqlserver://localhost:1433;databaseName=UpNestEdu;encrypt=true;trustServerCertificate=true
```

---

## 🧪 Testing

### Test Friendship
```bash
curl -X POST http://localhost:8080/api/v1/community/friends/request \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetUserId": 2}'
```

### Test Create Post
```bash
curl -X POST http://localhost:8080/api/v1/community/posts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello!", "postType": "TEXT"}'
```

### Test Get Feed
```bash
curl -X GET "http://localhost:8080/api/v1/community/feed?page=0&size=10" \
  -H "Authorization: Bearer TOKEN"
```

---

## 🐛 Common Issues & Fixes

### Issue: 401 Unauthorized
**Solution:** 
```javascript
// Check token is set
console.log(localStorage.getItem('token'));
// Verify token is valid
// Check Authorization header is sent
```

### Issue: CORS Error
**Solution:**
```java
// Add to application.yml
cors:
  allowed-origins: "http://localhost:3000"
  allowed-methods: GET,POST,PUT,DELETE
  allow-credentials: true
```

### Issue: Component Not Rendering
**Solution:**
```jsx
// Check import statement
import CommunityPage from './pages/CommunityPage';
// Check route is registered
<Route path="/community" element={<CommunityPage />} />
```

### Issue: API Not Responding
**Solution:**
```bash
# Check backend is running
curl http://localhost:8080/api/v1/community/health
# Check database connection
# Check cors configuration
```

---

## 🎯 Common Tasks

### Add New Endpoint
```java
// In CommunityController.java
@PostMapping("/posts")
public ResponseEntity<ApiResponse<Post>> createPost(
    @RequestBody Post post,
    Authentication auth) {
    Long userId = getCurrentUserId(auth);
    Post created = postService.createPost(post);
    return ResponseEntity.ok(ApiResponse.success(created));
}
```

### Add New Service Method
```java
// In PostService.java
public Post updatePost(Long postId, Post updates) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new EntityNotFoundException("Post not found"));
    
    post.setContent(updates.getContent());
    post.setUpdatedAt(LocalDateTime.now());
    
    return postRepository.save(post);
}
```

### Add New React Hook
```jsx
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
    loadPosts();
}, []);

const loadPosts = async () => {
    setLoading(true);
    try {
        const data = await socialService.getFeed(0, 10);
        setPosts(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};
```

---

## 📊 Enum Reference

### FriendshipStatus
```java
PENDING    // Chờ duyệt
ACCEPTED   // Đã chấp nhận
BLOCKED    // Đã chặn
```

### ReactionType
```java
LIKE
LOVE
HAHA
WOW
SAD
ANGRY
```

### ShareType
```java
MESSAGE    // Chia sẻ qua tin nhắn
PROFILE    // Chia sẻ về trang cá nhân
GROUP      // Chia sẻ đến nhóm
```

### ReportType
```java
INAPPROPRIATE    // Không phù hợp
SPAM             // Thư rác
HARASSMENT       // Qu騷rối
VIOLENCE         // Bạo lực
MISINFORMATION   // Thông tin sai lệch
```

---

## 📱 Responsive Breakpoints

### CSS Media Queries
```css
/* Desktop */
@media (min-width: 1200px) { ... }

/* Tablet */
@media (max-width: 1199px) { ... }

/* Mobile Large */
@media (max-width: 900px) { ... }

/* Mobile Small */
@media (max-width: 640px) { ... }

/* Very Small */
@media (max-width: 480px) { ... }
```

---

## 🔍 Debugging Tips

### Backend Debugging
```java
// Add logging
@Slf4j
@RestController
public class CommunityController {
    @PostMapping("/posts")
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        log.info("Creating post: {}", post.getContent());
        // Implementation
    }
}
```

### Frontend Debugging
```javascript
// Add console logs
const handleLike = async () => {
    console.log('Liking post:', post.id);
    try {
        await socialService.likePost(post.id);
        console.log('Like successful');
    } catch (error) {
        console.error('Like failed:', error);
    }
};
```

### Database Debugging
```sql
-- Check data
SELECT * FROM posts WHERE is_deleted = 0;
SELECT * FROM friendships WHERE status = 'ACCEPTED';
SELECT * FROM post_comments WHERE parent_comment_id IS NULL;
```

---

## 📈 Performance Tips

### 1. Enable Caching
```java
@Cacheable(value = "posts", key = "#postId")
public Post getPostById(Long postId) { ... }
```

### 2. Add Database Indexes
```sql
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_comments_post ON post_comments(post_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

### 3. Use Pagination
```javascript
// Load more, not all
socialService.getFeed(page, size);
```

### 4. Lazy Load Images
```html
<img src={post.image} loading="lazy" />
```

---

## 🚀 Deployment Checklist

- [ ] Backend compiled successfully
- [ ] Frontend build passes
- [ ] Database schema created
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] CORS properly configured
- [ ] JWT secret configured
- [ ] API endpoints responding
- [ ] Frontend routes working
- [ ] Authentication flow tested

---

## 📞 Quick Help

### Where to find...
- **Service Implementation** → `service/` folder
- **Controller Routes** → `CommunityController.java`
- **Component Logic** → Component's `.jsx` file
- **Styling** → Component's `.css` file
- **API Methods** → `social.service.js`
- **Database Schema** → SQL scripts or `application.yml`

### How to...
- **Add new feature** → Create Service → Add Repository method → Add Controller endpoint → Create Component
- **Fix authentication** → Check token in localStorage → Verify interceptor in service → Check CORS
- **Debug issue** → Check browser console → Check backend logs → Check database
- **Optimize performance** → Add indexes → Enable caching → Optimize queries → Lazy load

---

## 🎓 Learning Resources

- Service Layer: `FriendshipService.java` (example)
- REST API: `CommunityController.java` (reference)
- React Components: `CommunityFeed.jsx` (pattern)
- Database: Entity files (schema reference)
- Styling: `CommunityFeed.css` (responsive pattern)

---

## ✅ Verification Steps

1. Backend starts without errors
   ```bash
   mvn spring-boot:run
   ```

2. Frontend loads without errors
   ```bash
   npm start
   ```

3. Can navigate to `/community`
   ```
   http://localhost:3000/community
   ```

4. Can send friend request
   ```
   [Check network tab for POST /friends/request]
   ```

5. Can create post
   ```
   [Check network tab for POST /posts]
   ```

---

**Quick Reference v1.0**  
**Last Updated:** December 2024  
**For:** UpNest Community System
