@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "PORT=8001"
if not "%~1"=="" set "PORT=%~1"

set "PY="
where python >nul 2>nul && set "PY=python"
if not defined PY where py >nul 2>nul && set "PY=py"
if not defined PY goto NOPYTHON

echo.
echo ============================================================
echo   Archimag Code - local server
echo   Open in browser: http://localhost:%PORT%/
echo   Press Ctrl+C in this window to stop the server
echo ============================================================
echo.

start "" /min cmd /c "ping -n 3 127.0.0.1 >nul & start http://localhost:%PORT%/"

%PY% server.py %PORT%
echo.
echo Server stopped.
pause
exit /b 0

:NOPYTHON
echo Python 3 was not found.
echo Install it from https://www.python.org/downloads/
echo Important: enable Add Python to PATH during setup.
pause
exit /b 1
