@echo off
rem DeepSeek Harness - 一键启�?Web UI
setlocal enabledelayedexpansion
set "DSH_HOME=E:\Deepseek Harness\.dsh"
set "DSH_AGENTS_HOME=E:\Deepseek Harness\.agents"
set "DSH_PORT=3080"
set "DSH_URL=http://127.0.0.1:%DSH_PORT%"

cd /d "E:\Deepseek Harness"

echo ============================================
echo   DeepSeek Harness Web UI Launcher
echo ============================================

rem ---- 1. Check if a dsh web instance is already running on DSH_PORT ----
set "PID="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":%DSH_PORT% .*LISTENING"') do (
    if not defined PID set "PID=%%p"
)

if defined PID (
    echo [Check] Web UI already running (PID: !PID!, port %DSH_PORT%)
    echo [Action] Stopping the old instance to restart...
    taskkill /PID !PID! /T /F >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Failed to stop PID !PID!. Please close it manually and retry.
        pause
        exit /b 1
    )
    echo [Action] Old instance stopped. Waiting for port to be released...
    :wait_release
    set "REMAIN="
    for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":%DSH_PORT% .*LISTENING"') do set "REMAIN=1"
    if defined REMAIN (
        timeout /t 1 /nobreak >nul
        goto wait_release
    )
)

rem ---- 2. Start the dsh web service in the background ----
echo [Start] Launching Web UI service...
start "DeepSeek Harness Web UI" /min cmd /c ""E:\Deepseek Harness\node_modules\.bin\dsh.cmd" web"

rem ---- 3. Wait until the service is ready (poll the port, up to 60s) ----
echo [Wait] Waiting for the service to be ready...
set /a attempts=0
:wait_ready
set /a attempts+=1
set "READY="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:":%DSH_PORT% .*LISTENING"') do set "READY=1"
if not defined READY (
    if !attempts! geq 60 (
        echo [ERROR] Service not ready within 60 seconds. Check the console output.
        pause
        exit /b 1
    )
    timeout /t 1 /nobreak >nul
    goto wait_ready
)

rem ---- 4. Open the browser once the service is ready ----
echo [Done] Service ready. Opening browser: %DSH_URL%
start "" "%DSH_URL%"

endlocal
