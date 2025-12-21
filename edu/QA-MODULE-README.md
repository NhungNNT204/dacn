# Q&A Realtime Module - UpNestEdu Backend

## 📋 Mô tả

Module Q&A Realtime là một hệ thống hỏi-đáp thời gian thực cho nền tảng mạng xã hội học tập **UpNestEdu**. Nó cho phép sinh viên tạo câu hỏi, trả lời, bình luận, và tương tác với những người khác trong thời gian thực.

## 🏗️ Kiến trúc

### Các lớp chính:

```
Q&A Module (com.upnest.edu.modules.qa)
├── entity/              # JPA Entities
│   ├── Question         # Câu hỏi
│   ├── Answer           # Câu trả lời
│   ├── QuestionComment  # Bình luận câu hỏi
│   ├── AnswerComment    # Bình luận câu trả lời
│   ├── QuestionReaction # Phản ứng câu hỏi (Like/Dislike)
│   ├── AnswerReaction   # Phản ứng câu trả lời
│   ├── QuestionStatus   # Enum: OPEN, ANSWERED, CLOSED
│   └── ReactionType     # Enum: LIKE, DISLIKE
│
├── repository/          # Data Access Layer
│   ├── QuestionRepository
│   ├── AnswerRepository
│   ├── QuestionCommentRepository
│   ├── AnswerCommentRepository
│   ├── QuestionReactionRepository
│   └── AnswerReactionRepository
│
├── service/             # Business Logic Layer
│   ├── QuestionService
│   ├── AnswerService
│   ├── CommentService
│   └── ReactionService
│
├── controller/          # REST API & WebSocket Layer
│   ├── QuestionController       # REST endpoints
│   ├── AnswerController         # REST endpoints
│   ├── CommentController        # REST endpoints
│   ├── ReactionController       # REST endpoints
│   └── WebSocketQaController    # WebSocket/STOMP
│
├── config/              # Configuration
│   ├── WebSocketConfig          # WebSocket STOMP
│   └── WebSocketSecurityConfig  # Security
│
├── message/             # WebSocket Messages
│   └── QaMessage        # DTO for WebSocket
│
├── event/               # Event Publishing
│   └── QaEventPublisher # Realtime events
│
├── payload/             # Request/Response DTOs
│   ├── QuestionRequest/Response
│   ├── AnswerRequest/Response
│   ├── CommentRequest/Response
│   └── ReactionRequest/Response
│
├── util/                # Utilities
│   └── SecurityUtil     # Security helpers
│
└── exception/           # Exception Handling
    └── QaExceptionHandler
```

## 📊 Database Schema (3NF)

### Bảng chính:

#### `questions` - Câu hỏi
```sql
- question_id (PK)
- title (NOT NULL)
- content (NOT NULL)
- user_id (FK to users)
- course_id (FK to courses, nullable)
- tags
- status (OPEN, ANSWERED, CLOSED)
- view_count
- like_count
- best_answer_id (FK, nullable)
- created_at
- updated_at
```

#### `answers` - Câu trả lời
```sql
- answer_id (PK)
- content (NOT NULL)
- user_id (FK to users)
- question_id (FK to questions, ON DELETE CASCADE)
- is_best_answer (boolean)
- like_count
- created_at
- updated_at
```

#### `question_comments` - Bình luận câu hỏi
```sql
- comment_id (PK)
- content (NOT NULL)
- user_id (FK to users)
- question_id (FK to questions, ON DELETE CASCADE)
- created_at
- updated_at
```

#### `answer_comments` - Bình luận câu trả lời
```sql
- comment_id (PK)
- content (NOT NULL)
- user_id (FK to users)
- answer_id (FK to answers, ON DELETE CASCADE)
- created_at
- updated_at
```

#### `question_reactions` - Phản ứng câu hỏi
```sql
- reaction_id (PK)
- reaction_type (LIKE, DISLIKE)
- user_id (FK to users)
- question_id (FK to questions, ON DELETE CASCADE)
- created_at
- UNIQUE(question_id, user_id)  -- Mỗi user chỉ 1 reaction
```

#### `answer_reactions` - Phản ứng câu trả lời
```sql
- reaction_id (PK)
- reaction_type (LIKE, DISLIKE)
- user_id (FK to users)
- answer_id (FK to answers, ON DELETE CASCADE)
- created_at
- UNIQUE(answer_id, user_id)  -- Mỗi user chỉ 1 reaction
```

## 🔌 REST API Endpoints

### Question APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/qa/questions` | Tạo câu hỏi mới | ✅ |
| GET | `/api/qa/questions` | Lấy danh sách câu hỏi | ❌ |
| GET | `/api/qa/questions/{id}` | Lấy chi tiết câu hỏi | ❌ |
| PUT | `/api/qa/questions/{id}` | Cập nhật câu hỏi | ✅ |
| DELETE | `/api/qa/questions/{id}` | Xóa câu hỏi | ✅ |
| GET | `/api/qa/questions/search?keyword=...` | Tìm kiếm câu hỏi | ❌ |
| GET | `/api/qa/questions/course/{courseId}` | Câu hỏi theo khóa học | ❌ |
| GET | `/api/qa/questions/my-questions` | Câu hỏi của user | ✅ |
| POST | `/api/qa/questions/{id}/best-answer/{answerId}` | Đặt best answer | ✅ |

### Answer APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/qa/questions/{questionId}/answers` | Tạo câu trả lời | ✅ |
| GET | `/api/qa/answers/{id}` | Lấy chi tiết câu trả lời | ❌ |
| PUT | `/api/qa/answers/{id}` | Cập nhật câu trả lời | ✅ |
| DELETE | `/api/qa/answers/{id}` | Xóa câu trả lời | ✅ |
| GET | `/api/qa/questions/{questionId}/answers` | Câu trả lời của câu hỏi | ❌ |
| POST | `/api/qa/answers/{id}/react` | Like/Dislike câu trả lời | ✅ |
| DELETE | `/api/qa/answers/{id}/react` | Hủy phản ứng | ✅ |

### Comment APIs

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/qa/questions/{questionId}/comments` | Bình luận câu hỏi | ✅ |
| PUT | `/api/qa/questions/comments/{id}` | Cập nhật bình luận | ✅ |
| DELETE | `/api/qa/questions/comments/{id}` | Xóa bình luận | ✅ |
| POST | `/api/qa/answers/{answerId}/comments` | Bình luận câu trả lời | ✅ |
| PUT | `/api/qa/answers/comments/{id}` | Cập nhật bình luận | ✅ |
| DELETE | `/api/qa/answers/comments/{id}` | Xóa bình luận | ✅ |

### Reaction APIs (Questions)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/qa/questions/{questionId}/react` | Like/Dislike câu hỏi | ✅ |
| DELETE | `/api/qa/questions/{questionId}/react` | Hủy phản ứng | ✅ |

## 🔄 WebSocket Realtime (STOMP/SockJS)

### Kết nối
```
WebSocket Endpoint: ws://localhost:8080/ws-qa
Protocol: STOMP over WebSocket + SockJS fallback
```

### Subscribe/Publish Topics

| Topic | Mô tả |
|-------|-------|
| `/topic/qa/question/{questionId}` | Cập nhật cho một câu hỏi cụ thể |
| `/topic/qa/answer/{answerId}` | Cập nhật cho một câu trả lời cụ thể |
| `/topic/qa/course/{courseId}` | Câu hỏi mới trong khóa học |
| `/topic/qa/questions/new` | Tất cả câu hỏi mới |

### Message Types

```javascript
// NEW_QUESTION - Có câu hỏi mới
{
  "messageType": "NEW_QUESTION",
  "questionId": 123,
  "title": "Làm cách nào...",
  "userId": 456,
  "courseId": 789,
  "timestamp": "2024-12-16T10:30:00"
}

// NEW_ANSWER - Có câu trả lời mới
{
  "messageType": "NEW_ANSWER",
  "questionId": 123,
  "answerId": 456,
  "content": "Nội dung trả lời...",
  "userId": 789,
  "timestamp": "2024-12-16T10:31:00"
}

// NEW_COMMENT - Có bình luận mới
{
  "messageType": "NEW_COMMENT",
  "questionId": 123,
  "commentId": 456,
  "content": "Bình luận...",
  "userId": 789,
  "timestamp": "2024-12-16T10:32:00"
}

// REACTION_UPDATED - Phản ứng cập nhật
{
  "messageType": "REACTION_UPDATED",
  "answerId": 456,
  "reactionType": "LIKE",
  "likeCount": 5,
  "userId": 789,
  "timestamp": "2024-12-16T10:33:00"
}

// BEST_ANSWER_SET - Best answer được đặt
{
  "messageType": "BEST_ANSWER_SET",
  "questionId": 123,
  "answerId": 456,
  "userId": 789,
  "timestamp": "2024-12-16T10:34:00"
}
```

### Client JS Example

```javascript
// Kết nối
var stompClient = null;
var socket = new SockJS('http://localhost:8080/ws-qa');
stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
    console.log('Connected: ' + frame.server);
    
    // Subscribe vào câu hỏi cụ thể
    stompClient.subscribe('/topic/qa/question/123', function(message) {
        var qaMessage = JSON.parse(message.body);
        console.log('New message:', qaMessage);
        // Cập nhật UI
    });
});

// Gửi message khi có câu trả lời mới
stompClient.send("/app/qa/question/123/new-answer", {}, JSON.stringify({
    answerId: 456,
    content: "Trả lời...",
    userId: 789
}));
```

## 🔐 Bảo mật & Phân quyền

### Authentication & Authorization

- ✅ JWT Token: Được yêu cầu cho tất cả endpoints ghi (POST, PUT, DELETE)
- ✅ Read-only endpoints: Không cần authentication
- ✅ Owner check: Chỉ chủ sở hữu có thể cập nhật/xóa
- ✅ Role-based: Có thể thêm admin roles cho moderation

### Cách sử dụng

```
Header: Authorization: Bearer <JWT_TOKEN>
```

## 📦 Dependencies

```xml
<!-- WebSocket & STOMP -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- SockJS & STOMP JS -->
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>sockjs-client</artifactId>
</dependency>
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>stomp-websocket</artifactId>
</dependency>

<!-- JPA & Database -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- SQL Server -->
<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
</dependency>

<!-- Security & JWT -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

## 🚀 Cài đặt & Khởi động

### 1. Database

Chạy script SQL:
```sql
-- UpNestEdu-QA-Schema.sql
```

### 2. Configuration (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=UpNestEdu
    username: sa
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update

application:
  security:
    jwt:
      secret-key: your_secret_key
      expiration: 86400000
```

### 3. Build & Run

```bash
mvn clean install
mvn spring-boot:run
```

## 📝 Service Methods

### QuestionService

- `createQuestion(userId, request)` - Tạo câu hỏi
- `updateQuestion(questionId, userId, request)` - Cập nhật
- `getQuestionDetail(questionId)` - Lấy chi tiết
- `getUserQuestions(userId, pageable)` - Câu hỏi user
- `searchQuestions(keyword, pageable)` - Tìm kiếm
- `getTrendingQuestions(pageable)` - Nổi bật
- `deleteQuestion(questionId, userId)` - Xóa
- `setBestAnswer(questionId, answerId, userId)` - Best answer

### AnswerService

- `createAnswer(questionId, userId, request)` - Tạo trả lời
- `updateAnswer(answerId, userId, request)` - Cập nhật
- `getAnswerDetail(answerId)` - Chi tiết
- `getAnswersByQuestion(questionId, pageable)` - Trả lời câu hỏi
- `getMostLikedAnswers(questionId, pageable)` - Like nhiều
- `getUserAnswers(userId, pageable)` - Trả lời user
- `deleteAnswer(answerId, userId)` - Xóa

### CommentService

- `createQuestionComment(questionId, userId, request)`
- `createAnswerComment(answerId, userId, request)`
- `updateQuestionComment(commentId, userId, request)`
- `updateAnswerComment(commentId, userId, request)`
- `deleteQuestionComment(commentId, userId)`
- `deleteAnswerComment(commentId, userId)`

### ReactionService

- `reactToQuestion(questionId, userId, request)` - Like câu hỏi
- `removeQuestionReaction(questionId, userId)`
- `reactToAnswer(answerId, userId, request)` - Like trả lời
- `removeAnswerReaction(answerId, userId)`

## 🔧 Customize

### Thêm validation

```java
@PostMapping
public ResponseEntity<QuestionResponse> createQuestion(
    @Valid @RequestBody QuestionRequest request) {
    // ...
}
```

### Thêm event listeners

```java
// Sử dụng QaEventPublisher để phát events realtime
qaeventPublisher.publishNewQuestion(id, title, userId, courseId);
```

### Thêm logging & monitoring

- Đã có `@Slf4j` trên tất cả services
- Sử dụng Spring Boot Actuator cho metrics

## 📚 Tài liệu liên quan

- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- Spring WebSocket: https://spring.io/guides/gs/messaging-stomp-websocket/
- SQL Server: https://docs.microsoft.com/en-us/sql/
- JWT: https://jwt.io/

## ✅ Checklist Hoàn thành

- ✅ Entities (Question, Answer, Comments, Reactions) - 3NF
- ✅ Repositories với custom queries
- ✅ Services với business logic
- ✅ REST Controllers (CRUD + Search)
- ✅ WebSocket Config (STOMP)
- ✅ Event Publisher & Message DTO
- ✅ Exception Handler
- ✅ Security & JWT integration
- ✅ Database Schema SQL
- ✅ Comprehensive documentation

## 🤝 Support

Liên hệ team: nguyenthitnhungnhung204@gmail.com
