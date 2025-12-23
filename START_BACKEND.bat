@echo off
echo ========================================
echo   KHOI DONG BACKEND SPRING BOOT
echo ========================================
echo.

cd edu

echo [1/3] Kiem tra Maven Wrapper...
if not exist "mvnw.cmd" (
    echo [ERROR] Khong tim thay mvnw.cmd trong thu muc edu/
    echo Vui long chay lenh nay tu thu muc goc cua project
    pause
    exit /b 1
)

echo [2/3] Bat dau khoi dong Spring Boot...
echo Vui long doi 30-60 giay...
echo.

.\mvnw.cmd spring-boot:run

pause

