@echo off
setlocal
title SkillTrack - MongoDB Skill Gap Engine

echo ========================================================
echo Starting Personalized Skill Gap Recognition System
echo Database Systems Lab - BCSE302P - MongoDB Engine
echo ========================================================
echo.

:: 1. Navigate dynamically to script directory
cd /d "%~dp0"

:: 2. Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 goto :no_node

:: 3. Check for node_modules (first-time ZIP extraction / clone)
if not exist "node_modules\" goto :first_time_setup
goto :check_docker

:first_time_setup
echo [1/3] First-time run detected: Installing npm dependencies...
call npm install
echo.
echo [2/3] Populating initial database collections (Roles, Skills, Courses)...
call npm run seed
echo.
goto :check_docker

:check_docker
echo [2/3] Checking MongoDB Docker service...
where docker >nul 2>nul
if errorlevel 1 goto :start_server
docker start skilltracker-mongo >nul 2>nul
goto :start_server

:start_server
echo [3/3] Starting Express Server with TypeScript...
echo ========================================================
echo Application is live at: http://localhost:4000
echo Open http://localhost:4000 in your browser!
echo Press Ctrl + C to stop the server anytime.
echo ========================================================
echo.
call npm start
goto :end

:no_node
echo.
echo [ERROR] Node.js is not found on your system!
echo Please download and install Node.js from https://nodejs.org/
echo After installing Node.js, run this file again.
echo.
pause
exit /b 1

:end
pause
