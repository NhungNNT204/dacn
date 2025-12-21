@echo off
REM ============================================
REM Script Test API UpNestEdu (Windows)
REM ============================================

setlocal enabledelayedexpansion
set BASE_URL=http://localhost:8080

cls
echo.
echo ╔════════════════════════════════════════╗
echo ║   UpNestEdu API Test Script            ║
echo ║   Backend: %BASE_URL%         ║
echo ╚════════════════════════════════════════╝
echo.

REM ============================================
REM Test 1: Register User
REM ============================================
echo [Test 1] Đăng ký tài khoản mới...
echo Endpoint: POST /api/users/register
echo.

curl -X POST "%BASE_URL%/api/users/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"testuser1\", \"email\": \"testuser1@example.com\", \"password\": \"Test@123456\", \"confirmPassword\": \"Test@123456\", \"fullName\": \"Test User\", \"role\": \"STUDENT\"}"

echo.
echo.
pause

REM ============================================
REM Test 2: Login
REM ============================================
cls
echo [Test 2] Đăng nhập (Login)...
echo Endpoint: POST /api/users/login
echo.

curl -X POST "%BASE_URL%/api/users/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"testuser1\", \"password\": \"Test@123456\"}"

echo.
echo.
pause

REM ============================================
REM Test 3: Get User Profile
REM ============================================
cls
echo [Test 3] Lấy thông tin profile cá nhân
echo Endpoint: GET /api/users/profile
echo Lưu ý: Cần thay TOKEN từ response của Test 2
echo.
echo Lệnh để chạy:
echo curl -X GET "%BASE_URL%/api/users/profile" -H "Authorization: Bearer YOUR_TOKEN_HERE"
echo.
pause

REM ============================================
REM Test 4: Get Questions (Q&A Module)
REM ============================================
cls
echo [Test 4] Lấy danh sách câu hỏi (Q&A)
echo Endpoint: GET /api/qa/questions
echo.

curl -X GET "%BASE_URL%/api/qa/questions"

echo.
echo.
pause

REM ============================================
REM Test 5: Create Question
REM ============================================
cls
echo [Test 5] Tạo câu hỏi mới (cần token)
echo Endpoint: POST /api/qa/questions
echo.
echo Lệnh để chạy:
echo curl -X POST "%BASE_URL%/api/qa/questions" ^
echo   -H "Content-Type: application/json" ^
echo   -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
echo   -d "{\"title\": \"Test Question\", \"description\": \"This is a test question\", \"tags\": \"test,java\"}"
echo.
pause

REM ============================================
REM Test 6: Health Check
REM ============================================
cls
echo [Test 6] Kiểm tra Health Check
echo Endpoint: GET /actuator/health
echo.

curl -X GET "%BASE_URL%/actuator/health"

echo.
echo.
echo ✅ Hoàn thành test!
echo.
echo 📋 Các endpoint chính:
echo   - POST   /api/users/register      (Đăng ký)
echo   - POST   /api/users/login         (Đăng nhập)
echo   - GET    /api/users/profile       (Lấy profile)
echo   - GET    /api/qa/questions        (Lấy danh sách câu hỏi)
echo   - POST   /api/qa/questions        (Tạo câu hỏi)
echo   - GET    /api/qa/questions/{id}   (Lấy chi tiết câu hỏi)
echo.
pause

echo ✅ Script hoàn thành!
echo 💡 Knhungến nghị: Sử dụng PowerShell script hoặc Postman để test dễ dàng hơn

pause
