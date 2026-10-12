@echo off
setlocal EnableDelayedExpansion

title Automated Job Pipeline - Backend
cd /d "%~dp0backend"

echo ============================================================================
echo           Automated Job Pipeline - FastAPI Backend Server
echo ============================================================================
echo.

set "PYTHON_EXEC="
if exist "%~dp0backend\venv\Scripts\python.exe" (
    "%~dp0backend\venv\Scripts\python.exe" --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_EXEC=%~dp0backend\venv\Scripts\python.exe"
        echo [OK] Using Virtual Environment: backend\venv
    )
)

if not defined PYTHON_EXEC (
    python --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_EXEC=python"
        echo [OK] Using System Python
    ) else (
        echo [ERROR] Python not found!
        pause
        exit /b 1
    )
)

echo Starting FastAPI Backend on http://localhost:8000 ...
echo Swagger documentation will be available at http://localhost:8000/docs
echo.

"!PYTHON_EXEC!" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server exited with code %errorlevel%
    pause
)
