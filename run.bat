@echo off
echo ========================================================
echo Starting Personalized Skill Gap Recognition System
echo Database Systems Lab (BCSE302P) - MongoDB Engine
echo ========================================================
echo.
echo [1/3] Starting MongoDB Docker container (skilltracker-mongo)...
docker start skilltracker-mongo
echo.
echo [2/3] Changing to project directory...
cd /d C:\Users\thara\projects\skill-gap-tracker
echo.
echo [3/3] Starting Express Server with TypeScript...
echo Application will be live at: http://localhost:4000
echo Press Ctrl + C to stop the server anytime.
echo.
npm start
