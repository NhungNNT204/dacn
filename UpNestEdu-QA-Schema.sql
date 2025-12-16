-- =====================================================
-- Q&A MODULE - DATABASE SCHEMA (SQL Server)
-- =====================================================
-- Thiết kế theo chuẩn 3NF
-- Các bảng: Questions, Answers, QuestionComments, AnswerComments, QuestionReactions, AnswerReactions

-- =====================================================
-- TABLE: questions (Câu hỏi)
-- =====================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'questions')
BEGIN
    CREATE TABLE questions (
        question_id BIGINT PRIMARY KEY IDENTITY(1,1),
        title NVARCHAR(500) NOT NULL,
        content NVARCHAR(MAX) NOT NULL,
        user_id BIGINT NOT NULL,
        course_id BIGINT NULL,
        tags NVARCHAR(500) NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'OPEN',  -- OPEN, ANSWERED, CLOSED
        view_count INT DEFAULT 0,
        like_count INT DEFAULT 0,
        best_answer_id BIGINT NULL,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETDATE(),
        
        -- Constraints
        CHECK (status IN ('OPEN', 'ANSWERED', 'CLOSED'))
    );
    
    -- Indexes
    CREATE INDEX idx_user_id ON questions(user_id);
    CREATE INDEX idx_course_id ON questions(course_id);
    CREATE INDEX idx_created_at ON questions(created_at DESC);
    CREATE INDEX idx_status ON questions(status);
    CREATE INDEX idx_view_count ON questions(view_count DESC);
    
    PRINT 'Table questions created successfully';
END

-- =====================================================
-- TABLE: answers (Câu trả lời)
-- =====================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'answers')
BEGIN
    CREATE TABLE answers (
        answer_id BIGINT PRIMARY KEY IDENTITY(1,1),
        content NVARCHAR(MAX) NOT NULL,
        user_id BIGINT NOT NULL,
        question_id BIGINT NOT NULL,
        is_best_answer BIT DEFAULT 0,
        like_count INT DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETDATE(),
        
        -- Foreign Key
        FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
        
        -- Indexes
        INDEX idx_question_id (question_id),
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at DESC),
        INDEX idx_is_best (is_best_answer),
        INDEX idx_like_count (like_count DESC)
    );
    
    PRINT 'Table answers created successfully';
END

-- =====================================================
-- TABLE: question_comments (Bình luận trên câu hỏi)
-- =====================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'question_comments')
BEGIN
    CREATE TABLE question_comments (
        comment_id BIGINT PRIMARY KEY IDENTITY(1,1),
        content NVARCHAR(MAX) NOT NULL,
        user_id BIGINT NOT NULL,
        question_id BIGINT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETDATE(),
        
        -- Foreign Key
        FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
        
        -- Indexes
        INDEX idx_question_id (question_id),
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at DESC)
    );
    
    PRINT 'Table question_comments created successfully';
END

-- =====================================================
-- TABLE: answer_comments (Bình luận trên câu trả lời)
-- =====================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'answer_comments')
BEGIN
    CREATE TABLE answer_comments (
        comment_id BIGINT PRIMARY KEY IDENTITY(1,1),
        content NVARCHAR(MAX) NOT NULL,
        user_id BIGINT NOT NULL,
        answer_id BIGINT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETDATE(),
        
        -- Foreign Key
        FOREIGN KEY (answer_id) REFERENCES answers(answer_id) ON DELETE CASCADE,
        
        -- Indexes
        INDEX idx_answer_id (answer_id),
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at DESC)
    );
    
    PRINT 'Table answer_comments created successfully';
END

-- =====================================================
-- TABLE: question_reactions (Phản ứng trên câu hỏi)
-- =====================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'question_reactions')
BEGIN
    CREATE TABLE question_reactions (
        reaction_id BIGINT PRIMARY KEY IDENTITY(1,1),
        reaction_type VARCHAR(20) NOT NULL,  -- LIKE, DISLIKE
        user_id BIGINT NOT NULL,
        question_id BIGINT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        
        -- Foreign Key
        FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
        
        -- Unique constraint: mỗi user chỉ có 1 reaction cho mỗi question
        UNIQUE (question_id, user_id),
        
        -- Indexes
        INDEX idx_question_id (question_id),
        INDEX idx_user_id (user_id),
        
        -- Constraint
        CHECK (reaction_type IN ('LIKE', 'DISLIKE'))
    );
    
    PRINT 'Table question_reactions created successfully';
END

-- =====================================================
-- TABLE: answer_reactions (Phản ứng trên câu trả lời)
-- =====================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'answer_reactions')
BEGIN
    CREATE TABLE answer_reactions (
        reaction_id BIGINT PRIMARY KEY IDENTITY(1,1),
        reaction_type VARCHAR(20) NOT NULL,  -- LIKE, DISLIKE
        user_id BIGINT NOT NULL,
        answer_id BIGINT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        
        -- Foreign Key
        FOREIGN KEY (answer_id) REFERENCES answers(answer_id) ON DELETE CASCADE,
        
        -- Unique constraint: mỗi user chỉ có 1 reaction cho mỗi answer
        UNIQUE (answer_id, user_id),
        
        -- Indexes
        INDEX idx_answer_id (answer_id),
        INDEX idx_user_id (user_id),
        
        -- Constraint
        CHECK (reaction_type IN ('LIKE', 'DISLIKE'))
    );
    
    PRINT 'Table answer_reactions created successfully';
END

-- =====================================================
-- SAMPLE DATA (Tùy chọn - để test)
-- =====================================================
-- Uncomment để thêm dữ liệu test
/*
INSERT INTO questions (title, content, user_id, course_id, tags, status)
VALUES 
    (N'Làm cách nào để sử dụng Spring Data JPA?', N'Tôi muốn học Spring Data JPA...', 1, 1, 'Spring,JPA,Database', 'OPEN'),
    (N'WebSocket trong Spring Boot hoạt động như thế nào?', N'Tôi cần giúp về WebSocket...', 2, 1, 'WebSocket,Spring Boot', 'OPEN');

INSERT INTO answers (content, user_id, question_id, is_best_answer)
VALUES
    (N'Spring Data JPA làm cho việc truy vấn cơ sở dữ liệu trở nên đơn giản...', 3, 1, 1);
*/

PRINT '============================================';
PRINT 'Q&A Module Database Schema Created Successfully!';
PRINT '============================================';
