# 🎓 UpNestEdu Backend - User Management Module

## 📋 Tổng Quan

Backend module cho quản lý người dùng trong UpNestEdu, được xây dựng bằng **Java Spring Boot 3.3.5**.

## ✨ Tính Năng Chính

### 1. **Xác thực (Authentication)**
- ✅ Đăng ký tài khoản với validation
- ✅ Đăng nhập bằng username hoặc email
- ✅ JWT Token generation (accessToken + refreshToken)
- ✅ Check username/email sẵn sàng
- ✅ Password encoding với PasswordEncoder
- ✅ User roles (STUDENT, TEACHER, ADMIN)

### 2. **Hồ Sơ Người Dùng (User Profile)**
- ✅ CRUD operations
- ✅ Thông tin cá nhân (phone, gender, dateOfBirth, address)
- ✅ Thông tin học tập (specialization, institution, academicYear)
- ✅ Thông tin chuyên môn (bio, GitHub URL, LinkedIn URL)
- ✅ Avatar upload
- ✅ Lazy loading profile data

### 3. **Cài Đặt Quyền Riêng Tư (Privacy Settings)**
- ✅ 13 granular privacy settings
- ✅ Enum-based privacy levels (PUBLIC, ANYONE, FRIENDS_ONLY, PRIVATE)
- ✅ Update individual settings
- ✅ Reset to defaults

## 📁 Cấu Trúc Package

```
com.upnest.edu.modules.user/
├── entity/
│   ├── User.java                    # Main user entity (implements UserDetails)
│   ├── UserProfile.java             # Extended profile (1-1 with User)
│   ├── PrivacySettings.java         # Privacy configurations
│   ├── UserRole.java                # Enum: STUDENT, TEACHER, ADMIN
│   ├── UserStatus.java              # Enum: ACTIVE, INACTIVE, BANNED
│   ├── Gender.java                  # Enum: MALE, FEMALE, OTHER
│   └── PrivacyLevel.java            # Enum: PUBLIC, ANYONE, FRIENDS_ONLY, PRIVATE
├── repository/
│   ├── UserRepository.java          # User CRUD + custom queries
│   ├── UserProfileRepository.java   # Profile CRUD
│   └── PrivacySettingsRepository.java # Privacy settings CRUD
├── payload/
│   ├── RegisterRequest.java         # Registration DTO
│   ├── LoginRequest.java            # Login DTO
│   ├── AuthResponse.java            # Auth response with JWT
│   ├── UserProfileResponse.java     # Profile view DTO
│   ├── UpdateProfileRequest.java    # Profile update DTO
│   ├── PrivacySettingsResponse.java # Privacy settings view DTO
│   └── UpdatePrivacySettingsRequest.java # Privacy update DTO
├── service/
│   ├── AuthenticationService.java   # Register + Login logic
│   ├── UserProfileService.java      # Profile CRUD logic
│   └── PrivacySettingsService.java  # Privacy settings logic
└── controller/
    ├── AuthController.java          # Auth endpoints
    ├── ProfileController.java       # Profile endpoints
    └── PrivacySettingsController.java # Privacy endpoints
```

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) UNIQUE NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN')),
    status NVARCHAR(20) CHECK (status IN ('ACTIVE', 'INACTIVE', 'BANNED')),
    is_email_verified BIT DEFAULT 0,
    last_login_at DATETIME,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
)

-- User profiles table (1-1 with users)
CREATE TABLE user_profiles (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    user_id BIGINT UNIQUE NOT NULL,
    avatar_url NVARCHAR(MAX),
    phone_number NVARCHAR(20),
    gender NVARCHAR(10),
    date_of_birth DATE,
    address NVARCHAR(255),
    specialization NVARCHAR(255),
    institution NVARCHAR(255),
    academic_year NVARCHAR(50),
    bio NVARCHAR(500),
    github_url NVARCHAR(255),
    linkedin_url NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

-- Privacy settings table (1-1 with users)
CREATE TABLE privacy_settings (
    id BIGINT PRIMARY KEY IDENTITY(1,1),
    user_id BIGINT UNIQUE NOT NULL,
    profile_visibility NVARCHAR(20) CHECK (profile_visibility IN (...)),
    show_email BIT DEFAULT 0,
    show_phone_number BIT DEFAULT 0,
    allow_contact_from NVARCHAR(20),
    show_activity_status BIT DEFAULT 0,
    show_friends_list BIT DEFAULT 0,
    is_searchable BIT DEFAULT 1,
    email_notifications BIT DEFAULT 1,
    push_notifications BIT DEFAULT 1,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

## 🔧 Setup & Configuration

### 1. Prerequisites

- Java 17+
- Maven 3.8+
- SQL Server 2019+
- Spring Boot 3.3.5

### 2. Database Setup

```sql
-- Execute UpNestEdu-User-Schema.sql
sqlcmd -S SERVER_NAME -d DATABASE_NAME -i UpNestEdu-User-Schema.sql
```

### 3. Application Configuration

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=UpNestEdu
    username: sa
    password: your_password
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver

  jpa:
    hibernate:
      ddl-auto: validate
    dialect: org.hibernate.dialect.SQLServerDialect
    show-sql: false

  mvc:
    cors:
      allowed-origins: http://localhost:5173
      allowed-methods: GET,POST,PUT,DELETE
      allowed-headers: "*"
```

### 4. Build & Run

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Server runs at http://localhost:8080
```

## 📡 API Endpoints

### Authentication Endpoints

```
POST /api/auth/register
{
  "username": "student123",
  "email": "student@example.com",
  "fullName": "Học Viên A",
  "password": "123456",
  "confirmPassword": "123456",
  "role": "STUDENT"
}

Response: 201 CREATED
{
  "userId": 1,
  "username": "student123",
  "email": "student@example.com",
  "fullName": "Học Viên A",
  "role": "STUDENT",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tokenType": "Bearer"
}
```

```
POST /api/auth/login
{
  "username": "student123",
  "password": "123456"
}

Response: 200 OK
{
  "userId": 1,
  "username": "student123",
  "email": "student@example.com",
  "fullName": "Học Viên A",
  "role": "STUDENT",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "tokenType": "Bearer"
}
```

```
GET /api/auth/check-username?username=student123
GET /api/auth/check-email?email=student@example.com

Response: 200 OK
{
  "available": true
}
```

### Profile Endpoints

```
GET /api/users/profile
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "userId": 1,
  "username": "student123",
  "email": "student@example.com",
  "fullName": "Học Viên A",
  "avatarUrl": "https://...",
  "phoneNumber": "0987654321",
  "gender": "MALE",
  "dateOfBirth": "2003-01-15",
  "address": "TP. HCM",
  "specialization": "Computer Science",
  "institution": "ĐH Bách Khoa",
  "academicYear": "Year 2",
  "bio": "Passionate about coding",
  "githubUrl": "https://github.com/...",
  "linkedinUrl": "https://linkedin.com/...",
  "createdAt": "2024-01-01T00:00:00"
}
```

```
PUT /api/users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "fullName": "Học Viên A Updated",
  "phoneNumber": "0987654321",
  "gender": "MALE",
  "dateOfBirth": "2003-01-15",
  "address": "TP. HCM",
  "specialization": "Computer Science",
  "institution": "ĐH Bách Khoa",
  "academicYear": "Year 3",
  "bio": "Passionate about coding",
  "githubUrl": "https://github.com/...",
  "linkedinUrl": "https://linkedin.com/..."
}

Response: 200 OK
(Updated profile object)
```

```
POST /api/users/profile/avatar
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "avatarUrl": "https://..." or "data:image/jpeg;base64,..."
}

Response: 200 OK
```

### Privacy Settings Endpoints

```
GET /api/users/privacy-settings
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": 1,
  "userId": 1,
  "profileVisibility": "PUBLIC",
  "showEmail": false,
  "showPhoneNumber": false,
  "allowContactFrom": "ANYONE",
  "showActivityStatus": true,
  "showFriendsList": true,
  "isSearchable": true,
  "emailNotifications": true,
  "pushNotifications": true,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

```
PUT /api/users/privacy-settings
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "profileVisibility": "FRIENDS_ONLY",
  "showEmail": true,
  "showPhoneNumber": false,
  "allowContactFrom": "FRIENDS_ONLY",
  "showActivityStatus": false,
  "showFriendsList": false,
  "isSearchable": false,
  "emailNotifications": false,
  "pushNotifications": false
}

Response: 200 OK
(Updated settings object)
```

```
POST /api/users/privacy-settings/reset
Authorization: Bearer {accessToken}

Response: 200 OK
(Reset to default settings)
```

## 🔐 Security

- **Password Encoding**: BCryptPasswordEncoder (min 6 chars)
- **Authentication**: Spring Security + JWT
- **Authorization**: @PreAuthorize on controllers
- **CORS**: Configured for frontend
- **Token Headers**: Bearer {token}
- **User Isolation**: getCurrentUserId() prevents IDOR

## 🧪 Testing

### Unit Tests
```bash
mvn test
```

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"student123","email":"student@example.com","fullName":"Student","password":"123456","confirmPassword":"123456","role":"STUDENT"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student123","password":"123456"}'

# Get Profile (replace TOKEN)
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```

## 📦 Dependencies

```xml
<dependencies>
  <!-- Spring Boot -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>

  <!-- SQL Server -->
  <dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
  </dependency>

  <!-- JWT -->
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
  </dependency>

  <!-- Lombok -->
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
</dependencies>
```

## 🐛 Troubleshooting

### Issue: "Column 'xxx' not found" 
**Solution**: Run migration scripts to ensure all columns exist

### Issue: "Invalid token"
**Solution**: Check JWT configuration in JwtService

### Issue: "User already exists"
**Solution**: Username must be unique per database schema

## 📚 Additional Notes

- **Entity Relationships**: User 1-1 UserProfile, User 1-1 PrivacySettings with CASCADE delete
- **Timestamps**: createdAt, updatedAt auto-managed by @CreationTimestamp, @UpdateTimestamp
- **Lazy Loading**: UserProfile and PrivacySettings created lazily if null
- **Enum Conversion**: Case-insensitive conversion in services

## 👥 Development Team

- Backend: Java Spring Boot
- Frontend: React.js + Vite
- Database: SQL Server

## 📄 License

© 2024 UpNestEdu. All rights reserved.

---

**Last Updated**: 2024
**Status**: ✅ Production Ready
**Version**: 1.0.0
