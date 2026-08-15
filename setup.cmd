@echo off
rem ============================================================
rem  DeepSeek Harness personal workstation - one-shot bootstrap
rem  Restores everything the repo manages: host deps, web profile
rem  plugins (vendored plugins + distill patch are applied by
rem  pnpm automatically), and a credentials template.
rem ============================================================
setlocal
cd /d "%~dp0"

echo [setup] DeepSeek Harness workstation bootstrap
echo.

echo [1/4] Checking toolchain...
where node >nul 2>&1 || (echo ERROR: node not found - install from https://nodejs.org/ & exit /b 1)
where npm  >nul 2>&1 || (echo ERROR: npm not found & exit /b 1)
where pnpm >nul 2>&1 || (echo ERROR: pnpm not found - install with: npm i -g pnpm & exit /b 1)
for /f "delims=" %%v in ('node -v') do set NODE_VER=%%v
echo       node %NODE_VER% OK

echo [2/4] Installing host dependencies (npm ci)...
call npm ci
if errorlevel 1 (echo ERROR: npm ci failed & exit /b 1)

echo [3/4] Installing web profile plugins (pnpm install)...
echo       Applies vendored plugins (vendor/plugins) and the distill
echo       whitelist patch (patches/) automatically.
pushd ".dsh\profiles\web"
call pnpm install
if errorlevel 1 (echo ERROR: pnpm install failed & popd & exit /b 1)
popd

echo [4/4] Checking credentials...
if not exist ".dsh\.credentials.yaml" (
  echo       .dsh\.credentials.yaml missing - creating from template
  copy /Y ".credentials.yaml.example" ".dsh\.credentials.yaml" >nul
  echo.
  echo       ^>^>^> Edit .dsh\.credentials.yaml and fill in your API keys ^<^<^<
  echo       ^>^>^> then start the workstation with: 启动 Web UI.cmd ^<^<^<
) else (
  echo       .dsh\.credentials.yaml present
)

echo.
echo Setup complete.
endlocal
