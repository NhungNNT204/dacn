#!/usr/bin/env pwsh
<#
.SYNOPSIS
    UpNestEdu API Test Script - PowerShell Version
.DESCRIPTION
    Test các API endpoint của UpNestEdu backend
.NOTES
    Author: UpNest Team
    Date: 2025-12-16
#>

param(
    [string]$BaseUrl = "http://localhost:8080"
)

$ErrorActionPreference = "SilentlyContinue"

function Write-TestHeader {
    param([string]$Title)
    Write-Host "`n" -ForegroundColor Green
    Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  $Title" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
}

function Write-TestInfo {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Check if backend is running
Write-Host "`nKiểm tra backend đang chạy tại $BaseUrl..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "$BaseUrl/actuator/health" -Method Get -TimeoutSec 5
    Write-Success "Backend đang chạy!"
} catch {
    Write-Error "Backend không phản hồi! Hãy chạy: mvn spring-boot:run"
    exit 1
}

# Variables for storing tokens
$registerToken = $null
$registerResponse = $null

Write-TestHeader "TEST 1: ĐĂNG KÝ TÀI KHOẢN"

Write-TestInfo "Endpoint: POST /api/users/register"
Write-TestInfo "Đăng ký tài khoản mới: testuser@example.com"

$registerPayload = @{
    username = "testuser1"
    email = "testuser1@example.com"
    password = "Test@123456"
    confirmPassword = "Test@123456"
    fullName = "Test User"
    role = "STUDENT"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/users/register" `
        -Method Post `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $registerPayload

    Write-Success "Đăng ký thành công!"
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json | Write-Host -ForegroundColor White
    $registerResponse = $response
} catch {
    Write-Error "Đăng ký thất bại: $_"
}

Read-Host "`nNhấn Enter để tiếp tục..."

# Test 2: Login
Write-TestHeader "TEST 2: ĐĂNG NHẬP"

Write-TestInfo "Endpoint: POST /api/users/login"
Write-TestInfo "Đăng nhập với: testuser1 / Test@123456"

$loginPayload = @{
    username = "testuser1"
    password = "Test@123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/api/users/login" `
        -Method Post `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginPayload

    Write-Success "Đăng nhập thành công!"
    Write-Host "Response:" -ForegroundColor Cyan
    $loginResponse | ConvertTo-Json | Write-Host -ForegroundColor White
    
    # Store token
    $token = $loginResponse.accessToken
    Write-TestInfo "Token: $token"
} catch {
    Write-Error "Đăng nhập thất bại: $_"
    $token = $null
}

Read-Host "`nNhấn Enter để tiếp tục..."

# Test 3: Get Profile
Write-TestHeader "TEST 3: LẤY PROFILE CÁ NHÂN"

if ($token) {
    Write-TestInfo "Endpoint: GET /api/users/profile"
    
    try {
        $profileResponse = Invoke-RestMethod -Uri "$BaseUrl/api/users/profile" `
            -Method Get `
            -Headers @{"Authorization" = "Bearer $token"}
        
        Write-Success "Lấy profile thành công!"
        Write-Host "Response:" -ForegroundColor Cyan
        $profileResponse | ConvertTo-Json | Write-Host -ForegroundColor White
    } catch {
        Write-Error "Lấy profile thất bại: $_"
    }
} else {
    Write-Error "Không có token, bỏ qua test này"
}

Read-Host "`nNhấn Enter để tiếp tục..."

# Test 4: Get Questions
Write-TestHeader "TEST 4: LẤY DANH SÁCH CÂU HỎI (Q&A)"

Write-TestInfo "Endpoint: GET /api/qa/questions"

try {
    $questionsResponse = Invoke-RestMethod -Uri "$BaseUrl/api/qa/questions" `
        -Method Get

    Write-Success "Lấy danh sách câu hỏi thành công!"
    Write-Host "Response:" -ForegroundColor Cyan
    $questionsResponse | ConvertTo-Json | Write-Host -ForegroundColor White
} catch {
    Write-Error "Lấy danh sách thất bại: $_"
}

Read-Host "`nNhấn Enter để tiếp tục..."

# Test 5: Create Question
Write-TestHeader "TEST 5: TẠO CÂU HỎI MỚI"

if ($token) {
    Write-TestInfo "Endpoint: POST /api/qa/questions"
    Write-TestInfo "Tạo câu hỏi mới..."
    
    $questionPayload = @{
        title = "Làm sao để học lập trình Java?"
        description = "Tôi là người mới bắt đầu, muốn tìm hiểu về Java"
        tags = "java,programming,beginner"
    } | ConvertTo-Json
    
    try {
        $createQuestionResponse = Invoke-RestMethod -Uri "$BaseUrl/api/qa/questions" `
            -Method Post `
            -Headers @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            } `
            -Body $questionPayload
        
        Write-Success "Tạo câu hỏi thành công!"
        Write-Host "Response:" -ForegroundColor Cyan
        $createQuestionResponse | ConvertTo-Json | Write-Host -ForegroundColor White
    } catch {
        Write-Error "Tạo câu hỏi thất bại: $_"
    }
} else {
    Write-Error "Không có token, bỏ qua test này"
}

Read-Host "`nNhấn Enter để kết thúc..."

# Summary
Write-TestHeader "TỔNG HỢP KẾT QUẢ TEST"

Write-Host "`n📋 Các Endpoint Chính:" -ForegroundColor Yellow
Write-Host "  🔐 Xác thực:"
Write-Host "     POST   /api/users/register          (Đăng ký)"
Write-Host "     POST   /api/users/login             (Đăng nhập)"
Write-Host "`n  👤 Hồ sơ người dùng:"
Write-Host "     GET    /api/users/profile           (Lấy hồ sơ)"
Write-Host "     PUT    /api/users/profile           (Cập nhật hồ sơ)"
Write-Host "`n  ❓ Q&A Module:"
Write-Host "     GET    /api/qa/questions            (Lấy danh sách)"
Write-Host "     POST   /api/qa/questions            (Tạo câu hỏi)"
Write-Host "     GET    /api/qa/questions/{id}       (Lấy chi tiết)"
Write-Host "     PUT    /api/qa/questions/{id}       (Cập nhật)"
Write-Host "     DELETE /api/qa/questions/{id}       (Xóa)"

Write-Host "`n✅ Hoàn thành test API!" -ForegroundColor Green
Write-Host "`n💡 Gợi ý tiếp theo:" -ForegroundColor Cyan
Write-Host "  1. Kiểm tra Frontend tại http://localhost:5173"
Write-Host "  2. Test đăng ký/đăng nhập trên giao diện"
Write-Host "  3. Tạo câu hỏi và trả lời"
Write-Host "  4. Check các module khác (Forum, Courses, Groups...)"
Write-Host ""
