@echo off
cd /d n:\DACN\upnestedu\edu
taskkill /F /IM java.exe 2>nul
timeout /t 2 /nobreak
echo Checking for compilation errors...
call .\mvnw.cmd clean compile 2>&1 | findstr "error" /I
echo.
echo Attempting to start backend...
start cmd /k ".\mvnw.cmd spring-boot:run"
echo Backend started in new window
pause
