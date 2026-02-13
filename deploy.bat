@echo off
echo Building Noor Swipe PWA...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b %ERRORLEVEL%
)

echo.
echo Build successful!
echo.
echo To deploy to Netlify:
echo 1. Drag and drop the 'dist' folder to https://app.netlify.com/drop
echo.
echo To deploy to Vercel:
echo 1. Install Vercel CLI: npm i -g vercel
echo 2. Run: vercel
echo.
echo Assets Optimized:
dir dist\assets /w
echo.
pause
