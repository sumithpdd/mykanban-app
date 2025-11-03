@echo off
setlocal EnableExtensions

REM Move to repository root (this script lives in scripts\)
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%.." || (
  echo [deploy] ERROR: Unable to change to repo root from %SCRIPT_DIR%
  exit /b 1
)

REM Ensure a rules file is present (default to prod)
if not exist firestore.rules (
  if exist firestore.prod.rules (
    copy /Y firestore.prod.rules firestore.rules >nul
    echo [deploy] Using firestore.prod.rules -> firestore.rules
  ) else if exist firestore.dev.rules (
    copy /Y firestore.dev.rules firestore.rules >nul
    echo [deploy] Using firestore.dev.rules -> firestore.rules
  ) else (
    echo [deploy] ERROR: No firestore.rules, firestore.prod.rules, or firestore.dev.rules found.
    exit /b 1
  )
)

REM Show which project is active
firebase projects:list 1>nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [deploy] You may need to run: firebase login
)

REM Deploy everything (framework-aware Hosting + rules)
powershell -NoProfile -Command "firebase deploy"

endlocal
