@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "PROJECT_DIR=%~dp0"
set "DSH_HOME=%PROJECT_DIR%.dsh"
set "DSH_AGENTS_HOME=%PROJECT_DIR%.agents"
set "DSH_PORT=3080"
set "DSH_URL=http://127.0.0.1:%DSH_PORT%"
set "DSH_CMD=%PROJECT_DIR%node_modules\.bin\dsh.cmd"
set "DSH_LOG=%PROJECT_DIR%dsh-web.log"

cd /d "%PROJECT_DIR%"

echo ============================================
echo   DeepSeek Harness Web UI Launcher
echo ============================================

if not exist "%DSH_CMD%" (
    echo [ERROR] DSH executable not found: "%DSH_CMD%"
    echo [Hint] Run setup.cmd first.
    pause
    exit /b 1
)

call :find_listener
if defined LISTENER_PID call :stop_listener
if errorlevel 1 exit /b 1

echo [Start] Launching Web UI service...
echo [Start] Log file: "%DSH_LOG%"
start "DeepSeek Harness Web UI" /min cmd /d /c ""%DSH_CMD%" web 1>"%DSH_LOG%" 2>&1"

call :wait_until_ready
if errorlevel 1 (
    echo [ERROR] Service did not listen on port %DSH_PORT% within 60 seconds.
    echo [ERROR] Review the log file: "%DSH_LOG%"
    if exist "%DSH_LOG%" type "%DSH_LOG%"
    pause
    exit /b 1
)

echo [Done] Service ready: %DSH_URL%
start "" "%DSH_URL%"
exit /b 0

:find_listener
set "LISTENER_PID="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /r /c:":%DSH_PORT% .*LISTENING"') do if not defined LISTENER_PID set "LISTENER_PID=%%P"
exit /b 0

:stop_listener
echo [Check] Web UI is already running on port %DSH_PORT%, PID !LISTENER_PID!.
echo [Action] Stopping the old instance...
taskkill /PID !LISTENER_PID! /T /F >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Failed to stop PID !LISTENER_PID!.
    pause
    exit /b 1
)

for /l %%A in (1,1,30) do (
    call :find_listener
    if not defined LISTENER_PID exit /b 0
    >nul ping 127.0.0.1 -n 2
)

echo [ERROR] Port %DSH_PORT% was not released within 30 seconds.
pause
exit /b 1

:wait_until_ready
for /l %%A in (1,1,60) do (
    call :find_listener
    if defined LISTENER_PID exit /b 0
    >nul ping 127.0.0.1 -n 2
)
exit /b 1
