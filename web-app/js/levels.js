/* ================================================================
   levels.js — Definition aller Level
   ================================================================ */

(function (global) {
    'use strict';

    // Helper-Funktionen fuer Validatoren
    function findSprite(state, predicate) {
        return state.sprites.find(s => !s._destroyed && predicate(s));
    }

    function spritesByType(state, kind) {
        return state.sprites.filter(s => !s._destroyed && s.constructor.name === kind);
    }

    function normalize(s) {
        return (s || '').replace(/\s+/g, ' ').trim();
    }

    // Validator-Helper: prueft, ob der Code-Text bestimmte Patterns enthaelt
    function codeContains(code, pattern) {
        if (typeof pattern === 'string') return code.includes(pattern);
        return pattern.test(code);
    }

    // -----------------------------------------------------------
    //  LEVEL DEFINITIONS
    // -----------------------------------------------------------
    const LEVELS = [
        // =========================================================
        // LEVEL 1 — TIPP-MODUS
        // =========================================================
        {
            id: 1,
            title: 'Hallo Welt',
            shortDescription: 'Tippe deinen ersten Python-Code ab und lerne, wie ein Text auf den Bildschirm kommt.',
            concepts: [
                'play.new_text(...) erstellt Text',
                'Variablen speichern dein Sprite',
                'x und y bestimmen die Position'
            ],
            keyHints: [],
            tasks: [
                {
                    title: 'Tipp den Code Zeichen für Zeichen ab',
                    description: `
                        <p>Hinter dem Editor siehst du den Code in <em>hellgrau</em>. Tippe ihn <strong>genau so</strong> ab.</p>
                        <p>Der Code erstellt einen Text auf dem Bildschirm. Wenn du fertig bist, drücke <code>Enter</code> oder klicke <code>Ausführen</code>.</p>
                        <p><strong>Tipp:</strong> Achte auf Anführungszeichen <code>'</code>, Kommas <code>,</code> und Klammern <code>(</code> <code>)</code>.</p>
                    `,
                    hint: `So gehst du Schritt für Schritt vor:
1) Klick zuerst in den Editor (mittlere Spalte).
2) Tippe genau das ab, was in der Karte „Code zum Abtippen" steht.
3) Achte auf jedes Zeichen: ' ' (Anführungszeichen), , (Kommas), ( ) (Klammern), = (Gleichheitszeichen).
4) Zwischen den beiden Zeilen ist eine LEERE Zeile (zweimal Enter).
5) Wenn unten der Text grün wird → Enter drücken oder „Ausführen" klicken.`,
                    mode: 'type',
                    initialCode: '',
                    targetCode: `titel = play.new_text(words='Hallo Welt', x=0, y=120, font_size=42, color='blue')\n\nuntertitel = play.new_text(words='Mein erstes Programm', x=0, y=60, font_size=20, color='gray')`,
                    solution: `titel = play.new_text(words='Hallo Welt', x=0, y=120, font_size=42, color='blue')

untertitel = play.new_text(words='Mein erstes Programm', x=0, y=60, font_size=20, color='gray')`,
                    validate: ({ studentCode, state, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        const target = `titel = play.new_text(words='Hallo Welt', x=0, y=120, font_size=42, color='blue')\n\nuntertitel = play.new_text(words='Mein erstes Programm', x=0, y=60, font_size=20, color='gray')`;
                        if (normalize(studentCode) !== normalize(target)) {
                            return { ok: false, message: 'Tippe den Code genau so ab wie er hinten gezeigt wird.' };
                        }
                        if (state.sprites.length < 2) {
                            return { ok: false, message: 'Es sollten zwei Texte zu sehen sein.' };
                        }
                        return { ok: true, message: 'Perfekt! Du hast deinen ersten Code geschrieben.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 2 — DREI SPRITES
        // =========================================================
        {
            id: 2,
            title: 'Eigene Welt erschaffen',
            shortDescription: 'Du lernst die drei Bausteine: Text, Kreis und Box.',
            concepts: [
                'play.new_circle(...) erstellt einen Kreis',
                'play.new_box(...) erstellt eine Box',
                'Du kannst Farben mit color="..." aendern'
            ],
            keyHints: [],
            tasks: [
                {
                    title: 'Erstelle einen Spieler, einen Kreis und eine Box',
                    description: `
                        <p>Du siehst im Editor schon einen <strong>Titel</strong>. Darunter sollst du jetzt drei neue Sprites hinzufügen.</p>
                        <p><strong>Beispiel</strong> für einen Spieler-Text:</p>
                        <pre>spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')</pre>
                        <p>Schreibe genau diese Zeile darunter. Ergänze danach noch <strong>einen Kreis</strong> (links auf <code>x=-180</code>) und <strong>eine Box</strong> (rechts auf <code>x=180</code>).</p>
                        <p>Beispiele:</p>
                        <pre>kreis = play.new_circle(color='blue', x=-180, y=0, radius=40)
box = play.new_box(color='red', x=180, y=0, width=80, height=80)</pre>
                    `,
                    hint: `So baust du es Stück für Stück:
1) Schreibe unter den Titel: spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
2) Eine Zeile drunter: kreis = play.new_circle(color='blue', x=-180, y=0, radius=40)
3) Wieder eine Zeile drunter: box = play.new_box(color='red', x=180, y=0, width=80, height=80)
4) Variablen-Namen MÜSSEN exakt 'spieler', 'kreis' und 'box' heißen — sonst findet die Pruefung sie nicht.
5) Klick „Ausführen".`,
                    mode: 'fill',
                    initialCode:
`titel = play.new_text(words='Mein Spielfeld', x=0, y=180, font_size=28, color='blue')

# Schreibe deinen Code hier:
`,
                    solution:
`titel = play.new_text(words='Mein Spielfeld', x=0, y=180, font_size=28, color='blue')

spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
kreis = play.new_circle(color='blue', x=-180, y=0, radius=40)
box = play.new_box(color='red', x=180, y=0, width=80, height=80)
`,
                    validate: ({ studentCode, state, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!codeContains(studentCode, /spieler\s*=\s*play\.new_text\s*\(/)) {
                            return { ok: false, message: 'Es fehlt ein Sprite namens spieler. Tipp: spieler = play.new_text(...)' };
                        }
                        if (!codeContains(studentCode, /kreis\s*=\s*play\.new_circle\s*\(/)) {
                            return { ok: false, message: 'Es fehlt ein Kreis namens kreis. Tipp: kreis = play.new_circle(...)' };
                        }
                        if (!codeContains(studentCode, /box\s*=\s*play\.new_box\s*\(/)) {
                            return { ok: false, message: 'Es fehlt eine Box namens box. Tipp: box = play.new_box(...)' };
                        }
                        const texts = spritesByType(state, 'TextSprite');
                        const circles = spritesByType(state, 'CircleSprite');
                        const boxes = spritesByType(state, 'BoxSprite');
                        if (texts.length < 2) return { ok: false, message: 'Der Spieler-Text wird nicht angezeigt. Hat er Worte (z.B. words=\'O_O\')?' };
                        if (circles.length < 1) return { ok: false, message: 'Der Kreis ist nicht zu sehen.' };
                        if (boxes.length < 1) return { ok: false, message: 'Die Box ist nicht zu sehen.' };
                        return { ok: true, message: 'Stark! Du hast eine ganze Spielwelt aus drei Bausteinen gebaut.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 3 — BEWEGUNG
        // =========================================================
        {
            id: 3,
            title: 'Bewegung programmieren',
            shortDescription: 'Mache deinen Spieler mit den Pfeiltasten beweglich.',
            concepts: [
                '@play.repeat_forever wiederholt Code immer wieder',
                'play.key_is_pressed("up") prueft eine Taste',
                'spieler.x += 5 bewegt nach rechts'
            ],
            keyHints: [
                { keys: ['↑'], label: 'Hoch' },
                { keys: ['↓'], label: 'Runter' },
                { keys: ['←'], label: 'Links' },
                { keys: ['→'], label: 'Rechts' }
            ],
            tasks: [
                {
                    title: 'Schreibe vier if-Bedingungen für die Pfeiltasten',
                    description: `
                        <p>Im Editor steht schon ein <code>spieler</code>-Sprite und ein leerer <code>repeat_forever</code>-Block.</p>
                        <p><strong>Beispiel</strong> für die Pfeiltaste <code>nach oben</code>:</p>
                        <pre>if play.key_is_pressed('up'):
    spieler.y += 5</pre>
                        <p>Schreibe ähnliche <code>if</code>-Blöcke für <code>'down'</code>, <code>'left'</code> und <code>'right'</code>. Achte darauf:</p>
                        <ul>
                            <li><code>down</code> bedeutet <code>spieler.y -= 5</code></li>
                            <li><code>left</code> bedeutet <code>spieler.x -= 5</code></li>
                            <li><code>right</code> bedeutet <code>spieler.x += 5</code></li>
                        </ul>
                        <p>Klicke nach dem Ausführen ins Spielfeld und drücke die Pfeiltasten.</p>
                    `,
                    hint: `Schreibe noch DREI weitere if-Blöcke unter den ersten:
1) if play.key_is_pressed('down'):  →  in der Zeile drunter mit 8 Leerzeichen Einrueckung: spieler.y -= 5
2) if play.key_is_pressed('left'):  →  spieler.x -= 5
3) if play.key_is_pressed('right'): →  spieler.x += 5
WICHTIG: Die if-Zeile hat 4 Leerzeichen vor dem 'if', die Bewegungs-Zeile darunter 8 Leerzeichen.`,
                    mode: 'fill',
                    initialCode:
`spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
info = play.new_text(words='Bewege mich mit den Pfeiltasten', x=0, y=180, font_size=18, color='gray')

@play.repeat_forever
def spielschleife():
    if play.key_is_pressed('up'):
        spieler.y += 5
    # Schreibe hier deine drei weiteren if-Blöcke:

`,
                    solution:
`spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
info = play.new_text(words='Bewege mich mit den Pfeiltasten', x=0, y=180, font_size=18, color='gray')

@play.repeat_forever
def spielschleife():
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5
`,
                    validate: ({ studentCode }) => {
                        const checks = [
                            { re: /if\s+play\.key_is_pressed\(\s*['"]up['"]\s*\)\s*:/, msg: 'Die Taste up fehlt.' },
                            { re: /if\s+play\.key_is_pressed\(\s*['"]down['"]\s*\)\s*:/, msg: 'Die Taste down fehlt.' },
                            { re: /if\s+play\.key_is_pressed\(\s*['"]left['"]\s*\)\s*:/, msg: 'Die Taste left fehlt.' },
                            { re: /if\s+play\.key_is_pressed\(\s*['"]right['"]\s*\)\s*:/, msg: 'Die Taste right fehlt.' },
                            { re: /spieler\.y\s*\+=/, msg: 'spieler.y += ... fehlt (für hoch).' },
                            { re: /spieler\.y\s*-=/, msg: 'spieler.y -= ... fehlt (für runter).' },
                            { re: /spieler\.x\s*-=/, msg: 'spieler.x -= ... fehlt (für links).' },
                            { re: /spieler\.x\s*\+=/, msg: 'spieler.x += ... fehlt (für rechts).' }
                        ];
                        for (const { re, msg } of checks) {
                            if (!re.test(studentCode)) return { ok: false, message: msg };
                        }
                        return { ok: true, message: 'Bewegung läuft! Klicke ins Spielfeld und probiere die Pfeiltasten aus.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 4 — PUNKTE & GRENZEN
        // =========================================================
        {
            id: 4,
            title: 'Punkte sammeln',
            shortDescription: 'Wenn dein Spieler die Spielfeldgrenze erreicht, gibt es einen Punkt.',
            concepts: [
                'Variablen wie score speichern Zahlen',
                'abs(x) liefert den positiven Wert',
                'Mehrfache if-Bedingungen kombinieren'
            ],
            keyHints: [
                { keys: ['↑'], label: 'Hoch' },
                { keys: ['↓'], label: 'Runter' },
                { keys: ['←'], label: 'Links' },
                { keys: ['→'], label: 'Rechts' }
            ],
            tasks: [
                {
                    title: 'Wenn der Spieler den Rand erreicht: zurücksetzen + Punkt',
                    description: `
                        <p>Das Spielfeld ist 520 breit und 420 hoch — die Hälften liegen also bei <code>x=±260</code> und <code>y=±210</code>.</p>
                        <p>Im Code steht schon eine <code>score</code>-Variable und eine Punkt-Anzeige. Vervollständige den <code>repeat_forever</code>-Block:</p>
                        <p><strong>Beispiel-Bedingung:</strong></p>
                        <pre>if spieler.x > 240 or spieler.x < -240:
    spieler.x = 0
    spieler.y = 0
    score += 1
    punkte.words = 'Punkte: ' + str(score)</pre>
                        <p>Schreibe einen <strong>zweiten</strong> Block, der dasselbe macht, wenn <code>spieler.y</code> zu gross oder zu klein wird.</p>
                    `,
                    hint: `Kopiere die Struktur vom x-Block, ändere x auf y:
1) if spieler.y > 200 or spieler.y < -200:    (4 Leerzeichen Einrückung)
2)     spieler.x = 0                          (8 Leerzeichen)
3)     spieler.y = 0
4)     score += 1
5)     punkte.words = 'Punkte: ' + str(score)
str(score) wandelt die Zahl in einen Text um, damit man sie an 'Punkte: ' anhängen kann.`,
                    mode: 'fill',
                    initialCode:
`score = 0

spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5

    if spieler.x > 240 or spieler.x < -240:
        spieler.x = 0
        spieler.y = 0
        score += 1
        punkte.words = 'Punkte: ' + str(score)

    # Schreibe hier deinen zweiten if-Block für y:

`,
                    solution:
`score = 0

spieler = play.new_text(words='O_O', x=0, y=0, font_size=60, color='black')
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5

    if spieler.x > 240 or spieler.x < -240:
        spieler.x = 0
        spieler.y = 0
        score += 1
        punkte.words = 'Punkte: ' + str(score)

    if spieler.y > 200 or spieler.y < -200:
        spieler.x = 0
        spieler.y = 0
        score += 1
        punkte.words = 'Punkte: ' + str(score)
`,
                    validate: ({ studentCode }) => {
                        if (!/spieler\.y\s*>\s*\d+\s*or\s*spieler\.y\s*<\s*-?\d+/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt eine Bedingung für spieler.y > ... or spieler.y < ...' };
                        }
                        const yBlockMatches = studentCode.match(/if\s+spieler\.y[\s\S]*?punkte\.words\s*=/g);
                        if (!yBlockMatches || yBlockMatches.length < 1) {
                            return { ok: false, message: 'Im y-Block fehlt der punkte.words = ... Update.' };
                        }
                        if ((studentCode.match(/score\s*\+=\s*1/g) || []).length < 2) {
                            return { ok: false, message: 'In beiden Blöcken muss score += 1 stehen.' };
                        }
                        return { ok: true, message: 'Toll! Bewege den Spieler zum Rand und sammle Punkte.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 5 — MINI-SPIEL
        // =========================================================
        {
            id: 5,
            title: 'Mini-Spiel: Sammle das Ziel',
            shortDescription: 'Berühre das Ziel mit deinem Spieler — du gewinnst Punkte und das Ziel springt an einen neuen Ort.',
            concepts: [
                'spieler.is_touching(ziel) testet Kollisionen',
                'random_number erzeugt Zufallszahlen',
                'Mehrere if-Bedingungen ergeben ein kleines Spiel'
            ],
            keyHints: [
                { keys: ['↑','↓','←','→'], label: 'Bewegen' }
            ],
            tasks: [
                {
                    title: 'Vervollständige das Spiel: Berühren = Punkt + Ziel teleportieren',
                    description: `
                        <p>Es gibt einen <code>spieler</code> und ein <code>ziel</code>. Wenn der Spieler das Ziel berührt, soll:</p>
                        <ul>
                            <li><code>score</code> um 5 erhöht werden</li>
                            <li>der Punktestand auf der Anzeige erneuert werden</li>
                            <li>das Ziel an einen Zufallspunkt versetzt werden</li>
                        </ul>
                        <p><strong>Beispiel</strong> für eine Zufallszahl:</p>
                        <pre>ziel.x = play.random_number(-200, 200)
ziel.y = play.random_number(-150, 150)</pre>
                        <p>Vervollständige unten den Block <code>if spieler.is_touching(ziel):</code>.</p>
                    `,
                    hint: `Schreibe DREI Zeilen mit jeweils 8 Leerzeichen Einrückung in den if-Block:
1) score += 5
2) punkte.words = 'Punkte: ' + str(score)
3) ziel.x = play.random_number(-200, 200)
4) ziel.y = play.random_number(-150, 150)
play.random_number(a, b) gibt eine Zufallszahl zwischen a und b zurück.`,
                    mode: 'fill',
                    initialCode:
`score = 0

spieler = play.new_text(words='O_O', x=0, y=0, font_size=50, color='black')
ziel = play.new_circle(color='green', x=180, y=120, radius=22, border_color='dark green', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5

    if spieler.is_touching(ziel):
        # Schreibe hier deine drei Sachen:

`,
                    solution:
`score = 0

spieler = play.new_text(words='O_O', x=0, y=0, font_size=50, color='black')
ziel = play.new_circle(color='green', x=180, y=120, radius=22, border_color='dark green', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('up'):
        spieler.y += 5
    if play.key_is_pressed('down'):
        spieler.y -= 5
    if play.key_is_pressed('left'):
        spieler.x -= 5
    if play.key_is_pressed('right'):
        spieler.x += 5

    if spieler.is_touching(ziel):
        score += 5
        punkte.words = 'Punkte: ' + str(score)
        ziel.x = play.random_number(-200, 200)
        ziel.y = play.random_number(-150, 150)
`,
                    validate: ({ studentCode }) => {
                        const cleaned = studentCode;
                        if (!/spieler\.is_touching\(\s*ziel\s*\)/.test(cleaned)) {
                            return { ok: false, message: 'Der Block if spieler.is_touching(ziel): muss da sein.' };
                        }
                        if (!/score\s*\+=\s*5/.test(cleaned)) {
                            return { ok: false, message: 'Es fehlt score += 5.' };
                        }
                        if (!/punkte\.words\s*=/.test(cleaned)) {
                            return { ok: false, message: 'Aktualisiere die Anzeige mit punkte.words = ...' };
                        }
                        if (!/ziel\.x\s*=\s*play\.random_number/.test(cleaned)) {
                            return { ok: false, message: 'Setze ziel.x mit play.random_number(...).' };
                        }
                        if (!/ziel\.y\s*=\s*play\.random_number/.test(cleaned)) {
                            return { ok: false, message: 'Setze ziel.y mit play.random_number(...).' };
                        }
                        return { ok: true, message: 'Gratulation! Du hast ein eigenes kleines Spiel gebaut.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 6 — STERNE FANGEN
        // =========================================================
        {
            id: 6,
            title: 'Sterne fangen',
            shortDescription: 'Bewege den Korb und fange die fallenden Sterne — jeder Treffer gibt einen Punkt.',
            concepts: [
                'Eine Position laufend veraendern (stern.y -= 4)',
                'Wenn etwas den Rand verlaesst: zuruecksetzen',
                'is_touching fuer Berührungs-Bonus'
            ],
            keyHints: [
                { keys: ['←'], label: 'Korb links' },
                { keys: ['→'], label: 'Korb rechts' }
            ],
            tasks: [
                {
                    title: 'Schreibe den Treffer-Block',
                    description: `
                        <p>Der Korb bewegt sich schon mit den Pfeiltasten und der Stern fällt von oben.</p>
                        <p>Vervollständige unten den <code>if</code>-Block, der ausgeführt wird, wenn der <strong>Korb den Stern berührt</strong>:</p>
                        <ul>
                            <li><code>score</code> um 1 erhöhen</li>
                            <li><code>punkte.words</code> auf <code>'Punkte: ' + str(score)</code> setzen</li>
                            <li><code>stern.y</code> wieder auf 200 setzen</li>
                            <li><code>stern.x</code> mit <code>play.random_number(-220, 220)</code> setzen</li>
                        </ul>
                    `,
                    hint: `Im if-Block (8 Leerzeichen Einrückung) brauchst du 4 Zeilen:
1) score += 1
2) punkte.words = 'Punkte: ' + str(score)
3) stern.y = 200    (zurück nach ganz oben)
4) stern.x = play.random_number(-220, 220)    (neue zufällige x-Position)`,
                    mode: 'fill',
                    initialCode:
`score = 0

korb = play.new_box(color='brown', x=0, y=-180, width=90, height=18)
stern = play.new_circle(color='yellow', x=0, y=200, radius=15, border_color='orange', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('left'):
        korb.x -= 6
    if play.key_is_pressed('right'):
        korb.x += 6

    stern.y -= 4

    if stern.y < -220:
        stern.y = 200
        stern.x = play.random_number(-220, 220)

    if korb.is_touching(stern):
        # Schreibe hier deinen Treffer-Block:

`,
                    solution:
`score = 0

korb = play.new_box(color='brown', x=0, y=-180, width=90, height=18)
stern = play.new_circle(color='yellow', x=0, y=200, radius=15, border_color='orange', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score
    if play.key_is_pressed('left'):
        korb.x -= 6
    if play.key_is_pressed('right'):
        korb.x += 6

    stern.y -= 4

    if stern.y < -220:
        stern.y = 200
        stern.x = play.random_number(-220, 220)

    if korb.is_touching(stern):
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        stern.y = 200
        stern.x = play.random_number(-220, 220)
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/korb\.is_touching\(\s*stern\s*\)/.test(studentCode)) {
                            return { ok: false, message: 'Der Block if korb.is_touching(stern): muss da sein.' };
                        }
                        if (!/score\s*\+=\s*1/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt score += 1.' };
                        }
                        if (!/punkte\.words\s*=/.test(studentCode)) {
                            return { ok: false, message: 'Aktualisiere punkte.words mit dem neuen Score.' };
                        }
                        if (!/stern\.y\s*=\s*200/.test(studentCode)) {
                            return { ok: false, message: 'Setze stern.y wieder auf 200.' };
                        }
                        if (!/stern\.x\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze stern.x mit play.random_number(-220, 220).' };
                        }
                        return { ok: true, message: 'Super! Bewege den Korb mit den Pfeiltasten und sammle die Sterne.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 7 — MAULWURF HAUEN
        // =========================================================
        {
            id: 7,
            title: 'Maulwurf hauen',
            shortDescription: 'Klick den Maulwurf, bevor er springt — jeder Treffer zaehlt!',
            concepts: [
                '@sprite.when_clicked reagiert auf Klicks',
                'global score erlaubt Aendern aus Funktion',
                'random_number fuer Zufallsposition'
            ],
            keyHints: [],
            tasks: [
                {
                    title: 'Vervollständige die Klick-Funktion',
                    description: `
                        <p>Es gibt einen <strong>Maulwurf</strong>. Wenn du ihn anklickst, soll:</p>
                        <ul>
                            <li><code>score</code> um 1 steigen</li>
                            <li><code>punkte.words</code> aktualisiert werden</li>
                            <li>der Maulwurf an eine zufällige Position springen (<code>x</code> und <code>y</code>)</li>
                        </ul>
                        <p><strong>Bereich:</strong> <code>x</code> zwischen <code>-200</code> und <code>200</code>, <code>y</code> zwischen <code>-130</code> und <code>130</code>.</p>
                    `,
                    hint: `Drei Zeilen direkt unter "global score" (4 Leerzeichen Einrückung):
1) score += 1
2) punkte.words = 'Punkte: ' + str(score)
3) maulwurf.x = play.random_number(-200, 200)
4) maulwurf.y = play.random_number(-130, 130)
@maulwurf.when_clicked sorgt dafür, dass die Funktion bei jedem Klick auf den Maulwurf läuft.`,
                    mode: 'fill',
                    initialCode:
`score = 0

maulwurf = play.new_circle(color='brown', x=0, y=0, radius=32, border_color='black', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')
hinweis = play.new_text(words='Klick auf den Maulwurf!', x=0, y=-190, font_size=18, color='gray')

@maulwurf.when_clicked
def getroffen():
    global score
    # Schreibe hier:

`,
                    solution:
`score = 0

maulwurf = play.new_circle(color='brown', x=0, y=0, radius=32, border_color='black', border_width=3)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')
hinweis = play.new_text(words='Klick auf den Maulwurf!', x=0, y=-190, font_size=18, color='gray')

@maulwurf.when_clicked
def getroffen():
    global score
    score += 1
    punkte.words = 'Punkte: ' + str(score)
    maulwurf.x = play.random_number(-200, 200)
    maulwurf.y = play.random_number(-130, 130)
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/score\s*\+=\s*1/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt score += 1.' };
                        }
                        if (!/punkte\.words\s*=/.test(studentCode)) {
                            return { ok: false, message: 'Aktualisiere punkte.words.' };
                        }
                        if (!/maulwurf\.x\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze maulwurf.x mit play.random_number(-200, 200).' };
                        }
                        if (!/maulwurf\.y\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze maulwurf.y mit play.random_number(-130, 130).' };
                        }
                        return { ok: true, message: 'Wahnsinn — klick den Maulwurf so oft du kannst!' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 8 — PONG
        // =========================================================
        {
            id: 8,
            title: 'Pong',
            shortDescription: 'Halte den Schlaeger oben — der Ball prallt von Wand und Schlaeger ab.',
            concepts: [
                'Geschwindigkeits-Variablen ball_vx, ball_vy',
                'Vorzeichen umdrehen mit -ball_vy',
                'abs() fuer „immer positiv"'
            ],
            keyHints: [
                { keys: ['↑'], label: 'Schlaeger hoch' },
                { keys: ['↓'], label: 'Schlaeger runter' }
            ],
            tasks: [
                {
                    title: 'Schreibe die Wand-Abprall-Bedingungen',
                    description: `
                        <p>Der Ball bewegt sich schon. Damit er <strong>oben und unten abprallt</strong>, fehlt noch der Code.</p>
                        <p>Schreibe zwei <code>if</code>-Blöcke:</p>
                        <pre>if ball.y > 200:
    ball_vy = -abs(ball_vy)
if ball.y < -200:
    ball_vy = abs(ball_vy)</pre>
                        <p>Damit zeigt <code>ball_vy</code> immer in die richtige Richtung — nach oben oder nach unten.</p>
                    `,
                    hint: `Genau die zwei Blöcke aus dem Beispiel reichen:
1)  if ball.y > 200:                 ← 4 Leerzeichen
2)      ball_vy = -abs(ball_vy)      ← 8 Leerzeichen
3)  if ball.y < -200:                ← 4 Leerzeichen
4)      ball_vy = abs(ball_vy)       ← 8 Leerzeichen
abs(x) macht eine Zahl IMMER positiv. Mit dem Minus davor wird sie immer negativ.`,
                    mode: 'fill',
                    initialCode:
`ball_vx = 5
ball_vy = 3
score = 0

ball = play.new_circle(color='red', x=0, y=0, radius=12)
schlaeger = play.new_box(color='blue', x=-230, y=0, width=14, height=90)
wand = play.new_box(color='light gray', x=240, y=0, width=8, height=420)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global ball_vx, ball_vy, score

    if play.key_is_pressed('up'):
        schlaeger.y += 7
    if play.key_is_pressed('down'):
        schlaeger.y -= 7

    ball.x += ball_vx
    ball.y += ball_vy

    # Wand oben/unten — schreibe hier deine zwei if-Bloecke:



    if ball.is_touching(schlaeger):
        ball_vx = abs(ball_vx)
        score += 1
        punkte.words = 'Punkte: ' + str(score)

    if ball.x > 230:
        ball_vx = -abs(ball_vx)

    if ball.x < -260:
        ball.x = 0
        ball.y = 0
        ball_vx = 5
        score = 0
        punkte.words = 'Punkte: 0'

`,
                    solution:
`ball_vx = 5
ball_vy = 3
score = 0

ball = play.new_circle(color='red', x=0, y=0, radius=12)
schlaeger = play.new_box(color='blue', x=-230, y=0, width=14, height=90)
wand = play.new_box(color='light gray', x=240, y=0, width=8, height=420)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global ball_vx, ball_vy, score

    if play.key_is_pressed('up'):
        schlaeger.y += 7
    if play.key_is_pressed('down'):
        schlaeger.y -= 7

    ball.x += ball_vx
    ball.y += ball_vy

    if ball.y > 200:
        ball_vy = -abs(ball_vy)
    if ball.y < -200:
        ball_vy = abs(ball_vy)

    if ball.is_touching(schlaeger):
        ball_vx = abs(ball_vx)
        score += 1
        punkte.words = 'Punkte: ' + str(score)

    if ball.x > 230:
        ball_vx = -abs(ball_vx)

    if ball.x < -260:
        ball.x = 0
        ball.y = 0
        ball_vx = 5
        score = 0
        punkte.words = 'Punkte: 0'
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/if\s+ball\.y\s*>\s*\d+\s*:/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt if ball.y > 200:' };
                        }
                        if (!/if\s+ball\.y\s*<\s*-\d+\s*:/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt if ball.y < -200:' };
                        }
                        if (!/ball_vy\s*=\s*-abs\(\s*ball_vy\s*\)/.test(studentCode)) {
                            return { ok: false, message: 'Im oberen Block muss ball_vy = -abs(ball_vy) stehen.' };
                        }
                        if (!/ball_vy\s*=\s*abs\(\s*ball_vy\s*\)/.test(studentCode)) {
                            return { ok: false, message: 'Im unteren Block muss ball_vy = abs(ball_vy) stehen.' };
                        }
                        return { ok: true, message: 'Pong laeuft! Halte den Ball mit dem Schlaeger im Spiel.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 9 — SNAKE
        // =========================================================
        {
            id: 9,
            title: 'Schlange & Apfel',
            shortDescription: 'Steuere die Schlange durchs Spielfeld und sammle Aepfel — pro Treffer waechst sie um ein Glied.',
            concepts: [
                'String-Variable als „Richtung"',
                'Mehrere if-Bloecke fuer Bewegung',
                'is_touching + random_number fuer Apfel-Reset'
            ],
            keyHints: [
                { keys: ['↑','↓','←','→'], label: 'Richtung waehlen' }
            ],
            tasks: [
                {
                    title: 'Apfel essen: Punkte + neuer Apfel',
                    description: `
                        <p>Die Schlange bewegt sich schon — die Pfeiltasten wechseln die <code>richtung</code>.</p>
                        <p>Vervollständige den <code>if</code>-Block ganz unten: Wenn der Kopf den Apfel berührt, soll:</p>
                        <ul>
                            <li><code>score</code> um 1 steigen</li>
                            <li><code>punkte.words</code> aktualisiert werden</li>
                            <li><code>apfel.x</code> auf <code>play.random_number(-220, 220)</code></li>
                            <li><code>apfel.y</code> auf <code>play.random_number(-180, 180)</code></li>
                        </ul>
                    `,
                    hint: `Vier Zeilen mit je 8 Leerzeichen Einrückung in den if-Block:
1) score += 1
2) punkte.words = 'Punkte: ' + str(score)
3) apfel.x = play.random_number(-220, 220)
4) apfel.y = play.random_number(-180, 180)`,
                    mode: 'fill',
                    initialCode:
`score = 0
richtung = 'right'
schritt = 0

kopf = play.new_circle(color='dark green', x=0, y=0, radius=12, border_color='black', border_width=2)
seg1 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg2 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg3 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg4 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg5 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg1.hide()
seg2.hide()
seg3.hide()
seg4.hide()
seg5.hide()

apfel = play.new_text(words='🍎', x=150, y=80, font_size=32)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score, richtung, schritt

    if play.key_is_pressed('up'):
        richtung = 'up'
    if play.key_is_pressed('down'):
        richtung = 'down'
    if play.key_is_pressed('left'):
        richtung = 'left'
    if play.key_is_pressed('right'):
        richtung = 'right'

    if richtung == 'up':
        kopf.y += 3
    if richtung == 'down':
        kopf.y -= 3
    if richtung == 'left':
        kopf.x -= 3
    if richtung == 'right':
        kopf.x += 3

    # Koerperteile folgen mit Verzoegerung
    schritt += 1
    if schritt % 6 == 0:
        seg5.x = seg4.x
        seg5.y = seg4.y
        seg4.x = seg3.x
        seg4.y = seg3.y
        seg3.x = seg2.x
        seg3.y = seg2.y
        seg2.x = seg1.x
        seg2.y = seg1.y
        seg1.x = kopf.x
        seg1.y = kopf.y

    # Pro gegessenen Apfel ein Koerperteil mehr
    if score >= 1:
        seg1.show()
    if score >= 2:
        seg2.show()
    if score >= 3:
        seg3.show()
    if score >= 4:
        seg4.show()
    if score >= 5:
        seg5.show()

    if kopf.is_touching(apfel):
        # Schreibe hier deinen Apfel-Block:

`,
                    solution:
`score = 0
richtung = 'right'
schritt = 0

kopf = play.new_circle(color='dark green', x=0, y=0, radius=12, border_color='black', border_width=2)
seg1 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg2 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg3 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg4 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg5 = play.new_circle(color='green', x=0, y=0, radius=10, border_color='dark green', border_width=2)
seg1.hide()
seg2.hide()
seg3.hide()
seg4.hide()
seg5.hide()

apfel = play.new_text(words='🍎', x=150, y=80, font_size=32)
punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')

@play.repeat_forever
def spielschleife():
    global score, richtung, schritt

    if play.key_is_pressed('up'):
        richtung = 'up'
    if play.key_is_pressed('down'):
        richtung = 'down'
    if play.key_is_pressed('left'):
        richtung = 'left'
    if play.key_is_pressed('right'):
        richtung = 'right'

    if richtung == 'up':
        kopf.y += 3
    if richtung == 'down':
        kopf.y -= 3
    if richtung == 'left':
        kopf.x -= 3
    if richtung == 'right':
        kopf.x += 3

    schritt += 1
    if schritt % 6 == 0:
        seg5.x = seg4.x
        seg5.y = seg4.y
        seg4.x = seg3.x
        seg4.y = seg3.y
        seg3.x = seg2.x
        seg3.y = seg2.y
        seg2.x = seg1.x
        seg2.y = seg1.y
        seg1.x = kopf.x
        seg1.y = kopf.y

    if score >= 1:
        seg1.show()
    if score >= 2:
        seg2.show()
    if score >= 3:
        seg3.show()
    if score >= 4:
        seg4.show()
    if score >= 5:
        seg5.show()

    if kopf.is_touching(apfel):
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        apfel.x = play.random_number(-220, 220)
        apfel.y = play.random_number(-180, 180)
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/kopf\.is_touching\(\s*apfel\s*\)/.test(studentCode)) {
                            return { ok: false, message: 'Der Block if kopf.is_touching(apfel): fehlt.' };
                        }
                        if (!/score\s*\+=\s*1/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt score += 1.' };
                        }
                        if (!/punkte\.words\s*=/.test(studentCode)) {
                            return { ok: false, message: 'Aktualisiere punkte.words.' };
                        }
                        if (!/apfel\.x\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze apfel.x mit play.random_number(-220, 220).' };
                        }
                        if (!/apfel\.y\s*=\s*play\.random_number/.test(studentCode)) {
                            return { ok: false, message: 'Setze apfel.y mit play.random_number(-180, 180).' };
                        }
                        return { ok: true, message: 'Schlange jagt Apfel! Sammle so viele wie du kannst.' };
                    }
                }
            ]
        },

        // =========================================================
        // LEVEL 10 — FARBEN-REAKTION
        // =========================================================
        {
            id: 10,
            title: 'Farben-Reaktion',
            shortDescription: 'Klick die Box mit der angesagten Farbe — schnell sein lohnt sich!',
            concepts: [
                'Listen mit Strings',
                'Klick-Funktionen pro Sprite',
                'Vergleich mit ==',
                'Funktionen wiederverwenden'
            ],
            keyHints: [],
            tasks: [
                {
                    title: 'Schreibe die Klick-Funktionen für gruen und blau',
                    description: `
                        <p>Es gibt drei farbige Boxen und einen Hinweis-Text. Beim Klick auf <code>rot</code> ist die Logik schon fertig.</p>
                        <p>Schreibe jetzt analoge Funktionen für <strong>gruen</strong> und <strong>blau</strong>:</p>
                        <pre>@gruen.when_clicked
def klick_gruen():
    global score
    if ziel_farbe == 'gruen':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()</pre>
                        <p>Und genau dasselbe für <code>blau</code> (mit <code>'blau'</code> im Vergleich).</p>
                    `,
                    hint: `Kopier den Block für 'rot' zweimal und ändere drei Stellen:
1) Decorator: @gruen.when_clicked  bzw.  @blau.when_clicked
2) Funktionsname: def klick_gruen():  bzw.  def klick_blau():
3) Im if-Vergleich: ziel_farbe == 'gruen'  bzw.  ziel_farbe == 'blau'
Alle anderen Zeilen bleiben gleich.`,
                    mode: 'fill',
                    initialCode:
`score = 0
ziel_farbe = 'rot'
farben = ['rot', 'gruen', 'blau']

punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')
hinweis = play.new_text(words='Klicke rot', x=0, y=140, font_size=26, color='black')

rot = play.new_box(color='red', x=-150, y=-30, width=80, height=80)
gruen = play.new_box(color='green', x=0, y=-30, width=80, height=80)
blau = play.new_box(color='blue', x=150, y=-30, width=80, height=80)

def naechste_runde():
    global ziel_farbe
    nr = play.random_number(0, 2)
    ziel_farbe = farben[nr]
    hinweis.words = 'Klicke ' + ziel_farbe

@rot.when_clicked
def klick_rot():
    global score
    if ziel_farbe == 'rot':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()

# Schreibe hier deine Funktionen fuer gruen und blau:

`,
                    solution:
`score = 0
ziel_farbe = 'rot'
farben = ['rot', 'gruen', 'blau']

punkte = play.new_text(words='Punkte: 0', x=0, y=190, font_size=22, color='blue')
hinweis = play.new_text(words='Klicke rot', x=0, y=140, font_size=26, color='black')

rot = play.new_box(color='red', x=-150, y=-30, width=80, height=80)
gruen = play.new_box(color='green', x=0, y=-30, width=80, height=80)
blau = play.new_box(color='blue', x=150, y=-30, width=80, height=80)

def naechste_runde():
    global ziel_farbe
    nr = play.random_number(0, 2)
    ziel_farbe = farben[nr]
    hinweis.words = 'Klicke ' + ziel_farbe

@rot.when_clicked
def klick_rot():
    global score
    if ziel_farbe == 'rot':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()

@gruen.when_clicked
def klick_gruen():
    global score
    if ziel_farbe == 'gruen':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()

@blau.when_clicked
def klick_blau():
    global score
    if ziel_farbe == 'blau':
        score += 1
        punkte.words = 'Punkte: ' + str(score)
        naechste_runde()
`,
                    validate: ({ studentCode, error }) => {
                        if (error) return { ok: false, message: error.message || String(error) };
                        if (!/@gruen\.when_clicked/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt @gruen.when_clicked.' };
                        }
                        if (!/@blau\.when_clicked/.test(studentCode)) {
                            return { ok: false, message: 'Es fehlt @blau.when_clicked.' };
                        }
                        if (!/ziel_farbe\s*==\s*['"]gruen['"]/.test(studentCode)) {
                            return { ok: false, message: 'Vergleich ziel_farbe == \'gruen\' fehlt.' };
                        }
                        if (!/ziel_farbe\s*==\s*['"]blau['"]/.test(studentCode)) {
                            return { ok: false, message: 'Vergleich ziel_farbe == \'blau\' fehlt.' };
                        }
                        const naechsteCount = (studentCode.match(/naechste_runde\(\)/g) || []).length;
                        if (naechsteCount < 3) {
                            return { ok: false, message: 'Beide neuen Funktionen muessen am Ende naechste_runde() aufrufen.' };
                        }
                        return { ok: true, message: 'Mega! Klick weiter so schnell wie moeglich die richtige Farbe.' };
                    }
                }
            ]
        }
    ];

    global.LEVELS = LEVELS;
})(window);
