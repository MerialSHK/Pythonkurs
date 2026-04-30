@echo off
chcp 65001 >NUL 2>&1
echo.
echo  =============================================
echo   main.py zurücksetzen
echo  =============================================
echo.

if not exist "main_original.py" (
    echo  [FEHLER] main_original.py nicht gefunden!
    echo  Die Original-Datei fehlt. Bitte den Lehrer fragen.
    echo.
    pause
    exit /b 1
)

echo  ACHTUNG: Deine Änderungen in main.py gehen verloren!
echo.
set /p antwort="Willst du main.py wirklich zurücksetzen? (j/n): "
if /i not "%antwort%"=="j" (
    echo  Abgebrochen.
    pause
    exit /b 0
)

copy /y "main_original.py" "main.py" >NUL
echo.
echo  [OK] main.py wurde zurückgesetzt!
echo  Du kannst jetzt wieder von vorne anfangen.
echo.
pause
