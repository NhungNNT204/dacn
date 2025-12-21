@echo off
chcp 65001 >nul
echo ============================================
echo   🚀 KHỞI ĐỘNG BACKEND - UpNestEdu
echo ============================================
echo.

cd /d "%~dp0edu"

echo [1/3] Kiểm tra Maven Wrapper...
if not exist mvnw.cmd (
    echo ❌ Không tìm thấy mvnw.cmd!
    echo    Đang kiểm tra Maven...
    mvn --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ Maven chưa được cài đặt!
        echo    Vui lòng cài Maven hoặc dùng Maven Wrapper
        pause
        exit /b 1
    )
    echo ✅ Sử dụng Maven đã cài đặt
    set MAVEN_CMD=mvn
) else (
    echo ✅ Tìm thấy Maven Wrapper
    set MAVEN_CMD=mvnw.cmd
)

echo.
echo [2/3] Đang khởi động Spring Boot...
echo      Port: 8080
echo      Đợi vài giây để backend khởi động...
echo.

%MAVEN_CMD% spring-boot:run -DskipTests

pause

