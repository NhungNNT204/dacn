# 📊 DATABASE SCHEMA - Q&A MODULE

## Tables Created

### 1. `questions` - Câu hỏi
```sql
CREATE TABLE questions (
    question_id BIGINT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(500) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    user_id BIGINT NOT NULL,
    course_id BIGINT,
    tags NVARCHAR(500),
    status NVARCHAR(20) NOT NULL DEFAULT 'OPEN', -- OPEN, ANSWERED, CLOSED
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    best_answer_id BIGINT,
    created_at DATETIME2 NOT NULL,
    updated_at DATETIME2,
    
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_status (status)
);
```

### 2. `answers` - Câu trả lời
```sql
CREATE TABLE answers (
    answer_id BIGINT PRIMARY KEY IDENTITY(1,1),
    content NVARCHAR(MAX) NOT NULL,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    is_best_answer BIT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at DATETIME2 NOT NULL,
    updated_at DATETIME2,
    
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    INDEX idx_question_id (question_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_is_best (is_best_answer)
);
```

### 3. `votes` - Bình chọn (MỚI)
```sql
CREATE TABLE votes (
    vote_id BIGINT PRIMARY KEY IDENTITY(1,1),
    user_id BIGINT NOT NULL,
    question_id BIGINT,
    answer_id BIGINT,
    vote_type NVARCHAR(20) NOT NULL, -- UPVOTE, DOWNVOTE
    created_at DATETIME2 NOT NULL,
    updated_at DATETIME2,
    
    INDEX idx_user_id (user_id),
    INDEX idx_question_id (question_id),
    INDEX idx_answer_id (answer_id),
    UNIQUE INDEX idx_user_question (user_id, question_id),
    UNIQUE INDEX idx_user_answer (user_id, answer_id),
    
    -- Constraint: Chỉ được vote cho question HOẶC answer, không được cả 2
    CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL) OR
        (question_id IS NULL AND answer_id IS NOT NULL)
    )
);
```

### 4. `question_comments` - Bình luận câu hỏi
```sql
CREATE TABLE question_comments (
    comment_id BIGINT PRIMARY KEY IDENTITY(1,1),
    question_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL,
    updated_at DATETIME2,
    
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    INDEX idx_question_id (question_id),
    INDEX idx_user_id (user_id)
);
```

### 5. `answer_comments` - Bình luận câu trả lời
```sql
CREATE TABLE answer_comments (
    comment_id BIGINT PRIMARY KEY IDENTITY(1,1),
    answer_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL,
    updated_at DATETIME2,
    
    FOREIGN KEY (answer_id) REFERENCES answers(answer_id) ON DELETE CASCADE,
    INDEX idx_answer_id (answer_id),
    INDEX idx_user_id (user_id)
);
```

### 6. `question_reactions` - Phản ứng câu hỏi
```sql
CREATE TABLE question_reactions (
    reaction_id BIGINT PRIMARY KEY IDENTITY(1,1),
    question_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    reaction_type NVARCHAR(20) NOT NULL, -- LIKE, LOVE, HELPFUL
    created_at DATETIME2 NOT NULL,
    
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user_question_reaction (user_id, question_id)
);
```

### 7. `answer_reactions` - Phản ứng câu trả lời
```sql
CREATE TABLE answer_reactions (
    reaction_id BIGINT PRIMARY KEY IDENTITY(1,1),
    answer_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    reaction_type NVARCHAR(20) NOT NULL, -- LIKE, LOVE, HELPFUL
    created_at DATETIME2 NOT NULL,
    
    FOREIGN KEY (answer_id) REFERENCES answers(answer_id) ON DELETE CASCADE,
    UNIQUE INDEX idx_user_answer_reaction (user_id, answer_id)
);
```

## Relationships

```
User (1) -----> (N) Questions
User (1) -----> (N) Answers
User (1) -----> (N) Votes
User (1) -----> (N) Comments
User (1) -----> (N) Reactions

Question (1) -----> (N) Answers
Question (1) -----> (N) Votes
Question (1) -----> (N) Question_Comments
Question (1) -----> (N) Question_Reactions

Answer (1) -----> (N) Votes
Answer (1) -----> (N) Answer_Comments
Answer (1) -----> (N) Answer_Reactions

Course (1) -----> (N) Questions
```

## Indexes for Performance

- **User queries**: `idx_user_id` trên tất cả các bảng
- **Question queries**: `idx_question_id` trên answers, votes, comments
- **Sorting**: `idx_created_at DESC` cho pagination
- **Status filtering**: `idx_status` trên questions
- **Vote uniqueness**: Unique indexes để đảm bảo 1 user chỉ vote 1 lần

## Vote System Design

### Điểm Vote (Vote Score)
- **UPVOTE** = +1 điểm
- **DOWNVOTE** = -1 điểm
- **Vote Score** = Tổng (UPVOTE - DOWNVOTE)

### Business Rules
1. User chỉ được vote 1 lần cho mỗi question/answer
2. User có thể đổi vote (UPVOTE → DOWNVOTE hoặc ngược lại)
3. User có thể xóa vote (click lại nút đã vote)
4. User không thể vote cho question/answer của chính mình (implement ở service layer)
5. Vote realtime → Cập nhật ngay qua WebSocket

## WebSocket Topics

- `/topic/questions/{questionId}` - Updates cho question cụ thể
- `/topic/answers/{answerId}` - Updates cho answer cụ thể
- `/topic/qa/new` - Thông báo question mới
- `/user/queue/notifications` - Thông báo cá nhân

## Content Moderation

### Auto-moderation Rules
1. **Độ dài**: Min 10 chars, Max 10,000 chars
2. **Từ cấm**: Filter automatic
3. **Spam detection**: Pattern matching
4. **Link limit**: Max 3 links
5. **ALL CAPS**: Max 70% uppercase

### Spam Score System
- **0-30**: Approved
- **31-50**: Warning
- **51-100**: Rejected

## Permissions

### Roles
- **STUDENT**: Tạo, sửa, xóa question/answer của mình, vote, comment
- **INSTRUCTOR**: Tất cả quyền của STUDENT + mark best answer cho questions trong course của mình
- **ADMIN**: Full access, moderation, xóa any content

