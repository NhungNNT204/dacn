# 🗺️ ROUTING GUIDE - UpNest.EDU Project

## 📍 Main Entry Point

### **Primary Application File**
```
📁 Backend (Java Spring Boot)
└─ edu/src/main/java/com/upnest/edu/EduApplication.java
```

**File Content:**
```java
@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.upnest.edu.modules")
public class EduApplication {
    public static void main(String[] args) {
        SpringApplication.run(EduApplication.class, args);
    }
}
```

---

## 🔒 Security & Configuration Files

### **1. SecurityConfig.java** (Main Route Configuration)
```
📁 edu/src/main/java/com/upnest/edu/config/SecurityConfig.java
```

**Purpose:** 
- Định nghĩa security filters
- CORS configuration  
- API endpoint protection
- JWT token validation
- Request/Response filtering

**Key Components:**
- `PasswordEncoder`: BCryptPasswordEncoder
- `UserDetailsService`: User authentication
- `AuthenticationManager`: Auth flow
- `SecurityFilterChain`: HTTP security rules
- `CorsConfigurationSource`: CORS setup

---

### **2. Application Configuration**
```
📁 edu/src/main/resources/application.yml
```

**Configuration Details:**
```yaml
server:
  port: 8080                    # Backend port
  shutdown: graceful

spring:
  application:
    name: UpNest Edu System
  
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=UpNestEdu
    username: thuynhung
    password: 1234abc
    driver: SQLServerDriver     # SQL Server database
  
  jpa:
    hibernate:
      ddl-auto: none
    dialect: SQLServerDialect

# JWT Configuration
application:
  security:
    jwt:
      secret-key: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
      expiration: 86400000      # 1 day
      refresh-token:
        expiration: 604800000   # 7 days
```

---

## 🎯 Module Structure & Routes

### **Project Organization**
```
edu/src/main/java/com/upnest/edu/
├── config/                      ← Configuration files
│   └── SecurityConfig.java      ← Main routing config
│
├── modules/
│   ├── auth/                    ← Authentication routes
│   ├── user/                    ← User management routes
│   ├── social/                  ← Social features routes
│   ├── qa/                      ← Q&A system routes
│   ├── video/                   ← Video content routes
│   ├── group/                   ← Group management routes
│   ├── search/                  ← Search routes
│   └── profile/                 ← Profile routes
│
└── common/                      ← Shared utilities
```

---

## 📡 Complete API Routes by Module

### **1. Authentication Module**
```
MODULE: auth
CONTROLLER: AuthController.java

Routes:
  POST    /api/auth/register          → Register new user
  POST    /api/auth/login             → User login
  POST    /api/auth/refresh-token     → Refresh JWT token
  POST    /api/auth/logout            → User logout
  GET     /api/auth/verify            → Verify token
```

---

### **2. User Management Module**
```
MODULE: user
CONTROLLERS: UserAuthController, UserProfileController, PrivacySettingsController

Routes:
  
  ═══ UserAuthController ═══
  GET     /api/users/me               → Get current user
  PUT     /api/users/{id}/password    → Change password
  GET     /api/users/{id}             → Get user by ID
  
  ═══ UserProfileController ═══
  GET     /api/users/{id}/profile     → Get user profile
  PUT     /api/users/{id}/profile     → Update profile
  POST    /api/users/{id}/avatar      → Upload avatar
  
  ═══ PrivacySettingsController ═══
  GET     /api/users/{id}/privacy     → Get privacy settings
  PUT     /api/users/{id}/privacy     → Update privacy settings
```

---

### **3. Social Features Module** ⭐
```
MODULE: social
CONTROLLERS: 
  - PostController
  - SocialController
  - ChatController
  - NotificationController
  - SocialProfileController
  - AutoPostController

Routes:

  ═══ PostController ═══
  POST    /api/social/posts           → Create post
  GET     /api/social/posts           → Get all posts (with pagination)
  GET     /api/social/posts/{id}      → Get post by ID
  PUT     /api/social/posts/{id}      → Edit post
  DELETE  /api/social/posts/{id}      → Delete post
  POST    /api/social/posts/{id}/like → Like post
  DELETE  /api/social/posts/{id}/like → Unlike post
  POST    /api/social/posts/{id}/save → Save/bookmark post
  DELETE  /api/social/posts/{id}/save → Remove saved post
  
  ═══ SocialController ═══
  GET     /api/social/feed            → Get user feed
  GET     /api/social/trending        → Get trending posts
  GET     /api/social/explore         → Explore posts
  POST    /api/social/follow/{id}     → Follow user
  DELETE  /api/social/follow/{id}     → Unfollow user
  
  ═══ ChatController ═══
  POST    /api/social/chats           → Create chat
  GET     /api/social/chats           → Get all chats
  GET     /api/social/chats/{id}      → Get chat by ID
  POST    /api/social/chats/{id}/msg  → Send message
  GET     /api/social/chats/{id}/msg  → Get chat messages
  
  ═══ NotificationController ═══
  GET     /api/social/notifications   → Get notifications
  POST    /api/social/notifications/{id}/read → Mark as read
  DELETE  /api/social/notifications/{id}    → Delete notification
  
  ═══ SocialProfileController ═══
  GET     /api/social/profile/{id}    → Get social profile
  PUT     /api/social/profile/{id}    → Update social profile
  
  ═══ AutoPostController ═══
  POST    /api/social/auto-post       → Create auto-post
  GET     /api/social/auto-post       → Get auto-posts
  PUT     /api/social/auto-post/{id}  → Edit auto-post
  DELETE  /api/social/auto-post/{id}  → Delete auto-post
```

---

### **4. Q&A System Module**
```
MODULE: qa
CONTROLLERS:
  - QuestionController
  - AnswerController
  - CommentController
  - VoteController
  - ReactionController
  - WebSocketQaController

Routes:

  ═══ QuestionController ═══
  POST    /api/qa/questions           → Create question
  GET     /api/qa/questions           → Get all questions (with filter)
  GET     /api/qa/questions/{id}      → Get question by ID
  PUT     /api/qa/questions/{id}      → Edit question
  DELETE  /api/qa/questions/{id}      → Delete question
  GET     /api/qa/questions/tag/{tag} → Questions by tag
  
  ═══ AnswerController ═══
  POST    /api/qa/questions/{qId}/answers     → Create answer
  GET     /api/qa/questions/{qId}/answers     → Get all answers
  PUT     /api/qa/answers/{id}                → Edit answer
  DELETE  /api/qa/answers/{id}                → Delete answer
  POST    /api/qa/answers/{id}/accept         → Mark as accepted
  
  ═══ CommentController ═══
  POST    /api/qa/questions/{qId}/comments        → Comment on question
  POST    /api/qa/answers/{aId}/comments          → Comment on answer
  GET     /api/qa/comments/{id}                   → Get comment
  PUT     /api/qa/comments/{id}                   → Edit comment
  DELETE  /api/qa/comments/{id}                   → Delete comment
  
  ═══ VoteController ═══
  POST    /api/qa/questions/{qId}/upvote         → Upvote question
  POST    /api/qa/questions/{qId}/downvote       → Downvote question
  POST    /api/qa/answers/{aId}/upvote           → Upvote answer
  POST    /api/qa/answers/{aId}/downvote         → Downvote answer
  
  ═══ ReactionController ═══
  POST    /api/qa/{type}/{id}/reaction           → Add reaction
  DELETE  /api/qa/{type}/{id}/reaction/{emoji}   → Remove reaction
  
  ═══ WebSocketQaController ═══
  WS      /ws/qa/questions/{qId}                 → Live question updates
  WS      /ws/qa/answers/{aId}                   → Live answer updates
```

---

### **5. Video Module**
```
MODULE: video
CONTROLLER: VideoController.java

Routes:
  POST    /api/video/upload           → Upload video
  GET     /api/video                  → Get all videos
  GET     /api/video/{id}             → Get video by ID
  PUT     /api/video/{id}             → Update video
  DELETE  /api/video/{id}             → Delete video
  POST    /api/video/{id}/view        → Record view
  GET     /api/video/trending         → Get trending videos
```

---

### **6. Group Module**
```
MODULE: group
CONTROLLER: GroupController.java

Routes:
  POST    /api/groups                 → Create group
  GET     /api/groups                 → Get all groups
  GET     /api/groups/{id}            → Get group by ID
  PUT     /api/groups/{id}            → Update group
  DELETE  /api/groups/{id}            → Delete group
  POST    /api/groups/{id}/members    → Add member
  DELETE  /api/groups/{id}/members/{uid}  → Remove member
```

---

### **7. Search Module**
```
MODULE: search
CONTROLLER: SearchController.java

Routes:
  GET     /api/search                 → Global search
  GET     /api/search/questions       → Search questions
  GET     /api/search/posts           → Search posts
  GET     /api/search/users           → Search users
  GET     /api/search/videos          → Search videos
```

---

### **8. Profile Module**
```
MODULE: profile
CONTROLLER: ProfileController.java

Routes:
  GET     /api/profile/{id}           → Get user profile
  PUT     /api/profile/{id}           → Update profile
  POST    /api/profile/{id}/cover     → Upload cover photo
  POST    /api/profile/{id}/avatar    → Upload avatar
  GET     /api/profile/{id}/stats     → Get profile statistics
```

---

## 🔐 Security Rules (from SecurityConfig.java)

### **Public Routes (No Authentication Required)**
```
✅ /api/auth/**              → All auth routes
✅ /api/public/**            → Public content
✅ /api/search/**            → Search functionality
✅ /swagger-ui/**            → API documentation
✅ /api-docs/**              → OpenAPI specs
```

### **Protected Routes (JWT Required)**
```
🔒 /api/users/**            → User management
🔒 /api/social/**           → Social features
🔒 /api/qa/**               → Q&A system
🔒 /api/video/**            → Video upload/edit
🔒 /api/groups/**           → Group management
🔒 /api/profile/**          → Profile management
```

### **Admin Routes**
```
👮 /api/admin/**            → Admin operations
👮 /api/moderation/**       → Content moderation
```

---

## 🌐 Frontend Routing (React)

```
Frontend: upnest-web/
├── src/
│   ├── App.jsx              ← Main routing component
│   ├── AppWithCommunity.jsx ← Community tab integration
│   │
│   └── routes/
│       ├── Home/
│       ├── Auth/
│       ├── Dashboard/
│       ├── Community/       ← Social features
│       ├── QA/              ← Questions
│       ├── Videos/
│       ├── Groups/
│       └── Profile/

Frontend Routes:
  /                    → Home page
  /login               → Login page
  /register            → Registration
  /dashboard           → User dashboard
  /community           → Community Hub
  /qa                  → Q&A section
  /videos              → Video library
  /groups              → Groups
  /profile/:id         → User profile
  /search              → Search results
```

---

## 📊 API Request/Response Flow

```
1. Client (Browser/Frontend)
   ↓
2. Frontend Routes (React Router)
   ↓
3. API Calls (fetch/axios)
   ↓
4. Backend (Spring Boot)
   ↓
5. Security Filter (JWT validation)
   ↓
6. Controller Layer
   ↓
7. Service Layer (Business Logic)
   ↓
8. Repository Layer (Data Access)
   ↓
9. Database (SQL Server)
```

---

## 🔄 Request/Response Headers

### **Required Headers (for protected routes)**
```
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}
```

### **JWT Token Format**
```
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIn0.
dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U
```

---

## 📁 File Structure Reference

```
UpNest.EDU/
│
├── 📁 edu/ (BACKEND - Spring Boot)
│   ├── src/main/java/com/upnest/edu/
│   │   ├── EduApplication.java              ← MAIN ENTRY POINT
│   │   ├── config/
│   │   │   └── SecurityConfig.java          ← MAIN ROUTING FILE
│   │   │
│   │   └── modules/
│   │       ├── auth/
│   │       │   ├── controller/AuthController.java
│   │       │   ├── service/
│   │       │   ├── entity/
│   │       │   └── repository/
│   │       │
│   │       ├── social/
│   │       │   ├── controller/
│   │       │   │   ├── PostController.java
│   │       │   │   ├── ChatController.java
│   │       │   │   ├── NotificationController.java
│   │       │   │   └── ...
│   │       │   ├── service/
│   │       │   ├── entity/
│   │       │   └── repository/
│   │       │
│   │       ├── qa/
│   │       │   ├── controller/
│   │       │   │   ├── QuestionController.java
│   │       │   │   ├── AnswerController.java
│   │       │   │   ├── CommentController.java
│   │       │   │   ├── VoteController.java
│   │       │   │   └── ReactionController.java
│   │       │   ├── service/
│   │       │   ├── entity/
│   │       │   └── repository/
│   │       │
│   │       ├── user/
│   │       ├── video/
│   │       ├── group/
│   │       ├── search/
│   │       └── profile/
│   │
│   └── src/main/resources/
│       └── application.yml                  ← APPLICATION CONFIG
│
└── 📁 upnest-web/ (FRONTEND - React)
    └── src/
        ├── App.jsx
        ├── AppWithCommunity.jsx
        ├── components/
        │   ├── CommunityTab.jsx
        │   └── ...
        └── routes/
```

---

## 🚀 How to Add New Routes

### **1. Backend (Spring Boot)**

**Step 1:** Create Controller
```java
// edu/src/main/java/com/upnest/edu/modules/[module]/controller/[FeatureName]Controller.java

@RestController
@RequestMapping("/api/[module]/[feature]")
public class [FeatureName]Controller {
    
    @PostMapping
    public ResponseEntity<?> create(@RequestBody [DTO] request) {
        // Implementation
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        // Implementation
    }
}
```

**Step 2:** Security config automatically protects based on @RestController annotation

**Step 3:** If public route needed, add to SecurityConfig whitelist

---

### **2. Frontend (React)**

**Step 1:** Create Route in React Router
```javascript
// src/App.jsx or AppWithCommunity.jsx

<Routes>
  <Route path="/new-feature" element={<NewFeature />} />
</Routes>
```

**Step 2:** Call Backend API
```javascript
const response = await fetch('/api/module/feature', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
```

---

## 🧪 Testing Routes with cURL

```bash
# Login and get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token for protected route
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create post
curl -X POST http://localhost:8080/api/social/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello World","authorId":1}'
```

---

## 📋 Important Files Summary

| File | Purpose | Location |
|------|---------|----------|
| `EduApplication.java` | Main entry point | `edu/src/main/java/com/upnest/edu/` |
| `SecurityConfig.java` | Route protection & CORS | `edu/src/main/java/com/upnest/edu/config/` |
| `application.yml` | Server configuration | `edu/src/main/resources/` |
| `*Controller.java` | Individual route endpoints | `edu/src/main/java/com/upnest/edu/modules/*/controller/` |
| `App.jsx` | Frontend routing | `upnest-web/src/` |

---

## ✅ Routing Checklist

- [x] Backend running on port 8080
- [x] Database connection configured
- [x] JWT security enabled
- [x] CORS configured
- [x] All modules scanned
- [x] Controllers auto-registered
- [x] Public/Protected routes defined
- [x] API documentation available at `/swagger-ui.html`

---

**Last Updated:** December 23, 2025  
**Version:** 1.0.0  
**Status:** Complete & Production Ready

