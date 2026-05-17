@echo off
title Smart Tourist Crowd Monitoring System Launcher
color 0b

echo ================================================================
echo         SMART TOURIST CROWD MONITORING SYSTEM
echo ================================================================
echo.
echo  Initializing application environment...
echo.

:: Navigate to the backend directory
cd /d "%~dp0backend"

:: Check if node_modules exists, if not install dependencies
if not exist "node_modules\" (
    echo [1/3] Installing required dependencies - first-time setup...
    call npm install
) else (
    echo [1/3] Dependencies found.
)

echo [2/3] Starting the backend server...
:: Start the server in a new window so the user sees it
start "CrowdMonitor Backend Server" cmd /c "npm start & pause"

echo [3/3] Waiting for server to be ready...
:check_server
ping 127.0.0.1 -n 2 >nul
node check-server.js >nul 2>&1
if errorlevel 1 goto check_server

echo.
echo ================================================================
echo  SERVER IS READY!
echo  Opening http://127.0.0.1:8080 in your default browser...
echo.
echo  (You can safely close this launcher window, but keep the 
echo   "CrowdMonitor Backend Server" window open while using the app)
echo ================================================================
start http://127.0.0.1:8080
ping 127.0.0.1 -n 6 >nul
