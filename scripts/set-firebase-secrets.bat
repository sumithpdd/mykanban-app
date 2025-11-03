@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Path to env file
set ENV_FILE=.env.local
if not exist "%ENV_FILE%" (
  echo .env.local not found in current directory.
  echo Run this from your project root where .env.local exists.
  exit /b 1
)

REM Load key=val lines from .env.local (skip comments and blanks)
for /f "usebackq tokens=1,2 delims==" %%A in (`findstr /r /b /c:"[A-Za-z0-9_][A-Za-z0-9_]*=" "%ENV_FILE%"`) do (
  set "%%A=%%B"
)

REM Helper to set a secret if variable exists
call :set_secret NEXTAUTH_URL
call :set_secret NEXTAUTH_SECRET
call :set_secret GOOGLE_CLIENT_ID
call :set_secret GOOGLE_CLIENT_SECRET

call :set_secret NEXT_PUBLIC_FIREBASE_API_KEY
call :set_secret NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
call :set_secret NEXT_PUBLIC_FIREBASE_PROJECT_ID
call :set_secret NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
call :set_secret NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
call :set_secret NEXT_PUBLIC_FIREBASE_APP_ID

call :set_secret NEXT_PUBLIC_TINYMCE_API_KEY

echo.
echo Done. If you changed NEXTAUTH_URL after first deploy, re-run this script and then:
echo   firebase deploy --only functions
exit /b 0

:set_secret
set "KEY=%~1"
for /f "tokens=*" %%V in ("!%KEY%!" ) do set "VAL=%%~V"
if not defined VAL (
  echo Skipping %KEY% (not set in .env.local)
  goto :eof
)
echo Setting secret %KEY% ...
REM Use PowerShell here-string to avoid quoting issues
powershell -NoProfile -Command ^
  "$v = [System.Environment]::GetEnvironmentVariable('%KEY%','Process'); ^
   if(-not $v){ $v = '%VAL%'}; ^
   firebase functions:secrets:set %KEY% --data \"$v\" | Out-Null"
echo %KEY% set.
set "VAL="
goto :eof
