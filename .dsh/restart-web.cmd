@echo off
rem One-shot restart of dsh web pointed at the E: data home (E:\Deepseek Harness\.dsh).
rem Launched detached so it survives the harness process being killed.
rem 1) wait so the running harness can deliver the final message;
rem 2) sync the current conversation session from the stray ~/.dsh home into E:;
rem 3) stop whatever listens on :3080; 4) start dsh web with DSH_HOME set.
schtasks /delete /tn dsh-restart-web /f >nul 2>&1
echo [restart] script started %date% %time% >> "E:\Deepseek Harness\.dsh\restart.log"
ping -n 21 127.0.0.1 >nul
echo [restart] syncing current session into E: home %date% %time% >> "E:\Deepseek Harness\.dsh\restart.log"
if not exist "E:\Deepseek Harness\.dsh\sessions\--E-Deepseek~0020Harness--\session-0792c992-baa3-4b94-b37a-71fa0259e61b" mkdir "E:\Deepseek Harness\.dsh\sessions\--E-Deepseek~0020Harness--\session-0792c992-baa3-4b94-b37a-71fa0259e61b"
copy /Y "C:\Users\Oabuser\.dsh\sessions\--E-Deepseek~0020Harness--\session-0792c992-baa3-4b94-b37a-71fa0259e61b\session.jsonl.zstd" "E:\Deepseek Harness\.dsh\sessions\--E-Deepseek~0020Harness--\session-0792c992-baa3-4b94-b37a-71fa0259e61b\session.jsonl.zstd" >> "E:\Deepseek Harness\.dsh\restart.log" 2>&1
echo [restart] stopping current dsh web %date% %time% >> "E:\Deepseek Harness\.dsh\restart.log"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3080" ^| findstr "LISTENING"') do taskkill /F /PID %%p >> "E:\Deepseek Harness\.dsh\restart.log" 2>&1
ping -n 3 127.0.0.1 >nul
cd /d "E:\Deepseek Harness"
set DSH_HOME=E:\Deepseek Harness\.dsh
set "DSH_AGENTS_HOME=E:\Deepseek Harness\.agents"
echo [restart] starting dsh web %date% %time% >> "E:\Deepseek Harness\.dsh\restart.log"
start "" "http://127.0.0.1:3080"
"E:\Deepseek Harness\node_modules\.bin\dsh.cmd" web >> "E:\Deepseek Harness\.dsh\restart.log" 2>&1
echo [restart] dsh web exited %date% %time% >> "E:\Deepseek Harness\.dsh\restart.log"
