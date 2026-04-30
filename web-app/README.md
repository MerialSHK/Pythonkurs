# Python Spiele-Kurs — Webplattform

Eine browserbasierte Lernplattform für 12 Schüler:innen. Keine Installation,
kein VS Code, kein Python-Setup nötig.

## Was ist das?

Statt jede Stunde mit Setup-Problemen zu kämpfen, läuft der Kurs direkt
im Browser. Jeder Schüler hat ein eigenes Profil, läuft durch 5 Level
und schreibt dabei kleinen Python-Code, dessen Ergebnis live im
Vorschau-Fenster sichtbar wird.

- **Level 1** — Tipp-Modus: Code Zeichen für Zeichen abtippen
- **Level 2** — Sprites: Text, Kreis und Box hinzufügen
- **Level 3** — Bewegung: vier Pfeiltasten programmieren
- **Level 4** — Punkte sammeln: Grenzen + Score
- **Level 5** — Mini-Spiel: Kollision + Zufallszahlen

Designziel: in einer 90-Minuten-Einheit komplett durchspielbar.

## Schnellstart

Die Plattform ist eine reine HTML-/CSS-/JS-Anwendung — keine Pakete,
keine Build-Tools.

### Variante A — über lokalen Webserver (empfohlen)

```bash
cd web-app
npx http-server -p 8080
```

Browser öffnen: http://localhost:8080

### Variante B — direkt im Browser

`web-app/index.html` doppelklicken. (Funktioniert in den meisten
Browsern; einige verbieten allerdings `localStorage` bei `file://` —
in dem Fall Variante A nutzen.)

## Anmeldung

Es gibt 12 fertige Profile (Anna, Ben, Clara, David, Emma, Felix,
Greta, Hannes, Ida, Jonas, Klara, Leo). Jedes Profil meldet sich mit
dem gleichen Passwort an: **`python`**.

Profile lassen sich in `js/app.js` ändern:

```js
const STUDENTS = ['Anna', 'Ben', /* ... */];
const PASSWORD = 'python';
```

## Wie funktioniert das technisch?

- **Editor + Vorschau** — Schüler schreiben Python-ähnlichen Code im
  linken Panel. Mit *Ausführen* (oder `Ctrl+Enter`) wird der Code
  durch einen Mini-Transpiler nach JavaScript übersetzt und im
  Canvas rechts ausgeführt.
- **`play`-Library im Browser** — `js/playlib.js` ist eine kleine,
  Canvas-basierte Nachbildung der Python-Library `play`. Sie versteht
  `play.new_text`, `play.new_circle`, `play.new_box`, `play.repeat_forever`,
  `play.key_is_pressed`, Kollisionen, Zufallszahlen.
- **Transpiler** — `js/transpiler.js` versteht das Subset von Python,
  das im Kurs gebraucht wird (Variablen, `if`/`elif`/`else`, Decorators,
  `def`/`async def`, Keyword-Argumente).
- **Validierung** — Pro Level prüft eine Funktion in `js/levels.js`,
  ob der Schüler-Code die richtigen Patterns enthält. Bei Erfolg wird
  das Level als gelöst markiert und das nächste freigeschaltet.
- **Fortschritt** — wird in `localStorage` pro Profil gespeichert. Auch
  der Code, den der Schüler schreibt, wird live mitgespeichert.

## Datei-Übersicht

```
web-app/
├── index.html           # Haupt-Seite
├── css/styles.css       # Komplettes Styling
└── js/
    ├── playlib.js       # Canvas-Implementierung der play-Library
    ├── transpiler.js    # Python -> JavaScript
    ├── levels.js        # Level-Definitionen + Validatoren
    └── app.js           # Routing, Login, Editor, State
```

## Browser-Anforderungen

Moderne Browser (Chrome, Firefox, Edge, Safari) ab 2020. Tastatur-Eingabe
und Canvas2D werden gebraucht. Internet wird **nicht** gebraucht.

## Tipps für den Unterricht

- Vor dem Unterricht: Server starten (Variante A), URL den Schülern
  geben (oder Browser-Bookmark vorbereiten).
- Schüler:innen können jederzeit über *Levelkarte* zurück und ein
  Level erneut spielen — der Code bleibt gespeichert.
- *Neu starten* setzt nur das aktuelle Profil zurück.
- *Tipp anzeigen* gibt einen schriftlichen Hinweis pro Aufgabe.
