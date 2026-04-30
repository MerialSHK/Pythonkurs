@echo off
chcp 65001 >NUL 2>&1

REM --- Zum Skript-Verzeichnis wechseln ---
cd /d "%~dp0"

echo.
echo  Starte Python Spiele-Kurs...
echo.

REM --- Python finden ---
set PYTHON_CMD=

py --version >NUL 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py
    goto :found_python
)

python --version >NUL 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python
    goto :found_python
)

python3 --version >NUL 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python3
    goto :found_python
)

echo  [FEHLER] Python wurde nicht gefunden!
echo  Bitte zuerst setup.bat ausführen.
echo.
pause
exit /b 1

:found_python

REM --- Prüfe ob main.py existiert ---
if not exist "main.py" (
    echo  [FEHLER] main.py nicht gefunden!
    echo  Die Datei muss im selben Ordner wie start.bat sein.
    echo.
    pause
    exit /b 1
)

REM --- Schneller Syntax-Check (vor venv, für schnelles Feedback) ---
%PYTHON_CMD% -m py_compile main.py >NUL 2>&1
if errorlevel 1 (
    echo.
    echo  [FEHLER] Es gibt einen Fehler in main.py!
    echo  Hier ist die Fehlermeldung:
    echo.
    %PYTHON_CMD% -m py_compile main.py 2>&1
    echo.
    echo  TIPP: Drücke Strg+Z in VS Code um rückgängig zu machen.
    echo  Oder starte reset.bat um main.py zurückzusetzen.
    echo.
    pause
    exit /b 1
)

REM --- Virtuelle Umgebung prüfen/erstellen ---
if exist "venv\Scripts\python.exe" (
    "venv\Scripts\python.exe" -c "import sys" >NUL 2>&1
    if not errorlevel 1 (
        goto :activate_venv
    )
    echo  Virtuelle Umgebung beschädigt, erstelle neu...
    rmdir /s /q venv >NUL 2>&1
)

REM --- venv erstellen ---
echo  Erstelle virtuelle Umgebung...
%PYTHON_CMD% -m venv venv
if errorlevel 1 (
    echo  [FEHLER] Virtuelle Umgebung konnte nicht erstellt werden.
    echo  Bitte zuerst setup.bat ausführen.
    pause
    exit /b 1
)
if not exist "venv\Scripts\activate.bat" (
    echo  [FEHLER] Virtuelle Umgebung wurde nicht richtig erstellt.
    echo  Bitte zuerst setup.bat ausführen.
    pause
    exit /b 1
)

:activate_venv
call venv\Scripts\activate.bat

REM --- Pakete prüfen/installieren ---
python -c "import play" >NUL 2>&1
if errorlevel 1 (
    echo  Installiere benötigte Pakete...
    if not exist "requirements.txt" (
        echo  [FEHLER] requirements.txt nicht gefunden!
        echo  Bitte zuerst setup.bat ausführen.
        pause
        exit /b 1
    )
    python -m pip install -r requirements.txt 2>&1
    python -c "import play" >NUL 2>&1
    if errorlevel 1 (
        echo.
        echo  [FEHLER] Pakete konnten nicht installiert werden.
        echo  Bitte zuerst setup.bat ausführen.
        echo.
        pause
        exit /b 1
    )
)

REM --- Programm starten ---
echo  [OK] Alles bereit! Fenster öffnet sich...
echo.
python main.py 2>&1

if errorlevel 1 (
    echo.
    echo  [FEHLER] Das Programm ist abgestürzt.
    echo  Prüfe deinen Code in main.py!
    echo  TIPP: Strg+Z in VS Code oder reset.bat starten.
    echo.
)
pause
