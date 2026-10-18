@echo off
setlocal
title SkillTrack - MongoDB Skill Gap Engine

echo ========================================================
echo Starting Personalized Skill Gap Recognition System
echo Database Systems Lab (BCSE302P) - MongoDB Engine
echo ========================================================
echo.

:: 1. Navigate dynamically to the directory where this script is located
cd /d "%~dp0"

:: 2. Check for Node.js installation
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found on your system!
    echo Please install Node.js (v18+) from https://nodejs.org/ to run this project.
    echo.
    pause
    exit /b 1
)

:: 3. Automatically install dependencies and seed if node_modules is missing (first-time clone)
if not exist "node_modules\" (
    echo [1/3] First-time run detected: Installing required npm dependencies...
    call npm install
    echo.
    echo [2/3] Populating initial database collections (Roles, Skills, Courses)...
    call npm run seed
    echo.
) else (
    echo [1/3] Dependencies verified.
)

:: 4. Attempt to start Docker container if Docker is installed and container exists
echo [2/3] Checking MongoDB service...
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    docker ps -a --format "{{.Names}}" 2>nul | findstr /i "skilltracker-mongo" >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Starting Docker container (skilltracker-mongo)...
        docker start skilltracker-mongo >nul 2>nul
    )
)

:: 5. Launch the Express server
echo [3/3] Starting Express Server with TypeScript...
echo ========================================================
echo Application is live at: http://localhost:4000
echo Open http://localhost:4000 in your browser!
echo Press Ctrl + C to stop the server anytime.
echo ========================================================
echo.

call npm start
pause
