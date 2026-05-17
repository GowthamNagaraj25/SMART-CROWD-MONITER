@echo off
:check
ping 127.0.0.1 -n 2 >nul
node missing.js >nul 2>&1
if errorlevel 1 (
echo Failed!
exit /b 1
)
