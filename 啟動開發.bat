@echo off
chcp 65001 >nul
title James Web 開發伺服器
cd /d "%~dp0"

echo.
echo   James Web 開發伺服器
echo   ----------------------------------------
echo.

rem === 找 Python ===
set "PY="
python -c "import sys" >nul 2>&1
if not errorlevel 1 set "PY=python"
if not defined PY (
  py -3 -c "import sys" >nul 2>&1
  if not errorlevel 1 set "PY=py -3"
)

if not defined PY (
  echo   [X] 這台電腦找不到 Python，沒辦法開伺服器。
  echo       到 https://www.python.org/downloads/ 裝一次，之後這支就能用。
  echo.
  pause
  exit /b 1
)

rem === 找一個沒被佔用的 port ===
set PORT=8000
:findport
netstat -ano | findstr ":%PORT% " | findstr "LISTENING" >nul 2>&1
if errorlevel 1 goto gotport
if %PORT% GEQ 8020 goto gotport
set /a PORT=%PORT%+1
goto findport
:gotport

echo   網址：http://localhost:%PORT%/
echo   改完檔案存檔，回瀏覽器按 Ctrl+F5 就會更新
echo   關掉這個黑色視窗 = 關掉伺服器
echo.

rem === 等伺服器起來再開瀏覽器 ===
start "" /b powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Milliseconds 1500; Start-Process 'http://localhost:%PORT%/'"

%PY% -m http.server %PORT% --bind 127.0.0.1

echo.
echo   伺服器已停止。
pause
