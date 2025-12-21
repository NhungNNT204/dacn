-- ========================================
-- SQL SCRIPT - Q&A MODULE
-- Tạo bảng cho hệ thống Hỏi Đáp
-- ========================================

-- Bảng Questions đã tồn tại (được tạo bởi Hibernate)
-- Bảng Answers đã tồn tại (được tạo bởi Hibernate)
-- Bảng Comments đã tồn tại (được tạo bởi Hibernate)
-- Bảng Reactions đã tồn tại (được tạo bởi Hibernate)

-- ========================================
-- Bảng MỚI: Votes (Bình chọn)
-- ========================================
CREATE TABLE votes (
    vote_id BIGINT PRIMARY KEY IDENTITY(1,1),
    user_id BIGINT NOT NULL,
    question_id BIGINT NULL,
    answer_id BIGINT NULL,
    vote_type NVARCHAR(20) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME2 NULL,
    
    -- Constraints
    CONSTRAINT chk_vote_target CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL) OR
        (question_id IS NULL AND answer_id IS NOT NULL)
    ),
    
    -- Indexes
    INDEX idx_votes_user_id (user_id),
    INDEX idx_votes_question_id (question_id),
    INDEX idx_votes_answer_id (answer_id),
    
    -- Unique constraints (1 user chỉ vote 1 lần cho mỗi question/answer)
    CONSTRAINT uq_user_question UNIQUE (user_id, question_id),
    CONSTRAINT uq_user_answer UNIQUE (user_id, answer_id)
);

-- ========================================
-- Seed Data - Sample Questions
-- ========================================
SET IDENTITY_INSERT questions ON;

INSERT INTO questions (question_id, title, content, user_id, course_id, tags, status, view_count, like_count, created_at, updated_at)
VALUES 
(1, 
 'Làm thế nào để connect MySQL trong Spring Boot?',
 'Tôi đang học Spring Boot và muốn kết nối với MySQL database. Tôi đã thêm dependency vào pom.xml nhưng không biết cấu hình application.properties như thế nào. Ai có thể hướng dẫn chi tiết giúp tôi không?',
 1,
 1,
 'Java,Spring Boot,MySQL,Database',
 'OPEN',
 45,
 12,
 DATEADD(day, -2, GETDATE()),
 DATEADD(day, -2, GETDATE())),
 
(2,
 'React Hooks: useState vs useReducer khi nào nên dùng?',
 'Tôi thấy có cả useState và useReducer để quản lý state trong React. Vậy trong trường hợp nào thì nên dùng cái nào? Có tiêu chí gì để quyết định không?',
 2,
 5,
 'React,JavaScript,Hooks,useState,useReducer',
 'ANSWERED',
 128,
 24,
 DATEADD(day, -5, GETDATE()),
 DATEADD(day, -4, GETDATE())),
 
(3,
 'Cách tối ưu performance cho ứng dụng React?',
 'Ứng dụng React của tôi đang bị lag khi render nhiều components. Các bạn có tips gì để tối ưu performance không? Tôi đã thử useMemo nhưng vẫn chưa đủ.',
 3,
 5,
 'React,Performance,Optimization,useMemo',
 'OPEN',
 89,
 18,
 DATEADD(day, -1, GETDATE()),
 DATEADD(day, -1, GETDATE()));

SET IDENTITY_INSERT questions OFF;

-- ========================================
-- Seed Data - Sample Answers
-- ========================================
SET IDENTITY_INSERT answers ON;

INSERT INTO answers (answer_id, content, user_id, question_id, is_best_answer, like_count, created_at, updated_at)
VALUES
(1,
 'Để connect MySQL trong Spring Boot, bạn cần làm các bước sau:\n\n1. Thêm dependency trong pom.xml:\n```xml\n<dependency>\n    <groupId>mysql</groupId>\n    <artifactId>mysql-connector-java</artifactId>\n</dependency>\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-data-jpa</artifactId>\n</dependency>\n```\n\n2. Cấu hình trong application.properties:\n```properties\nspring.datasource.url=jdbc:mysql://localhost:3306/your_database\nspring.datasource.username=root\nspring.datasource.password=your_password\nspring.jpa.hibernate.ddl-auto=update\n```\n\nChúc bạn thành công!',
 4,
 1,
 0,
 8,
 DATEADD(day, -2, GETDATE()),
 DATEADD(day, -2, GETDATE())),
 
(2,
 'Câu trả lời ngắn gọn:\n\n- **useState**: Dùng cho state đơn giản (string, number, boolean)\n- **useReducer**: Dùng khi state phức tạp, có nhiều actions, hoặc cần logic update phức tạp\n\nVí dụ:\n- Form đơn giản → useState\n- Shopping cart, Todo list → useReducer\n\nHy vọng giúp được bạn!',
 5,
 2,
 1,
 15,
 DATEADD(day, -4, GETDATE()),
 DATEADD(day, -4, GETDATE())),
 
(3,
 'Một số cách tối ưu:\n\n1. React.memo() để prevent re-render không cần thiết\n2. useCallback() cho functions\n3. useMemo() cho computed values\n4. Code splitting với React.lazy()\n5. Virtualization cho long lists (react-window)\n\nNếu bạn muốn tôi có thể giải thích chi tiết hơn về từng cách!',
 6,
 3,
 0,
 10,
 DATEADD(day, -1, GETDATE()),
 DATEADD(day, -1, GETDATE()));

SET IDENTITY_INSERT answers OFF;

-- ========================================
-- Seed Data - Sample Votes
-- ========================================
SET IDENTITY_INSERT votes ON;

INSERT INTO votes (vote_id, user_id, question_id, answer_id, vote_type, created_at)
VALUES
-- Votes cho Question 1
(1, 2, 1, NULL, 'UPVOTE', DATEADD(day, -2, GETDATE())),
(2, 3, 1, NULL, 'UPVOTE', DATEADD(day, -2, GETDATE())),
(3, 4, 1, NULL, 'UPVOTE', DATEADD(day, -2, GETDATE())),
(4, 5, 1, NULL, 'DOWNVOTE', DATEADD(day, -2, GETDATE())),

-- Votes cho Question 2
(5, 1, 2, NULL, 'UPVOTE', DATEADD(day, -5, GETDATE())),
(6, 3, 2, NULL, 'UPVOTE', DATEADD(day, -5, GETDATE())),
(7, 4, 2, NULL, 'UPVOTE', DATEADD(day, -5, GETDATE())),

-- Votes cho Answer 1
(8, 2, NULL, 1, 'UPVOTE', DATEADD(day, -2, GETDATE())),
(9, 3, NULL, 1, 'UPVOTE', DATEADD(day, -2, GETDATE())),

-- Votes cho Answer 2 (Best Answer)
(10, 1, NULL, 2, 'UPVOTE', DATEADD(day, -4, GETDATE())),
(11, 3, NULL, 2, 'UPVOTE', DATEADD(day, -4, GETDATE())),
(12, 4, NULL, 2, 'UPVOTE', DATEADD(day, -4, GETDATE()));

SET IDENTITY_INSERT votes OFF;

-- ========================================
-- Update best_answer_id cho Question 2
-- ========================================
UPDATE questions SET best_answer_id = 2 WHERE question_id = 2;

-- ========================================
-- Queries để test
-- ========================================

-- Lấy tất cả questions với vote count
SELECT 
    q.question_id,
    q.title,
    q.status,
    q.view_count,
    COUNT(DISTINCT a.answer_id) as answer_count,
    COALESCE(SUM(CASE WHEN v.vote_type = 'UPVOTE' THEN 1 ELSE -1 END), 0) as vote_score
FROM questions q
LEFT JOIN answers a ON q.question_id = a.question_id
LEFT JOIN votes v ON q.question_id = v.question_id
GROUP BY q.question_id, q.title, q.status, q.view_count
ORDER BY q.created_at DESC;

-- Lấy tất cả answers của 1 question với vote count
SELECT 
    a.answer_id,
    a.content,
    a.is_best_answer,
    a.created_at,
    COALESCE(SUM(CASE WHEN v.vote_type = 'UPVOTE' THEN 1 ELSE -1 END), 0) as vote_score
FROM answers a
LEFT JOIN votes v ON a.answer_id = v.answer_id
WHERE a.question_id = 2
GROUP BY a.answer_id, a.content, a.is_best_answer, a.created_at
ORDER BY a.is_best_answer DESC, vote_score DESC;

-- Kiểm tra vote của user cho question
SELECT * FROM votes WHERE user_id = 1 AND question_id = 2;

-- Top questions theo vote score
SELECT 
    q.question_id,
    q.title,
    COALESCE(SUM(CASE WHEN v.vote_type = 'UPVOTE' THEN 1 ELSE -1 END), 0) as vote_score,
    COUNT(DISTINCT a.answer_id) as answer_count
FROM questions q
LEFT JOIN votes v ON q.question_id = v.question_id
LEFT JOIN answers a ON q.question_id = a.question_id
GROUP BY q.question_id, q.title
ORDER BY vote_score DESC;

