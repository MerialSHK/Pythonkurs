/* ================================================================
   presentation-data.js — Inhalte für den Präsentationsmodus
   ----------------------------------------------------------------
   Pro Kind / Spiel:
     - kid:       Name des Kindes laut Trainer-Leitfaden
     - game:      Spielname
     - level:     Level-ID in levels.js (liefert den lauffähigen Code)
     - emoji:     Symbol für die Karte
     - tagline:   Ein-Satz-Beschreibung
     - about:     Was ist das Spiel? (zum Vorlesen)
     - howToPlay: Steuerung / Spielziel
     - sayDemo:   Moderationstext für die Demo (Schritt 2)
     - sprites:   Die Figuren des Spiels + wofür sie da sind (Schritt 3)
     - code:      Code-Abschnitte mit Erklärung + Sprechtext (Schritt 4)
     - hardest:   Was am schwierigsten war (Schritt 5)
     - reserve:   true = Reserve-Spiel

   Der ausgeführte Demo-Code kommt IMMER aus levels.js (Single Source
   of Truth). Die `snippet`-Ausschnitte hier sind exakte Kopien aus
   der jeweiligen Lösung, damit Code und Erklärung zusammenpassen.
   ================================================================ */

(function (global) {
    'use strict';

    const PRESENTERS = [

        // =====================================================
        // PONG — Bergmann Patrick (Level 8)
        // =====================================================
        {
            level: 8,
            kid: 'Bergmann Patrick',
            game: 'Pong',
            emoji: '🏓',
            accent: '#4f6df5',
            tagline: 'Halte den Ball mit deinem Schläger im Spiel.',
            about: [
                'Pong ist eines der allerersten Computerspiele der Welt — über 50 Jahre alt!',
                'Ein Ball fliegt durchs Spielfeld. Mit deinem Schläger an der linken Seite musst du ihn zurückschlagen, bevor er hinten rausfliegt. Jeder Treffer gibt einen Punkt.'
            ],
            howToPlay: [
                { key: '↑', text: 'Schläger nach oben bewegen' },
                { key: '↓', text: 'Schläger nach unten bewegen' },
                { key: '🎯', text: 'Triff den Ball mit dem blauen Schläger — fliegt er links raus, fängt der Punktestand wieder bei 0 an.' }
            ],
            sayDemo: 'Das ist mein Spiel „Pong". Schau, der rote Ball fliegt los und prallt überall ab. Ich steuere den blauen Schläger mit den Pfeiltasten hoch und runter und muss den Ball treffen.',
            sprites: [
                { icon: '🔴', name: 'ball', role: 'Der rote Kreis, der durchs Feld fliegt. Er bewegt sich von allein.' },
                { icon: '🟦', name: 'schlaeger', role: 'Mein blauer Schläger links. Ihn steuere ich mit den Pfeiltasten.' },
                { icon: '⬜', name: 'wand', role: 'Die graue Wand rechts. An ihr prallt der Ball ab.' },
                { icon: '🔢', name: 'punkte', role: 'Der Text oben, der meine Punkte anzeigt.' }
            ],
            saySprites: 'In meinem Spiel gibt es vier Teile: den Ball, meinen Schläger, die Wand und die Punkte-Anzeige. Jeder Teil ist ein eigener „Sprite" — so heißen die Figuren in Python.',
            code: [
                {
                    title: 'Die Geschwindigkeits-Variablen',
                    snippet: 'ball_vx = 5\nball_vy = 3',
                    explain: 'Diese zwei Variablen sagen, wie schnell der Ball fliegt: ball_vx ist die Geschwindigkeit nach rechts/links, ball_vy nach oben/unten.',
                    say: 'Hier oben merke ich mir, wie schnell der Ball fliegt — einmal zur Seite und einmal nach oben/unten.'
                },
                {
                    title: 'Der Ball bewegt sich',
                    snippet: 'ball.x += ball_vx\nball.y += ball_vy',
                    explain: 'In jeder Runde wird die Geschwindigkeit auf die Position drauf­gerechnet. Dadurch fliegt der Ball.',
                    say: 'Jede Runde zähle ich die Geschwindigkeit zur Ball-Position dazu — so fliegt der Ball weiter.'
                },
                {
                    title: 'Oben und unten abprallen',
                    snippet: 'if ball.y > 200:\n    ball_vy = -abs(ball_vy)\nif ball.y < -200:\n    ball_vy = abs(ball_vy)',
                    explain: 'Wenn der Ball oben oder unten ankommt, wird die Richtung umgedreht. abs() macht den Wert immer positiv, das Minus davor immer negativ — so zeigt der Ball garantiert in die richtige Richtung.',
                    say: 'Wenn der Ball oben oder unten an die Wand kommt, drehe ich seine Richtung um — dann prallt er ab.'
                },
                {
                    title: 'Treffer mit dem Schläger',
                    snippet: "if ball.is_touching(schlaeger):\n    ball_vx = abs(ball_vx)\n    score += 1\n    punkte.words = 'Punkte: ' + str(score)",
                    explain: 'is_touching prüft, ob sich Ball und Schläger berühren. Wenn ja, fliegt der Ball wieder nach rechts und es gibt einen Punkt.',
                    say: 'Hier prüfe ich, ob der Ball meinen Schläger berührt. Wenn ja, schlage ich ihn zurück und bekomme einen Punkt.'
                }
            ],
            hardest: 'Am schwierigsten war das Abprallen. Ich musste verstehen, dass ich mit -abs() und abs() die Flugrichtung umdrehen kann, damit der Ball nicht durch die Wand fliegt.'
        },

        // =====================================================
        // STERNE FANGEN — Hollensteiner Katrin (Level 6)
        // =====================================================
        {
            level: 6,
            kid: 'Hollensteiner Katrin',
            game: 'Sterne fangen',
            emoji: '⭐',
            accent: '#f5b821',
            tagline: 'Fange die fallenden Sterne mit deinem Korb.',
            about: [
                'Von oben fallen Sterne herunter. Du bewegst einen Korb nach links und rechts und versuchst, sie aufzufangen.',
                'Jeder gefangene Stern gibt einen Punkt — und taucht dann an einer neuen, zufälligen Stelle wieder ganz oben auf.'
            ],
            howToPlay: [
                { key: '←', text: 'Korb nach links bewegen' },
                { key: '→', text: 'Korb nach rechts bewegen' },
                { key: '⭐', text: 'Fang den gelben Stern mit dem Korb auf, bevor er unten verschwindet.' }
            ],
            sayDemo: 'Mein Spiel heißt „Sterne fangen". Der gelbe Stern fällt von oben herunter und ich bewege den braunen Korb mit den Pfeiltasten, um ihn aufzufangen.',
            sprites: [
                { icon: '🟫', name: 'korb', role: 'Die braune Box unten. Sie ist mein Korb, den ich steuere.' },
                { icon: '⭐', name: 'stern', role: 'Der gelbe Stern, der von oben herunterfällt.' },
                { icon: '🔢', name: 'punkte', role: 'Der Text, der zählt, wie viele Sterne ich gefangen habe.' }
            ],
            saySprites: 'Es gibt drei Teile: meinen Korb, den Stern und die Punkte-Anzeige.',
            code: [
                {
                    title: 'Der Stern fällt',
                    snippet: 'stern.y -= 4',
                    explain: 'In jeder Runde wird die y-Position des Sterns kleiner — dadurch fällt er nach unten.',
                    say: 'Jede Runde mache ich die Höhe des Sterns kleiner — so fällt er herunter.'
                },
                {
                    title: 'Wenn der Stern unten verschwindet',
                    snippet: 'if stern.y < -220:\n    stern.y = 200\n    stern.x = play.random_number(-220, 220)',
                    explain: 'Fällt der Stern ganz unten raus, setze ich ihn wieder nach oben — an eine zufällige Stelle mit random_number.',
                    say: 'Wenn der Stern unten draußen ist, kommt er oben an einer zufälligen Stelle wieder rein.'
                },
                {
                    title: 'Stern gefangen!',
                    snippet: "if korb.is_touching(stern):\n    score += 1\n    punkte.words = 'Punkte: ' + str(score)\n    stern.y = 200\n    stern.x = play.random_number(-220, 220)",
                    explain: 'is_touching prüft, ob der Korb den Stern berührt. Wenn ja: ein Punkt mehr, und der Stern startet neu von oben.',
                    say: 'Hier prüfe ich mit is_touching, ob mein Korb den Stern berührt. Wenn ja, gibt es einen Punkt und der Stern startet zufällig neu.'
                }
            ],
            hardest: 'Am kniffligsten war, dass der Stern an einer zufälligen Stelle neu starten soll. Dafür habe ich play.random_number benutzt — das gibt jedes Mal eine andere Zahl.'
        },

        // =====================================================
        // EGG CATCHER — Klingesberger Constantin (Level 16)
        // =====================================================
        {
            level: 16,
            kid: 'Klingesberger Constantin',
            game: 'Egg Catcher',
            emoji: '🥚',
            accent: '#f08a3e',
            tagline: 'Fange möglichst viele fallende Eier mit dem Korb.',
            about: [
                'Immer wieder fällt ein neues Ei vom oberen Rand herunter. Mit dem Korb fängst du sie auf.',
                'Das Besondere: Es gibt nicht nur ein Ei, sondern viele gleichzeitig — sie werden alle in einer Liste gespeichert.'
            ],
            howToPlay: [
                { key: '←', text: 'Korb nach links' },
                { key: '→', text: 'Korb nach rechts' },
                { key: '🥚', text: 'Fang die weißen Eier auf — jedes gibt einen Punkt.' }
            ],
            sayDemo: 'Mein Spiel ist „Egg Catcher". Von oben fallen immer wieder neue Eier und ich fange sie mit dem braunen Korb. Jedes Ei zählt.',
            sprites: [
                { icon: '🟫', name: 'korb', role: 'Mein Korb, den ich mit den Pfeiltasten bewege.' },
                { icon: '🥚', name: 'eier', role: 'Eine Liste mit allen Eiern, die gerade fallen. Es können mehrere gleichzeitig sein.' },
                { icon: '🔢', name: 'score_text', role: 'Zeigt, wie viele Eier ich schon gefangen habe.' }
            ],
            saySprites: 'Der wichtigste Teil ist die Liste „eier". In einer Liste kann ich ganz viele Eier gleichzeitig speichern, nicht nur eins.',
            code: [
                {
                    title: 'Die Liste und der Zähler',
                    snippet: 'eier = []\nframe = 0',
                    explain: 'eier = [] ist eine leere Liste. Hier kommen später alle Eier rein. frame zählt die Runden mit.',
                    say: 'Oben lege ich eine leere Liste für die Eier an und einen Zähler namens frame.'
                },
                {
                    title: 'Alle 60 Runden ein neues Ei',
                    snippet: 'if frame % 60 == 0:\n    ei = play.new_circle(color=\'white\', x=randint(-240, 240), y=200, radius=15, border_color=\'gray\', border_width=2)\n    eier.append(ei)',
                    explain: 'frame % 60 == 0 ist nur alle 60 Runden wahr. Dann entsteht ein neues Ei und wird mit append() in die Liste gehängt.',
                    say: 'Alle 60 Runden erscheint ein neues Ei oben und ich hänge es mit append in meine Liste.'
                },
                {
                    title: 'Jedes Ei fällt und wird geprüft',
                    snippet: 'for ei in eier:\n    ei.y = ei.y - 3\n    if ei.is_touching(korb):\n        ei.hide()\n        eier.remove(ei)\n        score = score + 1\n        score_text.words = \'Eier: \' + str(score)',
                    explain: 'Die for-Schleife geht durch ALLE Eier. Jedes fällt ein Stück. Berührt eins den Korb, wird es versteckt, aus der Liste entfernt und es gibt einen Punkt.',
                    say: 'Mit der for-Schleife gehe ich durch jedes Ei: es fällt runter, und wenn es im Korb landet, fliegt es aus der Liste und ich kriege einen Punkt.'
                }
            ],
            hardest: 'Am schwierigsten war, dass es mehrere Eier gleichzeitig gibt. Ich musste mit einer for-Schleife jedes einzelne Ei prüfen und mit remove aus der Liste nehmen.'
        },

        // =====================================================
        // MAULWURF HAUEN — Kraml Marcel (Level 7)
        // =====================================================
        {
            level: 7,
            kid: 'Kraml Marcel',
            game: 'Maulwurf hauen',
            emoji: '🔨',
            accent: '#8a5a44',
            tagline: 'Klick den Maulwurf, bevor er wegspringt!',
            about: [
                'Ein Maulwurf taucht auf dem Spielfeld auf. Klick ihn so schnell wie möglich an!',
                'Bei jedem Treffer springt er sofort an eine neue, zufällige Stelle — und du musst ihn wieder erwischen.'
            ],
            howToPlay: [
                { key: '🖱️', text: 'Mit der Maus auf den braunen Maulwurf klicken' },
                { key: '⚡', text: 'Sei schnell — nach jedem Klick springt er woanders hin.' }
            ],
            sayDemo: 'Mein Spiel heißt „Maulwurf hauen". Ich klicke mit der Maus auf den braunen Maulwurf. Jedes Mal, wenn ich ihn treffe, springt er an eine andere Stelle.',
            sprites: [
                { icon: '🟤', name: 'maulwurf', role: 'Der braune Kreis. Ihn muss ich anklicken.' },
                { icon: '🔢', name: 'punkte', role: 'Zeigt meine Treffer an.' },
                { icon: '💬', name: 'hinweis', role: 'Der Text „Klick auf den Maulwurf!".' }
            ],
            saySprites: 'Es gibt den Maulwurf, die Punkte-Anzeige und einen Hinweis-Text.',
            code: [
                {
                    title: 'Auf einen Klick reagieren',
                    snippet: '@maulwurf.when_clicked\ndef getroffen():\n    global score',
                    explain: '@maulwurf.when_clicked ist ein „Dekorator". Er sorgt dafür, dass die Funktion getroffen() immer dann läuft, wenn man den Maulwurf anklickt.',
                    say: 'Mit @maulwurf.when_clicked sage ich Python: Immer wenn man den Maulwurf anklickt, soll diese Funktion laufen.'
                },
                {
                    title: 'Punkt zählen',
                    snippet: "score += 1\npunkte.words = 'Punkte: ' + str(score)",
                    explain: 'Bei jedem Treffer wird der Punktestand um 1 erhöht und die Anzeige aktualisiert.',
                    say: 'Bei jedem Treffer zähle ich einen Punkt dazu und zeige ihn an.'
                },
                {
                    title: 'Der Maulwurf springt weg',
                    snippet: 'maulwurf.x = play.random_number(-200, 200)\nmaulwurf.y = play.random_number(-130, 130)',
                    explain: 'random_number gibt eine zufällige Zahl. So springt der Maulwurf an eine neue, nicht vorhersehbare Stelle.',
                    say: 'Danach springt der Maulwurf mit random_number an eine zufällige Position — so wird es schwer.'
                }
            ],
            hardest: 'Am schwierigsten war zu verstehen, was global score bedeutet. Das brauche ich, damit ich den Punktestand von innerhalb der Klick-Funktion ändern darf.'
        },

        // =====================================================
        // SCHLANGE & APFEL — Petschenig Xaver (Level 9)
        // =====================================================
        {
            level: 9,
            kid: 'Petschenig Xaver',
            game: 'Schlange & Apfel',
            emoji: '🐍',
            accent: '#1a9b6e',
            tagline: 'Steuere die Schlange und sammle Äpfel ein.',
            about: [
                'Du steuerst eine Schlange durchs Spielfeld und musst Äpfel fressen.',
                'Mit jedem Apfel wächst die Schlange um ein Glied — und der Apfel erscheint an einer neuen, zufälligen Stelle.'
            ],
            howToPlay: [
                { key: '↑↓←→', text: 'Richtung der Schlange ändern' },
                { key: '🍎', text: 'Friss den Apfel — die Schlange wächst und du bekommst einen Punkt.' }
            ],
            sayDemo: 'Mein Spiel ist „Schlange & Apfel". Mit den Pfeiltasten gebe ich der Schlange eine Richtung. Wenn sie den Apfel frisst, wird sie länger.',
            sprites: [
                { icon: '🟢', name: 'kopf', role: 'Der dunkelgrüne Kopf der Schlange, den ich steuere.' },
                { icon: '🟩', name: 'seg1…seg5', role: 'Die Körperteile, die dem Kopf folgen. Pro Apfel wird eines mehr sichtbar.' },
                { icon: '🍎', name: 'apfel', role: 'Der Apfel, den die Schlange fressen soll.' },
                { icon: '🔢', name: 'punkte', role: 'Zeigt, wie viele Äpfel gefressen wurden.' }
            ],
            saySprites: 'Die Schlange besteht aus einem Kopf und mehreren Körperteilen. Dazu gibt es den Apfel und die Punkte-Anzeige.',
            code: [
                {
                    title: 'Die Richtung merken',
                    snippet: "richtung = 'right'",
                    explain: 'In dieser Variable steht, wohin die Schlange gerade läuft — als Wort wie \'right\' oder \'up\'.',
                    say: 'In der Variable richtung merke ich mir als Wort, wohin die Schlange gerade läuft.'
                },
                {
                    title: 'Pfeiltasten ändern die Richtung',
                    snippet: "if play.key_is_pressed('up'):\n    richtung = 'up'\nif play.key_is_pressed('down'):\n    richtung = 'down'",
                    explain: 'Drücke ich eine Pfeiltaste, ändert sich nur die Richtung — die Schlange läuft dann von allein dorthin.',
                    say: 'Wenn ich eine Pfeiltaste drücke, ändere ich die Richtung. Die Schlange bewegt sich dann von selbst dorthin.'
                },
                {
                    title: 'Apfel fressen',
                    snippet: "if kopf.is_touching(apfel):\n    score += 1\n    punkte.words = 'Punkte: ' + str(score)\n    apfel.x = play.random_number(-220, 220)\n    apfel.y = play.random_number(-180, 180)",
                    explain: 'Berührt der Kopf den Apfel, gibt es einen Punkt und der Apfel springt an einen zufälligen neuen Ort.',
                    say: 'Wenn der Kopf den Apfel berührt, bekomme ich einen Punkt und der Apfel taucht zufällig woanders auf.'
                }
            ],
            hardest: 'Am schwierigsten war, dass die Körperteile dem Kopf folgen sollen. Dafür rückt jedes Glied immer auf die alte Stelle des Gliedes davor.'
        },

        // =====================================================
        // WÜRFEL-SIMULATOR — Resch Matteo (Level 11)
        // =====================================================
        {
            level: 11,
            kid: 'Resch Matteo',
            game: 'Würfel-Simulator',
            emoji: '🎲',
            accent: '#8a4ed8',
            tagline: 'Klick den Würfel und lass den Zufall entscheiden.',
            about: [
                'Auf dem Bildschirm ist ein großer Würfel. Klickst du ihn an, zeigt er eine zufällige Zahl von 1 bis 6.',
                'Genau wie ein echter Würfel — nur im Computer.'
            ],
            howToPlay: [
                { key: '🖱️', text: 'Auf den großen Würfel klicken' },
                { key: '🎲', text: 'Jeder Klick gibt eine neue Zufallszahl von 1 bis 6.' }
            ],
            sayDemo: 'Mein Spiel ist ein „Würfel-Simulator". Ich klicke auf den weißen Würfel und er zeigt eine zufällige Zahl von 1 bis 6 — wie ein echter Würfel.',
            sprites: [
                { icon: '⬜', name: 'wuerfel', role: 'Die große weiße Box in der Mitte — mein Würfel.' },
                { icon: '🔢', name: 'zahl_text', role: 'Der große Text, der die gewürfelte Zahl zeigt.' },
                { icon: '💬', name: 'info', role: 'Der Hinweis „Klick den Wuerfel!".' }
            ],
            saySprites: 'Es gibt den Würfel selbst, den großen Zahlen-Text und einen Hinweis.',
            code: [
                {
                    title: 'Den Würfel bauen',
                    snippet: "wuerfel = play.new_box(color='white', x=0, y=0, width=140, height=140, border_color='black', border_width=3)\nzahl_text = play.new_text(words='?', x=0, y=0, font_size=80, color='black')",
                    explain: 'Eine große weiße Box ist der Würfel, darauf ein Text mit Fragezeichen, der später die Zahl zeigt.',
                    say: 'Ich baue eine große weiße Box als Würfel und einen Text mit einem Fragezeichen drauf.'
                },
                {
                    title: 'Würfeln beim Klick',
                    snippet: '@wuerfel.when_clicked\ndef wurf():\n    zahl = randint(1, 6)\n    zahl_text.words = str(zahl)',
                    explain: 'randint(1, 6) gibt eine zufällige ganze Zahl von 1 bis 6. str() macht aus der Zahl Text, damit sie angezeigt werden kann.',
                    say: 'Beim Klick hole ich mit randint eine Zufallszahl von 1 bis 6 und zeige sie mit str() als Text an.'
                }
            ],
            hardest: 'Am wichtigsten war str(). Eine Zahl kann ich nicht direkt anzeigen — ich muss sie mit str() erst in Text verwandeln.'
        },

        // =====================================================
        // REAKTIONSTEST — Schwarzl Konstantin (Level 13)
        // =====================================================
        {
            level: 13,
            kid: 'Schwarzl Konstantin',
            game: 'Reaktionstest',
            emoji: '⚡',
            accent: '#e34b5e',
            tagline: 'Klick die Box, sobald sie grün wird — sei schnell!',
            about: [
                'Die Box ist zuerst rot. Nach einer zufälligen Wartezeit wird sie grün.',
                'Sobald das passiert, musst du so schnell wie möglich klicken. Klickst du zu früh (noch rot), zählt es nicht.'
            ],
            howToPlay: [
                { key: '🟢', text: 'Warte, bis die Box grün wird' },
                { key: '🖱️', text: 'Dann sofort klicken — aber nicht zu früh!' }
            ],
            sayDemo: 'Mein Spiel ist ein „Reaktionstest". Die Box ist erst rot. Wenn sie grün wird, muss ich blitzschnell klicken. Klicke ich zu früh, wird sie orange.',
            sprites: [
                { icon: '🟥', name: 'box', role: 'Die große Box, die ihre Farbe wechselt und die ich anklicke.' },
                { icon: '💬', name: 'status', role: 'Der Text, der „Warte…", „JETZT!" oder „Super!" anzeigt.' }
            ],
            saySprites: 'Es gibt die große Box und einen Status-Text, der mir sagt, was gerade los ist.',
            code: [
                {
                    title: 'Der Zustand „bereit"',
                    snippet: 'bereit = False',
                    explain: 'Diese Variable merkt sich, ob ein Klick gerade zählen darf. Erst False (noch nicht), später True (jetzt!).',
                    say: 'Die Variable bereit merkt sich, ob ich schon klicken darf. Am Anfang ist sie False.'
                },
                {
                    title: 'Zufällig warten, dann grün',
                    snippet: "@play.when_program_starts\nasync def start():\n    global bereit\n    await play.timer(seconds=randint(1, 3))\n    box.color = 'green'\n    status.words = 'JETZT!'\n    bereit = True",
                    explain: 'await play.timer wartet eine zufällige Zeit (1 bis 3 Sekunden). Danach wird die Box grün und bereit wird True.',
                    say: 'Mit await play.timer warte ich zufällig 1 bis 3 Sekunden. Dann wird die Box grün und bereit wird True.'
                },
                {
                    title: 'Der Klick — richtig oder zu früh?',
                    snippet: "@box.when_clicked\ndef klick():\n    global bereit\n    if bereit:\n        status.words = 'Super!'\n        box.color = 'blue'\n        bereit = False\n    else:\n        status.words = 'Zu frueh!'\n        box.color = 'orange'",
                    explain: 'if bereit prüft den Zustand: War sie schon grün, ist es ein Erfolg. Sonst war der Klick zu früh.',
                    say: 'Beim Klick prüfe ich: Ist bereit True, war ich rechtzeitig — sonst war ich zu früh.'
                }
            ],
            hardest: 'Am schwierigsten war das Warten mit await play.timer und die Variable bereit. Ohne sie würde auch ein viel zu früher Klick zählen.'
        },

        // =====================================================
        // MATHE-QUIZ — Temmel Mark (Level 14)
        // =====================================================
        {
            level: 14,
            kid: 'Temmel Mark',
            game: 'Mathe-Quiz',
            emoji: '➕',
            accent: '#3950d6',
            tagline: 'Klick die richtige Antwort auf die Rechenaufgabe.',
            about: [
                'Oben steht eine Rechenaufgabe: 5 + 3 = ?. Darunter gibt es drei Antwort-Buttons.',
                'Klickst du die richtige Antwort, gibt es einen Punkt. Bei einer falschen Antwort wird einer abgezogen.'
            ],
            howToPlay: [
                { key: '🖱️', text: 'Auf einen der drei Zahlen-Buttons klicken' },
                { key: '✅', text: 'Richtig (8) = +1 Punkt, falsch = −1 Punkt.' }
            ],
            sayDemo: 'Mein Spiel ist ein „Mathe-Quiz". Die Aufgabe ist 5 plus 3. Ich klicke auf die richtige Zahl und bekomme einen Punkt — bei einer falschen wird einer abgezogen.',
            sprites: [
                { icon: '🔢', name: 'score_anzeige', role: 'Zeigt meinen Punktestand.' },
                { icon: '❓', name: 'aufgabe', role: 'Der Text mit der Rechenaufgabe „5 + 3 = ?".' },
                { icon: '🟦', name: 'b6 / b7 / b8', role: 'Die drei Antwort-Buttons mit den Zahlen 6, 7 und 8.' }
            ],
            saySprites: 'Es gibt die Punkte-Anzeige, die Aufgabe und drei Buttons mit den möglichen Antworten.',
            code: [
                {
                    title: 'Ein Button = Box + Text',
                    snippet: "b8 = play.new_box(color='light blue', x=120, y=-50, width=80, height=60)\nt8 = play.new_text(words='8', x=120, y=-50, font_size=30, color='black')",
                    explain: 'Jeder Button besteht aus einer Box und einem Text mit der Zahl drauf — an derselben Position.',
                    say: 'Jeder Button ist eine Box mit einer Zahl als Text darüber.'
                },
                {
                    title: 'Die richtige Antwort (8)',
                    snippet: "@b8.when_clicked\ndef richtig():\n    global score\n    score = score + 1\n    score_anzeige.words = 'Punkte: ' + str(score)",
                    explain: '5 + 3 = 8, also ist Button b8 richtig. Beim Klick gibt es einen Punkt mehr.',
                    say: '5 plus 3 ist 8 — deshalb gibt der Button b8 beim Klick einen Punkt.'
                },
                {
                    title: 'Eine falsche Antwort',
                    snippet: "@b6.when_clicked\ndef falsch1():\n    global score\n    score = score - 1\n    score_anzeige.words = 'Punkte: ' + str(score)",
                    explain: 'Die falschen Buttons (6 und 7) ziehen beim Klick einen Punkt ab. Jeder Button hat seine eigene Klick-Funktion.',
                    say: 'Die falschen Buttons ziehen einen Punkt ab. Jeder Button hat seine eigene Klick-Funktion.'
                }
            ],
            hardest: 'Am schwierigsten war, dass jeder der drei Buttons seine eigene Klick-Funktion braucht — zwei für falsch, eine für richtig.'
        },

        // =====================================================
        // FROSCH ÜBER DIE STRASSE — Wagner Alana (Level 17)
        // =====================================================
        {
            level: 17,
            kid: 'Wagner Alana',
            game: 'Frosch über die Straße',
            emoji: '🐸',
            accent: '#0f6b4d',
            tagline: 'Bring den Frosch sicher über drei Auto-Spuren.',
            about: [
                'Ein Frosch will über eine Straße mit drei Spuren. Auf jeder Spur fährt ein Auto.',
                'Wirst du von einem Auto getroffen, geht es zurück zum Start. Schaffst du es bis ganz oben, hast du gewonnen!'
            ],
            howToPlay: [
                { key: '↑', text: 'Frosch nach vorne (oben)' },
                { key: '↓', text: 'Frosch zurück (unten)' },
                { key: '🚗', text: 'Weiche den Autos aus — bei Berührung geht es zurück.' }
            ],
            sayDemo: 'Mein Spiel ist „Frosch über die Straße". Ich bewege den grünen Frosch mit den Pfeiltasten nach oben und muss den Autos ausweichen.',
            sprites: [
                { icon: '🟢', name: 'frosch', role: 'Der grüne Kreis unten — mein Frosch.' },
                { icon: '🚗', name: 'autos', role: 'Eine Liste mit drei Autos, die über die Spuren fahren.' },
                { icon: '💬', name: 'status', role: 'Zeigt „Geschafft!" oder „Aua! Nochmal!".' }
            ],
            saySprites: 'Es gibt den Frosch, eine Liste mit drei Autos und einen Status-Text.',
            code: [
                {
                    title: 'Die Autos in einer Liste',
                    snippet: 'autos = [auto1, auto2, auto3]',
                    explain: 'Alle drei Autos kommen in eine Liste. So kann ich sie später alle gemeinsam mit einer Schleife bewegen.',
                    say: 'Ich stecke alle drei Autos in eine Liste, dann kann ich sie zusammen steuern.'
                },
                {
                    title: 'Frosch bewegen + Ziel',
                    snippet: "if play.key_is_pressed('up'):\n    frosch.y = frosch.y + 3\nif frosch.y > 200:\n    status.words = 'Geschafft!'\n    frosch.y = -180",
                    explain: 'Mit ↑ geht der Frosch nach oben. Ist er ganz oben, hat er es geschafft und startet neu.',
                    say: 'Mit der Pfeiltaste geht der Frosch hoch. Ganz oben hat er es geschafft.'
                },
                {
                    title: 'Autos fahren + Wrap-around + Crash',
                    snippet: "for auto in autos:\n    auto.x = auto.x + 4\n    if auto.x > 270:\n        auto.x = -270\n    if auto.is_touching(frosch):\n        frosch.y = -180\n        status.words = 'Aua! Nochmal!'",
                    explain: 'Die for-Schleife bewegt jedes Auto. Fährt es rechts raus, kommt es links wieder rein (Wrap-around). Trifft es den Frosch, geht es zurück zum Start.',
                    say: 'Jedes Auto fährt nach rechts. Am Rand kommt es links wieder rein. Trifft es den Frosch, muss ich von vorne anfangen.'
                }
            ],
            hardest: 'Am schwierigsten war der Wrap-around: Wenn ein Auto rechts rausfährt, setze ich es links wieder rein, damit es immer weiterfährt.'
        },

        // =====================================================
        // ===============   RESERVE-SPIELE   ==================
        // =====================================================

        // FARBEN-REAKTION (Level 10)
        {
            level: 10,
            kid: 'Reserve',
            game: 'Farben-Reaktion',
            emoji: '🎨',
            accent: '#e34b5e',
            reserve: true,
            tagline: 'Klick die Box mit der angesagten Farbe — schnell!',
            about: [
                'Oben steht eine Farbe, zum Beispiel „Klicke blau". Du musst auf die richtige farbige Box klicken.',
                'Bei jedem richtigen Klick gibt es einen Punkt und eine neue Farbe wird verlangt.'
            ],
            howToPlay: [
                { key: '🖱️', text: 'Auf die Box mit der angesagten Farbe klicken' },
                { key: '⚡', text: 'Je schneller, desto besser.' }
            ],
            sayDemo: 'Mein Spiel ist „Farben-Reaktion". Oben steht eine Farbe und ich klicke schnell die passende Box an.',
            sprites: [
                { icon: '🟥', name: 'rot / gruen / blau', role: 'Drei farbige Boxen zum Anklicken.' },
                { icon: '💬', name: 'hinweis', role: 'Sagt, welche Farbe gerade verlangt ist.' },
                { icon: '🔢', name: 'punkte', role: 'Zeigt die Punkte an.' }
            ],
            saySprites: 'Drei farbige Boxen, ein Hinweis-Text und die Punkte-Anzeige.',
            code: [
                {
                    title: 'Die Farben in einer Liste',
                    snippet: "farben = ['rot', 'gruen', 'blau']",
                    explain: 'Eine Liste mit allen Farben. Daraus wird zufällig eine ausgewählt.',
                    say: 'In dieser Liste stehen alle Farben, aus denen zufällig gewählt wird.'
                },
                {
                    title: 'Nächste Runde mit Zufallsfarbe',
                    snippet: "def naechste_runde():\n    global ziel_farbe\n    nr = play.random_number(0, 2)\n    ziel_farbe = farben[nr]\n    hinweis.words = 'Klicke ' + ziel_farbe",
                    explain: 'random_number wählt eine Position in der Liste. farben[nr] holt die Farbe an dieser Stelle.',
                    say: 'Hier wähle ich zufällig eine Farbe aus der Liste und zeige sie als Aufgabe an.'
                },
                {
                    title: 'Richtig geklickt?',
                    snippet: "@gruen.when_clicked\ndef klick_gruen():\n    global score\n    if ziel_farbe == 'gruen':\n        score += 1\n        punkte.words = 'Punkte: ' + str(score)\n        naechste_runde()",
                    explain: 'Beim Klick wird geprüft, ob diese Farbe verlangt war. Wenn ja: Punkt und nächste Runde.',
                    say: 'Beim Klick prüfe ich mit ==, ob die Farbe stimmt. Wenn ja, gibt es einen Punkt.'
                }
            ],
            hardest: 'Knifflig war, dass jede Box ihre eigene Klick-Funktion braucht — aber alle nach demselben Muster.'
        },

        // AMPEL-SCHALTUNG (Level 12)
        {
            level: 12,
            kid: 'Reserve',
            game: 'Ampel-Schaltung',
            emoji: '🚦',
            accent: '#f5b821',
            reserve: true,
            tagline: 'Schalte die Ampel von Rot über Gelb auf Grün.',
            about: [
                'Eine Ampel mit drei Lampen. Pro Klick auf den Schalter geht es zur nächsten Phase: Rot → Gelb → Grün → wieder Rot.',
                'Immer leuchtet genau eine Lampe hell, die anderen sind dunkel.'
            ],
            howToPlay: [
                { key: '🖱️', text: 'Auf den grauen Schalter klicken' },
                { key: '🚦', text: 'Jeder Klick schaltet eine Lampe weiter.' }
            ],
            sayDemo: 'Mein Spiel ist eine „Ampel-Schaltung". Ich klicke den Schalter und die Ampel schaltet von Rot zu Gelb zu Grün.',
            sprites: [
                { icon: '🔴', name: 'rot / gelb / gruen', role: 'Die drei Lampen der Ampel.' },
                { icon: '🔘', name: 'schalter', role: 'Der Schalter zum Weiterschalten.' }
            ],
            saySprites: 'Drei Lampen-Kreise und ein Schalter.',
            code: [
                {
                    title: 'Die aktuelle Phase merken',
                    snippet: 'phase = 0',
                    explain: 'Diese Variable merkt sich, welche Lampe gerade leuchtet (0 = rot, 1 = gelb, 2 = grün).',
                    say: 'In phase merke ich mir, welche Lampe gerade dran ist.'
                },
                {
                    title: 'Weiterschalten',
                    snippet: '@schalter.when_clicked\ndef weiter():\n    global phase\n    phase = phase + 1\n    if phase > 2:\n        phase = 0',
                    explain: 'Jeder Klick erhöht die Phase. Nach Grün (2) geht es wieder zurück auf Rot (0).',
                    say: 'Bei jedem Klick zähle ich eins weiter und springe nach Grün wieder auf Rot.'
                },
                {
                    title: 'Lampen hell und dunkel',
                    snippet: 'rot.transparency = 30\ngelb.transparency = 30\ngruen.transparency = 30\nif phase == 0:\n    rot.transparency = 100',
                    explain: 'Erst werden alle Lampen dunkel (transparency 30), dann nur die aktive wieder hell (100).',
                    say: 'Ich mache erst alle Lampen dunkel und dann nur die richtige wieder hell.'
                }
            ],
            hardest: 'Knifflig war die if/elif-Logik, damit immer genau die richtige Lampe leuchtet.'
        },

        // KLAVIER MIT LAMPEN (Level 15)
        {
            level: 15,
            kid: 'Reserve',
            game: 'Klavier mit Lampen',
            emoji: '🎹',
            accent: '#8a4ed8',
            reserve: true,
            tagline: 'Acht Tasten — beim Anklicken leuchten sie auf.',
            about: [
                'Ein kleines Klavier mit acht Tasten. Klickst du eine an, leuchtet sie kurz gelb auf.',
                'Das Besondere: Die acht Tasten werden nicht einzeln, sondern mit einer Schleife erzeugt.'
            ],
            howToPlay: [
                { key: '🖱️', text: 'Auf eine der acht Tasten klicken' },
                { key: '✨', text: 'Die geklickte Taste leuchtet kurz auf.' }
            ],
            sayDemo: 'Mein Spiel ist ein „Klavier mit Lampen". Ich klicke auf eine Taste und sie leuchtet kurz gelb auf.',
            sprites: [
                { icon: '⬜', name: 'tasten', role: 'Eine Liste mit allen acht Klaviertasten.' },
                { icon: '🎹', name: 'titel', role: 'Die Überschrift „Mein Klavier".' }
            ],
            saySprites: 'Alle acht Tasten stecken in einer Liste namens tasten.',
            code: [
                {
                    title: 'Acht Tasten mit einer Schleife',
                    snippet: "tasten = []\nfor i in range(8):\n    taste_x = -175 + i * 50\n    taste = play.new_box(color='white', x=taste_x, y=0, width=42, height=140, border_color='black', border_width=2)\n    tasten.append(taste)",
                    explain: 'Statt acht Mal denselben Code zu schreiben, erzeugt die for-Schleife alle Tasten automatisch. i läuft von 0 bis 7 und verschiebt jede Taste etwas nach rechts.',
                    say: 'Mit einer for-Schleife baue ich alle acht Tasten auf einmal, statt sie einzeln zu schreiben.'
                },
                {
                    title: 'Taste leuchtet beim Klick',
                    snippet: "@play.repeat_forever\nasync def schleife():\n    for t in tasten:\n        if play.mouse.is_clicked and t.is_touching(play.mouse):\n            t.color = 'yellow'\n            await play.timer(seconds=0.2)\n            t.color = 'white'",
                    explain: 'Die Schleife prüft jede Taste: Wird sie angeklickt, wird sie kurz gelb und dann wieder weiß.',
                    say: 'Ich prüfe jede Taste — wird sie geklickt, leuchtet sie kurz gelb und wird dann wieder weiß.'
                }
            ],
            hardest: 'Knifflig war die for-Schleife mit der Positions-Rechnung -175 + i * 50, damit die Tasten nebeneinander stehen.'
        },

        // BLACKJACK (Level 18)
        {
            level: 18,
            kid: 'Reserve',
            game: 'Blackjack',
            emoji: '🃏',
            accent: '#1f2330',
            reserve: true,
            tagline: 'Zieh Karten und komm näher an 21 als der Computer.',
            about: [
                'Ein einfaches Kartenspiel. Mit „Karte ziehen" sammelst du Punkte (1 bis 11 pro Karte). Über 21 hast du verloren.',
                'Mit „Computer fordern" zieht der Computer so oft wie du — wer näher an 21 ist, gewinnt.'
            ],
            howToPlay: [
                { key: '🟢', text: '„Karte ziehen" — eine zufällige Karte 1–11' },
                { key: '🔴', text: '„Computer fordern" — der Computer spielt' },
                { key: '🎯', text: 'Bleib unter oder bei 21!' }
            ],
            sayDemo: 'Mein Spiel ist „Blackjack". Ich ziehe Karten und versuche, nah an 21 zu kommen, ohne drüber zu gehen. Dann fordere ich den Computer.',
            sprites: [
                { icon: '🔢', name: 'score_txt', role: 'Zeigt meinen Punktestand und den des Computers.' },
                { icon: '🃏', name: 'karte', role: 'Die zuletzt gezogene Karte (große Zahl).' },
                { icon: '🟢', name: 'b_zieh / b_comp', role: 'Die beiden Buttons zum Ziehen und Fordern.' }
            ],
            saySprites: 'Eine Anzeige für die Punkte, die aktuelle Karte und zwei Buttons.',
            code: [
                {
                    title: 'Eine Karte ziehen',
                    snippet: "@b_zieh.when_clicked\ndef ziehen():\n    global dein_score, zuege\n    zahl = randint(1, 11)\n    karte.words = str(zahl)\n    dein_score = dein_score + zahl\n    zuege = zuege + 1",
                    explain: 'randint(1, 11) ist die gezogene Karte. Sie wird zu meinem Punktestand addiert.',
                    say: 'Beim Ziehen hole ich mit randint eine Karte von 1 bis 11 und zähle sie zu meinen Punkten.'
                },
                {
                    title: 'Über 21 = verloren',
                    snippet: "if dein_score > 21:\n    status.words = 'Du hast verloren! (ueber 21)'",
                    explain: 'Geht mein Score über 21, habe ich sofort verloren.',
                    say: 'Komme ich über 21, habe ich sofort verloren.'
                },
                {
                    title: 'Der Computer zieht',
                    snippet: "for i in range(zuege):\n    zahl = randint(1, 11)\n    comp_score = comp_score + zahl",
                    explain: 'Eine for-Schleife lässt den Computer genauso oft ziehen, wie ich gezogen habe.',
                    say: 'Mit einer for-Schleife zieht der Computer so oft, wie ich vorher gezogen habe.'
                }
            ],
            hardest: 'Anspruchsvoll war der Vergleich am Ende: wer näher an 21 ist, gewinnt — mit if/elif/else.'
        },

        // ARKANOID (Level 19)
        {
            level: 19,
            kid: 'Reserve',
            game: 'Arkanoid',
            emoji: '🧱',
            accent: '#f08a3e',
            reserve: true,
            tagline: 'Zerstöre alle Blöcke mit dem abprallenden Ball.',
            about: [
                'Ein klassischer Block-Brecher. Unten ist dein Paddle, der Ball prallt überall ab, oben stehen zwei Reihen Blöcke.',
                'Triff jeden Block — wenn alle weg sind, hast du gewonnen.'
            ],
            howToPlay: [
                { key: '←', text: 'Paddle nach links' },
                { key: '→', text: 'Paddle nach rechts' },
                { key: '🧱', text: 'Lass den Ball nicht unten durch — zerstöre alle Blöcke.' }
            ],
            sayDemo: 'Mein Spiel ist „Arkanoid". Der Ball prallt ab und ich halte ihn mit dem Paddle im Spiel, um alle Blöcke zu zerstören.',
            sprites: [
                { icon: '🟦', name: 'paddle', role: 'Meine Box unten, die ich steuere.' },
                { icon: '🔴', name: 'ball', role: 'Der Ball, der abprallt.' },
                { icon: '🧱', name: 'blocks', role: 'Eine Liste mit allen Blöcken oben.' }
            ],
            saySprites: 'Ein Paddle, ein Ball und eine Liste mit allen Blöcken.',
            code: [
                {
                    title: 'Block-Raster mit zwei Schleifen',
                    snippet: "blocks = []\nfor reihe in range(2):\n    for spalte in range(5):\n        bx = -200 + spalte * 100\n        by = 140 - reihe * 35\n        block = play.new_box(color='orange', x=bx, y=by, width=90, height=25, border_color='dark gray', border_width=1)\n        blocks.append(block)",
                    explain: 'Zwei verschachtelte for-Schleifen erzeugen ein Raster: die äußere für 2 Reihen, die innere für 5 Blöcke pro Reihe.',
                    say: 'Mit zwei ineinander verschachtelten Schleifen baue ich das ganze Raster aus Blöcken.'
                },
                {
                    title: 'Ball prallt ab',
                    snippet: 'if ball.x > 250 or ball.x < -250:\n    ball_vx = -1 * ball_vx\nif ball.y > 200:\n    ball_vy = -1 * ball_vy\nif ball.is_touching(paddle):\n    ball_vy = abs(ball_vy)',
                    explain: 'An den Wänden und am Paddle wird die Flugrichtung des Balls umgedreht.',
                    say: 'An den Wänden und am Paddle drehe ich die Richtung des Balls um.'
                },
                {
                    title: 'Block treffen + gewinnen',
                    snippet: "for b in blocks:\n    if b.is_touching(ball):\n        b.hide()\n        blocks.remove(b)\n        ball_vy = -1 * ball_vy\nif len(blocks) == 0:\n    status.words = 'GEWONNEN!'",
                    explain: 'Trifft der Ball einen Block, fliegt dieser aus der Liste. Ist die Liste leer (len == 0), ist das Spiel gewonnen.',
                    say: 'Trifft der Ball einen Block, kommt er aus der Liste. Sind alle weg, habe ich gewonnen.'
                }
            ],
            hardest: 'Anspruchsvoll waren die verschachtelten Schleifen für das Block-Raster — eine Schleife in der anderen.'
        },

        // MEMORY (Level 20)
        {
            level: 20,
            kid: 'Reserve',
            game: 'Memory-Spiel',
            emoji: '🧠',
            accent: '#4f6df5',
            reserve: true,
            tagline: 'Finde die passenden Farbpaare.',
            about: [
                'Sechs verdeckte Karten verbergen drei Farbpaare. Klickst du eine an, zeigt sie ihre Farbe.',
                'Findest du zwei gleiche, bleiben sie offen. Sonst werden sie nach kurzer Zeit wieder verdeckt.'
            ],
            howToPlay: [
                { key: '🖱️', text: 'Zwei Karten nacheinander anklicken' },
                { key: '🧠', text: 'Gleiche Farben bleiben offen — merk sie dir!' }
            ],
            sayDemo: 'Mein Spiel ist „Memory". Ich decke zwei Karten auf. Sind sie gleich, bleiben sie offen, sonst werden sie wieder verdeckt.',
            sprites: [
                { icon: '🃏', name: 'karten', role: 'Eine Liste mit allen sechs Karten.' },
                { icon: '🎨', name: 'farben', role: 'Eine Liste, die zu jeder Karte die versteckte Farbe speichert.' },
                { icon: '💬', name: 'status', role: 'Der Hinweis-Text oben.' }
            ],
            saySprites: 'Eine Liste mit den Karten, eine Liste mit den Farben und ein Status-Text.',
            code: [
                {
                    title: 'Karten und ihre Farben',
                    snippet: "karten = []\nfarben = ['red', 'red', 'blue', 'blue', 'green', 'green']\nfor i in range(6):\n    karte = play.new_box(color='gray', x=-200 + i*80, y=0, width=70, height=100, border_color='black', border_width=2)\n    karten.append(karte)",
                    explain: 'Sechs graue Karten werden mit einer Schleife gebaut. Die Liste farben merkt sich, welche Farbe sich hinter jeder Karte versteckt.',
                    say: 'Ich baue sechs graue Karten und merke mir in einer zweiten Liste, welche Farbe darunter ist.'
                },
                {
                    title: 'Sich die erste Karte merken',
                    snippet: 'erste_idx = -1\nzweite_idx = -1',
                    explain: '-1 bedeutet „noch keine Karte aufgedeckt". Diese Variablen merken sich, welche Karten gerade offen sind.',
                    say: 'Mit diesen Variablen merke ich mir, welche Karten gerade aufgedeckt sind. -1 heißt: noch keine.'
                },
                {
                    title: 'Zwei Karten vergleichen',
                    snippet: "zweite_idx = i\nawait play.timer(seconds=0.7)\nif farben[erste_idx] != farben[zweite_idx]:\n    karten[erste_idx].color = 'gray'\n    karten[zweite_idx].color = 'gray'",
                    explain: 'Nach der zweiten Karte wird kurz gewartet. Sind die Farben verschieden, werden beide wieder grau (verdeckt).',
                    say: 'Nach zwei Karten warte ich kurz. Sind die Farben verschieden, decke ich beide wieder zu.'
                }
            ],
            hardest: 'Anspruchsvoll war, sich mit zwei Variablen zu merken, welche Karten offen sind, und sie dann zu vergleichen.'
        }
    ];

    global.PRESENTERS = PRESENTERS;
})(window);
