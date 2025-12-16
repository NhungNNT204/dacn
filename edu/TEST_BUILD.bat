@echo off
REM Test build với verbose output

echo ============================================
echo Cleaning and Building...
echo ============================================

call mvn clean compile -DskipTests -X 2>&1 | findstr /C:"ReactionRequest" /C:"ERROR" /C:"BUILD"

echo.
echo ============================================
echo Build completed. Check output above.
echo ============================================

pause
