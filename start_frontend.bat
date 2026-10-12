@echo off
title Automated Job Pipeline - Frontend
cd /d "%~dp0frontend"

echo ============================================================================
echo           Automated Job Pipeline - Next.js 3D Frontend UI
echo ============================================================================
echo.

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not found on PATH!
    pause
    exit /b 1
)

if not exist "%~dp0frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
)

echo Starting Next.js Dev Server on http://localhost:3000 ...
echo.

call npm run dev
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Next.js dev server exited with code %errorlevel%
    pause
)
