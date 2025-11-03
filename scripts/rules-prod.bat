@echo off
setlocal EnableExtensions

if not exist firestore.prod.rules (
  echo firestore.prod.rules not found in %cd%
  exit /b 1
)
copy /Y firestore.prod.rules firestore.rules >nul
echo Switched rules to PROD (secure) -> firestore.rules

powershell -NoProfile -Command "firebase deploy --only 'firestore'"

endlocal

