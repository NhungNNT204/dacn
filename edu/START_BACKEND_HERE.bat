@echo off
echo ========================================
echo   KHOI DONG BACKEND SPRING BOOT
echo ========================================
echo.

echo [1/2] Kiem tra Maven Wrapper...
if not exist "mvnw.cmd" (
    echo [ERROR] Khong tim thay mvnw.cmd
    echo Ban dang o sai thu muc!
    pause
    exit /b 1
)

echo [2/2] Bat dau khoi dong Spring Boot...
echo Vui long doi 30-60 giay...
echo.

mvnw.cmd spring-boot:run

pause

