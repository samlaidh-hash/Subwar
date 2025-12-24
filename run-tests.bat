@echo off
echo Starting Playwright Tests...
echo.
cd /d "%~dp0"

echo Running sonar-quick tests...
call npx playwright test tests/sonar-quick.spec.js --reporter=list

echo.
echo Running sonar-system tests...
call npx playwright test tests/sonar-system.spec.js --reporter=list

echo.
echo Tests complete!
pause


