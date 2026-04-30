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
                    hint: 'Du musst exakt jedes Zeichen abtippen. Auch die Leerzeichen und das Komma am Ende einer Zeile sind wichtig.',
                    mode: 'type',
                    initialCode: '',
                    targetCode: `titel = play.new_text(words='Hallo Welt', x=0, y=120, font_size=42, color='blue')\n\nuntertitel = play.new_text(words='Mein erstes Programm', x=0, y=60, font_size=20, color='gray')`,
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
                    hint: 'Schreibe alle drei Zeilen unter den Titel. Du brauchst genau einen Text mit dem Namen spieler, einen Kreis namens kreis und eine Box namens box.',
                    mode: 'fill',
                    initialCode:
`titel = play.new_text(words='Mein Spielfeld', x=0, y=180, font_size=28, color='blue')

# Schreibe deinen Code hier:
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
                    hint: 'Du brauchst vier if-Bedingungen. Vergiss die 4 Leerzeichen am Anfang der Bewegungs-Zeile nicht (Einrückung).',
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
                    hint: 'Du brauchst die beiden Blöcke unten im repeat_forever (mit der gleichen Einrückung wie das Beispiel). Vergiss str(score) nicht.',
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
                    hint: 'Im if-Block: 1) score erhöhen, 2) punkte.words = \'Punkte: \' + str(score), 3) ziel.x und ziel.y per random_number setzen.',
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
        }
    ];

    global.LEVELS = LEVELS;
})(window);
