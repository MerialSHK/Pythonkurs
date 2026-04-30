@echo off
setlocal enableextensions
chcp 65001 >NUL 2>&1

REM --- Zum Skript-Verzeichnis wechseln ---
cd /d "%~dp0"

REM --- Fehler-Fallback: Bei unerwartetem Abbruch trotzdem anhalten ---
if not "%~1"=="__inner__" (
    cmd /c "%~f0" __inner__
    echo.
    echo  Drücke eine beliebige Taste zum Schließen...
    pause >NUL
    exit /b
)

echo.
echo  =============================================
echo   Algorithmics Python Play - Setup
echo  =============================================
echo.
echo  Dieses Skript installiert alles was du brauchst.
echo  Es lädt Software aus dem Internet herunter.
echo.

REM --- Python finden ---
set PYTHON_CMD=

REM Versuch 1: py launcher (am zuverlässigsten auf Windows)
py --version >NUL 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py
    goto :found_python
)

REM Versuch 2: python
python --version >NUL 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python
    goto :found_python
)

REM Versuch 3: python3
python3 --version >NUL 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=python3
    goto :found_python
)

REM Python nicht gefunden
echo  [FEHLER] Python wurde nicht gefunden!
echo.
echo  Mögliche Lösungen:
echo    1. Python installieren: https://www.python.org/downloads/
echo       WICHTIG: "Add Python to PATH" anhaken!
echo    2. Python aus dem Microsoft Store installieren
echo    3. Den Lehrer fragen
echo.
pause
exit /b 1

:found_python
echo  [OK] Python gefunden: %PYTHON_CMD%
%PYTHON_CMD% --version
echo.

REM --- pip prüfen ---
%PYTHON_CMD% -m pip --version >NUL 2>&1
if errorlevel 1 (
    echo  pip nicht gefunden, versuche Installation...
    %PYTHON_CMD% -m ensurepip --default-pip 2>&1
    if errorlevel 1 (
        echo  [FEHLER] pip konnte nicht installiert werden.
        echo  Bitte den Lehrer fragen.
        pause
        exit /b 1
    )
)
echo  [OK] pip gefunden.
echo.

REM --- VS Code prüfen/installieren ---
echo  =============================================
echo   VS Code prüfen...
echo  =============================================
echo.

code --version >NUL 2>&1
if not errorlevel 1 (
    echo  [OK] VS Code ist bereits installiert.
    goto :vscode_extensions
)

echo  VS Code nicht gefunden. Versuche Installation...
echo.

REM Versuch mit winget
winget --version >NUL 2>&1
if errorlevel 1 (
    echo  [INFO] winget nicht verfügbar.
    echo  Bitte VS Code manuell installieren:
    echo    https://code.visualstudio.com/download
    echo.
    echo  Drücke eine Taste um fortzufahren ^(VS Code ist optional^)...
    pause >NUL
    goto :setup_venv
)

echo  Installiere VS Code mit winget...
winget install -e --id Microsoft.VisualStudioCode --accept-package-agreements --accept-source-agreements 2>NUL
if errorlevel 1 (
    echo.
    echo  [WARNUNG] VS Code konnte nicht automatisch installiert werden.
    echo  Möglicherweise fehlen die Berechtigungen auf diesem PC.
    echo  Bitte manuell installieren: https://code.visualstudio.com/download
    echo.
    echo  Drücke eine Taste um fortzufahren...
    pause >NUL
    goto :setup_venv
)

echo  [OK] VS Code wurde installiert!
echo.

REM Pfad neu laden damit 'code' verfügbar wird
set "PATH=%PATH%;%LOCALAPPDATA%\Programs\Microsoft VS Code\bin"

:vscode_extensions
echo  Installiere Python-Extension für VS Code...
code --install-extension ms-python.python --force >NUL 2>&1
if not errorlevel 1 (
    echo  [OK] Python-Extension installiert.
) else (
    echo  [INFO] Extension konnte nicht installiert werden.
    echo  Du kannst sie später manuell in VS Code installieren.
)
echo.

REM --- Virtuelle Umgebung erstellen ---
:setup_venv
echo  =============================================
echo   Virtuelle Umgebung einrichten...
echo  =============================================
echo.

REM Prüfe ob venv existiert und funktioniert
if exist "venv\Scripts\python.exe" (
    "venv\Scripts\python.exe" -c "import sys" >NUL 2>&1
    if not errorlevel 1 (
        echo  [OK] Virtuelle Umgebung existiert und funktioniert.
        goto :activate_venv
    )
    echo  [INFO] Virtuelle Umgebung ist beschädigt. Erstelle neu...
    rmdir /s /q venv >NUL 2>&1
)

echo  Erstelle virtuelle Umgebung...
%PYTHON_CMD% -m venv venv
if errorlevel 1 (
    echo  [FEHLER] Virtuelle Umgebung konnte nicht erstellt werden.
    echo  Bitte den Lehrer fragen.
    pause
    exit /b 1
)
if not exist "venv\Scripts\activate.bat" (
    echo  [FEHLER] Virtuelle Umgebung wurde nicht richtig erstellt.
    echo  Bitte den Lehrer fragen.
    pause
    exit /b 1
)
echo  [OK] Virtuelle Umgebung erstellt.
echo.

:activate_venv
REM --- venv aktivieren ---
call venv\Scripts\activate.bat
"venv\Scripts\python.exe" -c "import sys; assert 'venv' in sys.prefix" >NUL 2>&1
if errorlevel 1 (
    echo  [FEHLER] Virtuelle Umgebung konnte nicht aktiviert werden.
    echo  Bitte den Lehrer fragen.
    pause
    exit /b 1
)

REM --- Pakete installieren ---
echo  Installiere Pakete in virtuelle Umgebung...
echo.
echo  [1/3] pip aktualisieren...
python -m pip install --upgrade pip 2>&1
if errorlevel 1 (
    echo  [WARNUNG] pip konnte nicht aktualisiert werden. Fortfahren...
)

echo.
echo  [2/3] pygame installieren...
python -m pip install pygame 2>&1
if errorlevel 1 (
    echo  [WARNUNG] pygame Installation fehlgeschlagen.
    echo  Prüfe deine Internetverbindung.
)

echo.
echo  [3/3] replit-play installieren...
python -m pip install replit-play 2>&1
if errorlevel 1 (
    echo  [WARNUNG] replit-play Installation fehlgeschlagen.
    echo  Prüfe deine Internetverbindung.
)

echo.

REM --- Testen ---
echo  =============================================
echo   Test...
echo  =============================================
echo.

python -c "import play; print('  [OK] Play ist installiert und funktioniert!')" 2>&1
if errorlevel 1 (
    echo.
    echo  [FEHLER] Play konnte nicht importiert werden.
    echo  Mögliche Ursache: Keine Internetverbindung oder
    echo  fehlende Berechtigungen.
    echo.
    echo  Installierte Pakete:
    python -m pip list 2>&1
    echo.
    echo  Bitte den Lehrer um Hilfe.
) else (
    echo.
    echo  =============================================
    echo   Alles bereit! Du kannst jetzt loslegen.
    echo.
    echo   Nächster Schritt:
    echo   1. Öffne main.py in VS Code
    echo   2. Starte mit: start.bat
    echo  =============================================
)

echo.
