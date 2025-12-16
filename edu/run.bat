@echo off
REM Script chạy ứng dụng Spring Boot (skip tests)

echo ============================================
echo Running Spring Boot Application...
echo ============================================

REM Sử dụng Maven Wrapper nếu có, nếu không thì dùng mvn
if exist mvnw.cmd (
    call mvnw.cmd spring-boot:run -DskipTests
) else (
    mvn spring-boot:run -DskipTests
)

pause
