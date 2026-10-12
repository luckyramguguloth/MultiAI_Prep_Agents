@echo off
setlocal EnableDelayedExpansion

:: ============================================================================
:: Automated Job Pipeline - Master Launcher
:: Launches FastAPI Backend (Port 8000) and Next.js Frontend (Port 3000)
:: ============================================================================

title Automated Job Pipeline Launcher
cd /d "%~dp0"

echo ============================================================================
echo           Multi-Agent AI Job Preparation Pipeline Launcher
echo ============================================================================
echo.

:: 1. Verify Prerequisites - Python
echo [1/4] Checking Python environment...
set "PYTHON_EXEC="

if exist "%~dp0backend\venv\Scripts\python.exe" (
    "%~dp0backend\venv\Scripts\python.exe" --version >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_EXEC=%~dp0backend\venv\Scripts\python.exe"
        echo  [OK] Using Backend Virtual Environment: backend\venv
    )
)

if not defined PYTHON_EXEC (
    python --version >nul 2>&1
    if not errorlevel 1 (
        set "PYTHON_EXEC=python"
        echo  [OK] Using System Python
    )
)

if not defined PYTHON_EXEC (
    py --version >nul 2>&1
    if not errorlevel 1 (
        set "PYTHON_EXEC=py"
        echo  [OK] Using Python Launcher (py)
    )
)

if not defined PYTHON_EXEC (
    echo  [ERROR] Python is not found on your system!
    echo         Please install Python 3.10+ and add it to your PATH.
    echo.
    pause
    exit /b 1
)

:: 2. Verify Prerequisites - Node.js and npm
echo [2/4] Checking Node.js and npm...
where node >nul 2>&1
if !errorlevel! neq 0 (
    echo  [ERROR] Node.js is not found on your PATH!
    echo         Please install Node.js 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if !errorlevel! neq 0 (
    echo  [ERROR] npm is not found on your PATH!
    echo.
    pause
    exit /b 1
)
echo  [OK] Node.js and npm detected.

:: 3. Prepare Environment and Dependencies
echo [3/4] Checking project dependencies and config...

:: Check backend .env
if not exist "%~dp0backend\.env" (
    if exist "%~dp0backend\.env.example" (
        echo  [INFO] backend\.env not found. Creating from .env.example...
        copy "%~dp0backend\.env.example" "%~dp0backend\.env" >nul
    )
)

:: Check frontend node_modules
if not exist "%~dp0frontend\node_modules" (
    echo  [INFO] frontend\node_modules missing. Installing npm packages...
    cd /d "%~dp0frontend"
    call npm install
    if !errorlevel! neq 0 (
        echo  [ERROR] npm install failed!
        cd /d "%~dp0"
        pause
        exit /b 1
    )
    cd /d "%~dp0"
)
echo  [OK] Dependencies verified.

:: Check for port conflicts
netstat -ano 2>nul | findstr /R /C:":8000 .*LISTENING" >nul
if !errorlevel! equ 0 (
    echo  [WARN] Port 8000 is already in use. A backend instance may already be running.
)

netstat -ano 2>nul | findstr /R /C:":3000 .*LISTENING" >nul
if !errorlevel! equ 0 (
    echo  [WARN] Port 3000 is already in use. A frontend instance may already be running.
)

:: 4. Start Services in Separate Windows
echo [4/4] Starting Backend and Frontend services...
echo.

:: Launch Backend Window
echo  Launching Backend (FastAPI on Port 8000)...
start "Automated Job Pipeline - Backend (Port 8000)" cmd /k "cd /d """%~dp0backend""" && title Backend Server (Port 8000) && echo ======================================== && echo  Automated Job Pipeline - FastAPI Backend  && echo ======================================== && echo Starting server on http://localhost:8000 ... && echo. && """!PYTHON_EXEC!""" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload || (echo. && echo [ERROR] Backend terminated with exit code %%errorlevel%% && pause)"

:: Launch Frontend Window
echo  Launching Frontend (Next.js on Port 3000)...
start "Automated Job Pipeline - Frontend (Port 3000)" cmd /k "cd /d """%~dp0frontend""" && title Frontend Dashboard (Port 3000) && echo ======================================== && echo  Automated Job Pipeline - Next.js 3D UI     && echo ======================================== && echo Starting dev server on http://localhost:3000 ... && echo. && npm run dev || (echo. && echo [ERROR] Frontend dev server terminated with exit code %%errorlevel%% && pause)"

echo.
echo ============================================================================
echo  Services started in dedicated terminal windows!
echo.
echo   * Frontend 3D Dashboard: http://localhost:3000
echo   * Backend API:           http://localhost:8000
echo   * Backend Swagger Docs:  http://localhost:8000/docs
echo ============================================================================
echo.
echo Waiting 4 seconds for services to initialize...
timeout /t 4 /nobreak >nul 2>&1

:: Open browser automatically
echo Opening dashboard in default browser...
start http://localhost:3000

echo.
echo Launcher is ready. You can keep this window open or close it at any time.
echo (The backend and frontend will continue running in their own windows.)
echo.
pause
