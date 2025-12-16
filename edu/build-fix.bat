@echo off
REM Script để build lại project sau khi sửa pom.xml

echo ============================================
echo Cleaning Maven project...
echo ============================================
call mvn clean

echo.
echo ============================================
echo Updating Maven dependencies...
echo ============================================
call mvn dependency:resolve

echo.
echo ============================================
echo Building project...
echo ============================================
call mvn clean install -DskipTests

echo.
echo ============================================
echo Build completed!
echo ============================================
pause
