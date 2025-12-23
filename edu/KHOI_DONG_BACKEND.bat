@echo off
chcp 65001 > nul
echo.
echo ================================================
echo    KHỞI ĐỘNG BACKEND - UPNEST EDU
echo ================================================
echo.

cd /d "%~dp0"

if not exist "mvnw.cmd" (
    echo [ERROR] Không tìm thấy mvnw.cmd!
    echo Vui lòng chạy từ thư mục edu/
    pause
    exit /b 1
)

echo [INFO] Đang khởi động Spring Boot...
echo [INFO] Backend sẽ chạy tại http://localhost:8080
echo.
echo ⏳ Vui lòng đợi 30-60 giây...
echo.

.\mvnw.cmd spring-boot:run

if errorlevel 1 (
    echo.
    echo [ERROR] Khởi động thất bại!
    echo Vui lòng kiểm tra lỗi ở trên.
    pause
)

