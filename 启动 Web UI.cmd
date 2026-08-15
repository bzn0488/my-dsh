@echo off
rem DeepSeek Harness - 一键启�?Web UI
set "DSH_HOME=E:\Deepseek Harness\.dsh"
set "DSH_AGENTS_HOME=E:\Deepseek Harness\.agents"
start "" "http://127.0.0.1:3080"
cd /d "E:\Deepseek Harness"
"E:\Deepseek Harness\node_modules\.bin\dsh.cmd" web
