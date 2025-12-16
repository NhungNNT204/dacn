-- =====================================================
-- USER MANAGEMENT MODULE - DATABASE SCHEMA (SQL Server)
-- =====================================================
-- Quản lý người dùng, hồ sơ cá nhân, cài đặt quyền riêng tư

-- =====================================================
-- TABLE: users (Người dùng)
-- =====================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'users')
BEGIN
    CREATE TABLE users (
        user_id BIGINT PRIMARY KEY IDENTITY(1,1),
        username NVARCHAR(100) NOT NULL UNIQUE,
        email NVARCHAR(255) NOT NULL UNIQUE,
        password NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(200),
        phone VARCHAR(20),
        role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',  -- STUDENT, TEACHER, ADMIN
        status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, INACTIVE, BANNED
        is_email_verified BIT DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETDATE(),
        last_login_at DATETIME,
        
        -- Constraints
        CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN')),
        CHECK (status IN ('ACTIVE', 'INACTIVE', 'BANNED'))
    );
    
    -- Indexes
    CREATE INDEX idx_username ON users(username);
    CREATE INDEX idx_email ON users(email);
    CREATE INDEX idx_role ON users(role);
    CREATE INDEX idx_status ON users(status);
    CREATE INDEX idx_created_at ON users(created_at DESC);
    
    PRINT 'Table users created successfully';
END

-- =====================================================
-- TABLE: user_profiles (Hồ sơ cá nhân)
-- =====================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'user_profiles')
BEGIN
    CREATE TABLE user_profiles (
        profile_id BIGINT PRIMARY KEY IDENTITY(1,1),
        user_id BIGINT NOT NULL UNIQUE,
        avatar_url NVARCHAR(MAX),
        date_of_birth VARCHAR(20),
        gender VARCHAR(20),  -- MALE, FEMALE, OTHER
        address NVARCHAR(500),
        city NVARCHAR(100),
        country NVARCHAR(100),
        specialization NVARCHAR(255),
        institution NVARCHAR(255),
        academic_year VARCHAR(50),
        bio NVARCHAR(MAX),
        website NVARCHAR(500),
        github_url NVARCHAR(500),
        linkedin_url NVARCHAR(500),
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETDATE(),
        
        -- Foreign Key
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        
        -- Indexes
        INDEX idx_user_id (user_id),
        
        -- Constraint
        CHECK (gender IS NULL OR gender IN ('MALE', 'FEMALE', 'OTHER'))
    );
    
    PRINT 'Table user_profiles created successfully';
END

-- =====================================================
-- TABLE: privacy_settings (Cài đặt quyền riêng tư)
-- =====================================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'privacy_settings')
BEGIN
    CREATE TABLE privacy_settings (
        setting_id BIGINT PRIMARY KEY IDENTITY(1,1),
        user_id BIGINT NOT NULL UNIQUE,
        profile_visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC',  -- PUBLIC, FRIENDS_ONLY, PRIVATE
        show_email BIT DEFAULT 0,
        show_phone BIT DEFAULT 0,
        show_academic_info BIT DEFAULT 1,
        allow_contact_from VARCHAR(20) NOT NULL DEFAULT 'ANYONE',  -- ANYONE, FRIENDS_ONLY, PRIVATE
        show_activity VARCHAR(20) NOT NULL DEFAULT 'FRIENDS_ONLY',  -- ANYONE, FRIENDS_ONLY, PRIVATE
        show_friends_list BIT DEFAULT 1,
        searchable_by_email BIT DEFAULT 1,
        searchable_by_username BIT DEFAULT 1,
        receive_email_notifications BIT DEFAULT 1,
        notification_from VARCHAR(20) NOT NULL DEFAULT 'ANYONE',  -- ANYONE, FRIENDS_ONLY, PRIVATE
        allow_friend_request_from VARCHAR(20) NOT NULL DEFAULT 'ANYONE',  -- ANYONE, FRIENDS_ONLY, PRIVATE
        created_at DATETIME NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME NOT NULL DEFAULT GETDATE(),
        
        -- Foreign Key
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        
        -- Indexes
        INDEX idx_user_id (user_id),
        
        -- Constraints
        CHECK (profile_visibility IN ('PUBLIC', 'FRIENDS_ONLY', 'PRIVATE')),
        CHECK (allow_contact_from IN ('ANYONE', 'FRIENDS_ONLY', 'PRIVATE')),
        CHECK (show_activity IN ('ANYONE', 'FRIENDS_ONLY', 'PRIVATE')),
        CHECK (notification_from IN ('ANYONE', 'FRIENDS_ONLY', 'PRIVATE')),
        CHECK (allow_friend_request_from IN ('ANYONE', 'FRIENDS_ONLY', 'PRIVATE'))
    );
    
    PRINT 'Table privacy_settings created successfully';
END

PRINT '============================================';
PRINT 'User Management Database Schema Created!';
PRINT '============================================';
