@echo off
REM Script build project với Maven Wrapper

echo ============================================
echo Building UpNestEdu Project...
echo ============================================

REM Sử dụng Maven Wrapper nếu có, nếu không thì dùng mvn
if exist mvnw.cmd (
    echo Using Maven Wrapper (mvnw.cmd)...
    call mvnw.cmd clean compile -DskipTests
) else (
    echo Using system Maven (mvn)...
    mvn clean compile -DskipTests
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo Build SUCCESS!
    echo ============================================
    echo.
    echo To run the application, use: run.bat
) else (
    echo.
    echo ============================================
    echo Build FAILED!
    echo ============================================
)

pause
