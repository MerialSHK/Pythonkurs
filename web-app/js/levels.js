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
            world: 1,
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
            world: 1,
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
            world: 1,
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
            world: 1,
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
            world: 1,
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
            world: 1,
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
            world: 1,
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
            world: 1,
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
            world: 1,
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
            world: 1,
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
        },

        // =========================================================
        // LEVEL 11 — WUERFEL-SIMULATOR (Welt 2)
        // =========================================================
        {
            id: 11,
            world: 2,
            title: 'Würfel-Simulator',
            shortDescription: 'Klick einen Würfel an und lass den Zufall entscheiden — randint() in Aktion.',
            concepts: [
                '@sprite.when_clicked reagiert auf Mausklick',
                'randint(1, 6) gibt eine Zufallszahl',
                'str(zahl) wandelt eine Zahl in Text fuer den Sprite'
            ],
            keyHints: [],
            tasks: [{
                title: 'Wuerfle 1 bis 6 mit einem Klick',
                description: `
                    <p>Ziel: Eine grosse Box wird zum Wuerfel. Wenn du sie anklickst, soll eine zufaellige Zahl von 1 bis 6 erscheinen.</p>
                    <p>Du brauchst:</p>
                    <ol>
                        <li>Eine Box als <code>wuerfel</code> in der Mitte</li>
                        <li>Einen Text <code>zahl_text</code> mit Startwert <code>'?'</code></li>
                        <li>Eine Klick-Funktion, die <code>randint(1, 6)</code> verwendet und den Text aktualisiert</li>
                    </ol>
                    <p>Klick „Tipp anzeigen" — der erste Tipp gibt dir den Code mit einer kleinen Luecke.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Wuerfel als Box erstellen',
                        codeTemplate: `wuerfel = play.new_box(color='___', x=0, y=0, width=140, height=140, border_color='black', border_width=3)`,
                        blankHint: 'Trag eine helle Farbe ein, z.B. white oder yellow.',
                        explanation: 'Der Wuerfel ist eine Box. Setze die Fuell-Farbe ein.'
                    },
                    {
                        title: 'Text fuer die Wuerfel-Zahl',
                        codeTemplate: `zahl_text = play.new_text(words='___', x=0, y=0, font_size=80, color='black')`,
                        blankHint: 'Ein Fragezeichen, also einfach: ?',
                        explanation: 'Vor dem ersten Wurf zeigt der Wuerfel ein Symbol. Fuege es ein.'
                    },
                    {
                        title: 'Klick-Funktion: Zufallszahl + Text aendern',
                        codeTemplate: `@wuerfel.when_clicked
def wurf():
    zahl = randint(1, ___)
    zahl_text.words = str(zahl)`,
                        blankHint: 'Ein Wuerfel hat 6 Seiten — also: 6.',
                        explanation: 'Bei jedem Klick wird eine Zahl gezogen und im Text angezeigt.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Klick den Wuerfel an, um eine Zufallszahl zu wuerfeln.
info = play.new_text(words='Klick den Wuerfel!', x=0, y=-160, font_size=18, color='gray')

# Schreibe deinen Code hier:
`,
                solution:
`info = play.new_text(words='Klick den Wuerfel!', x=0, y=-160, font_size=18, color='gray')

wuerfel = play.new_box(color='white', x=0, y=0, width=140, height=140, border_color='black', border_width=3)
zahl_text = play.new_text(words='?', x=0, y=0, font_size=80, color='black')

@wuerfel.when_clicked
def wurf():
    zahl = randint(1, 6)
    zahl_text.words = str(zahl)
`,
                validate: ({ studentCode, state, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/wuerfel\s*=\s*play\.new_box/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt eine Box namens wuerfel.' };
                    }
                    if (!/zahl_text\s*=\s*play\.new_text/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt ein Text-Sprite namens zahl_text.' };
                    }
                    if (!/@wuerfel\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @wuerfel.when_clicked vor der Wurf-Funktion.' };
                    }
                    if (!/randint\s*\(\s*1\s*,\s*6\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Wuerfle mit randint(1, 6).' };
                    }
                    if (!/zahl_text\.words\s*=\s*str\(/.test(studentCode)) {
                        return { ok: false, message: 'Setze zahl_text.words = str(zahl) damit die Zahl angezeigt wird.' };
                    }
                    return { ok: true, message: 'Stark! Klick den Wuerfel — bei jedem Klick eine neue Zahl.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 12 — AMPEL-SCHALTUNG (Welt 2)
        // =========================================================
        {
            id: 12,
            world: 2,
            title: 'Ampel-Schaltung',
            shortDescription: 'Klick einen Schalter — die Ampel wechselt durch Rot, Gelb und Gruen.',
            concepts: [
                'Globale Variable speichert die aktuelle Phase',
                'if/elif/else fuer mehrere Faelle',
                'transparency steuert Hell/Dunkel'
            ],
            keyHints: [],
            tasks: [{
                title: 'Programmiere eine Ampel mit drei Phasen',
                description: `
                    <p>Es gibt drei Lampen (rot, gelb, gruen) und einen Schalter. Pro Klick auf den Schalter geht es zur naechsten Phase: <strong>Rot → Gelb → Gruen → wieder Rot</strong>.</p>
                    <p>Du brauchst eine globale Zaehl-Variable <code>phase</code>. Bei jedem Klick erhoehst du sie und aktualisierst die Helligkeit der drei Lampen.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Drei Lampen als Kreise',
                        codeTemplate: `rot = play.new_circle(color='___', x=0, y=120, radius=40)
gelb = play.new_circle(color='yellow', x=0, y=30, radius=40)
gruen = play.new_circle(color='green', x=0, y=-60, radius=40)`,
                        blankHint: 'Die Farbe der oberen Lampe — natuerlich red.',
                        explanation: 'Drei Kreise uebereinander als Ampel. Setze die Farbe der roten Lampe ein.'
                    },
                    {
                        title: 'Schalter-Box und globale Phase',
                        codeTemplate: `phase = 0
schalter = play.new_box(color='gray', x=0, y=-160, width=180, height=40)
schalter_txt = play.new_text(words='Schalter', x=0, y=-160, font_size=18, color='white')`,
                        blankHint: 'Keine Luecke — schau dir den Code an und uebernimm ihn 1:1.',
                        explanation: 'Eine Variable phase startet bei 0. Klick darauf zaehlt sie hoch.'
                    },
                    {
                        title: 'Klick-Handler mit if/elif',
                        codeTemplate: `@schalter.when_clicked
def weiter():
    global phase
    phase = phase + 1
    if phase > ___:
        phase = 0
    rot.transparency = 30
    gelb.transparency = 30
    gruen.transparency = 30
    if phase == 0:
        rot.transparency = 100
    if phase == 1:
        gelb.transparency = 100
    if phase == 2:
        gruen.transparency = 100`,
                        blankHint: 'Wir haben 3 Phasen (0, 1, 2). Wenn phase groesser als 2 ist, zurueck zu 0. Also: 2.',
                        explanation: 'Bei jedem Klick: phase um 1 hoch, alle Lampen dunkel, dann eine hell.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Programmiere eine Ampel mit drei Phasen.
titel = play.new_text(words='Ampel', x=0, y=185, font_size=22, color='black')

# Dein Code:
`,
                solution:
`titel = play.new_text(words='Ampel', x=0, y=185, font_size=22, color='black')

rot = play.new_circle(color='red', x=0, y=120, radius=40)
gelb = play.new_circle(color='yellow', x=0, y=30, radius=40)
gruen = play.new_circle(color='green', x=0, y=-60, radius=40)

phase = 0
schalter = play.new_box(color='gray', x=0, y=-160, width=180, height=40)
schalter_txt = play.new_text(words='Schalter', x=0, y=-160, font_size=18, color='white')

@schalter.when_clicked
def weiter():
    global phase
    phase = phase + 1
    if phase > 2:
        phase = 0
    rot.transparency = 30
    gelb.transparency = 30
    gruen.transparency = 30
    if phase == 0:
        rot.transparency = 100
    if phase == 1:
        gelb.transparency = 100
    if phase == 2:
        gruen.transparency = 100
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/rot\s*=\s*play\.new_circle.*['"]red['"]/s.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der rote Kreis (rot = play.new_circle(color=\'red\', ...)).' };
                    }
                    if (!/gelb\s*=\s*play\.new_circle/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der gelbe Kreis.' };
                    }
                    if (!/gruen\s*=\s*play\.new_circle/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der gruene Kreis.' };
                    }
                    if (!/@schalter\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @schalter.when_clicked.' };
                    }
                    if (!/global\s+phase/.test(studentCode)) {
                        return { ok: false, message: 'In der Klick-Funktion brauchst du global phase, sonst aendert sich die Variable nicht.' };
                    }
                    if (!/transparency\s*=\s*100/.test(studentCode)) {
                        return { ok: false, message: 'Setze die aktive Lampe auf transparency = 100.' };
                    }
                    return { ok: true, message: 'Klasse! Klick den Schalter — die Ampel schaltet weiter.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 13 — REAKTIONSTEST (Welt 2)
        // =========================================================
        {
            id: 13,
            world: 2,
            title: 'Reaktionstest',
            shortDescription: 'Wenn die Box gruen wird — schnell klicken! Wer hat die schnellsten Finger?',
            concepts: [
                'await play.timer(seconds=...) wartet eine bestimmte Zeit',
                'Globale Variable als Zustand (bereit / wartet)',
                'randint fuer zufaellige Wartezeiten'
            ],
            keyHints: [],
            tasks: [{
                title: 'Klicke die Box, sobald sie gruen wird',
                description: `
                    <p>Eine Box ist erst rot. Nach einer zufaelligen Wartezeit (1–3 Sekunden) wird sie gruen — dann schnell klicken!</p>
                    <p>Wir benutzen <code>await play.timer(seconds=...)</code> um zu warten und eine globale Variable <code>bereit</code> um zu speichern, ob ein Klick zaehlen darf.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Box und Hinweis-Text erstellen',
                        codeTemplate: `bereit = False
box = play.new_box(color='___', x=0, y=0, width=200, height=200)
status = play.new_text(words='Warte...', x=0, y=-150, font_size=20, color='gray')`,
                        blankHint: 'Anfangsfarbe der Box — sie wartet noch, also red.',
                        explanation: 'Die Variable bereit speichert, ob der Klick zaehlt. Box startet rot.'
                    },
                    {
                        title: 'Programm-Start: warten und gruen werden',
                        codeTemplate: `@play.when_program_starts
async def start():
    global bereit
    await play.timer(seconds=randint(1, ___))
    box.color = 'green'
    status.words = 'JETZT!'
    bereit = True`,
                        blankHint: 'Maximale Wartezeit. 3 Sekunden ist ein guter Wert.',
                        explanation: 'Beim Start wird zufaellig 1 bis ? Sekunden gewartet, dann wird die Box gruen.'
                    },
                    {
                        title: 'Klick-Reaktion auf die Box',
                        codeTemplate: `@box.when_clicked
def klick():
    global bereit
    if bereit:
        status.words = '___'
        box.color = 'blue'
        bereit = False
    else:
        status.words = 'Zu frueh!'
        box.color = 'orange'`,
                        blankHint: 'Eine kurze Erfolgs-Botschaft, z.B. Super! oder Geschafft!',
                        explanation: 'Klickt der Spieler waehrend gruen → Erfolg. Sonst → zu frueh.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Reaktionstest. Die Box wird nach kurzer Wartezeit gruen — dann klicken!
titel = play.new_text(words='Reaktionstest', x=0, y=180, font_size=22, color='black')

# Dein Code:
`,
                solution:
`titel = play.new_text(words='Reaktionstest', x=0, y=180, font_size=22, color='black')

bereit = False
box = play.new_box(color='red', x=0, y=0, width=200, height=200)
status = play.new_text(words='Warte...', x=0, y=-150, font_size=20, color='gray')

@play.when_program_starts
async def start():
    global bereit
    await play.timer(seconds=randint(1, 3))
    box.color = 'green'
    status.words = 'JETZT!'
    bereit = True

@box.when_clicked
def klick():
    global bereit
    if bereit:
        status.words = 'Super!'
        box.color = 'blue'
        bereit = False
    else:
        status.words = 'Zu frueh!'
        box.color = 'orange'
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/box\s*=\s*play\.new_box/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt eine Box namens box.' };
                    }
                    if (!/bereit\s*=\s*False/.test(studentCode)) {
                        return { ok: false, message: 'Setze ganz oben: bereit = False' };
                    }
                    if (!/await\s+play\.timer/.test(studentCode)) {
                        return { ok: false, message: 'Du brauchst await play.timer(seconds=...) zum Warten.' };
                    }
                    if (!/box\.color\s*=\s*['"]green['"]/.test(studentCode)) {
                        return { ok: false, message: 'Nach dem Warten muss die Box gruen werden: box.color = \'green\'.' };
                    }
                    if (!/@box\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @box.when_clicked.' };
                    }
                    return { ok: true, message: 'Top! Probier es mehrmals — wie schnell bist du?' };
                }
            }]
        },

        // =========================================================
        // LEVEL 14 — MATHE-QUIZ (Welt 2)
        // =========================================================
        {
            id: 14,
            world: 2,
            title: 'Mathe-Quiz',
            shortDescription: 'Drei Antwort-Buttons — klick die richtige Loesung. Punkte fuer jeden Treffer!',
            concepts: [
                'Mehrere Klick-Funktionen, eine pro Button',
                'Globale Variable score zaehlt Treffer',
                'str() um Zahl in Text zu verwandeln'
            ],
            keyHints: [],
            tasks: [{
                title: 'Quiz-Spiel mit drei Antwort-Buttons',
                description: `
                    <p>Aufgabe: <strong>5 + 3 = ?</strong>. Drei Buttons (6, 7, 8) — nur einer ist richtig.</p>
                    <p>Bei richtigem Klick: <code>score += 1</code>. Bei falschem: <code>score -= 1</code>. Der Score wird oben angezeigt.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Score und Aufgaben-Text',
                        codeTemplate: `score = 0
score_anzeige = play.new_text(words='Punkte: 0', x=0, y=180, font_size=20, color='black')
aufgabe = play.new_text(words='5 + 3 = ?', x=0, y=80, font_size=36, color='black')`,
                        blankHint: 'Keine Luecke — uebernimm 1:1.',
                        explanation: 'Globale Variable score und zwei Texte oben am Bildschirm.'
                    },
                    {
                        title: 'Drei Antwort-Buttons',
                        codeTemplate: `b6 = play.new_box(color='light blue', x=-120, y=-50, width=80, height=60)
t6 = play.new_text(words='6', x=-120, y=-50, font_size=30, color='black')
b7 = play.new_box(color='light blue', x=0, y=-50, width=80, height=60)
t7 = play.new_text(words='___', x=0, y=-50, font_size=30, color='black')
b8 = play.new_box(color='light blue', x=120, y=-50, width=80, height=60)
t8 = play.new_text(words='8', x=120, y=-50, font_size=30, color='black')`,
                        blankHint: 'Auf dem mittleren Button steht 7 — also: 7',
                        explanation: 'Drei Buttons mit den Werten 6, 7 und 8.'
                    },
                    {
                        title: 'Klick-Funktionen: richtig/falsch',
                        codeTemplate: `@b8.when_clicked
def richtig():
    global score
    score = score + ___
    score_anzeige.words = 'Punkte: ' + str(score)

@b6.when_clicked
def falsch1():
    global score
    score = score - 1
    score_anzeige.words = 'Punkte: ' + str(score)

@b7.when_clicked
def falsch2():
    global score
    score = score - 1
    score_anzeige.words = 'Punkte: ' + str(score)`,
                        blankHint: 'Pro richtiger Antwort gibt es einen Punkt — also: 1.',
                        explanation: '5+3=8 ist richtig (b8). Bei den anderen geht ein Punkt verloren.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Mathe-Quiz: drei Antworten, eine ist richtig.

# Dein Code:
`,
                solution:
`score = 0
score_anzeige = play.new_text(words='Punkte: 0', x=0, y=180, font_size=20, color='black')
aufgabe = play.new_text(words='5 + 3 = ?', x=0, y=80, font_size=36, color='black')

b6 = play.new_box(color='light blue', x=-120, y=-50, width=80, height=60)
t6 = play.new_text(words='6', x=-120, y=-50, font_size=30, color='black')
b7 = play.new_box(color='light blue', x=0, y=-50, width=80, height=60)
t7 = play.new_text(words='7', x=0, y=-50, font_size=30, color='black')
b8 = play.new_box(color='light blue', x=120, y=-50, width=80, height=60)
t8 = play.new_text(words='8', x=120, y=-50, font_size=30, color='black')

@b8.when_clicked
def richtig():
    global score
    score = score + 1
    score_anzeige.words = 'Punkte: ' + str(score)

@b6.when_clicked
def falsch1():
    global score
    score = score - 1
    score_anzeige.words = 'Punkte: ' + str(score)

@b7.when_clicked
def falsch2():
    global score
    score = score - 1
    score_anzeige.words = 'Punkte: ' + str(score)
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/score\s*=\s*0/.test(studentCode)) {
                        return { ok: false, message: 'Initialisiere score = 0 ganz oben.' };
                    }
                    if (!/b6\s*=/.test(studentCode) || !/b7\s*=/.test(studentCode) || !/b8\s*=/.test(studentCode)) {
                        return { ok: false, message: 'Erstelle drei Buttons: b6, b7 und b8.' };
                    }
                    if (!/@b8\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Die richtige Antwort (b8) braucht einen Klick-Handler.' };
                    }
                    if (!/score\s*=\s*score\s*\+\s*1/.test(studentCode)) {
                        return { ok: false, message: 'Bei richtiger Antwort: score = score + 1.' };
                    }
                    if (!/score\s*=\s*score\s*-\s*1/.test(studentCode)) {
                        return { ok: false, message: 'Bei falscher Antwort: score = score - 1.' };
                    }
                    return { ok: true, message: 'Quiz laeuft! Klick die 8 fuer einen Punkt.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 15 — KLAVIER (Welt 2)
        // =========================================================
        {
            id: 15,
            world: 2,
            title: 'Klavier mit Lampen',
            shortDescription: 'Acht Tasten in einer Schleife erstellen — bei Klick leuchtet eine Lampe auf.',
            concepts: [
                'for i in range(...) erstellt mehrere Sprites',
                'Liste tasten = [] mit append()',
                'Index in Klick-Funktion (Klavier-Taste)'
            ],
            keyHints: [],
            tasks: [{
                title: 'Erstelle 8 Tasten in einer Schleife',
                description: `
                    <p>Wir erstellen ein einfaches Klavier mit 8 Tasten. Statt jede Taste einzeln per Hand zu schreiben, nutzen wir eine <code>for</code>-Schleife.</p>
                    <p>Jede Taste wird in der Liste <code>tasten</code> gespeichert. Beim Klick leuchtet die geklickte Taste kurz farbig auf.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Leere Liste fuer die Tasten',
                        codeTemplate: `tasten = ___`,
                        blankHint: 'Eine leere Liste schreibt man mit zwei eckigen Klammern: []',
                        explanation: 'Wir brauchen eine Liste, in die wir spaeter alle Tasten reinhaengen.'
                    },
                    {
                        title: 'For-Schleife: 8 Tasten erstellen',
                        codeTemplate: `for i in range(___):
    taste_x = -175 + i * 50
    taste = play.new_box(color='white', x=taste_x, y=0, width=42, height=140, border_color='black', border_width=2)
    tasten.append(taste)`,
                        blankHint: 'Anzahl der Tasten — wir wollen 8.',
                        explanation: 'Acht Mal: Position berechnen, Box erstellen, in Liste einhaengen.'
                    },
                    {
                        title: 'Klick-Handler fuer jede Taste',
                        codeTemplate: `@play.repeat_forever
async def schleife():
    for t in tasten:
        if play.mouse.is_clicked and t.is_touching(play.mouse):
            t.color = '___'
            await play.timer(seconds=0.2)
            t.color = 'white'`,
                        blankHint: 'Eine Aufleucht-Farbe, z.B. yellow oder orange.',
                        explanation: 'Bei Klick auf eine Taste: Farbe wechseln, kurz warten, zurueck zu weiss.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Klavier mit 8 Tasten. Klick eine an!
titel = play.new_text(words='Mein Klavier', x=0, y=130, font_size=22, color='black')

# Dein Code:
`,
                solution:
`titel = play.new_text(words='Mein Klavier', x=0, y=130, font_size=22, color='black')

tasten = []

for i in range(8):
    taste_x = -175 + i * 50
    taste = play.new_box(color='white', x=taste_x, y=0, width=42, height=140, border_color='black', border_width=2)
    tasten.append(taste)

@play.repeat_forever
async def schleife():
    for t in tasten:
        if play.mouse.is_clicked and t.is_touching(play.mouse):
            t.color = 'yellow'
            await play.timer(seconds=0.2)
            t.color = 'white'
`,
                validate: ({ studentCode, state, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/tasten\s*=\s*\[\]/.test(studentCode)) {
                        return { ok: false, message: 'Lege oben eine leere Liste an: tasten = []' };
                    }
                    if (!/for\s+i\s+in\s+range\s*\(\s*8\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Du brauchst eine for-Schleife mit range(8) fuer 8 Tasten.' };
                    }
                    if (!/tasten\.append\s*\(/.test(studentCode)) {
                        return { ok: false, message: 'Haenge jede Taste mit tasten.append(taste) an die Liste.' };
                    }
                    const boxes = state.sprites.filter(s => s.constructor.name === 'BoxSprite');
                    if (boxes.length < 8) {
                        return { ok: false, message: 'Es sollten 8 Tasten zu sehen sein. Aktuell: ' + boxes.length };
                    }
                    return { ok: true, message: 'Bravo! Klick die Tasten — sie leuchten auf.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 16 — EGG CATCHER (Welt 2)
        // =========================================================
        {
            id: 16,
            world: 2,
            title: 'Egg Catcher',
            shortDescription: 'Bewege den Korb mit den Pfeiltasten und fange fallende Eier!',
            concepts: [
                'Listen mit dynamischen Sprites (append/remove)',
                'Frame-Counter fuer regelmaessige Ereignisse',
                'for-Schleife durch eine Liste'
            ],
            keyHints: [
                { keys: ['←'], label: 'Links' },
                { keys: ['→'], label: 'Rechts' }
            ],
            tasks: [{
                title: 'Korb bewegen und Eier fangen',
                description: `
                    <p>Der Korb laeuft mit Pfeiltasten links/rechts. Alle 60 Frames erscheint ein neues Ei oben am Bildschirm.</p>
                    <p>Eier werden in der Liste <code>eier</code> gespeichert. Sie fallen — wenn ein Ei den Korb beruehrt, kommt es aus der Liste raus und der Score steigt.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Korb, Score und Eier-Liste',
                        codeTemplate: `score = 0
score_text = play.new_text(words='Eier: 0', x=200, y=185, font_size=18, color='black')
korb = play.new_box(color='brown', x=0, y=-180, width=100, height=20)
eier = []
frame = 0`,
                        blankHint: 'Keine Luecke — nur abtippen.',
                        explanation: 'Der Korb ist eine Box unten. Liste eier startet leer, frame zaehlt mit.'
                    },
                    {
                        title: 'Spielschleife: Korb bewegen, neues Ei spawnen',
                        codeTemplate: `@play.repeat_forever
def schleife():
    global frame, score
    frame = frame + 1
    if play.key_is_pressed('___'):
        korb.x = korb.x - 5
    if play.key_is_pressed('right'):
        korb.x = korb.x + 5
    if frame % 60 == 0:
        ei = play.new_circle(color='white', x=randint(-240, 240), y=200, radius=15, border_color='gray', border_width=2)
        eier.append(ei)`,
                        blankHint: 'Pfeiltaste nach links — der Name ist: left',
                        explanation: 'Pro Frame: Korb bewegen. Alle 60 Frames neues Ei oben.'
                    },
                    {
                        title: 'Eier fallen lassen + Kollision pruefen',
                        codeTemplate: `    for ei in eier:
        ei.y = ei.y - ___
        if ei.is_touching(korb):
            ei.hide()
            eier.remove(ei)
            score = score + 1
            score_text.words = 'Eier: ' + str(score)`,
                        blankHint: 'Die Fall-Geschwindigkeit pro Frame, z.B. 3.',
                        explanation: 'Diese Zeilen kommen am Ende der schleife()-Funktion mit 4 Leerzeichen Einrueckung. Eier fallen und werden im Korb gefangen.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Egg Catcher: Korb bewegen, Eier fangen.

# Dein Code:
`,
                solution:
`score = 0
score_text = play.new_text(words='Eier: 0', x=200, y=185, font_size=18, color='black')
korb = play.new_box(color='brown', x=0, y=-180, width=100, height=20)
eier = []
frame = 0

@play.repeat_forever
def schleife():
    global frame, score
    frame = frame + 1
    if play.key_is_pressed('left'):
        korb.x = korb.x - 5
    if play.key_is_pressed('right'):
        korb.x = korb.x + 5
    if frame % 60 == 0:
        ei = play.new_circle(color='white', x=randint(-240, 240), y=200, radius=15, border_color='gray', border_width=2)
        eier.append(ei)
    for ei in eier:
        ei.y = ei.y - 3
        if ei.is_touching(korb):
            ei.hide()
            eier.remove(ei)
            score = score + 1
            score_text.words = 'Eier: ' + str(score)
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/korb\s*=\s*play\.new_box/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der Korb (Box).' };
                    }
                    if (!/eier\s*=\s*\[\]/.test(studentCode)) {
                        return { ok: false, message: 'Lege eine leere Liste an: eier = []' };
                    }
                    if (!/play\.key_is_pressed\s*\(\s*['"]left['"]\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Pfeiltaste links pruefst du mit play.key_is_pressed(\'left\').' };
                    }
                    if (!/eier\.append/.test(studentCode)) {
                        return { ok: false, message: 'Neue Eier mit eier.append(ei) zur Liste hinzufuegen.' };
                    }
                    if (!/eier\.remove/.test(studentCode)) {
                        return { ok: false, message: 'Bei Treffer: eier.remove(ei) entfernt das Ei.' };
                    }
                    if (!/is_touching\s*\(\s*korb\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe Kollision mit ei.is_touching(korb).' };
                    }
                    return { ok: true, message: 'Genial! Bewege den Korb mit den Pfeiltasten.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 17 — FROGGER-LITE (Welt 2)
        // =========================================================
        {
            id: 17,
            world: 2,
            title: 'Frosch ueberquert die Strasse',
            shortDescription: 'Hilf dem Frosch ueber drei Auto-Spuren — ohne ueberfahren zu werden!',
            concepts: [
                'Hindernisse in einer Liste',
                'Wrap-around: x zuruecksetzen wenn aus dem Bild',
                'Reset bei Kollision'
            ],
            keyHints: [
                { keys: ['↑'], label: 'Vorwaerts' },
                { keys: ['↓'], label: 'Zurueck' }
            ],
            tasks: [{
                title: 'Springe als Frosch ueber drei Auto-Spuren',
                description: `
                    <p>Drei Autos rollen quer ueber den Bildschirm. Bewege den Frosch mit ↑ nach oben — bei Kollision geht's zurueck zum Start.</p>
                    <p>Wenn ein Auto rechts aus dem Bild laeuft, springt es links wieder rein (Wrap-around).</p>
                `,
                progressiveHints: [
                    {
                        title: 'Frosch und Autos in einer Liste',
                        codeTemplate: `frosch = play.new_circle(color='green', x=0, y=-180, radius=18)
auto1 = play.new_box(color='red', x=0, y=-80, width=70, height=30)
auto2 = play.new_box(color='blue', x=-100, y=0, width=70, height=30)
auto3 = play.new_box(color='orange', x=100, y=80, width=70, height=30)
autos = [auto1, auto2, auto3]
status = play.new_text(words='Komm hoch!', x=0, y=185, font_size=18, color='black')`,
                        blankHint: 'Keine Luecke — abtippen.',
                        explanation: 'Frosch unten, drei Autos auf drei Spuren, Liste autos.'
                    },
                    {
                        title: 'Frosch-Steuerung mit Pfeiltasten',
                        codeTemplate: `@play.repeat_forever
def schleife():
    if play.key_is_pressed('___'):
        frosch.y = frosch.y + 3
    if play.key_is_pressed('down'):
        frosch.y = frosch.y - 3
    if frosch.y > 200:
        status.words = 'Geschafft!'
        frosch.y = -180`,
                        blankHint: 'Pfeiltaste nach oben heisst: up',
                        explanation: 'Pfeil nach oben: Frosch geht hoch. Wenn er ganz oben ist: Erfolg, zurueck zum Start.'
                    },
                    {
                        title: 'Autos bewegen + Wrap + Kollision',
                        codeTemplate: `    for auto in autos:
        auto.x = auto.x + 4
        if auto.x > 270:
            auto.x = ___
        if auto.is_touching(frosch):
            frosch.y = -180
            status.words = 'Aua! Nochmal!'`,
                        blankHint: 'Wenn das Auto rechts raus ist, soll es links wieder rein. Linke Bildschirmkante: -270.',
                        explanation: 'Diese Zeilen kommen am Ende der schleife() mit 4 Leerzeichen Einrueckung.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Frosch ueber die Strasse.

# Dein Code:
`,
                solution:
`frosch = play.new_circle(color='green', x=0, y=-180, radius=18)
auto1 = play.new_box(color='red', x=0, y=-80, width=70, height=30)
auto2 = play.new_box(color='blue', x=-100, y=0, width=70, height=30)
auto3 = play.new_box(color='orange', x=100, y=80, width=70, height=30)
autos = [auto1, auto2, auto3]
status = play.new_text(words='Komm hoch!', x=0, y=185, font_size=18, color='black')

@play.repeat_forever
def schleife():
    if play.key_is_pressed('up'):
        frosch.y = frosch.y + 3
    if play.key_is_pressed('down'):
        frosch.y = frosch.y - 3
    if frosch.y > 200:
        status.words = 'Geschafft!'
        frosch.y = -180
    for auto in autos:
        auto.x = auto.x + 4
        if auto.x > 270:
            auto.x = -270
        if auto.is_touching(frosch):
            frosch.y = -180
            status.words = 'Aua! Nochmal!'
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/frosch\s*=\s*play\.new_circle/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt frosch als Kreis.' };
                    }
                    if (!/autos\s*=\s*\[/.test(studentCode)) {
                        return { ok: false, message: 'Lege eine Liste autos = [auto1, auto2, auto3] an.' };
                    }
                    if (!/play\.key_is_pressed\s*\(\s*['"]up['"]\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe play.key_is_pressed(\'up\') um vorzugehen.' };
                    }
                    if (!/for\s+auto\s+in\s+autos/.test(studentCode)) {
                        return { ok: false, message: 'Du brauchst for auto in autos: um alle Autos zu bewegen.' };
                    }
                    if (!/is_touching\s*\(\s*frosch\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe auto.is_touching(frosch) fuer die Kollision.' };
                    }
                    return { ok: true, message: 'Hopp hopp! Versuch es bis ganz nach oben.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 18 — BLACKJACK (Welt 2)
        // =========================================================
        {
            id: 18,
            world: 2,
            title: 'Blackjack',
            shortDescription: 'Karten ziehen und nicht ueber 21 kommen — kannst du den Computer schlagen?',
            concepts: [
                'int(text.words) wandelt Text in Zahl',
                'Mehrere Klick-Handler fuer Buttons',
                'for-Schleife mit range fuer Computer-Zuege'
            ],
            keyHints: [],
            tasks: [{
                title: 'Programmiere Blackjack mit zwei Buttons',
                description: `
                    <p>Zwei Buttons: <strong>Karte ziehen</strong> und <strong>Computer fordern</strong>.</p>
                    <p>Pro Klick auf „Karte ziehen": Zufallszahl 1–11 wird zu deinem Score addiert. Bei mehr als 21 hast du verloren. „Computer fordern" laesst den Computer so oft ziehen, wie du gezogen hast.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Score-Variablen und Karte-Anzeige',
                        codeTemplate: `dein_score = 0
comp_score = 0
zuege = 0
score_txt = play.new_text(words='Du: 0  /  Comp: 0', x=0, y=180, font_size=22, color='black')
karte = play.new_text(words='?', x=0, y=20, font_size=80, color='blue')
status = play.new_text(words='Klick einen Button', x=0, y=-180, font_size=18, color='gray')`,
                        blankHint: 'Keine Luecke — abtippen.',
                        explanation: 'Globale Scores, Zaehler fuer Spieler-Zuege, Karte als grosser Text.'
                    },
                    {
                        title: 'Buttons unten erstellen',
                        codeTemplate: `b_zieh = play.new_box(color='green', x=-110, y=-110, width=180, height=50)
t_zieh = play.new_text(words='Karte ziehen', x=-110, y=-110, font_size=18, color='white')
b_comp = play.new_box(color='red', x=110, y=-110, width=180, height=50)
t_comp = play.new_text(words='Computer fordern', x=110, y=-110, font_size=16, color='white')`,
                        blankHint: 'Keine Luecke — abtippen.',
                        explanation: 'Zwei farbige Buttons mit Beschriftung.'
                    },
                    {
                        title: 'Klick: Karte ziehen',
                        codeTemplate: `@b_zieh.when_clicked
def ziehen():
    global dein_score, zuege
    zahl = randint(1, ___)
    karte.words = str(zahl)
    dein_score = dein_score + zahl
    zuege = zuege + 1
    score_txt.words = 'Du: ' + str(dein_score) + '  /  Comp: ' + str(comp_score)
    if dein_score > 21:
        status.words = 'Du hast verloren! (ueber 21)'`,
                        blankHint: 'Karten gehen bis 11 (As). Trag 11 ein.',
                        explanation: 'Bei jedem Klick: Zufalls-Karte ziehen, Score erhoehen, Bust pruefen.'
                    },
                    {
                        title: 'Klick: Computer fordern',
                        codeTemplate: `@b_comp.when_clicked
def computer_zug():
    global comp_score
    for i in range(zuege):
        zahl = randint(1, 11)
        comp_score = comp_score + zahl
    score_txt.words = 'Du: ' + str(dein_score) + '  /  Comp: ' + str(comp_score)
    if comp_score > 21 or comp_score < dein_score:
        status.words = 'Du hast gewonnen!'
    else:
        status.words = 'Computer gewinnt!'`,
                        blankHint: 'Keine Luecke — abtippen.',
                        explanation: 'Computer zieht so oft wie der Spieler. Vergleich entscheidet.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Blackjack: Karten ziehen, nicht ueber 21!

# Dein Code:
`,
                solution:
`dein_score = 0
comp_score = 0
zuege = 0
score_txt = play.new_text(words='Du: 0  /  Comp: 0', x=0, y=180, font_size=22, color='black')
karte = play.new_text(words='?', x=0, y=20, font_size=80, color='blue')
status = play.new_text(words='Klick einen Button', x=0, y=-180, font_size=18, color='gray')

b_zieh = play.new_box(color='green', x=-110, y=-110, width=180, height=50)
t_zieh = play.new_text(words='Karte ziehen', x=-110, y=-110, font_size=18, color='white')
b_comp = play.new_box(color='red', x=110, y=-110, width=180, height=50)
t_comp = play.new_text(words='Computer fordern', x=110, y=-110, font_size=16, color='white')

@b_zieh.when_clicked
def ziehen():
    global dein_score, zuege
    zahl = randint(1, 11)
    karte.words = str(zahl)
    dein_score = dein_score + zahl
    zuege = zuege + 1
    score_txt.words = 'Du: ' + str(dein_score) + '  /  Comp: ' + str(comp_score)
    if dein_score > 21:
        status.words = 'Du hast verloren! (ueber 21)'

@b_comp.when_clicked
def computer_zug():
    global comp_score
    for i in range(zuege):
        zahl = randint(1, 11)
        comp_score = comp_score + zahl
    score_txt.words = 'Du: ' + str(dein_score) + '  /  Comp: ' + str(comp_score)
    if comp_score > 21 or comp_score < dein_score:
        status.words = 'Du hast gewonnen!'
    else:
        status.words = 'Computer gewinnt!'
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/dein_score\s*=\s*0/.test(studentCode)) {
                        return { ok: false, message: 'Initialisiere dein_score = 0.' };
                    }
                    if (!/@b_zieh\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @b_zieh.when_clicked.' };
                    }
                    if (!/@b_comp\.when_clicked/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt @b_comp.when_clicked.' };
                    }
                    if (!/randint\s*\(\s*1\s*,\s*11\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Karten ziehen mit randint(1, 11).' };
                    }
                    if (!/dein_score\s*>\s*21/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe Bust mit if dein_score > 21:' };
                    }
                    if (!/for\s+i\s+in\s+range\s*\(\s*zuege\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Computer zieht in einer for-Schleife mit range(zuege).' };
                    }
                    return { ok: true, message: 'Karten her! Spiel ein paar Runden.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 19 — ARKANOID (Welt 2)
        // =========================================================
        {
            id: 19,
            world: 2,
            title: 'Arkanoid',
            shortDescription: 'Klassischer Block-Brecher: Ball, Paddle und ein Block-Raster mit verschachtelten Schleifen.',
            concepts: [
                'Verschachtelte for-Schleifen fuer ein Block-Raster',
                'Liste blocks dynamisch durchlaufen',
                'Ball-Bewegung mit ball_vx und ball_vy'
            ],
            keyHints: [
                { keys: ['←'], label: 'Paddle links' },
                { keys: ['→'], label: 'Paddle rechts' }
            ],
            tasks: [{
                title: 'Zerstoere alle Bloecke',
                description: `
                    <p>Ein klassisches Arkanoid: Paddle unten, Ball faellt, oben zwei Reihen mit je 5 Bloecken. Trifft der Ball einen Block, fliegt der Block raus aus der Liste.</p>
                    <p>Verschachtelte Schleifen erstellen das Block-Raster, eine Liste haelt alle Bloecke.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Paddle, Ball und Geschwindigkeit',
                        codeTemplate: `paddle = play.new_box(color='blue', x=0, y=-180, width=120, height=18)
ball = play.new_circle(color='red', x=0, y=0, radius=12)
ball_vx = 4
ball_vy = -4
status = play.new_text(words='Zerstoere alle Bloecke!', x=0, y=185, font_size=16, color='black')`,
                        blankHint: 'Keine Luecke — abtippen.',
                        explanation: 'Paddle und Ball erstellen, Ball-Geschwindigkeiten setzen.'
                    },
                    {
                        title: 'Block-Raster mit verschachtelten Schleifen',
                        codeTemplate: `blocks = []
for reihe in range(___):
    for spalte in range(5):
        bx = -200 + spalte * 100
        by = 140 - reihe * 35
        block = play.new_box(color='orange', x=bx, y=by, width=90, height=25, border_color='dark gray', border_width=1)
        blocks.append(block)`,
                        blankHint: 'Wir wollen 2 Reihen — also: 2',
                        explanation: 'Aeussere Schleife = Reihen, innere = Spalten. 2 mal 5 = 10 Bloecke.'
                    },
                    {
                        title: 'Spielschleife: Paddle, Ball, Wand-Bounce',
                        codeTemplate: `@play.repeat_forever
def schleife():
    global ball_vx, ball_vy
    if play.key_is_pressed('left'):
        paddle.x = paddle.x - 6
    if play.key_is_pressed('right'):
        paddle.x = paddle.x + 6
    ball.x = ball.x + ball_vx
    ball.y = ball.y + ball_vy
    if ball.x > 250 or ball.x < -250:
        ball_vx = -1 * ball_vx
    if ball.y > 200:
        ball_vy = -1 * ball_vy
    if ball.is_touching(paddle):
        ball_vy = abs(ball_vy)`,
                        blankHint: 'Keine Luecke — abtippen.',
                        explanation: 'Ball bewegt sich, prallt von Wand und Paddle ab.'
                    },
                    {
                        title: 'Block-Kollisionen + Win/Lose',
                        codeTemplate: `    for b in blocks:
        if b.is_touching(ball):
            b.hide()
            blocks.remove(b)
            ball_vy = -1 * ball_vy
    if ball.y < -210:
        status.words = 'Verloren!'
    if len(blocks) == ___:
        status.words = 'GEWONNEN!'`,
                        blankHint: 'Wenn die Liste leer ist, hat der Spieler gewonnen. Eine leere Liste hat Laenge: 0',
                        explanation: 'Diese Zeilen am Ende der schleife() (4 Leerzeichen Einrueckung). Block-Treffer entfernt Block, leere Liste = Win.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Arkanoid: Paddle, Ball, Bloecke.

# Dein Code:
`,
                solution:
`paddle = play.new_box(color='blue', x=0, y=-180, width=120, height=18)
ball = play.new_circle(color='red', x=0, y=0, radius=12)
ball_vx = 4
ball_vy = -4
status = play.new_text(words='Zerstoere alle Bloecke!', x=0, y=185, font_size=16, color='black')

blocks = []
for reihe in range(2):
    for spalte in range(5):
        bx = -200 + spalte * 100
        by = 140 - reihe * 35
        block = play.new_box(color='orange', x=bx, y=by, width=90, height=25, border_color='dark gray', border_width=1)
        blocks.append(block)

@play.repeat_forever
def schleife():
    global ball_vx, ball_vy
    if play.key_is_pressed('left'):
        paddle.x = paddle.x - 6
    if play.key_is_pressed('right'):
        paddle.x = paddle.x + 6
    ball.x = ball.x + ball_vx
    ball.y = ball.y + ball_vy
    if ball.x > 250 or ball.x < -250:
        ball_vx = -1 * ball_vx
    if ball.y > 200:
        ball_vy = -1 * ball_vy
    if ball.is_touching(paddle):
        ball_vy = abs(ball_vy)
    for b in blocks:
        if b.is_touching(ball):
            b.hide()
            blocks.remove(b)
            ball_vy = -1 * ball_vy
    if ball.y < -210:
        status.words = 'Verloren!'
    if len(blocks) == 0:
        status.words = 'GEWONNEN!'
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/paddle\s*=\s*play\.new_box/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt das paddle (Box).' };
                    }
                    if (!/ball\s*=\s*play\.new_circle/.test(studentCode)) {
                        return { ok: false, message: 'Es fehlt der ball (Kreis).' };
                    }
                    if (!/blocks\s*=\s*\[\]/.test(studentCode)) {
                        return { ok: false, message: 'Lege blocks = [] an.' };
                    }
                    if (!/for\s+\w+\s+in\s+range\s*\(\s*2\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Verwende eine for-Schleife mit range(2) fuer die Reihen.' };
                    }
                    if (!/blocks\.append/.test(studentCode)) {
                        return { ok: false, message: 'Haenge jeden Block mit blocks.append(block) an.' };
                    }
                    if (!/blocks\.remove/.test(studentCode)) {
                        return { ok: false, message: 'Bei Treffer: blocks.remove(b) entfernt den Block.' };
                    }
                    if (!/len\s*\(\s*blocks\s*\)\s*==\s*0/.test(studentCode)) {
                        return { ok: false, message: 'Pruefe mit if len(blocks) == 0: ob alles zerstoert ist.' };
                    }
                    return { ok: true, message: 'Klassiker geschafft! Versuch alle Bloecke zu treffen.' };
                }
            }]
        },

        // =========================================================
        // LEVEL 20 — MEMORY (Welt 2)
        // =========================================================
        {
            id: 20,
            world: 2,
            title: 'Memory-Spiel',
            shortDescription: 'Finde die Farbpaare — klick zwei Karten an, gleiche Farben bleiben offen.',
            concepts: [
                'Liste mit Index-Zugriff',
                'Globale Variablen fuer den Spielzustand',
                'await play.timer(seconds=...) zum kurzen Pausieren'
            ],
            keyHints: [],
            tasks: [{
                title: 'Memory mit drei Farbpaaren',
                description: `
                    <p>Sechs Karten verdecken drei Farbpaare. Klick eine Karte → ihre Farbe erscheint. Zweite Karte mit gleicher Farbe → bleiben sichtbar. Sonst → kurz warten und wieder verdecken.</p>
                    <p>Zwei globale Variablen merken sich die erste geklickte Karte und ihre Farbe.</p>
                `,
                progressiveHints: [
                    {
                        title: 'Sechs Karten und ihre Farben in Listen',
                        codeTemplate: `karten = []
farben = ['red', 'red', 'blue', 'blue', 'green', 'green']

for i in range(___):
    karte = play.new_box(color='gray', x=-200 + i*80, y=0, width=70, height=100, border_color='black', border_width=2)
    karten.append(karte)`,
                        blankHint: 'Sechs Karten — also: 6',
                        explanation: 'Liste karten haelt die Box-Sprites, Liste farben die zugehoerigen Farben.'
                    },
                    {
                        title: 'Zustands-Variablen',
                        codeTemplate: `erste_idx = -1
zweite_idx = -1
status = play.new_text(words='Finde alle Paare!', x=0, y=160, font_size=20, color='black')`,
                        blankHint: 'Keine Luecke — abtippen.',
                        explanation: 'erste_idx merkt sich, welche Karte zuerst geklickt wurde (-1 = keine).'
                    },
                    {
                        title: 'Klick-Behandlung in der Spielschleife',
                        codeTemplate: `@play.repeat_forever
async def schleife():
    global erste_idx, zweite_idx
    for i in range(6):
        if play.mouse.is_clicked and karten[i].is_touching(play.mouse) and karten[i].color == 'gray':
            karten[i].color = farben[i]
            if erste_idx == -1:
                erste_idx = i
            else:
                zweite_idx = i
                await play.timer(seconds=___)
                if farben[erste_idx] != farben[zweite_idx]:
                    karten[erste_idx].color = 'gray'
                    karten[zweite_idx].color = 'gray'
                erste_idx = -1
                zweite_idx = -1`,
                        blankHint: 'Wartezeit nach dem zweiten Klick. 0.6 oder 0.8 Sekunden ist gut.',
                        explanation: 'Pro Frame: Pruefe alle 6 Karten. Erster Klick → merken. Zweiter → vergleichen, ggf. zurueck verdecken.'
                    }
                ],
                mode: 'fill',
                initialCode:
`# Memory mit 3 Farbpaaren.

# Dein Code:
`,
                solution:
`karten = []
farben = ['red', 'red', 'blue', 'blue', 'green', 'green']

for i in range(6):
    karte = play.new_box(color='gray', x=-200 + i*80, y=0, width=70, height=100, border_color='black', border_width=2)
    karten.append(karte)

erste_idx = -1
zweite_idx = -1
status = play.new_text(words='Finde alle Paare!', x=0, y=160, font_size=20, color='black')

@play.repeat_forever
async def schleife():
    global erste_idx, zweite_idx
    for i in range(6):
        if play.mouse.is_clicked and karten[i].is_touching(play.mouse) and karten[i].color == 'gray':
            karten[i].color = farben[i]
            if erste_idx == -1:
                erste_idx = i
            else:
                zweite_idx = i
                await play.timer(seconds=0.7)
                if farben[erste_idx] != farben[zweite_idx]:
                    karten[erste_idx].color = 'gray'
                    karten[zweite_idx].color = 'gray'
                erste_idx = -1
                zweite_idx = -1
`,
                validate: ({ studentCode, error }) => {
                    if (error) return { ok: false, message: error.message || String(error) };
                    if (!/karten\s*=\s*\[\]/.test(studentCode)) {
                        return { ok: false, message: 'Lege karten = [] an.' };
                    }
                    if (!/farben\s*=\s*\[/.test(studentCode)) {
                        return { ok: false, message: 'Lege eine Liste farben an mit den Farbpaaren.' };
                    }
                    if (!/for\s+i\s+in\s+range\s*\(\s*6\s*\)/.test(studentCode)) {
                        return { ok: false, message: 'Verwende for i in range(6) fuer 6 Karten.' };
                    }
                    if (!/erste_idx/.test(studentCode)) {
                        return { ok: false, message: 'Lege eine Variable erste_idx an, um die erste Karte zu merken.' };
                    }
                    if (!/await\s+play\.timer/.test(studentCode)) {
                        return { ok: false, message: 'Nach zwei Klicks brauchst du await play.timer(seconds=...) zum Warten.' };
                    }
                    if (!/karten\[\w+\]\.color/.test(studentCode)) {
                        return { ok: false, message: 'Greife mit karten[i].color auf einzelne Karten zu.' };
                    }
                    return { ok: true, message: 'Memory laeuft! Finde die Paare.' };
                }
            }]
        }
    ];

    global.LEVELS = LEVELS;
})(window);
