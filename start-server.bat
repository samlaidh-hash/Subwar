@echo off
echo Starting HTTP Server on port 8000...
echo Press Ctrl+C to stop
echo.
cd /d "%~dp0"
python -m http.server 8000

