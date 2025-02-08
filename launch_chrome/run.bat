@echo off
setlocal enabledelayedexpansion

:: Set default values in case config file is missing
set "USERNAME="
set "SCREEN_POS=1900"
set "USER_DATA_DIR=%USERPROFILE%\Documents\ChromeUserData"
set "URL=https://mayabet2.pythonanywhere.com/api/"
@REM set "URL=127.0.0.1:8000/api/"
set "CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe"

:: Read config file if it exists
if exist "config.txt" (
    for /f "tokens=1,* delims==" %%A in (config.txt) do (
        set "%%A=%%B"
    )
) else (
    echo ERROR: config.txt not found!
    pause
    exit /b
)

:: Validate Username
if "%USERNAME%"=="" (
    echo ERROR: Username is missing in config.txt!
    pause
    exit /b
)

:: Validate Chrome Path
if not exist "%CHROME_PATH%" (
    echo ERROR: Chrome not found at %CHROME_PATH%!
    pause
    exit /b
)

:: Build Chrome launch command
set "FULL_URL=%URL%?username=%USERNAME%"
set "OPTIONS=--start-fullscreen --kiosk --incognito --disable-notifications --disable-extensions --window-position=%SCREEN_POS%,0 --user-data-dir=%USER_DATA_DIR%"

:: Launch Chrome
start "" "%CHROME_PATH%" %OPTIONS% "%FULL_URL%"

exit
