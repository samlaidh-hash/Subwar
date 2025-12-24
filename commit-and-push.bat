@echo off
echo Committing and pushing changes...
cd /d "%~dp0"
git add -A
git commit -m "Disable ambient sounds and engine humming, fix mouse control and test suite"
git push origin main
echo Done!
pause



