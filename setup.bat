@echo off
echo ========================================
echo Bob: Your AI Teammate - Setup Script
echo ========================================
echo.

echo Checking system...
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ERROR: index.html not found!
    echo Please run this script from the bob-ai-teammate-showcase directory.
    pause
    exit /b 1
)

echo [OK] Project files found
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your Bob showcase is ready to run!
echo.
echo To view the showcase:
echo   1. Open index.html in your web browser
echo   2. Or use a local server (recommended):
echo      - Python: python -m http.server 8000
echo      - Node.js: npx serve
echo      - PHP: php -S localhost:8000
echo.
echo Then navigate to: http://localhost:8000
echo.
echo ========================================
echo Quick Start Commands:
echo ========================================
echo.
echo Start with Python:
echo   python -m http.server 8000
echo.
echo Start with Node.js:
echo   npx serve
echo.
echo ========================================
echo.

REM Ask if user wants to open in browser
set /p OPEN="Open index.html in browser now? (y/n): "
if /i "%OPEN%"=="y" (
    echo Opening in default browser...
    start index.html
)

echo.
echo For more information, see README.md
echo.
pause

@REM Made with Bob
